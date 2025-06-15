
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Star, StarOff, Search, Filter, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DatabaseCollege } from "@/types/database";

type CollegeFormData = Omit<DatabaseCollege, 'id' | 'created_at' | 'updated_at'>;

interface ToggleFeatureParams {
  collegeId: string;
  field: 'featured' | 'homepage_featured';
  value: boolean;
}

interface BulkUpdateParams {
  collegeIds: string[];
  field: 'featured' | 'homepage_featured';
  value: boolean;
}

const EnhancedCollegeManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingCollege, setEditingCollege] = useState<DatabaseCollege | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [selectedColleges, setSelectedColleges] = useState(new Set<string>());

  // Fetch colleges from database
  const { data: colleges, isLoading } = useQuery({
    queryKey: ['admin-colleges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as DatabaseCollege[];
    }
  });

  // Mutations for college operations
  const saveMutation = useMutation({
    mutationFn: async (collegeData: CollegeFormData) => {
      if (editingCollege) {
        const { error } = await supabase
          .from('colleges')
          .update(collegeData)
          .eq('id', editingCollege.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('colleges')
          .insert([collegeData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      setIsDialogOpen(false);
      setEditingCollege(null);
      toast({ title: editingCollege ? "College updated" : "College added" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (collegeId: string) => {
      const { error } = await supabase
        .from('colleges')
        .delete()
        .eq('id', collegeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      toast({ title: "College deleted" });
    }
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ collegeId, field, value }: ToggleFeatureParams) => {
      const { error } = await supabase
        .from('colleges')
        .update({ [field]: value })
        .eq('id', collegeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      toast({ title: "College updated" });
    }
  });

  const bulkFeatureMutation = useMutation({
    mutationFn: async ({ collegeIds, field, value }: BulkUpdateParams) => {
      const { error } = await supabase
        .from('colleges')
        .update({ [field]: value })
        .in('id', collegeIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      setSelectedColleges(new Set());
      toast({ title: "Colleges updated" });
    }
  });

  // Filter colleges based on search and filters
  const filteredColleges = colleges?.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || college.type === typeFilter;
    const matchesDistrict = districtFilter === "all" || college.district === districtFilter;
    return matchesSearch && matchesType && matchesDistrict;
  }) || [];

  // Get unique districts for filter
  const districts = [...new Set(colleges?.map(c => c.district) || [])];

  const handleSelectCollege = (collegeId: string, checked: boolean) => {
    const newSelected = new Set(selectedColleges);
    if (checked) {
      newSelected.add(collegeId);
    } else {
      newSelected.delete(collegeId);
    }
    setSelectedColleges(newSelected);
  };

  const handleBulkAction = (field: 'featured' | 'homepage_featured', value: boolean) => {
    if (selectedColleges.size === 0) return;
    bulkFeatureMutation.mutate({
      collegeIds: Array.from(selectedColleges),
      field,
      value
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading colleges...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enhanced College Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCollege(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add College
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCollege ? "Edit College" : "Add New College"}
              </DialogTitle>
            </DialogHeader>
            <CollegeForm
              college={editingCollege}
              onSave={(data) => saveMutation.mutate(data)}
              onCancel={() => setIsDialogOpen(false)}
              isLoading={saveMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter Colleges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="aided">Aided</SelectItem>
                  <SelectItem value="self-financing">Self-Financing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>District</Label>
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setDistrictFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedColleges.size > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedColleges.size} colleges selected
              </span>
              <Button
                size="sm"
                onClick={() => handleBulkAction('featured', true)}
              >
                Mark as Featured
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('featured', false)}
              >
                Remove Featured
              </Button>
              <Button
                size="sm"
                onClick={() => handleBulkAction('homepage_featured', true)}
              >
                Show on Homepage
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('homepage_featured', false)}
              >
                Remove from Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Colleges Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Colleges ({filteredColleges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedColleges.size === filteredColleges.length && filteredColleges.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedColleges(new Set(filteredColleges.map(c => c.id)));
                      } else {
                        setSelectedColleges(new Set());
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>NAAC</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Homepage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredColleges.map((college) => (
                <TableRow key={college.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedColleges.has(college.id)}
                      onCheckedChange={(checked) => handleSelectCollege(college.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {college.image_url && (
                        <img src={college.image_url} alt={college.name} className="w-8 h-8 rounded object-cover" />
                      )}
                      {college.name}
                    </div>
                  </TableCell>
                  <TableCell>{college.location}, {college.district}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{college.type}</Badge>
                  </TableCell>
                  <TableCell>{college.naac_grade || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFeatureMutation.mutate({
                        collegeId: college.id,
                        field: 'featured',
                        value: !college.featured
                      })}
                    >
                      {college.featured ? (
                        <Star className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFeatureMutation.mutate({
                        collegeId: college.id,
                        field: 'homepage_featured',
                        value: !college.homepage_featured
                      })}
                    >
                      {college.homepage_featured ? (
                        <Star className="w-4 h-4 text-blue-500" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCollege(college);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(college.id)}
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

const CollegeForm = ({ 
  college, 
  onSave, 
  onCancel, 
  isLoading 
}: { 
  college: DatabaseCollege | null;
  onSave: (data: CollegeFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState<CollegeFormData>({
    name: college?.name || "",
    slug: college?.slug || "",
    location: college?.location || "",
    district: college?.district || "",
    type: college?.type || "government",
    naac_grade: college?.naac_grade || "",
    website: college?.website || "",
    established: college?.established || new Date().getFullYear(),
    facilities: college?.facilities || [],
    featured: college?.featured || false,
    homepage_featured: college?.homepage_featured || false,
    display_order: college?.display_order || 0,
    image_url: college?.image_url || "",
    principal_name: college?.principal_name || "",
    email: college?.email || "",
    phone: college?.phone || "",
    address: college?.address || ""
  });

  const [newFacility, setNewFacility] = useState("");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }));
  };

  const addFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility("");
    }
  };

  const removeFacility = (facilityToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(facility => facility !== facilityToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">College Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="district">District *</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="aided">Aided</SelectItem>
              <SelectItem value="self-financing">Self-Financing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="naac_grade">NAAC Grade</Label>
          <Input
            id="naac_grade"
            value={formData.naac_grade}
            onChange={(e) => setFormData(prev => ({ ...prev, naac_grade: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="established">Established Year</Label>
          <Input
            id="established"
            type="number"
            value={formData.established}
            onChange={(e) => setFormData(prev => ({ ...prev, established: Number(e.target.value) }))}
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="image_url">College Image URL</Label>
          <Input
            id="image_url"
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="principal_name">Principal Name</Label>
          <Input
            id="principal_name"
            value={formData.principal_name}
            onChange={(e) => setFormData(prev => ({ ...prev, principal_name: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData(prev => ({ ...prev, display_order: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          rows={3}
        />
      </div>

      <div>
        <Label>Facilities</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
            placeholder="Add facility"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
          />
          <Button type="button" onClick={addFacility} variant="outline">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.facilities.map((facility) => (
            <Badge key={facility} variant="secondary" className="flex items-center gap-1">
              {facility}
              <button
                type="button"
                onClick={() => removeFacility(facility)}
                className="ml-1 text-xs hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(featured) => setFormData(prev => ({ ...prev, featured: featured as boolean }))}
          />
          <Label htmlFor="featured">Featured College</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="homepage_featured"
            checked={formData.homepage_featured}
            onCheckedChange={(homepage_featured) => setFormData(prev => ({ ...prev, homepage_featured: homepage_featured as boolean }))}
          />
          <Label htmlFor="homepage_featured">Show on Homepage</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : (college ? "Update" : "Add") + " College"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EnhancedCollegeManagement;
