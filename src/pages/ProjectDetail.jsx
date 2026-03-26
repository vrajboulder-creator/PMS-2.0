import { useState, useRef, useCallback } from "react";
import { C, F, M, shadow } from "../shared/theme";
import { I } from "../shared/icons";
import { _TEAM, gc, gm } from "../shared/store";
import { Av, AvStack, HB, SB, PB, StB, FI, Badge, Btn, Panel, Table } from "../components/ui";

/* ═══ MIC BUTTON ═══ */
const MicBtn = ({ listening, onToggle }) => (
  <button onClick={onToggle} title={listening ? "Stop" : "Dictate"} style={{
    background: listening ? C.r : "none", border: `1px solid ${listening ? C.r : C.b}`,
    borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: listening ? "#fff" : C.t3,
    display: "inline-flex", alignItems: "center", transition: "all .15s",
  }}>
    <svg width="14" height="14" fill={listening ? "#fff" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  </button>
);

/* ═══ FAST DICTATION HOOK — continuous + interim results ═══ */
function useDictate(onText) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const toggle = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported in this browser."); return; }

    if (listening && recRef.current) { recRef.current.stop(); setListening(false); return; }

    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) { finalText += t; onText(t.trim()); }
        else interim = t;
      }
      if (interim) onText(interim.trim(), true);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [listening, onText]);

  return { listening, toggle };
}

/* ═══ EDITABLE LIST — reusable for Objectives, Risks, etc ═══ */
function EditableList({ title, items, icon, iconColor, placeholder, onAdd, onRemove, emptyText }) {
  const [val, setVal] = useState("");
  const [interim, setInterim] = useState("");

  const handleDictateText = useCallback((text, isInterim) => {
    if (isInterim) { setInterim(text); }
    else { setInterim(""); setVal(prev => prev ? prev + " " + text : text); }
  }, []);

  const { listening, toggle } = useDictate(handleDictateText);

  const add = () => { if (!val.trim()) return; onAdd(val.trim()); setVal(""); };

  return (
    <Panel title={title} actions={<span style={{ fontSize: 10, color: C.t3 }}>{items.length} items</span>}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, marginBottom: 6, padding: "4px 0" }}>
          <span style={{ color: iconColor, flexShrink: 0 }}>{icon}</span>
          <span style={{ flex: 1 }}>{item}</span>
          <button onClick={() => onRemove(i)} style={{ background: "none", border: "none", cursor: "pointer", color: C.t3, padding: 0, flexShrink: 0 }} title="Remove">{I.x}</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") add() }}
            placeholder={listening ? "Listening..." : placeholder}
            style={{ width: "100%", padding: "7px 12px", borderRadius: 6, border: `1px solid ${listening ? C.r : C.b}`, fontSize: 11, fontFamily: F, color: C.t, outline: "none", transition: "border-color .2s", boxSizing: "border-box" }}
            onFocus={e => { if (!listening) e.target.style.borderColor = C.bFocus }} onBlur={e => { if (!listening) e.target.style.borderColor = C.b }} />
          {listening && interim && <div style={{ position: "absolute", left: 12, bottom: -16, fontSize: 10, color: C.t3, fontStyle: "italic" }}>{interim}...</div>}
        </div>
        <MicBtn listening={listening} onToggle={toggle} />
        <Btn sm v="primary" onClick={add}>{I.plus} Add</Btn>
      </div>
    </Panel>
  );
}

