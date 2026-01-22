-- Existing products table (kept for context, but you likely only need to run the new parts)
-- create table if not exists products ...

-- Profiles table to store user subscription data
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key, email text, full_name text, subscription_tier text default 'Free', -- 'Free', 'Pro', 'Business'
    created_at timestamp
    with
        time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view their own profile" on public.profiles for
select using (auth.uid () = id);

create policy "Users can update their own profile" on public.profiles for
update using (auth.uid () = id);

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as 
$$
begin
	insert into
	    public.profiles (id, email, full_name)
	values (
	        new.id, new.email, new.raw_user_meta_data ->> 'full_name'
	    );
	return new;
end;
$$
language
plpgsql 

security definer;

-- Trigger to call the function on new user creation
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created after
insert
    on auth.users for each row
execute procedure public.handle_new_user ();