
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const DynamicCollegeSections = () => {
  // Fetch homepage content for college sections
  const { data: homepageContent } = useQuery({
    queryKey: ['homepage-college-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .in('section_name', ['offline_colleges', 'distance_colleges'])
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data;
    }
  });

  const offlineSection = homepageContent?.find(c => c.section_name === 'offline_colleges');
  const distanceSection = homepageContent?.find(c => c.section_name === 'distance_colleges');

  const CollegeList = ({ title, colleges, icon: Icon, bgColor, textColor }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className={`${bgColor} ${textColor} p-6`}>
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8" />
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {colleges?.slice(0, 4).map((college, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {college.name}
                </h4>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {college.location}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Link
            to="/colleges"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View All Colleges
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );

  if (!offlineSection && !distanceSection) {
    return null; // Don't render if no content is configured
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore College Options
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from a variety of educational pathways to achieve your career goals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {offlineSection && (
            <CollegeList
              title={offlineSection.title}
              colleges={offlineSection.content?.colleges || []}
              icon={GraduationCap}
              bgColor="bg-blue-600"
              textColor="text-white"
            />
          )}
          
          {distanceSection && (
            <CollegeList
              title={distanceSection.title}
              colleges={distanceSection.content?.colleges || []}
              icon={GraduationCap}
              bgColor="bg-green-600"
              textColor="text-white"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicCollegeSections;
