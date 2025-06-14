
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">Last updated: December 14, 2025</p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-4">
                  At KollegeApply, we collect information to provide better services to our users. 
                  This includes personal information you provide when registering for our services, 
                  using our college search features, or contacting us for support.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">How We Use Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information to improve our service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>
            </div>
          </div>

          {/* Sidebar with Ads */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg text-center">
                  <h3 className="font-bold text-lg mb-2">🎯 JEE Preparation</h3>
                  <p className="text-sm mb-3">Get expert coaching for JEE Main & Advanced</p>
                  <button className="bg-white text-orange-500 px-4 py-2 rounded font-semibold text-sm">
                    Learn More
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg text-center">
                  <h3 className="font-bold text-lg mb-2">📚 NEET Coaching</h3>
                  <p className="text-sm mb-3">Top medical colleges admission guidance</p>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded font-semibold text-sm">
                    Enroll Now
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

export default PrivacyPolicy;
