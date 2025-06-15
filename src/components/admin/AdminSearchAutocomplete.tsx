import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Building2, GraduationCap, Users, FileText, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getColleges } from "@/services/collegeService";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface AdminSearchSuggestion {
  id: string;
  text: string;
  type: 'college' | 'article' | 'contact' | 'lead' | 'location' | 'course';
  icon: React.ReactNode;
  action?: () => void;
}

interface AdminSearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  onSelect?: (suggestion: AdminSearchSuggestion) => void;
}

const AdminSearchAutocomplete = ({ 
  placeholder = "Search colleges, articles, contacts, leads...", 
  className = "",
  onSelect
}: AdminSearchAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<AdminSearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: colleges = [] } = useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
  });

  // Fetch articles for search
  const { data: articles = [] } = useQuery({
    queryKey: ['admin-articles-search'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, status')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch CRM contacts for search
  const { data: contacts = [] } = useQuery({
    queryKey: ['admin-contacts-search'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('id, name, email')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch CRM leads for search
  const { data: leads = [] } = useQuery({
    queryKey: ['admin-leads-search'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_leads')
        .select(`
          id, 
          status, 
          priority,
          contact:crm_contacts(name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      const filtered = generateAdminSuggestions(searchQuery, colleges, articles, contacts, leads);
      setSuggestions(filtered);
      setIsLoading(false);
    }, 300),
    [colleges, articles, contacts, leads]
  );

  useEffect(() => {
    if (query.length >= 2) {
      setIsLoading(true);
      debouncedSearch(query);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query, debouncedSearch]);

  const generateAdminSuggestions = (
    searchQuery: string, 
    collegeData: any[], 
    articleData: any[], 
    contactData: any[],
    leadData: any[]
  ): AdminSearchSuggestion[] => {
    const query = searchQuery.toLowerCase();
    const suggestions: AdminSearchSuggestion[] = [];
    const seen = new Set<string>();

    // College names
    collegeData.forEach(college => {
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
    articleData.forEach(article => {
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
    contactData.forEach(contact => {
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
    leadData.forEach(lead => {
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
    const locations = [...new Set(collegeData.map(c => c.location))];
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: AdminSearchSuggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="pl-10 pr-4"
        />
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (query.length >= 2 || suggestions.length > 0) && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors",
                    selectedIndex === index && "bg-blue-50 border-l-4 border-blue-500"
                  )}
                >
                  {suggestion.icon}
                  <div className="flex-1">
                    <span className="text-gray-900">{suggestion.text}</span>
                    <span className="text-xs text-gray-500 ml-2 capitalize">
                      {suggestion.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex flex-col items-center space-y-2">
                <Search className="w-8 h-8 text-gray-300" />
                <span>No results found for "{query}"</span>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default AdminSearchAutocomplete;
