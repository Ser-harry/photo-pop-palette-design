
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const DynamicNewsSection = () => {
  // Fetch homepage articles
  const { data: homepageArticles } = useQuery({
    queryKey: ['homepage-news-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_articles')
        .select(`
          *,
          articles (
            id,
            title,
            excerpt,
            featured_image,
            article_label,
            slug,
            published_at,
            views
          )
        `)
        .eq('is_active', true)
        .order('position')
        .limit(4);
      
      if (error) throw error;
      return data;
    }
  });

  // Fallback to recent articles if no homepage articles are configured
  const { data: fallbackArticles } = useQuery({
    queryKey: ['recent-articles-fallback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, excerpt, featured_image, article_label, slug, published_at, views')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    },
    enabled: !homepageArticles?.length
  });

  const articlesToShow = homepageArticles?.length ? 
    homepageArticles.map(ha => ha.articles) : 
    fallbackArticles;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Latest Education News & Updates
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest news, updates, and insights from the education sector
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articlesToShow?.map((article, index) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {article.featured_image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {article.article_label && (
                    <Badge 
                      variant="secondary" 
                      className="bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      {article.article_label}
                    </Badge>
                  )}
                  {index === 0 && !article.article_label && (
                    <Badge 
                      variant="secondary" 
                      className="bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      Top Trending News!!!
                    </Badge>
                  )}
                  <span className="text-sm text-gray-500">
                    {formatDate(article.published_at)}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                {article.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <Link 
                    to={`/articles`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                  
                  {article.views > 0 && (
                    <span className="text-sm text-gray-500">
                      {article.views} views
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/articles"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View All Articles
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DynamicNewsSection;
