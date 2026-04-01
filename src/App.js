import { useState, useEffect } from "react";

// ── Supabase ──────────────────────────────────────────────────
const SB = "https://qimgostiseehdnvhmoph.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";

function ah(token) {
  return { "apikey": KEY, "Authorization": `Bearer ${token||KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" };
}
async function api(method, path, token, body) {
  const r = await fetch(`${SB}${path}`, { method, headers: ah(token), body: body ? JSON.stringify(body) : undefined });
  return r.json();
}
const DB = {
  signUp: (email, pw, meta) => api("POST", "/auth/v1/signup", null, { email, password: pw, data: meta }),
  signIn: (email, pw) => api("POST", "/auth/v1/token?grant_type=password", null, { email, password: pw }),
  signOut: (t) => fetch(`${SB}/auth/v1/logout`, { method: "POST", headers: ah(t) }),
  updateUser: (t, meta) => api("PUT", "/auth/v1/user", t, { data: meta }),
  list: (t, table) => api("GET", `/rest/v1/${table}?order=created_at.asc`, t),
  insert: (t, table, data) => api("POST", `/rest/v1/${table}`, t, data),
  update: (t, table, id, data) => api("PATCH", `/rest/v1/${table}?id=eq.${id}`, t, data),
  delete: (t, table, id) => fetch(`${SB}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers: ah(t) }),
};

// ── EmailJS ───────────────────────────────────────────────────
const EJS = { SID: "service_raca1ke", TID: "template_hoej0ts", PK: "KlYRj7B6JNO01D2pm" };
async function sendEmail(toEmail, toName, subject, message) {
  if (!toEmail) return false;
  try {
    const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: EJS.SID, template_id: EJS.TID, user_id: EJS.PK,
        template_params: { to_email: toEmail, to_name: toName, subject, message, from_name: "D-Works" } })
    });
    return r.status === 200;
  } catch { return false; }
}

// ── 상수 ──────────────────────────────────────────────────────
const C = {
  bg: "#F8F9FB", card: "#FFFFFF", bdr: "#E8ECF2",
  acc: "#3772FF", txt: "#111827", sub: "#9CA3AF", sub2: "#6B7280",
  ok: "#10B981", warn: "#F59E0B", red: "#EF4444",
  fn: "'Noto Sans KR','Apple SD Gothic Neo',sans-serif",
};
const uid = () => Math.random().toString(36).slice(2,9);
const today = () => new Date().toISOString().slice(0,10);
const fmtN = n => (n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const CATS = ["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const CAT_C = { 이너:"#3772FF",아우터:"#8B5CF6",팬츠:"#10B981",니트:"#F59E0B",원피스:"#EC4899",스커트:"#06B6D4",기타:"#9CA3AF" };
const VEN_TYPES = ["원단","안감","단추","지퍼","심지","기타"];
const VEN_IC = { 원단:"🧶",안감:"📋",단추:"🔘",지퍼:"🤐",심지:"🪡",기타:"🏭" };
const VEN_C = { 원단:"#3772FF",안감:"#10B981",단추:"#F59E0B",지퍼:"#8B5CF6",심지:"#06B6D4",기타:"#9CA3AF" };
const SEASONS = ["26SS","26FW","25SS","25FW"];
const BIZ_TYPES = ["다이마루","직기","니트","데님","기타"];
const MAT_TYPES = ["메인원단","부속원단","단추","지퍼","안감","심지","기타"];

// ── 공통 UI ───────────────────────────────────────────────────
const Btn = ({ch,onClick,v="p",full,disabled,sz="m",st={}}) => {
  const bg = {p:C.acc,w:"#fff",ok:C.ok,d:C.bg}[v]||C.acc;
  const cl = {p:"#fff",w:C.txt,ok:"#fff",d:C.sub}[v]||"#fff";
  const bd = v==="w"?`1.5px solid ${C.bdr}`:"none";
  const pd = {s:"7px 14px",m:"12px 0",l:"15px 0"}[sz];
  return <button onClick={onClick} disabled={disabled} style={{
    background:disabled?"#EDF0F5":bg, color:disabled?"#B0B8C4":cl,
    border:disabled?`1.5px solid ${C.bdr}`:bd, borderRadius:10,
    padding:pd, fontSize:sz==="s"?12:14, fontWeight:700,
    cursor:disabled?"default":"pointer", fontFamily:C.fn,
    display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,
    width:full?"100%":"auto",boxSizing:"border-box",lineHeight:1.4,...st
  }}>{ch}</button>;
};

// 와이어프레임 카드 + 행
function FCard({children,mb=12}) {
  return <div style={{background:"#fff",borderRadius:14,border:`1px solid ${C.bdr}`,overflow:"hidden",marginBottom:mb,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>{children}</div>;
}
function FRow({label,children,last,req}) {
  return (
    <div style={{display:"flex",alignItems:"center",minHeight:50,padding:"0 14px",borderBottom:last?"none":`1px solid ${C.bdr}`}}>
      <div style={{width:80,fontSize:13,fontWeight:600,color:C.txt,flexShrink:0}}>
        {label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",minWidth:0}}>{children}</div>
    </div>
  );
}
const FInp = ({val,onChange,ph,type="text",onKeyDown,right}) => (
  <input value={val||""} onChange={e=>onChange&&onChange(e.target.value)}
    placeholder={ph} type={type} onKeyDown={onKeyDown}
    style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:C.txt,fontFamily:C.fn,padding:"0",minWidth:0,textAlign:"right"}}/>
);
const FSel = ({val,onChange,children,ph}) => (
  <select value={val||""} onChange={e=>onChange(e.target.value)}
    style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:val?C.txt:C.sub,fontFamily:C.fn,textAlign:"right",WebkitAppearance:"none",cursor:"pointer"}}>
    {ph&&<option value="">{ph}</option>}
    {children}
  </select>
);
const Tag = ({ch,c=C.acc}) => <span style={{background:c+"18",color:c,padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{ch}</span>;
const Card = ({children,st={},onClick}) => <div onClick={onClick} style={{background:"#fff",borderRadius:12,border:`1px solid ${C.bdr}`,padding:16,boxSizing:"border-box",...st}}>{children}</div>;
const Divider = () => <div style={{height:1,background:C.bdr,margin:"12px 0"}}/>;
const G = ({h=12}) => <div style={{height:h}}/>;
const Empty = ({icon,text,sub}) => (
  <div style={{textAlign:"center",padding:"40px 20px",color:C.sub}}>
    <div style={{fontSize:36,marginBottom:10}}>{icon}</div>
    <div style={{fontSize:14,fontWeight:600,color:C.sub2,marginBottom:4}}>{text}</div>
    {sub&&<div style={{fontSize:12}}>{sub}</div>}
  </div>
);

// Field (라벨 위)
function Field({label,children,req}) {
  return (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:600,color:C.txt,marginBottom:8}}>
        {label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}
      </div>
      {children}
    </div>
  );
}
function TxtInp({val,onChange,ph,type="text",onKeyDown,right}) {
  return (
    <div style={{display:"flex",alignItems:"center",border:`1px solid ${C.bdr}`,borderRadius:8,background:"#fff",overflow:"visible"}}>
      <input value={val||""} onChange={e=>onChange&&onChange(e.target.value)}
        placeholder={ph} type={type} onKeyDown={onKeyDown}
        style={{flex:1,border:"none",outline:"none",padding:"12px 14px",fontSize:13,color:C.txt,fontFamily:C.fn,background:"transparent"}}/>
      {right}
    </div>
  );
}
function DropSel({val,onChange,children,ph}) {
  return (
    <div style={{position:"relative",border:`1px solid ${C.bdr}`,borderRadius:8,background:"#fff"}}>
      <select value={val||""} onChange={e=>onChange(e.target.value)}
        style={{width:"100%",border:"none",outline:"none",padding:"12px 14px",fontSize:13,color:val?C.txt:C.sub,fontFamily:C.fn,background:"transparent",WebkitAppearance:"none",cursor:"pointer"}}>
        {ph&&<option value="">{ph}</option>}
        {children}
      </select>
      <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:C.sub,pointerEvents:"none",fontSize:11}}>∨</span>
    </div>
  );
}

