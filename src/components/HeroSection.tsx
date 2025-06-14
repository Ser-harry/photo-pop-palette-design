
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, MapPin, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchType, setSearchType] = useState("colleges");
  
  const slides = [
    {
      title: "Find Your Dream College",
      subtitle: "Discover 6000+ Institutions Across India",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=600&fit=crop",
      cta: "Explore Colleges"
    },
    {
      title: "Crack Your Dream Exam",
      subtitle: "Prepare for 200+ Competitive Exams",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&h=600&fit=crop",
      cta: "View Exams"
    },
    {
      title: "Choose the Right Course",
      subtitle: "1000+ Courses to Shape Your Future",
      image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=1200&h=600&fit=crop",
      cta: "Browse Courses"
    }
  ];

  const quickLinks = [
    { name: "Engineering Colleges", icon: "🏗️", path: "/colleges?category=engineering" },
    { name: "Medical Colleges", icon: "🏥", path: "/colleges?category=medical" },
    { name: "MBA Colleges", icon: "💼", path: "/colleges?category=mba" },
    { name: "Law Colleges", icon: "⚖️", path: "/colleges?category=law" },
    { name: "Arts Colleges", icon: "🎨", path: "/colleges?category=arts" },
    { name: "Commerce Colleges", icon: "💰", path: "/colleges?category=commerce" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slides[currentSlide].image}
          alt="Education"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/70"></div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Main Content */}
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {slides[currentSlide].subtitle}
          </p>
          
          {/* Search Section */}
          <div className="max-w-4xl mx-auto mb-8">
            {/* Search Tabs */}
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 rounded-lg p-1 flex">
                <button
                  onClick={() => setSearchType("colleges")}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    searchType === "colleges" ? "bg-white text-blue-900" : "text-white"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 inline mr-2" />
                  Colleges
                </button>
                <button
                  onClick={() => setSearchType("exams")}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    searchType === "exams" ? "bg-white text-blue-900" : "text-white"
                  }`}
                >
                  📝 Exams
                </button>
                <button
                  onClick={() => setSearchType("courses")}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    searchType === "courses" ? "bg-white text-blue-900" : "text-white"
                  }`}
                >
                  📚 Courses
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-2 flex items-center">
              <div className="flex-1 flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mx-3" />
                <Input
                  placeholder={`Search ${searchType}...`}
                  className="flex-1 border-none text-gray-700 text-lg focus:ring-0"
                />
              </div>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors text-center"
              >
                <div className="text-2xl mb-2">{link.icon}</div>
                <div className="text-sm font-medium">{link.name}</div>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link to="/colleges">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-3">
              {slides[currentSlide].cta}
            </Button>
          </Link>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
