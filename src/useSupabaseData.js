import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// Generic fetch hook
function useTable(table, orderBy = "id") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data: rows, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy);
    if (!error) setData(rows);
    setLoading(false);
  }, [table, orderBy]);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, refresh };
}

// ═══ TEAM ═══
export function useTeam() {
  const { data, loading, refresh } = useTable("team");

  const updateHours = async (id, used) => {
    await supabase.from("team").update({ used }).eq("id", id);
    refresh();
  };

  return { team: data, loading, refresh, updateHours };
}

// ═══ CLIENTS ═══
export function useClients() {
  const { data, loading, refresh } = useTable("clients");

  const addClient = async (client) => {
    const { error } = await supabase.from("clients").insert(client);
    if (!error) refresh();
    return error;
  };

  const updateClient = async (id, updates) => {
    await supabase.from("clients").update(updates).eq("id", id);
    refresh();
  };

  const deleteClient = async (id) => {
    await supabase.from("clients").delete().eq("id", id);
    refresh();
  };

  return { clients: data, loading, refresh, addClient, updateClient, deleteClient };
}

// ═══ PROJECTS (with nested relations) ═══
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from("projects").select("*");
    if (!rows) { setLoading(false); return; }

    // Fetch all related data in parallel
    const [tasksRes, activRes, delivRes, autoRes, issueRes] = await Promise.all([
      supabase.from("tasks").select("*").order("id"),
      supabase.from("activity").select("*").order("created_at", { ascending: false }),
      supabase.from("deliverables").select("*"),
      supabase.from("automations").select("*"),
      supabase.from("issues").select("*"),
    ]);

    const tasks = tasksRes.data || [];
    const allActivity = activRes.data || [];
    const allDeliverables = delivRes.data || [];
    const allAutomations = autoRes.data || [];
    const allIssues = issueRes.data || [];

    // Fetch subtasks, files, comments for tasks
    const [subsRes, filesRes, commsRes] = await Promise.all([
      supabase.from("subtasks").select("*").order("id"),
      supabase.from("files").select("*"),
      supabase.from("comments").select("*").order("created_at"),
    ]);

    const allSubs = subsRes.data || [];
    const allFiles = filesRes.data || [];
    const allComments = commsRes.data || [];

    // Nest subtasks with their files + comments
    const subsWithNested = allSubs.map(s => ({
      ...s,
      // Map to frontend shape
      id: s.id,
      title: s.title,
      st: s.status,
      ow: s.owner,
      due: s.due_date,
      files: allFiles.filter(f => f.subtask_id === s.id).map(f => ({
        n: f.name, t: f.file_type, sz: f.size, by: f.uploaded_by, d: f.uploaded_date,
      })),
      comments: allComments.filter(c => c.subtask_id === s.id).map(c => ({
        a: c.author, t: c.text, time: c.time,
      })),
    }));

    // Nest tasks with subtasks
    const tasksWithSubs = tasks.map(t => ({
      id: t.id,
      title: t.title,
      st: t.status,
      pr: t.priority,
      ow: t.owner,
      due: t.due_date,
      est: t.estimated_hours,
      act: t.actual_hours,
      project_id: t.project_id,
      subs: subsWithNested.filter(s => s.task_id === t.id),
    }));

    // Assemble projects with all nested data (mapped to frontend shape)
    const assembled = rows.map(p => ({
      id: p.id,
      name: p.name,
      cl: p.client_id,
      stage: p.stage,
      health: p.health,
      pm: p.pm,
      team: p.team_ids || [],
      start: p.start_date,
      target: p.target_date,
      type: p.type,
      budget: p.budget,
      billed: p.billed,
      desc: p.description,
      risks: p.risks || [],
      obj: p.objectives || [],
      tasks: tasksWithSubs.filter(t => t.project_id === p.id),
      activity: allActivity.filter(a => a.project_id === p.id).map(a => ({
        x: a.type, t: a.text, w: a.when_text,
      })),
      deliverables: allDeliverables.filter(d => d.project_id === p.id).map(d => ({
        n: d.name, tp: d.type, st: d.status, ow: d.owner, v: d.version,
      })),
      autos: allAutomations.filter(a => a.project_id === p.id).map(a => ({
        n: a.name, pl: a.platform, st: a.status, ow: a.owner,
      })),
      issues: allIssues.filter(i => i.project_id === p.id).map(i => ({
        title: i.title, tp: i.type, sev: i.severity, ow: i.owner, st: i.status,
        _id: i.id,
      })),
    }));

    setProjects(assembled);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ── CRUD Operations ──

  const addProject = async (project) => {
    const { error } = await supabase.from("projects").insert({
      id: project.id,
      name: project.name,
      client_id: project.cl,
      stage: project.stage || "Lead",
      health: project.health || "healthy",
      pm: project.pm,
      team_ids: project.team || [],
      start_date: project.start,
      target_date: project.target,
      type: project.type,
      budget: project.budget,
      billed: project.billed || "$0",
      description: project.desc,
      risks: project.risks || [],
      objectives: project.obj || [],
    });
    if (!error) refresh();
    return error;
  };

  const updateProject = async (id, updates) => {
    const mapped = {};
    if (updates.name !== undefined) mapped.name = updates.name;
    if (updates.stage !== undefined) mapped.stage = updates.stage;
    if (updates.health !== undefined) mapped.health = updates.health;
    if (updates.pm !== undefined) mapped.pm = updates.pm;
    if (updates.team !== undefined) mapped.team_ids = updates.team;
    if (updates.budget !== undefined) mapped.budget = updates.budget;
    if (updates.billed !== undefined) mapped.billed = updates.billed;
    if (updates.desc !== undefined) mapped.description = updates.desc;
    if (updates.risks !== undefined) mapped.risks = updates.risks;
    if (updates.obj !== undefined) mapped.objectives = updates.obj;
    if (updates.target !== undefined) mapped.target_date = updates.target;

    await supabase.from("projects").update(mapped).eq("id", id);
    refresh();
  };

  const deleteProject = async (id) => {
    await supabase.from("projects").delete().eq("id", id);
    refresh();
  };

  // ── Task CRUD ──

  const addTask = async (task) => {
    const { error } = await supabase.from("tasks").insert({
      id: task.id,
      project_id: task.project_id,
      title: task.title,
      status: task.st || "todo",
      priority: task.pr || "medium",
      owner: task.ow,
      due_date: task.due,
      estimated_hours: task.est || 0,
      actual_hours: task.act || 0,
    });
    if (!error) refresh();
    return error;
  };

  const updateTask = async (id, updates) => {
    const mapped = {};
    if (updates.title !== undefined) mapped.title = updates.title;
    if (updates.st !== undefined) mapped.status = updates.st;
    if (updates.pr !== undefined) mapped.priority = updates.pr;
    if (updates.ow !== undefined) mapped.owner = updates.ow;
    if (updates.due !== undefined) mapped.due_date = updates.due;
    if (updates.est !== undefined) mapped.estimated_hours = updates.est;
    if (updates.act !== undefined) mapped.actual_hours = updates.act;

    await supabase.from("tasks").update(mapped).eq("id", id);
    refresh();
  };

  const deleteTask = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    refresh();
  };

  // ── Subtask CRUD ──

  const addSubtask = async (subtask) => {
    const { error } = await supabase.from("subtasks").insert({
      id: subtask.id,
      task_id: subtask.task_id,
      title: subtask.title,
      status: subtask.st || "todo",
      owner: subtask.ow,
      due_date: subtask.due,
    });
    if (!error) refresh();
    return error;
  };

  const updateSubtask = async (id, updates) => {
    const mapped = {};
    if (updates.title !== undefined) mapped.title = updates.title;
    if (updates.st !== undefined) mapped.status = updates.st;
    if (updates.ow !== undefined) mapped.owner = updates.ow;
    if (updates.due !== undefined) mapped.due_date = updates.due;

    await supabase.from("subtasks").update(mapped).eq("id", id);
    refresh();
  };

  const deleteSubtask = async (id) => {
    await supabase.from("subtasks").delete().eq("id", id);
    refresh();
  };

  // ── Comments ──

  const addComment = async (subtaskId, author, text) => {
    const now = new Date();
    const timeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      ", " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    await supabase.from("comments").insert({
      subtask_id: subtaskId,
      author,
      text,
      time: timeStr,
    });
    refresh();
  };

  // ── Issues ──

  const addIssue = async (issue) => {
    await supabase.from("issues").insert({
      project_id: issue.project_id,
      title: issue.title,
      type: issue.tp,
      severity: issue.sev || "medium",
      owner: issue.ow,
      status: issue.st || "open",
    });
    refresh();
  };

  const updateIssue = async (id, updates) => {
    const mapped = {};
    if (updates.title !== undefined) mapped.title = updates.title;
    if (updates.st !== undefined) mapped.status = updates.st;
    if (updates.sev !== undefined) mapped.severity = updates.sev;
    if (updates.ow !== undefined) mapped.owner = updates.ow;
    await supabase.from("issues").update(mapped).eq("id", id);
    refresh();
  };

  // ── Activity ──

  const addActivity = async (projectId, type, text, whenText) => {
    await supabase.from("activity").insert({
      project_id: projectId,
      type,
      text,
      when_text: whenText || "Just now",
    });
    refresh();
  };

  return {
    projects, loading, refresh,
    addProject, updateProject, deleteProject,
    addTask, updateTask, deleteTask,
    addSubtask, updateSubtask, deleteSubtask,
    addComment,
    addIssue, updateIssue,
    addActivity,
  };
}
