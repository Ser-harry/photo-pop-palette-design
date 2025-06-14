
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { DatabaseCollege } from "@/types/database";

interface CollegeCardProps {
  college: DatabaseCollege;
}

const CollegeCard = ({ college }: CollegeCardProps) => {
  return (
    <Link to={`/college/${college.slug}`}>
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
  );
};

export default CollegeCard;
