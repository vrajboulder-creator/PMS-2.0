import { F, M, C, SC, shadow } from "../../shared/theme";
import { I } from "../../shared/icons";
import { gm } from "../../shared/store";

export const Av=({m,sz=24})=>{const bg=m.c||m.color||"#888";const av=m.av||m.avatar||"??";return<div title={m.name} style={{width:sz,height:sz,borderRadius:6,background:bg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*.38,fontWeight:600,fontFamily:M,flexShrink:0}}>{av}</div>};

export const AvStack=({ids,sz=22})=><div style={{display:"flex"}}>{ids.slice(0,4).map((id,i)=>{const m=gm(id);return m?<div key={id} style={{marginLeft:i?-6:0,zIndex:10-i,border:"2px solid #fff",borderRadius:6}}><Av m={m} sz={sz}/></div>:null})}{ids.length>4&&<div style={{marginLeft:-6,width:sz,height:sz,borderRadius:6,background:C.s3,color:C.t3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:600,border:"2px solid #fff"}}>+{ids.length-4}</div>}</div>;

export const Badge=({children,color=C.t2,bg=C.s2,bd=C.b2,sm})=><span style={{display:"inline-flex",alignItems:"center",gap:4,padding:sm?"1px 7px":"2px 9px",borderRadius:5,background:bg,border:`1px solid ${bd}`,color,fontSize:sm?10:11,fontWeight:600,fontFamily:F,letterSpacing:"0.01em",whiteSpace:"nowrap",lineHeight:"18px"}}>{children}</span>;

export const HB=({h})=>{const m={healthy:{l:"Healthy",c:C.g,bg:C.gBg,bd:C.gBd},"at-risk":{l:"At Risk",c:C.y,bg:C.yBg,bd:C.yBd},critical:{l:"Critical",c:C.r,bg:C.rBg,bd:C.rBd}}[h];return m?<Badge color={m.c} bg={m.bg} bd={m.bd} sm><span style={{width:6,height:6,borderRadius:"50%",background:m.c,display:"inline-block"}}/>{m.l}</Badge>:null};

export const SB=({s})=>{const m={backlog:{l:"Backlog",c:C.t3},todo:{l:"To Do",c:C.t2},"in-progress":{l:"In Progress",c:C.a},review:{l:"Review",c:C.p},done:{l:"Done",c:C.g},blocked:{l:"Blocked",c:C.r}}[s];return m?<Badge color={m.c} bg={`${m.c}10`} bd={`${m.c}25`} sm>{m.l}</Badge>:null};

export const PB=({p})=>{const m={urgent:{l:"Urgent",c:C.r,i:"⬆⬆"},high:{l:"High",c:C.o,i:"⬆"},medium:{l:"Medium",c:C.y,i:"─"},low:{l:"Low",c:C.t3,i:"⬇"}}[p];return m?<span title={m.l} style={{fontSize:11,color:m.c,fontWeight:700}}>{m.i}</span>:null};

export const StB=({stage})=>{const c=SC[stage]||C.t3;return<Badge color={c} bg={`${c}10`} bd={`${c}22`} sm>{stage}</Badge>};

export const FI=({t})=>{const c={pdf:C.r,csv:C.g,json:C.y,xlsx:C.g,md:C.a,yaml:C.p,loom:C.p}[t]||C.t3;return<span style={{fontSize:9,fontWeight:700,fontFamily:M,color:c,textTransform:"uppercase",letterSpacing:"0.05em"}}>{t}</span>};

export const Btn=({children,v="default",onClick,sm,style:st2})=>{const s={primary:{background:C.a,color:"#fff",border:"none"},danger:{background:C.r,color:"#fff",border:"none"},default:{background:"#fff",color:C.t,border:`1px solid ${C.b}`},ghost:{background:"transparent",color:C.t2,border:"1px solid transparent"}}[v]||{};return<button onClick={onClick} style={{...s,padding:sm?"4px 10px":"6px 14px",borderRadius:6,fontSize:sm?11:12,fontWeight:600,fontFamily:F,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4,transition:"all .12s",...st2}} onMouseOver={e=>{if(v==="primary")e.currentTarget.style.background=C.aHover;else if(v==="danger")e.currentTarget.style.background="#b91c1c";else e.currentTarget.style.background=C.s2}} onMouseOut={e=>{if(v==="primary")e.currentTarget.style.background=C.a;else if(v==="danger")e.currentTarget.style.background=C.r;else e.currentTarget.style.background=v==="ghost"?"transparent":"#fff"}}>{children}</button>};

