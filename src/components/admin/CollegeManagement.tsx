
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Star, StarOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CollegeData {
  id: string;
  name: string;
  location: string;
  type: "government" | "aided" | "self-financing";
  naacGrade: string;
  fees: number;
  featured: boolean;
}

const CollegeManagement = () => {
  const { toast } = useToast();
  const [colleges, setColleges] = useState<CollegeData[]>([
    {
      id: "1",
      name: "IIT Madras",
      location: "Chennai",
      type: "government",
      naacGrade: "A++",
      fees: 50000,
      featured: true
    },
    {
      id: "2",
      name: "NIT Trichy",
      location: "Tiruchirappalli",
      type: "government",
      naacGrade: "A+",
      fees: 75000,
      featured: false
    }
  ]);

  const [editingCollege, setEditingCollege] = useState<CollegeData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (collegeData: Partial<CollegeData>) => {
    if (editingCollege) {
      setColleges(colleges.map(c => c.id === editingCollege.id ? { ...c, ...collegeData } : c));
      toast({ title: "College updated successfully" });
    } else {
      const newCollege = {
        id: Date.now().toString(),
        ...collegeData as CollegeData
      };
      setColleges([...colleges, newCollege]);
      toast({ title: "College added successfully" });
    }
    setIsDialogOpen(false);
    setEditingCollege(null);
  };

  const toggleFeatured = (id: string) => {
    setColleges(colleges.map(c => 
      c.id === id ? { ...c, featured: !c.featured } : c
    ));
    toast({ title: "Featured status updated" });
  };

  const deleteCollege = (id: string) => {
    setColleges(colleges.filter(c => c.id !== id));
    toast({ title: "College deleted successfully" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">College Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCollege(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add College
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCollege ? "Edit College" : "Add New College"}
              </DialogTitle>
            </DialogHeader>
            <CollegeForm
              college={editingCollege}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Colleges</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>NAAC Grade</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colleges.map((college) => (
                <TableRow key={college.id}>
                  <TableCell className="font-medium">{college.name}</TableCell>
                  <TableCell>{college.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{college.type}</Badge>
                  </TableCell>
                  <TableCell>{college.naacGrade}</TableCell>
                  <TableCell>₹{college.fees.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFeatured(college.id)}
                    >
                      {college.featured ? (
                        <Star className="w-4 h-4 text-yellow-500" />
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
                        onClick={() => deleteCollege(college.id)}
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
  onCancel 
}: { 
  college: CollegeData | null;
  onSave: (data: Partial<CollegeData>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: college?.name || "",
    location: college?.location || "",
    type: college?.type || "government" as const,
    naacGrade: college?.naacGrade || "",
    fees: college?.fees || 0,
    featured: college?.featured || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">College Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          className="w-full p-2 border rounded-md"
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value as any})}
        >
          <option value="government">Government</option>
          <option value="aided">Aided</option>
          <option value="self-financing">Self-Financing</option>
        </select>
      </div>
      <div>
        <Label htmlFor="naacGrade">NAAC Grade</Label>
        <Input
          id="naacGrade"
          value={formData.naacGrade}
          onChange={(e) => setFormData({...formData, naacGrade: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="fees">Annual Fees</Label>
        <Input
          id="fees"
          type="number"
          value={formData.fees}
          onChange={(e) => setFormData({...formData, fees: Number(e.target.value)})}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {college ? "Update" : "Add"} College
        </Button>
      </div>
    </form>
  );
};

export default CollegeManagement;
