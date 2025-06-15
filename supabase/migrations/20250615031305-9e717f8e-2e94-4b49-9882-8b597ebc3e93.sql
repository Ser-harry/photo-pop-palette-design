
-- Update the admin_users table to link to the correct auth user
UPDATE public.admin_users 
SET 
  user_id = '78798c67-8bed-4bd2-8a09-3237cb6d3ee2',
  email = 'hariraam117@gmail.com'
WHERE email = 'admin@kollegeapply.com' OR user_id IS NULL;
