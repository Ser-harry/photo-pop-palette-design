
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NewsSection = () => {
  const news = [
    {
      id: 1,
      title: "IIT Mandi Seat Matrix 2025, Check Previous Year...",
      description: "IIT Mandi Seat Matrix 2025 has been released by JoSAA. Candidates can check the course and category-wise total number of seats IIT Mandi offers.",
      author: "Admin",
      date: "Jun 13, 2025",
      badge: "Top Trending News!!!"
    },
    {
      id: 2,
      title: "IIT Bombay Seat Matrix 2025, Check Course and C...",
      description: "IIT Bombay Seat Matrix 2025 is updated here. 1204 seats are offered across 15 B.Tech courses at IIT Bombay. Check category-wise seat distribution.",
      author: "Admin",
      date: "Jun 13, 2025",
      badge: "Top Trending News!!!"
    },
    {
      id: 3,
      title: "IIT Bhubaneswar Seat Matrix 2025, Check Course-...",
      description: "IIT Bhubaneswar Seat Matrix 2025 is updated here for all the available courses. Candidates can check the previous year's course-wise seat matrix here.",
      author: "Admin",
      date: "Jun 13, 2025",
      badge: "Top Trending News!!!"
    },
    {
      id: 4,
      title: "Top 20 Percentile Cutoff Mark 2025 for IIT, III...",
      description: "JoSAA has released the Top 20 Percentile Cutoff 2025 for IIT, NIT, IIIT & CFTI Admissions. CBSE General cutoff is 419; AP Board cutoff is 475.",
      author: "Admin",
      date: "Jun 13, 2025",
      badge: "Top Trending News!!!"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Latest <span className="text-orange-500">News</span>
          </h2>
          <Button variant="ghost" className="text-orange-500 hover:text-orange-600">
            View more
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="bg-orange-500 text-white px-4 py-2 rounded-t-lg">
                <span className="text-sm font-semibold">{article.badge}</span>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 leading-tight">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">A</span>
                    </div>
                    <span className="text-orange-500 font-medium mr-2">{article.author}</span>
                  </div>
                  <span>{article.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
