
-- Enable RLS on advertisements table (if not already enabled)
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active advertisements
CREATE POLICY "Anyone can view active advertisements" 
ON public.advertisements 
FOR SELECT 
USING (is_active = true);

-- Allow anyone to view all advertisements (for admin purposes)
CREATE POLICY "Anyone can view all advertisements" 
ON public.advertisements 
FOR SELECT 
USING (true);

-- Allow anyone to insert advertisements (for admin functionality)
CREATE POLICY "Anyone can create advertisements" 
ON public.advertisements 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update advertisements (for admin functionality)
CREATE POLICY "Anyone can update advertisements" 
ON public.advertisements 
FOR UPDATE 
USING (true);

-- Allow anyone to delete advertisements (for admin functionality)
CREATE POLICY "Anyone can delete advertisements" 
ON public.advertisements 
FOR DELETE 
USING (true);
