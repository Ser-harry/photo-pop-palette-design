
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award } from "lucide-react";

const AboutUs = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl font-bold mb-8">About KollegeApply</h1>
            
            <div className="space-y-8">
              <section>
                <p className="text-lg text-gray-600 mb-6">
                  KollegeApply is India's leading education platform, dedicated to empowering students 
                  in making informed decisions about their higher education journey.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="mb-4">
                  To democratize access to quality education information and help every student 
                  find the perfect college and course that aligns with their aspirations and capabilities.
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">50K+ Students</h3>
                    <p className="text-gray-600 text-sm">Helped annually</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">6000+ Colleges</h3>
                    <p className="text-gray-600 text-sm">In our database</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">95% Success</h3>
                    <p className="text-gray-600 text-sm">Rate in admissions</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Sidebar with Ads */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-lg text-center">
                  <h3 className="font-bold text-lg mb-2">💼 MBA Programs</h3>
                  <p className="text-sm mb-3">Top business schools admission guide</p>
                  <button className="bg-white text-green-600 px-4 py-2 rounded font-semibold text-sm">
                    Explore
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg text-center">
                  <h3 className="font-bold text-lg mb-2">🌍 Study Abroad</h3>
                  <p className="text-sm mb-3">International education opportunities</p>
                  <button className="bg-white text-purple-600 px-4 py-2 rounded font-semibold text-sm">
                    Apply Now
                  </button>
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

export default AboutUs;
