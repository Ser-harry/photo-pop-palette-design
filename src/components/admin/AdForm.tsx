
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatabaseAdvertisement } from "@/types/database";

interface AdFormProps {
  ad: DatabaseAdvertisement | null;
  onSave: (data: Partial<DatabaseAdvertisement>) => void;
  onCancel: () => void;
}

const AdForm = ({ ad, onSave, onCancel }: AdFormProps) => {
  const [formData, setFormData] = useState({
    title: ad?.title || "",
    image_url: ad?.image_url || "",
    target_url: ad?.target_url || "",
    cta_text: ad?.cta_text || "",
    placement: ad?.placement || "home",
    start_date: ad?.start_date || "",
    end_date: ad?.end_date || "",
    is_active: ad?.is_active || true
  });

  const [imagePreviewError, setImagePreviewError] = useState(false);

  const isValidImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasImageExtension = imageExtensions.some(ext => 
        urlObj.pathname.toLowerCase().endsWith(ext)
      );
      
      const imageHosts = ['imgur.com', 'cloudinary.com', 'unsplash.com', 'pixabay.com', 'images.unsplash.com'];
      const isImageHost = imageHosts.some(host => urlObj.hostname.includes(host));
      
      const hasImagePath = urlObj.pathname.includes('/image') || 
                          urlObj.pathname.includes('/img') ||
                          urlObj.searchParams.has('format');
      
      return hasImageExtension || isImageHost || hasImagePath;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data being submitted:', formData);
    
    // Basic validation
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!formData.image_url.trim()) {
      alert('Please enter an image URL');
      return;
    }
    if (!isValidImageUrl(formData.image_url)) {
      alert('Please provide a valid image URL (must end with .jpg, .png, .gif, .webp, .svg or be from a recognized image hosting service)');
      return;
    }
    if (!formData.target_url.trim()) {
      alert('Please enter a target URL');
      return;
    }
    
    // Validate target URL
    try {
      new URL(formData.target_url);
    } catch {
      alert('Please enter a valid target URL');
      return;
    }
    
    if (!formData.cta_text.trim()) {
      alert('Please enter CTA text');
      return;
    }
    if (!formData.start_date) {
      alert('Please select a start date');
      return;
    }
    if (!formData.end_date) {
      alert('Please select an end date');
      return;
    }
    
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      alert('Start date cannot be after end date');
      return;
    }
    
    onSave(formData);
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({...formData, image_url: url});
    setImagePreviewError(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Ad Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="cta_text">CTA Text</Label>
          <Input
            id="cta_text"
            value={formData.cta_text}
            onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => handleImageUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          required
        />
        {formData.image_url && (
          <div className="mt-2">
            {imagePreviewError || !isValidImageUrl(formData.image_url) ? (
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ This URL might not be a valid image URL. Please ensure it ends with .jpg, .png, .gif, .webp, .svg or is from a recognized image hosting service.
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="max-w-xs h-24 object-cover rounded border"
                  onError={() => setImagePreviewError(true)}
                  onLoad={() => setImagePreviewError(false)}
                />
                <span className="text-xs text-green-600 mt-1 block">✓ Image preview loaded successfully</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="target_url">Target URL</Label>
        <Input
          id="target_url"
          value={formData.target_url}
          onChange={(e) => setFormData({...formData, target_url: e.target.value})}
          placeholder="https://example.com"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="placement">Placement</Label>
        <select
          id="placement"
          className="w-full p-2 border rounded-md"
          value={formData.placement}
          onChange={(e) => setFormData({...formData, placement: e.target.value})}
        >
          <option value="home">Home Page</option>
          <option value="results">Results Page</option>
          <option value="sidebar">Sidebar</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {ad ? "Update" : "Create"} Advertisement
        </Button>
      </div>
    </form>
  );
};

export default AdForm;
