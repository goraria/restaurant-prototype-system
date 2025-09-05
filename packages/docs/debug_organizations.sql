-- Kiểm tra organizations trong Supabase
SELECT 
  id,
  name,
  code,
  description,
  owner_id,
  created_at
FROM organizations 
ORDER BY created_at DESC 
LIMIT 10;

-- Kiểm tra users để xem owner_id có tồn tại không
SELECT 
  id,
  clerk_id,
  username,
  email,
  full_name
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