function StepBar({cur,total=4}) {
  return <div style={{display:"flex",gap:6,marginBottom:20}}>
    {Array.from({length:total},(_,i)=>(
      <div key={i} style={{flex:i===cur?2:1,height:4,borderRadius:2,background:i<=cur?C.acc:C.bdr,transition:"all 0.3s"}}/>
    ))}
  </div>;
}

function Sheet({title,onClose,children}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"flex-end",zIndex:900}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#fff",borderRadius:"20px 20px 0 0",padding:"0 20px 36px",
        width:"100%",maxHeight:"82%",overflowY:"auto",boxSizing:"border-box",fontFamily:C.fn
      }}>
        <div style={{width:36,height:4,background:C.bdr,borderRadius:2,margin:"12px auto 16px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontWeight:800,fontSize:17,color:C.txt}}>{title}</span>
          <button onClick={onClose} style={{background:C.bg,border:"none",color:C.sub2,cursor:"pointer",width:28,height:28,borderRadius:8,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.fn}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function LineChart({data}) {
  if (!data||data.length<2) return <div style={{height:70,display:"flex",alignItems:"center",justifyContent:"center",color:C.sub,fontSize:12}}>데이터 없음</div>;
  const W=300,H=70,p=10,vs=data.map(d=>d.v),mn=Math.min(...vs),mx=Math.max(...vs),rng=mx-mn||1;
  const pts=data.map((d,i)=>[(p+(i/(data.length-1))*(W-p*2)),(H-p-((d.v-mn)/rng)*(H-p*2))]);
  const area=`M ${pts[0][0]},${H-p} ${pts.map(([x,y])=>`L ${x},${y}`).join(" ")} L ${pts[pts.length-1][0]},${H-p} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}>
      <path d={area} fill={C.acc+"18"}/>
      <polyline points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke={C.acc} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" fill={C.acc}/>)}
    </svg>
  );
}

// ── 폰 목업 ───────────────────────────────────────────────────
function PhoneMockup({children}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth<=768);
  useEffect(()=>{
    const fn=()=>setIsMobile(window.innerWidth<=768);
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);
  if(isMobile) return <div style={{fontFamily:C.fn}}>{children}</div>;
  return (
    <div style={{minHeight:"100vh",height:"100vh",background:"linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",fontFamily:C.fn}}>
      <div style={{position:"relative"}}>
        <div style={{width:375,height:812,background:"#1a1a1a",borderRadius:50,padding:"10px",boxShadow:"0 0 0 2px #444,0 40px 100px rgba(0,0,0,0.7)",position:"relative",flexShrink:0,overflow:"hidden"}}>
          <div style={{position:"absolute",left:-3,top:110,width:3,height:30,background:"#333",borderRadius:"2px 0 0 2px"}}/>
          <div style={{position:"absolute",left:-3,top:160,width:3,height:54,background:"#333",borderRadius:"2px 0 0 2px"}}/>
          <div style={{position:"absolute",left:-3,top:228,width:3,height:54,background:"#333",borderRadius:"2px 0 0 2px"}}/>
          <div style={{position:"absolute",right:-3,top:150,width:3,height:78,background:"#333",borderRadius:"0 2px 2px 0"}}/>
          <div style={{width:"100%",height:"100%",background:"#fff",borderRadius:42,position:"relative",transform:"translateZ(0)",isolation:"isolate"}}>
            <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:120,height:32,background:"#1a1a1a",borderRadius:"0 0 18px 18px",zIndex:200}}>
              <div style={{position:"absolute",top:9,left:"50%",transform:"translateX(-50%)",width:11,height:11,background:"#2a2a2a",borderRadius:"50%"}}/>
            </div>
            <div style={{position:"absolute",top:0,left:0,right:0,height:42,display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"11px 18px 0",zIndex:100,pointerEvents:"none"}}>
              <span style={{fontSize:11,fontWeight:700,color:"#111"}}>9:41</span>
              <div style={{display:"flex",gap:4,alignItems:"center",fontSize:10}}>
                <span>▲▲▲</span><span>WiFi</span><span>🔋</span>
              </div>
            </div>
            <div style={{position:"absolute",top:42,left:0,right:0,bottom:0,overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch"}}>
              {children}
            </div>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:20,color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:600,letterSpacing:2}}>D-Works MVP</div>
      </div>
    </div>
  );
}

// ── 스플래시 ──────────────────────────────────────────────────
function SplashPage({onStart}) {
  const [slide,setSlide] = useState(0);
  const slides = [
    { title:"발주 업무,\n이제 자동으로", desc:"수기 계산·카카오톡 개별 발주\n이제 그만!", icon:"📋" },
    { title:"BOM 기반\n소요량 자동 계산", desc:"상품별 원부자재 구성을 등록하면\n소요량이 자동으로 계산됩니다.", icon:"🧮" },
    { title:"거래처별\n원클릭 발송", desc:"업체별 발주서를 자동 생성하고\n이메일로 즉시 발송합니다.", icon:"📧" },
    { title:"발주 이력\n데이터화", desc:"모든 발주가 기록되어\n언제든 조회할 수 있습니다.", icon:"📊" },
  ];
  return (
    <div style={{minHeight:"100%",background:"#fff",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"44px 24px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{color:C.acc,fontWeight:900,fontSize:24,letterSpacing:1}}>D-Works</div>
        <button onClick={onStart} style={{background:"none",border:"none",color:C.sub,fontSize:13,cursor:"pointer",fontFamily:C.fn}}>건너뛰기</button>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 24px"}}>
        <div style={{fontSize:64,marginBottom:24}}>{slides[slide].icon}</div>
        <div style={{fontSize:26,fontWeight:900,textAlign:"center",whiteSpace:"pre-line",marginBottom:14,color:C.txt,lineHeight:1.4}}>{slides[slide].title}</div>
        <div style={{fontSize:14,color:C.sub2,textAlign:"center",whiteSpace:"pre-line",lineHeight:1.8}}>{slides[slide].desc}</div>
      </div>
      <div style={{padding:"0 24px 40px"}}>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>
          {slides.map((_,i)=>(
            <div key={i} onClick={()=>setSlide(i)} style={{width:i===slide?24:8,height:8,borderRadius:4,background:i===slide?C.acc:C.bdr,cursor:"pointer",transition:"all 0.3s"}}/>
          ))}
        </div>
        {slide<slides.length-1
          ? <Btn ch="다음 →" full sz="l" onClick={()=>setSlide(s=>s+1)} st={{borderRadius:12,height:50}}/>
          : <Btn ch="시작하기 →" full sz="l" onClick={onStart} st={{borderRadius:12,height:50}}/>
        }
      </div>
    </div>
  );
}

// ── 로그인 ────────────────────────────────────────────────────
function AuthPage({onLogin}) {
  const [tab,setTab] = useState("in");
  const [f,setF] = useState({name:"",company:"",email:"",pw:"",pw2:"",tel:""});
  const [err,setErr] = useState("");
  const [loading,setLoading] = useState(false);
  const sf = k => v => setF(p=>({...p,[k]:v}));

  async function submit() {
    setErr("");
    if(!f.email||!f.pw){setErr("이메일과 비밀번호를 입력하세요");return;}
    if(tab==="up"&&!f.name){setErr("이름을 입력하세요");return;}
    if(tab==="up"&&f.pw!==f.pw2){setErr("비밀번호가 일치하지 않습니다");return;}
    if(tab==="up"&&f.pw.length<6){setErr("비밀번호 6자 이상");return;}
    setLoading(true);
    try {
      if(tab==="up"){
        const r = await DB.signUp(f.email,f.pw,{name:f.name,company:f.company,tel:f.tel});
        if(r.error){setErr(r.error.message.includes("already")?"이미 가입된 이메일":r.error.message);return;}
        const r2 = await DB.signIn(f.email,f.pw);
        if(!r2.access_token){setErr("가입완료! 로그인해주세요");setTab("in");return;}
        onLogin({token:r2.access_token,id:r2.user.id,name:f.name,company:f.company,email:f.email,tel:f.tel});
      } else {
        const r = await DB.signIn(f.email,f.pw);
        if(!r.access_token){
          const msg=r.error?.message||"";
          setErr(msg.includes("Invalid")||msg.includes("invalid")?"이메일 또는 비밀번호가 틀렸습니다":msg||"로그인 실패");
          return;
        }
        const meta=r.user?.user_metadata||{};
        onLogin({token:r.access_token,id:r.user.id,name:meta.name||f.email.split("@")[0],company:meta.company||"",email:r.user.email,tel:meta.tel||""});
      }
    } catch(e){setErr("네트워크 오류");}
    finally{setLoading(false);}
  }

  return (
    <div style={{minHeight:"100%",background:C.bg,fontFamily:C.fn}}>
      <div style={{background:"#fff",padding:"44px 20px 20px",borderBottom:`1px solid ${C.bdr}`}}>
        <div style={{fontSize:30,fontWeight:900,color:C.acc,letterSpacing:1}}>D-Works</div>
        <div style={{fontSize:13,color:C.sub,marginTop:4}}>의류 생산 발주 자동화 서비스</div>
      </div>
      <div style={{padding:"20px 20px 40px"}}>
        <div style={{display:"flex",borderBottom:`1.5px solid ${C.bdr}`,marginBottom:20}}>
          {[["in","로그인"],["up","회원가입"]].map(([k,l])=>(
            <button key={k} onClick={()=>{setTab(k);setErr("");}} style={{flex:1,padding:"11px 0",background:"none",border:"none",borderBottom:`2.5px solid ${tab===k?C.acc:"transparent"}`,color:tab===k?C.acc:C.sub,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:C.fn,marginBottom:-2}}>{l}</button>
          ))}
        </div>
        {tab==="up"&&<>
          <Field label="이름" req><TxtInp val={f.name} onChange={sf("name")} ph="이름 입력"/></Field>
          <Field label="업체명"><TxtInp val={f.company} onChange={sf("company")} ph="업체명 입력"/></Field>
        </>}
        <Field label="이메일" req><TxtInp val={f.email} onChange={sf("email")} ph="이메일" type="email"/></Field>
        <Field label="비밀번호" req><TxtInp val={f.pw} onChange={sf("pw")} ph={tab==="up"?"6자 이상":"비밀번호"} type="password" onKeyDown={e=>e.key==="Enter"&&submit()}/></Field>
        {tab==="up"&&<>
          <Field label="비밀번호 확인" req><TxtInp val={f.pw2} onChange={sf("pw2")} ph="비밀번호 재입력" type="password"/></Field>
          <Field label="연락처"><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field>
        </>}
        {err&&<div style={{color:C.red,fontSize:13,marginBottom:12,padding:"10px 14px",background:"#FFF5F5",borderRadius:8,border:"1px solid #FED7D7"}}>{err}</div>}
        <Btn ch={loading?(tab==="in"?"로그인 중...":"가입 중..."):(tab==="in"?"로그인":"가입하기")} onClick={submit} full sz="l" disabled={loading} st={{borderRadius:10,height:50,fontSize:15}}/>
        {tab==="in"&&<div style={{textAlign:"center",marginTop:14,fontSize:13,color:C.sub}}>
          계정이 없으신가요? <span onClick={()=>setTab("up")} style={{color:C.acc,fontWeight:700,cursor:"pointer"}}>회원가입</span>
        </div>}
      </div>
    </div>
  );
}

// ── 대시보드 ──────────────────────────────────────────────────
function DashPage({orders,products,onNav}) {
  const td=today();
  const yest=new Date();yest.setDate(yest.getDate()-1);
  const yd=yest.toISOString().slice(0,10);
  const tO=orders.filter(o=>o.date===td);
  const mQ=orders.filter(o=>o.date?.slice(0,7)===td.slice(0,7)).reduce((s,o)=>s+(o.items||[]).reduce((ss,i)=>ss+(i.qty||0),0),0);
  const delayed=orders.filter(o=>o.status==="지연");
  const chartData=Array.from({length:7},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-(6-i));
    const ds=d.toISOString().slice(0,10);
    return {label:ds.slice(5),v:orders.filter(o=>o.date===ds).reduce((s,o)=>s+(o.items||[]).reduce((ss,ii)=>ss+(ii.qty||0),0),0)};
  });
  return (
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,textAlign:"center",marginBottom:14}}>대시 보드</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,marginBottom:14,border:`1px solid ${C.bdr}`,borderRadius:12,overflow:"hidden"}}>
        {[{label:"오늘 발주",val:`${tO.length}건`,c:C.acc},{label:"미출고 발주",val:`${delayed.length}건`,c:"#8B5CF6"},{label:"이달 발주량",val:`${fmtN(mQ)}매`,c:C.ok}].map((s,i)=>(
          <div key={s.label} style={{background:"#fff",padding:"12px 6px",textAlign:"center",borderLeft:i>0?`1px solid ${C.bdr}`:"none"}}>
            <div style={{color:s.c,fontSize:20,fontWeight:900}}>{s.val}</div>
            <div style={{color:C.sub,fontSize:10,marginTop:3,fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>
      <Card st={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontWeight:800,fontSize:14}}>⚠️ 지연 {delayed.length}건</span>
          {delayed.length>2&&<button onClick={()=>onNav("list")} style={{background:"none",border:"none",fontSize:12,color:C.sub,cursor:"pointer",fontFamily:C.fn}}>더보기</button>}
        </div>
        {delayed.length===0
          ?<div style={{textAlign:"center",padding:"12px 0",color:C.sub,fontSize:12}}>지연 발주 없음 ✅</div>
          :<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 70px 50px 44px",fontSize:11,fontWeight:600,color:C.sub,padding:"0 0 6px",borderBottom:`1px solid ${C.bdr}`,marginBottom:4}}>
              {["상품명","색상","수량","상태"].map(h=><div key={h}>{h}</div>)}
            </div>
            {delayed.slice(0,5).flatMap(o=>(o.items||[]).map((it,j)=>{
              const p=products.find(x=>x.id===it.pid);
              return <div key={`${o.id}-${j}`} style={{display:"grid",gridTemplateColumns:"1fr 70px 50px 44px",fontSize:12,padding:"6px 0",borderBottom:`1px solid ${C.bdr}`,alignItems:"center"}}>
                <div style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p?.name||"-"}</div>
                <div style={{color:C.sub2}}>{it.color}</div>
                <div>{fmtN(it.qty)}</div>
                <Tag ch="지연" c={C.warn}/>
              </div>;
            }))}
          </>
        }
      </Card>
      <Card>
        <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>📈 발주량 추이</div>
        <LineChart data={chartData}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
          {chartData.filter((_,i)=>i%2===0).map(d=><span key={d.label} style={{fontSize:9,color:C.sub}}>{d.label}</span>)}
        </div>
      </Card>
    </div>
  );
}

// ── 발주 입력 ─────────────────────────────────────────────────
function OrderPage({products,orders,setOrders,vendors,user}) {
  const [step,setStep] = useState(1);
  const [items,setItems] = useState([]);
  const [search,setSearch] = useState("");
  const [selProd,setSelProd] = useState(null);
  const [selColor,setSelColor] = useState("");
  const [qty,setQty] = useState("");
  const [sending,setSending] = useState(false);
  const DRAFT_KEY = "dworks_order_draft";

  // 임시저장 불러오기
  useEffect(()=>{
    try{
      const d = localStorage.getItem(DRAFT_KEY);
      if(d){ const draft=JSON.parse(d); if(draft.items?.length>0){setItems(draft.items);alert("임시저장된 발주가 있습니다. 불러왔습니다!");} }
    }catch{}
  },[]);

  function saveDraft(){
    if(!items.length){alert("저장할 항목이 없습니다");return;}
    try{localStorage.setItem(DRAFT_KEY,JSON.stringify({items,savedAt:new Date().toISOString()}));alert(`✅ 임시저장 완료! (${items.length}개 항목)`);}
    catch{alert("임시저장 실패");}
  }
  function clearDraft(){ try{localStorage.removeItem(DRAFT_KEY);}catch{} }

  const filtered=products.filter(p=>p.name?.includes(search)||p.season?.includes(search));

  function addItem(){
    if(!selProd||!selColor||!qty){alert("상품·색상·수량을 입력하세요");return;}
    const idx=items.findIndex(i=>i.pid===selProd.id&&i.color===selColor);
    if(idx>=0) setItems(p=>p.map((it,i)=>i===idx?{...it,qty:it.qty+Number(qty)}:it));
    else setItems(p=>[...p,{pid:selProd.id,color:selColor,qty:Number(qty)}]);
    setSelProd(null);setSelColor("");setQty("");setSearch("");
  }

  async function submit(){
    if(!items.length){alert("발주 항목 추가");return;}
    const newOrder={items,status:"진행중",date:today(),ts:new Date().toISOString()};
    try {
      if(user?.token){
        const r=await DB.insert(user.token,"orders",{...newOrder,user_id:user.id});
        setOrders(p=>[...p,Array.isArray(r)?r[0]:{...newOrder,id:uid()}]);
      } else setOrders(p=>[...p,{...newOrder,id:uid()}]);
    } catch { setOrders(p=>[...p,{...newOrder,id:uid()}]); }
    clearDraft();
    setStep(3);
  }

  async function sendMail(){
    const venMap={};
    for(const it of items){
      const prod=products.find(x=>x.id===it.pid);
      if(!prod) continue;
      for(const b of (prod.bom||[])){
        const ven=vendors.find(v=>v.id===b.vid);
        if(!ven) continue;
        const soyo=Math.round(b.amt*it.qty*100)/100;
        if(!venMap[ven.id]) venMap[ven.id]={vendor:ven,entries:[]};
        venMap[ven.id].entries.push({prod,b,color:it.color,soyo});
      }
    }
    const targets=Object.values(venMap).filter(v=>v.vendor.email);
    if(!targets.length){alert("발송 가능한 이메일이 없습니다.\n거래처 관리에서 이메일을 등록해주세요.");return;}
    setSending(true);
    let cnt=0;
    for(const {vendor,entries} of targets){
      const matMap={};
      for(const e of entries){
        const key=`${e.b.mat}`;
        if(!matMap[key]) matMap[key]={mat:e.b.mat,type:e.b.type||"",unit:e.b.unit||"yd",colors:[],prod:e.prod};
        matMap[key].colors.push(`${e.color} ${fmtN(e.soyo)}${e.b.unit||"yd"}`);
      }
      let body=`안녕하세요\n\n`;
      for(const m of Object.values(matMap)){
        body+=`[${m.prod.name}]\n${m.mat}\n`;
        m.colors.forEach(c=>{body+=`${c}\n`;});
        body+=`\n품목 : ${m.prod.name}\n`;
        body+=`------------------------\n`;
        body+=`입고처 : ${m.prod.factory||"-"}\n`;
        body+=`연락처 : ${m.prod.factoryTel||"-"}\n\n`;
      }
      body+=`감사합니다.\n---\nD-Works 발주 자동화 시스템`;
      if(await sendEmail(vendor.email,vendor.name,`[D-Works 발주서] ${today()} - ${vendor.name}`,body)) cnt++;
    }
    setSending(false);
    if(cnt>0) alert(`✅ ${cnt}곳 거래처에 발주서를 발송했습니다!`);
    else alert("발송 실패. 거래처 이메일을 확인해주세요.");
  }

  function reset(){setStep(1);setItems([]);setSearch("");setSelProd(null);setSelColor("");setQty("");}

  if(step===3) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60%",padding:24,paddingTop:60}}>
      <div style={{fontSize:56,marginBottom:14}}>✅</div>
      <div style={{fontWeight:900,fontSize:22,marginBottom:8}}>발주 완료!</div>
      <div style={{color:C.sub,marginBottom:28,fontSize:13}}>{items.length}개 상품 발주</div>
      <Btn ch="+ 새 발주 입력" onClick={reset} sz="l" st={{borderRadius:12}}/>
    </div>
  );

  return (
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:4}}>{step===1?"발주 입력":"발주서 확인"}</div>
      <div style={{color:C.sub,fontSize:12,marginBottom:14}}>기본 정보를 입력해 주세요</div>
      <StepBar cur={step-1}/>

      {step===1&&<>
        <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>발주 추가</div>
        <Card st={{marginBottom:12}}>
          <Field label="상품명">
            <div style={{position:"relative"}}>
              <TxtInp val={search} onChange={v=>{setSearch(v);if(selProd&&v!==selProd.name)setSelProd(null);}} ph="상품명 입력"/>
              {search&&!selProd&&filtered.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:8,zIndex:50,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:160,overflowY:"auto"}}>
                  {filtered.map(p=>(
                    <div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);setSelColor("");}} style={{padding:"10px 14px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer"}}>
                      <div style={{fontWeight:600,fontSize:13}}>{p.name}</div>
                      <div style={{color:C.sub,fontSize:11,marginTop:2}}>{p.season} · {(p.colors||[]).join(", ")}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Field>
          <Field label="색상">
            <DropSel val={selColor} onChange={setSelColor} ph="색상 선택">
              {(selProd?.colors||[]).map(c=><option key={c} value={c}>{c}</option>)}
            </DropSel>
          </Field>
          <Field label="수량"><TxtInp val={qty} onChange={setQty} ph="수량 입력" type="number"/></Field>
        </Card>
        <Btn ch="+ 발주 리스트에 추가" full onClick={addItem} disabled={!selProd||!selColor||!qty} st={{marginBottom:18}}/>

        <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>발주 리스트</div>
        <Card st={{marginBottom:18}}>
          {items.length===0
            ?<div style={{padding:"16px 0",color:C.sub,fontSize:12,textAlign:"center"}}>추가된 항목 없음</div>
            :items.map((it,i)=>{
              const p=products.find(x=>x.id===it.pid);
              return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.bdr}`}}>
                <div style={{fontSize:13}}><span style={{fontWeight:700}}>{p?.name}</span> / {it.color}</div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontWeight:700,color:C.acc,fontSize:13}}>{fmtN(it.qty)}장</span>
                  <button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:16}}>✕</button>
                </div>
              </div>;
            })
          }
        </Card>
        <div style={{display:"flex",gap:10}}>
          <Btn ch="임시저장" v="w" full st={{flex:1}} onClick={saveDraft}/>
          <Btn ch="다음" full st={{flex:2}} onClick={()=>items.length?setStep(2):alert("항목 추가 필요")} disabled={!items.length}/>
        </div>
      </>}

      {step===2&&<>
        <Card st={{marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>📋 발주 내역</div>
          {items.map((it,i)=>{
            const p=products.find(x=>x.id===it.pid);
            return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.bdr}`}}>
              <div><div style={{fontWeight:700,fontSize:13}}>{p?.name}</div><div style={{color:C.sub,fontSize:11,marginTop:2}}>{it.color} · {p?.factory}</div></div>
              <span style={{fontWeight:800,color:C.acc,fontSize:15}}>{fmtN(it.qty)}장</span>
            </div>;
          })}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:10}}>
            <span style={{fontWeight:700,fontSize:13}}>총 수량</span>
            <span style={{fontWeight:900,color:C.acc,fontSize:17}}>{fmtN(items.reduce((s,it)=>s+it.qty,0))}장</span>
          </div>
        </Card>
        <Btn ch={sending?"발송 중...":"📧 이메일 발송"} v="w" full st={{marginBottom:10}} onClick={sendMail} disabled={sending}/>
        <div style={{display:"flex",gap:10}}>
          <Btn ch="← 수정" v="w" full st={{flex:1}} onClick={()=>setStep(1)}/>
          <Btn ch="발주 완료" full st={{flex:2,background:C.ok}} onClick={submit}/>
        </div>
      </>}
    </div>
  );
}

// ── 상품 관리 ─────────────────────────────────────────────────
function ProdsPage({products,setProducts,vendors,factories,user}) {
  const [catF,setCatF] = useState("전체");
  const [sheet,setSheet] = useState(false);
  const [f,setF] = useState({name:"",category:"",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],bom:[]});
  const [ci,setCi] = useState("");
  const [br,setBr] = useState({type:"",mat:"",amt:"",vid:""});
  const [editBomId,setEditBomId] = useState(null);
  const [venSearch,setVenSearch] = useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  const filtered=catF==="전체"?products:products.filter(p=>p.category===catF);

  function openAdd(){setF({name:"",category:"",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],bom:[]});setCi("");setBr({type:"",mat:"",amt:"",vid:""});setVenSearch("");setSheet(true);}
  function openEdit(p){setF({...p,colors:[...(p.colors||[])],bom:(p.bom||[]).map(b=>({...b}))});setCi("");setBr({type:"",mat:"",amt:"",vid:""});setVenSearch("");setSheet(true);}
  function addColor(){const c=ci.trim();if(!c||f.colors.includes(c))return;setF(p=>({...p,colors:[...p.colors,c]}));setCi("");}
  function addBom(){
    if(!br.mat||!br.amt) return;
    if(editBomId){setF(p=>({...p,bom:p.bom.map(b=>b.id===editBomId?{...b,...br,amt:Number(br.amt)}:b)}));setEditBomId(null);}
    else setF(p=>({...p,bom:[...p.bom,{...br,id:uid(),amt:Number(br.amt)}]}));
    setBr({type:"",mat:"",amt:"",vid:""});setVenSearch("");
  }
  async function save(){
    if(!f.name) return;
    try{
      if(f.id&&user?.token){
        await DB.update(user.token,"products",f.id,{name:f.name,category:f.category,season:f.season,factory_id:f.factoryId,factory:f.factory,factory_tel:f.factoryTel,colors:f.colors,bom:f.bom});
        setProducts(products.map(p=>p.id===f.id?f:p));
      } else if(user?.token){
        const r=await DB.insert(user.token,"products",{name:f.name,category:f.category,season:f.season,factory_id:f.factoryId,factory:f.factory,factory_tel:f.factoryTel,colors:f.colors,bom:f.bom,user_id:user.id});
        setProducts(p=>[...p,Array.isArray(r)?{...r[0],factoryId:r[0].factory_id,factoryTel:r[0].factory_tel}:{...f,id:uid()}]);
      } else {
        setProducts(f.id?products.map(p=>p.id===f.id?f:p):[...products,{...f,id:uid()}]);
      }
    } catch {setProducts(f.id?products.map(p=>p.id===f.id?f:p):[...products,{...f,id:uid()}]);}
    setSheet(false);
  }
  async function del(id){
    if(!window.confirm("삭제?")) return;
    if(user?.token) try{await DB.delete(user.token,"products",id);}catch{}
    setProducts(products.filter(p=>p.id!==id));
  }

  return (
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:900,fontSize:20}}>상품 관리</div>
        <Btn ch="+ 추가" sz="s" st={{padding:"7px 14px"}} onClick={openAdd}/>
      </div>
      <div style={{display:"flex",gap:7,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {["전체",...CATS].map(cat=>{
          const cnt=cat==="전체"?products.length:products.filter(p=>p.category===cat).length;
          const act=catF===cat;
          return <button key={cat} onClick={()=>setCatF(cat)} style={{padding:"6px 12px",borderRadius:20,flexShrink:0,whiteSpace:"nowrap",border:`1.5px solid ${act?(CAT_C[cat]||C.acc):C.bdr}`,background:act?(CAT_C[cat]||C.acc):"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:C.fn}}>{cat} {cnt}</button>;
        })}
      </div>
      {filtered.length===0?<Empty icon="👕" text="등록된 상품이 없습니다"/>:filtered.map(p=>(
        <Card key={p.id} st={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:6}}>
                <span style={{fontWeight:800,fontSize:14}}>{p.name}</span>
                {p.category&&<Tag ch={p.category} c={CAT_C[p.category]||C.sub}/>}
                <Tag ch={p.season} c={C.acc}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:4}}>
                {(p.colors||[]).map(c=><span key={c} style={{background:C.bg,borderRadius:20,padding:"2px 8px",fontSize:11,color:C.sub2,border:`1px solid ${C.bdr}`}}>{c}</span>)}
              </div>
              <div style={{color:C.sub,fontSize:11}}>{p.factory&&`📍 ${p.factory}`} {p.bom?.length>0&&`· BOM ${p.bom.length}종`}</div>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:8}}>
              <Btn ch="수정" v="w" sz="s" st={{padding:"5px 11px",fontSize:12}} onClick={()=>openEdit(p)}/>
              <Btn ch="삭제" v="w" sz="s" st={{padding:"5px 11px",fontSize:12,color:C.red}} onClick={()=>del(p.id)}/>
            </div>
          </div>
        </Card>
      ))}

      {sheet&&(
        <Sheet title={f.id?"상품 수정":"1단계 원단 입력"} onClose={()=>setSheet(false)}>
          <StepBar cur={0}/>
          <div style={{fontSize:12,fontWeight:600,color:C.sub,marginBottom:8}}>기본 정보</div>
          <FCard>
            <FRow label="상품명" req><FInp val={f.name} onChange={sf("name")} ph="상품명 입력"/></FRow>
            <FRow label="시즌"><FSel val={f.season} onChange={sf("season")} ph="">{SEASONS.map(s=><option key={s} value={s}>{s}</option>)}</FSel><span style={{color:C.sub,fontSize:11,flexShrink:0}}>∨</span></FRow>
            <FRow label="공장" last>
              <FSel val={f.factoryId||""} onChange={v=>{const fc=factories.find(x=>x.id===v);setF(p=>({...p,factoryId:v,factory:fc?.name||"",factoryTel:fc?.tel||""}));}} ph="공장 선택">
                {factories.map(fc=><option key={fc.id} value={fc.id}>{fc.name}</option>)}
              </FSel>
              <span style={{color:C.sub,fontSize:11,flexShrink:0}}>∨</span>
            </FRow>
          </FCard>
          {f.factory&&<div style={{fontSize:11,color:C.sub,marginBottom:10,marginTop:-6,paddingLeft:4}}>📞 {f.factoryTel} · 발주서 자동포함</div>}

          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
            {CATS.map(cat=>{const act=f.category===cat;return<button key={cat} onClick={()=>sf("category")(cat)} style={{padding:"5px 11px",borderRadius:20,border:`1.5px solid ${act?(CAT_C[cat]||C.acc):C.bdr}`,background:act?(CAT_C[cat]||C.acc):"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:C.fn}}>{cat}</button>;})}
          </div>

          <div style={{fontSize:12,fontWeight:600,color:C.sub,marginBottom:8}}>원단 정보</div>
          <FCard>
            <FRow label="원단명"><FInp val={br.mat} onChange={v=>setBr(r=>({...r,mat:v}))} ph="예: 30수 면 싱글"/></FRow>
            <FRow label="색상">
              <div style={{flex:1,display:"flex",flexWrap:"wrap",gap:4,justifyContent:"flex-end",alignItems:"center",padding:"4px 0"}}>
                {f.colors.map(c=><span key={c} style={{background:C.bg,borderRadius:20,padding:"2px 7px",fontSize:11,display:"flex",alignItems:"center",gap:3,border:`1px solid ${C.bdr}`}}>
                  {c}<button onClick={()=>setF(p=>({...p,colors:p.colors.filter(x=>x!==c)}))} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:10,lineHeight:1,padding:0}}>✕</button>
                </span>)}
                <div style={{display:"flex",gap:4}}>
                  <input value={ci} onChange={e=>setCi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addColor()} placeholder="추가" style={{width:48,border:`1px solid ${C.bdr}`,borderRadius:6,padding:"2px 6px",fontSize:11,fontFamily:C.fn,outline:"none",textAlign:"center"}}/>
                  <button onClick={addColor} style={{background:C.acc,border:"none",color:"#fff",borderRadius:6,padding:"2px 8px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:C.fn}}>+</button>
                </div>
              </div>
            </FRow>
            <FRow label="소요량"><FInp val={br.amt} onChange={v=>setBr(r=>({...r,amt:v}))} ph="0.0" type="number"/><span style={{color:C.sub,fontSize:11,flexShrink:0,marginLeft:4}}>yd</span></FRow>
            <FRow label="단가" last><FInp val={br.price||""} onChange={v=>setBr(r=>({...r,price:v}))} ph="0" type="number"/><span style={{color:C.sub,fontSize:11,flexShrink:0,marginLeft:4}}>원</span></FRow>
          </FCard>

          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            {MAT_TYPES.map(t=>{const act=br.type===t;return<button key={t} onClick={()=>setBr(r=>({...r,type:t}))} style={{padding:"5px 11px",borderRadius:20,whiteSpace:"nowrap",border:`1.5px solid ${act?C.acc:C.bdr}`,background:act?C.acc:"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:C.fn}}>{t}</button>;})}
          </div>

          <div style={{fontSize:12,fontWeight:600,color:C.sub,marginBottom:8}}>업체 정보</div>
          <FCard mb={8}>
            <FRow label="업체명" last>
              <div style={{flex:1,position:"relative",display:"flex",alignItems:"center"}}>
                <input value={venSearch} onChange={e=>{setVenSearch(e.target.value);if(!e.target.value)setBr(r=>({...r,vid:""}));}}
                  placeholder="업체명 검색" style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:C.txt,fontFamily:C.fn,textAlign:"right"}}/>
                {br.vid&&<span style={{color:C.ok,fontSize:13,marginLeft:4,flexShrink:0}}>✓</span>}
                {venSearch&&!br.vid&&(()=>{
                  const fv=vendors.filter(v=>v.name?.includes(venSearch));
                  return fv.length>0?(
                    <div style={{position:"absolute",top:"100%",right:0,width:180,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:8,zIndex:50,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:130,overflowY:"auto"}}>
                      {fv.map(v=>(
                        <div key={v.id} onClick={()=>{setBr(r=>({...r,vid:v.id}));setVenSearch(v.name);}} style={{padding:"8px 12px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:12,fontWeight:600}}>{v.name}</span>
                          <Tag ch={v.type} c={VEN_C[v.type]||C.sub}/>
                        </div>
                      ))}
                    </div>
                  ):null;
                })()}
              </div>
              <span style={{color:C.sub,fontSize:11,flexShrink:0,marginLeft:4}}>∨</span>
            </FRow>
          </FCard>

          {f.bom.length>0&&f.bom.map(b=>{
            const ven=vendors.find(v=>v.id===b.vid);
            const isE=editBomId===b.id;
            return <div key={b.id} style={{background:isE?C.acc+"10":C.bg,borderRadius:8,padding:"9px 12px",marginBottom:6,border:`1.5px solid ${isE?C.acc:C.bdr}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{background:C.acc+"15",color:C.acc,borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700,marginRight:6}}>{b.type||"원단"}</span>
                  <span style={{fontWeight:700,fontSize:12}}>{b.mat}</span>
                  <span style={{color:C.sub,fontSize:11,marginLeft:6}}>{b.amt}yd</span>
                  {ven&&<span style={{color:C.sub,fontSize:11,marginLeft:4}}>· {ven.name}</span>}
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button onClick={()=>{if(isE){setEditBomId(null);setBr({type:"",mat:"",amt:"",vid:""});setVenSearch("");}else{setEditBomId(b.id);setBr({type:b.type||"",mat:b.mat,amt:String(b.amt),vid:b.vid||""});const ev=vendors.find(v=>v.id===b.vid);setVenSearch(ev?.name||"");}}} style={{background:"none",border:"none",color:isE?C.acc:C.sub,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:C.fn}}>{isE?"취소":"수정"}</button>
                  <button onClick={()=>{setF(p=>({...p,bom:p.bom.filter(x=>x.id!==b.id)}));if(isE){setEditBomId(null);setBr({type:"",mat:"",amt:"",vid:""});setVenSearch("");}}} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:14}}>✕</button>
                </div>
              </div>
            </div>;
          })}
          <Btn ch={editBomId?"✓ 수정 완료":"+ 원부자재 추가"} v={editBomId?"p":"w"} full st={{marginBottom:18}} onClick={addBom}/>
          <div style={{display:"flex",gap:10}}>
            <Btn ch="임시저장" v="w" full st={{flex:1}} onClick={()=>setSheet(false)}/>
            <Btn ch="저장" full st={{flex:2}} onClick={save} disabled={!f.name}/>
          </div>
        </Sheet>
      )}
    </div>
  );
}

