
-- Create promotional_profiles table for storing promotional user profiles
CREATE TABLE IF NOT EXISTS public.promotional_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  bio TEXT,
  role TEXT DEFAULT 'Promotional User',
  avatar_url TEXT,
  website TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_promotional_profiles junction table for associations
CREATE TABLE IF NOT EXISTS public.user_promotional_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  main_user_id UUID REFERENCES auth.users NOT NULL,
  promotional_profile_id UUID REFERENCES public.promotional_profiles NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(main_user_id, promotional_profile_id)
);

-- Create streams table for managing live streams
CREATE TABLE IF NOT EXISTS public.streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  stream_type TEXT DEFAULT 'live' CHECK (stream_type IN ('live', 'podcast', 'broadcast', 'video')),
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'scheduled', 'ended')),
  viewer_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  stream_url TEXT,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stream_integrations table for external platform integrations
CREATE TABLE IF NOT EXISTS public.stream_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  platform TEXT NOT NULL,
  stream_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.promotional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_promotional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for promotional_profiles (publicly readable)
CREATE POLICY "Anyone can view promotional profiles" 
  ON public.promotional_profiles 
  FOR SELECT 
  USING (true);

-- RLS Policies for user_promotional_profiles
CREATE POLICY "Users can view their own associations" 
  ON public.user_promotional_profiles 
  FOR SELECT 
  USING (auth.uid() = main_user_id);

CREATE POLICY "Users can create their own associations" 
  ON public.user_promotional_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = main_user_id);

CREATE POLICY "Users can delete their own associations" 
  ON public.user_promotional_profiles 
  FOR DELETE 
  USING (auth.uid() = main_user_id);

-- RLS Policies for streams
CREATE POLICY "Anyone can view active streams" 
  ON public.streams 
  FOR SELECT 
  USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own streams" 
  ON public.streams 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streams" 
  ON public.streams 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own streams" 
  ON public.streams 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for stream_integrations
CREATE POLICY "Users can manage their own integrations" 
  ON public.stream_integrations 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Insert sample promotional profiles
INSERT INTO public.promotional_profiles (full_name, username, bio, avatar_url, website, tags) VALUES
('Bantu Doll One', 'bantudoll1', 'TikTok Live Streamer - Entertainment and lifestyle content', '/placeholder.svg', 'https://www.tiktok.com/@bantudoll1/live', ARRAY['Entertainment', 'Lifestyle', 'TikTok']),
('Future Bar', 'futurebae369', 'TikTok Live Streamer - Future trends and lifestyle', '/placeholder.svg', 'https://www.tiktok.com/@futurebae369/live', ARRAY['Trends', 'Lifestyle', 'TikTok']),
('Coco Vybes', 'theboujiehousewife', 'TikTok Live Streamer - Lifestyle and home content', '/placeholder.svg', 'https://www.tiktok.com/@theboujiehousewife/live', ARRAY['Lifestyle', 'Home', 'TikTok']),
('Plois', 'plmakeupacademy', 'TikTok Live Streamer - Makeup tutorials and beauty content', '/placeholder.svg', 'https://www.tiktok.com/@plmakeupacademy/live', ARRAY['Beauty', 'Makeup', 'Education', 'TikTok']),
('Kids Korner', '1ranta.and.a.dream', 'TikTok Live Streamer - Kids content and family entertainment', '/placeholder.svg', 'https://www.tiktok.com/@1ranta.and.a.dream/live', ARRAY['Kids', 'Family', 'Entertainment', 'TikTok'])
ON CONFLICT (username) DO NOTHING;

-- Database functions for promotional profiles
CREATE OR REPLACE FUNCTION public.get_promotional_profiles()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  username TEXT,
  bio TEXT,
  role TEXT,
  avatar_url TEXT,
  website TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id, full_name, username, bio, role, avatar_url, website, tags, created_at
  FROM public.promotional_profiles
  ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_user_promotional_profiles(user_uuid UUID)
RETURNS TABLE (promotional_profile_id UUID)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT upp.promotional_profile_id
  FROM public.user_promotional_profiles upp
  WHERE upp.main_user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.associate_promotional_profile(user_uuid UUID, profile_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_promotional_profiles (main_user_id, promotional_profile_id)
  VALUES (user_uuid, profile_uuid)
  ON CONFLICT (main_user_id, promotional_profile_id) DO NOTHING;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.disassociate_promotional_profile(user_uuid UUID, profile_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.user_promotional_profiles
  WHERE main_user_id = user_uuid AND promotional_profile_id = profile_uuid;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Functions for stream management
CREATE OR REPLACE FUNCTION public.create_stream(
  user_uuid UUID,
  stream_title TEXT,
  stream_description TEXT DEFAULT NULL,
  stream_type_param TEXT DEFAULT 'live',
  stream_tags TEXT[] DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_stream_id UUID;
BEGIN
  INSERT INTO public.streams (user_id, title, description, stream_type, tags, status)
  VALUES (user_uuid, stream_title, stream_description, stream_type_param, stream_tags, 'active')
  RETURNING id INTO new_stream_id;
  
  RETURN new_stream_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_stream_status(stream_uuid UUID, new_status TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.streams
  SET status = new_status,
      started_at = CASE WHEN new_status = 'active' AND started_at IS NULL THEN now() ELSE started_at END,
      ended_at = CASE WHEN new_status = 'ended' THEN now() ELSE NULL END,
      updated_at = now()
  WHERE id = stream_uuid AND user_id = auth.uid();
  
  RETURN FOUND;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_active_streams()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  description TEXT,
  stream_type TEXT,
  viewer_count INTEGER,
  likes_count INTEGER,
  tags TEXT[],
  started_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT s.id, s.user_id, s.title, s.description, s.stream_type, 
         s.viewer_count, s.likes_count, s.tags, s.started_at, s.created_at
  FROM public.streams s
  WHERE s.status = 'active'
  ORDER BY s.started_at DESC, s.created_at DESC;
$$;
