-- SUPABASE SETUP SCRIPT
-- Run this in your Supabase SQL Editor to fix the conflicts and set up your database

-- ============================================
-- DROP CONFLICTING POLICIES (if they exist)
-- ============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- ============================================
-- PRODUCTS TABLE - stores product data
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
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

-- Create indexes for products
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_velocity ON public.products(velocity_score);
CREATE INDEX IF NOT EXISTS idx_products_demand ON public.products(demand_signal);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);

-- ============================================
-- USER ACTIVITY TABLE - tracks user behavior
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_activity (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade not null,
    activity_type text not null,
    product_id text references public.products on delete set null,
    metadata jsonb,
    created_at timestamp with time zone default now()
);

-- Create indexes for user_activity
CREATE INDEX IF NOT EXISTS idx_activity_user ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON public.user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.user_activity(created_at);

-- Enable RLS on user_activity
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Users can view their own activity
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity;
CREATE POLICY "Users can view own activity" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own activity
DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity;
CREATE POLICY "Users can insert own activity" ON public.user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SAVED PRODUCTS TABLE - user favorites
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_products (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade not null,
    product_id text references public.products on delete cascade not null,
    saved_at timestamp with time zone default now(),
    unique(user_id, product_id)
);

-- Create indexes for saved_products
CREATE INDEX IF NOT EXISTS idx_saved_user ON public.saved_products(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_product ON public.saved_products(product_id);

-- Enable RLS on saved_products
ALTER TABLE public.saved_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own saved products" ON public.saved_products;
CREATE POLICY "Users can view own saved products" ON public.saved_products FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own saved products
DROP POLICY IF EXISTS "Users can manage own saved products" ON public.saved_products;
CREATE POLICY "Users can manage own saved products" ON public.saved_products FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved products
DROP POLICY IF EXISTS "Users can delete own saved products" ON public.saved_products;
CREATE POLICY "Users can delete own saved products" ON public.saved_products FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- COMPARISONS TABLE - product comparisons
-- ============================================
CREATE TABLE IF NOT EXISTS public.comparisons (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade not null,
    product_ids text[],
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create indexes for comparisons
CREATE INDEX IF NOT EXISTS idx_comparison_user ON public.comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_comparison_created ON public.comparisons(created_at);

-- Enable RLS on comparisons
DROP POLICY IF EXISTS "Users can view own comparisons" ON public.comparisons;
CREATE POLICY "Users can view own comparisons" ON public.comparisons FOR SELECT USING (auth.uid() = user_id);

-- Users can create comparisons
DROP POLICY IF EXISTS "Users can create comparisons" ON public.comparisons;
CREATE POLICY "Users can create comparisons" ON public.comparisons FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own comparisons
DROP POLICY IF EXISTS "Users can update own comparisons" ON public.comparisons;
CREATE POLICY "Users can update own comparisons" ON public.comparisons FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own comparisons
DROP POLICY IF EXISTS "Users can delete own comparisons" ON public.comparisons;
CREATE POLICY "Users can update own comparisons" ON public.comparisons FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own comparisons
CREATE POLICY IF NOT EXISTS "Users can delete own comparisons" ON public.comparisons FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything was created:

-- SELECT * FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM information_schema.table_constraints WHERE table_schema = 'public';
