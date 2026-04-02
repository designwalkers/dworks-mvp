import React, { useState, useEffect } from "react";

// ── Supabase ──────────────────────────────────────────────────
const SB = "https://qimgostiseehdnvhmoph.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";
function ah(t){return{"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"};}

// [수리 1] 서버에서 에러가 나면 숨기지 않고 에러를 던지도록 수정
async function api(m,p,t,b){
  const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined});
  const j=await r.json();
  if(!r.ok) throw new Error(j.message || j.error_description || "API 오류");
  return j;
}

const DB={
  signUp:(e,pw,meta)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:meta}),
  signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),
  signOut:(t)=>fetch(`${SB}/auth/v1/logout`,{method:"POST",headers:ah(t)}),
  updateUser:(t,meta)=>api("PUT","/auth/v1/user",t,{data:meta}),
  // [수리 2] select=* 를 추가해 데이터를 확실히 가져오도록 보장
  list:(t,tbl)=>api("GET",`/rest/v1/${tbl}?select=*&order=created_at.asc`,t),
  insert:(t,tbl,d)=>api("POST",`/rest/v1/${tbl}`,t,d),
  update:(t,tbl,id,d)=>api("PATCH",`/rest/v1/${tbl}?id=eq.${id}`,t,d),
  del:(t,tbl,id)=>fetch(`${SB}/rest/v1/${tbl}?id=eq.${id}`,{method:"DELETE",headers:ah(t)}),
};

// ── EmailJS ───────────────────────────────────────────────────
const EJS={SID:"service_raca1ke",TID:"template_hoej0ts",PK:"KlYRj7B6JNO01D2pm"};
async function sendEmail(toEmail,toName,subject,message){
  if(!toEmail)return false;
  try{const r=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:EJS.SID,template_id:EJS.TID,user_id:EJS.PK,template_params:{to_email:toEmail,to_name:toName,subject,message,from_name:"D-Works"}})});return r.status===200;}catch{return false;}
}

