-- SOCRA Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Users (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text not null check (role in ('teacher', 'student')),
  created_at timestamptz default now()
);

alter table public.users enable row level security;

-- Courses
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text default ''
);

alter table public.courses enable row level security;

-- Enrollments
create table public.enrollments (
  student_id uuid references public.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  primary key (student_id, course_id)
);

alter table public.enrollments enable row level security;

-- Documents (teacher uploads)
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  filename text not null,
  storage_path text not null,
  parsed_at timestamptz
);

alter table public.documents enable row level security;

-- Concepts (nodes in the dependency graph)
create table public.concepts (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  label text not null,
  description text default '',
  position_x float default 0,
  position_y float default 0
);

alter table public.concepts enable row level security;

-- Concept Edges (prerequisite relationships)
create table public.concept_edges (
  id uuid default gen_random_uuid() primary key,
  from_concept_id uuid references public.concepts(id) on delete cascade not null,
  to_concept_id uuid references public.concepts(id) on delete cascade not null
);

alter table public.concept_edges enable row level security;

-- Mastery Scores
create table public.mastery_scores (
  student_id uuid references public.users(id) on delete cascade,
  concept_id uuid references public.concepts(id) on delete cascade,
  score float default 0.0 check (score >= 0.0 and score <= 1.0),
  updated_at timestamptz default now(),
  primary key (student_id, concept_id)
);

alter table public.mastery_scores enable row level security;

-- Sessions
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  mode text not null check (mode in ('explore', 'guided', 'challenge', 'assess')),
  started_at timestamptz default now(),
  ended_at timestamptz
);

alter table public.sessions enable row level security;

-- Session Events
create table public.session_events (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  event_type text not null,
  concept_id uuid references public.concepts(id),
  payload jsonb default '{}',
  created_at timestamptz default now()
);

alter table public.session_events enable row level security;

-- Teacher Alerts
create table public.teacher_alerts (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  student_id uuid references public.users(id) on delete cascade not null,
  concept_id uuid references public.concepts(id) on delete cascade not null,
  reason text not null,
  resolved boolean default false,
  created_at timestamptz default now()
);

alter table public.teacher_alerts enable row level security;

-- Assignments
create table public.assignments (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  mode text not null check (mode in ('explore', 'guided', 'challenge', 'assess')),
  due_at timestamptz
);

alter table public.assignments enable row level security;
