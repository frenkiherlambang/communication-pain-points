-- Migration: Convert customer_feedbacks.topic (text) to many-to-many relationship
-- This migration:
-- 1. Creates the topics table if it doesn't exist
-- 2. Creates the customer_feedback_topic pivot table
-- 3. Migrates existing topic data from customer_feedbacks to the new structure
-- 4. Removes the old topic column from customer_feedbacks

-- ===========================
-- STEP 1: Create topics table
-- ===========================
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for better query performance
create index if not exists idx_topics_name on topics(name);
create index if not exists idx_topics_category on topics(category);

-- ===========================
-- STEP 2: Create pivot table
-- ===========================
create table if not exists customer_feedback_topic (
  id uuid primary key default gen_random_uuid(),
  customer_feedback_id uuid not null references customer_feedbacks(id) on delete cascade,
  topic_id uuid not null references topics(id) on delete cascade,
  assigned_at timestamp with time zone default now(),
  unique(customer_feedback_id, topic_id)
);

-- Create indexes for better query performance
create index if not exists idx_customer_feedback_topic_feedback_id on customer_feedback_topic(customer_feedback_id);
create index if not exists idx_customer_feedback_topic_topic_id on customer_feedback_topic(topic_id);
create index if not exists idx_customer_feedback_topic_both on customer_feedback_topic(customer_feedback_id, topic_id);

-- ===========================
-- STEP 3: Migrate existing data
-- ===========================
-- First, populate topics table with unique topic values from customer_feedbacks
insert into topics (name, category)
select distinct 
  topic as name,
  null as category
from customer_feedbacks
where topic is not null and topic != ''
on conflict (name) do nothing;

-- Then, create relationships in the pivot table
insert into customer_feedback_topic (customer_feedback_id, topic_id)
select 
  cf.id as customer_feedback_id,
  t.id as topic_id
from customer_feedbacks cf
join topics t on cf.topic = t.name
where cf.topic is not null and cf.topic != ''
on conflict (customer_feedback_id, topic_id) do nothing;

-- ===========================
-- STEP 4: Remove old topic column
-- ===========================
-- Drop the index on the old topic column
drop index if exists idx_customer_feedbacks_topic;

-- Remove the topic column from customer_feedbacks
-- Note: This is commented out to allow for a gradual migration
-- Uncomment when you're ready to fully commit to the new structure
-- alter table customer_feedbacks drop column if exists topic;

-- ===========================
-- STEP 5: Create helpful views (optional)
-- ===========================
-- View to easily query feedbacks with their topics
create or replace view customer_feedbacks_with_topics as
select 
  cf.*,
  array_agg(t.name order by t.name) as topics,
  array_agg(t.id order by t.name) as topic_ids
from customer_feedbacks cf
left join customer_feedback_topic cft on cf.id = cft.customer_feedback_id
left join topics t on cft.topic_id = t.id
group by cf.id;

-- View to see topic statistics
create or replace view topic_statistics as
select 
  t.id as topic_id,
  t.name as topic_name,
  t.category,
  count(cft.customer_feedback_id) as feedback_count,
  count(distinct cf.account_id) as unique_customers,
  count(case when cf.sentiment = 'Positive' then 1 end) as positive_count,
  count(case when cf.sentiment = 'Neutral' then 1 end) as neutral_count,
  count(case when cf.sentiment = 'Negative' then 1 end) as negative_count,
  round(
    (count(case when cf.sentiment = 'Positive' then 1 end)::numeric / 
     nullif(count(cft.customer_feedback_id), 0)) * 100, 
    2
  ) as positive_percentage
from topics t
left join customer_feedback_topic cft on t.id = cft.topic_id
left join customer_feedbacks cf on cft.customer_feedback_id = cf.id
group by t.id, t.name, t.category
order by feedback_count desc;