// ── 상수 ──────────────────────────────────────────────────────
const C={bg:"#F8F9FB",card:"#FFFFFF",bdr:"#E8ECF2",acc:"#3772FF",txt:"#111827",sub:"#9CA3AF",sub2:"#6B7280",ok:"#10B981",warn:"#F59E0B",red:"#EF4444",fn:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif"};
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const CATS=["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const CAT_C={이너:"#3772FF",아우터:"#8B5CF6",팬츠:"#10B981",니트:"#F59E0B",원피스:"#EC4899",스커트:"#06B6D4",기타:"#9CA3AF"};
const VEN_TYPES=["원단","안감","단추","지퍼","심지","기타"];
const VEN_IC={원단:"🧶",안감:"📋",단추:"🔘",지퍼:"🤐",심지:"🪡",기타:"🏭"};
const VEN_C={원단:"#3772FF",안감:"#10B981",단추:"#F59E0B",지퍼:"#8B5CF6",심지:"#06B6D4",기타:"#9CA3AF"};
const SEASONS=["26SS","26FW","25SS","25FW"];
const MAT_TYPES=["메인원단","부속원단","단추","지퍼","안감","심지","기타"];
const BIZ_TYPES=["다이마루","직기","니트","데님","기타"];

// ── 공통 UI ───────────────────────────────────────────────────
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",ok:C.ok,d:C.bg}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,ok:"#fff",d:C.sub}[v]||"#fff";
  const bd=v==="w"?`1.5px solid ${C.bdr}`:"none";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#EDF0F5":bg,color:disabled?"#B0B8C4":cl,border:disabled?`1.5px solid ${C.bdr}`:bd,borderRadius:10,padding:sz==="s"?"7px 14px":"12px 0",fontSize:sz==="s"?12:14,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:C.fn,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,width:full?"100%":"auto",boxSizing:"border-box",lineHeight:1.4,...st}}>{ch}</button>;
};
function FCard({children,mb=12}){return<div style={{background:"#fff",borderRadius:14,border:`1px solid ${C.bdr}`,overflow:"hidden",marginBottom:mb,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>{children}</div>;}
function FRow({label,children,last,req}){return<div style={{display:"flex",alignItems:"center",minHeight:50,padding:"0 14px",borderBottom:last?"none":`1px solid ${C.bdr}`}}><div style={{width:80,fontSize:13,fontWeight:600,color:C.txt,flexShrink:0}}>{label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}</div><div style={{flex:1,display:"flex",alignItems:"center",minWidth:0}}>{children}</div></div>;}
const FInp=({val,onChange,ph,type="text"})=><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:C.txt,fontFamily:C.fn,padding:"0",minWidth:0,textAlign:"right"}}/>;
const FSel=({val,onChange,children,ph})=><select value={val||""} onChange={e=>onChange(e.target.value)} style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:val?C.txt:C.sub,fontFamily:C.fn,textAlign:"right",WebkitAppearance:"none",cursor:"pointer"}}>{ph&&<option value="">{ph}</option>}{children}</select>;
const Tag=({ch,c=C.acc})=><span style={{background:c+"18",color:c,padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{ch}</span>;
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:"#fff",borderRadius:12,border:`1px solid ${C.bdr}`,padding:16,boxSizing:"border-box",...st}}>{children}</div>;
const Divider=()=><div style={{height:1,background:C.bdr,margin:"12px 0"}}/>;
const G=({h=12})=><div style={{height:h}}/>;
const Empty=({icon,text})=><div style={{textAlign:"center",padding:"40px 20px",color:C.sub}}><div style={{fontSize:36,marginBottom:10}}>{icon}</div><div style={{fontSize:14,fontWeight:600,color:C.sub2}}>{text}</div></div>;
function Field({label,children,req}){return<div style={{marginBottom:16}}><div style={{fontSize:13,fontWeight:600,color:C.txt,marginBottom:8}}>{label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}</div>{children}</div>;}
function TxtInp({val,onChange,ph,type="text",onKeyDown}){return<div style={{display:"flex",alignItems:"center",border:`1px solid ${C.bdr}`,borderRadius:8,background:"#fff"}}><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} onKeyDown={onKeyDown} style={{flex:1,border:"none",outline:"none",padding:"12px 14px",fontSize:13,color:C.txt,fontFamily:C.fn,background:"transparent"}}/></div>;}
function DropSel({val,onChange,children,ph}){return<div style={{position:"relative",border:`1px solid ${C.bdr}`,borderRadius:8,background:"#fff"}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",padding:"12px 14px",fontSize:13,color:val?C.txt:C.sub,fontFamily:C.fn,background:"transparent",WebkitAppearance:"none",cursor:"pointer"}}>{ph&&<option value="">{ph}</option>}{children}</select><span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:C.sub,pointerEvents:"none",fontSize:11}}>∨</span></div>;}
function StepBar({cur,total=4}){return<div style={{display:"flex",gap:6,marginBottom:20}}>{Array.from({length:total},(_,i)=><div key={i} style={{flex:i===cur?2:1,height:4,borderRadius:2,background:i<=cur?C.acc:C.bdr,transition:"all 0.3s"}}/>)}</div>;}

// Sheet - position:fixed, viewport 기준 (모바일에서 완벽 동작)
function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"0 20px 40px",width:"100%",maxHeight:"85vh",overflowY:"auto",boxSizing:"border-box",fontFamily:C.fn,maxWidth:480,margin:"0 auto"}}>
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

function LineChart({data}){
  if(!data||data.length<2)return<div style={{height:70,display:"flex",alignItems:"center",justifyContent:"center",color:C.sub,fontSize:12}}>데이터 없음</div>;
  const W=300,H=70,p=10,vs=data.map(d=>d.v),mn=Math.min(...vs),mx=Math.max(...vs),rng=mx-mn||1;
  const pts=data.map((d,i)=>[(p+(i/(data.length-1))*(W-p*2)),(H-p-((d.v-mn)/rng)*(H-p*2))]);
  const area=`M ${pts[0][0]},${H-p} ${pts.map(([x,y])=>`L ${x},${y}`).join(" ")} L ${pts[pts.length-1][0]},${H-p} Z`;
  return<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}><path d={area} fill={C.acc+"18"}/><polyline points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke={C.acc} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>{pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" fill={C.acc}/>)}</svg>;
}

