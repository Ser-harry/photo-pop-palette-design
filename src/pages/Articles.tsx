
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Articles = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch published articles
  const { data: articles, isLoading } = useQuery({
    queryKey: ['published-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          article_categories(name, color),
          admin_users(email)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['article-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Get category names for filters
  const categoryNames = ["All", ...(categories?.map(cat => cat.name) || [])];

  const filteredArticles = articles?.filter(article => {
    if (activeCategory === "All") return true;
    return article.article_categories?.name === activeCategory;
  }) || [];

  // Update article views using a simple update query
  const incrementViews = async (articleId: string) => {
    const { error } = await supabase
      .from('articles')
      .update({ views: supabase.raw('views + 1') })
      .eq('id', articleId);
    
    if (error) {
      console.error('Error updating views:', error);
    }
  };

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
                {articles?.slice(0, 3).map(article => article.title).join(' | ') || 
                 'Latest education news and updates from colleges across Tamil Nadu'}
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
          {categoryNames.map((category) => (
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

        {/* Articles List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading articles...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <Card 
                key={article.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => incrementViews(article.id)}
              >
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        {article.featured && (
                          <Badge variant="default" className="bg-orange-500">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      {article.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium text-orange-600">
                            {article.admin_users?.email?.split('@')[0] || 'Admin'}
                          </span>
                        </div>
                        <span>{format(new Date(article.published_at || article.created_at), 'MMM dd, yyyy')}</span>
                        {article.article_categories && (
                          <Badge 
                            variant="outline" 
                            style={{ 
                              backgroundColor: `${article.article_categories.color}20`, 
                              color: article.article_categories.color 
                            }}
                          >
                            {article.article_categories.name}
                          </Badge>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views} views
                        </span>
                      </div>
                    </div>
                    {article.featured_image && (
                      <div className="w-48 p-6">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredArticles.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found in this category</p>
          </div>
        )}
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
