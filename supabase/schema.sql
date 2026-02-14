-- Velora Practice: Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Tracks
create table tracks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  description text not null default '',
  "order" int not null default 0,
  created_at timestamptz default now()
);

-- 2. Scenarios
create table scenarios (
  id uuid default gen_random_uuid() primary key,
  track_id uuid references tracks(id) on delete cascade not null,
  scenario_code text not null unique,
  title text not null,
  context text not null,
  assumptions text[] not null default '{}',
  trigger_event text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  "order" int not null default 0,
  created_at timestamptz default now()
);

-- 3. Questions
create table questions (
  id uuid default gen_random_uuid() primary key,
  scenario_id uuid references scenarios(id) on delete cascade not null,
  prompt text not null,
  "order" int not null default 0
);

-- 4. Answer Options
create table answer_options (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references questions(id) on delete cascade not null,
  label text not null, -- 'A', 'B', 'C', 'D'
  text text not null,
  is_correct boolean not null default false,
  correctness_type text not null check (correctness_type in ('correct', 'suboptimal', 'incorrect')),
  legal_accuracy int not null default 0,
  market_practice int not null default 0,
  risk_awareness int not null default 0,
  perspective_awareness int not null default 0,
  composite int not null default 0,
  wrong_explanation text -- null for correct answer
);

-- 5. Explanations (one per question)
create table explanations (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references questions(id) on delete cascade not null unique,
  correct_explanation text not null,
  lender_perspective text,
  borrower_perspective text,
  learning_outcome text not null
);

-- 6. User Progress
create table user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  question_id uuid references questions(id) on delete cascade not null,
  selected_answer_id uuid references answer_options(id) on delete cascade not null,
  composite_score int not null,
  answered_at timestamptz default now(),
  unique(user_id, question_id) -- one answer per user per question (latest replaces)
);

-- Indexes
create index idx_scenarios_track on scenarios(track_id);
create index idx_questions_scenario on questions(scenario_id);
create index idx_answers_question on answer_options(question_id);
create index idx_progress_user on user_progress(user_id);
create index idx_progress_question on user_progress(question_id);

-- Row Level Security
alter table tracks enable row level security;
alter table scenarios enable row level security;
alter table questions enable row level security;
alter table answer_options enable row level security;
alter table explanations enable row level security;
alter table user_progress enable row level security;

-- Public read access for content tables
create policy "Public read access" on tracks for select using (true);
create policy "Public read access" on scenarios for select using (true);
create policy "Public read access" on questions for select using (true);
create policy "Public read access" on answer_options for select using (true);
create policy "Public read access" on explanations for select using (true);

-- User progress: users can only see and manage their own
create policy "Users read own progress" on user_progress for select using (auth.uid() = user_id);
create policy "Users insert own progress" on user_progress for insert with check (auth.uid() = user_id);
create policy "Users update own progress" on user_progress for update using (auth.uid() = user_id);
