import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useTeam, useClients, useProjects } from "./useSupabaseData";
import { F, M, C } from "./shared/theme";
import { I } from "./shared/icons";
import { setStore, _TEAM, _CLIENTS, _PROJECTS, gc, gm } from "./shared/store";
import { Av, AvStack, SB, PB, StB, Badge, Btn, Panel, Table, ConfirmDelete } from "./components/ui";
import ClientForm from "./components/forms/ClientForm";
import ProjectForm from "./components/forms/ProjectForm";
import TaskForm from "./components/forms/TaskForm";
import Dashboard from "./pages/Dashboard";
import ClientDetail from "./pages/ClientDetail";
import ProjectDetail from "./pages/ProjectDetail";
import PipelineView from "./pages/PipelineView";
import TeamView from "./pages/TeamView";
import Login from "./pages/Login";
import BoulderLogo from "./shared/BoulderLogo";

/* ═══ NAV ═══ */
const NAV=[
  {sec:"OPERATIONS"},{k:"dashboard",i:I.dash,l:"Dashboard"},{k:"clients",i:I.clients,l:"Clients"},{k:"projects",i:I.projects,l:"Projects"},{k:"pipeline",i:I.pipe,l:"Pipeline"},{k:"tasks",i:I.tasks,l:"Tasks"},
  {sec:"DELIVERY"},{k:"deliverables",i:I.deliv,l:"Deliverables"},{k:"automations",i:I.auto,l:"Automations"},{k:"qa",i:I.qa,l:"QA / Testing"},{k:"issues",i:I.issues,l:"Issues"},{k:"changes",i:I.changes,l:"Change Requests"},
  {sec:"RESOURCES"},{k:"files",i:I.files,l:"Files"},{k:"team",i:I.team,l:"Team"},{k:"knowledge",i:I.kb,l:"Knowledge Base"},{k:"support",i:I.support,l:"Support"},
  {sec:""},{k:"reports",i:I.reports,l:"Reports"},{k:"settings",i:I.settings,l:"Settings"},
];

/* ═══ MAIN APP ═══ */
function AuthGate() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => { setSession(s); setAuthReady(true); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (!authReady) return null;
  if (!session) return <Login />;
  return <App session={session} />;
}

export default AuthGate;

