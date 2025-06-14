
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllAds, createAd, updateAd, deleteAd } from "@/services/advertisementService";
import { DatabaseAdvertisement } from "@/types/database";

const AdManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingAd, setEditingAd] = useState<DatabaseAdvertisement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['advertisements'],
    queryFn: getAllAds,
  });

  const createMutation = useMutation({
    mutationFn: createAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'sidebar'] });
      toast({ title: "Advertisement created successfully" });
      setIsDialogOpen(false);
      setEditingAd(null);
    },
    onError: () => {
      toast({ title: "Failed to create advertisement", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DatabaseAdvertisement> }) => 
      updateAd(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'sidebar'] });
      toast({ title: "Advertisement updated successfully" });
      setIsDialogOpen(false);
      setEditingAd(null);
    },
    onError: () => {
      toast({ title: "Failed to update advertisement", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'sidebar'] });
      toast({ title: "Advertisement deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete advertisement", variant: "destructive" });
    }
  });

  const handleSave = (adData: Partial<DatabaseAdvertisement>) => {
    if (editingAd) {
      updateMutation.mutate({ id: editingAd.id, data: adData });
    } else {
      createMutation.mutate(adData as Parameters<typeof createAd>[0]);
    }
  };

  const toggleActive = (ad: DatabaseAdvertisement) => {
    updateMutation.mutate({ 
      id: ad.id, 
      data: { is_active: !ad.is_active } 
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading advertisements...</div>;
  }

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
              {ads.filter(ad => ad.is_active).length}
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
                        src={ad.image_url} 
                        alt={ad.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{ad.title}</div>
                        <div className="text-sm text-gray-500">{ad.cta_text}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{ad.placement}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(ad.start_date).toLocaleDateString()}</div>
                      <div className="text-gray-500">to {new Date(ad.end_date).toLocaleDateString()}</div>
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
                      onClick={() => toggleActive(ad)}
                    >
                      {ad.is_active ? (
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
                        onClick={() => handleDelete(ad.id)}
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
  ad: DatabaseAdvertisement | null;
  onSave: (data: Partial<DatabaseAdvertisement>) => void;
  onCancel: () => void;
}) => {
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

export default AdManagement;
