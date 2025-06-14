
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { getActiveAds, trackAdImpression, trackAdClick } from '@/services/advertisementService';
import { DatabaseAdvertisement } from '@/types/database';

interface AdvertisementProps {
  placement: 'home' | 'results' | 'sidebar';
  className?: string;
}

const Advertisement = ({ placement, className = '' }: AdvertisementProps) => {
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['advertisements', placement],
    queryFn: () => getActiveAds(placement),
  });

  // Track impressions when ads are loaded and visible
  useEffect(() => {
    if (ads.length > 0) {
      ads.forEach(ad => {
        trackAdImpression(ad.id);
      });
    }
  }, [ads]);

  const handleAdClick = async (ad: DatabaseAdvertisement) => {
    await trackAdClick(ad.id);
    window.open(ad.target_url, '_blank');
  };

  if (isLoading || ads.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {ads.map((ad) => (
        <Card key={ad.id} className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
          <CardContent className="p-0">
            <div onClick={() => handleAdClick(ad)} className="block">
              <img 
                src={ad.image_url} 
                alt={ad.title}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-2">{ad.title}</h4>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                  {ad.cta_text}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Advertisement;
