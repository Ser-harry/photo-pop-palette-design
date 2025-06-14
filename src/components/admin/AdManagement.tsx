
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  ctaText: string;
  placement: "home" | "results" | "sidebar";
  startDate: string;
  endDate: string;
  isActive: boolean;
  clicks: number;
  impressions: number;
}

const AdManagement = () => {
  const { toast } = useToast();
  const [ads, setAds] = useState<Advertisement[]>([
    {
      id: "1",
      title: "Engineering Coaching",
      imageUrl: "/placeholder.svg",
      targetUrl: "https://example.com",
      ctaText: "Learn More",
      placement: "home",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      isActive: true,
      clicks: 156,
      impressions: 2340
    },
    {
      id: "2",
      title: "College Admission Help",
      imageUrl: "/placeholder.svg",
      targetUrl: "https://example.com",
      ctaText: "Get Help",
      placement: "results",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      isActive: false,
      clicks: 89,
      impressions: 1567
    }
  ]);

  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (adData: Partial<Advertisement>) => {
    if (editingAd) {
      setAds(ads.map(ad => ad.id === editingAd.id ? { ...ad, ...adData } : ad));
      toast({ title: "Advertisement updated successfully" });
    } else {
      const newAd = {
        id: Date.now().toString(),
        clicks: 0,
        impressions: 0,
        ...adData as Advertisement
      };
      setAds([...ads, newAd]);
      toast({ title: "Advertisement created successfully" });
    }
    setIsDialogOpen(false);
    setEditingAd(null);
  };

  const toggleActive = (id: string) => {
    setAds(ads.map(ad => 
      ad.id === id ? { ...ad, isActive: !ad.isActive } : ad
    ));
    toast({ title: "Advertisement status updated" });
  };

  const deleteAd = (id: string) => {
    setAds(ads.filter(ad => ad.id !== id));
    toast({ title: "Advertisement deleted successfully" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advertisement Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAd(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAd ? "Edit Advertisement" : "Create New Advertisement"}
              </DialogTitle>
            </DialogHeader>
            <AdForm
              ad={editingAd}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{ads.length}</div>
            <div className="text-sm text-gray-600">Total Ads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {ads.filter(ad => ad.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Ads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {ads.reduce((sum, ad) => sum + ad.clicks, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {ads.reduce((sum, ad) => sum + ad.impressions, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Impressions</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Advertisements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={ad.imageUrl} 
                        alt={ad.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{ad.title}</div>
                        <div className="text-sm text-gray-500">{ad.ctaText}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{ad.placement}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(ad.startDate).toLocaleDateString()}</div>
                      <div className="text-gray-500">to {new Date(ad.endDate).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{ad.clicks} clicks</div>
                      <div className="text-gray-500">{ad.impressions} impressions</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleActive(ad.id)}
                    >
                      {ad.isActive ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingAd(ad);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteAd(ad.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const AdForm = ({ 
  ad, 
  onSave, 
  onCancel 
}: { 
  ad: Advertisement | null;
  onSave: (data: Partial<Advertisement>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: ad?.title || "",
    imageUrl: ad?.imageUrl || "",
    targetUrl: ad?.targetUrl || "",
    ctaText: ad?.ctaText || "",
    placement: ad?.placement || "home" as const,
    startDate: ad?.startDate || "",
    endDate: ad?.endDate || "",
    isActive: ad?.isActive || true
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
          <Label htmlFor="ctaText">CTA Text</Label>
          <Input
            id="ctaText"
            value={formData.ctaText}
            onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="targetUrl">Target URL</Label>
        <Input
          id="targetUrl"
          value={formData.targetUrl}
          onChange={(e) => setFormData({...formData, targetUrl: e.target.value})}
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
          onChange={(e) => setFormData({...formData, placement: e.target.value as any})}
        >
          <option value="home">Home Page</option>
          <option value="results">Results Page</option>
          <option value="sidebar">Sidebar</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
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

export default AdManagement;
