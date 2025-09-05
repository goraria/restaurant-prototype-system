-- Create users table for Clerk integration
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role can manage all users" 
ON public.users 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Create policy for authenticated users to read their own data
CREATE POLICY "Users can read own data" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (auth.uid()::text = id);

-- Create policy for authenticated users to update their own data
CREATE POLICY "Users can update own data" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);
