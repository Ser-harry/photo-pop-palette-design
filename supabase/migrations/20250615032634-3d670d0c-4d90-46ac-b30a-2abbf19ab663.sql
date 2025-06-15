
-- Create article categories table
CREATE TABLE public.article_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create articles table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES public.admin_users(id) NOT NULL,
  category_id UUID REFERENCES public.article_categories(id),
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured_image TEXT,
  meta_description TEXT,
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on both tables
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- RLS policies for article_categories
CREATE POLICY "Anyone can view published categories"
  ON public.article_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.article_categories
  FOR ALL
  USING (public.is_admin_user(auth.uid()));

-- RLS policies for articles
CREATE POLICY "Anyone can view published articles"
  ON public.articles
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view all articles"
  ON public.articles
  FOR SELECT
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can create articles"
  ON public.articles
  FOR INSERT
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update articles"
  ON public.articles
  FOR UPDATE
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete articles"
  ON public.articles
  FOR DELETE
  USING (public.is_admin_user(auth.uid()));

-- Create trigger to update updated_at column
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_article_categories_updated_at
  BEFORE UPDATE ON public.article_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.article_categories (name, slug, description, color) VALUES
('Engineering', 'engineering', 'Engineering colleges and courses', '#3B82F6'),
('Medical', 'medical', 'Medical colleges and entrance exams', '#EF4444'),
('Exam News', 'exam-news', 'Latest exam updates and notifications', '#F59E0B'),
('College News', 'college-news', 'College announcements and updates', '#10B981'),
('Career Guidance', 'career-guidance', 'Career tips and guidance', '#8B5CF6');
