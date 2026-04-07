import { useState, useRef } from "react";
import { C, F, M, SC, shadow, shadowHover } from "../shared/theme";
import { I } from "../shared/icons";
import { _PROJECTS, gc, gm } from "../shared/store";
import { HB, AvStack, Av, Btn, StB } from "../components/ui";

export default function PipelineView({ onOpen, onStageChange, onAdd }) {
  const activeStages = ["Lead", "Proposal", "Build", "Revision", "Client Review", "QA / UAT"];
  const [tab, setTab] = useState("active");
  const [dragId, setDragId] = useState(null);
  const [overStage, setOverStage] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const dragRef = useRef(null);

  const onDragStart = (e, projectId) => {
    setDragId(projectId);
    dragRef.current = projectId;
    e.dataTransfer.effectAllowed = "move";
    // Make the drag ghost slightly transparent
    requestAnimationFrame(() => {
      if (e.target) e.target.style.opacity = "0.4";
    });
  };

  const onDragEnd = (e) => {
    e.target.style.opacity = "1";
    // If we have a valid drop target, perform the stage change
    if (dragRef.current && overStage) {
      const proj = _PROJECTS.find(p => p.id === dragRef.current);
      if (proj && proj.stage !== overStage) {
        onStageChange(dragRef.current, overStage);
      }
    }
    setDragId(null);
    setOverStage(null);
    setOverIdx(null);
    dragRef.current = null;
  };

  const onColumnDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverStage(stage);
  };

  const onColumnDragLeave = (e, stage) => {
    // Only clear if we actually left the column (not just entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      if (overStage === stage) setOverStage(null);
    }
  };

  const onColumnDrop = (e, stage) => {
    e.preventDefault();
    if (dragRef.current) {
      const proj = _PROJECTS.find(p => p.id === dragRef.current);
      if (proj && proj.stage !== stage) {
        onStageChange(dragRef.current, stage);
      }
    }
    setDragId(null);
    setOverStage(null);
    setOverIdx(null);
    dragRef.current = null;
  };

  const completedProjects = _PROJECTS.filter(p => p.stage === "Completed");

  return <div>
    {/* ── Tab Bar + Action ── */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <div style={{ display: "flex", gap: 2, background: C.s2, borderRadius: 8, padding: 3, border: `1px solid ${C.b}` }}>
        {[["active", "Active"], ["completed", "Completed"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: "5px 16px", borderRadius: 6, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 600, fontFamily: F, transition: "all .15s",
            background: tab === k ? "#fff" : "transparent",
            color: tab === k ? C.t : C.t3,
            boxShadow: tab === k ? shadow : "none",
          }}>
            {l}
            <span style={{ marginLeft: 6, fontSize: 10, fontFamily: M, fontWeight: 600, color: tab === k ? C.a : C.t3 }}>
              {k === "active" ? _PROJECTS.filter(p => p.stage !== "Completed").length : completedProjects.length}
            </span>
          </button>
        ))}
      </div>
      <Btn sm onClick={onAdd}>{I.plus} New Project</Btn>
    </div>

    {/* ── ACTIVE KANBAN ── */}
    {tab === "active" && <div style={{ display: "flex", gap: 10, paddingBottom: 16, minHeight: "calc(100vh - 180px)" }}>
      {activeStages.map(s => {
        const prj = _PROJECTS.filter(p => p.stage === s);
        const c = SC[s];
        const isOver = overStage === s && dragId;
        const isDragSource = prj.some(p => p.id === dragId);

        return <div
          key={s}
          onDragOver={e => onColumnDragOver(e, s)}
          onDragLeave={e => onColumnDragLeave(e, s)}
          onDrop={e => onColumnDrop(e, s)}
          style={{
            flex: 1, minWidth: 0, background: isOver ? C.aSoft : "#fff",
            borderRadius: 10, border: `1px solid ${isOver ? C.a : C.b}`,
            display: "flex", flexDirection: "column", boxShadow: shadow,
            transition: "all .2s ease", overflow: "hidden",
          }}>
          <div style={{ padding: "11px 14px", borderBottom: `1px solid ${isOver ? `${C.a}40` : C.b2}`, display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
            <span style={{ fontSize: 12, fontWeight: 650, flex: 1 }}>{s}</span>
            <span style={{ fontSize: 10, fontFamily: M, fontWeight: 600, color: C.t3 }}>{prj.length}</span>
          </div>
          <div style={{ padding: 8, flex: 1, display: "flex", flexDirection: "column", gap: 8, minHeight: 60 }}>
            {prj.map(p => (
              <div
                key={p.id}
                draggable
                onDragStart={e => onDragStart(e, p.id)}
                onDragEnd={onDragEnd}
                style={{
                  padding: "12px 14px", borderRadius: 8,
                  border: `1px solid ${dragId === p.id ? C.a : C.b2}`,
                  background: dragId === p.id ? `${C.a}08` : C.s2,
                  cursor: "grab", transition: "all .15s", userSelect: "none",
                }}
                onMouseOver={e => { if (!dragId) { e.currentTarget.style.borderColor = C.b; e.currentTarget.style.boxShadow = shadowHover } }}
                onMouseOut={e => { if (!dragId) { e.currentTarget.style.borderColor = C.b2; e.currentTarget.style.boxShadow = "none" } }}
              >
                <div onClick={() => onOpen(p.id)} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.3, flex: 1, minWidth: 0 }}>{p.name}</span>
                </div>
                <div onClick={() => onOpen(p.id)} style={{ fontSize: 10, color: C.t3, marginBottom: 8 }}>{gc(p.cl)?.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <AvStack ids={p.team} sz={18} />
                  {p.tasks.length > 0 && <span style={{ fontSize: 9, fontFamily: M, color: C.t3 }}>{p.tasks.filter(t => t.st === "done").length}/{p.tasks.length}</span>}
                </div>
                {p.tasks.length > 0 && <div style={{ marginTop: 7, height: 3, borderRadius: 2, background: C.s3 }}><div style={{ height: "100%", borderRadius: 2, background: c, width: `${(p.tasks.filter(t => t.st === "done").length / p.tasks.length) * 100}%` }} /></div>}
              </div>
            ))}

            {isOver && !isDragSource && <div style={{
              padding: "20px 14px", borderRadius: 8,
              border: `2px dashed ${C.a}`, background: `${C.a}08`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.a, fontSize: 11, fontWeight: 500,
              transition: "all .2s",
            }}>Drop here</div>}

            {prj.length === 0 && !isOver && <div style={{
              padding: "20px 14px", borderRadius: 8,
              border: `1px dashed ${C.b}`, background: C.s2,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.t3, fontSize: 11,
            }}>No projects</div>}
          </div>
        </div>;
      })}
    </div>}

    {/* ── COMPLETED TAB ── */}
    {tab === "completed" && <div>
      {completedProjects.length === 0
        ? <div style={{ padding: 48, textAlign: "center", color: C.t3, fontSize: 13 }}>No completed projects yet.</div>
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {completedProjects.map(p => {
            const doneTasks = p.tasks.filter(t => t.st === "done").length;
            const totalTasks = p.tasks.length;
            const pm = gm(p.pm);
            return <div key={p.id} onClick={() => onOpen(p.id)} style={{
              background: "#fff", borderRadius: 10, border: `1px solid ${C.b}`,
              padding: "16px 18px", cursor: "pointer", boxShadow: shadow,
              transition: "all .15s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.b; e.currentTarget.style.boxShadow = shadowHover; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.b; e.currentTarget.style.boxShadow = shadow; }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 650, lineHeight: 1.3, flex: 1 }}>{p.name}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: SC["Completed"] || "#16a34a", background: "#f0fdf4", borderRadius: 5, padding: "2px 7px", marginLeft: 8, flexShrink: 0 }}>DONE</span>
              </div>
              <div style={{ fontSize: 11, color: C.t3, marginBottom: 12 }}>{gc(p.cl)?.name}</div>

              {/* Meta row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                {pm && <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Av m={pm} sz={18} />
                  <span style={{ fontSize: 10, color: C.t2 }}>{pm.name.split(" ")[0]}</span>
                </div>}
                <span style={{ fontSize: 10, fontFamily: M, color: C.t3, marginLeft: "auto" }}>{p.budget}</span>
              </div>

              {/* Team */}
              <div style={{ marginBottom: 10 }}>
                <AvStack ids={p.team} sz={18} />
              </div>

              {/* Task progress */}
              {totalTasks > 0 && <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: C.t3 }}>Tasks</span>
                  <span style={{ fontSize: 10, fontFamily: M, color: C.t2 }}>{doneTasks}/{totalTasks}</span>
                </div>
                <div style={{ height: 3, borderRadius: 2, background: C.s3 }}>
                  <div style={{ height: "100%", borderRadius: 2, background: "#16a34a", width: `${(doneTasks / totalTasks) * 100}%` }} />
                </div>
              </>}

              {/* Dates */}
              {p.target && <div style={{ marginTop: 10, fontSize: 10, color: C.t3 }}>Completed by {p.target}</div>}
            </div>;
          })}
        </div>
      }
    </div>}
  </div>;
}
