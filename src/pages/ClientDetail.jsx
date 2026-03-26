import { C, M } from "../shared/theme";
import { _PROJECTS } from "../shared/store";
import { HB, Badge, Btn, StB, Panel, Table } from "../components/ui";

export default function ClientDetail({ cl, onOpen, onEdit, onDelete }) {
  if (!cl) return null;
  const prj = _PROJECTS.filter(p => p.cl === cl.id);
  return <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ background: "#fff", border: `1px solid ${C.b}`, borderRadius: 10, padding: "18px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>{cl.name}</span><HB h={cl.health} /><Badge sm>{cl.type}</Badge><div style={{ marginLeft: "auto", display: "flex", gap: 6 }}><Btn sm onClick={() => onEdit(cl)}>Edit</Btn><Btn sm v="ghost" onClick={() => onDelete(cl)} style={{ color: C.r }}>Delete</Btn></div></div>
      <div style={{ fontSize: 12, color: C.t2 }}>{cl.industry} · {cl.contact}</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Panel title="Tech Stack"><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{cl.stack.map(s => <Badge key={s}>{s}</Badge>)}</div></Panel>
      <Panel title="Contact"><div style={{ fontSize: 12, color: C.t2 }}>{cl.contact}</div></Panel>
    </div>
    <Panel noPad title={`Projects (${prj.length})`}><Table cols={[
      { label: "Project", render: r => <span style={{ fontWeight: 600 }}>{r.name}</span> }, { label: "Stage", render: r => <StB stage={r.stage} /> }, { label: "Health", render: r => <HB h={r.health} /> }, { label: "Budget", render: r => <span style={{ fontFamily: M, fontSize: 11 }}>{r.budget}</span> },
    ]} rows={prj} onRow={r => onOpen(r.id)} /></Panel>
  </div>;
}
