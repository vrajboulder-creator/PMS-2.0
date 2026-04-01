import { useState } from "react";
import { Modal, FInput, FSelect, FRow, Btn } from "../ui";

const COLORS = ["#3b82f6", "#16a34a", "#dc2626", "#7c3aed", "#b45309", "#0891b2", "#c2410c", "#9333ea", "#0d9488", "#e11d48"];
const DEPTS = ["Engineering", "Design", "Marketing", "Sales", "Operations", "Finance", "HR", "Support", "Product", "QA"];

export default function TeamForm({ data, onSave, onClose }) {
  const [f, sF] = useState({
    name: data?.name || "",
    role: data?.role || "",
    dept: data?.dept || DEPTS[0],
    cap: data?.cap ?? 40,
    used: data?.used ?? 0,
    avatar: data?.avatar || data?.av || "",
    color: data?.color || data?.c || COLORS[0],
    skills: data?.skills ? data.skills.join(", ") : "",
  });
  const u = (k, v) => sF(p => ({ ...p, [k]: v }));

  const initials = f.name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || "").join("").slice(0, 2) || "??";

  return <Modal title={data ? "Edit Team Member" : "Add Team Member"} onClose={onClose}>
    <FInput label="Full Name" value={f.name} onChange={e => u("name", e.target.value)} placeholder="e.g. Jane Smith" />
    <FRow>
      <FInput label="Role" value={f.role} onChange={e => u("role", e.target.value)} placeholder="e.g. Senior Developer" />
      <FSelect label="Department" value={f.dept} onChange={e => u("dept", e.target.value)} options={DEPTS} />
    </FRow>
    <FRow>
      <FInput label="Weekly Capacity (hrs)" type="number" value={f.cap} onChange={e => u("cap", e.target.value)} />
      <FInput label="Hours Used" type="number" value={f.used} onChange={e => u("used", e.target.value)} />
    </FRow>
    <FInput label="Skills (comma separated)" value={f.skills} onChange={e => u("skills", e.target.value)} placeholder="e.g. React, Node.js, Python" />
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: "#5f6672" }}>Color</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {COLORS.map(c => <button key={c} onClick={() => u("color", c)} style={{ width: 26, height: 26, borderRadius: 6, background: c, border: f.color === c ? "2px solid #1a1d23" : "2px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>{f.color === c ? initials : ""}</button>)}
      </div>
    </div>
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
      <Btn onClick={onClose}>Cancel</Btn>
      <Btn v="primary" onClick={() => {
        if (!f.name.trim() || !f.role.trim()) return;
        onSave({
          name: f.name.trim(),
          role: f.role.trim(),
          dept: f.dept,
          cap: Number(f.cap) || 40,
          used: Number(f.used) || 0,
          avatar: f.name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || "").join("").slice(0, 2),
          color: f.color,
          skills: f.skills ? f.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        });
      }}>{data ? "Save Changes" : "Add Member"}</Btn>
    </div>
  </Modal>;
}
