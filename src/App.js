import React, { useState, useEffect } from "react";

// ── Supabase & API (기존 유지) ─────────────────────────────────
const SB="https://qimgostiseehdnvhmoph.supabase.co", KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";
const ah=t=>({"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"});
const api=async(m,p,t,b)=>{const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined});return r.json();};
const DB={signUp:(e,pw,m)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:m}),signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),signOut:t=>fetch(`${SB}/auth/v1/logout`,{method:"POST",headers:ah(t)}),updateUser:(t,m)=>api("PUT","/auth/v1/user",t,{data:m}),list:(t,tb)=>api("GET",`/rest/v1/${tb}?order=created_at.asc`,t),insert:(t,tb,d)=>api("POST",`/rest/v1/${tb}`,t,d),update:(t,tb,id,d)=>api("PATCH",`/rest/v1/${tb}?id=eq.${id}`,t,d),del:(t,tb,id)=>fetch(`${SB}/rest/v1/${tb}?id=eq.${id}`,{method:"DELETE",headers:ah(t)})};
const EJS={SID:"service_raca1ke",TID:"template_hoej0ts",PK:"KlYRj7B6JNO01D2pm"};
const sendEmail=async(to,name,sub,msg)=>{if(!to)return false;try{const r=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:EJS.SID,template_id:EJS.TID,user_id:EJS.PK,template_params:{to_email:to,to_name:name,subject:sub,message:msg,from_name:"D-Works"}})});return r.status===200;}catch{return false;}};

// ── 유틸 및 상수 (기존 유지) ────────────────────────────────────────────
const CHO=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const getCho=s=>(s||"").split("").map(c=>{const cd=c.charCodeAt(0);return(cd>=44032&&cd<=55203)?CHO[Math.floor((cd-44032)/588)]:c;}).join("");
const match=(t,q)=>{if(!q)return true;const txt=(t||"").toLowerCase(),qry=(q||"").toLowerCase();return txt.includes(qry)||getCho(txt).includes(getCho(qry));};
const C={
  bg:"#F4F7FB",
  bg2:"#ECF2FB",
  card:"#FFFFFF",
  card2:"#F8FBFF",
  bdr:"#E3EAF3",
  bdr2:"#D3DDEB",
  acc:"#356DFF",
  acc2:"#7EA4FF",
  txt:"#0F172A",
  sub:"#94A3B8",
  sub2:"#475569",
  ok:"#12B981",
  warn:"#F59E0B",
  red:"#EF4444",
  ink:"#111827",
  shadow:"0 18px 44px rgba(15,23,42,0.08)",
  shadowSm:"0 10px 24px rgba(15,23,42,0.05)",
  ring:"0 0 0 4px rgba(53,109,255,0.08)",
  fn:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif"
};
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const CATS=["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const CAT_C={이너:"#3772FF",아우터:"#8B5CF6",팬츠:"#10B981",니트:"#F59E0B",원피스:"#EC4899",스커트:"#06B6D4",기타:"#94A3B8"};
const VEN_TYPES=["원단","안감","단추","지퍼","심지","기타"];
const VEN_IC={원단:"🧶",안감:"📋",단추:"🔘",지퍼:"🤐",심지:"🪡",기타:"🏭"};
const VEN_C={원단:"#3772FF",안감:"#10B981",단추:"#F59E0B",지퍼:"#8B5CF6",심지:"#06B6D4",기타:"#94A3B8"};
const SEASONS=["26SS","26FW","25SS","25FW"];
const MAT_TYPES=["메인원단","부속원단","단추","지퍼","안감","심지","기타"];
const BIZ_TYPES=["다이마루","직기","니트","데님","기타"];
const PAGE_PAD={padding:"20px 18px 116px"};
const GLASS_BG="linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,251,255,0.92))";

// ── 공통 UI (디자인 업그레이드) ──
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const sizeMap={
    s:{padding:"9px 14px",fontSize:12,borderRadius:14,minHeight:36},
    m:{padding:"13px 16px",fontSize:14,borderRadius:16,minHeight:46},
    l:{padding:"15px 18px",fontSize:15,borderRadius:18,minHeight:52}
  };
  const tone={
    p:{bg:`linear-gradient(135deg, ${C.acc}, #5A8EFF)`,cl:"#fff",bd:"none",shadow:"0 14px 30px rgba(53,109,255,0.22)"},
    w:{bg:"#fff",cl:C.txt,bd:`1px solid ${C.bdr}`,shadow:C.shadowSm},
    ok:{bg:`linear-gradient(135deg, ${C.ok}, #31C48D)`,cl:"#fff",bd:"none",shadow:"0 14px 30px rgba(18,185,129,0.20)"},
    d:{bg:C.card2,cl:C.sub2,bd:`1px solid ${C.bdr}`,shadow:"none"}
  }[v]||{bg:C.acc,cl:"#fff",bd:"none",shadow:"0 14px 30px rgba(53,109,255,0.22)"};
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background:disabled?"#EEF3F9":tone.bg,
        color:disabled?"#AAB5C4":tone.cl,
        border:disabled?`1px solid ${C.bdr}`:tone.bd,
        borderRadius:sizeMap[sz]?.borderRadius||16,
        padding:sizeMap[sz]?.padding||"13px 16px",
        minHeight:sizeMap[sz]?.minHeight||46,
        fontSize:sizeMap[sz]?.fontSize||14,
        fontWeight:800,
        cursor:disabled?"default":"pointer",
        fontFamily:C.fn,
        display:"inline-flex",
        alignItems:"center",
        justifyContent:"center",
        gap:6,
        width:full?"100%":"auto",
        boxSizing:"border-box",
        lineHeight:1.2,
        transition:"all .18s ease",
        boxShadow:disabled?"none":tone.shadow,
        ...st
      }}
    >
      {ch}
    </button>
  );
};

function FCard({children,mb=14}){
  return <div style={{background:GLASS_BG,borderRadius:22,border:`1px solid ${C.bdr}`,marginBottom:mb,boxShadow:C.shadowSm,overflow:"hidden",backdropFilter:"blur(10px)"}}>{children}</div>;
}
function FRow({label,children,last,req}){
  return (
    <div style={{display:"flex",alignItems:"center",minHeight:58,padding:"0 16px",borderBottom:last?"none":`1px solid ${C.bdr}`,position:"relative",gap:12}}>
      <div style={{width:88,fontSize:12,fontWeight:800,color:C.sub2,flexShrink:0,letterSpacing:"-0.01em"}}>{label}{req&&<span style={{color:C.acc,marginLeft:3}}>*</span>}</div>
      <div style={{flex:1,display:"flex",alignItems:"center",minWidth:0}}>{children}</div>
    </div>
  );
}
const FInp=({val,onChange,ph,type="text"})=><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,color:C.txt,fontFamily:C.fn,padding:"0",minWidth:0,textAlign:"right"}}/>;
const FSel=({val,onChange,children,ph})=><select value={val||""} onChange={e=>onChange(e.target.value)} style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,color:val?C.txt:C.sub,fontFamily:C.fn,textAlign:"right",WebkitAppearance:"none",cursor:"pointer"}}>{ph&&<option value="">{ph}</option>}{children}</select>;
const Tag=({ch,c=C.acc})=><span style={{background:c+"14",color:c,padding:"5px 10px",borderRadius:999,border:`1px solid ${c}22`,fontSize:11,fontWeight:800,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",lineHeight:1.1}}>{ch}</span>;
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:GLASS_BG,borderRadius:24,border:`1px solid ${C.bdr}`,padding:16,boxSizing:"border-box",boxShadow:C.shadow,backdropFilter:"blur(12px)",...st}}>{children}</div>;
const Divider=()=><div style={{height:1,background:C.bdr,margin:"14px 0"}}/>;
const G=({h=12})=><div style={{height:h}}/>;
const Empty=({icon,text})=><div style={{textAlign:"center",padding:"48px 20px",color:C.sub}}><div style={{fontSize:42,marginBottom:12}}>{icon}</div><div style={{fontSize:15,fontWeight:800,color:C.sub2,marginBottom:6}}>{text}</div><div style={{fontSize:12,color:C.sub}}>조건을 바꾸거나 새 항목을 추가해보세요.</div></div>;
function Field({label,children,req}){
  return <div style={{marginBottom:16}}><div style={{fontSize:12,fontWeight:800,color:C.sub2,marginBottom:8,letterSpacing:"-0.01em"}}>{label}{req&&<span style={{color:C.acc,marginLeft:3}}>*</span>}</div>{children}</div>;
}
function TxtInp({val,onChange,ph,type="text",onKeyDown}){
  return (
    <div style={{display:"flex",alignItems:"center",border:`1px solid ${C.bdr}`,borderRadius:18,background:C.card2,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.8)"}}>
      <input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} onKeyDown={onKeyDown} style={{flex:1,border:"none",outline:"none",padding:"14px 16px",fontSize:14,color:C.txt,fontFamily:C.fn,background:"transparent"}}/>
    </div>
  );
}
function DropSel({val,onChange,children,ph}){
  return (
    <div style={{position:"relative",border:`1px solid ${C.bdr}`,borderRadius:18,background:C.card2,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.8)"}}>
      <select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",padding:"14px 16px",fontSize:14,color:val?C.txt:C.sub,fontFamily:C.fn,background:"transparent",WebkitAppearance:"none",cursor:"pointer"}}>
        {ph&&<option value="">{ph}</option>}
        {children}
      </select>
      <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:C.sub,pointerEvents:"none",fontSize:11}}>▼</span>
    </div>
  );
}
function StepBar({cur,total=4}){
  return <div style={{display:"flex",gap:7,marginBottom:22}}>{Array.from({length:total},(_,i)=><div key={i} style={{flex:i===cur?1.5:1,height:6,borderRadius:999,background:i<=cur?`linear-gradient(90deg, ${C.acc}, #7EA4FF)`:"#DFE7F2",transition:"all 0.28s"}}/>)}</div>;
}

