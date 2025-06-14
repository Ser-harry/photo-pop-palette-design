
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllAds, createAd, updateAd, deleteAd } from "@/services/advertisementService";
import { DatabaseAdvertisement } from "@/types/database";
import AdForm from "./AdForm";
import AdStatsCards from "./AdStatsCards";
import AdTable from "./AdTable";

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

  const handleEdit = (ad: DatabaseAdvertisement) => {
    setEditingAd(ad);
    setIsDialogOpen(true);
  };

  const handleToggleActive = (ad: DatabaseAdvertisement) => {
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

      <AdStatsCards ads={ads} />

      <Card>
        <CardHeader>
          <CardTitle>All Advertisements</CardTitle>
        </CardHeader>
        <CardContent>
          <AdTable
            ads={ads}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdManagement;
