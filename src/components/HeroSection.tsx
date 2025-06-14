
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=600&fit=crop"
          alt="Education"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Main Content */}
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Find Your Dream College
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover 6000+ Institutions Across India
          </p>
          
          {/* Search Section */}
          <div className="max-w-4xl mx-auto mb-8">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-2 flex items-center">
              <div className="flex-1 flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mx-3" />
                <Input
                  placeholder="Search colleges, courses, or locations..."
                  className="flex-1 border-none text-gray-700 text-lg focus:ring-0"
                />
              </div>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* CTA Button */}
          <Link to="/colleges">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-3">
              Explore Colleges
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
