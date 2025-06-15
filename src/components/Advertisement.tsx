
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getActiveAds, trackAdImpression, trackAdClick } from '@/services/advertisementService';
import { DatabaseAdvertisement } from '@/types/database';

interface AdvertisementProps {
  placement: 'home' | 'results' | 'sidebar';
  className?: string;
}

const Advertisement = ({ placement, className = '' }: AdvertisementProps) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [imageTimeouts, setImageTimeouts] = useState<Set<string>>(new Set());
  const trackedImpressions = useRef<Set<string>>(new Set());

  const { data: ads = [], isLoading, error } = useQuery({
    queryKey: ['advertisements', placement],
    queryFn: () => getActiveAds(placement),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Debounced impression tracking - only track once per ad
  useEffect(() => {
    if (ads.length > 0) {
      const impressionsToTrack = ads.filter(ad => !trackedImpressions.current.has(ad.id));
      
      if (impressionsToTrack.length > 0) {
        impressionsToTrack.forEach(ad => {
          trackedImpressions.current.add(ad.id);
          // Track impression without blocking render
          trackAdImpression(ad.id).catch(err => 
            console.warn('Failed to track impression for ad:', ad.id, err)
          );
        });
      }
    }
  }, [ads]);

  const handleAdClick = async (ad: DatabaseAdvertisement) => {
    try {
      await trackAdClick(ad.id);
      window.open(ad.target_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.warn('Failed to track click for ad:', ad.id, error);
      // Still open the link even if tracking fails
      window.open(ad.target_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleImageError = (adId: string) => {
    setImageErrors(prev => new Set(prev).add(adId));
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(adId);
      return newSet;
    });
    setImageTimeouts(prev => {
      const newSet = new Set(prev);
      newSet.delete(adId);
      return newSet;
    });
  };

  const handleImageLoad = (adId: string) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(adId);
      return newSet;
    });
    setImageTimeouts(prev => {
      const newSet = new Set(prev);
      newSet.delete(adId);
      return newSet;
    });
  };

  const handleImageLoadStart = (adId: string) => {
    setLoadingImages(prev => new Set(prev).add(adId));
    
    // Set a timeout to handle hung image loads
    setTimeout(() => {
      setImageTimeouts(prev => {
        if (prev.has(adId)) return prev;
        const newSet = new Set(prev);
        newSet.add(adId);
        return newSet;
      });
      
      // If still loading after timeout, treat as error
      setTimeout(() => {
        setLoadingImages(current => {
          if (current.has(adId)) {
            handleImageError(adId);
          }
          return current;
        });
      }, 100);
    }, 8000); // 8 second timeout
  };

  const isValidImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      // Check if it looks like an image URL
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasImageExtension = imageExtensions.some(ext => 
        urlObj.pathname.toLowerCase().includes(ext)
      );
      
      // Also allow common image hosting domains
      const imageHosts = ['imgur.com', 'cloudinary.com', 'unsplash.com', 'pixabay.com'];
      const isImageHost = imageHosts.some(host => urlObj.hostname.includes(host));
      
      return hasImageExtension || isImageHost || urlObj.pathname.includes('/image') || urlObj.searchParams.has('format');
    } catch {
      return false;
    }
  };

  if (error) {
    console.error('Error loading advertisements:', error);
    return null;
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardContent className="p-0">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {ads.map((ad) => {
        const hasImageError = imageErrors.has(ad.id);
        const isImageLoading = loadingImages.has(ad.id);
        const hasTimedOut = imageTimeouts.has(ad.id);
        const showFallback = hasImageError || hasTimedOut || !isValidImageUrl(ad.image_url);

        return (
          <Card key={ad.id} className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
            <CardContent className="p-0">
              <div onClick={() => handleAdClick(ad)} className="block">
                <div className="relative">
                  {isImageLoading && !showFallback && (
                    <Skeleton className="w-full h-48 absolute inset-0 z-10" />
                  )}
                  {showFallback ? (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="text-sm">Image unavailable</div>
                        <div className="text-xs mt-1">{ad.title}</div>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={ad.image_url} 
                      alt={ad.title}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                      onError={() => handleImageError(ad.id)}
                      onLoad={() => handleImageLoad(ad.id)}
                      onLoadStart={() => handleImageLoadStart(ad.id)}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">{ad.title}</h4>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                    {ad.cta_text}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Advertisement;
