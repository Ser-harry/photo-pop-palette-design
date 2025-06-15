
import { MessageCircle, MapPin, GraduationCap, FileText, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const ChatSuggestions = ({ onSuggestionClick }: ChatSuggestionsProps) => {
  const suggestions = [
    {
      category: "Location-Based",
      icon: MapPin,
      items: [
        "Top colleges in Coimbatore",
        "Best engineering colleges in Chennai",
        "Colleges in Tiruchirappalli",
        "Government colleges in Tamil Nadu"
      ]
    },
    {
      category: "Branch-Specific",
      icon: GraduationCap,
      items: [
        "CSE cutoff marks 2023",
        "Best colleges for Mechanical Engineering",
        "IT branch placement statistics",
        "ECE colleges with good faculty"
      ]
    },
    {
      category: "General Queries",
      icon: FileText,
      items: [
        "TNEA counseling process",
        "How to choose the right college",
        "Scholarship opportunities",
        "College admission deadlines"
      ]
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Popular Topics</h3>
        <p className="text-sm text-gray-600">Click on any topic below to get started</p>
      </div>
      
      {suggestions.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
            <category.icon size={16} />
            {category.category}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {category.items.map((item, itemIndex) => (
              <Button
                key={itemIndex}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(item)}
                className="text-left justify-start h-auto p-3 text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-colors"
              >
                <span className="text-xs leading-relaxed">{item}</span>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSuggestions;
