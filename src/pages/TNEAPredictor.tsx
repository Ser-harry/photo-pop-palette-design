
import { useState } from "react";
import { Calculator, TrendingUp, Award, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TNEAPredictor = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    marks: "",
    category: "",
    nativity: "",
    quota: "",
    preferredBranch: "",
  });
  const [predictions, setPredictions] = useState(null);

  const categories = ["OC", "BC", "BCM", "MBC", "SC", "ST"];
  const quotas = ["General", "7.5% Quota", "Vocational"];
  const branches = [
    "Computer Science Engineering",
    "Electronics and Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical and Electronics Engineering",
    "Information Technology",
    "Biomedical Engineering",
    "Chemical Engineering",
  ];

  const handlePredict = () => {
    // Mock prediction logic
    const mockPredictions = [
      {
        college: "Anna University - CEG Campus",
        branch: "Computer Science Engineering",
        probability: "High",
        cutoff: "195-200",
        previousYear: "198.5"
      },
      {
        college: "PSG College of Technology",
        branch: "Computer Science Engineering", 
        probability: "Medium",
        cutoff: "190-195",
        previousYear: "192.3"
      },
      {
        college: "Thiagarajar College of Engineering",
        branch: "Computer Science Engineering",
        probability: "High",
        cutoff: "185-190",
        previousYear: "187.8"
      }
    ];
    setPredictions(mockPredictions);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            TNEA College Predictor
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Predict your chances of admission in Tamil Nadu Engineering colleges based on your marks
          </p>
          <div className="flex justify-center space-x-8 text-center">
            <div>
              <div className="text-3xl font-bold">600+</div>
              <div className="text-sm opacity-90">Engineering Colleges</div>
            </div>
            <div>
              <div className="text-3xl font-bold">95%+</div>
              <div className="text-sm opacity-90">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm opacity-90">Students Helped</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Prediction Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-orange-500" />
                  Enter Your Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    TNEA Marks (Out of 200)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your TNEA marks"
                    value={formData.marks}
                    onChange={(e) => setFormData({...formData, marks: e.target.value})}
                    max="200"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nativity</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.nativity}
                    onChange={(e) => setFormData({...formData, nativity: e.target.value})}
                  >
                    <option value="">Select Nativity</option>
                    <option value="tamil-nadu">Tamil Nadu</option>
                    <option value="puducherry">Puducherry</option>
                    <option value="other">Other State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quota</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.quota}
                    onChange={(e) => setFormData({...formData, quota: e.target.value})}
                  >
                    <option value="">Select Quota</option>
                    {quotas.map((quota) => (
                      <option key={quota} value={quota}>{quota}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Branch</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.preferredBranch}
                    onChange={(e) => setFormData({...formData, preferredBranch: e.target.value})}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handlePredict}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  Predict My Chances
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Prediction Results */}
          <div>
            {predictions ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Your Prediction Results</h3>
                {predictions.map((prediction, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{prediction.college}</h4>
                          <p className="text-blue-600">{prediction.branch}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          prediction.probability === 'High' ? 'bg-green-100 text-green-800' :
                          prediction.probability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {prediction.probability} Chance
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Expected Cutoff</span>
                          <p className="font-semibold">{prediction.cutoff}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Year Cutoff</span>
                          <p className="font-semibold">{prediction.previousYear}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Why Use TNEA Predictor?</h3>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <TrendingUp className="w-8 h-8 text-orange-500 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Accurate Predictions</h4>
                        <p className="text-gray-600">
                          Based on previous year cutoffs and admission trends
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Award className="w-8 h-8 text-orange-500 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Category-wise Analysis</h4>
                        <p className="text-gray-600">
                          Predictions based on your category and quota
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <BookOpen className="w-8 h-8 text-orange-500 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Comprehensive Data</h4>
                        <p className="text-gray-600">
                          Covers all engineering colleges in Tamil Nadu
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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

export default TNEAPredictor;
