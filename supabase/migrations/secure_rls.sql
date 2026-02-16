-- SECURE RLS POLICIES SCRIPT
-- Run this in your Supabase SQL Editor to secure your database.

-- 1. Enable RLS on all tables (already enabled, but good to ensure)
alter table public.projects enable row level security;
alter table public.social_networks enable row level security;
alter table public.contact_methods enable row level security;

-- 2. Drop existing insecure policies (that allow public modification)
drop policy if exists "Enable insert for all users" on public.projects;
drop policy if exists "Enable update for all users" on public.projects;
drop policy if exists "Enable delete for all users" on public.projects;
drop policy if exists "Enable modification for all users" on public.social_networks;
drop policy if exists "Enable modification for all users" on public.contact_methods;

-- 3. Create NEW strict policies
-- READ: Public (Anyone can view the portfolio)
create policy "Public Read Projects" on public.projects for select using (true);
create policy "Public Read Social" on public.social_networks for select using (true);
create policy "Public Read Contact" on public.contact_methods for select using (true);

-- WRITE/UPDATE/DELETE: Authenticated Users Only
-- Projects
create policy "Auth Write Projects" on public.projects for insert with check (auth.role() = 'authenticated');
create policy "Auth Update Projects" on public.projects for update using (auth.role() = 'authenticated');
create policy "Auth Delete Projects" on public.projects for delete using (auth.role() = 'authenticated');

-- Social Networks
create policy "Auth Write Social" on public.social_networks for insert with check (auth.role() = 'authenticated');
create policy "Auth Update Social" on public.social_networks for update using (auth.role() = 'authenticated');
create policy "Auth Delete Social" on public.social_networks for delete using (auth.role() = 'authenticated');

-- Contact Methods
create policy "Auth Write Contact" on public.contact_methods for insert with check (auth.role() = 'authenticated');
create policy "Auth Update Contact" on public.contact_methods for update using (auth.role() = 'authenticated');
create policy "Auth Delete Contact" on public.contact_methods for delete using (auth.role() = 'authenticated');

-- Storage Policies (Optional, if using storage)
-- If you have a bucket 'portfolio-assets', restrict uploads:
-- drop policy if exists "Public Upload" on storage.objects;
-- create policy "Auth Upload" on storage.objects for insert with check ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );
