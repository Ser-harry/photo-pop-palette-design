
-- Add homepage_content table for managing dynamic homepage sections
CREATE TABLE public.homepage_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add homepage_articles table for managing which articles appear on homepage
CREATE TABLE public.homepage_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  section TEXT NOT NULL DEFAULT 'featured',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent duplicate articles in same position
ALTER TABLE public.homepage_articles 
ADD CONSTRAINT unique_homepage_article_position 
UNIQUE (position, section);

-- Add image_url column to colleges table for college logos/images
ALTER TABLE public.colleges 
ADD COLUMN image_url TEXT;

-- Add homepage_featured column to colleges for better homepage control
ALTER TABLE public.colleges 
ADD COLUMN homepage_featured BOOLEAN NOT NULL DEFAULT false;

-- Add display_order column to colleges for ordering on homepage
ALTER TABLE public.colleges 
ADD COLUMN display_order INTEGER DEFAULT 0;

-- Add article_label column to articles for badges like "Top Trending News"
ALTER TABLE public.articles 
ADD COLUMN article_label TEXT;

-- Create indexes for better performance
CREATE INDEX idx_colleges_featured ON colleges(featured, homepage_featured);
CREATE INDEX idx_colleges_display_order ON colleges(display_order);
CREATE INDEX idx_homepage_articles_position ON homepage_articles(position, section);
CREATE INDEX idx_articles_featured ON articles(featured, status);

-- Insert default homepage content sections
INSERT INTO public.homepage_content (section_name, title, content) VALUES
('offline_colleges', 'Offline Colleges', '{"colleges": [
  {"name": "International Institute of Information Technology, Bangalore", "location": "Hosur Road, Bangalore"},
  {"name": "All India Institute of Medical Sciences, Delhi", "location": "Gautam Nagar, Delhi"},
  {"name": "IIIT Delhi - Indraprastha Institute of Information Technology", "location": "Okhla, Delhi"},
  {"name": "IIT Patna - Indian Institute of Technology", "location": "Patna"}
]}'),
('distance_colleges', 'Distance Colleges', '{"colleges": [
  {"name": "D.Y. Patil Deemed-to-be-University Online, Padmashree Dr. D.Y. Patil Vidyapeeth, Navi Mumbai", "location": "Navi Mumbai"},
  {"name": "UPES Online", "location": "Dehradun"},
  {"name": "VIGNAN Online", "location": "Guntur"},
  {"name": "ICFAI University – Distance Education", "location": "Koramangala, Bangalore"}
]}'),
('hero_banner', 'Hero Section', '{"title": "Find Your Perfect College", "subtitle": "Discover the best educational opportunities in Tamil Nadu", "background_image": ""}');

-- Add RLS policies for new tables
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access for homepage content
CREATE POLICY "Public can view homepage content" 
  ON public.homepage_content 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Public can view homepage articles" 
  ON public.homepage_articles 
  FOR SELECT 
  TO public 
  USING (true);

-- Allow admin users to manage homepage content
CREATE POLICY "Admins can manage homepage content" 
  ON public.homepage_content 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage homepage articles" 
  ON public.homepage_articles 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- Create trigger for updating homepage_content updated_at
CREATE TRIGGER update_homepage_content_updated_at
  BEFORE UPDATE ON public.homepage_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
