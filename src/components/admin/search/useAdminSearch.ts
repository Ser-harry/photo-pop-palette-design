
import { useState, useEffect, useCallback } from "react";
import { AdminSearchSuggestion } from "./types";
import { useSearchData } from "./useSearchData";
import { useSuggestionGenerator } from "./useSuggestionGenerator";
import { debounce } from "./utils";

export const useAdminSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<AdminSearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { colleges, articles, contacts, leads } = useSearchData();
  const generateSuggestions = useSuggestionGenerator(colleges, articles, contacts, leads);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      const filtered = generateSuggestions(searchQuery);
      setSuggestions(filtered);
      setIsLoading(false);
    }, 300),
    [generateSuggestions]
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
          return suggestions[selectedIndex];
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
    return null;
  };

  const handleSuggestionClick = (suggestion: AdminSearchSuggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    return suggestion;
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  return {
    query,
    isOpen,
    selectedIndex,
    suggestions,
    isLoading,
    handleInputChange,
    handleKeyDown,
    handleSuggestionClick,
    handleFocus,
    handleBlur,
    setIsOpen,
    setSelectedIndex
  };
};
