-- Ensure new auth users get a profile row
create trigger if not exists on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Allow admins to view all profiles (for admin user management and dropdowns)
create policy if not exists "Admins can view all profiles"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );