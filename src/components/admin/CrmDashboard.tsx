
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCrmDashboardStats, getContacts, getLeads } from "@/services/crmService";
import CrmOverview from "./crm/CrmOverview";
import ContactsTable from "./crm/ContactsTable";
import LeadsTable from "./crm/LeadsTable";
import InteractionsView from "./crm/InteractionsView";
import CreateContactDialog from "./crm/CreateContactDialog";
import CreateLeadDialog from "./crm/CreateLeadDialog";

const CrmDashboard = () => {
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

export default CrmDashboard;
