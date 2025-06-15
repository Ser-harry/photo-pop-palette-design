
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import Advertisement from "@/components/Advertisement";
import CollegesHero from "@/components/colleges/CollegesHero";
import CollegeFilters from "@/components/colleges/CollegeFilters";
import CollegeCard from "@/components/colleges/CollegeCard";
import { useQuery } from "@tanstack/react-query";
import { getColleges } from "@/services/collegeService";
import { useSearchParams } from "react-router-dom";

const Colleges = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  const { data: colleges = [], isLoading, error } = useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
  });

  // Get search query from URL parameters
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  // Update selected category based on URL parameter
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

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
    // Filter by category
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

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        college.name.toLowerCase().includes(query) ||
        college.location.toLowerCase().includes(query) ||
        college.district.toLowerCase().includes(query) ||
        college.type.toLowerCase().includes(query)
      );
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onBookingClick={() => setIsBookingModalOpen(true)} />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
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
          <p className="text-red-600">Error loading colleges. Please try again later.</p>
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
              <div>
                <h2 className="text-2xl font-bold">
                  {filteredColleges.length} Colleges Found
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 mt-1">
                    Search results for "{searchQuery}"
                  </p>
                )}
              </div>
              <select className="p-2 border rounded-md">
                <option>Sort by Relevance</option>
                <option>Sort by Ranking</option>
                <option>Sort by Fees (Low to High)</option>
                <option>Sort by Fees (High to Low)</option>
              </select>
            </div>

            {filteredColleges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No colleges found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? `No colleges match your search for "${searchQuery}"`
                    : "No colleges match your current filters"
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredColleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>
            )}
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
