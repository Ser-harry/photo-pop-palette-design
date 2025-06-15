
import { supabase } from "@/integrations/supabase/client";
import { DatabaseCrmContact, DatabaseCrmLead, DatabaseCrmInteraction } from "@/types/database";

// Input interfaces for creating records with proper required fields
interface CreateContactInput {
  name: string;
  email?: string;
  phone?: string;
  contact_type?: string;
  source?: string;
  status?: string;
  notes?: string;
  created_by?: string;
}

interface CreateInteractionInput {
  interaction_type: string;
  contact_id?: string;
  lead_id?: string;
  subject?: string;
  description?: string;
  outcome?: string;
  next_action?: string;
  next_action_date?: string;
  created_by?: string;
}

export async function getContacts(): Promise<DatabaseCrmContact[]> {
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createContact(contact: CreateContactInput): Promise<DatabaseCrmContact> {
  const { data, error } = await supabase
    .from('crm_contacts')
    .insert([contact])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateContact(id: string, updates: Partial<DatabaseCrmContact>): Promise<DatabaseCrmContact> {
  const { data, error } = await supabase
    .from('crm_contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLeads(): Promise<(DatabaseCrmLead & { contact?: DatabaseCrmContact })[]> {
  const { data, error } = await supabase
    .from('crm_leads')
    .select(`
      *,
      contact:crm_contacts(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createLead(lead: Partial<DatabaseCrmLead>): Promise<DatabaseCrmLead> {
  const { data, error } = await supabase
    .from('crm_leads')
    .insert([lead])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLead(id: string, updates: Partial<DatabaseCrmLead>): Promise<DatabaseCrmLead> {
  const { data, error } = await supabase
    .from('crm_leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getInteractions(contactId?: string, leadId?: string): Promise<DatabaseCrmInteraction[]> {
  let query = supabase
    .from('crm_interactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (contactId) {
    query = query.eq('contact_id', contactId);
  }
  if (leadId) {
    query = query.eq('lead_id', leadId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createInteraction(interaction: CreateInteractionInput): Promise<DatabaseCrmInteraction> {
  const { data, error } = await supabase
    .from('crm_interactions')
    .insert([interaction])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCrmDashboardStats() {
  const [
    { data: contacts },
    { data: leads },
    { data: recentInteractions }
  ] = await Promise.all([
    supabase.from('crm_contacts').select('status, contact_type'),
    supabase.from('crm_leads').select('status, priority'),
    supabase
      .from('crm_interactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
  ]);

  const totalContacts = contacts?.length || 0;
  const activeLeads = leads?.filter(lead => lead.status !== 'converted' && lead.status !== 'lost').length || 0;
  const highPriorityLeads = leads?.filter(lead => lead.priority === 'high' && lead.status !== 'converted').length || 0;
  const conversionRate = leads?.length ? 
    ((leads.filter(lead => lead.status === 'converted').length / leads.length) * 100).toFixed(1) : '0.0';

  return {
    totalContacts,
    activeLeads,
    highPriorityLeads,
    conversionRate,
    recentInteractions: recentInteractions || []
  };
}
