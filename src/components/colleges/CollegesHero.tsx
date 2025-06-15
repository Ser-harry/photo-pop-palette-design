
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface CollegesHeroProps {
  collegeCount: number;
}

const CollegesHero = ({ collegeCount }: CollegesHeroProps) => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect College
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Explore {collegeCount}+ colleges across India and make an informed choice
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-2 flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mx-3" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges by name, location, or course..."
                className="flex-1 border-none text-gray-700 text-lg focus:ring-0"
              />
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6">
                <Search className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegesHero;
