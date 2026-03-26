import { C, M } from "../shared/theme";
import { _TEAM, _PROJECTS } from "../shared/store";
import { Av, Badge } from "../components/ui";

export default function TeamView() {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
    {_TEAM.map(m => { const pct = Math.round(m.used / m.cap * 100); const prj = _PROJECTS.filter(p => p.team.includes(m.id)); const tasks = _PROJECTS.flatMap(p => p.tasks.filter(t => t.ow === m.id)).filter(t => t.st !== "done");
      return <div key={m.id} style={{ background: "#fff", border: `1px solid ${C.b}`, borderRadius: 10, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Av m={m} sz={34} /><div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 650 }}>{m.name}</div><div style={{ fontSize: 10, color: C.t3 }}>{m.role} · {m.dept}</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 20, fontWeight: 700, color: pct > 90 ? C.r : pct > 75 ? C.y : C.t, letterSpacing: "-0.03em" }}>{pct}%</div><div style={{ fontSize: 9, color: C.t3 }}>utilized</div></div>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: C.s3, marginBottom: 12 }}><div style={{ height: "100%", borderRadius: 2, background: pct > 90 ? C.r : pct > 75 ? C.y : C.g, width: `${pct}%` }} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700 }}>{prj.length}</div><div style={{ fontSize: 9, color: C.t3 }}>Projects</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700 }}>{tasks.length}</div><div style={{ fontSize: 9, color: C.t3 }}>Open</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, fontFamily: M }}>{m.used}h</div><div style={{ fontSize: 9, color: C.t3 }}>Week</div></div>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{m.skills.map(s => <Badge key={s} sm>{s}</Badge>)}</div>
      </div> })}
  </div>;
}