// ── 페이지들 ──────────────────────────────────────────────────
function SplashPage({onStart}){
  const [slide,setSlide]=useState(0);
  const slides=[{title:"발주 업무,\n이제 자동으로",desc:"수기 계산·카카오톡 개별 발주\n이제 그만!",icon:"📋"},{title:"BOM 기반\n소요량 자동 계산",desc:"상품별 원부자재를 등록하면\n소요량이 자동 계산됩니다.",icon:"🧮"},{title:"거래처별\n원클릭 발송",desc:"업체별 발주서를 자동 생성하고\n이메일로 즉시 발송합니다.",icon:"📧"},{title:"발주 이력\n데이터화",desc:"모든 발주가 DB에 저장되어\n언제든 조회 가능합니다.",icon:"📊"}];
  return(
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",flexDirection:"column",fontFamily:C.fn}}>
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
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>{slides.map((_,i)=><div key={i} onClick={()=>setSlide(i)} style={{width:i===slide?24:8,height:8,borderRadius:4,background:i===slide?C.acc:C.bdr,cursor:"pointer",transition:"all 0.3s"}}/>)}</div>
        {slide<slides.length-1?<Btn ch="다음 →" full sz="l" onClick={()=>setSlide(s=>s+1)} st={{borderRadius:12,height:50}}/>:<Btn ch="시작하기 →" full sz="l" onClick={onStart} st={{borderRadius:12,height:50}}/>}
      </div>
    </div>
  );
}

function AuthPage({onLogin}){
  const [tab,setTab]=useState("in");
  const [f,setF]=useState({name:"",company:"",email:"",pw:"",pw2:"",tel:""});
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  async function submit(){
    setErr("");
    if(!f.email||!f.pw){setErr("이메일과 비밀번호를 입력하세요");return;}
    if(tab==="up"&&!f.name){setErr("이름을 입력하세요");return;}
    if(tab==="up"&&f.pw!==f.pw2){setErr("비밀번호가 일치하지 않습니다");return;}
    if(tab==="up"&&f.pw.length<6){setErr("비밀번호 6자 이상");return;}
    setLoading(true);
    try{
      if(tab==="up"){
        const r=await DB.signUp(f.email,f.pw,{name:f.name,company:f.company,tel:f.tel});
        if(r.error){setErr(r.error.message.includes("already")?"이미 가입된 이메일":r.error.message);return;}
        const r2=await DB.signIn(f.email,f.pw);
        if(!r2.access_token){setErr("가입완료! 로그인해주세요");setTab("in");return;}
        onLogin({token:r2.access_token,id:r2.user.id,name:f.name,company:f.company,email:f.email,tel:f.tel});
      }else{
        const r=await DB.signIn(f.email,f.pw);
        if(!r.access_token){const msg=r.error?.message||"";setErr(msg.includes("Invalid")||msg.includes("invalid")?"이메일 또는 비밀번호가 틀렸습니다":msg||"로그인 실패");return;}
        const meta=r.user?.user_metadata||{};
        onLogin({token:r.access_token,id:r.user.id,name:meta.name||f.email.split("@")[0],company:meta.company||"",email:r.user.email,tel:meta.tel||""});
      }
    }catch(e){setErr("네트워크 오류");}
    finally{setLoading(false);}
  }
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn}}>
      <div style={{background:"#fff",padding:"44px 20px 20px",borderBottom:`1px solid ${C.bdr}`}}>
        <div style={{fontSize:30,fontWeight:900,color:C.acc,letterSpacing:1}}>D-Works</div>
        <div style={{fontSize:13,color:C.sub,marginTop:4}}>의류 생산 발주 자동화 서비스</div>
      </div>
      <div style={{padding:"20px 20px 40px",maxWidth:480,margin:"0 auto"}}>
        <div style={{display:"flex",borderBottom:`1.5px solid ${C.bdr}`,marginBottom:20}}>
          {[["in","로그인"],["up","회원가입"]].map(([k,l])=><button key={k} onClick={()=>{setTab(k);setErr("");}} style={{flex:1,padding:"11px 0",background:"none",border:"none
