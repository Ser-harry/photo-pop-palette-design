
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserPlus, Phone, Mail, Calendar, TrendingUp, Target, Clock } from "lucide-react";
import { getCrmDashboardStats, getContacts, getLeads, createContact, createLead, updateLead } from "@/services/crmService";
import { useToast } from "@/hooks/use-toast";
import { DatabaseCrmContact, DatabaseCrmLead } from "@/types/database";

const CrmDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: dashboardStats } = useQuery({
    queryKey: ['crm-dashboard-stats'],
    queryFn: getCrmDashboardStats,
  });

  const { data: contacts } = useQuery({
    queryKey: ['crm-contacts'],
    queryFn: getContacts,
  });

  const { data: leads } = useQuery({
    queryKey: ['crm-leads'],
    queryFn: getLeads,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CRM Dashboard</h2>
        <div className="flex gap-2">
          <CreateContactDialog />
          <CreateLeadDialog />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CrmOverview stats={dashboardStats} />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsTable contacts={contacts} />
        </TabsContent>

        <TabsContent value="leads">
          <LeadsTable leads={leads} />
        </TabsContent>

        <TabsContent value="interactions">
          <InteractionsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CrmOverview = ({ stats }: { stats: any }) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold">{stats?.totalContacts || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Leads</p>
                <p className="text-2xl font-bold">{stats?.activeLeads || 0}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">{stats?.highPriorityLeads || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats?.conversionRate || 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentInteractions?.length ? (
            <div className="space-y-3">
              {stats.recentInteractions.slice(0, 5).map((interaction: any) => (
                <div key={interaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      interaction.interaction_type === 'call' ? 'bg-blue-500' :
                      interaction.interaction_type === 'email' ? 'bg-green-500' :
                      interaction.interaction_type === 'meeting' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium">{interaction.subject || interaction.interaction_type}</p>
                      <p className="text-sm text-gray-600">{interaction.description}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(interaction.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No recent interactions</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ContactsTable = ({ contacts }: { contacts: DatabaseCrmContact[] | undefined }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'converted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        {contacts?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {contact.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {contact.contact_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.source || '-'}</TableCell>
                  <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-8">No contacts found</p>
        )}
      </CardContent>
    </Card>
  );
};

const LeadsTable = ({ leads }: { leads: any[] | undefined }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Leads</CardTitle>
      </CardHeader>
      <CardContent>
        {leads?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>TNEA Marks</TableHead>
                <TableHead>Interested Colleges</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.contact?.name || 'Unknown Contact'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(lead.priority)}>
                      {lead.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.tnea_marks || '-'}</TableCell>
                  <TableCell>
                    {lead.interested_colleges?.length ? 
                      lead.interested_colleges.slice(0, 2).join(', ') + 
                      (lead.interested_colleges.length > 2 ? '...' : '') 
                      : '-'
                    }
                  </TableCell>
                  <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-8">No leads found</p>
        )}
      </CardContent>
    </Card>
  );
};

const InteractionsView = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactions & Communications</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-500 py-8">
          Interactions management coming soon. This will include call logs, email tracking, and meeting notes.
        </p>
      </CardContent>
    </Card>
  );
};

const CreateContactDialog = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    contact_type: 'student',
    source: '',
    notes: ''
  });

  const createMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['crm-dashboard-stats'] });
      setOpen(false);
      setFormData({ name: '', email: '', phone: '', contact_type: 'student', source: '', notes: '' });
      toast({ title: "Contact created successfully" });
    },
    onError: () => {
      toast({ title: "Error creating contact", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
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
            <Label htmlFor="contact_type">Contact Type</Label>
            <Select value={formData.contact_type} onValueChange={(value) => setFormData(prev => ({ ...prev, contact_type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="college_rep">College Representative</SelectItem>
                <SelectItem value="counselor">Counselor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              placeholder="Website, referral, advertisement..."
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
            {createMutation.isPending ? 'Creating...' : 'Create Contact'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

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

export default CrmDashboard;
