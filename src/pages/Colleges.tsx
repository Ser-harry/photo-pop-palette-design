
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import Advertisement from "@/components/Advertisement";
import CollegesHero from "@/components/colleges/CollegesHero";
import CollegeFilters from "@/components/colleges/CollegeFilters";
import CollegeCard from "@/components/colleges/CollegeCard";
import { useQuery } from "@tanstack/react-query";
import { getColleges } from "@/services/collegeService";

const Colleges = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: colleges = [], isLoading, error } = useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
  });

  const categories = [
    { id: "all", name: "All Categories", count: colleges.length },
    { id: "engineering", name: "Engineering", count: colleges.filter(c => c.type === "Engineering").length },
    { id: "medical", name: "Medical", count: colleges.filter(c => c.type === "Medical").length },
    { id: "mba", name: "MBA", count: colleges.filter(c => c.type === "Management").length },
    { id: "law", name: "Law", count: colleges.filter(c => c.type === "Law").length },
    { id: "arts", name: "Arts & Humanities", count: colleges.filter(c => c.type === "Arts").length },
    { id: "commerce", name: "Commerce", count: colleges.filter(c => c.type === "Commerce").length },
  ];

  const filteredColleges = colleges.filter(college => {
    if (selectedCategory !== "all") {
      const categoryTypeMap = {
        "engineering": "Engineering",
        "medical": "Medical", 
        "mba": "Management",
        "law": "Law",
        "arts": "Arts",
        "commerce": "Commerce"
      };
      if (college.type !== categoryTypeMap[selectedCategory]) return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onBookingClick={() => setIsBookingModalOpen(true)} />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p>Loading colleges...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header onBookingClick={() => setIsBookingModalOpen(true)} />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p>Error loading colleges. Please try again later.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      
      <CollegesHero collegeCount={colleges.length} />

      {/* Advertisement after hero section */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Advertisement placement="home" className="max-w-4xl mx-auto" />
        </div>
      </div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <CollegeFilters
            categories={categories}
            selectedCategory={selectedCategory}
            selectedState={selectedState}
            showFilters={showFilters}
            onCategoryChange={setSelectedCategory}
            onStateChange={setSelectedState}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />

          {/* College Results */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {filteredColleges.length} Colleges Found
              </h2>
              <select className="p-2 border rounded-md">
                <option>Sort by Relevance</option>
                <option>Sort by Ranking</option>
                <option>Sort by Fees (Low to High)</option>
                <option>Sort by Fees (High to Low)</option>
              </select>
            </div>

            <div className="grid gap-6">
              {filteredColleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
};

export default Colleges;
