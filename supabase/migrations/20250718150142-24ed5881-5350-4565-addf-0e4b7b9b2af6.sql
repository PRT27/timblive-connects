-- Transfer user data and rename profile
-- First, backup the existing data by moving it to the target user

-- Update the profile for user 5545eb4d-d53a-4b5a-896b-584c3a44d6c4 (Percy Thwala -> NP Thwala)
UPDATE public.profiles 
SET full_name = 'NP Thwala',
    username = 'NPThwala',
    bio = 'Creating innovative tech solutions with a focus on accessibility and assistive technology.',
    role = 'creator',
    updated_at = now()
WHERE id = '5545eb4d-d53a-4b5a-896b-584c3a44d6c4';

-- Transfer streams from old user to new user if needed
UPDATE public.streams 
SET user_id = '5545eb4d-d53a-4b5a-896b-584c3a44d6c4'
WHERE user_id = '517b008b-3d79-4855-bf12-13afc238f119';

-- Transfer stream integrations
UPDATE public.stream_integrations 
SET user_id = '5545eb4d-d53a-4b5a-896b-584c3a44d6c4'
WHERE user_id = '517b008b-3d79-4855-bf12-13afc238f119';

-- Transfer promotional profile associations
UPDATE public.user_promotional_profiles 
SET main_user_id = '5545eb4d-d53a-4b5a-896b-584c3a44d6c4'
WHERE main_user_id = '517b008b-3d79-4855-bf12-13afc238f119';

-- Transfer copyright claims
UPDATE public.copyright_claims 
SET content_owner_id = '5545eb4d-d53a-4b5a-896b-584c3a44d6c4'
WHERE content_owner_id = '517b008b-3d79-4855-bf12-13afc238f119';

-- Transfer content licenses
UPDATE public.content_licenses 
SET content_owner_id = '5545eb4d-d53a-4b5a-896b-584c3a44d6c4'
WHERE content_owner_id = '517b008b-3d79-4855-bf12-13afc238f119';

-- Transfer ad space requests
UPDATE public.ad_space_requests 
SET content_owner_id = '5545eb4d-d53a-4b5a-896b-584c3a44d6c4'
WHERE content_owner_id = '517b008b-3d79-4855-bf12-13afc238f119';

-- Transfer advertising agency data
UPDATE public.advertising_agencies 
SET user_id = '5545eb4d-d53a-4b5a-896b-584c3a44d6c4'
WHERE user_id = '517b008b-3d79-4855-bf12-13afc238f119';

-- Transfer content usage monitoring
UPDATE public.content_usage_monitoring 
SET content_owner_id = '5545eb4d-d53a-4b5a-896b-584c3a44d6c4'
WHERE content_owner_id = '517b008b-3d79-4855-bf12-13afc238f119';

UPDATE public.content_usage_monitoring 
SET reported_by = '5545eb4d-d53a-4b5a-896b-584c3a44d6c4'
WHERE reported_by = '517b008b-3d79-4855-bf12-13afc238f119';