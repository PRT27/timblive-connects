
-- Create copyright_claims table for content protection
CREATE TABLE IF NOT EXISTS public.copyright_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_owner_id UUID REFERENCES auth.users NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('stream', 'video', 'podcast', 'broadcast')),
  content_id UUID NOT NULL,
  claim_type TEXT DEFAULT 'dmca' CHECK (claim_type IN ('dmca', 'copyright', 'trademark')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'disputed')),
  description TEXT,
  evidence_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_licenses table for licensing management
CREATE TABLE IF NOT EXISTS public.content_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_owner_id UUID REFERENCES auth.users NOT NULL,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  license_type TEXT DEFAULT 'all_rights_reserved' CHECK (license_type IN ('all_rights_reserved', 'creative_commons', 'commercial_use', 'non_commercial')),
  terms TEXT,
  price DECIMAL(10,2),
  duration_days INTEGER,
  auto_approve BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create advertising_agencies table
CREATE TABLE IF NOT EXISTS public.advertising_agencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  company_name TEXT NOT NULL,
  business_license TEXT,
  tax_id TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_documents TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ad_space_requests table
CREATE TABLE IF NOT EXISTS public.ad_space_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES public.advertising_agencies NOT NULL,
  content_owner_id UUID REFERENCES auth.users NOT NULL,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  ad_duration INTEGER, -- in seconds
  proposed_price DECIMAL(10,2),
  campaign_description TEXT,
  target_audience TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_usage_monitoring table
CREATE TABLE IF NOT EXISTS public.content_usage_monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_owner_id UUID REFERENCES auth.users NOT NULL,
  content_id UUID NOT NULL,
  usage_platform TEXT,
  detected_url TEXT,
  usage_type TEXT CHECK (usage_type IN ('unauthorized', 'licensed', 'fair_use')),
  reported_by UUID REFERENCES auth.users,
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'investigating', 'resolved', 'false_positive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.copyright_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertising_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_space_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_usage_monitoring ENABLE ROW LEVEL SECURITY;

-- RLS Policies for copyright_claims
CREATE POLICY "Users can manage their own copyright claims" 
  ON public.copyright_claims 
  FOR ALL 
  USING (auth.uid() = content_owner_id);

-- RLS Policies for content_licenses
CREATE POLICY "Users can manage their own content licenses" 
  ON public.content_licenses 
  FOR ALL 
  USING (auth.uid() = content_owner_id);

CREATE POLICY "Anyone can view active licenses for licensing" 
  ON public.content_licenses 
  FOR SELECT 
  USING (true);

-- RLS Policies for advertising_agencies
CREATE POLICY "Users can manage their own agency profile" 
  ON public.advertising_agencies 
  FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Verified agencies are publicly viewable" 
  ON public.advertising_agencies 
  FOR SELECT 
  USING (verification_status = 'verified');

-- RLS Policies for ad_space_requests
CREATE POLICY "Agencies can manage their own requests" 
  ON public.ad_space_requests 
  FOR ALL 
  USING (auth.uid() IN (
    SELECT user_id FROM public.advertising_agencies WHERE id = agency_id
  ));

CREATE POLICY "Content owners can view and respond to requests" 
  ON public.ad_space_requests 
  FOR SELECT 
  USING (auth.uid() = content_owner_id);

CREATE POLICY "Content owners can update request status" 
  ON public.ad_space_requests 
  FOR UPDATE 
  USING (auth.uid() = content_owner_id);

-- RLS Policies for content_usage_monitoring
CREATE POLICY "Users can view monitoring for their content" 
  ON public.content_usage_monitoring 
  FOR SELECT 
  USING (auth.uid() = content_owner_id OR auth.uid() = reported_by);

CREATE POLICY "Users can report unauthorized usage" 
  ON public.content_usage_monitoring 
  FOR INSERT 
  WITH CHECK (auth.uid() = reported_by);

-- Functions for copyright protection
CREATE OR REPLACE FUNCTION public.create_copyright_claim(
  owner_uuid UUID,
  content_type_param TEXT,
  content_uuid UUID,
  claim_description TEXT,
  evidence_urls_param TEXT[] DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_claim_id UUID;
BEGIN
  INSERT INTO public.copyright_claims (content_owner_id, content_type, content_id, description, evidence_urls)
  VALUES (owner_uuid, content_type_param, content_uuid, claim_description, evidence_urls_param)
  RETURNING id INTO new_claim_id;
  
  RETURN new_claim_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Function for agency registration
CREATE OR REPLACE FUNCTION public.register_advertising_agency(
  user_uuid UUID,
  company_name_param TEXT,
  contact_email_param TEXT,
  business_license_param TEXT DEFAULT NULL,
  website_param TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_agency_id UUID;
BEGIN
  INSERT INTO public.advertising_agencies (user_id, company_name, contact_email, business_license, website)
  VALUES (user_uuid, company_name_param, contact_email_param, business_license_param, website_param)
  RETURNING id INTO new_agency_id;
  
  RETURN new_agency_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Function for ad space requests
CREATE OR REPLACE FUNCTION public.request_ad_space(
  agency_uuid UUID,
  content_owner_uuid UUID,
  content_type_param TEXT,
  content_uuid UUID,
  proposed_price_param DECIMAL,
  campaign_desc TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_request_id UUID;
BEGIN
  INSERT INTO public.ad_space_requests (agency_id, content_owner_id, content_type, content_id, proposed_price, campaign_description)
  VALUES (agency_uuid, content_owner_uuid, content_type_param, content_uuid, proposed_price_param, campaign_desc)
  RETURNING id INTO new_request_id;
  
  RETURN new_request_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Function to get user's copyright status
CREATE OR REPLACE FUNCTION public.get_user_copyright_status(user_uuid UUID)
RETURNS TABLE (
  total_claims INTEGER,
  active_claims INTEGER,
  content_licenses INTEGER,
  ad_requests INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(cc.id)::INTEGER as total_claims,
    COUNT(CASE WHEN cc.status = 'active' THEN 1 END)::INTEGER as active_claims,
    COUNT(cl.id)::INTEGER as content_licenses,
    COUNT(ar.id)::INTEGER as ad_requests
  FROM public.copyright_claims cc
  FULL OUTER JOIN public.content_licenses cl ON cl.content_owner_id = user_uuid
  FULL OUTER JOIN public.ad_space_requests ar ON ar.content_owner_id = user_uuid
  WHERE cc.content_owner_id = user_uuid OR cl.content_owner_id = user_uuid OR ar.content_owner_id = user_uuid;
$$;
