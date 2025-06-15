
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ArticleList from "./ArticleList";
import ArticleEditor from "./ArticleEditor";
import CategoryManagement from "./CategoryManagement";

const ArticleManagement = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [editingArticle, setEditingArticle] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch articles
  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          article_categories(name, color),
          admin_users(email)
        `)
        .order('updated_at', { ascending: false });
      
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

  const handleCreateNew = () => {
    setEditingArticle(null);
    setActiveTab("editor");
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setActiveTab("editor");
  };

  const handleSaveSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    setActiveTab("list");
    toast({
      title: "Success",
      description: "Article saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Article Management</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Articles</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <ArticleList 
            articles={articles || []}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
        </TabsContent>

        <TabsContent value="editor">
          <ArticleEditor 
            article={editingArticle}
            categories={categories || []}
            onSave={handleSaveSuccess}
            onCancel={() => setActiveTab("list")}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categories={categories || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArticleManagement;
