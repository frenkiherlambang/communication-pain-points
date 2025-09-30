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