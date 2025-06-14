
import { Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Advertisement from "@/components/Advertisement";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CollegeFiltersProps {
  categories: Category[];
  selectedCategory: string;
  selectedState: string;
  showFilters: boolean;
  onCategoryChange: (category: string) => void;
  onStateChange: (state: string) => void;
  onToggleFilters: () => void;
}

const CollegeFilters = ({
  categories,
  selectedCategory,
  selectedState,
  showFilters,
  onCategoryChange,
  onStateChange,
  onToggleFilters,
}: CollegeFiltersProps) => {
  const states = [
    "All States", "Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", 
    "Uttar Pradesh", "West Bengal", "Gujarat", "Rajasthan", "Andhra Pradesh"
  ];

  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button
            variant="ghost"
            onClick={onToggleFilters}
          >
            <Filter className="w-4 h-4 mr-2" />
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {/* Category Filter */}
          <div>
            <h4 className="font-semibold mb-3">Category</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="mr-3"
                  />
                  <span className="flex-1">{category.name}</span>
                  <span className="text-gray-500 text-sm">({category.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* State Filter */}
          <div>
            <h4 className="font-semibold mb-3">State</h4>
            <select
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {states.map((state) => (
                <option key={state} value={state.toLowerCase().replace(" ", "-")}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* College Type */}
          <div>
            <h4 className="font-semibold mb-3">College Type</h4>
            <div className="space-y-2">
              {["Government", "Private", "Deemed"].map((type) => (
                <label key={type} className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-3" />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sidebar Advertisement */}
          <div className="mt-6">
            <Advertisement placement="sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeFilters;
