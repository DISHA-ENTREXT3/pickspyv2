-- Migration to support 7-day history and pre-generated analysis
-- Run this in Supabase SQL Editor

-- 1. Add detailed_analysis column to products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS detailed_analysis jsonb;

-- 2. Add composite unique constraint for snapshots (id + date part of created_at)
-- This allows one entry per product per day.
-- First, we need to handle existing FKs if we change PK.
-- BUT, it's easier to just add a unique constraint on (id, created_at) if we want snapshots.

-- Let's add a record_id as the main PK to allow history
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS record_id uuid DEFAULT gen_random_uuid ();

-- Temporarily disable FKs that point to products.id
ALTER TABLE IF EXISTS public.user_activity
DROP CONSTRAINT IF EXISTS user_activity_product_id_fkey;

ALTER TABLE IF EXISTS public.saved_products
DROP CONSTRAINT IF EXISTS saved_products_product_id_fkey;

-- Change PK to record_id
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_pkey;

ALTER TABLE public.products ADD PRIMARY KEY (record_id);

-- Add index on id for performance
CREATE INDEX IF NOT EXISTS idx_products_id ON public.products (id);

-- Re-add FKs but without the strict constraint if we want to allow referencing a non-unique 'id'
-- actually, FKs must point to unique columns.
-- Since 'id' is no longer unique, we can't have a FK to it.
-- We can either reference record_id (but saved products should probably point to the 'abstract' product id)
-- or just remove the FK constraint but keep the column.
-- I'll keep the columns but without FK constraints to 'id', as 'id' is now a 'logical' identifier.

-- 3. Cleanup Function for 7-day retention
CREATE OR REPLACE FUNCTION delete_old_products() RETURNS 
void AS 
$$
BEGIN
	DELETE FROM public.products
	WHERE
	    created_at < NOW() - INTERVAL '7 days';
END;
$$
LANGUAGE
plpgsql; 