
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchSuggestion } from "./types";
import { debounce } from "./utils";

export const useSearchLogic = (
  generateSuggestions: (query: string) => SearchSuggestion[],
  onSearch?: (query: string) => void
) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Debounced search function
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

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setQuery(searchQuery);
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
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
          handleSearch(suggestions[selectedIndex].text);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
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
    handleSubmit,
    handleFocus,
    handleBlur,
    setIsOpen,
    setSelectedIndex
  };
};
