
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Building2, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getColleges } from "@/services/collegeService";
import { cn } from "@/lib/utils";

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'college' | 'location' | 'course' | 'district';
  icon: React.ReactNode;
}

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  showIcon?: boolean;
  onSearch?: (query: string) => void;
  variant?: 'hero' | 'header';
}

const SearchAutocomplete = ({ 
  placeholder = "Search colleges, courses, or locations...", 
  className = "",
  inputClassName = "",
  showIcon = true,
  onSearch,
  variant = 'hero'
}: SearchAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: colleges = [] } = useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      const filtered = generateSuggestions(searchQuery, colleges);
      setSuggestions(filtered);
      setIsLoading(false);
    }, 300),
    [colleges]
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

  const generateSuggestions = (searchQuery: string, collegeData: any[]): SearchSuggestion[] => {
    const query = searchQuery.toLowerCase();
    const suggestions: SearchSuggestion[] = [];
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

    // Locations
    const locations = [...new Set(collegeData.map(c => c.location))];
    locations.forEach(location => {
      if (location.toLowerCase().includes(query) && !seen.has(location)) {
        suggestions.push({
          id: `location-${location}`,
          text: location,
          type: 'location',
          icon: <MapPin className="w-4 h-4 text-green-500" />
        });
        seen.add(location);
      }
    });

    // Districts
    const districts = [...new Set(collegeData.map(c => c.district))];
    districts.forEach(district => {
      if (district.toLowerCase().includes(query) && !seen.has(district)) {
        suggestions.push({
          id: `district-${district}`,
          text: district,
          type: 'district',
          icon: <MapPin className="w-4 h-4 text-orange-500" />
        });
        seen.add(district);
      }
    });

    // Course types
    const courseTypes = [...new Set(collegeData.map(c => c.type))];
    courseTypes.forEach(type => {
      if (type.toLowerCase().includes(query) && !seen.has(type)) {
        suggestions.push({
          id: `course-${type}`,
          text: type,
          type: 'course',
          icon: <GraduationCap className="w-4 h-4 text-purple-500" />
        });
        seen.add(type);
      }
    });

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  };

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
        inputRef.current?.blur();
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

  const handleBlur = (e: React.FocusEvent) => {
    // Delay closing to allow clicking on suggestions
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center">
          {showIcon && (
            <MapPin className="w-5 h-5 text-gray-500 absolute left-3 z-10" />
          )}
          <Input
            ref={inputRef}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={cn(
              "w-full transition-all duration-200",
              showIcon ? "pl-10" : "pl-4",
              variant === 'hero' 
                ? "pr-4 py-4 text-lg border-none bg-transparent focus:ring-0 focus:outline-none text-gray-700 placeholder:text-gray-500" 
                : "pr-4",
              // Remove default focus styles that cause black outline
              "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
              inputClassName
            )}
          />
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (query.length >= 2 || suggestions.length > 0) && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
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
                    selectedIndex === index && "bg-orange-50 border-l-4 border-orange-500"
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
                <span>No suggestions found for "{query}"</span>
                <span className="text-xs">Press Enter to search anyway</span>
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

export default SearchAutocomplete;