export const Modal=({title,children,onClose,width=480})=><div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}><div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.35)"}}/><div style={{position:"relative",background:"#fff",borderRadius:12,boxShadow:"0 20px 60px rgba(0,0,0,0.15)",width,maxWidth:"90vw",maxHeight:"85vh",overflow:"auto",padding:"20px 24px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:15,fontWeight:700,letterSpacing:"-0.02em"}}>{title}</span><button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,padding:2}}>{I.x}</button></div>{children}</div></div>;

export const FLabel=({children})=><label style={{fontSize:11,fontWeight:600,color:C.t2,display:"block",marginBottom:4,letterSpacing:"0.01em"}}>{children}</label>;

export const FInput=({label,...props})=><div style={{marginBottom:12}}><FLabel>{label}</FLabel><input {...props} style={{width:"100%",padding:"8px 12px",borderRadius:7,border:`1px solid ${C.b}`,fontSize:12,fontFamily:F,color:C.t,outline:"none",boxSizing:"border-box",...(props.style||{})}} onFocus={e=>e.target.style.borderColor=C.bFocus} onBlur={e=>e.target.style.borderColor=C.b}/></div>;

export const FSelect=({label,options,value,onChange,...props})=><div style={{marginBottom:12}}><FLabel>{label}</FLabel><select value={value} onChange={onChange} {...props} style={{width:"100%",padding:"8px 12px",borderRadius:7,border:`1px solid ${C.b}`,fontSize:12,fontFamily:F,color:C.t,outline:"none",background:"#fff",boxSizing:"border-box"}}>{options.map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}</select></div>;

export const FRow=({children})=><div style={{display:"grid",gridTemplateColumns:`repeat(${Array.isArray(children)?children.length:1},1fr)`,gap:12}}>{children}</div>;

export const ConfirmDelete=({what,onConfirm,onClose})=><Modal title={`Delete ${what}?`} width={380}><p style={{fontSize:12,color:C.t2,marginBottom:16}}>This will permanently delete this {what.toLowerCase()}. This action cannot be undone.</p><div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn onClick={onClose}>Cancel</Btn><Btn v="danger" onClick={onConfirm}>Delete</Btn></div></Modal>;

export const Panel=({children,title,actions,noPad,style:st2})=><div style={{background:"#fff",border:`1px solid ${C.b}`,borderRadius:10,boxShadow:shadow,overflow:"hidden",...st2}}>{title&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 16px",borderBottom:`1px solid ${C.b2}`}}><span style={{fontSize:12.5,fontWeight:650,color:C.t,letterSpacing:"-0.01em"}}>{title}</span>{actions}</div>}<div style={noPad?{}:{padding:16}}>{children}</div></div>;

export const Stat=({label,value,sub,accent,alert:al})=><div style={{background:"#fff",border:`1px solid ${al?C.rBd:C.b}`,borderRadius:10,padding:"14px 16px",boxShadow:shadow}}><div style={{fontSize:11,color:C.t2,fontWeight:500,marginBottom:5,letterSpacing:"0.01em"}}>{label}</div><div style={{fontSize:24,fontWeight:700,color:accent||C.t,letterSpacing:"-0.03em",lineHeight:1}}>{value}</div>{sub&&<div style={{fontSize:10,color:C.t3,marginTop:5}}>{sub}</div>}</div>;

const TRow=({cols,row,onClick})=><tr onClick={onClick} style={{cursor:onClick?"pointer":"default",borderBottom:`1px solid ${C.b2}`}} onMouseOver={e=>{if(onClick)e.currentTarget.style.background=C.s2}} onMouseOut={e=>e.currentTarget.style.background="transparent"}>{cols.map((c,i)=><td key={i} style={{padding:"9px 14px",fontSize:12,color:C.t,verticalAlign:"middle"}}>{c.render?c.render(row):row[c.key]}</td>)}</tr>;

export const Table=({cols,rows,onRow})=><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:F}}><thead><tr>{cols.map((c,i)=><th key={i} style={{textAlign:"left",padding:"9px 14px",borderBottom:`1px solid ${C.b}`,color:C.t3,fontWeight:600,fontSize:10,letterSpacing:"0.04em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{c.label}</th>)}</tr></thead><tbody>{rows.map((r,i)=><TRow key={i} cols={cols} row={r} onClick={onRow?()=>onRow(r):undefined}/>)}</tbody></table></div>;
