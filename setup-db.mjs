import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Fixmemahendar123!@@db.sfelwfidldcvltiyvvcn.supabase.co:5432/postgres',
});

const query = `
create table if not exists logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  content text not null,
  mood smallint,
  energy smallint,
  sleep_hours numeric,
  category text,
  root_cause text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Alter table to add new columns if table already existed without them
DO $$
BEGIN
  BEGIN
    ALTER TABLE logs ADD COLUMN category text;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  BEGIN
    ALTER TABLE logs ADD COLUMN root_cause text;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  
  -- Make old columns nullable if they were required
  ALTER TABLE logs ALTER COLUMN mood DROP NOT NULL;
  ALTER TABLE logs ALTER COLUMN energy DROP NOT NULL;
  ALTER TABLE logs ALTER COLUMN sleep_hours DROP NOT NULL;
END $$;


create table if not exists weekly_insights (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  top_problem text,
  root_cause text,
  behavior_pattern text,
  action_plan jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists experiments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  strategy text,
  duration_days smallint default 5,
  status text default 'active',
  progress jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_log_date date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table logs enable row level security;
alter table weekly_insights enable row level security;
alter table experiments enable row level security;
alter table profiles enable row level security;

-- Drop policies if they exist so this script is idempotent
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view their own logs." ON logs;
    DROP POLICY IF EXISTS "Users can insert their own logs." ON logs;
    DROP POLICY IF EXISTS "Users can view their own weekly_insights." ON weekly_insights;
    DROP POLICY IF EXISTS "Users can insert their own weekly_insights." ON weekly_insights;
    DROP POLICY IF EXISTS "Users can view their own experiments." ON experiments;
    DROP POLICY IF EXISTS "Users can insert their own experiments." ON experiments;
    DROP POLICY IF EXISTS "Users can update their own experiments." ON experiments;
    DROP POLICY IF EXISTS "Users can view their own profiles." ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profiles." ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profiles." ON profiles;
    DROP POLICY IF EXISTS "Anyone can view weekly_insights by id" ON weekly_insights;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

create policy "Anyone can view weekly_insights by id" on weekly_insights
  for select using (true);

create policy "Users can view their own logs." on logs
  for select using (auth.uid() = user_id);

create policy "Users can insert their own logs." on logs
  for insert with check (auth.uid() = user_id);

create policy "Users can view their own weekly_insights." on weekly_insights
  for select using (auth.uid() = user_id);

create policy "Users can insert their own weekly_insights." on weekly_insights
  for insert with check (auth.uid() = user_id);

create policy "Users can view their own experiments." on experiments
  for select using (auth.uid() = user_id);

create policy "Users can insert their own experiments." on experiments
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own experiments." on experiments
  for update using (auth.uid() = user_id);

create policy "Users can view their own profiles." on profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profiles." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profiles." on profiles
  for update using (auth.uid() = id);
`;

async function main() {
  try {
    await client.connect();
    console.log("Connected to Supabase Postgres.");
    await client.query(query);
    console.log("Migration executed successfully!");
  } catch (error) {
    console.error("Error executing migration:", error);
  } finally {
    await client.end();
  }
}

main();
