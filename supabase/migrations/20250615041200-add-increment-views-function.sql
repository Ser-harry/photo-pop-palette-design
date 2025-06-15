
-- Create function to increment article views
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id UUID)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE public.articles 
  SET views = views + 1 
  WHERE id = article_id;
$$;
