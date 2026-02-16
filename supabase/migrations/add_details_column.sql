-- Add additional_info column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS "additional_info" text;
