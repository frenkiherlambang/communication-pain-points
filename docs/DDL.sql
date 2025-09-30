-- ===========================
-- 1. USERS
-- ===========================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  account_id text not null,
  platform text not null,
  profile_url text,
  first_interaction_date date,
  last_interaction_date date,
  total_interactions int default 0,
  avg_sentiment numeric(3,2) default 0.0
);

-- ===========================
-- 2. INTERACTIONS
-- ===========================
create table if not exists interactions (
  id uuid primary key default gen_random_uuid(),
  link text,
  post_copy text,
  date date not null,
  time time not null,
  date_response date,
  user_id uuid references users(id) on delete cascade,
  customer_id text,
  category text,
  type_of_post text,
  topic text,
  product text,
  sentiment text check (sentiment in ('Positive','Neutral','Negative')),
  source text,
  reply text,
  status text,
  details text,
  created_at timestamp with time zone default now()
);

-- ===========================
-- 3. COMMUNITY SEGMENTS
-- ===========================
create table if not exists community_segments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  criteria text
);

-- ===========================
-- 4. TOPICS
-- ===========================
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text
);

-- ===========================
-- 5. USER SEGMENTS (pivot table)
-- ===========================
create table if not exists user_segments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  segment_id uuid references community_segments(id) on delete cascade,
  assigned_at timestamp with time zone default now(),
  unique(user_id, segment_id)
);
