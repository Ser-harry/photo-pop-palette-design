
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star, MapPin, Calendar, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CollegeDetail = () => {
  const { id } = useParams();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // Mock college data - in a real app, this would come from an API
  const college = {
    id: id,
    name: "PSG College of Technology",
    location: "Coimbatore, Tamil Nadu",
    established: "1951",
    rating: 4.4,
    type: "Private Institute",
    logo: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=100&h=100&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=400&fit=crop",
    description: "PSG College of Technology, commonly known as PSGCT was established in 1951 as the first private Engineering Institution in Tamil Nadu by G.R. Damodaran. It is affiliated to Anna University and is located in Coimbatore. PSGCT is ranked 63rd position in the Engineering category & 89th position in the Management category by NIRF 2023.",
    courses: [
      { name: "BTech", duration: "4 years", eligibility: "Passed 10+2 with PCM", selectionBasis: "TNEA Counselling" },
      { name: "BSc", duration: "3 years", eligibility: "Passed 10+2 with PCM", selectionBasis: "Merit-based" },
      { name: "ME", duration: "2 years", eligibility: "Passed B.E. / B.Tech", selectionBasis: "GATE / TANCET + TANCA Counselling" },
      { name: "MBA", duration: "2 years", eligibility: "Passed bachelor's degree", selectionBasis: "TANCET + TANCA MBA Counselling" }
    ],
    rankings: [
      { agency: "NIRF (Management)", year: "2023", rank: "89" },
      { agency: "NIRF (Engineering)", year: "2023", rank: "63" }
    ],
    facilities: [
      "Library: Over 2 lakh volumes in Science, Engineering, Management & Science",
      "Computer & Network: Internet connection with 1300 Mbps bandwidth available",
      "Sports Facilities: Both outdoor and indoor sports facilities available",
      "Extracurricular Activities: 20+ student clubs and functions available"
    ],
    faculty: {
      professors: "150+",
      associateProfessors: "99",
      assistantProfessors: "300"
    },
    placements: {
      year: "2020",
      totalPlaced: "1130",
      engineeringStudents: "842",
      managementStudents: "194",
      medianCTCEngineering: "INR 4.20 LPA",
      medianCTCManagement: "INR 5.80 LPA"
    }
  };

  const tabs = [
    { id: "info", label: "Info" },
    { id: "admission", label: "Admission Process" },
    { id: "courses", label: "Courses" },
    { id: "placements", label: "Placements" },
    { id: "rankings", label: "Rankings" },
    { id: "facilities", label: "Facilities" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-900 to-blue-700">
        <img
          src={college.heroImage}
          alt={college.name}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/60"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="flex items-start space-x-6 text-white">
              <img
                src={college.logo}
                alt={college.name}
                className="w-24 h-24 rounded-lg bg-white p-2"
              />
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{college.name}: Courses, Fees, Admission 2025, Placements, Ranking</h1>
                <div className="flex items-center space-x-6 text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{college.established}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{college.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{college.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{college.type}</span>
                  </div>
                </div>
              </div>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
                onClick={() => setIsBookingModalOpen(true)}
              >
                Enquire Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-gray-600">
            Home / Colleges / {college.name}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "info" && (
              <div className="space-y-8">
                <div>
                  <p className="text-gray-700 leading-relaxed">{college.description}</p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-4">Table of Contents</h3>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <ol className="space-y-2 text-blue-600">
                      <li>1. PSG College of Technology Courses Offered</li>
                      <li>2. PSG College of Technology Admission</li>
                      <li>3. PSG College of Technology Placements</li>
                      <li>4. PSG College of Technology Courses Ranking</li>
                      <li>5. PSG College of Technology Facilities</li>
                      <li>6. PSG College of Technology Faculty</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">PSG College of Technology Courses Offered</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-gray-300 px-4 py-3 text-left">Course Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Course Details</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Selection Basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {college.courses.map((course, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="border border-gray-300 px-4 py-3 font-semibold">{course.name}</td>
                          <td className="border border-gray-300 px-4 py-3">
                            Duration: {course.duration}<br />
                            Eligibility: {course.eligibility}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">{course.selectionBasis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "rankings" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">PSG College of Technology Courses Ranking</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-gray-300 px-4 py-3 text-left">Agency</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Year</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {college.rankings.map((ranking, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="border border-gray-300 px-4 py-3">{ranking.agency}</td>
                          <td className="border border-gray-300 px-4 py-3">{ranking.year}</td>
                          <td className="border border-gray-300 px-4 py-3 font-semibold">{ranking.rank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "facilities" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">PSG College of Technology Facilities</h3>
                <div className="space-y-4">
                  {college.facilities.map((facility, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-gray-700">{facility}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "placements" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">PSG College of Technology Placements</h3>
                <p className="text-gray-700 mb-4">
                  PSG College of Technology Placements {college.placements.year} has been concluded. 
                  Reputed recruiters visited the campus. A total of {college.placements.totalPlaced} students were placed.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>The median CTC stood at {college.placements.medianCTCEngineering} for the Engineering students.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>The median CTC stood at {college.placements.medianCTCManagement} for the Management students.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "admission" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">PSG College of Technology Admission</h3>
                <p className="text-gray-700 mb-6">
                  Admissions are based on entrances and counselling conducted by Anna University or national-level exams. 
                  There are also merit-based admissions for specific courses based on previous exam scores.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Online Application Submission:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Applicants need to visit the official website to register themselves.</li>
                      <li>• Click on the link to fill out the application form.</li>
                      <li>• Enter necessary details such as Personal details, Educational qualification & Entrance Score.</li>
                      <li>• Pay the application fee</li>
                      <li>• Take a printout of the duly filled application form.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Offline Application Submission:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Applicants can download the application form.</li>
                      <li>• Take a printout and fill it in.</li>
                      <li>• Attach relevant documents and DD and in an envelope mail it to:</li>
                    </ul>
                    <div className="mt-3 p-4 bg-gray-50 rounded">
                      <p className="font-semibold">The Principal,</p>
                      <p>PSG College of Technology,</p>
                      <p>Peelamedu, Coimbatore – 641004</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Top Colleges</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <img src="https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=40&h=40&fit=crop" className="w-10 h-10 rounded" />
                    <span className="text-sm">Sri Ramakrishna Engineering College</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <img src="https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=40&h=40&fit=crop" className="w-10 h-10 rounded" />
                    <span className="text-sm">Karpagam College of Engineering</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <img src="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=40&h=40&fit=crop" className="w-10 h-10 rounded" />
                    <span className="text-sm">RVS College of Engineering and Technology</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Quick Facts</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Established:</span>
                    <span className="font-semibold">{college.established}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold">{college.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold">{college.rating}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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

export default CollegeDetail;
