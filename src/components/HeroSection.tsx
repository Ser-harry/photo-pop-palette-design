
import { Search, MapPin, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-orange-400/15 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=600&fit=crop"
          alt="Education"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        {/* Main Content */}
        <div className="text-center text-white mb-16">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 font-poppins">
              Find Your <span className="gradient-text bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Dream College</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Discover 6000+ premium institutions across India with our AI-powered platform
            </p>
          </div>
          
          {/* Enhanced Search Section */}
          <div className="max-w-4xl mx-auto mb-12 animate-slide-up">
            <div className="glass-effect rounded-2xl shadow-2xl p-3 hover-lift">
              <div className="flex items-center">
                <div className="flex-1 flex items-center">
                  <MapPin className="w-6 h-6 text-gray-500 mx-4" />
                  <Input
                    placeholder="Search colleges, courses, or locations..."
                    className="flex-1 border-none text-gray-700 text-lg focus:ring-0 bg-transparent placeholder:text-gray-500"
                  />
                </div>
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg px-10 py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-scale-in">
            <div className="glass-effect rounded-xl p-6 hover-lift">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-orange-400" />
              </div>
              <div className="text-3xl font-bold mb-1">6000+</div>
              <div className="text-sm opacity-80">Premium Colleges</div>
            </div>
            <div className="glass-effect rounded-xl p-6 hover-lift">
              <div className="flex items-center justify-center mb-3">
                <Award className="w-8 h-8 text-orange-400" />
              </div>
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-sm opacity-80">Course Options</div>
            </div>
            <div className="glass-effect rounded-xl p-6 hover-lift">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
              <div className="text-3xl font-bold mb-1">95%</div>
              <div className="text-sm opacity-80">Success Rate</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-slide-up">
            <Link to="/colleges">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg px-12 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Explore Colleges Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