function App({ session }){
  const handleLogout = async () => { await supabase.auth.signOut(); };

  const { team } = useTeam();
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const { projects,
    addProject, updateProject, deleteProject,
    addTask, updateTask, deleteTask,
    addSubtask, updateSubtask, deleteSubtask,
    addComment, addIssue, updateIssue, addActivity,
  } = useProjects();

  // Sync shared store
  setStore(
    team.map(t => ({ ...t, av: t.avatar || t.av, c: t.color || t.c })),
    clients,
    projects
  );


  const[nav,setNav]=useState("dashboard");
  const[detail,setDetail]=useState(null);

  const[exT,setExT]=useState({});
  const[exS,setExS]=useState({});
  const[search,setSearch]=useState("");
  const[modal,setModal]=useState(null);
  const[pSort,setPSort]=useState("name");
  const[pFilter,setPFilter]=useState("all");
  const[tSort,setTSort]=useState("title");
  const[tFilter,setTFilter]=useState("all");
  const tT=id=>setExT(p=>({...p,[id]:!p[id]}));
  const tS=id=>setExS(p=>({...p,[id]:!p[id]}));
  const allT=_PROJECTS.flatMap(p=>p.tasks);
  const allI=_PROJECTS.flatMap(p=>p.issues);

  /* ── CRUD Handlers ── */
  const handleAddClient=async(f)=>{const id="cl"+Date.now();await addClient({id,name:f.name,industry:f.industry,health:f.health||"healthy",type:f.type||"Discovery",contact:f.contact,stack:f.stack?f.stack.split(",").map(s=>s.trim()).filter(Boolean):[]});setModal(null);};
  const handleEditClient=async(id,f)=>{await updateClient(id,{name:f.name,industry:f.industry,health:f.health,type:f.type,contact:f.contact,stack:f.stack?f.stack.split(",").map(s=>s.trim()).filter(Boolean):undefined});setModal(null);};
  const handleDeleteClient=async(id)=>{await deleteClient(id);setModal(null);setDetail(null);};

  const handleAddProject=async(f)=>{const id="p"+Date.now();await addProject({id,name:f.name,cl:f.cl,stage:f.stage||"Lead",health:"healthy",pm:f.pm,team:f.team?f.team:[],type:f.type||"Automation",budget:f.budget||"$0",desc:f.desc,start:f.start,target:f.target,risks:[],obj:[]});setModal(null);};
  const handleEditProject=async(id,f)=>{await updateProject(id,{name:f.name,stage:f.stage,health:f.health,pm:f.pm,team:f.team,type:f.type,budget:f.budget,desc:f.desc,target:f.target});setModal(null);};
  const handleDeleteProject=async(id)=>{await deleteProject(id);setModal(null);setDetail(null);};
  const handleStageChange=async(id,stage)=>{await updateProject(id,{stage});};

  const handleAddTask=async(f)=>{const id="t"+Date.now();await addTask({id,project_id:f.project_id,title:f.title,st:f.st||"todo",pr:f.pr||"medium",ow:f.ow,due:f.due,est:Number(f.est)||0,act:0});setModal(null);};
  const handleEditTask=async(id,f)=>{await updateTask(id,{title:f.title,st:f.st,pr:f.pr,ow:f.ow,due:f.due,est:Number(f.est)||undefined,act:Number(f.act)||undefined});setModal(null);};
  const handleDeleteTask=async(id)=>{await deleteTask(id);setModal(null);};

  /* No loading screen — render immediately, data fills in */

  return(
    <div style={{fontFamily:F,background:C.page,color:C.t,minHeight:"100vh",display:"flex",WebkitFontSmoothing:"antialiased",fontSize:13}}>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>

      {/* ═══ SIDEBAR ═══ */}
      <aside style={{width:232,background:"#fff",borderRight:`1px solid ${C.b}`,display:"flex",flexDirection:"column",flexShrink:0,position:"fixed",top:0,left:0,bottom:0,zIndex:200}}>
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.b}`,display:"flex",alignItems:"center"}}>
          <BoulderLogo height={18}/>
        </div>
        <nav style={{flex:1,overflowY:"auto",padding:"6px 10px"}}>
          {NAV.map((item,idx)=>{
            if(item.sec!==undefined)return<div key={idx} style={{fontSize:9,fontWeight:600,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",padding:"14px 8px 5px"}}>{item.sec}</div>;
            const act=nav===item.k&&!detail;
            return<button key={item.k} onClick={()=>{setNav(item.k);setDetail(null)}} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"7px 10px",borderRadius:7,border:"none",background:act?C.aSoft:"transparent",color:act?C.a:C.t2,fontSize:12.5,fontWeight:act?600:400,cursor:"pointer",fontFamily:F,marginBottom:1,transition:"all .1s"}}
              onMouseOver={e=>{if(!act){e.currentTarget.style.background=C.s2;e.currentTarget.style.color=C.t}}}
              onMouseOut={e=>{if(!act){e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.t2}}}>
              <span style={{flexShrink:0,opacity:act?1:.6}}>{item.i}</span><span style={{flex:1,textAlign:"left"}}>{item.l}</span>
            </button>;
          })}
        </nav>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${C.b}`,display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:28,height:28,borderRadius:7,background:C.a,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,fontFamily:M}}>{(session.user?.email?.[0] || "U").toUpperCase()}</div>
          <div style={{flex:1}}><div style={{fontSize:11.5,fontWeight:600}}>{session.user?.email?.split("@")[0] || "User"}</div><div style={{fontSize:10,color:C.t3}}>Admin</div></div>
          <button onClick={handleLogout} title="Sign out" style={{background:"none",border:"none",cursor:"pointer",color:C.t3,padding:2}} onMouseOver={e=>e.currentTarget.style.color=C.r} onMouseOut={e=>e.currentTarget.style.color=C.t3}>{I.x}</button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div style={{flex:1,marginLeft:232,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        <header style={{height:49,background:"#fff",borderBottom:`1px solid ${C.b}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px",position:"sticky",top:0,zIndex:100,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {detail&&<button onClick={()=>setDetail(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.t2,display:"flex",alignItems:"center",gap:4,fontSize:12,fontFamily:F,padding:0}} onMouseOver={e=>e.currentTarget.style.color=C.t} onMouseOut={e=>e.currentTarget.style.color=C.t2}>{I.back} Back</button>}
            <span style={{fontSize:13.5,fontWeight:650,color:C.t}}>{detail?"":NAV.find(n=>n.k===nav)?.l||""}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{position:"relative"}}><span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:C.t3}}>{I.search}</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search... ⌘K" style={{padding:"6px 12px 6px 30px",borderRadius:7,border:`1px solid ${C.b}`,background:C.s2,fontSize:12,fontFamily:F,width:200,color:C.t,outline:"none"}} onFocus={e=>e.target.style.borderColor=C.bFocus} onBlur={e=>e.target.style.borderColor=C.b}/></div>
          </div>
        </header>

        <main style={{flex:1,padding:22,overflowY:"auto"}}>
          {/* ═══ DASHBOARD ═══ */}
          {nav==="dashboard"&&!detail&&<Dashboard onOpen={id=>{setDetail({t:"project",id})}}/>}

          {/* ═══ CLIENTS ═══ */}
          {nav==="clients"&&!detail&&<><Panel noPad title={`Clients (${_CLIENTS.length})`} actions={<Btn sm onClick={()=>setModal({t:"addClient"})}>{I.plus} Add Client</Btn>}><Table cols={[
            {label:"Company",render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:10,color:C.t3}}>{r.industry}</div></div>},
            {label:"Type",render:r=><Badge sm>{r.type}</Badge>},
            {label:"Contact",render:r=><span style={{fontSize:11}}>{r.contact}</span>},
            {label:"Stack",render:r=><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{(r.stack||[]).map(s=><Badge key={s} sm>{s}</Badge>)}</div>},
            {label:"",render:r=><div style={{display:"flex",gap:4}}><Btn sm v="ghost" onClick={e=>{e.stopPropagation();setModal({t:"editClient",data:r})}}>Edit</Btn><Btn sm v="ghost" onClick={e=>{e.stopPropagation();setModal({t:"deleteClient",id:r.id,name:r.name})}}>Delete</Btn></div>},
          ]} rows={_CLIENTS} onRow={r=>setDetail({t:"client",id:r.id})}/></Panel><button onClick={()=>setModal({t:"addClient"})} style={{position:"fixed",bottom:28,right:28,width:50,height:50,borderRadius:12,background:C.a,color:"#fff",border:"none",cursor:"pointer",boxShadow:"0 4px 14px rgba(59,130,246,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,zIndex:300,transition:"all .15s"}} onMouseOver={e=>e.currentTarget.style.background=C.aHover} onMouseOut={e=>e.currentTarget.style.background=C.a} title="Add Client">+</button></>}

          {detail?.t==="client"&&<ClientDetail cl={_CLIENTS.find(c=>c.id===detail.id)} onOpen={id=>{setDetail({t:"project",id})}} onEdit={cl=>setModal({t:"editClient",data:cl})} onDelete={cl=>setModal({t:"deleteClient",id:cl.id,name:cl.name})}/>}

          {/* ═══ PROJECTS ═══ */}
          {nav==="projects"&&!detail&&(()=>{
            const stages=[...new Set(_PROJECTS.map(p=>p.stage))];
            let fp=pFilter==="all"?_PROJECTS:_PROJECTS.filter(p=>p.stage===pFilter);
            fp=[...fp].sort((a,b)=>{if(pSort==="name")return a.name.localeCompare(b.name);if(pSort==="stage")return a.stage.localeCompare(b.stage);if(pSort==="budget")return(parseInt(a.budget?.replace(/\D/g,""))||0)-(parseInt(b.budget?.replace(/\D/g,""))||0);return 0});
            return<><Panel noPad title={`Projects (${fp.length})`} actions={<div style={{display:"flex",gap:6,alignItems:"center"}}>
              <select value={pFilter} onChange={e=>setPFilter(e.target.value)} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${C.b}`,fontSize:10,fontFamily:F,color:C.t2,background:"#fff",cursor:"pointer"}}>
                <option value="all">All Stages</option>{stages.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <select value={pSort} onChange={e=>setPSort(e.target.value)} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${C.b}`,fontSize:10,fontFamily:F,color:C.t2,background:"#fff",cursor:"pointer"}}>
                <option value="name">Sort: Name</option><option value="stage">Sort: Stage</option><option value="budget">Sort: Budget</option>
              </select>
              <Btn sm onClick={()=>setModal({t:"addProject"})}>{I.plus} New Project</Btn>
            </div>}><Table cols={[
              {label:"Project",render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:10,color:C.t3}}>{gc(r.cl)?.name}</div></div>},
              {label:"Stage",render:r=><StB stage={r.stage}/>},
              {label:"PM",render:r=>{const m=gm(r.pm);return m?<div style={{display:"flex",alignItems:"center",gap:5}}><Av m={m} sz={20}/><span style={{fontSize:11}}>{m.name}</span></div>:null}},
              {label:"Team",render:r=><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{r.team.map(id=>{const m=gm(id);return m?<div key={id} style={{display:"flex",alignItems:"center",gap:3}}><Av m={m} sz={18}/><span style={{fontSize:10,color:C.t2}}>{m.name}</span></div>:null})}</div>},
              {label:"Tasks",render:r=><span style={{fontFamily:M,fontSize:11}}>{r.tasks.filter(t=>t.st==="done").length}/{r.tasks.length}</span>},
              {label:"Budget",render:r=><span style={{fontFamily:M,fontSize:11}}>{r.budget}</span>},
              {label:"",render:r=><div style={{display:"flex",gap:4}}><Btn sm v="ghost" onClick={e=>{e.stopPropagation();setModal({t:"editProject",data:r})}}>Edit</Btn><Btn sm v="ghost" onClick={e=>{e.stopPropagation();setModal({t:"deleteProject",id:r.id,name:r.name})}}>Delete</Btn></div>},
            ]} rows={fp} onRow={r=>{setDetail({t:"project",id:r.id})}}/></Panel><button onClick={()=>setModal({t:"addProject"})} style={{position:"fixed",bottom:28,right:28,width:50,height:50,borderRadius:12,background:C.a,color:"#fff",border:"none",cursor:"pointer",boxShadow:"0 4px 14px rgba(59,130,246,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,zIndex:300,transition:"all .15s"}} onMouseOver={e=>e.currentTarget.style.background=C.aHover} onMouseOut={e=>e.currentTarget.style.background=C.a} title="New Project">+</button></>;
          })()}

          {detail?.t==="project"&&<ProjectDetail p={_PROJECTS.find(p=>p.id===detail.id)} exT={exT} tT={tT} exS={exS} tS={tS} onEdit={p=>setModal({t:"editProject",data:p})} onDelete={p=>setModal({t:"deleteProject",id:p.id,name:p.name})} onAddTask={pid=>setModal({t:"addTask",projectId:pid})} onEditTask={task=>setModal({t:"editTask",data:task})} onDeleteTask={task=>setModal({t:"deleteTask",id:task.id,name:task.title})} onUpdateTask={updateTask} onAddComment={addComment} onUpdateProject={updateProject} onAddIssue={addIssue} onAddSubtask={addSubtask} onAddActivity={addActivity}/>}

          {/* ═══ PIPELINE ═══ */}
          {nav==="pipeline"&&!detail&&<PipelineView onOpen={id=>{setDetail({t:"project",id})}} onStageChange={handleStageChange} onAdd={()=>setModal({t:"addProject"})}/>}

          {/* ═══ TASKS ═══ */}
          {nav==="tasks"&&!detail&&(()=>{
            const statuses=["all","backlog","todo","in-progress","review","done","blocked"];
            let ft=tFilter==="all"?allT:allT.filter(t=>t.st===tFilter);
            ft=[...ft].sort((a,b)=>{if(tSort==="title")return a.title.localeCompare(b.title);if(tSort==="status")return(a.st||"").localeCompare(b.st||"");if(tSort==="priority"){const po={urgent:0,high:1,medium:2,low:3};return(po[a.pr]??9)-(po[b.pr]??9)}if(tSort==="due")return(a.due||"z").localeCompare(b.due||"z");return 0});
            return<><Panel noPad title={`All Tasks (${ft.length})`} actions={<div style={{display:"flex",gap:6,alignItems:"center"}}>
              <select value={tFilter} onChange={e=>setTFilter(e.target.value)} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${C.b}`,fontSize:10,fontFamily:F,color:C.t2,background:"#fff",cursor:"pointer"}}>
                {statuses.map(s=><option key={s} value={s}>{s==="all"?"All Status":s==="in-progress"?"In Progress":s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
              <select value={tSort} onChange={e=>setTSort(e.target.value)} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${C.b}`,fontSize:10,fontFamily:F,color:C.t2,background:"#fff",cursor:"pointer"}}>
                <option value="title">Sort: Name</option><option value="status">Sort: Status</option><option value="priority">Sort: Priority</option><option value="due">Sort: Due Date</option>
              </select>
              <Btn sm onClick={()=>setModal({t:"addTask",projectId:_PROJECTS[0]?.id})}>{I.plus} Task</Btn>
            </div>}><Table cols={[
              {label:"Task",render:r=><span style={{fontWeight:500}}>{r.title}</span>},
              {label:"Project / Client",render:r=>{const proj=_PROJECTS.find(p=>p.tasks.some(t=>t.id===r.id));const cl=proj?gc(proj.cl):null;return<div><div style={{fontSize:11,color:C.t2}}>{proj?.name||"—"}</div>{cl&&<div style={{fontSize:10,color:C.t3}}>{cl.name}</div>}</div>}},
              {label:"Status",render:r=><SB s={r.st}/>},{label:"Priority",render:r=><PB p={r.pr}/>},
              {label:"Owner",render:r=>{const m=gm(r.ow);return m?<div style={{display:"flex",alignItems:"center",gap:4}}><Av m={m} sz={18}/><span style={{fontSize:11}}>{m.name.split(" ")[0]}</span></div>:null}},
              {label:"Due",render:r=><span style={{fontFamily:M,fontSize:11,color:r.due&&new Date(r.due)<new Date()&&r.st!=="done"?C.r:C.t2}}>{r.due||"—"}</span>},
              {label:"",render:r=><div style={{display:"flex",gap:4}}><Btn sm v="ghost" onClick={e=>{e.stopPropagation();setModal({t:"editTask",data:{...r,project_id:_PROJECTS.find(p=>p.tasks.some(t=>t.id===r.id))?.id}})}}>Edit</Btn><Btn sm v="ghost" onClick={e=>{e.stopPropagation();setModal({t:"deleteTask",id:r.id,name:r.title})}}>Delete</Btn></div>},
            ]} rows={ft}/></Panel><button onClick={()=>setModal({t:"addTask",projectId:_PROJECTS[0]?.id})} style={{position:"fixed",bottom:28,right:28,width:50,height:50,borderRadius:12,background:C.a,color:"#fff",border:"none",cursor:"pointer",boxShadow:"0 4px 14px rgba(59,130,246,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,zIndex:300,transition:"all .15s"}} onMouseOver={e=>e.currentTarget.style.background=C.aHover} onMouseOut={e=>e.currentTarget.style.background=C.a} title="Add Task">+</button></>;
          })()}

          {/* ═══ ISSUES ═══ */}
          {nav==="issues"&&!detail&&<Panel noPad title={`Issues (${allI.length})`} actions={<Btn sm>{I.plus} Report</Btn>}><Table cols={[
            {label:"Issue",render:r=><span style={{fontWeight:500}}>{r.title}</span>},
            {label:"Type",render:r=><Badge sm color={r.tp==="blocker"?C.r:C.t2} bg={r.tp==="blocker"?C.rBg:C.s2}>{r.tp}</Badge>},
            {label:"Severity",render:r=><Badge sm color={r.sev==="critical"?C.r:r.sev==="high"?C.o:C.y}>{r.sev}</Badge>},
            {label:"Owner",render:r=>{const m=gm(r.ow);return m?<div style={{display:"flex",alignItems:"center",gap:4}}><Av m={m} sz={18}/><span style={{fontSize:11}}>{m.name}</span></div>:null}},
            {label:"Status",render:r=><Badge sm color={r.st==="open"?C.r:C.g}>{r.st}</Badge>},
          ]} rows={allI}/></Panel>}

          {/* ═══ TEAM ═══ */}
          {nav==="team"&&!detail&&<TeamView/>}

          {/* ═══ DELIVERABLES / AUTOMATIONS ═══ */}
          {nav==="deliverables"&&!detail&&<Panel noPad title="Deliverables"><Table cols={[
            {label:"Name",render:r=><span style={{fontWeight:500}}>{r.n}</span>},{label:"Type",render:r=><Badge sm>{r.tp}</Badge>},
            {label:"Status",render:r=><Badge sm>{r.st}</Badge>},{label:"Version",render:r=><span style={{fontFamily:M,fontSize:11}}>{r.v}</span>},
          ]} rows={_PROJECTS.flatMap(p=>p.deliverables)}/></Panel>}
          {nav==="automations"&&!detail&&<Panel noPad title="Automations"><Table cols={[
            {label:"Name",render:r=><span style={{fontWeight:500}}>{r.n}</span>},{label:"Platform",render:r=><Badge sm>{r.pl}</Badge>},
            {label:"Status",render:r=><Badge sm color={r.st==="deployed"?C.g:r.st==="in-dev"?C.a:C.t2}>{r.st}</Badge>},
            {label:"Owner",render:r=>{const m=gm(r.ow);return m?<div style={{display:"flex",alignItems:"center",gap:4}}><Av m={m} sz={18}/><span style={{fontSize:11}}>{m.name}</span></div>:null}},
          ]} rows={_PROJECTS.flatMap(p=>p.autos)}/></Panel>}

          {/* ═══ PLACEHOLDER MODULES ═══ */}
          {["qa","changes","files","knowledge","support","reports","settings"].includes(nav)&&!detail&&<Panel title={NAV.find(n=>n.k===nav)?.l}><div style={{padding:32,textAlign:"center",color:C.t3}}><div style={{fontSize:14,fontWeight:600,color:C.t2,marginBottom:6}}>{NAV.find(n=>n.k===nav)?.l}</div><div style={{fontSize:12}}>Module architected — ready for implementation.</div></div></Panel>}
        </main>
      </div>

      {/* ═══ MODALS ═══ */}
      {modal?.t==="addClient"&&<ClientForm onSave={handleAddClient} onClose={()=>setModal(null)}/>}
      {modal?.t==="editClient"&&<ClientForm data={modal.data} onSave={f=>handleEditClient(modal.data.id,f)} onClose={()=>setModal(null)}/>}
      {modal?.t==="deleteClient"&&<ConfirmDelete what={`Client "${modal.name}"`} onConfirm={()=>handleDeleteClient(modal.id)} onClose={()=>setModal(null)}/>}

      {modal?.t==="addProject"&&<ProjectForm onSave={handleAddProject} onClose={()=>setModal(null)}/>}
      {modal?.t==="editProject"&&<ProjectForm data={modal.data} onSave={f=>handleEditProject(modal.data.id,f)} onClose={()=>setModal(null)}/>}
      {modal?.t==="deleteProject"&&<ConfirmDelete what={`Project "${modal.name}"`} onConfirm={()=>handleDeleteProject(modal.id)} onClose={()=>setModal(null)}/>}

      {modal?.t==="addTask"&&<TaskForm projectId={modal.projectId} onSave={handleAddTask} onClose={()=>setModal(null)}/>}
      {modal?.t==="editTask"&&<TaskForm data={modal.data} onSave={f=>handleEditTask(modal.data.id,f)} onClose={()=>setModal(null)}/>}
      {modal?.t==="deleteTask"&&<ConfirmDelete what={`Task "${modal.name}"`} onConfirm={()=>handleDeleteTask(modal.id)} onClose={()=>setModal(null)}/>}
    </div>
  );
}