// ── 발주 리스트 ───────────────────────────────────────────────
function ListPage({orders,setOrders,products,user}) {
  const [filter,setFilter] = useState("전체");
  const [open,setOpen] = useState(null);
  const SC={완료:C.ok,지연:C.warn,진행중:C.acc};
  const filtered=(filter==="전체"?orders:orders.filter(o=>o.status===filter)).sort((a,b)=>new Date(b.ts||0)-new Date(a.ts||0));

  async function changeStatus(id,status){
    if(user?.token) try{await DB.update(user.token,"orders",id,{status});}catch{}
    setOrders(p=>p.map(x=>x.id===id?{...x,status}:x));
  }
  async function delOrder(id){
    if(!window.confirm("삭제?")) return;
    if(user?.token) try{await DB.delete(user.token,"orders",id);}catch{}
    setOrders(p=>p.filter(x=>x.id!==id));
  }

  return (
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:900,fontSize:20}}>발주 리스트</div>
        <Tag ch={`${orders.length}건`} c={C.sub}/>
      </div>
      <div style={{display:"flex",gap:7,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {["전체","진행중","완료","지연"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{padding:"6px 14px",borderRadius:20,flexShrink:0,border:`1.5px solid ${filter===s?C.acc:C.bdr}`,background:filter===s?C.acc+"18":"#fff",color:filter===s?C.acc:C.sub2,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:C.fn}}>{s}</button>
        ))}
      </div>
      {filtered.length===0?<Empty icon="📋" text="발주 내역이 없습니다"/>:filtered.map(o=>{
        const tot=(o.items||[]).reduce((s,i)=>s+(i.qty||0),0);
        const isO=open===o.id;
        return <Card key={o.id} st={{marginBottom:10,cursor:"pointer"}} onClick={()=>setOpen(isO?null:o.id)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(o.items||[]).map(it=>products.find(x=>x.id===it.pid)?.name||"-").join(", ")}</div>
              <div style={{color:C.sub,fontSize:11}}>{o.date} · {fmtN(tot)}장</div>
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0,marginLeft:8}}>
              <Tag ch={o.status} c={SC[o.status]||C.sub}/>
              <span style={{color:C.sub,fontSize:12}}>{isO?"▲":"▼"}</span>
            </div>
          </div>
          {isO&&<div onClick={e=>e.stopPropagation()}>
            <Divider/>
            {(o.items||[]).map((it,j)=>{const p=products.find(x=>x.id===it.pid);return<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.bdr}`,fontSize:12}}><span style={{fontWeight:600}}>{p?.name}</span><span>{it.color} · <strong>{fmtN(it.qty)}</strong>장</span></div>;})}
            <div style={{display:"flex",gap:7,marginTop:10,flexWrap:"wrap"}}>
              {["진행중","완료","지연"].map(st=>(
                <Btn key={st} ch={st} sz="s" st={{padding:"5px 11px",background:o.status===st?(SC[st]||C.acc):"#fff",color:o.status===st?"#fff":(SC[st]||C.sub2),border:`1.5px solid ${SC[st]||C.bdr}`,fontSize:12}} onClick={()=>changeStatus(o.id,st)}/>
              ))}
              <Btn ch="삭제" sz="s" v="w" st={{marginLeft:"auto",color:C.red,fontSize:12,padding:"5px 11px"}} onClick={()=>delOrder(o.id)}/>
            </div>
          </div>}
        </Card>;
      })}
    </div>
  );
}

// ── 거래처 ────────────────────────────────────────────────────
function VendorPage({vendors,setVendors,user}) {
  const [sheet,setSheet] = useState(false);
  const [f,setF] = useState({name:"",tel:"",email:"",type:"원단"});
  const [editId,setEditId] = useState(null);
  const sf=k=>v=>setF(p=>({...p,[k]:v}));

  function openAdd(){setF({name:"",tel:"",email:"",type:"원단"});setEditId(null);setSheet(true);}
  function openEdit(v){setF({...v});setEditId(v.id);setSheet(true);}
  async function save(){
    if(!f.name) return;
    try{
      if(editId){
        if(user?.token) await DB.update(user.token,"vendors",editId,{name:f.name,tel:f.tel,email:f.email,type:f.type});
        setVendors(vv=>vv.map(v=>v.id===editId?{...v,...f}:v));
      } else {
        if(user?.token){const r=await DB.insert(user.token,"vendors",{name:f.name,tel:f.tel,email:f.email,type:f.type,user_id:user.id});setVendors(vv=>[...vv,Array.isArray(r)?r[0]:{...f,id:uid()}]);}
        else setVendors(vv=>[...vv,{...f,id:uid()}]);
      }
    } catch{setVendors(editId?vv=>vv.map(v=>v.id===editId?{...v,...f}:v):vv=>[...vv,{...f,id:uid()}]);}
    setSheet(false);
  }
  async function del(id){
    if(!window.confirm("삭제?")) return;
    if(user?.token) try{await DB.delete(user.token,"vendors",id);}catch{}
    setVendors(vv=>vv.filter(x=>x.id!==id));
  }

  return (
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div style={{fontWeight:900,fontSize:20}}>거래처 관리</div>
        <Btn ch="+ 추가" sz="s" st={{padding:"7px 14px"}} onClick={openAdd}/>
      </div>
      {vendors.length===0?<Empty icon="🏭" text="등록된 거래처가 없습니다"/>:vendors.map(v=>(
        <Card key={v.id} st={{marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:(VEN_C[v.type]||C.sub)+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{VEN_IC[v.type]||"🏭"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                <span style={{fontWeight:800,fontSize:14}}>{v.name}</span>
                <Tag ch={v.type} c={VEN_C[v.type]||C.sub}/>
              </div>
              <div style={{color:C.sub,fontSize:12}}>{v.tel||"연락처 없음"}</div>
              <div style={{fontSize:11,color:v.email?C.sub:C.warn,marginTop:2}}>{v.email||"⚠️ 이메일 미등록"}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
              <Btn ch="수정" v="w" sz="s" st={{padding:"5px 11px",fontSize:12}} onClick={()=>openEdit(v)}/>
              <Btn ch="삭제" v="w" sz="s" st={{padding:"5px 11px",fontSize:12,color:C.red}} onClick={()=>del(v.id)}/>
            </div>
          </div>
        </Card>
      ))}
      {sheet&&(
        <Sheet title={editId?"거래처 수정":"거래처 추가"} onClose={()=>setSheet(false)}>
          <Field label="거래처명" req><TxtInp val={f.name} onChange={sf("name")} ph="이레텍스"/></Field>
          <Field label="전화번호"><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field>
          <Field label="이메일 (발주서 발송용)"><TxtInp val={f.email} onChange={sf("email")} ph="order@fabric.com" type="email"/></Field>
          <Field label="업체 유형">
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {VEN_TYPES.map(t=>{const act=f.type===t;return<button key={t} onClick={()=>sf("type")(t)} style={{padding:"7px 13px",borderRadius:20,border:`1.5px solid ${act?(VEN_C[t]||C.acc):C.bdr}`,background:act?(VEN_C[t]||C.acc):"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:C.fn,display:"flex",alignItems:"center",gap:4}}>{VEN_IC[t]} {t}</button>;})}
            </div>
          </Field>
          <G/>
          <div style={{display:"flex",gap:10}}>
            <Btn ch="취소" v="w" full st={{flex:1}} onClick={()=>setSheet(false)}/>
            <Btn ch="저장" full st={{flex:2}} onClick={save}/>
          </div>
        </Sheet>
      )}
    </div>
  );
}

// ── 환경설정 ──────────────────────────────────────────────────
function SettingsPage({user,setUser,vendors,factories,setFactories,onLogout,onNav}) {
  const [facSheet,setFacSheet] = useState(null);
  const [profileSheet,setProfileSheet] = useState(false);
  const [pf,setPf] = useState({name:user.name||"",company:user.company||"",tel:user.tel||""});

  async function saveProfile(){
    try{if(user?.token) await DB.updateUser(user.token,{name:pf.name,company:pf.company,tel:pf.tel});}catch{}
    if(setUser) setUser(u=>({...u,...pf}));
    setProfileSheet(false);
    alert("저장되었습니다!");
  }
  async function saveFac(){
    if(!facSheet.name) return;
    const {id,...data}=facSheet;
    try{
      if(id){
        if(user?.token) await DB.update(user.token,"factories",id,{...data,biz_type:data.bizType});
        setFactories(ff=>ff.map(x=>x.id===id?{...x,...data}:x));
      } else {
        if(user?.token){const r=await DB.insert(user.token,"factories",{name:data.name,biz_type:data.bizType,address:data.address,tel:data.tel,account:data.account,user_id:user.id});setFactories(ff=>[...ff,Array.isArray(r)?{...r[0],bizType:r[0].biz_type}:{...data,id:uid()}]);}
        else setFactories(ff=>[...ff,{...data,id:uid()}]);
      }
    } catch{setFactories(id?ff=>ff.map(x=>x.id===id?{...x,...data}:x):ff=>[...ff,{...data,id:uid()}]);}
    setFacSheet(null);
  }
  async function delFac(id){
    if(!window.confirm("삭제?")) return;
    if(user?.token) try{await DB.delete(user.token,"factories",id);}catch{}
    setFactories(ff=>ff.filter(x=>x.id!==id));
  }

  return (
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:18}}>환경설정</div>

      {/* 프로필 */}
      <Card st={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:22,background:C.acc+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👤</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:14}}>{user.name||"이름 없음"}</div>
            <div style={{color:C.sub,fontSize:12,marginTop:2}}>{user.email}</div>
            {user.company&&<div style={{color:C.sub,fontSize:11}}>{user.company}</div>}
          </div>
          <Btn ch="수정" v="w" sz="s" st={{padding:"5px 11px",fontSize:12}} onClick={()=>setProfileSheet(true)}/>
        </div>
        <Divider/>
        <Btn ch="로그아웃" v="w" full st={{color:C.red}} onClick={onLogout}/>
      </Card>

      {/* 공장 관리 */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:14}}>🏭 공장 관리</div>
          <Btn ch="+ 추가" sz="s" st={{padding:"5px 11px",fontSize:12}} onClick={()=>setFacSheet({id:null,name:"",bizType:"",address:"",tel:"",account:""})}/>
        </div>
        {factories.length===0
          ?<div style={{textAlign:"center",padding:"12px 0",color:C.sub,fontSize:12}}>등록된 공장이 없습니다</div>
          :factories.map(fc=>(
            <div key={fc.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.bdr}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                    <span style={{fontWeight:700,fontSize:13}}>{fc.name}</span>
                    {(fc.bizType||fc.biz_type)&&<Tag ch={fc.bizType||fc.biz_type} c={C.acc}/>}
                  </div>
                  {fc.address&&<div style={{color:C.sub,fontSize:11,marginBottom:1}}>📍 {fc.address}</div>}
                  <div style={{color:C.sub,fontSize:11}}>{fc.tel||"연락처 없음"}</div>
                  {fc.account&&<div style={{color:C.sub,fontSize:10,marginTop:2}}>🏦 {fc.account}</div>}
                </div>
                <div style={{display:"flex",gap:5,flexShrink:0,marginLeft:8}}>
                  <Btn ch="수정" v="w" sz="s" st={{padding:"4px 10px",fontSize:11}} onClick={()=>setFacSheet({...fc,bizType:fc.bizType||fc.biz_type||""})}/>
                  <Btn ch="삭제" v="w" sz="s" st={{padding:"4px 10px",fontSize:11,color:C.red}} onClick={()=>delFac(fc.id)}/>
                </div>
              </div>
            </div>
          ))
        }
      </Card>

      {/* 공장 시트 */}
      {facSheet!==null&&(
        <Sheet title={facSheet.id?"공장 수정":"공장 추가"} onClose={()=>setFacSheet(null)}>
          <Field label="공장명" req><TxtInp val={facSheet.name||""} onChange={v=>setFacSheet(p=>({...p,name:v}))} ph="예: OO봉제"/></Field>
          <Field label="업종">
            <DropSel val={facSheet.bizType||""} onChange={v=>setFacSheet(p=>({...p,bizType:v}))} ph="업종 선택">
              {BIZ_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </DropSel>
          </Field>
          <Field label="주소"><TxtInp val={facSheet.address||""} onChange={v=>setFacSheet(p=>({...p,address:v}))} ph="서울시 중구 OO동"/></Field>
          <Field label="연락처"><TxtInp val={facSheet.tel||""} onChange={v=>setFacSheet(p=>({...p,tel:v}))} ph="02-0000-0000" type="tel"/></Field>
          <Field label="계좌번호"><TxtInp val={facSheet.account||""} onChange={v=>setFacSheet(p=>({...p,account:v}))} ph="은행명 계좌번호 예금주"/></Field>
          <G/>
          <div style={{display:"flex",gap:10}}>
            <Btn ch="취소" v="w" full st={{flex:1}} onClick={()=>setFacSheet(null)}/>
            <Btn ch="저장" full st={{flex:2}} onClick={saveFac}/>
          </div>
        </Sheet>
      )}

      {/* 프로필 수정 시트 */}
      {profileSheet&&(
        <Sheet title="프로필 수정" onClose={()=>setProfileSheet(false)}>
          <Field label="이름" req><TxtInp val={pf.name} onChange={v=>setPf(p=>({...p,name:v}))} ph="이름"/></Field>
          <Field label="업체명"><TxtInp val={pf.company} onChange={v=>setPf(p=>({...p,company:v}))} ph="업체명"/></Field>
          <Field label="연락처"><TxtInp val={pf.tel} onChange={v=>setPf(p=>({...p,tel:v}))} ph="010-0000-0000" type="tel"/></Field>
          <G/>
          <div style={{display:"flex",gap:10}}>
            <Btn ch="취소" v="w" full st={{flex:1}} onClick={()=>setProfileSheet(false)}/>
            <Btn ch="저장" full st={{flex:2}} onClick={saveProfile}/>
          </div>
        </Sheet>
      )}
    </div>
  );
}

// ── 앱 루트 ───────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen] = useState("loading");
  const [user,setUser] = useState(null);
  const [page,setPage] = useState("dash");
  const [vendors,setVendors] = useState([]);
  const [factories,setFactories] = useState([]);
  const [products,setProducts] = useState([]);
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(false);

  // 자동 로그인 - 저장된 토큰 복원
  useEffect(()=>{
    try{
      const saved = localStorage.getItem("dworks_session");
      if(saved){
        const u = JSON.parse(saved);
        if(u?.token){
          setUser(u);
          setScreen("app");
          loadData(u.token);
          return;
        }
      }
    }catch{}
    setScreen("splash");
  },[]);

  async function loadData(token) {
    setLoading(true);
    try {
      const [v,f,p,o] = await Promise.all([
        DB.list(token,"vendors"),
        DB.list(token,"factories"),
        DB.list(token,"products"),
        DB.list(token,"orders"),
      ]);
      setVendors(Array.isArray(v)?v:[]);
      setFactories(Array.isArray(f)?f.map(x=>({...x,bizType:x.biz_type||x.bizType||""})):[]);
      setProducts(Array.isArray(p)?p.map(x=>({...x,factoryId:x.factory_id||x.factoryId||"",factoryTel:x.factory_tel||x.factoryTel||"",colors:x.colors||[],bom:x.bom||[]})):[]);
      setOrders(Array.isArray(o)?o:[]);
    } catch(e){console.error("loadData:",e);}
    finally{setLoading(false);}
  }

  async function handleLogin(u) {
    try{ localStorage.setItem("dworks_session", JSON.stringify(u)); }catch{}
    setUser(u);
    setScreen("app");
    await loadData(u.token);
  }

  async function handleLogout() {
    if(user?.token) try{await DB.signOut(user.token);}catch{}
    try{ localStorage.removeItem("dworks_session"); }catch{}
    setUser(null);setScreen("auth");
    setVendors([]);setFactories([]);setProducts([]);setOrders([]);
  }

  const tabs = [
    {k:"order",i:"📝",l:"발주하기"},
    {k:"prods",i:"👕",l:"상품"},
    {k:"list",i:"📋",l:"발주리스트"},
    {k:"vendors",i:"🏭",l:"거래처"},
    {k:"settings",i:"⚙️",l:"설정"},
  ];

  if(screen==="loading") return (
    <PhoneMockup>
      <div style={{minHeight:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",fontFamily:C.fn}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:28,fontWeight:900,color:C.acc,letterSpacing:1,marginBottom:12}}>D-Works</div>
          <div style={{width:32,height:32,border:`3px solid ${C.bdr}`,borderTop:`3px solid ${C.acc}`,borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto"}}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    </PhoneMockup>
  );
  if(screen==="splash") return <PhoneMockup><SplashPage onStart={()=>setScreen("auth")}/></PhoneMockup>;
  if(screen!=="app"||!user) return <PhoneMockup><AuthPage onLogin={handleLogin}/></PhoneMockup>;

  if(loading) return (
    <PhoneMockup>
      <div style={{minHeight:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#fff",fontFamily:C.fn,padding:40}}>
        <div style={{fontSize:30,fontWeight:900,color:C.acc,marginBottom:14}}>D-Works</div>
        <div style={{color:C.sub,fontSize:13,marginBottom:20}}>데이터 불러오는 중...</div>
        <div style={{width:36,height:36,border:`3px solid ${C.bdr}`,borderTop:`3px solid ${C.acc}`,borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </PhoneMockup>
  );

  const pages = {
    dash:     <DashPage orders={orders} products={products} onNav={setPage}/>,
    order:    <OrderPage products={products} orders={orders} setOrders={setOrders} vendors={vendors} user={user}/>,
    prods:    <ProdsPage products={products} setProducts={setProducts} vendors={vendors} factories={factories} user={user}/>,
    list:     <ListPage orders={orders} setOrders={setOrders} products={products} user={user}/>,
    vendors:  <VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,
    settings: <SettingsPage user={user} setUser={setUser} vendors={vendors} factories={factories} setFactories={setFactories} onLogout={handleLogout} onNav={setPage}/>,
  };

  return (
    <PhoneMockup>
      <div style={{minHeight:"100%",background:C.bg,fontFamily:C.fn,color:C.txt,display:"flex",flexDirection:"column",position:"relative"}}>
        <div style={{background:"#fff",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${C.bdr}`,flexShrink:0}}>
          <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:19,cursor:"pointer",fontFamily:C.fn,letterSpacing:1}}>D-Works</button>
          <span style={{color:C.sub,fontSize:12}}>{user.name}</span>
        </div>
        <div style={{flex:1}}>{pages[page]||pages["dash"]}</div>
        <div style={{background:"#fff",borderTop:`1px solid ${C.bdr}`,display:"flex",flexShrink:0,zIndex:50}}>
          {tabs.map(t=>(
            <button key={t.k} onClick={()=>setPage(t.k)} style={{flex:1,padding:"9px 4px 9px",background:"none",border:"none",color:page===t.k?C.acc:C.sub,cursor:"pointer",fontFamily:C.fn,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <div style={{width:28,height:28,borderRadius:9,background:page===t.k?C.acc+"15":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:16}}>{t.i}</span>
              </div>
              <span style={{fontSize:9,fontWeight:page===t.k?700:500}}>{t.l}</span>
            </button>
          ))}
        </div>
      </div>
    </PhoneMockup>
  );
}
