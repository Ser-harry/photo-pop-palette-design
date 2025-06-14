import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* CTA Section */}
      <div className="bg-orange-500 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <h3 className="text-2xl font-bold text-white mb-4 md:mb-0">
            Get expert career advice and daily updates
          </h3>
          <div className="flex space-x-4">
            <Button variant="outline" className="bg-white text-orange-500 border-white hover:bg-gray-100">
              Get Updates
            </Button>
            <Button variant="outline" className="bg-blue-900 text-white border-blue-900 hover:bg-blue-800">
              Get a callback ⚡
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold mb-4">
                Kollege<span className="text-orange-500">Apply</span>
              </h2>
              <p className="text-sm opacity-75 mb-4">Empowering Education</p>
              <p className="text-gray-400 text-sm mb-6">
                Discover Excellence: Latest Updates on India's Leading{" "}
                <span className="text-white">Colleges</span>,{" "}
                <span className="text-white">Admissions</span>, and{" "}
                <span className="text-white">Exam</span> News
              </p>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600">
                  <span className="text-white font-bold">@</span>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600">
                  <span className="text-white font-bold">in</span>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600">
                  <span className="text-white font-bold">▶</span>
                </div>
              </div>
            </div>

            {/* Top Colleges */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Colleges</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">IIT Madras</a></li>
                <li><a href="#" className="hover:text-white">IIT Kharagpur</a></li>
                <li><a href="#" className="hover:text-white">IIT Roorkee</a></li>
                <li><a href="#" className="hover:text-white">IIT Jodhpur</a></li>
                <li><a href="#" className="hover:text-white">IIT Delhi</a></li>
              </ul>
            </div>

            {/* Top Exams */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Exams</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">JEE Mains</a></li>
                <li><a href="#" className="hover:text-white">GATE 2025</a></li>
                <li><a href="#" className="hover:text-white">CAT</a></li>
                <li><a href="#" className="hover:text-white">XAT</a></li>
                <li><a href="#" className="hover:text-white">JEE Advanced</a></li>
              </ul>
            </div>

            {/* Others */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Others</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="text-sm text-gray-400 mr-2">Built in India</span>
                <span className="text-orange-500">🇮🇳</span>
              </div>
              
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8 text-sm text-gray-400">
                <span>Regular Helpdesk: +91 95997 49001</span>
                <span>Online Helpdesk: +91 97178 19001</span>
              </div>
              
              <div className="text-sm text-gray-400 mt-4 md:mt-0">
                © 2025 INDO INTERNET PRIVATE LIMITED
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
