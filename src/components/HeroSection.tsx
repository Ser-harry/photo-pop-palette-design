
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "CHANDIGARH UNIVERSITY",
      subtitle: "UTTAR PRADESH",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=600&fit=crop"
    },
    {
      title: "INDIAN INSTITUTE OF TECHNOLOGY",
      subtitle: "DELHI",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&h=600&fit=crop"
    },
    {
      title: "NATIONAL INSTITUTE OF DESIGN",
      subtitle: "AHMEDABAD",
      image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=1200&h=600&fit=crop"
    }
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
          alt="University Campus"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60"></div>
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
        {/* University Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
              <span className="text-xl font-bold">CU</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{slides[currentSlide].title}</h2>
              <p className="text-sm opacity-90">{slides[currentSlide].subtitle}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Empowering Education
          </h1>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🏛️</span>
              </div>
              <span className="font-semibold">6000+ Institutions</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📝</span>
              </div>
              <span className="font-semibold">200+ Exams</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📚</span>
              </div>
              <span className="font-semibold">1000+ Courses</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">💻</span>
              </div>
              <span className="font-semibold">200+ Online Courses</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-2 flex items-center">
              <Input
                placeholder="Search Colleges, Courses, Exams, Questions and Articles"
                className="flex-1 border-none text-gray-700 text-lg"
              />
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
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
