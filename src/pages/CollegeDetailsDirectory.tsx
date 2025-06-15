
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import CollegeDetailsTable from "@/components/colleges/CollegeDetailsTable";
import Advertisement from "@/components/Advertisement";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getCollegeDirectory } from "@/services/collegeDirectoryService";

const CollegeDetailsDirectory = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: colleges = [], isLoading, error } = useQuery({
    queryKey: ['college-directory'],
    queryFn: getCollegeDirectory
  });
  
  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (college.principalName && college.principalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (college.address && college.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (error) {
    console.error('Error loading college directory:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            College Details Directory
          </h1>
          <p className="text-gray-600 mb-6">
            Comprehensive information about colleges including contact details and administration
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search colleges, principals, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Advertisement Banner */}
        <div className="mb-8">
          <Advertisement placement="results" className="max-w-full" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading college directory...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">Failed to load college directory. Please try again.</div>
          </div>
        )}

        {/* Main Content with Sidebar */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <CollegeDetailsTable colleges={filteredColleges} />
              
              {/* Statistics */}
              <div className="mt-8 text-center text-gray-600">
                <p>Showing {filteredColleges.length} of {colleges.length} colleges</p>
              </div>
            </div>

            {/* Sidebar Ads */}
            <div className="lg:col-span-1">
              <Advertisement placement="sidebar" />
            </div>
          </div>
        )}
      </div>

      <Footer />
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
};

export default CollegeDetailsDirectory;
