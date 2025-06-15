import React, { useMemo } from "react";
import { Building2, FileText, Users, Target, MapPin } from "lucide-react";
import { AdminSearchSuggestion } from "./types";

export const useSuggestionGenerator = (
  colleges: any[],
  articles: any[],
  contacts: any[],
  leads: any[]
) => {
  return useMemo(() => {
    const generateSuggestions = (searchQuery: string): AdminSearchSuggestion[] => {
      const query = searchQuery.toLowerCase();
      const suggestions: AdminSearchSuggestion[] = [];
      const seen = new Set<string>();

      // College names
      colleges.forEach(college => {
        if (college.name.toLowerCase().includes(query) && !seen.has(college.name)) {
          suggestions.push({
            id: `college-${college.id}`,
            text: college.name,
            type: 'college',
            icon: <Building2 className="w-4 h-4 text-blue-500" />
          });
          seen.add(college.name);
        }
      });

      // Articles
      articles.forEach(article => {
        if (article.title.toLowerCase().includes(query) && !seen.has(article.title)) {
          suggestions.push({
            id: `article-${article.id}`,
            text: article.title,
            type: 'article',
            icon: <FileText className="w-4 h-4 text-purple-500" />
          });
          seen.add(article.title);
        }
      });

      // CRM Contacts
      contacts.forEach(contact => {
        if ((contact.name.toLowerCase().includes(query) || 
             (contact.email && contact.email.toLowerCase().includes(query))) && 
            !seen.has(contact.name)) {
          suggestions.push({
            id: `contact-${contact.id}`,
            text: `${contact.name} ${contact.email ? `(${contact.email})` : ''}`,
            type: 'contact',
            icon: <Users className="w-4 h-4 text-green-500" />
          });
          seen.add(contact.name);
        }
      });

      // CRM Leads
      leads.forEach(lead => {
        const contactName = lead.contact?.name || 'Unknown Contact';
        const leadText = `${contactName} - ${lead.status} (${lead.priority} priority)`;
        if (contactName.toLowerCase().includes(query) && !seen.has(leadText)) {
          suggestions.push({
            id: `lead-${lead.id}`,
            text: leadText,
            type: 'lead',
            icon: <Target className="w-4 h-4 text-orange-500" />
          });
          seen.add(leadText);
        }
      });

      // Locations
      const locations = [...new Set(colleges.map(c => c.location))];
      locations.forEach(location => {
        if (location.toLowerCase().includes(query) && !seen.has(location)) {
          suggestions.push({
            id: `location-${location}`,
            text: location,
            type: 'location',
            icon: <MapPin className="w-4 h-4 text-orange-500" />
          });
          seen.add(location);
        }
      });

      return suggestions.slice(0, 8);
    };

    return generateSuggestions;
  }, [colleges, articles, contacts, leads]);
};
