
import { useState } from "react";
import { Search, Filter, MapPin, Star, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Colleges = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: "all", name: "All Categories", count: 6000 },
    { id: "engineering", name: "Engineering", count: 2500 },
    { id: "medical", name: "Medical", count: 800 },
    { id: "mba", name: "MBA", count: 1200 },
    { id: "law", name: "Law", count: 400 },
    { id: "arts", name: "Arts & Humanities", count: 600 },
    { id: "commerce", name: "Commerce", count: 500 },
  ];

  const states = [
    "All States", "Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", 
    "Uttar Pradesh", "West Bengal", "Gujarat", "Rajasthan", "Andhra Pradesh"
  ];

  const colleges = [
    {
      id: 1,
      name: "IIT Madras - Indian Institute of Technology",
      location: "Chennai, Tamil Nadu",
      established: "1959",
      courses: "46+ Courses",
      rating: 4.5,
      ranking: "#1 NIRF Engineering",
      fees: "₹2.5L - 8.5L",
      logo: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=100&h=100&fit=crop",
      badge: "NIRF Ranked",
      category: "engineering",
      type: "Government"
    },
    {
      id: 2,
      name: "AIIMS Delhi - All India Institute of Medical Sciences",
      location: "New Delhi, Delhi",
      established: "1956",
      courses: "28+ Courses",
      rating: 4.7,
      ranking: "#1 NIRF Medical",
      fees: "₹1.2L - 3.5L",
      logo: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=100&h=100&fit=crop",
      badge: "NIRF Ranked",
      category: "medical",
      type: "Government"
    },
    {
      id: 3,
      name: "IIM Ahmedabad - Indian Institute of Management",
      location: "Ahmedabad, Gujarat",
      established: "1961",
      courses: "12+ Courses",
      rating: 4.6,
      ranking: "#1 NIRF Management",
      fees: "₹25L - 28L",
      logo: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=100&h=100&fit=crop",
      badge: "NIRF Ranked",
      category: "mba",
      type: "Government"
    },
    // ... add more colleges
  ];

  const filteredColleges = colleges.filter(college => {
    if (selectedCategory !== "all" && college.category !== selectedCategory) return false;
    return true;
  });

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
              Explore 6000+ colleges across India and make an informed choice
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
                <Link key={college.id} to={`/college/${college.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={college.logo}
                          alt={college.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-xl mb-1">
                                {college.name}
                              </h3>
                              <p className="text-blue-600 flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {college.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center mb-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="font-semibold">{college.rating}</span>
                              </div>
                              <span className="text-sm text-gray-600">{college.type}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <span className="text-gray-600 text-sm">Established</span>
                              <p className="font-semibold">{college.established}</p>
                            </div>
                            <div>
                              <span className="text-gray-600 text-sm">Courses</span>
                              <p className="font-semibold">{college.courses}</p>
                            </div>
                            <div>
                              <span className="text-gray-600 text-sm">Ranking</span>
                              <p className="font-semibold text-orange-500">{college.ranking}</p>
                            </div>
                            <div>
                              <span className="text-gray-600 text-sm">Fees</span>
                              <p className="font-semibold">{college.fees}</p>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {college.badge}
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
