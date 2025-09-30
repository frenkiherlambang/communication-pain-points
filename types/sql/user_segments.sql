create table if not exists user_segments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  segment_id uuid references community_segments(id) on delete cascade,
  assigned_at timestamp with time zone default now(),
  unique(user_id, segment_id)
);