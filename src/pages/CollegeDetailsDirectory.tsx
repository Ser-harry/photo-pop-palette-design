
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import CollegeDetailsTable from "@/components/colleges/CollegeDetailsTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Sample data - replace with actual data from your database
const sampleColleges = [
  {
    id: "1",
    name: "Indian Institute of Technology Madras",
    principalName: "Dr. V. Kamakoti",
    address: "Chennai, Tamil Nadu 600036",
    email: "director@iitm.ac.in",
    website: "www.iitm.ac.in",
    phone: "+91-44-2257-4802"
  },
  {
    id: "2",
    name: "National Institute of Technology Tiruchirappalli",
    principalName: "Dr. G. Aghila",
    address: "Tiruchirappalli, Tamil Nadu 620015",
    email: "director@nitt.edu",
    website: "www.nitt.edu",
    phone: "+91-431-250-3000"
  },
  {
    id: "3",
    name: "Anna University",
    principalName: "Dr. R. Velraj",
    address: "Chennai, Tamil Nadu 600025",
    email: "registrar@annauniv.edu",
    website: "www.annauniv.edu",
    phone: "+91-44-2235-8346"
  },
  {
    id: "4",
    name: "PSG College of Technology",
    principalName: "Dr. R. Rudramoorthy",
    address: "Coimbatore, Tamil Nadu 641004",
    email: "principal@psgtech.edu",
    website: "www.psgtech.edu",
    phone: "+91-422-257-2177"
  },
  {
    id: "5",
    name: "SSN College of Engineering",
    principalName: "Dr. S. Salivahanan",
    address: "Chennai, Tamil Nadu 603110",
    email: "principal@ssn.edu.in",
    website: "www.ssn.edu.in",
    phone: "+91-44-2745-7710"
  }
];

const CollegeDetailsDirectory = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredColleges = sampleColleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.principalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* College Details Table */}
        <CollegeDetailsTable colleges={filteredColleges} />
        
        {/* Statistics */}
        <div className="mt-8 text-center text-gray-600">
          <p>Showing {filteredColleges.length} of {sampleColleges.length} colleges</p>
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

export default CollegeDetailsDirectory;
