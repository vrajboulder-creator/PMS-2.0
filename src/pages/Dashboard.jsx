import { C, M, SC } from "../shared/theme";
import { _TEAM, _CLIENTS, _PROJECTS, gc } from "../shared/store";
import { HB, StB, Panel, Stat } from "../components/ui";

export default function Dashboard({ onOpen }) {
  const active = _PROJECTS.filter(p => !["Completed", "Archived", "On Hold"].includes(p.stage));
  const allT = _PROJECTS.flatMap(p => p.tasks);
  const allI = _PROJECTS.flatMap(p => p.issues);
  const overdue = allT.filter(t => t.st !== "done" && t.due && new Date(t.due) < new Date());
  const blocked = allT.filter(t => t.st === "blocked");
  const crit = _PROJECTS.filter(p => p.health === "critical");
  const atRisk = _PROJECTS.filter(p => p.health === "at-risk");
  const totEst = allT.reduce((a, t) => a + (t.est || 0), 0);
  const totAct = allT.reduce((a, t) => a + (t.act || 0), 0);

  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
      <Stat label="Active Projects" value={active.length} accent={C.a} />
      <Stat label="Active Clients" value={_CLIENTS.length} accent={C.t} />
      <Stat label="Open Tasks" value={allT.filter(t => t.st !== "done").length} />
      <Stat label="Overdue" value={overdue.length} accent={overdue.length ? C.r : C.g} alert={overdue.length > 0} />
      <Stat label="Blocked" value={blocked.length} accent={blocked.length ? C.r : C.g} alert={blocked.length > 0} />
      <Stat label="Open Issues" value={allI.filter(i => i.st === "open").length} accent={allI.filter(i => i.st === "open").length ? C.o : C.g} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
      <Stat label="Critical" value={crit.length} accent={crit.length ? C.r : C.g} alert={crit.length > 0} />
      <Stat label="At Risk" value={atRisk.length} accent={atRisk.length ? C.y : C.g} />
      <Stat label="Awaiting Client" value={_PROJECTS.filter(p => ["Client Review", "Awaiting Approval"].includes(p.stage)).length} />
      <Stat label="Ready to Deploy" value={_PROJECTS.filter(p => p.stage === "Deployment").length} accent={C.g} />
      <Stat label="Hours Tracked" value={`${totAct}h`} sub={`of ${totEst}h estimated`} />
      <Stat label="Team Utilization" value={`${_TEAM.length ? Math.round(_TEAM.reduce((a, t) => a + (t.used || 0), 0) / (_TEAM.reduce((a, t) => a + (t.cap || 0), 0) || 1) * 100) : 0}%`} />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Panel title="Projects Needing Attention" noPad>
        {_PROJECTS.filter(p => p.health !== "healthy" && p.stage !== "Completed").map(p => <div key={p.id} onClick={() => onOpen(p.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: `1px solid ${C.b2}`, cursor: "pointer" }} onMouseOver={e => e.currentTarget.style.background = C.s2} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
          <HB h={p.health} /><div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 10, color: C.t3 }}>{gc(p.cl)?.name}</div></div><StB stage={p.stage} />
        </div>)}
      </Panel>
      <Panel title="Recent Activity" noPad>
        {_PROJECTS.flatMap(p => p.activity.map(a => ({ ...a, pn: p.name }))).slice(0, 8).map((a, i) => <div key={i} style={{ display: "flex", gap: 10, padding: "8px 16px", borderBottom: `1px solid ${C.b2}` }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.x === "status" || a.x === "issue" ? C.r : a.x === "task" ? C.g : a.x === "stage" ? C.p : C.a, marginTop: 5, flexShrink: 0 }} />
          <div><div style={{ fontSize: 11.5 }}>{a.t}</div><div style={{ fontSize: 10, color: C.t3 }}>{a.pn} · {a.w}</div></div>
        </div>)}
      </Panel>
    </div>

    <Panel title="Pipeline Distribution">{["Lead", "Proposal", "Build", "Revision", "Client Review", "QA / UAT", "Completed"].map(s => { const n = _PROJECTS.filter(p => p.stage === s).length; if (!n) return null; return <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: 2, background: SC[s], flexShrink: 0 }} /><span style={{ fontSize: 11, flex: 1 }}>{s}</span><span style={{ fontSize: 11, fontFamily: M, fontWeight: 600, color: C.t2 }}>{n}</span>
      <div style={{ width: 120, height: 4, borderRadius: 2, background: C.s3, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 2, background: SC[s], width: `${(n / _PROJECTS.length) * 100}%` }} /></div>
    </div> })}</Panel>
  </div>;
}
