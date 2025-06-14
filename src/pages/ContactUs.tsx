
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactUs = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <form className="space-y-4">
                  <Input placeholder="Your Name" />
                  <Input placeholder="Email Address" type="email" />
                  <Input placeholder="Phone Number" />
                  <textarea 
                    className="w-full p-3 border rounded-md" 
                    rows={4} 
                    placeholder="Your Message"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Send Message
                  </Button>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-orange-500" />
                    <span>info@kollegeapply.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span>123 Education Street, Chennai, Tamil Nadu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Ads */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-red-500 to-red-700 text-white p-6 rounded-lg text-center">
                  <h3 className="font-bold text-lg mb-2">🏥 Medical Colleges</h3>
                  <p className="text-sm mb-3">NEET counseling and admission</p>
                  <button className="bg-white text-red-600 px-4 py-2 rounded font-semibold text-sm">
                    Get Guidance
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white p-6 rounded-lg text-center">
                  <h3 className="font-bold text-lg mb-2">⚖️ Law Colleges</h3>
                  <p className="text-sm mb-3">CLAT preparation and admission</p>
                  <button className="bg-white text-yellow-600 px-4 py-2 rounded font-semibold text-sm">
                    Start Now
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

export default ContactUs;
