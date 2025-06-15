
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, Mail, Calendar, MessageSquare, Plus, Clock } from "lucide-react";
import { getInteractions, createInteraction, getContacts, getLeads } from "@/services/crmService";
import { useToast } from "@/hooks/use-toast";

const InteractionsView = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [formData, setFormData] = useState({
    interaction_type: '',
    contact_id: '',
    lead_id: '',
    subject: '',
    description: '',
    outcome: '',
    next_action: '',
    next_action_date: ''
  });

  const { data: interactions } = useQuery({
    queryKey: ['crm-interactions'],
    queryFn: () => getInteractions(),
  });

  const { data: contacts } = useQuery({
    queryKey: ['crm-contacts'],
    queryFn: getContacts,
  });

  const { data: leads } = useQuery({
    queryKey: ['crm-leads'],
    queryFn: getLeads,
  });

  const createMutation = useMutation({
    mutationFn: createInteraction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-interactions'] });
      setOpen(false);
      setFormData({
        interaction_type: '',
        contact_id: '',
        lead_id: '',
        subject: '',
        description: '',
        outcome: '',
        next_action: '',
        next_action_date: ''
      });
      toast({ title: "Interaction logged successfully" });
    },
    onError: () => {
      toast({ title: "Error logging interaction", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const interactionData = {
      ...formData,
      next_action_date: formData.next_action_date || undefined
    };
    createMutation.mutate(interactionData);
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4 text-blue-500" />;
      case 'email': return <Mail className="w-4 h-4 text-green-500" />;
      case 'meeting': return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'note': return <MessageSquare className="w-4 h-4 text-gray-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'follow_up_needed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInteractions = interactions?.filter(interaction => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'follow_up') return interaction.outcome === 'follow_up_needed';
    if (selectedFilter === 'today') {
      const today = new Date().toDateString();
      return new Date(interaction.created_at).toDateString() === today;
    }
    return interaction.interaction_type === selectedFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Interactions</SelectItem>
              <SelectItem value="call">Calls</SelectItem>
              <SelectItem value="email">Emails</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
              <SelectItem value="follow_up">Follow-ups Needed</SelectItem>
              <SelectItem value="today">Today</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Log Interaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Log New Interaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interaction_type">Interaction Type *</Label>
                  <Select 
                    value={formData.interaction_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, interaction_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contact_id">Contact</Label>
                  <Select 
                    value={formData.contact_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, contact_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts?.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of the interaction"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Detailed notes about the interaction"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="outcome">Outcome</Label>
                  <Select 
                    value={formData.outcome} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, outcome: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                      <SelectItem value="follow_up_needed">Follow-up Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="next_action_date">Next Action Date</Label>
                  <Input
                    id="next_action_date"
                    type="datetime-local"
                    value={formData.next_action_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, next_action_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="next_action">Next Action</Label>
                <Input
                  id="next_action"
                  value={formData.next_action}
                  onChange={(e) => setFormData(prev => ({ ...prev, next_action: e.target.value }))}
                  placeholder="What's the next step?"
                />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? 'Logging...' : 'Log Interaction'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactions & Communications</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInteractions?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Next Action</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInteractions.map((interaction) => (
                  <TableRow key={interaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getInteractionIcon(interaction.interaction_type)}
                        <span className="capitalize">{interaction.interaction_type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {interaction.subject || '-'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {interaction.description || '-'}
                    </TableCell>
                    <TableCell>
                      {interaction.outcome ? (
                        <Badge className={getOutcomeColor(interaction.outcome)}>
                          {interaction.outcome.replace('_', ' ')}
                        </Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {interaction.next_action ? (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-500" />
                          <span className="text-sm">{interaction.next_action}</span>
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(interaction.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No interactions found. Start logging communications to track your progress.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractionsView;
