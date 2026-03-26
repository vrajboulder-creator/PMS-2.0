import { useState } from "react";
import { C, F } from "../../shared/theme";
import { _TEAM, _CLIENTS } from "../../shared/store";
import { Modal, FInput, FSelect, FRow, FLabel, Btn, Av } from "../ui";

export default function ProjectForm({ data, onSave, onClose }) {
  const stages = ["Lead", "Discovery", "Proposal", "Awaiting Approval", "Build", "Internal Review", "Client Review", "QA / UAT", "Deployment", "Ongoing Support", "Completed", "On Hold"];
  const types = ["AI Agent", "Automation", "AI + Automation", "Integration", "Consulting"];
  const [f, sF] = useState({ name: data?.name || "", cl: data?.cl || _CLIENTS[0]?.id || "", stage: data?.stage || "Lead", health: data?.health || "healthy", pm: data?.pm || _TEAM[0]?.id || "", team: data?.team || [], type: data?.type || "Automation", budget: data?.budget || "", desc: data?.desc || "", start: data?.start || "", target: data?.target || "" });
  const u = (k, v) => sF(p => ({ ...p, [k]: v }));
  const toggleTeam = id => sF(p => ({ ...p, team: p.team.includes(id) ? p.team.filter(x => x !== id) : [...p.team, id] }));
  return <Modal title={data ? "Edit Project" : "New Project"} onClose={onClose} width={540}>
    <FInput label="Project Name" value={f.name} onChange={e => u("name", e.target.value)} placeholder="e.g. AI Chatbot" />
    <FRow>
      <FSelect label="Client" value={f.cl} onChange={e => u("cl", e.target.value)} options={_CLIENTS.map(c => ({ v: c.id, l: c.name }))} />
      <FSelect label="Stage" value={f.stage} onChange={e => u("stage", e.target.value)} options={stages} />
    </FRow>
    <FRow>
      <FSelect label="Type" value={f.type} onChange={e => u("type", e.target.value)} options={types} />
      <FSelect label="Health" value={f.health} onChange={e => u("health", e.target.value)} options={["healthy", "at-risk", "critical"]} />
    </FRow>
    <FRow>
      <FSelect label="Project Manager" value={f.pm} onChange={e => u("pm", e.target.value)} options={_TEAM.map(t => ({ v: t.id, l: t.name }))} />
      <FInput label="Budget" value={f.budget} onChange={e => u("budget", e.target.value)} placeholder="e.g. $50,000" />
    </FRow>
    <FRow>
      <FInput label="Start Date" type="date" value={f.start} onChange={e => u("start", e.target.value)} />
      <FInput label="Target Date" type="date" value={f.target} onChange={e => u("target", e.target.value)} />
    </FRow>
    <div style={{ marginBottom: 12 }}><FLabel>Team Members</FLabel>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{_TEAM.map(t => <button key={t.id} onClick={() => toggleTeam(t.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: `1px solid ${f.team.includes(t.id) ? C.a : C.b}`, background: f.team.includes(t.id) ? C.aSoft : "#fff", color: f.team.includes(t.id) ? C.a : C.t2, fontSize: 11, fontWeight: 500, fontFamily: F, cursor: "pointer" }}><Av m={t} sz={16} />{t.name.split(" ")[0]}</button>)}</div>
    </div>
    <div style={{ marginBottom: 12 }}><FLabel>Description</FLabel><textarea value={f.desc} onChange={e => u("desc", e.target.value)} placeholder="Brief project description..." rows={2} style={{ width: "100%", padding: "8px 12px", borderRadius: 7, border: `1px solid ${C.b}`, fontSize: 12, fontFamily: F, color: C.t, outline: "none", resize: "vertical", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = C.bFocus} onBlur={e => e.target.style.borderColor = C.b} /></div>
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}><Btn onClick={onClose}>Cancel</Btn><Btn v="primary" onClick={() => { if (!f.name.trim()) return; onSave(f) }}>{data ? "Save Changes" : "Create Project"}</Btn></div>
  </Modal>;
}
