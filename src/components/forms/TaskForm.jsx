import { useState } from "react";
import { _TEAM, _PROJECTS } from "../../shared/store";
import { Modal, FInput, FSelect, FRow, Btn } from "../ui";

export default function TaskForm({ data, projectId, onSave, onClose }) {
  const statuses = ["backlog", "todo", "in-progress", "review", "done", "blocked"];
  const priorities = ["low", "medium", "high", "urgent"];
  const pid = data?.project_id || projectId || _PROJECTS[0]?.id || "";
  const [f, sF] = useState({ title: data?.title || "", project_id: pid, st: data?.st || "todo", pr: data?.pr || "medium", ow: data?.ow || _TEAM[0]?.id || "", due: data?.due || "", est: data?.est || "", act: data?.act || "" });
  const u = (k, v) => sF(p => ({ ...p, [k]: v }));
  return <Modal title={data ? "Edit Task" : "Add Task"} onClose={onClose}>
    <FInput label="Task Title" value={f.title} onChange={e => u("title", e.target.value)} placeholder="e.g. Build API integration" />
    <FRow>
      <FSelect label="Project" value={f.project_id} onChange={e => u("project_id", e.target.value)} options={_PROJECTS.map(p => ({ v: p.id, l: p.name }))} />
      <FSelect label="Owner" value={f.ow} onChange={e => u("ow", e.target.value)} options={_TEAM.map(t => ({ v: t.id, l: t.name }))} />
    </FRow>
    <FRow>
      <FSelect label="Status" value={f.st} onChange={e => u("st", e.target.value)} options={statuses.map(s => ({ v: s, l: s === "in-progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1) }))} />
      <FSelect label="Priority" value={f.pr} onChange={e => u("pr", e.target.value)} options={priorities.map(p => ({ v: p, l: p.charAt(0).toUpperCase() + p.slice(1) }))} />
    </FRow>
    <FRow>
      <FInput label="Due Date" type="date" value={f.due} onChange={e => u("due", e.target.value)} />
      <FInput label="Estimated Hours" type="number" value={f.est} onChange={e => u("est", e.target.value)} placeholder="0" />
    </FRow>
    {data && <FInput label="Actual Hours" type="number" value={f.act} onChange={e => u("act", e.target.value)} placeholder="0" />}
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}><Btn onClick={onClose}>Cancel</Btn><Btn v="primary" onClick={() => { if (!f.title.trim()) return; onSave(f) }}>{data ? "Save Changes" : "Add Task"}</Btn></div>
  </Modal>;
}
