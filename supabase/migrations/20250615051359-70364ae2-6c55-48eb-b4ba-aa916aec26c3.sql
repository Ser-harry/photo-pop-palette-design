
-- Create function to increment ad impressions atomically
CREATE OR REPLACE FUNCTION public.increment_ad_impressions(ad_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.advertisements 
  SET impressions = impressions + 1
  WHERE id = ad_id;
END;
$function$;

-- Create function to increment ad clicks atomically
CREATE OR REPLACE FUNCTION public.increment_ad_clicks(ad_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.advertisements 
  SET clicks = clicks + 1
  WHERE id = ad_id;
END;
$function$;
