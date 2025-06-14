
import { useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import CollegeGrid from "@/components/CollegeGrid";
import NewsSection from "@/components/NewsSection";
import ExamsSection from "@/components/ExamsSection";
import CitiesSection from "@/components/CitiesSection";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import Advertisement from "@/components/Advertisement";

const Index = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      <HeroSection />
      
      {/* Advertisement after hero section */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Advertisement placement="home" className="max-w-4xl mx-auto" />
        </div>
      </div>
      
      <StatsSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 py-8">
        <div className="lg:col-span-3">
          <CollegeGrid />
        </div>
        <div className="lg:col-span-1">
          {/* Sidebar advertisements */}
          <Advertisement placement="sidebar" />
        </div>
      </div>
      
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">
                <span className="text-orange-500">Offline</span> Colleges
              </h2>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-semibold text-gray-900">International Institute of Information Technology, Bangalore</h3>
                  <p className="text-gray-600 text-sm">Hosur Road, Bangalore</p>
                </div>
                <div className="border-b pb-3">
                  <h3 className="font-semibold text-gray-900">All India Institute of Medical Sciences, Delhi</h3>
                  <p className="text-gray-600 text-sm">Gautam Nagar, Delhi, the</p>
                </div>
                <div className="border-b pb-3">
                  <h3 className="font-semibold text-gray-900">IIIT Delhi - Indraprastha Institute of Information Technology</h3>
                  <p className="text-gray-600 text-sm">Okhla, Delhi</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">IIT Patna - Indian Institute of Technology</h3>
                  <p className="text-gray-600 text-sm">Patna</p>
                </div>
              </div>
              <button className="text-orange-500 text-sm mt-4 hover:underline">See all</button>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">
                <span className="text-orange-500">Distance</span> Colleges
              </h2>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-semibold text-gray-900">D.Y. Patil Deemed-to-be-University Online, Padmashree Dr. D.Y. Patil Vidyapeeth, Navi Mumbai</h3>
                  <p className="text-gray-600 text-sm">Navi Mumbai</p>
                </div>
                <div className="border-b pb-3">
                  <h3 className="font-semibold text-gray-900">UPES Online</h3>
                  <p className="text-gray-600 text-sm">Dehradun</p>
                </div>
                <div className="border-b pb-3">
                  <h3 className="font-semibold text-gray-900">VIGNAN Online</h3>
                  <p className="text-gray-600 text-sm">Guntur</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">ICFAI University – Distance Education</h3>
                  <p className="text-gray-600 text-sm">Koramangala, Bangalore</p>
                </div>
              </div>
              <button className="text-orange-500 text-sm mt-4 hover:underline">See all</button>
            </div>
          </div>
        </div>
      </div>
      <CitiesSection />
      <NewsSection />
      <ExamsSection />
      <Footer />
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
