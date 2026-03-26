-- ═══ AGENCY OS — OPERATIONS BACKEND ═══
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Drop existing tables (in reverse dependency order) to start clean
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS automations CASCADE;
DROP TABLE IF EXISTS deliverables CASCADE;
DROP TABLE IF EXISTS activity CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS subtasks CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS team CASCADE;

-- 1. TEAM
CREATE TABLE team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  dept TEXT NOT NULL,
  cap INTEGER NOT NULL DEFAULT 40,
  used INTEGER NOT NULL DEFAULT 0,
  avatar TEXT NOT NULL,
  color TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}'
);

-- 2. CLIENTS
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  health TEXT NOT NULL DEFAULT 'healthy' CHECK (health IN ('healthy','at-risk','critical')),
  type TEXT NOT NULL,
  contact TEXT NOT NULL,
  stack TEXT[] NOT NULL DEFAULT '{}'
);

-- 3. PROJECTS
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client_id TEXT NOT NULL REFERENCES clients(id),
  stage TEXT NOT NULL DEFAULT 'Lead',
  health TEXT NOT NULL DEFAULT 'healthy' CHECK (health IN ('healthy','at-risk','critical')),
  pm TEXT REFERENCES team(id),
  team_ids TEXT[] NOT NULL DEFAULT '{}',
  start_date TEXT,
  target_date TEXT,
  type TEXT NOT NULL,
  budget TEXT,
  billed TEXT DEFAULT '$0',
  description TEXT,
  risks TEXT[] DEFAULT '{}',
  objectives TEXT[] DEFAULT '{}'
);

-- 4. TASKS
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('backlog','todo','in-progress','review','done','blocked')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent','high','medium','low')),
  owner TEXT REFERENCES team(id),
  due_date TEXT,
  estimated_hours INTEGER DEFAULT 0,
  actual_hours INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUBTASKS
CREATE TABLE subtasks (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in-progress','done','blocked')),
  owner TEXT REFERENCES team(id),
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FILES (attached to subtasks)
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  subtask_id TEXT NOT NULL REFERENCES subtasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  size TEXT,
  uploaded_by TEXT REFERENCES team(id),
  uploaded_date TEXT
);

-- 7. COMMENTS (on subtasks)
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  subtask_id TEXT NOT NULL REFERENCES subtasks(id) ON DELETE CASCADE,
  author TEXT NOT NULL REFERENCES team(id),
  text TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACTIVITY LOG
CREATE TABLE activity (
  id SERIAL PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  when_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DELIVERABLES
CREATE TABLE deliverables (
  id SERIAL PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not-started',
  owner TEXT REFERENCES team(id),
  version TEXT DEFAULT '—'
);

-- 10. AUTOMATIONS
CREATE TABLE automations (
  id SERIAL PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  owner TEXT REFERENCES team(id)
);

-- 11. ISSUES
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical','high','medium','low')),
  owner TEXT REFERENCES team(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed'))
);

-- ═══ ROW LEVEL SECURITY — allow all for anon (demo app) ═══
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on team" ON team FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on subtasks" ON subtasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on files" ON files FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on comments" ON comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on activity" ON activity FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on deliverables" ON deliverables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on automations" ON automations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on issues" ON issues FOR ALL USING (true) WITH CHECK (true);
