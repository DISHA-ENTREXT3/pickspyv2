-- Table to store products
create table if not exists products (
  id text primary key,
  name text not null,
  category text not null,
  price decimal not null,
  image_url text,
  velocity_score integer,
  saturation_score integer,
  demand_signal text,
  weekly_growth decimal,
  reddit_mentions integer,
  sentiment_score integer,
  top_reddit_themes text[],
  last_updated text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table products enable row level security;

-- Policy to allow anonymous read access
create policy "Allow public read access" on products for
select using (true);

-- Policy to allow anonymous insert (for demonstration/refresh)
create policy "Allow public insert" on products for
insert
with
    check (true);

-- Policy to allow anonymous update
create policy "Allow public update" on products for
update using (true);

-- Policy to allow anonymous delete
create policy "Allow public delete" on products for delete using (true);