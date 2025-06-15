
import { MapPin, Star, Calendar, BookOpen, Award, Users } from "lucide-react";
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
      <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden border-0 shadow-lg hover-lift bg-white">
        {/* Gradient overlay for featured colleges */}
        {college.featured && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
        )}
        
        <CardContent className={`p-6 ${college.featured ? 'pt-8' : 'pt-6'}`}>
          {college.featured && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 z-10 text-xs px-3 py-1 rounded-full shadow-lg">
              ⭐ Featured
            </Badge>
          )}
          
          <div className="flex items-start space-x-4">
            {/* College Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=100&h=100&fit=crop"
                alt={college.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl group-hover:from-black/30 transition-all duration-300"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-semibold text-xl mb-2 truncate group-hover:text-blue-600 transition-colors duration-300 font-poppins">
                    {college.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-orange-500" />
                    <span className="truncate text-sm">{college.location}</span>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center mb-1 bg-green-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="font-semibold text-green-700">4.5</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{college.type}</span>
                </div>
              </div>

              {/* College Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors duration-200">
                  <div className="flex items-center mb-1">
                    <Calendar className="w-3 h-3 text-blue-600 mr-1" />
                    <span className="text-gray-600 text-xs">Est.</span>
                  </div>
                  <p className="font-semibold text-sm text-blue-700">{college.established || "N/A"}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors duration-200">
                  <div className="flex items-center mb-1">
                    <BookOpen className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-gray-600 text-xs">Courses</span>
                  </div>
                  <p className="font-semibold text-sm text-green-700">46+</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-3 hover:bg-orange-100 transition-colors duration-200">
                  <div className="flex items-center mb-1">
                    <Award className="w-3 h-3 text-orange-600 mr-1" />
                    <span className="text-gray-600 text-xs">NAAC</span>
                  </div>
                  <p className="font-semibold text-sm text-orange-700">{college.naac_grade || "N/A"}</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-3 hover:bg-purple-100 transition-colors duration-200">
                  <div className="flex items-center mb-1">
                    <Users className="w-3 h-3 text-purple-600 mr-1" />
                    <span className="text-gray-600 text-xs">District</span>
                  </div>
                  <p className="font-semibold text-sm text-purple-700">{college.district}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-between items-center">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors duration-200">
                  {college.type}
                </Badge>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-gray-50 transition-all duration-200 hover:border-gray-300"
                  >
                    Compare
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
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