function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(15,23,42,0.42)",backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-end",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)",borderRadius:"26px 26px 0 0",padding:"0 20px 42px",width:"100%",maxHeight:"88vh",overflowY:"auto",boxSizing:"border-box",fontFamily:C.fn,maxWidth:560,margin:"0 auto",border:`1px solid ${C.bdr}`,boxShadow:"0 -18px 48px rgba(15,23,42,0.16)"}}>
        <div style={{width:42,height:5,background:"#D9E2EF",borderRadius:999,margin:"12px auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <span style={{fontWeight:900,fontSize:18,color:C.txt,letterSpacing:"-0.02em"}}>{title}</span>
          <button onClick={onClose} style={{background:C.card2,border:`1px solid ${C.bdr}`,color:C.sub2,cursor:"pointer",width:34,height:34,borderRadius:12,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.fn}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function LineChart({data}){
  if(!data||data.length<2)return<div style={{height:86,display:"flex",alignItems:"center",justifyContent:"center",color:C.sub,fontSize:12}}>데이터 없음</div>;
  const W=320,H=86,p=10,vs=data.map(d=>d.v),mn=Math.min(...vs),mx=Math.max(...vs),rng=mx-mn||1;
  const pts=data.map((d,i)=>[(p+(i/(data.length-1))*(W-p*2)),(H-p-((d.v-mn)/rng)*(H-p*2))]);
  const area=`M ${pts[0][0]},${H-p} ${pts.map(([x,y])=>`L ${x},${y}`).join(" ")} L ${pts[pts.length-1][0]},${H-p} Z`;
  return <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}><defs><linearGradient id="dwFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#5A8EFF" stopOpacity="0.30"/><stop offset="100%" stopColor="#5A8EFF" stopOpacity="0.03"/></linearGradient><linearGradient id="dwLine" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#356DFF"/><stop offset="100%" stopColor="#7EA4FF"/></linearGradient></defs><path d={area} fill="url(#dwFill)"/><polyline points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke="url(#dwLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>{pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3.5" fill="#356DFF" stroke="#fff" strokeWidth="2"/>)}</svg>;
}

function PageTitle({title,sub,right,center=false}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:center?"center":"flex-start",gap:12,marginBottom:16}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:24,fontWeight:900,color:C.txt,letterSpacing:"-0.03em",textAlign:center?"center":"left"}}>{title}</div>
        {sub&&<div style={{fontSize:12,color:C.sub2,marginTop:6,textAlign:center?"center":"left"}}>{sub}</div>}
      </div>
      {right&&<div style={{flexShrink:0}}>{right}</div>}
    </div>
  );
}
function FilterChip({label,active,onClick,color}){
  const ac=color||C.acc;
  return <button onClick={onClick} style={{padding:"9px 14px",borderRadius:999,flexShrink:0,whiteSpace:"nowrap",border:`1px solid ${active?(ac+"55"):C.bdr}`,background:active?(ac+"14"):"#fff",color:active?ac:C.sub2,fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:C.fn,boxShadow:active?"inset 0 0 0 1px rgba(255,255,255,0.45)":"none"}}>{label}</button>;
}
function StatCard({value,label,color=C.acc}){
  return (
    <Card st={{flex:1,padding:"18px 14px",marginBottom:0,background:"#fff"}}>
      <div style={{fontSize:24,fontWeight:900,color}}>{value}</div>
      <div style={{fontSize:12,color:C.sub2,fontWeight:700,marginTop:8}}>{label}</div>
    </Card>
  );
}
function AppFrame({children}){
  return <div style={{minHeight:"100vh",background:`linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 100%)`,fontFamily:C.fn}}>{children}</div>;
}

// ── Splash 및 인증 ──

function SplashPage({onStart}){
  const [slide,setSlide]=useState(0);
  const slides=[
    {title:"발주 업무,\n이제 자동으로",desc:"수기 계산, 카카오톡 개별 연락, 누락 확인까지.\n복잡한 반복 업무를 한 흐름으로 정리합니다.",icon:"📋"},
    {title:"BOM 기반\n소요량 자동 계산",desc:"상품별 원부자재를 등록하면 색상별 소요량이 자동으로 계산됩니다.",icon:"🧮"},
    {title:"거래처별\n원클릭 발송",desc:"업체별 발주서를 정리해서 이메일 발송까지 한 번에 진행합니다.",icon:"📧"},
    {title:"발주 이력\n데이터화",desc:"모든 발주 내역을 저장하고 상태를 추적해 실무 기준으로 관리합니다.",icon:"📊"}
  ];
  return(
    <AppFrame>
      <div style={{maxWidth:520,margin:"0 auto",minHeight:"100vh",display:"flex",flexDirection:"column",padding:"28px 22px 36px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{display:"flex",flexDirection:"column"}}>
            <span style={{fontSize:12,fontWeight:900,color:C.acc,letterSpacing:"0.18em"}}>D-WORKS</span>
            <span style={{fontSize:12,color:C.sub2,marginTop:6}}>의류 생산 발주 자동화 웹앱</span>
          </div>
          <button onClick={onStart} style={{background:"rgba(255,255,255,0.72)",border:`1px solid ${C.bdr}`,color:C.sub2,fontSize:12,cursor:"pointer",fontFamily:C.fn,fontWeight:700,padding:"10px 14px",borderRadius:14,boxShadow:C.shadowSm}}>건너뛰기</button>
        </div>

        <div style={{flex:1,display:"flex",alignItems:"center"}}>
          <Card st={{width:"100%",padding:"28px 24px",borderRadius:32,background:"linear-gradient(180deg, #FFFFFF 0%, #F7FAFF 100%)"}}>
            <div style={{display:"inline-flex",padding:"8px 12px",borderRadius:999,background:C.acc+"12",color:C.acc,fontSize:12,fontWeight:800,marginBottom:18}}>WEB MVP PREVIEW</div>
            <div style={{fontSize:68,marginBottom:20,textAlign:"center"}}>{slides[slide].icon}</div>
            <div style={{fontSize:30,fontWeight:900,textAlign:"center",whiteSpace:"pre-line",marginBottom:14,color:C.txt,lineHeight:1.26,letterSpacing:"-0.04em"}}>{slides[slide].title}</div>
            <div style={{fontSize:14,color:C.sub2,textAlign:"center",whiteSpace:"pre-line",lineHeight:1.75}}>{slides[slide].desc}</div>
            <div style={{marginTop:28,display:"flex",justifyContent:"center",gap:8}}>
              {slides.map((_,i)=><div key={i} onClick={()=>setSlide(i)} style={{width:i===slide?26:8,height:8,borderRadius:999,background:i===slide?C.acc:"#DCE5F1",cursor:"pointer",transition:"all .2s"}}/>)}
            </div>
          </Card>
        </div>

        {slide<slides.length-1
          ? <Btn ch="다음 →" full sz="l" onClick={()=>setSlide(s=>s+1)} st={{marginTop:22}}/>
          : <Btn ch="시작하기 →" full sz="l" onClick={onStart} st={{marginTop:22}}/>}
      </div>
    </AppFrame>
  );
}


function AuthPage({onLogin}){
  const [tab,setTab]=useState("in");
  const [f,setF]=useState({company:"",brand:"",name:"",position:"",tel:"",email:"",pw:"",pw2:"",address:"",agree:false, keepLoggedIn:true});
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const sf=k=>v=>setF(p=>({...p,[k]:v}));

  async function submit(){
    setErr("");
    if(!f.email||!f.pw){setErr("이메일과 비밀번호를 입력하세요");return;}
    if(tab==="up"){
      if(!f.company||!f.name||!f.position||!f.tel){setErr("필수 항목을 입력하세요");return;}
      if(f.pw!==f.pw2){setErr("비밀번호가 일치하지 않습니다");return;}
      if(f.pw.length<6){setErr("비밀번호 6자 이상");return;}
      if(!f.agree){setErr("개인정보 수집 및 이용에 동의해주세요");return;}
    }

    setLoading(true);
    try{
      if(tab==="up"){
        const r=await DB.signUp(f.email,f.pw,{company:f.company,brand:f.brand,name:f.name,position:f.position,tel:f.tel,address:f.address});
        if(r.error){setErr(r.error.message.includes("already")?"이미 가입된 이메일":r.error.message);return;}
        const r2=await DB.signIn(f.email,f.pw);
        if(!r2.access_token){setErr("가입완료! 로그인해주세요");setTab("in");return;}
        onLogin({token:r2.access_token,id:r2.user.id,...f}, f.keepLoggedIn);
      }else{
        const r=await DB.signIn(f.email,f.pw);
        if(!r.access_token){setErr("이메일 또는 비밀번호 오류");return;}
        const meta=r.user?.user_metadata||{};
        onLogin({token:r.access_token,id:r.user.id,name:meta.name||f.email.split("@")[0],company:meta.company||"",email:r.user.email,tel:meta.tel||"",brand:meta.brand||"",position:meta.position||"",address:meta.address||""}, f.keepLoggedIn);
      }
    }catch(e){setErr("네트워크 오류");}
    finally{setLoading(false);}
  }

  return(
    <AppFrame>
      <div style={{maxWidth:560,margin:"0 auto",minHeight:"100vh",padding:"28px 18px 44px"}}>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:12,fontWeight:900,color:C.acc,letterSpacing:"0.18em",marginBottom:10}}>D-WORKS</div>
          <div style={{fontSize:32,fontWeight:900,color:C.txt,letterSpacing:"-0.05em",lineHeight:1.16}}>실무에 맞는 발주 자동화, 바로 시작합니다</div>
          <div style={{fontSize:13,color:C.sub2,marginTop:10,lineHeight:1.7}}>현재 구조는 유지하고, 데이터와 발주 흐름을 그대로 연결하는 모바일 웹 MVP입니다.</div>
        </div>

        <Card st={{padding:"24px 18px 20px",borderRadius:30}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:22,padding:6,background:C.card2,border:`1px solid ${C.bdr}`,borderRadius:20}}>
            {[["in","로그인"],["up","회원가입"]].map(([k,l])=>(
              <button key={k} onClick={()=>{setTab(k);setErr("");}} style={{padding:"12px 0",background:tab===k?`linear-gradient(135deg, ${C.acc}, #5A8EFF)`:"transparent",border:"none",borderRadius:14,color:tab===k?"#fff":C.sub2,fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:C.fn,boxShadow:tab===k?"0 10px 22px rgba(53,109,255,0.20)":"none"}}>{l}</button>
            ))}
          </div>

          {tab==="up" && (
            <>
              <Field label="업체명" req><TxtInp val={f.company} onChange={sf("company")} ph="회사명"/></Field>
              <Field label="브랜드명"><TxtInp val={f.brand} onChange={sf("brand")} ph="브랜드명 (선택)"/></Field>
              <Field label="성함" req><TxtInp val={f.name} onChange={sf("name")} ph="성함"/></Field>
              <Field label="직함" req><TxtInp val={f.position} onChange={sf("position")} ph="예: 대표"/></Field>
              <Field label="연락처" req><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field>
            </>
          )}

          <Field label="이메일" req><TxtInp val={f.email} onChange={sf("email")} ph="example@email.com" type="email"/></Field>
          <Field label="비밀번호" req><TxtInp val={f.pw} onChange={sf("pw")} ph={tab==="up"?"6자 이상":"비밀번호"} type="password" onKeyDown={e=>e.key==="Enter"&&submit()}/></Field>

          {tab==="in" && (
            <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:12,padding:"2px 2px 6px"}}>
              <input type="checkbox" checked={f.keepLoggedIn} onChange={e=>sf("keepLoggedIn")(e.target.checked)} style={{width:16,height:16}} />
              <span style={{fontSize:13,fontWeight:700,color:C.sub2}}>로그인 상태 유지</span>
            </label>
          )}

          {tab==="up" && (
            <>
              <Field label="비밀번호 확인" req><TxtInp val={f.pw2} onChange={sf("pw2")} ph="비밀번호 재입력" type="password"/></Field>
              <Field label="주소"><TxtInp val={f.address} onChange={sf("address")} ph="사무실 주소"/></Field>
              <div style={{marginTop:6,padding:16,background:C.card2,border:`1px solid ${C.bdr}`,borderRadius:20}}>
                <div style={{fontSize:12,color:C.sub2,lineHeight:1.75,maxHeight:90,overflowY:"auto",marginBottom:12}}><strong>[개인정보 수집 및 이용 안내]</strong><br/>1. 수기 계산 및 발주 업무 자동화를 위해 업체명, 성함, 연락처를 수집합니다.</div>
                <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                  <input type="checkbox" checked={f.agree} onChange={e=>sf("agree")(e.target.checked)} style={{width:16,height:16}} />
                  <span style={{fontSize:13,fontWeight:700,color:C.txt}}>내용을 확인했으며 동의합니다 (필수)</span>
                </label>
              </div>
            </>
          )}

          {err&&<div style={{color:C.red,fontSize:13,fontWeight:700,marginTop:16,marginBottom:4}}>{err}</div>}
          <Btn ch={loading?(tab==="in"?"로그인 중...":"가입 중..."):(tab==="in"?"로그인":"가입하기")} onClick={submit} full sz="l" disabled={loading} st={{marginTop:20}}/>
        </Card>
      </div>
    </AppFrame>
  );
}


