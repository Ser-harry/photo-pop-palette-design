import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Move, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DatabaseHomepageContent, DatabaseHomepageArticle, DatabaseArticle } from "@/types/database";

interface HeroContentData {
  title: string;
  subtitle: string;
  background_image: string;
  [key: string]: any; // Add index signature for Json compatibility
}

interface CollegeSectionUpdate {
  sectionName: string;
  data: {
    colleges: Array<{ name: string; location: string }>;
  };
}

interface AddToHomepageParams {
  articleId: string;
  position: number;
}

const HomepageContentManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("hero");

  // Fetch homepage content
  const { data: homepageContent } = useQuery({
    queryKey: ['homepage-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as DatabaseHomepageContent[];
    }
  });

  // Fetch homepage articles
  const { data: homepageArticles } = useQuery({
    queryKey: ['homepage-articles'],
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
            article_label
          )
        `)
        .order('position');
      
      if (error) throw error;
      return data as (DatabaseHomepageArticle & { articles: DatabaseArticle })[];
    }
  });

  // Fetch available articles
  const { data: availableArticles } = useQuery({
    queryKey: ['published-articles-for-homepage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, excerpt, featured_image, article_label')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as DatabaseArticle[];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Homepage Content Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="colleges">College Sections</TabsTrigger>
          <TabsTrigger value="news">News Section</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <HeroSectionManager content={homepageContent} />
        </TabsContent>

        <TabsContent value="colleges">
          <CollegeSectionsManager content={homepageContent} />
        </TabsContent>

        <TabsContent value="news">
          <NewsSectionManager 
            homepageArticles={homepageArticles} 
            availableArticles={availableArticles} 
          />
        </TabsContent>

        <TabsContent value="banners">
          <BannersManager content={homepageContent} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const HeroSectionManager = ({ content }: { content: DatabaseHomepageContent[] | undefined }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const heroContent = content?.find(c => c.section_name === 'hero_banner');
  
  // Type-safe content extraction
  const getHeroContent = (content: any): HeroContentData => {
    if (content && typeof content === 'object') {
      return {
        title: content.title || "",
        subtitle: content.subtitle || "",
        background_image: content.background_image || ""
      };
    }
    return { title: "", subtitle: "", background_image: "" };
  };

  const [formData, setFormData] = useState<HeroContentData>(
    getHeroContent(heroContent?.content)
  );

  const updateMutation = useMutation({
    mutationFn: async (data: HeroContentData) => {
      const { error } = await supabase
        .from('homepage_content')
        .update({
          content: data,
          updated_at: new Date().toISOString()
        })
        .eq('section_name', 'hero_banner');
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all homepage-related queries
      queryClient.invalidateQueries({ queryKey: ['homepage-content'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-college-sections'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-news-articles'] });
      toast({ title: "Hero section updated successfully" });
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="hero-title">Main Title</Label>
          <Input
            id="hero-title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Find Your Perfect College"
          />
        </div>
        <div>
          <Label htmlFor="hero-subtitle">Subtitle</Label>
          <Textarea
            id="hero-subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            placeholder="Discover the best educational opportunities..."
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="hero-bg">Background Image URL</Label>
          <Input
            id="hero-bg"
            value={formData.background_image}
            onChange={(e) => setFormData(prev => ({ ...prev, background_image: e.target.value }))}
            placeholder="https://example.com/hero-image.jpg"
          />
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Hero Section"}
        </Button>
      </CardContent>
    </Card>
  );
};

const CollegeSectionsManager = ({ content }: { content: DatabaseHomepageContent[] | undefined }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSection, setEditingSection] = useState<DatabaseHomepageContent | null>(null);

  const sections = content?.filter(c => 
    c.section_name === 'offline_colleges' || c.section_name === 'distance_colleges'
  ) || [];

  const updateMutation = useMutation({
    mutationFn: async ({ sectionName, data }: CollegeSectionUpdate) => {
      const { error } = await supabase
        .from('homepage_content')
        .update({
          content: data,
          updated_at: new Date().toISOString()
        })
        .eq('section_name', sectionName);
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all homepage-related queries
      queryClient.invalidateQueries({ queryKey: ['homepage-content'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-college-sections'] });
      setEditingSection(null);
      toast({ title: "Section updated successfully" });
    }
  });

  // Type-safe college extraction
  const getColleges = (content: any): Array<{ name: string; location: string }> => {
    if (content && typeof content === 'object' && content.colleges && Array.isArray(content.colleges)) {
      return content.colleges;
    }
    return [];
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="capitalize">
                {section.section_name.replace('_', ' ')} Section
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => setEditingSection(section)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium">{section.title}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getColleges(section.content).map((college, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="font-medium">{college.name}</div>
                    <div className="text-sm text-gray-600">{college.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {editingSection && (
        <CollegeSectionEditor
          section={editingSection}
          onSave={(data) => updateMutation.mutate({
            sectionName: editingSection.section_name,
            data
          })}
          onCancel={() => setEditingSection(null)}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  );
};

const CollegeSectionEditor = ({ 
  section, 
  onSave, 
  onCancel, 
  isLoading 
}: { 
  section: DatabaseHomepageContent;
  onSave: (data: { colleges: Array<{ name: string; location: string }> }) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  // Type-safe college extraction
  const getColleges = (content: any): Array<{ name: string; location: string }> => {
    if (content && typeof content === 'object' && content.colleges && Array.isArray(content.colleges)) {
      return content.colleges;
    }
    return [];
  };

  const [formData, setFormData] = useState({
    title: section.title,
    colleges: getColleges(section.content)
  });
  const [newCollege, setNewCollege] = useState({ name: "", location: "" });

  const addCollege = () => {
    if (newCollege.name.trim() && newCollege.location.trim()) {
      setFormData(prev => ({
        ...prev,
        colleges: [...prev.colleges, { ...newCollege }]
      }));
      setNewCollege({ name: "", location: "" });
    }
  };

  const removeCollege = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colleges: prev.colleges.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave({ colleges: formData.colleges });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Colleges</Label>
          <div className="space-y-2 mb-4">
            {formData.colleges.map((college, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                <div className="flex-1">
                  <div className="font-medium">{college.name}</div>
                  <div className="text-sm text-gray-600">{college.location}</div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeCollege(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="College name"
              value={newCollege.name}
              onChange={(e) => setNewCollege(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Location"
              value={newCollege.location}
              onChange={(e) => setNewCollege(prev => ({ ...prev, location: e.target.value }))}
            />
            <Button onClick={addCollege} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add College
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Section"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const NewsSectionManager = ({ 
  homepageArticles, 
  availableArticles 
}: { 
  homepageArticles: (DatabaseHomepageArticle & { articles: DatabaseArticle })[] | undefined;
  availableArticles: DatabaseArticle[] | undefined;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedArticleId, setSelectedArticleId] = useState("");

  const addToHomepageMutation = useMutation({
    mutationFn: async ({ articleId, position }: AddToHomepageParams) => {
      const { error } = await supabase
        .from('homepage_articles')
        .insert([{
          article_id: articleId,
          position,
          section: 'featured',
          is_active: true
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all homepage-related queries
      queryClient.invalidateQueries({ queryKey: ['homepage-articles'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-news-articles'] });
      setSelectedArticleId("");
      toast({ title: "Article added to homepage" });
    }
  });

  const removeFromHomepageMutation = useMutation({
    mutationFn: async (homepageArticleId: string) => {
      const { error } = await supabase
        .from('homepage_articles')
        .delete()
        .eq('id', homepageArticleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all homepage-related queries
      queryClient.invalidateQueries({ queryKey: ['homepage-articles'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-news-articles'] });
      toast({ title: "Article removed from homepage" });
    }
  });

  const handleAddToHomepage = () => {
    if (!selectedArticleId) return;
    
    const nextPosition = (homepageArticles?.length || 0) + 1;
    addToHomepageMutation.mutate({
      articleId: selectedArticleId,
      position: nextPosition
    });
  };

  const availableForHomepage = availableArticles?.filter(article => 
    !homepageArticles?.some(ha => ha.article_id === article.id)
  ) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Homepage News Articles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <select
              value={selectedArticleId}
              onChange={(e) => setSelectedArticleId(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
            >
              <option value="">Select article to add to homepage</option>
              {availableForHomepage.map((article) => (
                <option key={article.id} value={article.id}>
                  {article.title}
                </option>
              ))}
            </select>
            <Button 
              onClick={handleAddToHomepage}
              disabled={!selectedArticleId || addToHomepageMutation.isPending}
            >
              Add to Homepage
            </Button>
          </div>

          <div className="space-y-3">
            {homepageArticles?.map((homepageArticle) => (
              <div key={homepageArticle.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  {homepageArticle.position}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{homepageArticle.articles?.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {homepageArticle.articles?.excerpt}
                  </p>
                  {homepageArticle.articles?.article_label && (
                    <Badge variant="secondary" className="mt-1">
                      {homepageArticle.articles?.article_label}
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeFromHomepageMutation.mutate(homepageArticle.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {!homepageArticles?.length && (
            <div className="text-center py-8 text-gray-500">
              No articles selected for homepage. Add some articles above.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const BannersManager = ({ content }: { content: DatabaseHomepageContent[] | undefined }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Banner Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Banner management coming soon. This will include promotional banners, 
          announcement bars, and other marketing content.
        </div>
      </CardContent>
    </Card>
  );
};

export default HomepageContentManagement;
