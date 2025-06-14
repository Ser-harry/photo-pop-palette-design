
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const CollegeGrid = () => {
  const colleges = [
    {
      id: "iit-madras",
      name: "IIT Madras - Indian Institute of Technology",
      location: "Chennai, Tamil Nadu",
      established: "1959",
      courses: "46+ Courses",
      rating: 4,
      ranking: "-",
      fees: "-",
      logo: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=100&h=100&fit=crop",
      badge: "UGC",
      featured: true
    },
    {
      id: "iit-kharagpur",
      name: "IIT Kharagpur - Indian Institute of Technology",
      location: "Kharagpur, West Bengal",
      established: "1951",
      courses: "109+ Courses",
      rating: 4,
      ranking: "#4 NIRF",
      fees: "-",
      logo: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=100&h=100&fit=crop",
      badge: "UGC",
      featured: false
    },
    {
      id: "iit-roorkee",
      name: "IIT Roorkee - Indian Institute of Technology",
      location: "Roorkee, Uttarakhand",
      established: "1847",
      courses: "156+ Courses",
      rating: 4,
      ranking: "#1 NIRF",
      fees: "-",
      logo: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=100&h=100&fit=crop",
      badge: "UGC",
      featured: true
    },
    {
      id: "iit-jodhpur",
      name: "IIT Jodhpur - Indian Institute of Technology",
      location: "Jodhpur, Rajasthan",
      established: "2008",
      courses: "37+ Courses",
      rating: 4,
      ranking: "-",
      fees: "-",
      logo: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=100&h=100&fit=crop",
      badge: "UGC",
      featured: false
    },
    {
      id: "iit-delhi",
      name: "IIT Delhi - Indian Institute of Technology",
      location: "Delhi, Delhi",
      established: "1961",
      courses: "92+ Courses",
      rating: 4,
      ranking: "#1 NIRF",
      fees: "-",
      logo: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=100&h=100&fit=crop",
      badge: "UGC",
      featured: true
    },
    {
      id: "dtu-delhi",
      name: "DTU - Delhi Technological University",
      location: "Delhi, Delhi",
      established: "1941",
      courses: "86+ Courses",
      rating: 4,
      ranking: "#9 NIRF",
      fees: "-",
      logo: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=100&h=100&fit=crop",
      badge: "UGC",
      featured: false
    }
  ];

  const categories = [
    "Management", "Engineering", "Design", "Hotel Management", 
    "Law", "Animation", "Mass Communication", "IT and Software", "Social Work"
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Top <span className="text-orange-500">Colleges</span>
          </h2>
          <Button variant="ghost" className="text-orange-500 hover:text-orange-600">
            View more →
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
            >
              • {category}
            </button>
          ))}
        </div>

        {/* College Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <Link key={college.id} to={`/college/${college.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer relative">
                {college.featured && (
                  <Badge className="absolute top-3 right-3 bg-orange-500 text-white hover:bg-orange-600 z-10">
                    Featured
                  </Badge>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={college.logo}
                      alt={college.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg leading-tight mb-1">
                        {college.name}
                      </h3>
                      <p className="text-blue-600 text-sm">{college.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Established in</span>
                      <p className="font-semibold">{college.established}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tuition Fees</span>
                      <p className="font-semibold">{college.fees}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">No. of Courses</span>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">{college.courses}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm">{college.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Ranking</span>
                      <p className="font-semibold text-orange-500">{college.ranking}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {college.badge}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollegeGrid;