function DashPage({orders,products,onNav}){
  const td=today();
  const tO=orders.filter(o=>o.date===td);
  const mQ=orders.filter(o=>o.date?.slice(0,7)===td.slice(0,7)).reduce((s,o)=>s+(o.items||[]).reduce((ss,i)=>ss+(i.qty||0),0),0);
  const delayed=orders.filter(o=>o.status==="지연");
  const chart=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const ds=d.toISOString().slice(0,10);return{label:ds.slice(5),v:orders.filter(o=>o.date===ds).reduce((s,o)=>s+(o.items||[]).reduce((ss,ii)=>ss+(ii.qty||0),0),0)};});

  return(
    <div style={PAGE_PAD}>
      <Card st={{padding:"22px 18px",marginBottom:16,borderRadius:30,background:"linear-gradient(135deg, #0F172A 0%, #16284A 100%)",color:"#fff",border:"none",boxShadow:"0 24px 48px rgba(15,23,42,0.22)"}}>
        <div style={{display:"inline-flex",padding:"7px 11px",borderRadius:999,background:"rgba(255,255,255,0.12)",fontSize:11,fontWeight:800,marginBottom:14}}>D-WORKS DASHBOARD</div>
        <div style={{fontSize:28,fontWeight:900,lineHeight:1.18,letterSpacing:"-0.05em"}}>발주 현황을 한 화면에서<br/>빠르게 확인합니다</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.72)",marginTop:12,lineHeight:1.7}}>지연 발주, 당일 발주, 월간 발주량을 우선순위 중심으로 정리했습니다.</div>
      </Card>

      <PageTitle title="대시보드" sub="현재 구조는 유지하고 요약 정보 계층만 정리한 화면입니다." />

      <div style={{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:10,marginBottom:16}}>
        <StatCard value={`${tO.length}건`} label="오늘 발주" color={C.acc}/>
        <StatCard value={`${delayed.length}건`} label="미출고 발주" color="#8B5CF6"/>
        <StatCard value={`${fmtN(mQ)}매`} label="이달 발주량" color={C.ok}/>
      </div>

      <Card st={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontWeight:900,fontSize:16,color:C.txt}}>지연 발주</div>
            <div style={{fontSize:12,color:C.sub2,marginTop:4}}>빠른 확인이 필요한 항목입니다</div>
          </div>
          <Tag ch={`${delayed.length}건`} c={C.warn}/>
        </div>

        {delayed.length===0
          ? <Empty icon="✅" text="지연 발주가 없습니다"/>
          : (
            <>
              <div style={{display:"flex",fontSize:11,fontWeight:800,color:C.sub2,paddingBottom:8,borderBottom:`1px solid ${C.bdr}`,marginBottom:4}}>
                <div style={{flex:2}}>상품명</div>
                <div style={{width:68,textAlign:"center"}}>색상</div>
                <div style={{width:58,textAlign:"right"}}>수량</div>
                <div style={{width:52,textAlign:"center",marginLeft:8}}>상태</div>
              </div>
              {delayed.slice(0,5).flatMap(o=>(o.items||[]).map((it,j)=>{
                const p=products.find(x=>x.id===it.pid);
                return(
                  <div key={`${o.id}-${j}`} style={{display:"flex",fontSize:12,padding:"9px 0",borderBottom:`1px solid ${C.bdr}`,alignItems:"center"}}>
                    <div style={{flex:2,fontWeight:800,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:10}}>{p?.name||"-"}</div>
                    <div style={{width:68,color:C.sub2,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.color}</div>
                    <div style={{width:58,fontWeight:900,textAlign:"right",color:C.txt}}>{fmtN(it.qty)}</div>
                    <div style={{width:52,display:"flex",justifyContent:"center",marginLeft:8}}><Tag ch="지연" c={C.warn}/></div>
                  </div>
                );
              }))}
              {delayed.length>2 && <Btn ch="지연 발주 전체 보기" v="w" full st={{marginTop:14}} onClick={()=>onNav("list")}/>}
            </>
          )}
      </Card>

      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontWeight:900,fontSize:16,color:C.txt}}>발주량 추이</div>
          <div style={{fontSize:11,color:C.sub,fontWeight:800}}>최근 7일</div>
        </div>
        <LineChart data={chart}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>{chart.filter((_,i)=>i%2===0).map(d=><span key={d.label} style={{fontSize:10,color:C.sub2,fontWeight:700}}>{d.label}</span>)}</div>
      </Card>
    </div>
  );
}


