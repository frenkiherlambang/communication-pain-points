create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text
);
