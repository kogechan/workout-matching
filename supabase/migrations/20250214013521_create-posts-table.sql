drop table if exists posts;

create table posts (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp default now()
);

