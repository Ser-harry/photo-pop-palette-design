
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, AlertCircle } from "lucide-react";
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

  const { data: ads = [], isLoading, error } = useQuery({
    queryKey: ['advertisements'],
    queryFn: getAllAds,
    retry: 3,
    retryDelay: 1000,
  });

  const createMutation = useMutation({
    mutationFn: createAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'sidebar'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'results'] });
      toast({ title: "Advertisement created successfully" });
      setIsDialogOpen(false);
      setEditingAd(null);
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to create advertisement", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DatabaseAdvertisement> }) => 
      updateAd(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'sidebar'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'results'] });
      toast({ title: "Advertisement updated successfully" });
      setIsDialogOpen(false);
      setEditingAd(null);
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to update advertisement", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'sidebar'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'results'] });
      toast({ title: "Advertisement deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to delete advertisement", 
        description: error.message,
        variant: "destructive" 
      });
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
    if (confirm('Are you sure you want to delete this advertisement?')) {
      deleteMutation.mutate(id);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Advertisement Management</h2>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Error Loading Advertisements</h3>
                <p className="text-sm mt-1">
                  {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['advertisements'] })}
                >
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Advertisement Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Loading Advertisements...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
          <CardTitle>All Advertisements ({ads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No advertisements found.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                Create your first advertisement
              </Button>
            </div>
          ) : (
            <AdTable
              ads={ads}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdManagement;
