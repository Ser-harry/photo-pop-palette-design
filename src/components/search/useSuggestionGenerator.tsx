
import React, { useMemo } from "react";
import { MapPin, Building2, GraduationCap } from "lucide-react";
import { SearchSuggestion } from "./types";

export const useSuggestionGenerator = (colleges: any[]) => {
  return useMemo(() => {
    const generateSuggestions = (searchQuery: string): SearchSuggestion[] => {
      const query = searchQuery.toLowerCase();
      const suggestions: SearchSuggestion[] = [];
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

      // Locations
      const locations = [...new Set(colleges.map(c => c.location))];
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
      const districts = [...new Set(colleges.map(c => c.district))];
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
      const courseTypes = [...new Set(colleges.map(c => c.type))];
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

    return generateSuggestions;
  }, [colleges]);
};
