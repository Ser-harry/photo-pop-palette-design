
import { useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AdminSearchAutocompleteProps } from "./search/types";
import { useAdminSearch } from "./search/useAdminSearch";
import SearchDropdown from "./search/SearchDropdown";

const AdminSearchAutocomplete = ({ 
  placeholder = "Search colleges, articles, contacts, leads...", 
  className = "",
  onSelect
}: AdminSearchAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    query,
    isOpen,
    selectedIndex,
    suggestions,
    isLoading,
    handleInputChange,
    handleKeyDown,
    handleSuggestionClick,
    handleFocus,
    handleBlur
  } = useAdminSearch();

  const onSuggestionSelect = (suggestion: any) => {
    const selected = handleSuggestionClick(suggestion);
    if (onSelect && selected) {
      onSelect(selected);
    }
  };

  const onKeyDownWithSelection = (e: React.KeyboardEvent) => {
    const selected = handleKeyDown(e);
    if (selected && onSelect) {
      onSelect(selected);
    }
  };

  const handleBlurWithDropdown = (e: React.FocusEvent) => {
    if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
      handleBlur();
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={onKeyDownWithSelection}
          onFocus={handleFocus}
          onBlur={handleBlurWithDropdown}
          placeholder={placeholder}
          className="pl-10 pr-4"
        />
      </div>

      <SearchDropdown
        ref={dropdownRef}
        isOpen={isOpen}
        query={query}
        suggestions={suggestions}
        isLoading={isLoading}
        selectedIndex={selectedIndex}
        onSuggestionClick={onSuggestionSelect}
      />
    </div>
  );
};

export default AdminSearchAutocomplete;
