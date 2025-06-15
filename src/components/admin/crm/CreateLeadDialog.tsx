
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target } from "lucide-react";
import { createLead, getContacts } from "@/services/crmService";
import { useToast } from "@/hooks/use-toast";

const CreateLeadDialog = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    lead_source: '',
    priority: 'medium',
    tnea_marks: '',
    category: '',
    preferred_district: '',
    notes: '',
    interested_colleges: ''
  });

  const { data: contacts } = useQuery({
    queryKey: ['crm-contacts'],
    queryFn: getContacts,
  });

  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-leads'] });
      queryClient.invalidateQueries({ queryKey: ['crm-dashboard-stats'] });
      setOpen(false);
      setFormData({ lead_source: '', priority: 'medium', tnea_marks: '', category: '', preferred_district: '', notes: '', interested_colleges: '' });
      toast({ title: "Lead created successfully" });
    },
    onError: () => {
      toast({ title: "Error creating lead", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const leadData = {
      ...formData,
      tnea_marks: formData.tnea_marks ? parseInt(formData.tnea_marks) : undefined,
      interested_colleges: formData.interested_colleges ? formData.interested_colleges.split(',').map(s => s.trim()) : []
    };
    createMutation.mutate(leadData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Target className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="lead_source">Lead Source</Label>
            <Input
              id="lead_source"
              value={formData.lead_source}
              onChange={(e) => setFormData(prev => ({ ...prev, lead_source: e.target.value }))}
              placeholder="Search, advertisement, referral..."
            />
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tnea_marks">TNEA Marks</Label>
            <Input
              id="tnea_marks"
              type="number"
              value={formData.tnea_marks}
              onChange={(e) => setFormData(prev => ({ ...prev, tnea_marks: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OC">OC</SelectItem>
                <SelectItem value="BC">BC</SelectItem>
                <SelectItem value="MBC">MBC</SelectItem>
                <SelectItem value="SC">SC</SelectItem>
                <SelectItem value="ST">ST</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="interested_colleges">Interested Colleges</Label>
            <Input
              id="interested_colleges"
              value={formData.interested_colleges}
              onChange={(e) => setFormData(prev => ({ ...prev, interested_colleges: e.target.value }))}
              placeholder="Comma-separated college names"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={createMutation.isPending} className="w-full">
            {createMutation.isPending ? 'Creating...' : 'Create Lead'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadDialog;