/* ═══ PROJECT DETAIL ═══ */
export default function ProjectDetail({ p, exT, tT, exS, tS, onEdit, onDelete, onAddTask, onEditTask, onDeleteTask, onUpdateTask, onAddComment, onUpdateProject }) {
  if (!p) return null;
  const cl = gc(p.cl), pm = gm(p.pm);
  const done = p.tasks.filter(t => t.st === "done").length, total = p.tasks.length;

  const updateList = (field, items) => onUpdateProject(p.id, { [field]: items });

  return <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    {/* Header */}
    <div style={{ background: "#fff", border: `1px solid ${C.b}`, borderRadius: 10, padding: "18px 22px", boxShadow: shadow }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>{p.name}</span><HB h={p.health} /><StB stage={p.stage} /><div style={{ marginLeft: "auto", display: "flex", gap: 6 }}><Btn sm onClick={() => onEdit(p)}>Edit</Btn><Btn sm v="ghost" onClick={() => onDelete(p)} style={{ color: C.r }}>Delete</Btn></div></div>
      <div style={{ fontSize: 12, color: C.t2, marginBottom: 10 }}>{cl?.name} · {p.type} · {p.desc}</div>
      <div style={{ display: "flex", gap: 16, fontSize: 11, flexWrap: "wrap" }}>
        {pm && <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Av m={pm} sz={18} /><span style={{ color: C.t3 }}>PM:</span> {pm.name}</div>}
        <AvStack ids={p.team} sz={18} />
        <span style={{ color: C.t3 }}>Start: <span style={{ color: C.t, fontFamily: M }}>{p.start}</span></span>
        <span style={{ color: C.t3 }}>Target: <span style={{ color: C.t, fontFamily: M }}>{p.target}</span></span>
        <span style={{ color: C.t3 }}>Budget: <span style={{ color: C.t, fontFamily: M }}>{p.budget}</span></span>
        <span style={{ color: C.t3 }}>Billed: <span style={{ color: C.g, fontFamily: M }}>{p.billed}</span></span>
      </div>
      {total > 0 && <div style={{ marginTop: 14 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 10, color: C.t3 }}>Task Progress</span><span style={{ fontSize: 10, fontFamily: M, color: C.t2 }}>{done}/{total} ({Math.round(done / total * 100)}%)</span></div>
        <div style={{ height: 5, borderRadius: 3, background: C.s3 }}><div style={{ height: "100%", borderRadius: 3, background: C.g, width: `${(done / total) * 100}%`, transition: "width .3s" }} /></div></div>}
    </div>

    {/* ═══ EDITABLE SECTIONS ═══ */}

    <EditableList title="Objectives" items={p.obj || []} icon="◆" iconColor={C.g} placeholder="Add an objective..."
      onAdd={text => updateList("obj", [...(p.obj || []), text])}
      onRemove={i => updateList("obj", (p.obj || []).filter((_, idx) => idx !== i))} />

    <EditableList title="Key Risks" items={p.risks || []} icon={I.alert} iconColor={C.y} placeholder="Add a risk..."
      onAdd={text => updateList("risks", [...(p.risks || []), text])}
      onRemove={i => updateList("risks", (p.risks || []).filter((_, idx) => idx !== i))} />

    {/* Open Issues — editable */}
    <Panel noPad title={`Issues (${p.issues.length})`}>
      {p.issues.length ? <Table cols={[
        { label: "Issue", render: r => <span style={{ fontWeight: 500 }}>{r.title}</span> },
        { label: "Type", render: r => <Badge sm>{r.tp}</Badge> },
        { label: "Severity", render: r => <Badge sm color={r.sev === "critical" ? C.r : r.sev === "high" ? C.o : C.y}>{r.sev}</Badge> },
        { label: "Status", render: r => <Badge sm color={r.st === "open" ? C.r : C.g}>{r.st}</Badge> },
      ]} rows={p.issues} /> : <div style={{ padding: 20, textAlign: "center", color: C.t3, fontSize: 12 }}>No issues</div>}
    </Panel>

    {/* Tasks */}
    <Panel noPad title={`Tasks (${total})`} actions={<Btn sm onClick={() => onAddTask(p.id)}>{I.plus} Add Task</Btn>}>
      {p.tasks.map(task => { const ow = gm(task.ow), isEx = exT[task.id];
        return <div key={task.id} style={{ borderBottom: `1px solid ${C.b2}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer" }} onClick={() => tT(task.id)}
            onMouseOver={e => e.currentTarget.style.background = C.s2} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ color: C.t3, transition: "transform .15s", transform: isEx ? "rotate(90deg)" : "none" }}>{I.chR}</span>
            <PB p={task.pr} />
            <button onClick={e => { e.stopPropagation(); const next = { backlog: "todo", todo: "in-progress", "in-progress": "review", review: "done", done: "backlog", blocked: "todo" }[task.st] || "todo"; onUpdateTask(task.id, { st: next }) }} title="Click to advance status" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><SB s={task.st} /></button>
            <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: task.st === "done" ? C.t3 : C.t, textDecoration: task.st === "done" ? "line-through" : "none" }}>{task.title}</span>
            {ow && <Av m={ow} sz={20} />}
            <span style={{ fontSize: 10, fontFamily: M, color: task.due && new Date(task.due) < new Date() && task.st !== "done" ? C.r : C.t3, minWidth: 72, textAlign: "right" }}>{task.due}</span>
            <span style={{ fontSize: 10, fontFamily: M, color: C.t3, minWidth: 52, textAlign: "right" }}>{task.act || 0}/{task.est || 0}h</span>
            {task.subs?.length > 0 && <Badge sm>{task.subs.length} sub</Badge>}
            <Btn sm v="ghost" onClick={e => { e.stopPropagation(); onEditTask({ ...task, project_id: p.id }) }}>Edit</Btn>
            <Btn sm v="ghost" onClick={e => { e.stopPropagation(); onDeleteTask(task) }} style={{ color: C.r }}>Delete</Btn>
          </div>

          {isEx && task.subs?.length > 0 && <div style={{ marginLeft: 34, borderLeft: `2px solid ${C.b}`, marginBottom: 8 }}>
            {task.subs.map(st => { const so = gm(st.ow), se = exS[st.id];
              return <div key={st.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12 }} onClick={() => tS(st.id)}
                  onMouseOver={e => e.currentTarget.style.background = C.s2} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ color: C.t3, transition: "transform .15s", transform: se ? "rotate(90deg)" : "none", fontSize: 10 }}>{I.chR}</span>
                  <SB s={st.st} /><span style={{ flex: 1, fontSize: 11.5, fontWeight: 500, color: st.st === "done" ? C.t3 : C.t }}>{st.title}</span>
                  {so && <Av m={so} sz={18} />}
                  <span style={{ fontSize: 10, fontFamily: M, color: C.t3 }}>{st.due}</span>
                  {st.files?.length > 0 && <span style={{ display: "flex", alignItems: "center", gap: 2, color: C.t3 }}>{I.attach}<span style={{ fontSize: 10, fontFamily: M }}>{st.files.length}</span></span>}
                  {st.comments?.length > 0 && <span style={{ display: "flex", alignItems: "center", gap: 2, color: C.t3 }}><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg><span style={{ fontSize: 10, fontFamily: M }}>{st.comments.length}</span></span>}
                </div>

                {se && <div style={{ margin: "0 0 8px 26px", background: C.s2, border: `1px solid ${C.b}`, borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.b2}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 650, color: C.t2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Attachments ({st.files?.length || 0})</span>
                      <Btn sm v="ghost" style={{ fontSize: 10 }}>{I.plus} Upload</Btn>
                    </div>
                    {st.files?.length > 0 ? st.files.map((f, fi) => <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "#fff", borderRadius: 6, border: `1px solid ${C.b2}`, marginBottom: 4 }}>
                      <FI t={f.t} /><span style={{ flex: 1, fontSize: 11, fontWeight: 500 }}>{f.n}</span>
                      <span style={{ fontSize: 9, fontFamily: M, color: C.t3 }}>{f.sz}</span>
                      <span style={{ fontSize: 9, color: C.t3 }}>{gm(f.by)?.name?.split(" ")[0]}</span>
                      <span style={{ fontSize: 9, fontFamily: M, color: C.t3 }}>{f.d}</span>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: C.t3, padding: 0 }}>{I.dl}</button>
                    </div>) : <div style={{ padding: 14, textAlign: "center", border: `1px dashed ${C.b}`, borderRadius: 6, background: "#fff" }}>
                      <div style={{ fontSize: 11, color: C.t3 }}>No files yet — drop files or click Upload</div>
                    </div>}
                  </div>
                  <div style={{ padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, fontWeight: 650, color: C.t2, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Comments ({st.comments?.length || 0})</div>
                    {st.comments?.map((cm, ci) => { const ca = gm(cm.a); return <div key={ci} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      {ca && <Av m={ca} sz={20} />}<div style={{ flex: 1 }}><div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}><span style={{ fontSize: 11, fontWeight: 600 }}>{ca?.name}</span><span style={{ fontSize: 9, color: C.t3 }}>{cm.time}</span></div>
                      <div style={{ fontSize: 11.5, color: C.t2, lineHeight: 1.5 }}>{cm.t}</div></div>
                    </div> })}
                    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                      <input id={`cmt-${st.id}`} placeholder="Add a comment..." style={{ flex: 1, padding: "7px 12px", borderRadius: 6, border: `1px solid ${C.b}`, background: "#fff", fontSize: 11, fontFamily: F, color: C.t, outline: "none" }} onFocus={e => e.target.style.borderColor = C.bFocus} onBlur={e => e.target.style.borderColor = C.b} onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim()) { onAddComment(st.id, _TEAM[0]?.id || "u1", e.target.value.trim()); e.target.value = "" } }} />
                      <Btn sm v="primary" onClick={() => { const el = document.getElementById(`cmt-${st.id}`); if (el && el.value.trim()) { onAddComment(st.id, _TEAM[0]?.id || "u1", el.value.trim()); el.value = "" } }}>{I.send}</Btn>
                    </div>
                  </div>
                </div>}
              </div> })}
          </div>}
          {isEx && (!task.subs || !task.subs.length) && <div style={{ marginLeft: 34, padding: "8px 14px 12px" }}><Btn sm v="ghost" style={{ fontSize: 10 }}>{I.plus} Add Sub-task</Btn></div>}
        </div> })}
      {!total && <div style={{ padding: 28, textAlign: "center", color: C.t3, fontSize: 12 }}>No tasks yet.</div>}
    </Panel>

    {/* Deliverables */}
    <Panel noPad title="Deliverables">{p.deliverables.length ? <Table cols={[
      { label: "Name", render: r => <span style={{ fontWeight: 500 }}>{r.n}</span> }, { label: "Type", render: r => <Badge sm>{r.tp}</Badge> }, { label: "Status", render: r => <Badge sm>{r.st}</Badge> }, { label: "Version", render: r => <span style={{ fontFamily: M, fontSize: 11 }}>{r.v}</span> },
    ]} rows={p.deliverables} /> : <div style={{ padding: 20, textAlign: "center", color: C.t3, fontSize: 12 }}>None tracked</div>}</Panel>

    {/* Automations */}
    <Panel noPad title="Automations">{p.autos.length ? <Table cols={[
      { label: "Name", render: r => <span style={{ fontWeight: 500 }}>{r.n}</span> }, { label: "Platform", render: r => <Badge sm>{r.pl}</Badge> }, { label: "Status", render: r => <Badge sm color={r.st === "deployed" ? C.g : r.st === "in-dev" ? C.a : C.t2}>{r.st}</Badge> },
    ]} rows={p.autos} /> : <div style={{ padding: 20, textAlign: "center", color: C.t3, fontSize: 12 }}>None tracked</div>}</Panel>

    {/* Activity */}
    <Panel title="Activity">{p.activity.length ? p.activity.map((a, i) => <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < p.activity.length - 1 ? `1px solid ${C.b2}` : "none" }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.x === "task" ? C.g : a.x === "comment" ? C.a : a.x === "status" || a.x === "issue" ? C.r : C.p, marginTop: 5, flexShrink: 0 }} />
      <div><div style={{ fontSize: 12 }}>{a.t}</div><div style={{ fontSize: 10, color: C.t3 }}>{a.w}</div></div>
    </div>) : <div style={{ color: C.t3, fontSize: 12 }}>No activity</div>}</Panel>

    {/* Files */}
    <Panel title="All Files" actions={<Btn sm>{I.plus} Upload</Btn>}>
      {p.tasks.flatMap(t => (t.subs || []).flatMap(s => (s.files || []).map(f => ({ ...f, sub: s.title, task: t.title })))).map((f, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, border: `1px solid ${C.b2}`, marginBottom: 4, background: C.s2 }}>
        <FI t={f.t} /><span style={{ flex: 1, fontSize: 11, fontWeight: 500 }}>{f.n}</span>
        <span style={{ fontSize: 10, color: C.t3 }}>{f.task} → {f.sub}</span>
        <span style={{ fontSize: 9, fontFamily: M, color: C.t3 }}>{f.sz}</span><span style={{ fontSize: 9, color: C.t3 }}>{f.d}</span>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.t3 }}>{I.dl}</button>
      </div>)}
      {!p.tasks.flatMap(t => (t.subs || []).flatMap(s => s.files || [])).length && <div style={{ textAlign: "center", color: C.t3, fontSize: 12, padding: 20 }}>No files</div>}
    </Panel>
  </div>;
}
