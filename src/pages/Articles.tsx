
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Card, CardContent } from "@/components/ui/card";

const Articles = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All Articles", "All News", "Exam News", "College News", "Online Articles"
  ];

  const filters = [
    "All", "Management", "Engineering", "Law", "Arts", "Science"
  ];

  const articles = [
    {
      id: 1,
      title: "IIT Indore Seat Matrix 2025, Check Previous Year Seat Matrix",
      author: "Souvik",
      date: "June 14, 2025",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "IIT Delhi Seat Matrix 2025, Check Previous Years Seat Matrix",
      author: "Souvik",
      date: "June 14, 2025",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "IIT Indore JEE Advanced Cutoff 2025, Check Previous Years Cutoff",
      author: "Souvik",
      date: "June 14, 2025",
      image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      title: "NIT Jalandhar Seat Matrix 2025, 2024, 2023, 2022 by Category",
      author: "Sanhita Kundu",
      date: "June 14, 2025",
      image: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=300&h=200&fit=crop"
    },
    {
      id: 5,
      title: "Delhi NEET Cutoff 2025: AIIMS, MAMC Cutoff, Previous Years Cutoff",
      author: "Souvik",
      date: "June 14, 2025",
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=300&h=200&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onBookingClick={() => setIsBookingModalOpen(true)} />
      
      {/* News Banner */}
      <div className="bg-red-500 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-4">
            <span className="bg-white text-red-500 px-3 py-1 rounded text-sm font-semibold">Latest News</span>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                IIT Delhi Seat Matrix 2025, Check Previous Year Seat Matrix | IIT Delhi Seat Matrix 2025, Check Previous Years Seat Matrix | IIT Indore JEE Advanced Cutoff 2025, Check Previous Years Cutoff
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-sm text-gray-600">
            Home / articles
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Latest Education Articles 2025 | Colleges, Exams, Careers, Courses
        </h1>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeCategory === category
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                filter === "All"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="space-y-6">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="flex-1 p-6">
                    <h3 className="text-xl font-semibold mb-3 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="flex items-center mr-4">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white text-xs font-semibold">
                            {article.author.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-orange-600">{article.author}</span>
                      </div>
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <div className="w-48 p-6">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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

export default Articles;
