import { useState, useEffect } from “react”;

const SUPABASE_URL = “https://uppzeifoynbgxnewotzm.supabase.co”;
const SUPABASE_KEY = “eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcHplaWZveW5iZ3huZXdvdHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODAyMzIsImV4cCI6MjA5MzI1NjIzMn0.J-qCeuRELfrF2xFOMxqi3SxWXoWF0jhDjBFZ7YcCjJY”;

const headers = {
“Content-Type”: “application/json”,
“apikey”: SUPABASE_KEY,
“Authorization”: `Bearer ${SUPABASE_KEY}`,
“Prefer”: “return=representation”,
};

async function dbGetPosts() {
const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?order=ts.desc`, { headers });
if (!res.ok) throw new Error(await res.text());
return res.json();
}

async function dbInsertPost(post) {
const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
method: “POST”, headers,
body: JSON.stringify(post),
});
if (!res.ok) throw new Error(await res.text());
return res.json();
}

async function dbUpdatePost(id, fields) {
const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
method: “PATCH”, headers,
body: JSON.stringify(fields),
});
if (!res.ok) throw new Error(await res.text());
return res.json();
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const BOOKS = [
{ id:“all”, label:“All Posts”, emoji:“🌙”, color:”#c084fc” },
{ id:“acotar”, label:“ACOTAR”, emoji:“🌹”, color:”#e879f9” },
{ id:“acomaf”, label:“ACOMAF”, emoji:“⭐”, color:”#818cf8” },
{ id:“acowar”, label:“ACOWAR”, emoji:“🦇”, color:”#6366f1” },
{ id:“acofas”, label:“ACOFAS”, emoji:“❄️”, color:”#38bdf8” },
{ id:“acosf”, label:“ACOSF”, emoji:“🔥”, color:”#fb923c” },
{ id:“acosad”, label:“ACOSAD — Book 5”, emoji:“🔮”, color:”#a78bfa” },
{ id:“cc”, label:“Crescent City”, emoji:“🏙️”, color:”#34d399” },
{ id:“crossover”, label:“Maas-verse / CC Crossover”, emoji:“🌌”, color:”#fbbf24” },
{ id:“tog”, label:“Throne of Glass”, emoji:“👑”, color:”#f59e0b” },
];

const FLAIR = [
{ label:“Theory”, bg:”#2e1065”, border:”#7c3aed”, text:”#c4b5fd” },
{ label:“Lore”, bg:”#1e3a5f”, border:”#3b82f6”, text:”#93c5fd” },
{ label:“Hot Take”, bg:”#450a0a”, border:”#dc2626”, text:”#fca5a5” },
{ label:“Discussion”, bg:”#052e16”, border:”#16a34a”, text:”#86efac” },
{ label:“Spoiler ⚠️”, bg:”#1c1917”, border:”#78716c”, text:”#d6d3d1” },
{ label:“Question”, bg:”#1e1b4b”, border:”#4f46e5”, text:”#a5b4fc” },
];

const COURTS = [
“Night Court 🌙”,“Spring Court 🌸”,“Summer Court ☀️”,
“Autumn Court 🍂”,“Winter Court ❄️”,“Dawn Court 🌅”,
“Day Court ✨”,“Heir of Ash 👑”,“Crescent City 🌆”,
];

const SEED_POSTS = [
{
id:“seed1”,
title:“Amren’s blood-drinking is parasitic feeding — and it’s a tell”,
body:“The reading guide flags this: she drinks blood but doesn’t *need* to, which suggests compulsive/parasitic behavior rather than a dietary quirk. The Asteri in Crescent City feed on magic and life in exactly the same way.\n\nIf Amren is the same entity-type as the Asteri, her containment in a Fae body starts to look less like imprisonment and more like infiltration — or strategic dormancy. The passive voice she uses about her own origin seals it for me: ‘I was put here.’ Not ‘I came here.’ Someone put her in that body. Who? And why?”,
category:“acomaf”, flair:“Theory”, author:“Jen”, court:“Night Court 🌙”,
ts:Date.now()-86400000*2, upvotes:7, replies:[],
},
{
id:“seed2”,
title:“The Harp crossing worlds is the biggest unresolved thread in the Maas-verse”,
body:“The same Harp from the Dread Trove (dominion over movement between places and states) shows up in Crescent City at the end of House of Flame and Shadow. This isn’t an easter egg — it’s a load-bearing plot mechanism. The ACOTAR and CC worlds aren’t parallel, they’re *connected*, and the Harp is proof.\n\nElain’s seer abilities — specifically seeing across time, and possibly across worlds — might be exactly how the two timelines get reconciled in Book 5.”,
category:“crossover”, flair:“Theory”, author:“Jen”, court:“Night Court 🌙”,
ts:Date.now()-86400000*3, upvotes:5, replies:[],
},
{
id:“seed3”,
title:“Nesta’s expression after the Cauldron transformation — not traumatized, furious”,
body:“Everyone reads Nesta’s transformation as traumatic, and it is. But the guide points out something crucial: her *immediate* reaction is fury, not shock. She perceived what the Cauldron did as a theft — and she stole back.\n\nShe didn’t just survive the transformation, she *took* the Cauldron’s death-aspect. She’s carrying a fragment of the Cauldron’s soul. That’s not a trauma response, that’s a power grab from someone who understood exactly what was happening to her.”,
category:“acowar”, flair:“Lore”, author:“Jen”, court:“Night Court 🌙”,
ts:Date.now()-86400000*4, upvotes:9, replies:[],
},
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const inputSt = {
width:“100%”, background:”#0a0718”, border:“1px solid #2d1b69”,
borderRadius:8, color:”#e2d9f3”, padding:“9px 13px”, fontSize:13,
fontFamily:”‘Crimson Text’,Georgia,serif”, outline:“none”,
boxSizing:“border-box”, transition:“border-color 0.2s”,
};
const primaryBtn = {
background:“linear-gradient(135deg,#4c1d95,#6d28d9)”, color:”#f3e8ff”,
border:“none”, borderRadius:8, padding:“10px 22px”,
fontFamily:”‘Cinzel’,serif”, fontSize:13, letterSpacing:“0.05em”,
cursor:“pointer”, transition:“opacity 0.2s”,
};
const ghostBtn = {
background:“none”, border:“1px solid #2d1b6966”, borderRadius:6,
color:”#7c6aaa”, cursor:“pointer”, fontFamily:”‘Crimson Text’,serif”,
fontSize:12, padding:“4px 10px”, transition:“all 0.15s”,
};
const labelSt = {
display:“block”, fontSize:11, color:”#6b4fa0”,
fontFamily:”‘Cinzel’,serif”, letterSpacing:“0.08em”, marginBottom:6,
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function Stars() {
const stars = Array.from({length:80},(_,i)=>({
id:i, x:Math.random()*100, y:Math.random()*100,
size:Math.random()*1.6+0.4, delay:Math.random()*5, dur:Math.random()*3+2,
}));
return (
<div style={{position:“fixed”,inset:0,pointerEvents:“none”,zIndex:0,overflow:“hidden”}}>
{stars.map(s=>(
<div key={s.id} style={{
position:“absolute”,left:`${s.x}%`,top:`${s.y}%`,
width:s.size,height:s.size,borderRadius:“50%”,background:“white”,opacity:0,
animation:`twinkle ${s.dur}s ${s.delay}s infinite ease-in-out`,
}}/>
))}
</div>
);
}

function FlairBadge({label}) {
const f = FLAIR.find(x=>x.label===label)||FLAIR[0];
return <span style={{display:“inline-block”,padding:“2px 9px”,borderRadius:4,fontSize:11,fontFamily:”‘Cinzel’,serif”,letterSpacing:“0.06em”,background:f.bg,border:`1px solid ${f.border}`,color:f.text}}>{label}</span>;
}

function BookBadge({id}) {
const b = BOOKS.find(x=>x.id===id);
if(!b||b.id===“all”) return null;
return <span style={{display:“inline-block”,padding:“2px 9px”,borderRadius:4,fontSize:11,fontFamily:”‘Cinzel’,serif”,letterSpacing:“0.06em”,background:”#0f0a1e”,border:`1px solid ${b.color}44`,color:b.color}}>{b.emoji} {b.label}</span>;
}

function TimeAgo({ts}) {
const d=Date.now()-ts, m=Math.floor(d/60000), h=Math.floor(d/3600000), day=Math.floor(d/86400000);
if(m<1) return <span>just now</span>;
if(m<60) return <span>{m}m ago</span>;
if(h<24) return <span>{h}h ago</span>;
return <span>{day}d ago</span>;
}

function ReplyForm({form,setForm,onSubmit,onCancel}) {
return (
<div style={{marginTop:12,padding:14,background:”#06040f”,border:“1px solid #1e1040”,borderRadius:10}}>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:10,marginBottom:10}}>
<input style={inputSt} placeholder=“Your name” value={form.author} onChange={e=>setForm({…form,author:e.target.value})}/>
<select style={inputSt} value={form.court} onChange={e=>setForm({…form,court:e.target.value})}>
{COURTS.map(c=><option key={c}>{c}</option>)}
</select>
</div>
<textarea style={{…inputSt,minHeight:80,resize:“vertical”,lineHeight:1.7,marginBottom:10}}
placeholder=“Add to the theory…” value={form.body} onChange={e=>setForm({…form,body:e.target.value})}/>
<div style={{display:“flex”,gap:8,justifyContent:“flex-end”}}>
<button onClick={onCancel} style={{…ghostBtn,padding:“6px 14px”}}>Cancel</button>
<button onClick={onSubmit} disabled={!form.body.trim()||!form.author.trim()}
style={{…primaryBtn,padding:“7px 18px”,fontSize:12,opacity:(!form.body.trim()||!form.author.trim())?0.4:1}}>
Post Reply ✦
</button>
</div>
</div>
);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
const [posts,setPosts] = useState([]);
const [view,setView] = useState(“feed”);
const [activePost,setActivePost] = useState(null);
const [filterBook,setFilterBook] = useState(“all”);
const [loading,setLoading] = useState(true);
const [saving,setSaving] = useState(false);
const [notice,setNotice] = useState(””);
const [error,setError] = useState(””);
const [replyingTo,setReplyingTo] = useState(null);
const [newForm,setNewForm] = useState({title:””,body:””,category:“acotar”,flair:“Theory”,author:””,court:“Night Court 🌙”});
const [replyForm,setReplyForm] = useState({body:””,author:””,court:“Night Court 🌙”});

useEffect(()=>{ loadPosts(); },[]);

async function loadPosts() {
setLoading(true); setError(””);
try {
let data = await dbGetPosts();
if(data.length===0) {
// seed initial posts
for(const p of SEED_POSTS) { await dbInsertPost(p); }
data = await dbGetPosts();
}
setPosts(data);
} catch(e) {
setError(“Could not connect to the Archives. Please try again.”);
console.error(e);
}
setLoading(false);
}

function flash(msg){ setNotice(msg); setTimeout(()=>setNotice(””),2500); }

async function submitPost() {
if(!newForm.title.trim()||!newForm.body.trim()||!newForm.author.trim()) return;
setSaving(true);
try {
const p = {id:Date.now().toString(),…newForm,ts:Date.now(),upvotes:0,replies:[]};
await dbInsertPost(p);
const fresh = await dbGetPosts();
setPosts(fresh);
setNewForm({title:””,body:””,category:“acotar”,flair:“Theory”,author:””,court:“Night Court 🌙”});
setView(“feed”); flash(“Theory posted to the Archives ✦”);
} catch(e){ setError(“Failed to post. Please try again.”); console.error(e); }
setSaving(false);
}

async function upvotePost(id) {
const post = posts.find(p=>p.id===id);
if(!post) return;
const newCount = (post.upvotes||0)+1;
setPosts(prev=>prev.map(p=>p.id===id?{…p,upvotes:newCount}:p));
if(activePost?.id===id) setActivePost(prev=>({…prev,upvotes:newCount}));
try { await dbUpdatePost(id,{upvotes:newCount}); }
catch(e){ console.error(e); }
}

async function submitReply(postId) {
if(!replyForm.body.trim()||!replyForm.author.trim()) return;
setSaving(true);
try {
const post = posts.find(p=>p.id===postId);
const r = {id:Date.now().toString(),…replyForm,ts:Date.now(),upvotes:0};
const updatedReplies = […(post.replies||[]), r];
await dbUpdatePost(postId,{replies:updatedReplies});
const fresh = await dbGetPosts();
setPosts(fresh);
setActivePost(fresh.find(p=>p.id===postId));
setReplyForm({body:””,author:””,court:“Night Court 🌙”});
setReplyingTo(null); flash(“Reply added ✦”);
} catch(e){ setError(“Failed to post reply.”); console.error(e); }
setSaving(false);
}

async function upvoteReply(postId,replyId) {
const post = posts.find(p=>p.id===postId);
const updatedReplies = post.replies.map(r=>r.id===replyId?{…r,upvotes:(r.upvotes||0)+1}:r);
setPosts(prev=>prev.map(p=>p.id!==postId?p:{…p,replies:updatedReplies}));
setActivePost(prev=>({…prev,replies:updatedReplies}));
try { await dbUpdatePost(postId,{replies:updatedReplies}); }
catch(e){ console.error(e); }
}

const filtered = filterBook===“all” ? posts : posts.filter(p=>p.category===filterBook);

return (
<div style={{minHeight:“100vh”,background:“radial-gradient(ellipse at 15% 10%,#1a0533 0%,#060412 55%,#08011a 100%)”,color:”#e2d9f3”,fontFamily:”‘Crimson Text’,Georgia,serif”,position:“relative”}}>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet"/>
<style>{`@keyframes twinkle{0%,100%{opacity:0;transform:scale(0.7)}50%{opacity:0.6;transform:scale(1.3)}} @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}} @keyframes glow{0%,100%{box-shadow:0 0 8px #7c3aed33}50%{box-shadow:0 0 22px #7c3aed88}} *{box-sizing:border-box} ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#06040f}::-webkit-scrollbar-thumb{background:#2d1b69;border-radius:3px} button:hover{opacity:0.82} input:focus,textarea:focus,select:focus{border-color:#6d28d9!important} .pcard{transition:border-color 0.2s,transform 0.15s,background 0.15s} .pcard:hover{border-color:#3d2080!important;transform:translateY(-2px)} .tab{transition:all 0.15s}`}</style>
<Stars/>

```
{/* HEADER */}
<header style={{position:"sticky",top:0,zIndex:100,borderBottom:"1px solid #1e104088",background:"linear-gradient(180deg,#0f062299,#06041299)",backdropFilter:"blur(18px)"}}>
<div style={{maxWidth:900,margin:"0 auto",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
<div style={{cursor:"pointer"}} onClick={()=>{setView("feed");setActivePost(null);}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<span style={{fontSize:20}}>🌙</span>
<h1 style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(15px,3.2vw,21px)",fontWeight:700,margin:0,background:"linear-gradient(135deg,#c084fc,#818cf8,#e879f9)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 5s linear infinite"}}>
The Night Court Archives
</h1>
</div>
<p style={{margin:"2px 0 0 30px",fontSize:11,color:"#5a3f8a",fontStyle:"italic",letterSpacing:"0.08em"}}>A sanctuary for theorycrafters &amp; lore seekers</p>
</div>
<div style={{display:"flex",alignItems:"center",gap:10}}>
{saving&&<span style={{fontSize:11,color:"#6d28d9",fontStyle:"italic"}}>saving…</span>}
{notice&&<span style={{fontSize:12,color:"#a78bfa",fontStyle:"italic",animation:"fadeIn 0.3s ease"}}>{notice}</span>}
<button onClick={()=>{setView("new");window.scrollTo(0,0);}} style={{...primaryBtn,animation:"glow 3s infinite",display:"flex",alignItems:"center",gap:6}}>✦ New Theory</button>
</div>
</div>
</header>

<div style={{maxWidth:900,margin:"0 auto",padding:"26px 16px 70px",position:"relative",zIndex:5}}>

{error&&(
<div style={{background:"#450a0a",border:"1px solid #dc2626",borderRadius:10,padding:"12px 16px",marginBottom:20,color:"#fca5a5",fontSize:13}}>
⚠️ {error} <button onClick={()=>{setError("");loadPosts();}} style={{...ghostBtn,marginLeft:10,color:"#fca5a5",borderColor:"#dc262666"}}>Retry</button>
</div>
)}

{/* NEW POST */}
{view==="new"&&(
<div style={{animation:"fadeIn 0.35s ease"}}>
<button onClick={()=>setView("feed")} style={{...ghostBtn,marginBottom:20,fontSize:13}}>← Back to Archives</button>
<div style={{background:"linear-gradient(145deg,#0f0a1e,#140d2a)",border:"1px solid #2d1b69",borderRadius:16,padding:"26px"}}>
<h2 style={{fontFamily:"'Cinzel',serif",color:"#c084fc",margin:"0 0 20px",fontSize:18}}>✦ Propose a Theory</h2>
<div style={{display:"grid",gap:14}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
<div><label style={labelSt}>YOUR NAME</label>
<input style={inputSt} placeholder="e.g. Feyre Archeron" value={newForm.author} onChange={e=>setNewForm({...newForm,author:e.target.value})}/></div>
<div><label style={labelSt}>YOUR COURT</label>
<select style={inputSt} value={newForm.court} onChange={e=>setNewForm({...newForm,court:e.target.value})}>
{COURTS.map(c=><option key={c}>{c}</option>)}</select></div>
</div>
<div><label style={labelSt}>TITLE</label>
<input style={inputSt} placeholder="State your theory boldly…" value={newForm.title} onChange={e=>setNewForm({...newForm,title:e.target.value})}/></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
<div><label style={labelSt}>BOOK / SERIES</label>
<select style={inputSt} value={newForm.category} onChange={e=>setNewForm({...newForm,category:e.target.value})}>
{BOOKS.filter(b=>b.id!=="all").map(b=><option key={b.id} value={b.id}>{b.emoji} {b.label}</option>)}</select></div>
<div><label style={labelSt}>FLAIR</label>
<select style={inputSt} value={newForm.flair} onChange={e=>setNewForm({...newForm,flair:e.target.value})}>
{FLAIR.map(f=><option key={f.label}>{f.label}</option>)}</select></div>
</div>
<div><label style={labelSt}>YOUR THEORY</label>
<textarea style={{...inputSt,minHeight:180,resize:"vertical",lineHeight:1.8}}
placeholder="Lay out your evidence… The Cauldron sees all."
value={newForm.body} onChange={e=>setNewForm({...newForm,body:e.target.value})}/></div>
<div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
<button onClick={()=>setView("feed")} style={{...ghostBtn,padding:"9px 18px",fontSize:13}}>Cancel</button>
<button onClick={submitPost} disabled={saving||!newForm.title.trim()||!newForm.body.trim()||!newForm.author.trim()}
style={{...primaryBtn,opacity:(saving||!newForm.title.trim()||!newForm.body.trim()||!newForm.author.trim())?0.4:1}}>
{saving?"Posting…":"Post to the Archives ✦"}</button>
</div>
</div>
</div>
</div>
)}

{/* SINGLE POST */}
{view==="post"&&activePost&&(
<div style={{animation:"fadeIn 0.35s ease"}}>
<button onClick={()=>{setView("feed");setActivePost(null);setReplyingTo(null);}} style={{...ghostBtn,marginBottom:20,fontSize:13}}>← Back to Archives</button>
<div style={{background:"linear-gradient(145deg,#0f0a1e,#140d2a)",border:"1px solid #2d1b69",borderRadius:16,padding:"26px"}}>
<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
<FlairBadge label={activePost.flair}/><BookBadge id={activePost.category}/>
</div>
<h2 style={{fontFamily:"'Cinzel',serif",color:"#e2d9f3",margin:"0 0 14px",fontSize:"clamp(15px,2.8vw,20px)",lineHeight:1.45}}>{activePost.title}</h2>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18,flexWrap:"wrap"}}>
<span style={{fontSize:13,color:"#9b7fcb",fontFamily:"'Cinzel',serif"}}>{activePost.author}</span>
<span style={{color:"#2d1b69"}}>·</span>
<span style={{fontSize:12,color:"#5a3f8a"}}>{activePost.court}</span>
<span style={{color:"#2d1b69"}}>·</span>
<span style={{fontSize:12,color:"#5a3f8a"}}><TimeAgo ts={activePost.ts}/></span>
</div>
<p style={{fontSize:15,color:"#c9b8e8",lineHeight:1.85,whiteSpace:"pre-wrap",margin:"0 0 20px"}}>{activePost.body}</p>
<div style={{display:"flex",gap:12,paddingTop:16,borderTop:"1px solid #1e1040"}}>
<button onClick={()=>upvotePost(activePost.id)} style={ghostBtn}>✦ {activePost.upvotes||0} upvotes</button>
<button onClick={()=>setReplyingTo(replyingTo==="top"?null:"top")} style={ghostBtn}>↩ Reply</button>
</div>
{replyingTo==="top"&&<ReplyForm form={replyForm} setForm={setReplyForm} onSubmit={()=>submitReply(activePost.id)} onCancel={()=>setReplyingTo(null)}/>}
</div>

{/* replies */}
<div style={{marginTop:22}}>
{activePost.replies?.length>0&&(
<>
<h3 style={{fontFamily:"'Cinzel',serif",color:"#5a3f8a",fontSize:12,letterSpacing:"0.1em",margin:"0 0 14px"}}>
{activePost.replies.length} {activePost.replies.length===1?"REPLY":"REPLIES"}
</h3>
<div style={{display:"flex",flexDirection:"column",gap:10}}>
{activePost.replies.map(r=>(
<div key={r.id} style={{background:"#0a0718",border:"1px solid #1e1040",borderRadius:10,padding:"14px 16px",animation:"fadeIn 0.3s ease"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
<span style={{fontSize:12,color:"#7c3aed",fontFamily:"'Cinzel',serif",fontWeight:600}}>{r.author}</span>
<span style={{fontSize:11,color:"#4a3570"}}>· {r.court} ·</span>
<span style={{fontSize:11,color:"#4a3570"}}><TimeAgo ts={r.ts}/></span>
</div>
<p style={{margin:"0 0 10px",fontSize:14,color:"#c9b8e8",lineHeight:1.75,whiteSpace:"pre-wrap"}}>{r.body}</p>
<div style={{display:"flex",gap:10}}>
<button onClick={()=>upvoteReply(activePost.id,r.id)} style={ghostBtn}>✦ {r.upvotes||0}</button>
<button onClick={()=>setReplyingTo(replyingTo===r.id?null:r.id)} style={ghostBtn}>↩ Reply</button>
</div>
{replyingTo===r.id&&<ReplyForm form={replyForm} setForm={setReplyForm} onSubmit={()=>submitReply(activePost.id)} onCancel={()=>setReplyingTo(null)}/>}
</div>
))}
</div>
</>
)}
{(!activePost.replies||activePost.replies.length===0)&&replyingTo!=="top"&&(
<div style={{textAlign:"center",padding:"28px",border:"1px dashed #1e1040",borderRadius:12}}>
<p style={{color:"#4a3570",fontStyle:"italic",fontSize:13,margin:"0 0 12px"}}>No replies yet. Be the first to respond.</p>
<button onClick={()=>setReplyingTo("top")} style={{...primaryBtn,fontSize:12,padding:"8px 18px"}}>↩ Add a Reply</button>
</div>
)}
</div>
</div>
)}

{/* FEED */}
{view==="feed"&&(
<div style={{animation:"fadeIn 0.3s ease"}}>
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:26,padding:"12px 14px",background:"#06040fcc",border:"1px solid #1e1040",borderRadius:12,backdropFilter:"blur(8px)"}}>
{BOOKS.map(b=>(
<button key={b.id} className="tab" onClick={()=>setFilterBook(b.id)} style={{
padding:"5px 11px",borderRadius:6,fontSize:11,cursor:"pointer",
fontFamily:"'Cinzel',serif",letterSpacing:"0.04em",
border:filterBook===b.id?`1px solid ${b.color}`:"1px solid #1e1040",
background:filterBook===b.id?`${b.color}1a`:"transparent",
color:filterBook===b.id?b.color:"#4a3570",
}}>{b.emoji} {b.id==="all"?"All":b.label}</button>
))}
</div>

{loading?(
<div style={{textAlign:"center",padding:"70px 0",color:"#4a3570",fontStyle:"italic"}}>
<div style={{fontSize:28,marginBottom:12}}>🌙</div>
Consulting the Cauldron…
</div>
):filtered.length===0?(
<div style={{textAlign:"center",padding:"60px",border:"1px dashed #1e1040",borderRadius:12,color:"#4a3570"}}>
<div style={{fontSize:32,marginBottom:12}}>🌙</div>
<p style={{fontFamily:"'Cinzel',serif",fontSize:14,margin:"0 0 6px"}}>No theories for this book yet.</p>
<p style={{fontSize:13,fontStyle:"italic",margin:"0 0 16px"}}>Be the first to propose one.</p>
<button onClick={()=>setView("new")} style={{...primaryBtn,fontSize:12,padding:"8px 18px"}}>Post a Theory ✦</button>
</div>
):(
<div style={{display:"flex",flexDirection:"column",gap:11}}>
{filtered.map(p=>(
<div key={p.id} className="pcard" onClick={()=>{setActivePost(p);setView("post");setReplyingTo(null);window.scrollTo(0,0);}}
style={{background:"linear-gradient(145deg,#0d091c,#100c20)",border:"1px solid #1e1040",borderRadius:14,padding:"20px 22px",cursor:"pointer"}}>
<div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
<FlairBadge label={p.flair}/><BookBadge id={p.category}/>
</div>
<h3 style={{fontFamily:"'Cinzel',serif",color:"#ddd0f5",margin:"0 0 9px",fontSize:"clamp(13px,2.4vw,16px)",lineHeight:1.45,fontWeight:600}}>{p.title}</h3>
<p style={{margin:"0 0 14px",fontSize:13.5,color:"#6a5a8a",lineHeight:1.6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.body}</p>
<div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
<span style={{fontSize:12,color:"#7c3aed",fontFamily:"'Cinzel',serif"}}>{p.author}</span>
<span style={{color:"#2d1b69",fontSize:10}}>·</span>
<span style={{fontSize:11,color:"#4a3570"}}>{p.court}</span>
<span style={{color:"#2d1b69",fontSize:10}}>·</span>
<span style={{fontSize:11,color:"#4a3570"}}><TimeAgo ts={p.ts}/></span>
<div style={{marginLeft:"auto",display:"flex",gap:12}}>
<span style={{fontSize:12,color:"#4a3570"}}>✦ {p.upvotes||0}</span>
<span style={{fontSize:12,color:"#4a3570"}}>↩ {p.replies?.length||0}</span>
</div>
</div>
</div>
))}
</div>
)}
</div>
)}
</div>
</div>
```

);
}
