
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Exams = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const exams = [
    {
      id: 1,
      name: "JEE Mains - (Joint Entrance Examination Main)",
      description: "Online | UG | National Testing Agency (NTA) | Engineering",
      results: "Feb 11, 2025",
      examDate: "Apr 02, 2025 to Apr 09, 2025",
      registration: "Jun 03, 2025 to Jul 11, 2025",
      type: "Online",
      logo: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=60&h=60&fit=crop"
    },
    {
      id: 2,
      name: "GATE 2025 - (Graduate Aptitude Test in Engine...)",
      description: "Online | PG | IITs and IISc | Engineering",
      results: "Mar 19, 2025",
      examDate: "Feb 15, 2025",
      registration: "Oct 04, 2024 to Oct 11, 2024",
      type: "Online",
      logo: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=60&h=60&fit=crop"
    },
    {
      id: 3,
      name: "CAT - (Common Admission Test)",
      description: "Online | PG | IIMs | Management",
      results: "Jan 15, 2025",
      examDate: "Nov 24, 2024",
      registration: "Aug 01, 2024 to Sep 13, 2024",
      type: "Computer-based test",
      logo: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=60&h=60&fit=crop"
    }
  ];

  const filterCategories = [
    {
      name: "Category of Exams",
      options: [
        { label: "Entrance (210)", value: "entrance" },
        { label: "Board (2)", value: "board" }
      ]
    },
    {
      name: "Streams of Exams",
      options: [
        { label: "Engineering (44)", value: "engineering" },
        { label: "Medical (18)", value: "medical" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm">
            <span className="text-blue-600 hover:underline cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span>Exams</span>
          </nav>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-orange-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">
            Top 2025 - Admission, Courses and Fees
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter
                </h3>
                <Button variant="ghost" className="text-orange-500 text-sm">
                  Reset
                </Button>
              </div>

              {filterCategories.map((category, index) => (
                <Collapsible key={index} defaultOpen className="mb-6">
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium py-2">
                    <span>{category.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    {category.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Checkbox id={option.value} />
                        <label htmlFor={option.value} className="text-sm text-gray-600">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Exams <span className="text-gray-500 font-normal">(212 results)</span>
              </h2>
            </div>

            {/* Exam Cards */}
            <div className="space-y-6">
              {exams.map((exam) => (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-blue-900 mb-2">
                            {exam.name}
                          </h3>
                          <p className="text-gray-600 mb-4">{exam.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Results:</span>
                              <p className="font-medium">{exam.results}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Exam Date:</span>
                              <p className="font-medium">{exam.examDate}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Registration:</span>
                              <p className="font-medium">{exam.registration}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <span className={`inline-block px-2 py-1 rounded text-xs ${
                                exam.type === "Online" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                              }`}>
                                • {exam.type}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                              Admit Card
                            </Button>
                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                              Analysis
                            </Button>
                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                              Answer Key
                            </Button>
                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                              Application Process
                            </Button>
                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                              Counselling
                            </Button>
                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                              Cutoff
                            </Button>
                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                              Eligibility Criteria
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          Enquire Now
                        </Button>
                        <Button variant="outline" className="text-blue-900 border-blue-900">
                          View details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

export default Exams;
