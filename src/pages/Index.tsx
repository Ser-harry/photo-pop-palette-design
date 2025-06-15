
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import CollegeGrid from "@/components/CollegeGrid";
import DynamicNewsSection from "@/components/DynamicNewsSection";
import DynamicCollegeSections from "@/components/DynamicCollegeSections";
import NavigationSection from "@/components/NavigationSection";
import ExamsSection from "@/components/ExamsSection";
import CitiesSection from "@/components/CitiesSection";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { useState } from "react";

const Index = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      <HeroSection />
      <StatsSection />
      <CollegeGrid />
      <DynamicNewsSection />
      <DynamicCollegeSections />
      <NavigationSection />
      <ExamsSection />
      <CitiesSection />
      <Footer />
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
