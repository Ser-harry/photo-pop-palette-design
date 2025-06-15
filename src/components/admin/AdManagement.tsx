
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllAds, createAd, updateAd, deleteAd, cleanupInvalidAds } from "@/services/advertisementService";
import { DatabaseAdvertisement } from "@/types/database";
import AdForm from "./AdForm";
import AdStatsCards from "./AdStatsCards";
import AdTable from "./AdTable";

const AdManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingAd, setEditingAd] = useState<DatabaseAdvertisement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(false);

  // Cleanup invalid ads on component mount
  useEffect(() => {
    cleanupInvalidAds().catch(error => {
      console.warn('Failed to cleanup invalid ads:', error);
    });
  }, []);

  const { data: ads = [], isLoading, error, refetch } = useQuery({
    queryKey: ['advertisements'],
    queryFn: getAllAds,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000, // Consider data fresh for 30 seconds
    onError: (error) => {
      console.error('Query error in AdManagement:', error);
      toast({
        title: "Failed to load advertisements",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: createAd,
    onMutate: () => {
      setOperationInProgress(true);
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'sidebar'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'results'] });
      
      toast({ title: "Advertisement created successfully" });
      setIsDialogOpen(false);
      setEditingAd(null);
    },
    onError: (error: Error) => {
      console.error('Create mutation error:', error);
      toast({ 
        title: "Failed to create advertisement", 
        description: error.message,
        variant: "destructive" 
      });
    },
    onSettled: () => {
      setOperationInProgress(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DatabaseAdvertisement> }) => 
      updateAd(id, data),
    onMutate: () => {
      setOperationInProgress(true);
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'sidebar'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'results'] });
      
      toast({ title: "Advertisement updated successfully" });
      setIsDialogOpen(false);
      setEditingAd(null);
    },
    onError: (error: Error) => {
      console.error('Update mutation error:', error);
      toast({ 
        title: "Failed to update advertisement", 
        description: error.message,
        variant: "destructive" 
      });
    },
    onSettled: () => {
      setOperationInProgress(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAd,
    onMutate: () => {
      setOperationInProgress(true);
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'home'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'sidebar'] });
      queryClient.invalidateQueries({ queryKey: ['advertisements', 'results'] });
      
      toast({ title: "Advertisement deleted successfully" });
    },
    onError: (error: Error) => {
      console.error('Delete mutation error:', error);
      toast({ 
        title: "Failed to delete advertisement", 
        description: error.message,
        variant: "destructive" 
      });
    },
    onSettled: () => {
      setOperationInProgress(false);
    }
  });

  const handleSave = (adData: Partial<DatabaseAdvertisement>) => {
    if (operationInProgress) {
      toast({
        title: "Operation in progress",
        description: "Please wait for the current operation to complete",
        variant: "destructive"
      });
      return;
    }

    if (editingAd) {
      updateMutation.mutate({ id: editingAd.id, data: adData });
    } else {
      createMutation.mutate(adData as Parameters<typeof createAd>[0]);
    }
  };

  const handleEdit = (ad: DatabaseAdvertisement) => {
    if (operationInProgress) {
      toast({
        title: "Operation in progress",
        description: "Please wait for the current operation to complete",
        variant: "destructive"
      });
      return;
    }
    setEditingAd(ad);
    setIsDialogOpen(true);
  };

  const handleToggleActive = (ad: DatabaseAdvertisement) => {
    if (operationInProgress) {
      toast({
        title: "Operation in progress",
        description: "Please wait for the current operation to complete",
        variant: "destructive"
      });
      return;
    }

    updateMutation.mutate({ 
      id: ad.id, 
      data: { is_active: !ad.is_active } 
    });
  };

  const handleDelete = (id: string) => {
    if (operationInProgress) {
      toast({
        title: "Operation in progress",
        description: "Please wait for the current operation to complete",
        variant: "destructive"
      });
      return;
    }

    if (confirm('Are you sure you want to delete this advertisement?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Advertisement Management</h2>
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
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
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRetry}
                  >
                    Retry
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => queryClient.clear()}
                  >
                    Clear Cache
                  </Button>
                </div>
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
        <div>
          <h2 className="text-2xl font-bold">Advertisement Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            {operationInProgress && "Operation in progress..."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRetry} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setEditingAd(null)}
                disabled={operationInProgress}
              >
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
                disabled={operationInProgress}
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
              disabled={operationInProgress}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdManagement;
