-- Products Table - stores product data from scrapers
create table if not exists public.products (
    id text primary key,
    name text not null,
    category text,
    price numeric,
    image_url text,
    velocity_score integer,
    saturation_score integer,
    demand_signal text check (demand_signal in ('bullish', 'caution', 'bearish', 'neutral')),
    weekly_growth numeric,
    reddit_mentions integer,
    sentiment_score integer,
    top_reddit_themes text[],
    last_updated text,
    source text,
    rating numeric,
    review_count integer,
    ad_signal text check (ad_signal in ('high', 'medium', 'low')),
    social_signals jsonb,
    faqs jsonb,
    competitors jsonb,
    reddit_threads jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create indexes for products table
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_created_at on public.products(created_at);
create index if not exists idx_products_velocity on public.products(velocity_score);
create index if not exists idx_products_demand on public.products(demand_signal);

-- Enable RLS on products
alter table public.products enable row level security;

-- Products are publicly readable
create policy "Products are publicly readable" on public.products for select using (true);

-- User activity tracking table
create table if not exists public.user_activity (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade not null,
    activity_type text not null, -- 'view', 'analyze', 'compare', 'search'
    product_id text references public.products on delete set null,
    metadata jsonb, -- stores extra data like search query, comparison ids, etc
    created_at timestamp with time zone default now()
);

-- Create indexes for user_activity
create index if not exists idx_activity_user on public.user_activity(user_id);
create index if not exists idx_activity_type on public.user_activity(activity_type);
create index if not exists idx_activity_created on public.user_activity(created_at);

-- Enable RLS on user_activity
alter table public.user_activity enable row level security;

-- Users can only view their own activity
create policy "Users can view own activity" on public.user_activity for select using (auth.uid() = user_id);

-- Users can only insert their own activity
create policy "Users can insert own activity" on public.user_activity for insert with check (auth.uid() = user_id);

-- Saved products for users (favorites/watchlist)
create table if not exists public.saved_products (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade not null,
    product_id text references public.products on delete cascade not null,
    saved_at timestamp with time zone default now(),
    unique(user_id, product_id)
);

-- Create indexes for saved_products
create index if not exists idx_saved_user on public.saved_products(user_id);
create index if not exists idx_saved_product on public.saved_products(product_id);

-- Enable RLS on saved_products
alter table public.saved_products enable row level security;

-- Users can view their own saved products
create policy "Users can view own saved products" on public.saved_products for select using (auth.uid() = user_id);

-- Users can manage their own saved products
create policy "Users can manage own saved products" on public.saved_products for insert with check (auth.uid() = user_id);
create policy "Users can delete own saved products" on public.saved_products for delete using (auth.uid() = user_id);

-- Comparisons table for product comparisons
create table if not exists public.comparisons (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade not null,
    product_ids text[],
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create indexes for comparisons
create index if not exists idx_comparison_user on public.comparisons(user_id);
create index if not exists idx_comparison_created on public.comparisons(created_at);

-- Enable RLS on comparisons
alter table public.comparisons enable row level security;

-- Users can view their own comparisons
create policy "Users can view own comparisons" on public.comparisons for select using (auth.uid() = user_id);

-- Users can manage their own comparisons
create policy "Users can manage own comparisons" on public.comparisons for all using (auth.uid() = user_id);

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