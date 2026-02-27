-- Supabase Schema for AI-Powered Code Reviewer

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Users table (Optional: If relying purely on Supabase Auth, you might not need a custom users table, but it's good for extending profiles)
-- We will link it to auth.users

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: Enable Row Level Security (RLS) on the profiles table
alter table public.profiles enable row level security;

-- Create Reviews table to store review history
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null, -- The user who submitted the code
  code_snippet text not null, -- The code submitted for review
  language text not null, -- e.g., 'javascript', 'python'
  score integer constraint score_range check (score >= 0 and score <= 100), -- 0-100 quality score
  syntax_errors jsonb default '[]'::jsonb, -- Array of strings/objects representing syntax errors
  logic_flaws jsonb default '[]'::jsonb, -- Array of strings/objects for logic flaws
  optimization_tips jsonb default '[]'::jsonb, -- Array of strings/objects for tips
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on the reviews table
alter table public.reviews enable row level security;

-- RLS Policies for Profiles
create policy "Users can view their own profile."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- RLS Policies for Reviews
create policy "Users can insert their own reviews."
  on public.reviews for insert
  with check ( auth.uid() = user_id );

create policy "Users can view their own reviews."
  on public.reviews for select
  using ( auth.uid() = user_id );

-- Function to handle new user signups and create a profile automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
