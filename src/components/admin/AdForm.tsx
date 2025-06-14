
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
          placeholder="https://example.com/image.jpg"
          required
        />
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
