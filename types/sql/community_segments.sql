create table if not exists community_segments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  criteria text
);