function OrderPage({products,orders,setOrders,vendors,factories,user}){
  const [step,setStep]=useState(1);
  const [items,setItems]=useState([]);
  const [memo,setMemo]=useState("");
  const [search,setSearch]=useState("");
  const [selProd,setSelProd]=useState(null);
  const [selColor,setSelColor]=useState("");
  const [qty,setQty]=useState("");
  const [sending,setSending]=useState(false);
  const [showPreview,setShowPreview]=useState(false);
  const [previewData,setPreviewData]=useState([]);

  const DRAFT="dworks_draft";
  useEffect(()=>{try{const d=localStorage.getItem(DRAFT);if(d){const dr=JSON.parse(d);if(dr.items?.length>0){setItems(dr.items);alert("이전 발주(또는 임시저장) 내역을 불러왔습니다.");}}}catch{};},[]);
  const filtered=products.filter(p=>match(p.name,search)||match(p.season,search));

  function addItem(){
    if(!selProd||!selColor||!qty){alert("상품·색상·수량을 입력하세요");return;}
    const idx=items.findIndex(i=>i.pid===selProd.id&&i.color===selColor);
    if(idx>=0)setItems(p=>p.map((it,i)=>i===idx?{...it,qty:it.qty+Number(qty)}:it));
    else setItems(p=>[...p,{pid:selProd.id,color:selColor,qty:Number(qty)}]);
    setSelProd(null);setSelColor("");setQty("");setSearch("");
  }

  function generatePreview(){
    if(!items.length){alert("발주 항목 추가");return;}
    const venMap={};
    for(const it of items){
      const prod=products.find(x=>x.id===it.pid); if(!prod)continue;
      const bomList=prod.colorBom?.[it.color]||prod.bom||[];
      for(const b of bomList){
        const ven=vendors.find(v=>v.id===b.vid); if(!ven)continue;
        const soyo=Math.round(b.amt*it.qty*100)/100;
        if(!venMap[ven.id])venMap[ven.id]={vendor:ven,lines:[]};
        venMap[ven.id].lines.push({mat:b.mat,color:b.color||it.color,soyo,unit:b.unit||"yd",prod});
      }
    }
    const targets=Object.values(venMap).filter(v=>v.vendor.email);
    if(!targets.length){alert("발송할 거래처 이메일이 등록되어 있지 않습니다.");return;}
    const pData=[];
    for(const {vendor,lines} of targets){
      const companyName=user?.company||"디자인워커스";
      let body=`${vendor.name} 담당자님 안녕하세요.\n\n업체명 : ${companyName}\n\n`;
      const prodMap={};
      for(const l of lines){
        const pName=l.prod?.name||"-";
        if(!prodMap[pName])prodMap[pName]={matMap:{}};
        if(!prodMap[pName].matMap[l.mat])prodMap[pName].matMap[l.mat]={mat:l.mat,unit:l.unit,colors:[]};
        prodMap[pName].matMap[l.mat].colors.push(`${l.color} ${fmtN(l.soyo)}${l.unit}`);
      }
      for(const [pName,pDataObj] of Object.entries(prodMap)){
        for(const m of Object.values(pDataObj.matMap)){ body+=`${m.mat}\n`; m.colors.forEach(c=>{body+=`${c}\n`;}); body+=`\n`; }
        body+=`품목 : ${pName}\n\n`;
      }
      const p=lines[0]?.prod;
      body+=`입고처 : ${p?.factory||"-"}\n주소 : ${factories?.find(f=>f.name===p?.factory)?.address||"-"}\n연락처 : ${p?.factoryTel||"-"}\n\n`;
      if(memo)body+=`[요청 및 전달사항]\n${memo}\n\n`;
      body+=`감사합니다.\nD-Works`;
      pData.push({vendor,body});
    }
    setPreviewData(pData); setShowPreview(true);
  }

  async function confirmOrder(){
    setSending(true);
    const groupedByPid=items.reduce((acc,it)=>{if(!acc[it.pid])acc[it.pid]=[];acc[it.pid].push(it);return acc;},{});
    const ts=new Date().toISOString(), d=today(), newOrders=[];
    for(const [pid,groupItems] of Object.entries(groupedByPid)){
      const o={items:groupItems,status:"진행중",date:d,ts};
      try{
        if(!user?.token){alert("로그인 정보가 없습니다."); setSending(false); return;}
        const r=await DB.insert(user.token,"orders",{...o,user_id:user.id});
        if(r.error||r.code||!Array.isArray(r)||r.length===0){alert(`DB 에러: ${r.message}`); setSending(false); return;}
        newOrders.push(r[0]);
      }catch(e){alert("네트워크 에러"); setSending(false); return;}
    }
    setOrders(p=>[...newOrders,...p]);
    try{localStorage.removeItem(DRAFT);}catch{}
    for(const data of previewData){ await sendEmail(data.vendor.email, data.vendor.name, `[D-Works 발주서] ${today()} - ${data.vendor.name}`, data.body); }
    setSending(false); setShowPreview(false); setStep(3);
  }

  function reset(){setStep(1);setItems([]);setSearch("");setSelProd(null);setSelColor("");setQty("");setMemo("");setPreviewData([]);setShowPreview(false);}

  if(step===3){
    return(
      <div style={{...PAGE_PAD,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"72vh"}}>
        <Card st={{padding:"34px 24px",width:"100%",maxWidth:440,textAlign:"center"}}>
          <div style={{fontSize:58,marginBottom:14}}>✅</div>
          <div style={{fontWeight:900,fontSize:28,marginBottom:8,color:C.txt,letterSpacing:"-0.04em"}}>발주 완료</div>
          <div style={{color:C.sub2,marginBottom:26,fontSize:14}}>{items.length}개 상품 발주가 저장되고 이메일 발송까지 준비되었습니다.</div>
          <Btn ch="+ 새 발주 입력" onClick={reset} full sz="l"/>
        </Card>
      </div>
    );
  }

  return(
    <div style={PAGE_PAD}>
      <PageTitle title={step===1?"발주 입력":"발주서 확인"} sub={step===1?"상품, 색상, 수량을 입력하면 발주 리스트에 누적됩니다." : "발송 전 최종 내용과 전달사항을 확인합니다."} right={<Tag ch={`STEP ${step}/2`} c={step===1?C.acc:C.ok}/>} />
      <StepBar cur={step-1} total={2}/>

      {step===1 && (
        <>
          <Card st={{marginBottom:14}}>
            <div style={{fontWeight:900,fontSize:16,color:C.txt,marginBottom:14}}>발주 추가</div>
            <Field label="상품명">
              <div style={{position:"relative"}}>
                <TxtInp val={search} onChange={v=>{setSearch(v);if(selProd&&v!==selProd.name)setSelProd(null);}} ph="상품명 초성 검색"/>
                {search && !selProd && filtered.length>0 && (
                  <div style={{position:"absolute",top:"calc(100% + 8px)",left:0,right:0,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:20,zIndex:50,boxShadow:C.shadow,maxHeight:220,overflowY:"auto"}}>
                    {filtered.map(p=>(
                      <div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);setSelColor("");}} style={{padding:"14px 16px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer"}}>
                        <div style={{fontWeight:800,fontSize:14,color:C.txt}}>{p.name}</div>
                        <div style={{color:C.sub2,fontSize:11,marginTop:4}}>{p.season} · {(p.colors||[]).join(", ")}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Field>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="색상"><DropSel val={selColor} onChange={setSelColor} ph="색상 선택">{(selProd?.colors||[]).map(c=><option key={c} value={c}>{c}</option>)}</DropSel></Field>
              <Field label="수량"><TxtInp val={qty} onChange={setQty} ph="수량 입력" type="number"/></Field>
            </div>
          </Card>

          <Btn ch="+ 발주 리스트에 추가" full onClick={addItem} disabled={!selProd||!selColor||!qty} st={{marginBottom:18}}/>

          <Card st={{marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontWeight:900,fontSize:16,color:C.txt}}>발주 리스트</div>
              <Tag ch={`${items.length}개`} c={C.acc}/>
            </div>

            {items.length===0
              ? <Empty icon="🧾" text="추가된 항목이 없습니다"/>
              : items.map((it,i)=>{
                  const p=products.find(x=>x.id===it.pid);
                  return(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i===items.length-1?"none":`1px solid ${C.bdr}`,gap:10}}>
                      <div style={{minWidth:0,flex:1}}>
                        <div style={{fontSize:14,fontWeight:800,color:C.txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p?.name}</div>
                        <div style={{fontSize:12,color:C.sub2,marginTop:4}}>{it.color}</div>
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                        <input type="number" value={it.qty||""} onChange={e=>{const v=parseInt(e.target.value)||0;setItems(prev=>prev.map((item,idx)=>idx===i?{...item,qty:v}:item));}} style={{width:62,padding:"10px 10px",border:`1px solid ${C.bdr}`,borderRadius:14,textAlign:"right",fontSize:13,fontWeight:900,color:C.acc,outline:"none",background:C.card2,fontFamily:C.fn}} />
                        <span style={{fontWeight:800,fontSize:13,color:C.txt}}>장</span>
                        <button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{background:C.card2,border:`1px solid ${C.bdr}`,color:C.sub2,cursor:"pointer",fontSize:14,width:34,height:34,borderRadius:12,fontFamily:C.fn}}>✕</button>
                      </div>
                    </div>
                  );
                })}
          </Card>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:10}}>
            <Btn ch="임시저장" v="w" full onClick={()=>{if(!items.length)return;try{localStorage.setItem(DRAFT,JSON.stringify({items}));alert("임시저장 완료!");}catch{}}}/>
            <Btn ch="다음 단계" full onClick={()=>items.length?setStep(2):alert("항목 추가 필요")} disabled={!items.length}/>
          </div>
        </>
      )}

      {step===2 && (
        <>
          <Card st={{marginBottom:14}}>
            <div style={{fontWeight:900,fontSize:16,color:C.txt,marginBottom:12}}>발주 내역</div>
            {items.map((it,i)=>{
              const p=products.find(x=>x.id===it.pid);
              return(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${C.bdr}`}}>
                  <div style={{paddingRight:10}}>
                    <div style={{fontWeight:800,fontSize:14,color:C.txt}}>{p?.name}</div>
                    <div style={{color:C.sub2,fontSize:12,marginTop:4}}>{it.color} · {p?.factory||"입고처 미지정"}</div>
                  </div>
                  <span style={{fontWeight:900,color:C.acc,fontSize:18,whiteSpace:"nowrap"}}>{fmtN(it.qty)}장</span>
                </div>
              );
            })}
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:14}}>
              <span style={{fontWeight:800,fontSize:14,color:C.txt}}>총 수량</span>
              <span style={{fontWeight:900,color:C.txt,fontSize:18}}>{fmtN(items.reduce((s,it)=>s+it.qty,0))}장</span>
            </div>
          </Card>

          <Field label="전달사항 (선택)">
            <div style={{border:`1px solid ${C.bdr}`,borderRadius:20,background:C.card2}}>
              <textarea value={memo} onChange={e=>setMemo(e.target.value)} placeholder="예: 소량 발주건으로 10야드는 본사로, 나머지는 공장으로 배송 부탁드립니다." style={{width:"100%",padding:"16px",border:"none",borderRadius:20,fontSize:14,fontFamily:C.fn,outline:"none",resize:"vertical",minHeight:"110px",boxSizing:"border-box",background:"transparent",color:C.txt"}}/>
            </div>
          </Field>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:10}}>
            <Btn ch="← 수정" v="w" full onClick={()=>setStep(1)}/>
            <Btn ch="발주 미리보기" full st={{background:`linear-gradient(135deg, ${C.ok}, #31C48D)`,boxShadow:"0 14px 30px rgba(18,185,129,0.20)"}} onClick={generatePreview}/>
          </div>
        </>
      )}

      {showPreview && (
        <Sheet title="발주 내용 최종 확인" onClose={() => setShowPreview(false)}>
          <div style={{fontSize:13,color:C.sub2,marginBottom:16,lineHeight:1.7}}>아래 내용으로 총 <strong style={{color:C.txt}}>{previewData.length}곳</strong>의 거래처에 이메일 발주서가 발송됩니다.</div>
          <div style={{maxHeight:"58vh",overflowY:"auto",marginBottom:16,paddingRight:4}}>
            {previewData.map((d,i)=>(
              <Card key={i} st={{marginBottom:12,padding:"16px 16px 14px"}}>
                <div style={{fontWeight:900,fontSize:13,marginBottom:12,color:C.acc,borderBottom:`1px dashed ${C.bdr}`,paddingBottom:10}}>받는 사람: {d.vendor.name} <span style={{fontWeight:600,color:C.sub}}>({d.vendor.email})</span></div>
                <div style={{fontSize:12,whiteSpace:"pre-wrap",lineHeight:1.7,color:C.txt}}>{d.body}</div>
              </Card>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:10}}>
            <Btn ch="취소" v="w" full onClick={() => setShowPreview(false)} />
            <Btn ch={sending ? "발송 중..." : "최종 발송하기"} full onClick={confirmOrder} disabled={sending} />
          </div>
        </Sheet>
      )}
    </div>
  );
}

function ProdsPage({products,setProducts,vendors,factories,user}){
  const [catF,setCatF]=useState("전체");
  const [prodSearch,setProdSearch]=useState("");
  const [sortOrd,setSortOrd]=useState("최신순");
  const [sheet,setSheet]=useState(false);
  const [sheetStep,setSheetStep]=useState(0);
  const [selColor,setSelColor]=useState("");
  const [f,setF]=useState({name:"",category:"",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],colorBom:{},imageUrl:""});
  const [ci,setCi]=useState("");
  const [br,setBr]=useState({type:"",mat:"",amt:"",vid:"",price:"",color:""});
  const [editBomId,setEditBomId]=useState(null);
  const [venSearch,setVenSearch]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  const getUnit=t=>["단추","지퍼","기타"].includes(t)?"개":"yd";

  let filtered=catF==="전체"?products:products.filter(p=>p.category===catF);
  filtered = filtered.filter(p=>match(p.name,prodSearch));
  if(sortOrd==="최신순") filtered=[...filtered].reverse();
  else if(sortOrd==="시즌별") filtered=[...filtered].sort((a,b)=>(b.season||"").localeCompare(a.season||""));
  else if(sortOrd==="공장별") filtered=[...filtered].sort((a,b)=>(a.factory||"").localeCompare(b.factory||""));

  function openAdd(){setF({name:"",category:"",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],colorBom:{},imageUrl:""});setCi("");setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");setSheetStep(0);setSelColor("");setEditBomId(null);setSheet(true);}
  function openEdit(p){setF({...p,colors:[...(p.colors||[])],colorBom:{...(p.colorBom||{})},imageUrl:p.imageUrl||""});setCi("");setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");setSheetStep(0);setSelColor("");setEditBomId(null);setSheet(true);}

  function copyProd(p){
    setF({...p, id: undefined, name: p.name + " (복사본)", colors: [...(p.colors||[])], colorBom: JSON.parse(JSON.stringify(p.colorBom||{})), imageUrl: p.imageUrl||""});
    setCi(""); setBr({type:"",mat:"",amt:"",vid:"",price:"",color:""}); setVenSearch(""); setSheetStep(0); setSelColor(""); setEditBomId(null); setSheet(true);
  }

  function addColor(){const c=ci.trim();if(!c||f.colors.includes(c))return;setF(p=>({...p,colors:[...p.colors,c],colorBom:{...p.colorBom,[c]:p.colorBom[c]||[]}}));setCi("");}
  function removeColor(c){setF(p=>{const nb={...p.colorBom};delete nb[c];return{...p,colors:p.colors.filter(x=>x!==c),colorBom:nb};});if(selColor===c)setSelColor("");}

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if(file) { const reader = new FileReader(); reader.onloadend = () => { setF(prev => ({...prev, imageUrl: reader.result})); }; reader.readAsDataURL(file); }
  };

  function goToStep1(){
    if(!f.name||f.colors.length===0){alert("상품명과 색상을 하나 이상 입력하세요");return;}
    setF(p=>{const nb={...p.colorBom};p.colors.forEach(c=>{if(!nb[c])nb[c]=[];});return{...p,colorBom:nb};});
    setSelColor(f.colors[0]);setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");setEditBomId(null);setSheetStep(1);
  }

  function addBom(){
    if(!br.mat||!br.amt)return;
    if(editBomId){setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:(p.colorBom[selColor]||[]).map(b=>b.id===editBomId?{...b,...br,amt:Number(br.amt)}:b)}}));setEditBomId(null);}
    else{setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:[...(p.colorBom[selColor]||[]),{...br,id:uid(),amt:Number(br.amt),unit:getUnit(br.type)}]}}));}
    setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");
  }

  async function save(){
    if(!f.name)return;
    const sd={name:f.name, category:f.category, season:f.season, factory_id:f.factoryId||null, factory:f.factory, factory_tel:f.factoryTel, colors:f.colors, color_bom:f.colorBom, image_url:f.imageUrl};
    try{
      if(f.id&&user?.token){
        const r=await DB.update(user.token,"products",f.id,sd);
        if(r.error||r.code){alert(`[상품 수정 실패] DB를 확인해주세요!`);return;}
        setProducts(products.map(p=>p.id===f.id?{...f}:p));
      }
      else if(user?.token){
        const r=await DB.insert(user.token,"products",{...sd,user_id:user.id});
        if(r.error||r.code||!Array.isArray(r)||r.length===0){alert(`[상품 등록 실패] DB를 확인해주세요!`);return;}
        const newProd = r[0];
        setProducts(p=>[...p,{...newProd,factoryId:newProd.factory_id||"",factoryTel:newProd.factory_tel||"",colors:newProd.colors||[],colorBom:newProd.color_bom||{},imageUrl:newProd.image_url||""}]);
      }
    }catch(e){alert("네트워크 에러");return;}
    setSheet(false);
  }

  async function del(id){if(!window.confirm("삭제?"))return;if(user?.token)try{await DB.del(user.token,"products",id);}catch{}setProducts(products.filter(p=>p.id!==id));}

  const curBom=f.colorBom[selColor]||[];

  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontWeight:900,fontSize:20}}>상품 관리</div><Btn ch="+ 추가" sz="s" st={{padding:"7px 14px"}} onClick={openAdd}/></div>
      
      <div style={{display:"flex",gap:7,marginBottom:12,overflowX:"auto",paddingBottom:4}}>{["전체",...CATS].map(cat=>{const cnt=cat==="전체"?products.length:products.filter(p=>p.category===cat).length;const act=catF===cat;return<button key={cat} onClick={()=>setCatF(cat)} style={{padding:"6px 12px",borderRadius:20,flexShrink:0,whiteSpace:"nowrap",border:`1.5px solid ${act?(CAT_C[cat]||C.acc):C.bdr}`,background:act?(CAT_C[cat]||C.acc):"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:C.fn}}>{cat} {cnt}</button>;})}</div>
      
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <div style={{flex:1}}><TxtInp val={prodSearch} onChange={setProdSearch} ph="🔍 상품명 초성 검색"/></div>
        <div style={{width:100}}><DropSel val={sortOrd} onChange={setSortOrd}><option value="최신순">최신순</option><option value="시즌별">시즌별</option><option value="공장별">공장별</option></DropSel></div>
      </div>

      {filtered.length===0?<Empty icon="👕" text="조건에 맞는 상품이 없습니다"/>:filtered.map(p=>(
        <Card key={p.id} st={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1, minWidth:0, paddingRight:12}}>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:6}}>
                <span style={{fontWeight:800,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</span>
                {p.imageUrl&&<span style={{fontSize:12}}>🖼️</span>}
                {p.category&&<Tag ch={p.category} c={CAT_C[p.category]||C.sub}/>}
                <Tag ch={p.season} c={C.acc}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:4}}>{(p.colors||[]).map(c=><span key={c} style={{background:C.bg,borderRadius:20,padding:"2px 8px",fontSize:11,color:C.sub2,border:`1px solid ${C.bdr}`}}>{c}</span>)}</div>
              <div style={{color:C.sub,fontSize:11}}>
                {p.factory&&`📍 ${p.factory}`}
                {p.colorBom&&Object.values(p.colorBom).some(b=>b.length>0)&&` · BOM 등록됨`}
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0,alignItems:"flex-end"}}>
              <Btn ch="복사" v="w" sz="s" st={{padding:"4px 10px",fontSize:11,color:C.acc}} onClick={()=>copyProd(p)}/>
              <div style={{display:"flex", gap:5}}>
                <Btn ch="수정" v="w" sz="s" st={{padding:"4px 10px",fontSize:11}} onClick={()=>openEdit(p)}/>
                <Btn ch="삭제" v="w" sz="s" st={{padding:"4px 10px",fontSize:11,color:C.red}} onClick={()=>del(p.id)}/>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {sheet&&<Sheet title={f.id?"상품 수정":"상품 등록"} onClose={()=>setSheet(false)}>
        <StepBar cur={sheetStep} total={2}/>
        {sheetStep===0&&<>
          <div style={{fontSize:12,fontWeight:600,color:C.sub,marginBottom:8}}>기본 정보</div>
          <FCard>
            <FRow label="상품명" req><FInp val={f.name} onChange={sf("name")} ph="상품명 입력"/></FRow>
            <FRow label="시즌"><FSel val={f.season} onChange={sf("season")} ph="">{SEASONS.map(s=><option key={s} value={s}>{s}</option>)}</FSel><span style={{color:C.sub,fontSize:11,flexShrink:0}}>∨</span></FRow>
            <FRow label="공장" last><FSel val={f.factoryId||""} onChange={v=>{const fc=factories.find(x=>x.id===v);setF(p=>({...p,factoryId:v,factory:fc?.name||"",factoryTel:fc?.tel||""}));}} ph="공장 선택">{factories.map(fc=><option key={fc.id} value={fc.id}>{fc.name}</option>)}</FSel><span style={{color:C.sub,fontSize:11,flexShrink:0}}>∨</span></FRow>
          </FCard>
          {f.factory&&<div style={{fontSize:11,color:C.sub,marginBottom:10,marginTop:-6}}>📞 {f.factoryTel} · 발주서 자동포함</div>}

          <Field label="작업지시서 (선택)">
            <div style={{border: `1px dashed ${C.bdr}`, borderRadius: 8, padding: 16, textAlign: "center", background: "#fff", position: "relative"}}>
              {f.imageUrl ? (
                 <div>
                   <img src={f.imageUrl} alt="작업지시서" style={{maxWidth: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 4}} />
                   <div style={{marginTop: 8}}>
                     <Btn ch="사진 변경" v="w" sz="s" onClick={()=>document.getElementById('img-upload').click()}/>
                     <Btn ch="삭제" v="w" sz="s" st={{marginLeft: 8, color: C.red}} onClick={()=>setF(p=>({...p, imageUrl:""}))}/>
                   </div>
                 </div>
              ) : (
                 <div onClick={()=>document.getElementById('img-upload').click()} style={{cursor: "pointer", color: C.sub}}>
                   <div style={{fontSize: 24, marginBottom: 8}}>📸</div>
                   <div style={{fontSize: 12}}>클릭하여 작업지시서 사진 업로드</div>
                 </div>
              )}
              <input id="img-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{display: "none"}} />
            </div>
          </Field>

          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{CATS.map(cat=>{const act=f.category===cat;return<button key={cat} onClick={()=>sf("category")(cat)} style={{padding:"5px 11px",borderRadius:20,border:`1.5px solid ${act?(CAT_C[cat]||C.acc):C.bdr}`,background:act?(CAT_C[cat]||C.acc):"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:C.fn}}>{cat}</button>;})}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:12,fontWeight:700,color:C.txt}}>발주 색상 목록</span>
            <span style={{fontSize:11,color:C.warn}}>* 1개 이상 필수</span>
          </div>
          <div style={{background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:10,padding:"12px",marginBottom:20}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,minHeight:36,marginBottom:f.colors.length>0?10:0}}>
              {f.colors.map(c=><span key={c} style={{background:C.acc+"12",border:`1.5px solid ${C.acc}`,color:C.acc,borderRadius:20,padding:"5px 12px",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>{c}<button onClick={()=>removeColor(c)} style={{background:"none",border:"none",color:C.acc,cursor:"pointer",fontSize:13,padding:0,lineHeight:1}}>✕</button></span>)}
              {f.colors.length===0&&<span style={{color:C.sub,fontSize:12,alignSelf:"center"}}>아직 색상 없음</span>}
            </div>
            <div style={{display:"flex",gap:6}}>
              <input value={ci} onChange={e=>setCi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addColor()} placeholder="색상명 (예: 블랙)" style={{flex:1,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:C.fn,outline:"none",color:C.txt}}/>
              <button onClick={addColor} style={{background:C.acc,border:"none",color:"#fff",borderRadius:8,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:C.fn,flexShrink:0}}>+ 추가</button>
            </div>
          </div>
          <Btn ch="다음 : 원부자재 등록 →" full onClick={goToStep1} disabled={!f.name||f.colors.length===0} st={{borderRadius:10,height:50,fontSize:14}}/>
        </>}
        {sheetStep===1&&<>
          <div style={{fontSize:12,color:C.sub,marginBottom:12}}>색상 탭을 선택하고 원부자재를 등록하세요</div>
          <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
            {f.colors.map(c=>{const cnt=(f.colorBom[c]||[]).length;const act=selColor===c;return<button key={c} onClick={()=>{setSelColor(c);setEditBomId(null);setBr({type:"",mat:"",amt:"",vid:"",price:"",color:""});setVenSearch("");}} style={{padding:"8px 16px",borderRadius:20,flexShrink:0,whiteSpace:"nowrap",border:`2px solid ${act?C.acc:C.bdr}`,background:act?C.acc:"#fff",color:act?"#fff":C.sub2,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:C.fn,display:"flex",alignItems:"center",gap:6}}>{c}{cnt>0&&<span style={{background:act?"rgba(255,255,255,0.25)":"#EEF2FF",color:act?"#fff":C.acc,borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{cnt}</span>}</button>;})}</div>
          {selColor?<>
            {curBom.length>0&&<div style={{marginBottom:10}}>{curBom.map(b=>{const ven=vendors.find(v=>v.id===b.vid);const isE=editBomId===b.id;return<div key={b.id} style={{background:isE?C.acc+"10":"#F8F9FB",borderRadius:8,padding:"9px 12px",marginBottom:6,border:`1.5px solid ${isE?C.acc:C.bdr}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{flex:1,minWidth:0}}><span style={{background:C.acc+"15",color:C.acc,borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700,marginRight:6}}>{b.type||"원단"}</span><span style={{fontWeight:700,fontSize:12}}>{b.mat}</span>{b.color&&<span style={{background:C.sub+"18",color:C.sub2,borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:600,marginLeft:5}}>{b.color}</span>}<span style={{color:C.sub,fontSize:11,marginLeft:6}}>{b.amt}{b.unit||"yd"}</span>{ven&&<span style={{color:C.sub,fontSize:11,marginLeft:4}}>· {ven.name}</span>}</div><div style={{display:"flex",gap:6,flexShrink:0}}><button onClick={()=>{if(isE){setEditBomId(null);setBr({type:"",mat:"",amt:"",vid:"",price:"",color:""});setVenSearch("");}else{setEditBomId(b.id);setBr({type:b.type||"",mat:b.mat,amt:String(b.amt),vid:b.vid||"",price:String(b.price||""),color:b.color||""});const ev=vendors.find(v=>v.id===b.vid);setVenSearch(ev?.name||"");}}} style={{background:"none",border:"none",color:isE?C.acc:C.sub,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:C.fn}}>{isE?"취소":"수정"}</button><button onClick={()=>{setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:(p.colorBom[selColor]||[]).filter(x=>x.id!==b.id)}}));if(isE){setEditBomId(null);setBr({type:"",mat:"",amt:"",vid:"",price:"",color:""});setVenSearch("");}}} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:14}}>✕</button></div></div></div>;})}</div>}
            <div style={{background:"#F0F4FF",borderRadius:12,padding:"14px",marginBottom:12,border:`1px dashed ${C.acc}60`}}>
              <div style={{fontSize:12,fontWeight:700,color:C.acc,marginBottom:10}}>✏️ [{selColor}] 원부자재 {editBomId?"수정":"추가"}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>{MAT_TYPES.map(t=>{const act=br.type===t;return<button key={t} onClick={()=>setBr(r=>({...r,type:t}))} style={{padding:"5px 11px",borderRadius:20,whiteSpace:"nowrap",border:`1.5px solid ${act?C.acc:C.bdr}`,background:act?C.acc:"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:C.fn}}>{t}</button>;})}</div>
              <FCard mb={8}>
                <FRow label="업체명"><div style={{flex:1,position:"relative",display:"flex",alignItems:"center"}}><input value={venSearch} onChange={e=>{setVenSearch(e.target.value);if(!e.target.value)setBr(r=>({...r,vid:""}));}} placeholder="초성 검색 가능" style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:C.txt,fontFamily:C.fn,textAlign:"right"}}/>{br.vid&&<span style={{color:C.ok,fontSize:13,marginLeft:4,flexShrink:0}}>✓</span>}{venSearch&&!br.vid&&(()=>{const fv=vendors.filter(v=>match(v.name,venSearch));return fv.length>0?<div style={{position:"absolute",top:"100%",right:0,width:180,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:8,zIndex:9999,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:130,overflowY:"auto"}}>{fv.map(v=><div key={v.id} onClick={()=>{setBr(r=>({...r,vid:v.id}));setVenSearch(v.name);}} style={{padding:"8px 12px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:600}}>{v.name}</span><Tag ch={v.type} c={VEN_C[v.type]||C.sub}/></div>)}</div>:null;})()}</div><span style={{color:C.sub,fontSize:11,flexShrink:0,marginLeft:4}}>∨</span></FRow>
                <FRow label={br.type==="단추"?"단추명":br.type==="지퍼"?"지퍼명":br.type==="기타"?"부자재명":"원단명"} req><FInp val={br.mat} onChange={v=>setBr(r=>({...r,mat:v}))} ph={br.type==="단추"?"예: 요크유광 11.5mm":br.type==="지퍼"?"예: YKK 3호 혼솔":br.type==="기타"?"예: 다림질 테이프":"예: 30수 면 싱글"}/></FRow>
                <FRow label="소재 색상"><FInp val={br.color} onChange={v=>setBr(r=>({...r,color:v}))} ph="예: 핑크, 그레이"/></FRow>
                <FRow label={`소요량 (${getUnit(br.type)})`} req><FInp val={br.amt} onChange={v=>setBr(r=>({...r,amt:v}))} ph="0" type="number"/><span style={{background:["단추","지퍼","기타"].includes(br.type)?C.warn+"20":C.acc+"15",color:["단추","지퍼","기타"].includes(br.type)?C.warn:C.acc,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,flexShrink:0,marginLeft:6}}>{getUnit(br.type)}</span></FRow>
                <FRow label="단가" last><FInp val={br.price||""} onChange={v=>setBr(r=>({...r,price:v}))} ph="0" type="number"/><span style={{color:C.sub,fontSize:11,flexShrink:0,marginLeft:4}}>원</span></FRow>
              </FCard>
              <Btn ch={editBomId?"✓ 수정 완료":"+ 추가"} full onClick={addBom} disabled={!br.mat||!br.amt}/>
            </div>
          </>:<div style={{textAlign:"center",padding:"24px 0",color:C.sub,fontSize:13}}>위에서 색상 탭을 선택하세요 👆</div>}
          <div style={{display:"flex",gap:10,marginTop:4}}><Btn ch="← 이전" v="w" full st={{flex:1}} onClick={()=>setSheetStep(0)}/><Btn ch="저장 완료" full st={{flex:2}} onClick={save} disabled={!f.name}/></div>
        </>}
      </Sheet>}
    </div>
  );
}

// 🚀 발주 리스트 🚀

function ListPage({orders,setOrders,products,user,onNav}){
  const [filter,setFilter]=useState("전체");
  const [dateFilter,setDateFilter]=useState("전체");
  const [startDate,setStartDate]=useState("");
  const [endDate,setEndDate]=useState("");
  const [open,setOpen]=useState(null);
  const SC={완료:C.ok,지연:C.warn,진행중:C.acc};

  const getPastDate=(days)=>{const d=new Date(); d.setDate(d.getDate()-days); return d.toISOString().slice(0,10);};
  const tToday=today(), tYest=getPastDate(1), tWeek=getPastDate(7);

  let dateFiltered=orders;
  if(dateFilter==="오늘") dateFiltered=orders.filter(o=>o.date===tToday);
  else if(dateFilter==="어제") dateFiltered=orders.filter(o=>o.date===tYest);
  else if(dateFilter==="1주일") dateFiltered=orders.filter(o=>o.date>=tWeek && o.date<=tToday);
  else if(dateFilter==="기간설정"){
    dateFiltered=orders.filter(o=>{
      if(startDate && endDate) return o.date>=startDate && o.date<=endDate;
      if(startDate) return o.date>=startDate;
      if(endDate) return o.date<=endDate;
      return true;
    });
  }

  const filtered=(filter==="전체"?dateFiltered:dateFiltered.filter(o=>o.status===filter)).sort((a,b)=>new Date(b.ts||0)-new Date(a.ts||0));

  async function changeStatus(id,status){if(user?.token)try{await DB.update(user.token,"orders",id,{status});}catch{} setOrders(p=>p.map(x=>x.id===id?{...x,status}:x));}
  async function delOrder(id){if(!window.confirm("삭제?"))return; if(user?.token)try{await DB.del(user.token,"orders",id);}catch{} setOrders(p=>p.filter(x=>x.id!==id));}
  function handleReorder(o){if(!window.confirm("새 발주를 진행하시겠습니까?")) return; try{localStorage.setItem("dworks_draft",JSON.stringify({items:o.items})); onNav("order");}catch{}}

  return(
    <div style={PAGE_PAD}>
      <PageTitle title="발주 리스트" sub="날짜와 상태 필터를 조합해 저장된 발주를 확인합니다." right={<Tag ch={`${filtered.length}건`} c={C.sub2}/>} />

      <div style={{display:"flex",gap:8,marginBottom:dateFilter==="기간설정"?10:14,overflowX:"auto",paddingBottom:4}}>
        {["전체","오늘","어제","1주일","기간설정"].map(s=><FilterChip key={s} label={s} active={dateFilter===s} onClick={()=>setDateFilter(s)} />)}
      </div>

      {dateFilter==="기간설정" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center",marginBottom:14}}>
          <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{padding:"12px 14px",border:`1px solid ${C.bdr}`,borderRadius:16,fontFamily:C.fn,fontSize:13,outline:"none",color:C.txt,background:C.card2}}/>
          <span style={{color:C.sub2,fontWeight:800}}>-</span>
          <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{padding:"12px 14px",border:`1px solid ${C.bdr}`,borderRadius:16,fontFamily:C.fn,fontSize:13,outline:"none",color:C.txt,background:C.card2}}/>
        </div>
      )}

      <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {["전체","진행중","완료","지연"].map(s=><FilterChip key={s} label={s} active={filter===s} onClick={()=>setFilter(s)} color={s==="완료"?C.ok:s==="지연"?C.warn:s==="진행중"?C.acc:C.sub2} />)}
      </div>

      {filtered.length===0
        ? <Empty icon="📋" text="발주 내역이 없습니다"/>
        : filtered.map(o=>{
            const tot=(o.items||[]).reduce((s,i)=>s+(i.qty||0),0);
            const isO=open===o.id;
            const names=Array.from(new Set((o.items||[]).map(it=>products.find(x=>x.id===it.pid)?.name||"-"))).join(", ");
            return(
              <Card key={o.id} st={{marginBottom:12,cursor:"pointer"}} onClick={()=>setOpen(isO?null:o.id)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:900,fontSize:15,marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:C.txt}}>{names}</div>
                    <div style={{color:C.sub2,fontSize:12,fontWeight:700}}>{o.date} · {fmtN(tot)}장</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                    <Tag ch={o.status} c={SC[o.status]||C.sub2}/>
                    <span style={{color:C.sub,fontSize:12,fontWeight:900}}>{isO?"▲":"▼"}</span>
                  </div>
                </div>

                {isO && (
                  <div onClick={e=>e.stopPropagation()}>
                    <Divider/>
                    {(o.items||[]).map((it,j)=>{
                      const p=products.find(x=>x.id===it.pid);
                      return <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.bdr}`,fontSize:12,gap:12}}><span style={{fontWeight:800,color:C.txt}}>{p?.name}</span><span style={{color:C.sub2}}>{it.color} · <strong style={{color:C.txt}}>{fmtN(it.qty)}</strong>장</span></div>;
                    })}
                    <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
                      <Btn ch="재발주" sz="s" v="w" st={{color:C.acc}} onClick={(e)=>{e.stopPropagation();handleReorder(o);}}/>
                      {["진행중","완료","지연"].map(st=><Btn key={st} ch={st} sz="s" st={{background:o.status===st?(SC[st]||C.acc):"#fff",color:o.status===st?"#fff":(SC[st]||C.sub2),border:`1px solid ${SC[st]||C.bdr}`,boxShadow:"none"}} onClick={()=>changeStatus(o.id,st)}/>)}
                      <Btn ch="삭제" sz="s" v="w" st={{marginLeft:"auto",color:C.red}} onClick={()=>delOrder(o.id)}/>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
    </div>
  );
}


function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",subTel:"",email:"",type:"원단",address:"",bizNo:""});
  const [editId,setEditId]=useState(null);
  const [venSearch,setVenSearch]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));

  function openAdd(){setF({name:"",tel:"",subTel:"",email:"",type:"원단",address:"",bizNo:""});setEditId(null);setSheet(true);}
  function openEdit(v){setF({...v});setEditId(v.id);setSheet(true);}

  async function save(){
    if(!f.name || !f.tel || !f.address){alert("필수 항목 입력");return;}
    const dataToSave={name:f.name,tel:f.tel,sub_tel:f.subTel||null,email:f.email,type:f.type,address:f.address,biz_no:f.bizNo||null};
    try{
      if(editId){
        if(user?.token) await DB.update(user.token,"vendors",editId,dataToSave);
        setVendors(vv=>vv.map(v=>v.id===editId?{...v,...f}:v));
      }else{
        if(user?.token){
          const r=await DB.insert(user.token,"vendors",{...dataToSave,user_id:user.id});
          const nv=r[0];
          setVendors(vv=>[...vv,{...nv,subTel:nv.sub_tel||"",address:nv.address||"",bizNo:nv.biz_no||""}]);
        }
      }
    }catch(e){alert("네트워크 에러"); return;}
    setSheet(false);
  }

  async function del(id){if(!window.confirm("삭제?"))return; if(user?.token)try{await DB.del(user.token,"vendors",id);}catch{} setVendors(vv=>vv.filter(x=>x.id!==id));}
  const filtered=vendors.filter(v=>match(v.name,venSearch)||match(v.tel,venSearch));

  return(
    <div style={PAGE_PAD}>
      <PageTitle title="거래처 관리" sub="발주서 발송에 필요한 거래처 정보를 관리합니다." right={<Btn ch="+ 추가" sz="s" onClick={openAdd}/>} />
      <div style={{marginBottom:16}}><TxtInp val={venSearch} onChange={setVenSearch} ph="거래처명 초성 검색"/></div>

      {filtered.length===0
        ? <Empty icon="🏭" text="조건에 맞는 거래처가 없습니다"/>
        : filtered.map(v=>(
            <Card key={v.id} st={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:48,height:48,borderRadius:16,background:(VEN_C[v.type]||C.sub)+"16",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,border:`1px solid ${(VEN_C[v.type]||C.sub)}22`}}>{VEN_IC[v.type]||"🏭"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                    <span style={{fontWeight:900,fontSize:15,color:C.txt}}>{v.name}</span>
                    <Tag ch={v.type} c={VEN_C[v.type]||C.sub2}/>
                  </div>
                  <div style={{color:C.sub2,fontSize:12,fontWeight:700}}>📱 {v.tel||"핸드폰 미등록"}{v.subTel ? ` · ☎️ ${v.subTel}` : ""}</div>
                  {v.address&&<div style={{fontSize:12,color:C.sub2,marginTop:5}}>📍 {v.address}</div>}
                  {v.bizNo&&<div style={{fontSize:11,color:C.sub,marginTop:4}}>🏢 {v.bizNo}</div>}
                  <div style={{fontSize:11,color:v.email?C.sub2:C.warn,marginTop:4,fontWeight:700}}>{v.email||"이메일 미등록"}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                  <Btn ch="수정" v="w" sz="s" onClick={()=>openEdit(v)}/>
                  <Btn ch="삭제" v="w" sz="s" st={{color:C.red}} onClick={()=>del(v.id)}/>
                </div>
              </div>
            </Card>
          ))}

      {sheet && (
        <Sheet title={editId?"거래처 수정":"거래처 추가"} onClose={()=>setSheet(false)}>
          <Field label="거래처명" req><TxtInp val={f.name} onChange={sf("name")} ph="이레텍스"/></Field>
          <Field label="핸드폰번호" req><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field>
          <Field label="전화번호 (선택)"><TxtInp val={f.subTel} onChange={sf("subTel")} ph="02-000-0000" type="tel"/></Field>
          <Field label="거래처 주소" req><TxtInp val={f.address} onChange={sf("address")} ph="서울시 종로구 ..." /></Field>
          <Field label="사업자 등록번호"><TxtInp val={f.bizNo} onChange={sf("bizNo")} ph="000-00-00000" /></Field>
          <Field label="이메일 (발주서 발송용)"><TxtInp val={f.email} onChange={sf("email")} ph="order@fabric.com" type="email"/></Field>
          <Field label="업체 유형">
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {VEN_TYPES.map(t=>{const act=f.type===t; return <button key={t} onClick={()=>sf("type")(t)} style={{padding:"9px 14px",borderRadius:999,border:`1px solid ${act?(VEN_C[t]||C.acc):C.bdr}`,background:act?(VEN_C[t]||C.acc)+"14":"#fff",color:act?(VEN_C[t]||C.acc):C.sub2,fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:C.fn,display:"flex",alignItems:"center",gap:5}}>{VEN_IC[t]} {t}</button>;})}
            </div>
          </Field>
          <G/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:10}}>
            <Btn ch="취소" v="w" full onClick={()=>setSheet(false)}/>
            <Btn ch="저장" full onClick={save}/>
          </div>
        </Sheet>
      )}
    </div>
  );
}


function SettingsPage({user,setUser,vendors,factories,setFactories,onLogout}){
  const [facSheet,setFacSheet]=useState(null);
  const [profileSheet,setProfileSheet]=useState(false);
  const [pf,setPf]=useState({name:user.name||"",company:user.company||"",tel:user.tel||"",brand:user.brand||"",position:user.position||"",address:user.address||""});

  async function saveProfile(){
    try{if(user?.token) await DB.updateUser(user.token,{name:pf.name,company:pf.company,tel:pf.tel,brand:pf.brand,position:pf.position,address:pf.address});}catch{}
    if(setUser)setUser(u=>({...u,...pf})); setProfileSheet(false); alert("저장되었습니다!");
  }

  async function saveFac(){
    if(!facSheet.name)return;
    const {id,...data}=facSheet;
    try{
      if(id){
        if(user?.token) await DB.update(user.token,"factories",id,{...data,biz_type:data.bizType,biz_no:data.bizNo||null});
        setFactories(ff=>ff.map(x=>x.id===id?{...x,...data}:x));
      }else{
        if(user?.token){
          const r=await DB.insert(user.token,"factories",{name:data.name,biz_type:data.bizType,address:data.address,tel:data.tel,account:data.account,biz_no:data.bizNo||null,user_id:user.id});
          setFactories(ff=>[...ff,{...r[0],bizType:r[0].biz_type||"",bizNo:r[0].biz_no||""}]);
        }
      }
    }catch(e){alert("네트워크 에러"); return;}
    setFacSheet(null);
  }
  async function delFac(id){if(!window.confirm("삭제?"))return; if(user?.token)try{await DB.del(user.token,"factories",id);}catch{} setFactories(ff=>ff.filter(x=>x.id!==id));}

  return(
    <div style={PAGE_PAD}>
      <PageTitle title="환경설정" sub="사용자 정보와 공장 정보를 관리합니다." />

      <Card st={{marginBottom:14,padding:"18px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:52,height:52,borderRadius:18,background:C.acc+"16",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,border:`1px solid ${C.acc}22`}}>👤</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:900,fontSize:16,color:C.txt}}>{user.name||"이름 없음"} {user.position && <span style={{fontSize:12,fontWeight:700,color:C.sub2}}>{user.position}</span>}</div>
            <div style={{color:C.sub2,fontSize:12,marginTop:5}}>{user.email}</div>
            {user.company&&<div style={{color:C.sub,fontSize:11,marginTop:3}}>{user.company} {user.brand ? `(${user.brand})` : ""}</div>}
          </div>
          <Btn ch="수정" v="w" sz="s" onClick={()=>setProfileSheet(true)}/>
        </div>
        <Divider/>
        <Btn ch="로그아웃" v="w" full st={{color:C.red}} onClick={onLogout}/>
      </Card>

      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontWeight:900,fontSize:16,color:C.txt}}>공장 관리</div>
            <div style={{fontSize:12,color:C.sub2,marginTop:4}}>입고처와 연락처 정보를 저장합니다.</div>
          </div>
          <Btn ch="+ 추가" sz="s" onClick={()=>setFacSheet({id:null,name:"",bizType:"",address:"",tel:"",account:"",bizNo:""})}/>
        </div>

        {factories.length===0
          ? <Empty icon="🏭" text="등록된 공장이 없습니다"/>
          : factories.map((fc,idx)=>(
              <div key={fc.id} style={{padding:"12px 0",borderBottom:idx===factories.length-1?"none":`1px solid ${C.bdr}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                      <span style={{fontWeight:900,fontSize:14,color:C.txt}}>{fc.name}</span>
                      {(fc.bizType||fc.biz_type)&&<Tag ch={fc.bizType||fc.biz_type} c={C.acc}/>}
                    </div>
                    {fc.address&&<div style={{color:C.sub2,fontSize:12,marginBottom:4}}>📍 {fc.address}</div>}
                    <div style={{color:C.sub2,fontSize:12}}>📞 {fc.tel||"연락처 없음"}</div>
                    {fc.bizNo&&<div style={{color:C.sub,fontSize:11,marginTop:4}}>🏢 {fc.bizNo}</div>}
                    {fc.account&&<div style={{color:C.sub,fontSize:11,marginTop:4}}>🏦 {fc.account}</div>}
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <Btn ch="수정" v="w" sz="s" onClick={()=>setFacSheet({...fc,bizType:fc.bizType||fc.biz_type||"",bizNo:fc.bizNo||fc.biz_no||""})}/>
                    <Btn ch="삭제" v="w" sz="s" st={{color:C.red}} onClick={()=>delFac(fc.id)}/>
                  </div>
                </div>
              </div>
            ))}
      </Card>

      {profileSheet && (
        <Sheet title="프로필 수정" onClose={()=>setProfileSheet(false)}>
          <Field label="성함"><TxtInp val={pf.name} onChange={v=>setPf(p=>({...p,name:v}))} ph="성함"/></Field>
          <Field label="업체명"><TxtInp val={pf.company} onChange={v=>setPf(p=>({...p,company:v}))} ph="업체명"/></Field>
          <Field label="브랜드명"><TxtInp val={pf.brand} onChange={v=>setPf(p=>({...p,brand:v}))} ph="브랜드명"/></Field>
          <Field label="직함"><TxtInp val={pf.position} onChange={v=>setPf(p=>({...p,position:v}))} ph="직함"/></Field>
          <Field label="연락처"><TxtInp val={pf.tel} onChange={v=>setPf(p=>({...p,tel:v}))} ph="010-0000-0000"/></Field>
          <Field label="주소"><TxtInp val={pf.address} onChange={v=>setPf(p=>({...p,address:v}))} ph="주소"/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:10}}>
            <Btn ch="취소" v="w" full onClick={()=>setProfileSheet(false)}/>
            <Btn ch="저장" full onClick={saveProfile}/>
          </div>
        </Sheet>
      )}

      {facSheet && (
        <Sheet title={facSheet.id?"공장 수정":"공장 추가"} onClose={()=>setFacSheet(null)}>
          <Field label="공장명" req><TxtInp val={facSheet.name} onChange={v=>setFacSheet(p=>({...p,name:v}))} ph="공장명"/></Field>
          <Field label="업종"><DropSel val={facSheet.bizType} onChange={v=>setFacSheet(p=>({...p,bizType:v}))} ph="업종 선택">{BIZ_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</DropSel></Field>
          <Field label="주소"><TxtInp val={facSheet.address} onChange={v=>setFacSheet(p=>({...p,address:v}))} ph="주소"/></Field>
          <Field label="연락처"><TxtInp val={facSheet.tel} onChange={v=>setFacSheet(p=>({...p,tel:v}))} ph="연락처"/></Field>
          <Field label="계좌"><TxtInp val={facSheet.account} onChange={v=>setFacSheet(p=>({...p,account:v}))} ph="은행 / 계좌번호"/></Field>
          <Field label="사업자번호"><TxtInp val={facSheet.bizNo} onChange={v=>setFacSheet(p=>({...p,bizNo:v}))} ph="000-00-00000"/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:10}}>
            <Btn ch="취소" v="w" full onClick={()=>setFacSheet(null)}/>
            <Btn ch="저장" full onClick={saveFac}/>
          </div>
        </Sheet>
      )}
    </div>
  );
}


export default function App(){
  const [screen,setScreen]=useState("loading");
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dash");
  const [vendors,setVendors]=useState([]);
  const [factories,setFactories]=useState([]);
  const [products,setProducts]=useState([]);
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(false);

  async function loadData(token){
    setLoading(true);
    try{
      const [v,f,p,o]=await Promise.all([DB.list(token,"vendors"),DB.list(token,"factories"),DB.list(token,"products"),DB.list(token,"orders")]);
      setVendors(Array.isArray(v)?v.map(x=>({...x,subTel:x.sub_tel||"",address:x.address||"",bizNo:x.biz_no||""})):[ ]);
      setFactories(Array.isArray(f)?f.map(x=>({...x,bizType:x.biz_type||x.bizType||"",bizNo:x.biz_no||x.bizNo||""})):[ ]);
      setProducts(Array.isArray(p)?p.map(x=>({...x,factoryId:x.factory_id||x.factoryId||"",factoryTel:x.factory_tel||x.factoryTel||"",colors:x.colors||[],colorBom:x.color_bom||x.colorBom||{},imageUrl:x.image_url||""})):[ ]);
      setOrders(Array.isArray(o)?o:[]);
    }catch(e){setScreen("auth");}
    finally{setLoading(false);}
  }

  useEffect(()=>{
    async function checkSession(){
      try{
        const s=localStorage.getItem("dworks_session");
        if(s){
          const u=JSON.parse(s);
          if(u?.token){
            const r=await fetch(`${SB}/auth/v1/user`,{headers:{"apikey":KEY,"Authorization":`Bearer ${u.token}`}});
            if(r.ok){setUser(u); setScreen("app"); loadData(u.token); return;}
          }
        }
      }catch{}
      setScreen("splash");
    }
    checkSession();
  },[]);

  async function handleLogin(u,keep){
    if(keep){try{localStorage.setItem("dworks_session",JSON.stringify(u));}catch{}}
    else{try{localStorage.removeItem("dworks_session");}catch{}}
    setUser(u); setScreen("app"); await loadData(u.token);
  }

  async function handleLogout(){
    try{localStorage.removeItem("dworks_session");}catch{}
    setUser(null); setScreen("auth");
  }

  const TABS=[{k:"order",l:"발주하기"},{k:"prods",l:"상품"},{k:"list",l:"발주리스트"},{k:"vendors",l:"거래처"},{k:"settings",l:"설정"}];

  if(screen==="loading") return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.fn,background:`linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 100%)`,color:C.sub2,fontWeight:800}}>로딩 중...</div>;
  if(screen==="splash") return <SplashPage onStart={()=>setScreen("auth")}/>;
  if(screen!=="app"||!user) return <AuthPage onLogin={handleLogin}/>;

  const pages={
    dash:<DashPage orders={orders} products={products} onNav={setPage}/>,
    order:<OrderPage products={products} orders={orders} setOrders={setOrders} vendors={vendors} factories={factories} user={user} onNav={setPage}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} factories={factories} user={user}/>,
    list:<ListPage orders={orders} setOrders={setOrders} products={products} user={user} onNav={setPage}/>,
    vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,
    settings:<SettingsPage user={user} setUser={setUser} vendors={vendors} factories={factories} setFactories={setFactories} onLogout={handleLogout}/>
  };

  return(
    <AppFrame>
      <div style={{maxWidth:520,margin:"0 auto",position:"relative",minHeight:"100vh"}}>
        <div style={{position:"sticky",top:0,zIndex:60,padding:"16px 16px 12px",background:"linear-gradient(180deg, rgba(244,247,251,0.92) 0%, rgba(244,247,251,0.72) 100%)",backdropFilter:"blur(10px)"}}>
          <div style={{background:"rgba(255,255,255,0.78)",border:`1px solid ${C.bdr}`,borderRadius:24,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:C.shadowSm}}>
            <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",padding:0,cursor:"pointer",fontFamily:C.fn,textAlign:"left"}}>
              <div style={{color:C.acc,fontWeight:900,fontSize:12,letterSpacing:"0.18em"}}>D-WORKS</div>
              <div style={{color:C.txt,fontWeight:900,fontSize:18,marginTop:3,letterSpacing:"-0.03em"}}>{page==="dash"?"대시보드":TABS.find(t=>t.k===page)?.l||"D-Works"}</div>
            </button>
            <div style={{textAlign:"right",minWidth:0,paddingLeft:12}}>
              <div style={{color:C.sub2,fontSize:12,fontWeight:800,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.brand ? user.brand : user.name}</div>
              <div style={{color:C.sub,fontSize:11,marginTop:4}}>실무용 MVP</div>
            </div>
          </div>
        </div>

        {loading && <div style={{padding:"0 18px 8px",fontSize:12,color:C.sub2,fontWeight:700}}>데이터 불러오는 중...</div>}
        <div style={{paddingBottom:108}}>{pages[page]||pages.dash}</div>

        <div style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 24px)",maxWidth:496,zIndex:80}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5, 1fr)",gap:8,background:"rgba(255,255,255,0.88)",backdropFilter:"blur(16px)",border:`1px solid ${C.bdr}`,borderRadius:28,padding:"10px 10px 10px",boxShadow:"0 20px 42px rgba(15,23,42,0.14)"}}>
            {TABS.map(t=>(
              <button key={t.k} onClick={()=>setPage(t.k)} style={{border:"none",cursor:"pointer",fontFamily:C.fn,borderRadius:18,padding:"10px 6px",background:page===t.k?`linear-gradient(135deg, ${C.acc}, #5A8EFF)`:"transparent",color:page===t.k?"#fff":C.sub2,transition:"all .18s",fontWeight:page===t.k?900:700,fontSize:11,lineHeight:1.2,boxShadow:page===t.k?"0 12px 26px rgba(53,109,255,0.18)":"none"}}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

