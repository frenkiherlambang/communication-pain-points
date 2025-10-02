create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better query performance
create index if not exists idx_topics_name on topics(name);
create index if not exists idx_topics_category on topics(category);

-- Create a trigger to automatically update the updated_at timestamp
create or replace function update_topics_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_topics_updated_at
  before update on topics
  for each row
  execute function update_topics_updated_at();
