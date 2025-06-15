
import { ReactNode } from "react";

export interface AdminSearchSuggestion {
  id: string;
  text: string;
  type: 'college' | 'article' | 'contact' | 'lead' | 'location' | 'course';
  icon: ReactNode;
  action?: () => void;
}

export interface AdminSearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  onSelect?: (suggestion: AdminSearchSuggestion) => void;
}
