
import { useState } from "react";
import { Search, Filter, MapPin, Star, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import Advertisement from "@/components/Advertisement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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

  const states = [
    "All States", "Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", 
    "Uttar Pradesh", "West Bengal", "Gujarat", "Rajasthan", "Andhra Pradesh"
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
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect College
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Explore {colleges.length}+ colleges across India and make an informed choice
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-2 flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mx-3" />
                <Input
                  placeholder="Search colleges by name, location, or course..."
                  className="flex-1 border-none text-gray-700 text-lg focus:ring-0"
                />
                <Button className="bg-orange-500 hover:bg-orange-600 px-6">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advertisement after hero section */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Advertisement placement="home" className="max-w-4xl mx-auto" />
        </div>
      </div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
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
                          onChange={(e) => setSelectedCategory(e.target.value)}
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
                    onChange={(e) => setSelectedState(e.target.value)}
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
                <Link key={college.id} to={`/college/${college.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden">
                    <CardContent className={`p-6 ${college.featured ? 'pt-12' : ''}`}>
                      {college.featured && (
                        <Badge className="absolute top-2 left-2 bg-orange-500 text-white hover:bg-orange-600 z-10 text-xs px-2 py-1">
                          Featured
                        </Badge>
                      )}
                      <div className="flex items-start space-x-4">
                        <img
                          src="https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=100&h=100&fit=crop"
                          alt={college.name}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0 pr-4">
                              <h3 className="font-semibold text-xl mb-1 truncate">
                                {college.name}
                              </h3>
                              <p className="text-blue-600 flex items-center">
                                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{college.location}</span>
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center mb-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="font-semibold">4.5</span>
                              </div>
                              <span className="text-sm text-gray-600">{college.type}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <span className="text-gray-600 text-sm">Established</span>
                              <p className="font-semibold">{college.established || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-gray-600 text-sm">Courses</span>
                              <p className="font-semibold">46+ Courses</p>
                            </div>
                            <div>
                              <span className="text-gray-600 text-sm">NAAC Grade</span>
                              <p className="font-semibold text-orange-500">{college.naac_grade || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-gray-600 text-sm">District</span>
                              <p className="font-semibold">{college.district}</p>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {college.type}
                            </span>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Compare
                              </Button>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
