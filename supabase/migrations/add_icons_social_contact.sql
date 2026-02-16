-- Add icon column to social_networks and contact_methods
-- This allows storing uploaded image URLs for each item

ALTER TABLE public.social_networks 
ADD COLUMN IF NOT EXISTS icon text;

ALTER TABLE public.contact_methods 
ADD COLUMN IF NOT EXISTS icon text;
