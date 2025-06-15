
-- Update the category constraint to include new categories from your Excel
ALTER TABLE public.cutoff_data DROP CONSTRAINT IF EXISTS cutoff_data_category_check;
ALTER TABLE public.cutoff_data ADD CONSTRAINT cutoff_data_category_check 
CHECK (category IN ('OC', 'BC', 'BCM', 'MBC', 'MBCDNC', 'MBCV', 'SC', 'SCA', 'ST'));

-- Add missing college details columns to colleges table
ALTER TABLE public.colleges 
ADD COLUMN IF NOT EXISTS principal_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

-- Insert new branches that appear in your Excel data
INSERT INTO public.branches (name, code, duration) VALUES
('BIO MEDICAL ENGINEERING (SS)', 'BY', '4 years'),
('CIVIL ENGINEERING', 'CE', '4 years')
ON CONFLICT (code) DO NOTHING;

-- Add Anna University Chennai - CEG Campus if it doesn't exist
INSERT INTO public.colleges (
  name, 
  slug, 
  location, 
  district, 
  type, 
  naac_grade, 
  established, 
  website, 
  facilities, 
  featured,
  address
) VALUES (
  'University Departments of Anna University Chennai - CEG Campus',
  'anna-university-ceg',
  'Chennai',
  'Chennai',
  'government',
  'A++',
  1978,
  'https://www.annauniv.edu',
  ARRAY['Library', 'Labs', 'Research Centers', 'Hostel'],
  true,
  'Sardar Patel Road Guindy Chennai 600 025'
) ON CONFLICT (slug) DO NOTHING;

-- Create a temporary table to help with data import process
CREATE TABLE IF NOT EXISTS public.temp_cutoff_import (
  id SERIAL PRIMARY KEY,
  college_name TEXT,
  branch_code TEXT,
  branch_name TEXT,
  oc NUMERIC,
  bc NUMERIC,
  bcm NUMERIC,
  mbc NUMERIC,
  mbcdnc NUMERIC,
  mbcv NUMERIC,
  sc NUMERIC,
  sca NUMERIC,
  st NUMERIC,
  year INTEGER DEFAULT 2024,
  processed BOOLEAN DEFAULT FALSE
);

-- Create function to process the imported data and convert to long format
CREATE OR REPLACE FUNCTION public.process_cutoff_import(import_year INTEGER DEFAULT 2024)
RETURNS INTEGER AS $$
DECLARE
  rec RECORD;
  college_uuid UUID;
  branch_uuid UUID;
  processed_count INTEGER := 0;
BEGIN
  -- Loop through unprocessed temp data
  FOR rec IN SELECT * FROM public.temp_cutoff_import WHERE NOT processed LOOP
    
    -- Find or get college ID
    SELECT id INTO college_uuid 
    FROM public.colleges 
    WHERE name ILIKE '%' || rec.college_name || '%' 
    LIMIT 1;
    
    -- Find or get branch ID
    SELECT id INTO branch_uuid 
    FROM public.branches 
    WHERE code = rec.branch_code 
    LIMIT 1;
    
    -- If both college and branch found, insert cutoff data
    IF college_uuid IS NOT NULL AND branch_uuid IS NOT NULL THEN
      
      -- Insert data for each category (converting wide to long format)
      INSERT INTO public.cutoff_data (college_id, branch_id, year, category, cutoff_mark)
      VALUES 
        (college_uuid, branch_uuid, import_year, 'OC', rec.oc),
        (college_uuid, branch_uuid, import_year, 'BC', rec.bc),
        (college_uuid, branch_uuid, import_year, 'BCM', rec.bcm),
        (college_uuid, branch_uuid, import_year, 'MBC', rec.mbc),
        (college_uuid, branch_uuid, import_year, 'MBCDNC', rec.mbcdnc),
        (college_uuid, branch_uuid, import_year, 'MBCV', rec.mbcv),
        (college_uuid, branch_uuid, import_year, 'SC', rec.sc),
        (college_uuid, branch_uuid, import_year, 'SCA', rec.sca),
        (college_uuid, branch_uuid, import_year, 'ST', rec.st)
      ON CONFLICT (college_id, branch_id, year, category) 
      DO UPDATE SET cutoff_mark = EXCLUDED.cutoff_mark;
      
      -- Mark as processed
      UPDATE public.temp_cutoff_import 
      SET processed = TRUE 
      WHERE id = rec.id;
      
      processed_count := processed_count + 1;
    END IF;
    
  END LOOP;
  
  RETURN processed_count;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data from your example
INSERT INTO public.temp_cutoff_import (
  college_name, branch_code, branch_name, oc, bc, bcm, mbc, mbcdnc, mbcv, sc, sca, st
) VALUES 
(
  'University Departments of Anna University Chennai - CEG Campus Sardar Patel Road Guindy Chennai 600 025',
  'BY',
  'BIO MEDICAL ENGINEERING (SS)',
  195, 192, 193, 193, 182.5, 168, NULL, NULL, NULL
),
(
  'University Departments of Anna University Chennai - CEG Campus Sardar Patel Road Guindy Chennai 600 025',
  'CE', 
  'CIVIL ENGINEERING',
  195, 192, 190, 193.5, 186, 176, NULL, NULL, NULL
);
