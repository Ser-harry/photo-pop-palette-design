
-- Create colleges table
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('government', 'aided', 'self-financing')),
  naac_grade TEXT,
  established INTEGER,
  website TEXT,
  facilities TEXT[],
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create branches table
CREATE TABLE public.branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  duration TEXT NOT NULL DEFAULT '4 years',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cutoff_data table
CREATE TABLE public.cutoff_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('OC', 'BC', 'MBC', 'SC', 'ST')),
  cutoff_mark NUMERIC NOT NULL,
  opening_rank INTEGER,
  closing_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(college_id, branch_id, year, category)
);

-- Create advertisements table
CREATE TABLE public.advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  placement TEXT NOT NULL CHECK (placement IN ('home', 'results', 'sidebar')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  clicks INTEGER NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_bookmarks table
CREATE TABLE public.user_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, college_id, branch_id)
);

-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  preferred_district TEXT,
  tnea_marks INTEGER,
  category TEXT CHECK (category IN ('OC', 'BC', 'MBC', 'SC', 'ST')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create search_analytics table
CREATE TABLE public.search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  marks INTEGER NOT NULL,
  category TEXT NOT NULL,
  preferred_district TEXT,
  college_types TEXT[],
  branches TEXT[],
  results_count INTEGER NOT NULL DEFAULT 0,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create page_views table for analytics
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  device_type TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample branches
INSERT INTO public.branches (name, code, duration) VALUES
('Computer Science and Engineering', 'CSE', '4 years'),
('Electronics and Communication Engineering', 'ECE', '4 years'),
('Mechanical Engineering', 'MECH', '4 years'),
('Civil Engineering', 'CIVIL', '4 years'),
('Electrical and Electronics Engineering', 'EEE', '4 years'),
('Information Technology', 'IT', '4 years'),
('Biomedical Engineering', 'BME', '4 years'),
('Chemical Engineering', 'CHEM', '4 years'),
('Aeronautical Engineering', 'AERO', '4 years'),
('Automobile Engineering', 'AUTO', '4 years');

-- Insert sample colleges
INSERT INTO public.colleges (name, slug, location, district, type, naac_grade, established, website, facilities, featured) VALUES
('Indian Institute of Technology Madras', 'iit-madras', 'Chennai', 'Chennai', 'government', 'A++', 1959, 'https://www.iitm.ac.in', ARRAY['Library', 'Hostel', 'Labs', 'Sports Complex', 'WiFi'], true),
('National Institute of Technology Tiruchirappalli', 'nit-trichy', 'Tiruchirappalli', 'Tiruchirappalli', 'government', 'A+', 1964, 'https://www.nitt.edu', ARRAY['Library', 'Hostel', 'Labs', 'Sports Complex', 'WiFi'], true),
('Anna University', 'anna-university', 'Chennai', 'Chennai', 'government', 'A', 1978, 'https://www.annauniv.edu', ARRAY['Library', 'Hostel', 'Labs', 'Research Centers'], true),
('PSG College of Technology', 'psg-tech', 'Coimbatore', 'Coimbatore', 'aided', 'A', 1951, 'https://www.psgtech.edu', ARRAY['Library', 'Hostel', 'Labs', 'Industry Partnerships'], false),
('SSN College of Engineering', 'ssn-college', 'Chennai', 'Chennai', 'self-financing', 'A', 1996, 'https://www.ssn.edu.in', ARRAY['Library', 'Hostel', 'Labs', 'Research Centers'], false);

-- Enable RLS on all tables
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cutoff_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Create public read policies for public data
CREATE POLICY "Public can view colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Public can view branches" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Public can view cutoff data" ON public.cutoff_data FOR SELECT USING (true);
CREATE POLICY "Public can view active advertisements" ON public.advertisements FOR SELECT USING (is_active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

-- Create user-specific policies
CREATE POLICY "Users can view their own bookmarks" ON public.user_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookmarks" ON public.user_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON public.user_bookmarks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Analytics policies (allow anonymous data collection)
CREATE POLICY "Anyone can insert search analytics" ON public.search_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (true);

-- Admin policies (restrict to authenticated users for now - will be refined later)
CREATE POLICY "Authenticated users can manage colleges" ON public.colleges FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage branches" ON public.branches FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage cutoff data" ON public.cutoff_data FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage advertisements" ON public.advertisements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view analytics" ON public.search_analytics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view page views" ON public.page_views FOR SELECT USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON public.colleges FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON public.advertisements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
