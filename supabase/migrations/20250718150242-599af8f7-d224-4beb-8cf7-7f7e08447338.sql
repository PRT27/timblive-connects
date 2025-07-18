-- First delete the old profile to avoid conflicts
DELETE FROM public.profiles WHERE id = '517b008b-3d79-4855-bf12-13afc238f119';

-- Update the profile for user 5545eb4d-d53a-4b5a-896b-584c3a44d6c4 (Percy Thwala -> NP Thwala)
UPDATE public.profiles 
SET full_name = 'NP Thwala',
    username = 'NPThwala',
    bio = 'Creating innovative tech solutions with a focus on accessibility and assistive technology.',
    role = 'creator',
    updated_at = now()
WHERE id = '5545eb4d-d53a-4b5a-896b-584c3a44d6c4';