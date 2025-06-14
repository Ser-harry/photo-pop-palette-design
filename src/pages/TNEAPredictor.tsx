import { useState, useEffect } from "react";
import { Calculator, TrendingUp, Award, BookOpen, Filter, MapPin, Building, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getColleges, getBranches, getCutoffData } from "@/services/collegeService";
import { trackSearch, trackPageView } from "@/services/analyticsService";
import { predictCollegesFromDatabase } from "@/utils/databasePredictionAlgorithm";
import { PredictionFilters, CollegeWithCutoff } from "@/types/college";
import { tamilNaduDistricts, categories } from "@/data/mockData";

const TNEAPredictor = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [filters, setFilters] = useState<PredictionFilters>({
    marks: 0,
    category: "",
    preferredDistrict: "",
    collegeType: [],
    branches: []
  });
  const [predictions, setPredictions] = useState<CollegeWithCutoff[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Track page view on component mount
  useEffect(() => {
    trackPageView({
      page_path: '/tnea-predictor',
      device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      referrer: document.referrer
    });
  }, []);

  // Fetch data from database
  const { data: colleges = [], isLoading: collegesLoading } = useQuery({
    queryKey: ['colleges'],
    queryFn: getColleges,
  });

  const { data: branches = [], isLoading: branchesLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
  });

  const { data: cutoffData = [], isLoading: cutoffLoading } = useQuery({
    queryKey: ['cutoff-data'],
    queryFn: getCutoffData,
  });

  const isLoading = collegesLoading || branchesLoading || cutoffLoading;

  const handlePredict = async () => {
    if (!filters.marks || !filters.category) {
      alert("Please enter your marks and select category");
      return;
    }

    const results = predictCollegesFromDatabase(filters, colleges, branches, cutoffData);
    setPredictions(results);

    // Track search analytics
    await trackSearch({
      marks: filters.marks,
      category: filters.category,
      preferred_district: filters.preferredDistrict,
      college_types: filters.collegeType,
      branches: filters.branches,
      results_count: results.length,
      session_id: `session_${Date.now()}`
    });
  };

  const handleCollegeTypeChange = (type: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      collegeType: checked 
        ? [...(prev.collegeType || []), type]
        : (prev.collegeType || []).filter(t => t !== type)
    }));
  };

  const handleBranchChange = (branchId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      branches: checked
        ? [...(prev.branches || []), branchId]
        : (prev.branches || []).filter(b => b !== branchId)
    }));
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case "high": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            TNEA College Predictor 2025
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Discover your chances at Tamil Nadu engineering colleges with AI-powered predictions
          </p>
          <div className="flex justify-center space-x-8 text-center">
            <div>
              <div className="text-3xl font-bold">{colleges.length}+</div>
              <div className="text-sm opacity-90">Engineering Colleges</div>
            </div>
            <div>
              <div className="text-3xl font-bold">95%+</div>
              <div className="text-sm opacity-90">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5 Years</div>
              <div className="text-sm opacity-90">Historical Data</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prediction Form */}
          <div className="lg:col-span-1">
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
                    TNEA Marks (Out of 200) *
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your marks"
                    value={filters.marks || ""}
                    onChange={(e) => setFilters({...filters, marks: Number(e.target.value)})}
                    max="200"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred District</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={filters.preferredDistrict}
                    onChange={(e) => setFilters({...filters, preferredDistrict: e.target.value})}
                  >
                    <option value="">Any District</option>
                    {tamilNaduDistricts.map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? "Hide" : "Show"} Advanced Filters
                </Button>

                {showFilters && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">College Type</label>
                      <div className="space-y-2">
                        {["government", "aided", "self-financing"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={filters.collegeType?.includes(type) || false}
                              onCheckedChange={(checked) => handleCollegeTypeChange(type, checked as boolean)}
                            />
                            <label htmlFor={type} className="text-sm capitalize">
                              {type.replace("-", " ")}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Branches</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {branches.map((branch) => (
                          <div key={branch.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={branch.id}
                              checked={filters.branches?.includes(branch.id) || false}
                              onCheckedChange={(checked) => handleBranchChange(branch.id, checked as boolean)}
                            />
                            <label htmlFor={branch.id} className="text-sm">
                              {branch.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePredict}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Predict My Chances"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {predictions.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Your Prediction Results</h3>
                  <Badge variant="outline" className="text-sm">
                    {predictions.length} colleges found
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {predictions.map((prediction, index) => (
                    <Card key={`${prediction.id}-${prediction.branch.id}`} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{prediction.name}</h4>
                            <p className="text-blue-600 font-medium">{prediction.branch.name}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {prediction.location}
                              </div>
                              <div className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                {prediction.type.charAt(0).toUpperCase() + prediction.type.slice(1)}
                              </div>
                              {prediction.naacGrade && (
                                <div className="flex items-center">
                                  <GraduationCap className="w-4 h-4 mr-1" />
                                  NAAC {prediction.naacGrade}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`px-3 py-1 rounded-full text-sm font-semibold border ${getProbabilityColor(prediction.probability)}`}>
                              {prediction.probabilityScore}% Chance
                            </Badge>
                            <div className="text-sm text-gray-600 mt-2">
                              {prediction.probability.toUpperCase()} Probability
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Latest Cutoff</span>
                            <p className="font-semibold">
                              {prediction.cutoffData[0]?.cutoffMark || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Your Marks</span>
                            <p className="font-semibold">{filters.marks}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Annual Fees</span>
                            <p className="font-semibold">₹{prediction.fees?.total?.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Established</span>
                            <p className="font-semibold">{prediction.established}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">Why Use Our TNEA Predictor?</h3>
                
                <div className="grid gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <TrendingUp className="w-8 h-8 text-orange-500 mt-1" />
                        <div>
                          <h4 className="font-semibold mb-2">5-Year Historical Data</h4>
                          <p className="text-gray-600">
                            Predictions based on comprehensive cutoff trends from 2019-2023
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
                          <h4 className="font-semibold mb-2">Smart Probability Scoring</h4>
                          <p className="text-gray-600">
                            Advanced algorithm considers your category, marks, and historical patterns
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
                          <h4 className="font-semibold mb-2">Comprehensive College Info</h4>
                          <p className="text-gray-600">
                            Detailed information including fees, NAAC grades, and facilities
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
