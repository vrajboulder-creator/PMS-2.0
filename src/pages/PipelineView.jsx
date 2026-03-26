import { C, F, M, SC, shadow, shadowHover } from "../shared/theme";
import { I } from "../shared/icons";
import { _PROJECTS, gc } from "../shared/store";
import { HB, AvStack, Btn } from "../components/ui";

export default function PipelineView({ onOpen, onStageChange, onAdd }) {
  const stages = ["Lead", "Proposal", "Build", "Client Review", "QA / UAT", "Completed"];
  return <div>
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}><Btn sm onClick={onAdd}>{I.plus} New Project</Btn></div>
    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 16, minHeight: "65vh" }}>
      {stages.map(s => { const prj = _PROJECTS.filter(p => p.stage === s); const c = SC[s];
        return <div key={s} style={{ minWidth: 230, maxWidth: 250, background: "#fff", borderRadius: 10, border: `1px solid ${C.b}`, display: "flex", flexDirection: "column", flexShrink: 0, boxShadow: shadow }}>
          <div style={{ padding: "11px 14px", borderBottom: `1px solid ${C.b2}`, display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} /><span style={{ fontSize: 12, fontWeight: 650, flex: 1 }}>{s}</span><span style={{ fontSize: 10, fontFamily: M, fontWeight: 600, color: C.t3 }}>{prj.length}</span>
          </div>
          <div style={{ padding: 8, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            {prj.map(p => <div key={p.id} style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${C.b2}`, background: C.s2, cursor: "pointer", transition: "all .12s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.b; e.currentTarget.style.boxShadow = shadowHover }} onMouseOut={e => { e.currentTarget.style.borderColor = C.b2; e.currentTarget.style.boxShadow = "none" }}>
              <div onClick={() => onOpen(p.id)} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{p.name}</span><HB h={p.health} /></div>
              <div onClick={() => onOpen(p.id)} style={{ fontSize: 10, color: C.t3, marginBottom: 8 }}>{gc(p.cl)?.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><AvStack ids={p.team} sz={18} />{p.tasks.length > 0 && <span style={{ fontSize: 9, fontFamily: M, color: C.t3 }}>{p.tasks.filter(t => t.st === "done").length}/{p.tasks.length}</span>}</div>
              {p.tasks.length > 0 && <div style={{ marginTop: 4, height: 3, borderRadius: 2, background: C.s3, marginBottom: 8 }}><div style={{ height: "100%", borderRadius: 2, background: c, width: `${(p.tasks.filter(t => t.st === "done").length / p.tasks.length) * 100}%` }} /></div>}
              <div style={{ borderTop: `1px solid ${C.b2}`, paddingTop: 8 }}>
                <select value={p.stage} onChange={e => onStageChange(p.id, e.target.value)} onClick={e => e.stopPropagation()} style={{ width: "100%", padding: "4px 8px", borderRadius: 5, border: `1px solid ${C.b}`, fontSize: 10, fontFamily: F, color: C.t2, background: "#fff", cursor: "pointer", outline: "none" }}>
                  {stages.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>)}
          </div>
        </div> })}
    </div></div>;
}
