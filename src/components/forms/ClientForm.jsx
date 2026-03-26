import { useState } from "react";
import { Modal, FInput, FSelect, FRow, Btn } from "../ui";

export default function ClientForm({ data, onSave, onClose }) {
  const [f, sF] = useState({ name: data?.name || "", industry: data?.industry || "", health: data?.health || "healthy", type: data?.type || "Discovery", contact: data?.contact || "", stack: data?.stack ? data.stack.join(", ") : "" });
  const u = (k, v) => sF(p => ({ ...p, [k]: v }));
  return <Modal title={data ? "Edit Client" : "Add Client"} onClose={onClose}>
    <FInput label="Company Name" value={f.name} onChange={e => u("name", e.target.value)} placeholder="e.g. Acme Corp" />
    <FRow>
      <FInput label="Industry" value={f.industry} onChange={e => u("industry", e.target.value)} placeholder="e.g. Healthcare" />
      <FSelect label="Health" value={f.health} onChange={e => u("health", e.target.value)} options={["healthy", "at-risk", "critical"]} />
    </FRow>
    <FRow>
      <FSelect label="Type" value={f.type} onChange={e => u("type", e.target.value)} options={["Discovery", "Retainer", "Fixed Fee", "Hourly"]} />
      <FInput label="Contact" value={f.contact} onChange={e => u("contact", e.target.value)} placeholder="e.g. John Doe, CTO" />
    </FRow>
    <FInput label="Tech Stack (comma separated)" value={f.stack} onChange={e => u("stack", e.target.value)} placeholder="e.g. React, AWS, Supabase" />
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}><Btn onClick={onClose}>Cancel</Btn><Btn v="primary" onClick={() => { if (!f.name.trim()) return; onSave(f) }}>{data ? "Save Changes" : "Add Client"}</Btn></div>
  </Modal>;
}
