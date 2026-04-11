
import React, { useState, useEffect } from "react";

// ── Kakao Copy & Open ──────────────────────────────────────────
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {}

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
}

async function openKakaoWithOrderText(body) {
  const copied = await copyText(body);

  if (!copied) {
    alert("발주 내용 자동 복사에 실패했습니다. 다시 시도해주세요.");
    return;
  }

  alert("발주 내용이 복사되었습니다.\n카카오톡에서 채팅방을 선택한 뒤 붙여넣기 해주세요.");

  setTimeout(() => {
    window.location.href = "kakaotalk://";
  }, 200);
}

// ── Supabase & API (기존 유지) ─────────────────────────────────
const SB="https://qimgostiseehdnvhmoph.supabase.co", KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";
const ah=t=>({"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"});
const api=async(m,p,t,b)=>{const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined});return r.json();};
const DB={signUp:(e,pw,m)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:m}),signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),signOut:t=>fetch(`${SB}/auth/v1/logout`,{method:"POST",headers:ah(t)}),updateUser:(t,m)=>api("PUT","/auth/v1/user",t,{data:m}),list:(t,tb)=>api("GET",`/rest/v1/${tb}?order=created_at.asc`,t),insert:(t,tb,d)=>api("POST",`/rest/v1/${tb}`,t,d),update:(t,tb,id,d)=>api("PATCH",`/rest/v1/${tb}?id=eq.${id}`,t,d),del:(t,tb,id)=>fetch(`${SB}/rest/v1/${tb}?id=eq.${id}`,{method:"DELETE",headers:ah(t)})};

// ── 유틸 및 상수 (기존 유지) ────────────────────────────────────────────
const CHO=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const getCho=s=>(s||"").split("").map(c=>{const cd=c.charCodeAt(0);return(cd>=44032&&cd<=55203)?CHO[Math.floor((cd-44032)/588)]:c;}).join("");
const match=(t,q)=>{if(!q)return true;const txt=(t||"").toLowerCase(),qry=(q||"").toLowerCase();return txt.includes(qry)||getCho(txt).includes(getCho(qry));};
const C={bg:"#F4F6FA",card:"#FFFFFF",bdr:"#E2E8F0",acc:"#0F172A",txt:"#0F172A",sub:"#94A3B8",sub2:"#64748B",ok:"#0F766E",warn:"#D97706",red:"#DC2626",fn:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif"};
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const fmtW=n=>`${fmtN(Math.round(n||0))}원`;
const CATS=["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const CAT_C={이너:"#0F172A",아우터:"#0F172A",팬츠:"#0F172A",니트:"#0F172A",원피스:"#0F172A",스커트:"#0F172A",기타:"#64748B"};
const VEN_TYPES=["원단","안감","단추","지퍼","심지","기타"];
const VEN_IC={원단:"•",안감:"•",단추:"•",지퍼:"•",심지:"•",기타:"•"};
const VEN_C={원단:"#0F172A",안감:"#0F172A",단추:"#0F172A",지퍼:"#0F172A",심지:"#0F172A",기타:"#64748B"};
const SEASONS=["26SS","26FW","25SS","25FW"];
const MAT_TYPES=["메인원단","부속원단","단추","지퍼","안감","심지","기타"];
const BIZ_TYPES=["다이마루","직기","니트","데님","기타"];
const DASH_NOTICES=["최근 발주 빠른 불러오기 기능 추가","업체별 개별 메모 기능 추가","발주내역 일괄 선택/완료/보관 기능 추가"];

// ── 공통 UI (기존 유지) ──
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const sizeMap={s:{h:34,px:14,fs:12,fw:700},m:{h:48,px:18,fs:14,fw:800},l:{h:52,px:20,fs:15,fw:800}};
  const s=sizeMap[sz]||sizeMap.m;
  const theme={
    p:{bg:C.acc,cl:"#fff",bd:"1px solid transparent",shadow:"0 10px 24px rgba(15,23,42,0.12)"},
    w:{bg:"#fff",cl:C.txt,bd:`1px solid ${C.bdr}`,shadow:"0 6px 18px rgba(15,23,42,0.04)"},
    ok:{bg:C.acc,cl:"#fff",bd:"1px solid transparent",shadow:"0 10px 24px rgba(15,23,42,0.12)"},
    d:{bg:"#EEF2F7",cl:C.sub2,bd:`1px solid ${C.bdr}`,shadow:"none"},
  }[v]||{};
  return <button onClick={onClick} disabled={disabled} style={{
    height:s.h,
    padding:`0 ${s.px}px`,
    background:disabled?"#EEF2F7":theme.bg,
    color:disabled?"#A8B3C4":theme.cl,
    border:disabled?`1px solid ${C.bdr}`:theme.bd,
    borderRadius:18,
    fontSize:s.fs,
    fontWeight:s.fw,
    cursor:disabled?"default":"pointer",
    fontFamily:C.fn,
    display:"inline-flex",
    alignItems:"center",
    justifyContent:"center",
    gap:6,
    width:full?"100%":"auto",
    boxSizing:"border-box",
    lineHeight:1,
    boxShadow:disabled?"none":theme.shadow,
    transition:"all 0.18s ease",
    ...st
  }}>{ch}</button>;
};
function FCard({children,mb=14}){return<div style={{background:"#fff",borderRadius:24,border:`1px solid ${C.bdr}`,marginBottom:mb,boxShadow:"0 10px 30px rgba(15,23,42,0.05)",overflow:"hidden"}}>{children}</div>;}
function FRow({label,children,last,req}){return<div style={{display:"flex",alignItems:"center",minHeight:58,padding:"0 18px",borderBottom:last?"none":`1px solid ${C.bdr}`,position:"relative",gap:12}}><div style={{width:88,fontSize:13,fontWeight:700,color:C.txt,flexShrink:0}}>{label}{req&&<span style={{color:C.sub2,marginLeft:3}}>*</span>}</div><div style={{flex:1,display:"flex",alignItems:"center",minWidth:0}}>{children}</div></div>;}
const FInp=({val,onChange,ph,type="text"})=><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,color:C.txt,fontFamily:C.fn,padding:"0",minWidth:0,textAlign:"right"}}/>;
const FSel=({val,onChange,children,ph})=><select value={val||""} onChange={e=>onChange(e.target.value)} style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,color:val?C.txt:C.sub,fontFamily:C.fn,textAlign:"right",WebkitAppearance:"none",cursor:"pointer"}}>{ph&&<option value="">{ph}</option>}{children}</select>;
const Tag=({ch,c=C.acc})=><span style={{background:(c==="#FFFFFF"?"rgba(255,255,255,0.08)":(c===C.acc?"#F8FAFC":c+"14")),color:c,padding:"6px 11px",borderRadius:999,border:`1px solid ${(c==="#FFFFFF"?"rgba(255,255,255,0.16)":(c===C.acc?C.bdr:c+"24"))}`,fontSize:11,fontWeight:800,whiteSpace:"nowrap",lineHeight:1}}>{ch}</span>;
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:"#fff",borderRadius:24,border:`1px solid ${C.bdr}`,padding:18,boxSizing:"border-box",boxShadow:"0 10px 30px rgba(15,23,42,0.05)",...st}}>{children}</div>;
const Divider=()=><div style={{height:1,background:C.bdr,margin:"14px 0"}}/>;
const G=({h=12})=><div style={{height:h}}/>;
const Empty=({icon,text})=><div style={{textAlign:"center",padding:"46px 20px",color:C.sub}}><div style={{fontSize:28,marginBottom:10,opacity:0.8}}>{icon}</div><div style={{fontSize:14,fontWeight:700,color:C.sub2}}>{text}</div></div>;
function Field({label,children,req}){return<div style={{marginBottom:16}}><div style={{fontSize:12,fontWeight:800,color:C.txt,marginBottom:8,letterSpacing:"0.01em"}}>{label}{req&&<span style={{color:C.sub2,marginLeft:3}}>*</span>}</div>{children}</div>;}
function TxtInp({val,onChange,ph,type="text",onKeyDown}){return<div style={{display:"flex",alignItems:"center",border:`1px solid ${C.bdr}`,borderRadius:18,background:"#fff",boxShadow:"0 6px 18px rgba(15,23,42,0.03)"}}><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} onKeyDown={onKeyDown} style={{flex:1,border:"none",outline:"none",padding:"15px 16px",fontSize:14,color:C.txt,fontFamily:C.fn,background:"transparent"}}/></div>;}
function DropSel({val,onChange,children,ph}){return<div style={{position:"relative",border:`1px solid ${C.bdr}`,borderRadius:18,background:"#fff",boxShadow:"0 6px 18px rgba(15,23,42,0.03)"}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",padding:"15px 16px",fontSize:14,color:val?C.txt:C.sub,fontFamily:C.fn,background:"transparent",WebkitAppearance:"none",cursor:"pointer"}}>{ph&&<option value="">{ph}</option>}{children}</select><span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:C.sub,pointerEvents:"none",fontSize:11}}>∨</span></div>;}
function StepBar({cur,total=4}){return<div style={{display:"flex",gap:8,marginBottom:22}}>{Array.from({length:total},(_,i)=><div key={i} style={{flex:i===cur?2:1,height:6,borderRadius:999,background:i<=cur?C.acc:"#E7ECF3",transition:"all 0.3s"}}/>)}</div>;}
function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(15,23,42,0.48)",display:"flex",alignItems:"flex-end",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"28px 28px 0 0",padding:"0 20px 40px",width:"100%",maxHeight:"88vh",overflowY:"auto",boxSizing:"border-box",fontFamily:C.fn,maxWidth:480,margin:"0 auto",boxShadow:"0 -16px 60px rgba(15,23,42,0.16)"}}>
        <div style={{width:42,height:5,background:"#D8E0EA",borderRadius:999,margin:"12px auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <span style={{fontWeight:900,fontSize:18,color:C.txt}}>{title}</span>
          <button onClick={onClose} style={{background:"#F7F9FC",border:`1px solid ${C.bdr}`,color:C.sub2,cursor:"pointer",width:34,height:34,borderRadius:12,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.fn}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function LineChart({data}){
  if(!data||data.length<2)return<div style={{height:90,display:"flex",alignItems:"center",justifyContent:"center",color:C.sub,fontSize:12}}>데이터 없음</div>;
  const W=320,H=96,p=12,vs=data.map(d=>d.v),mn=Math.min(...vs),mx=Math.max(...vs),rng=mx-mn||1;
  const pts=data.map((d,i)=>[(p+(i/(data.length-1))*(W-p*2)),(H-p-((d.v-mn)/rng)*(H-p*2))]);
  const area=`M ${pts[0][0]},${H-p} ${pts.map(([x,y])=>`L ${x},${y}`).join(" ")} L ${pts[pts.length-1][0]},${H-p} Z`;
  return<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}><path d={area} fill="rgba(15,23,42,0.08)"/><polyline points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke={C.acc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>{pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3.5" fill={C.acc}/>)}</svg>;
}

// ── Splash 및 인증 ──
function SplashPage({onStart}){
  const [slide,setSlide]=useState(0);
  const slides=[{title:"발주 업무,\n이제 자동으로",desc:"수기 계산·카카오톡 개별 발주\n이제 그만!",icon:"📋"},{title:"BOM 기반\n소요량 자동 계산",desc:"상품별 원부자재를 등록하면\n소요량이 자동 계산됩니다.",icon:"🧮"},{title:"거래처별\n원클릭 발송",desc:"업체별 발주서를 자동 생성하고\n카카오톡으로 즉시 전달합니다.",icon:"💬"},{title:"발주 이력\n데이터화",desc:"모든 발주가 DB에 저장되어\n언제든 조회 가능합니다.",icon:"📊"}];
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
  const [f,setF]=useState({company:"",brand:"",name:"",position:"",tel:"",email:"",pw:"",pw2:"",address:"",agree:false, keepLoggedIn: true});
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
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn}}>
      <div style={{background:"#fff",padding:"44px 20px 20px",borderBottom:`1px solid ${C.bdr}`}}>
        <div style={{fontSize:30,fontWeight:900,color:C.acc,letterSpacing:1}}>D-Works</div>
        <div style={{fontSize:13,color:C.sub,marginTop:4}}>의류 생산 발주 자동화 서비스</div>
      </div>
      <div style={{padding:"20px 20px 40px",maxWidth:480,margin:"0 auto"}}>
        <div style={{display:"flex",borderBottom:`1.5px solid ${C.bdr}`,marginBottom:20}}>
          {[["in","로그인"],["up","회원가입"]].map(([k,l])=><button key={k} onClick={()=>{setTab(k);setErr("");}} style={{flex:1,padding:"11px 0",background:"none",border:"none",borderBottom:`2.5px solid ${tab===k?C.acc:"transparent"}`,color:tab===k?C.acc:C.sub,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:C.fn,marginBottom:-2}}>{l}</button>)}
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
          <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", marginBottom:10, padding:"4px 0"}}>
            <input type="checkbox" checked={f.keepLoggedIn} onChange={e=>sf("keepLoggedIn")(e.target.checked)} style={{width:16, height:16}} />
            <span style={{fontSize:13, fontWeight:600, color:C.sub2}}>로그인 상태 유지</span>
          </label>
        )}
        {tab==="up" && (
          <>
            <Field label="비밀번호 확인" req><TxtInp val={f.pw2} onChange={sf("pw2")} ph="비밀번호 재입력" type="password"/></Field>
            <Field label="주소"><TxtInp val={f.address} onChange={sf("address")} ph="사무실 주소"/></Field>
            <div style={{marginTop:24, padding:14, background:"#fff", border:`1px solid ${C.bdr}`, borderRadius:10}}>
              <div style={{fontSize:12, color:C.sub2, lineHeight:1.6, height:80, overflowY:"auto", marginBottom:10}}><strong>[개인정보 수집 및 이용 안내]</strong><br/>1. 수기 계산 및 발주 업무 자동화를 위해 업체명, 성함, 연락처를 수집합니다.</div>
              <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer"}}>
                <input type="checkbox" checked={f.agree} onChange={e=>sf("agree")(e.target.checked)} style={{width:16, height:16}} />
                <span style={{fontSize:13, fontWeight:600, color:C.txt}}>내용을 확인했으며 동의합니다 (필수)</span>
              </label>
            </div>
          </>
        )}
        {err&&<div style={{color:C.red,fontSize:13,marginTop:16,marginBottom:12}}>{err}</div>}
        <Btn ch={loading?(tab==="in"?"로그인 중...":"가입 중..."):(tab==="in"?"로그인":"가입하기")} onClick={submit} full sz="l" disabled={loading} st={{borderRadius:10,height:50,marginTop:20}}/>
      </div>
    </div>
  );
}

// ── 대시보드 ──
function DashPage({orders,products,onNav}){
  const td=today();
  const tO=orders.filter(o=>o.date===td);
  const mQ=orders.filter(o=>o.date?.slice(0,7)===td.slice(0,7)).reduce((s,o)=>s+(o.items||[]).reduce((ss,i)=>ss+(i.qty||0),0),0);
  const delayed=orders.filter(o=>o.status==="지연");
  const mAmt=orders.filter(o=>o.date?.slice(0,7)===td.slice(0,7)).reduce((s,o)=>s+(Number(o.total_amount)||0),0);
  const chart=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const ds=d.toISOString().slice(0,10);return{label:ds.slice(5),v:orders.filter(o=>o.date===ds).reduce((s,o)=>s+(o.items||[]).reduce((ss,ii)=>ss+(ii.qty||0),0),0)};});
  return(
    <div style={{padding:"18px 14px 94px"}}>
      <Card st={{background:"linear-gradient(135deg,#101828 0%, #0F172A 50%, #172554 100%)",border:"none",color:"#fff",padding:20,marginBottom:16,boxShadow:"0 18px 40px rgba(15,23,42,0.18)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:14}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:900,fontSize:20,lineHeight:1.3,letterSpacing:"-0.03em",maxWidth:220}}>복잡한 발주를 더 빠르고 정확하게</div>
          </div>
          <div style={{minWidth:92,padding:"12px 14px",borderRadius:22,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.08)",textAlign:"right",backdropFilter:"blur(12px)"}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.68)",fontWeight:700}}>오늘 기준</div>
            <div style={{marginTop:4,fontSize:16,fontWeight:900}}>04/05</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:18,flexWrap:"wrap"}}>
          <Tag ch={`오늘 발주 ${tO.length}건`} c="#FFFFFF" />
          <Tag ch={`미출고 ${delayed.length}건`} c="#FFFFFF" />
          <Tag ch={`월간 ${fmtN(mQ)}매`} c="#FFFFFF" />
          <Tag ch={`월간 ${fmtW(mAmt)}`} c="#FFFFFF" />
        </div>
      </Card>
      <Card st={{marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:800,marginBottom:8,color:C.txt}}>📢 제작사 공지</div>
        <div style={{fontSize:12,lineHeight:1.7,color:C.sub2}}>{DASH_NOTICES.map((n,i)=><div key={i}>• {n}</div>)}</div>
      </Card>
      <Card st={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:C.txt}}>월간 발주량</div>
            <div style={{marginTop:8,fontSize:18,fontWeight:900,color:C.txt}}>{fmtN(mQ)}매</div>
            <div style={{marginTop:4,fontSize:12,fontWeight:800,color:C.sub2}}>예상 발주금액 {fmtW(mAmt)}</div>
          </div>
          <Tag ch="최근 7일 기준" c={C.ok}/>
        </div>
        <LineChart data={chart}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>{chart.filter((_,i)=>i%2===0).map(d=><span key={d.label} style={{fontSize:10,color:C.sub2,fontWeight:700}}>{d.label}</span>)}</div>
      </Card>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontWeight:800,fontSize:14,color:C.txt}}>지연 발주</div>
          <Tag ch={`총 ${delayed.length}건`} c={C.warn}/>
        </div>
        {delayed.length===0?<div style={{textAlign:"center",padding:"18px 0",color:C.sub2,fontSize:13,fontWeight:700}}>지연 발주가 없습니다</div>:<>
          {delayed.slice(0,5).flatMap(o=>(o.items||[]).map((it,j)=>{const p=products.find(x=>x.id===it.pid);return(
            <div key={`${o.id}-${j}`} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${C.bdr}`}}>
              <div style={{minWidth:0,flex:1,paddingRight:12}}>
                <div style={{fontWeight:800,fontSize:13,color:C.txt,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p?.name||"-"}</div>
                <div style={{marginTop:4,fontSize:11,color:C.sub2}}>{it.color} · {p?.factory||"-"}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                <span style={{fontSize:13,fontWeight:900,color:C.txt}}>{fmtN(it.qty)}장</span>
                <Tag ch="지연" c={C.warn}/>
              </div>
            </div>
          );}))}
        </>}
      </Card>
    </div>
  );
}
function OrderPage({products,orders,setOrders,vendors,factories,user}){
  const [step,setStep]=useState(1);
  const [items,setItems]=useState([]);
  const [memo,setMemo]=useState("");
  const [vendorMemos,setVendorMemos]=useState({});
  const [search,setSearch]=useState("");
  const [selProd,setSelProd]=useState(null);
  const [selColor,setSelColor]=useState("");
  const [qty,setQty]=useState("");
  const [sending,setSending]=useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [loadedRecentInfo,setLoadedRecentInfo]=useState(null);

  const DRAFT="dworks_draft";
  const filtered=products.filter(p=>match(p.name,search)||match(p.season,search));
  const recentOrders = [...orders]
    .filter(o => !o?.is_archived && Array.isArray(o?.items) && o.items.length > 0)
    .sort((a,b)=>new Date(b.ts||b.date||0)-new Date(a.ts||a.date||0))
    .slice(0,3);

  function getOrderSummary(order){
    const names = Array.from(new Set((order.items||[]).map(it=>products.find(x=>x.id===it.pid)?.name||"-")));
    const totalQty = (order.items||[]).reduce((s,it)=>s+(it.qty||0),0);
    return {
      title: names.join(", "),
      totalQty,
      itemCount: (order.items||[]).length,
    };
  }

  function loadRecentOrder(order){
    const draftItems = (order.items||[]).map(it=>({pid:it.pid,color:it.color,qty:Number(it.qty)||0}));
    setItems(draftItems);
    setSearch("");
    setSelProd(null);
    setSelColor("");
    setQty("");
    setStep(1);
    setLoadedRecentInfo({
      orderId: order.id,
      date: order.date,
      summary: getOrderSummary(order),
    });
    try{
      localStorage.setItem(DRAFT, JSON.stringify({items:draftItems}));
    }catch{}
  }
  function addItem(){if(!selProd||!selColor||!qty){alert("상품·색상·수량을 입력하세요");return;}const idx=items.findIndex(i=>i.pid===selProd.id&&i.color===selColor);if(idx>=0)setItems(p=>p.map((it,i)=>i===idx?{...it,qty:it.qty+Number(qty)}:it));else setItems(p=>[...p,{pid:selProd.id,color:selColor,qty:Number(qty)}]);setSelProd(null);setSelColor("");setQty("");setSearch("");}

  function buildOrderBody({ vendor, groupedProducts, vendorMemoText = "" }) {
    const companyName = user?.company || "디자인워커스";
    let body = `[D-Works 발주서]\n`;
    body += `${vendor.name} 담당자님 안녕하세요.\n\n`;
    body += `업체명: ${companyName}\n\n`;

    Object.values(groupedProducts).forEach(product => {
      body += `■ 상품명: ${product.productName}\n`;
      product.lines.forEach((line, idx) => {
        body += `${idx + 1}. ${line.mat}\n`;
        body += `   - 컬러: ${line.color}\n`;
        body += `   - 수량: ${fmtN(line.soyo)}${line.unit}\n`;
        if (line.unitPrice > 0) {
          body += `   - 단가: ${fmtW(line.unitPrice)}\n`;
          body += `   - 금액: ${fmtW(line.amount)}\n`;
        }
      });
      const productAmount = product.lines.reduce((s, line) => s + (line.amount || 0), 0);
      if (productAmount > 0) body += `   → 상품 합계: ${fmtW(productAmount)}\n`;
      body += `\n`;
    });

    const firstProduct = Object.values(groupedProducts)[0];
    body += `■ 입고처\n`;
    body += `${firstProduct?.factory || "-"}\n`;
    body += `주소: ${factories?.find(f => f.name === firstProduct?.factory)?.address || "-"}\n`;
    body += `연락처: ${firstProduct?.factoryTel || "-"}\n`;

    const totalAmount = Object.values(groupedProducts).reduce((sum, product) => sum + product.lines.reduce((s, line) => s + (line.amount || 0), 0), 0);
    if (totalAmount > 0) body += `\n■ 거래처 예상 합계\n${fmtW(totalAmount)}\n`;

    if (memo || vendorMemoText) {
      body += `\n■ 요청 및 전달사항\n`;
      if (memo) body += `[공통]\n${memo}\n`;
      if (vendorMemoText) body += `${memo ? `\n` : ``}[업체별]\n${vendorMemoText}\n`;
    }

    body += `\n감사합니다.\nD-Works`;
    return body;
  }

  function generatePreview() {
    if (!items.length) {
      alert("발주 항목 추가");
      return;
    }
    const venMap = {};
    for (const it of items) {
      const prod = products.find(x => x.id === it.pid);
      if (!prod) continue;
      const bomList = prod.colorBom?.[it.color] || prod.bom || [];
      for (const b of bomList) {
        const ven = vendors.find(v => v.id === b.vid);
        if (!ven) continue;
        const soyo = Math.round(b.amt * it.qty * 100) / 100;
        if (!venMap[ven.id]) {
          venMap[ven.id] = {
            vendor: ven,
            products: {}
          };
        }
        const vendorGroup = venMap[ven.id];
        if (!vendorGroup.products[prod.name]) {
          vendorGroup.products[prod.name] = {
            productName: prod.name,
            factory: prod.factory || "-",
            factoryTel: prod.factoryTel || "-",
            lines: []
          };
        }
        const unitPrice = Number(b.price || 0);
        const amount = Math.round(soyo * unitPrice);
        vendorGroup.products[prod.name].lines.push({
          mat: b.mat || "-",
          color: b.color || it.color,
          soyo,
          unit: b.unit || "yd",
          type: b.type || "기타",
          unitPrice,
          amount
        });
      }
    }
    const targets = Object.values(venMap);
    if (!targets.length) {
      alert("발송할 거래처가 없습니다.");
      return;
    }
    const pData = targets.map(({ vendor, products: groupedProducts }) => {
      const vendorMemoText = vendorMemos[vendor.id] || "";
      const totalAmount = Object.values(groupedProducts).reduce((sum, product) => sum + product.lines.reduce((s, line) => s + (line.amount || 0), 0), 0);
      return {
        vendor,
        groupedProducts,
        vendorMemo: vendorMemoText,
        totalAmount,
        body: buildOrderBody({ vendor, groupedProducts, vendorMemoText })
      };
    });
    setPreviewData(pData);
    setShowPreview(true);
  }

  function handleVendorMemoChange(vendorId, value) {
    setVendorMemos(prev => ({ ...prev, [vendorId]: value }));
    setPreviewData(prev => prev.map(d => {
      if (d.vendor.id !== vendorId) return d;
      const nextBody = buildOrderBody({ vendor: d.vendor, groupedProducts: d.groupedProducts, vendorMemoText: value });
      return { ...d, vendorMemo: value, body: nextBody };
    }));
  }

  function calcOrderTotalAmount(groupItems){
    return groupItems.reduce((sum,it)=>{
      const prod = products.find(x=>x.id===it.pid);
      if(!prod) return sum;
      const bomList = prod.colorBom?.[it.color] || prod.bom || [];
      const itemAmount = bomList.reduce((s,b)=>s + ((Number(b.amt)||0) * (Number(it.qty)||0) * (Number(b.price)||0)), 0);
      return sum + itemAmount;
    },0);
  }

  async function confirmOrder() {
    setSending(true);
    const groupedByPid = items.reduce((acc, it) => { if(!acc[it.pid]) acc[it.pid] = []; acc[it.pid].push(it); return acc; }, {});
    const ts = new Date().toISOString(), d = today(), newOrders = [];
    for(const [pid, groupItems] of Object.entries(groupedByPid)){
      const totalAmount = Math.round(calcOrderTotalAmount(groupItems));
      const o = { items: groupItems, status: "진행중", date: d, ts, is_archived:false, archived_at:null, total_amount: totalAmount };
      try{
        if(!user?.token) { alert("로그인 정보가 없습니다."); setSending(false); return; }
        const r = await DB.insert(user.token, "orders", {...o, user_id: user.id});
        if(r.error || r.code || !Array.isArray(r) || r.length === 0) { alert(`DB 에러: ${r.message}`); setSending(false); return; }
        newOrders.push(r[0]);
      }catch(e){ alert("네트워크 에러"); setSending(false); return; }
    }
    setOrders(p => [...newOrders, ...p]);
    try{localStorage.removeItem(DRAFT);}catch{}
    setSending(false);
    setShowPreview(false);
    setStep(3);
  }

  function reset(){setStep(1);setItems([]);setSearch("");setSelProd(null);setSelColor("");setQty("");setMemo("");setVendorMemos({});setPreviewData([]);setShowPreview(false);setLoadedRecentInfo(null);}
  if(step===3)return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",padding:24}}><div style={{fontSize:56,marginBottom:14}}>✅</div><div style={{fontWeight:900,fontSize:22,marginBottom:8}}>발주 완료!</div><div style={{color:C.sub,marginBottom:28,fontSize:13}}>{items.length}개 상품 발주</div><Btn ch="+ 새 발주 입력" onClick={reset} sz="l" st={{borderRadius:12}}/></div>;
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:4}}>{step===1?"발주 입력":"발주서 확인"}</div>
      <div style={{color:C.sub,fontSize:12,marginBottom:14}}>기본 정보를 입력해 주세요</div>
      <StepBar cur={step-1}/>
      {step===1&&recentOrders.length>0&&<Card st={{marginBottom:14,background:"#FFF",border:`1px solid ${C.bdr}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontWeight:800,fontSize:13,color:C.txt}}>최근 발주 빠른 불러오기</div>
          <Tag ch={`${recentOrders.length}건`} c={C.sub2}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {recentOrders.map((ro,idx)=>{
            const s=getOrderSummary(ro);
            return <div key={ro.id||idx} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,padding:"10px 12px",border:`1px solid ${C.bdr}`,borderRadius:14,background:"#F8FAFC"}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:800,color:C.txt,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.title}</div>
                <div style={{fontSize:11,color:C.sub2,marginTop:4}}>{ro.date||"-"} · 품목 {s.itemCount}개 · 총 {fmtN(s.totalQty)}장</div>
              </div>
              <Btn ch="불러오기" v="w" sz="s" onClick={()=>loadRecentOrder(ro)} st={{flexShrink:0}}/>
            </div>
          })}
        </div>
      </Card>}
      {step===1&&loadedRecentInfo&&items.length>0&&<div style={{marginBottom:12,padding:"12px 14px",background:"#EEF2FF",border:`1px solid #C7D2FE`,borderRadius:14}}>
        <div style={{fontSize:12,fontWeight:800,color:C.acc}}>최근 발주를 불러왔습니다</div>
        <div style={{fontSize:11,color:C.sub2,marginTop:4}}>{loadedRecentInfo.date||"-"} · {loadedRecentInfo.summary?.title||"-"} · 총 {fmtN(loadedRecentInfo.summary?.totalQty||0)}장</div>
      </div>}
      {step===1&&<>
        <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>발주 추가</div>
        <Card st={{marginBottom:12}}>
          <Field label="상품명"><div style={{position:"relative"}}><TxtInp val={search} onChange={v=>{setSearch(v);if(selProd&&v!==selProd.name)setSelProd(null);}} ph="상품명 초성 검색 (예: 골지 / ㄱㅈ)"/>{search&&!selProd&&filtered.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:8,zIndex:50,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:160,overflowY:"auto"}}>{filtered.map(p=><div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);setSelColor("");}} style={{padding:"10px 14px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer"}}><div style={{fontWeight:600,fontSize:13}}>{p.name}</div><div style={{color:C.sub,fontSize:11,marginTop:2}}>{p.season} · {(p.colors||[]).join(", ")}</div></div>)}</div>}</div></Field>
          <Field label="색상"><DropSel val={selColor} onChange={setSelColor} ph="색상 선택">{(selProd?.colors||[]).map(c=><option key={c} value={c}>{c}</option>)}</DropSel></Field>
          <Field label="수량"><TxtInp val={qty} onChange={setQty} ph="수량 입력" type="number"/></Field>
        </Card>
        <Btn ch="+ 발주 리스트에 추가" full onClick={addItem} disabled={!selProd||!selColor||!qty} st={{marginBottom:18}}/>
        <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>발주 리스트</div>
        <Card st={{marginBottom:18}}>
          {items.length===0?<div style={{padding:"16px 0",color:C.sub,fontSize:12,textAlign:"center"}}>추가된 항목 없음</div>:items.map((it,i)=>{
            const p=products.find(x=>x.id===it.pid);
            return (
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.bdr}`}}>
                <div style={{fontSize:13}}><span style={{fontWeight:700}}>{p?.name}</span> / {it.color}</div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="number" value={it.qty||""} onChange={e=>{const v = parseInt(e.target.value)||0;setItems(prev=>prev.map((item,idx)=>idx===i?{...item,qty:v}:item));}} style={{width:50, padding:"4px 6px", border:`1px solid ${C.bdr}`, borderRadius:6, textAlign:"right", fontSize:13, fontWeight:700, color:C.acc, outline:"none"}} />
                  <span style={{fontWeight:700,fontSize:13,color:C.txt}}>장</span>
                  <button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:16,marginLeft:4}}>✕</button>
                </div>
              </div>
            );
          })}
        </Card>
        <div style={{display:"flex",gap:10}}><Btn ch="임시저장" v="w" full st={{flex:1}} onClick={()=>{if(!items.length)return;try{localStorage.setItem(DRAFT,JSON.stringify({items}));alert(`✅ 임시저장 완료!`);}catch{}}}/><Btn ch="다음" full st={{flex:2}} onClick={()=>items.length?setStep(2):alert("항목 추가 필요")} disabled={!items.length}/></div>
      </>}
      {step===2&&<>
        <Card st={{marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>발주 내역</div>
          {items.map((it,i)=>{const p=products.find(x=>x.id===it.pid);return<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.bdr}`}}><div><div style={{fontWeight:700,fontSize:13}}>{p?.name}</div><div style={{color:C.sub,fontSize:11,marginTop:2}}>{it.color} · {p?.factory}</div></div><span style={{fontWeight:800,color:C.acc,fontSize:15}}>{fmtN(it.qty)}장</span></div>;})}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:10}}><span style={{fontWeight:700,fontSize:13}}>총 수량</span><span style={{fontWeight:900,color:C.acc,fontSize:17}}>{fmtN(items.reduce((s,it)=>s+it.qty,0))}장</span></div>
        </Card>
        <div style={{marginBottom:16}}><div style={{fontWeight:700,fontSize:13,marginBottom:8,color:C.txt}}>공통 전달사항 (선택)</div><textarea value={memo} onChange={e=>setMemo(e.target.value)} placeholder="예: 소량 발주건으로 10야드는 본사로, 나머지는 공장으로 배송 부탁드립니다." style={{width:"100%",padding:"12px",border:`1px solid ${C.bdr}`,borderRadius:8,fontSize:13,fontFamily:C.fn,outline:"none",resize:"vertical",minHeight:"80px",boxSizing:"border-box"}}/></div>
        <div style={{display:"flex",gap:10}}><Btn ch="← 수정" v="w" full st={{flex:1}} onClick={()=>setStep(1)}/><Btn ch={"발주 미리보기"} full st={{flex:2}} onClick={generatePreview} /></div>
      </>}
      {showPreview && (
        <Sheet title="발주 내용 최종 확인" onClose={() => setShowPreview(false)}>
          <div style={{ fontSize: 13, color: C.sub, marginBottom: 16 }}>아래 내용을 거래처별로 확인한 뒤 카카오톡으로 보내거나 저장할 수 있습니다.</div>
          <div style={{ maxHeight: '55vh', overflowY: 'auto', marginBottom: 16, paddingRight: 4 }}>
            {previewData.map((d, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 16,
                  border: `1px solid ${C.bdr}`,
                  borderRadius: 10,
                  padding: 14,
                  background: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 13,
                    marginBottom: 10,
                    color: C.acc,
                    borderBottom: `1px dashed ${C.bdr}`,
                    paddingBottom: 8
                  }}
                >
                  📦 받는 사람: {d.vendor.name}
                  {d.vendor.tel && <span style={{ fontWeight: 500, color: C.sub }}> ({d.vendor.tel})</span>}
                </div>
                {Object.values(d.groupedProducts).map((product, pIdx) => (
                  <div key={pIdx} style={{ marginBottom: 14 }}>
                    <div style={{ fontWeight: 800, fontSize: 12, color: C.txt, marginBottom: 8 }}>
                      [상품명] {product.productName}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {product.lines.map((line, lIdx) => (
                        <div key={lIdx} style={{background:"#F8FAFC",border:`1px solid ${C.bdr}`,borderRadius:8,padding:"8px 10px"}}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.txt }}>{lIdx + 1}. {line.mat}</div>
                          <div style={{ fontSize: 11, color: C.sub2, marginTop: 3 }}>{line.color} · {fmtN(line.soyo)}{line.unit}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{fontSize:11,color:C.sub2,background:"#F8FAFC",borderRadius:8,padding:"10px 12px",border:`1px solid ${C.bdr}`,marginBottom:12}}>
                  <div style={{ fontWeight: 700, color: C.txt, marginBottom: 6 }}>[입고처]</div>
                  <div>{Object.values(d.groupedProducts)[0]?.factory || "-"}</div>
                  <div>주소 : {factories?.find(f => f.name === Object.values(d.groupedProducts)[0]?.factory)?.address || "-"}</div>
                  <div>연락처 : {Object.values(d.groupedProducts)[0]?.factoryTel || "-"}</div>
                  {memo && <>
                    <div style={{ marginTop: 8, fontWeight: 700, color: C.txt }}>[공통 전달사항]</div>
                    <div style={{ whiteSpace: "pre-wrap" }}>{memo}</div>
                  </>}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.txt, marginBottom: 8 }}>업체별 메모 (선택)</div>
                  <textarea
                    value={vendorMemos[d.vendor.id] || ""}
                    onChange={e => handleVendorMemoChange(d.vendor.id, e.target.value)}
                    placeholder="이 거래처에만 전달할 별도 요청사항을 입력하세요"
                    style={{width:"100%",padding:"12px",border:`1px solid ${C.bdr}`,borderRadius:8,fontSize:13,fontFamily:C.fn,outline:"none",resize:"vertical",minHeight:"78px",boxSizing:"border-box"}}
                  />
                </div>
                {d.totalAmount > 0 && (
                  <div style={{fontSize:12,fontWeight:800,color:C.txt,marginBottom:12,textAlign:"right"}}>
                    거래처 예상 합계: {fmtW(d.totalAmount)}
                  </div>
                )}
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <Btn ch="카카오톡으로 보내기" full onClick={() => openKakaoWithOrderText(d.body)} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn ch="취소" v="w" full st={{ flex: 1 }} onClick={() => setShowPreview(false)} />
            <Btn ch={sending ? "저장 중..." : "최종 저장하기"} full st={{ flex: 2, background: C.acc }} onClick={confirmOrder} disabled={sending} />
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
  const [copySourceColor,setCopySourceColor]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  const getUnit=t=>["단추","지퍼","기타"].includes(t)?"개":"yd";
  let filtered=catF==="전체"?products:products.filter(p=>p.category===catF);
  filtered = filtered.filter(p=>match(p.name,prodSearch));
  if(sortOrd==="최신순") filtered=[...filtered].reverse();
  else if(sortOrd==="시즌별") filtered=[...filtered].sort((a,b)=>(b.season||"").localeCompare(a.season||""));
  else if(sortOrd==="공장별") filtered=[...filtered].sort((a,b)=>(a.factory||"").localeCompare(b.factory||""));
  function openAdd(){setF({name:"",category:"",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],colorBom:{},imageUrl:""});setCi("");setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");setCopySourceColor("");setSheetStep(0);setSelColor("");setEditBomId(null);setSheet(true);}
  function openEdit(p){setF({...p,colors:[...(p.colors||[])],colorBom:{...(p.colorBom||{})},imageUrl:p.imageUrl||""});setCi("");setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");setCopySourceColor("");setSheetStep(0);setSelColor("");setEditBomId(null);setSheet(true);}
  function copyProd(p){
    setF({...p, id: undefined, name: p.name + " (복사본)", colors: [...(p.colors||[])], colorBom: JSON.parse(JSON.stringify(p.colorBom||{})), imageUrl: p.imageUrl||""});
    setCi(""); setBr({type:"",mat:"",amt:"",vid:"",price:"",color:""}); setVenSearch(""); setCopySourceColor(""); setSheetStep(0); setSelColor(""); setEditBomId(null); setSheet(true);
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
    setSelColor(f.colors[0]);setCopySourceColor("");setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");setEditBomId(null);setSheetStep(1);
  }
  function addBom(){
    if(!br.mat||!br.amt)return;
    if(editBomId){setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:(p.colorBom[selColor]||[]).map(b=>b.id===editBomId?{...b,...br,amt:Number(br.amt)}:b)}}));setEditBomId(null);}
    else{setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:[...(p.colorBom[selColor]||[]),{...br,id:uid(),amt:Number(br.amt),unit:getUnit(br.type)}]}}));}
    setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");
  }
  function copyBomFromColor(){
    if(!selColor){alert("복사할 현재 컬러를 선택하세요");return;}
    if(!copySourceColor){alert("불러올 기준 컬러를 선택하세요");return;}
    const srcBom = f.colorBom?.[copySourceColor] || [];
    if(srcBom.length===0){alert("기준 컬러에 등록된 원부자재가 없습니다");return;}
    const hasCurrent = (f.colorBom?.[selColor] || []).length > 0;
    if(hasCurrent){
      const ok = window.confirm(`${copySourceColor} 컬러의 원부자재를 ${selColor} 컬러로 불러오시겠습니까?\n현재 컬러에 등록된 원부자재는 덮어쓰기 됩니다.`);
      if(!ok) return;
    }else{
      const ok = window.confirm(`${copySourceColor} 컬러의 원부자재를 ${selColor} 컬러로 불러오시겠습니까?\n색상명은 ${selColor} 기준으로 자동 변경됩니다.`);
      if(!ok) return;
    }
    const copied = srcBom.map(b => ({
      ...b,
      id: uid(),
      color: selColor
    }));
    setF(p => ({
      ...p,
      colorBom: {
        ...p.colorBom,
        [selColor]: copied
      }
    }));
    setEditBomId(null);
    setBr({type:"",mat:"",amt:"",vid:"",price:"",color:""});
    setVenSearch("");
    setCopySourceColor("");
    alert(`${copySourceColor} 컬러 구성을 ${selColor} 컬러에 불러왔습니다.`);
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
        <div style={{flex:1}}><TxtInp val={prodSearch} onChange={setProdSearch} ph="상품명 초성 검색 (예: 골지 / ㄱㅈ)"/></div>
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
            {f.colors.map(c=>{const cnt=(f.colorBom[c]||[]).length;const act=selColor===c;return<button key={c} onClick={()=>{setSelColor(c);setCopySourceColor("");setEditBomId(null);setBr({type:"",mat:"",amt:"",vid:"",price:"",color:""});setVenSearch("");}} style={{padding:"8px 16px",borderRadius:20,flexShrink:0,whiteSpace:"nowrap",border:`2px solid ${act?C.acc:C.bdr}`,background:act?C.acc:"#fff",color:act?"#fff":C.sub2,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:C.fn,display:"flex",alignItems:"center",gap:6}}>{c}{cnt>0&&<span style={{background:act?"rgba(255,255,255,0.25)":"#EEF2FF",color:act?"#fff":C.acc,borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{cnt}</span>}</button>;})}
          </div>
          {selColor?<>
            {f.colors.filter(c=>c!==selColor && (f.colorBom[c]||[]).length>0).length>0 && (
              <div style={{background:"#F8FAFC",border:`1px solid ${C.bdr}`,borderRadius:12,padding:"12px 14px",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:800,color:C.txt,marginBottom:8}}>
                  📋 다른 컬러 원부자재 불러오기
                </div>
                <div style={{fontSize:11,color:C.sub2,marginBottom:10}}>
                  규격·요척·거래처는 그대로 복사하고, 소재 색상은 현재 컬러({selColor})로 자동 변경됩니다.
                </div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}>
                    <DropSel val={copySourceColor} onChange={setCopySourceColor} ph="기준 컬러 선택">
                      {f.colors
                        .filter(c=>c!==selColor && (f.colorBom[c]||[]).length>0)
                        .map(c=><option key={c} value={c}>{c}</option>)}
                    </DropSel>
                  </div>
                  <Btn ch="불러오기" v="w" onClick={copyBomFromColor} disabled={!copySourceColor} st={{height:48,borderRadius:14}}/>
                </div>
              </div>
            )}
            {curBom.length>0&&<div style={{marginBottom:10}}>{curBom.map(b=>{const ven=vendors.find(v=>v.id===b.vid);const isE=editBomId===b.id;return<div key={b.id} style={{background:isE?C.acc+"10":"#F8F9FB",borderRadius:8,padding:"9px 12px",marginBottom:6,border:`1.5px solid ${isE?C.acc:C.bdr}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{flex:1,minWidth:0}}><span style={{background:C.acc+"15",color:C.acc,borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700,marginRight:6}}>{b.type||"원단"}</span><span style={{fontWeight:700,fontSize:12}}>{b.mat}</span>{b.color&&<span style={{background:C.sub+"18",color:C.sub2,borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:600,marginLeft:5}}>{b.color}</span>}<span style={{color:C.sub,fontSize:11,marginLeft:6}}>{b.amt}{b.unit||"yd"}</span>{ven&&<span style={{color:C.sub,fontSize:11,marginLeft:4}}>· {ven.name}</span>}</div><div style={{display:"flex",gap:6,flexShrink:0}}><button onClick={()=>{if(isE){setEditBomId(null);setBr({type:"",mat:"",amt:"",vid:"",price:"",color:""});setVenSearch("");}else{setEditBomId(b.id);setBr({type:b.type||"",mat:b.mat,amt:String(b.amt),vid:b.vid||"",price:String(b.price||""),color:b.color||""});const ev=vendors.find(v=>v.id===b.vid);setVenSearch(ev?.name||"");}}} style={{background:"none",border:"none",color:isE?C.acc:C.sub,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:C.fn}}>{isE?"취소":"수정"}</button><button onClick={()=>{setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:(p.colorBom[selColor]||[]).filter(x=>x.id!==b.id)}}));if(isE){setEditBomId(null);setBr({type:"",mat:"",amt:"",vid:"",price:"",color:""});setVenSearch("");}}} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:14}}>✕</button></div></div></div>;})}</div>}
            <div style={{background:"#F0F4FF",borderRadius:12,padding:"14px",marginBottom:12,border:`1px dashed ${C.acc}60`}}>
              <div style={{fontSize:12,fontWeight:700,color:C.acc,marginBottom:10}}>✏️ [{selColor}] 원부자재 {editBomId?"수정":"추가"}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>{MAT_TYPES.map(t=>{const act=br.type===t;return<button key={t} onClick={()=>setBr(r=>({...r,type:t}))} style={{padding:"5px 11px",borderRadius:20,whiteSpace:"nowrap",border:`1.5px solid ${act?C.acc:C.bdr}`,background:act?C.acc:"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:C.fn}}>{t}</button>;})}</div>
              <FCard mb={8}>
                <FRow label="업체명"><div style={{flex:1,position:"relative",display:"flex",alignItems:"center"}}><input value={venSearch} onChange={e=>{setVenSearch(e.target.value);if(!e.target.value)setBr(r=>({...r,vid:""}));}} placeholder="업체명 초성 검색 (예: 오다 / ㅇㄷ)" style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:C.txt,fontFamily:C.fn,textAlign:"right"}}/>{br.vid&&<span style={{color:C.ok,fontSize:13,marginLeft:4,flexShrink:0}}>✓</span>}{venSearch&&!br.vid&&(()=>{const fv=vendors.filter(v=>match(v.name,venSearch));return fv.length>0?<div style={{position:"absolute",top:"100%",right:0,width:180,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:8,zIndex:9999,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:130,overflowY:"auto"}}>{fv.map(v=><div key={v.id} onClick={()=>{setBr(r=>({...r,vid:v.id}));setVenSearch(v.name);}} style={{padding:"8px 12px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:600}}>{v.name}</span><Tag ch={v.type} c={VEN_C[v.type]||C.sub}/></div>)}</div>:null;})()}</div><span style={{color:C.sub,fontSize:11,flexShrink:0,marginLeft:4}}>∨</span></FRow>
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
  const [boxFilter,setBoxFilter]=useState("진행중");
  const [filter,setFilter]=useState("전체");
  const [dateFilter,setDateFilter]=useState("전체");
  const [startDate,setStartDate]=useState("");
  const [endDate,setEndDate]=useState("");
  const [open,setOpen]=useState(null);
  const [selectedIds,setSelectedIds]=useState([]);
  const SC={완료:C.ok,지연:C.warn,진행중:C.acc};

  function isArchived(order){ return !!order?.is_archived; }
  function getPastDate(days){ const d=new Date(); d.setDate(d.getDate()-days); return d.toISOString().slice(0,10); }
  function toggleSelectOne(id){ setSelectedIds(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]); }
  function clearSelection(){ setSelectedIds([]); }

  const tToday=today(), tYest=getPastDate(1), tWeek=getPastDate(7);

  let dateFiltered=orders;
  if(dateFilter==="오늘") dateFiltered=orders.filter(o=>o.date===tToday);
  else if(dateFilter==="어제") dateFiltered=orders.filter(o=>o.date===tYest);
  else if(dateFilter==="1주일") dateFiltered=orders.filter(o=>o.date>=tWeek&&o.date<=tToday);
  else if(dateFilter==="기간설정"){
    dateFiltered=orders.filter(o=>{
      if(startDate&&endDate) return o.date>=startDate&&o.date<=endDate;
      if(startDate) return o.date>=startDate;
      if(endDate) return o.date<=endDate;
      return true;
    });
  }

  let base=dateFiltered.filter(o=>{
    const archived=isArchived(o);
    if(boxFilter==="보관함") return archived;
    if(archived) return false;
    if(boxFilter==="완료") return o.status==="완료";
    return o.status!=="완료";
  });

  const statusTabs=boxFilter==="진행중"
    ? ["전체","진행중","지연"]
    : boxFilter==="완료"
      ? ["전체","완료"]
      : ["전체","진행중","완료","지연"];

  const filtered=(filter==="전체"?base:base.filter(o=>o.status===filter)).sort((a,b)=>new Date(b.ts||0)-new Date(a.ts||0));

  const boxCounts={
    진행중: dateFiltered.filter(o=>!isArchived(o)&&o.status!=="완료").length,
    완료: dateFiltered.filter(o=>!isArchived(o)&&o.status==="완료").length,
    보관함: dateFiltered.filter(o=>isArchived(o)).length,
  };

  function selectAllFiltered(){ setSelectedIds(filtered.map(o=>o.id)); }
  const allSelected = filtered.length>0 && filtered.every(o=>selectedIds.includes(o.id));

  async function changeStatus(id,status){
    if(user?.token) try{ await DB.update(user.token,"orders",id,{status}); }catch{}
    setOrders(prev=>prev.map(x=>x.id===id?{...x,status}:x));
    if(open===id&&status==="완료"&&boxFilter==="진행중") setOpen(null);
  }

  async function archiveOrder(id){
    if(!window.confirm("목록에서 보관하시겠습니까? 데이터는 삭제되지 않습니다.")) return;
    try{
      const archivedAt=new Date().toISOString();
      if(user?.token) await DB.update(user.token,"orders",id,{is_archived:true,archived_at:archivedAt});
      setOrders(prev=>prev.map(x=>x.id===id?{...x,is_archived:true,archived_at:archivedAt}:x));
      if(open===id) setOpen(null);
      setSelectedIds(prev=>prev.filter(x=>x!==id));
    }catch(e){ alert("보관 처리에 실패했습니다."); }
  }

  async function unarchiveOrder(id){
    try{
      if(user?.token) await DB.update(user.token,"orders",id,{is_archived:false,archived_at:null});
      setOrders(prev=>prev.map(x=>x.id===id?{...x,is_archived:false,archived_at:null}:x));
      if(open===id) setOpen(null);
      setSelectedIds(prev=>prev.filter(x=>x!==id));
    }catch(e){ alert("보관 해제에 실패했습니다."); }
  }

  async function bulkChangeStatus(status){
    if(selectedIds.length===0){ alert("선택한 발주가 없습니다."); return; }
    if(!window.confirm(`선택한 ${selectedIds.length}건을 ${status} 처리하시겠습니까?`)) return;
    try{
      if(user?.token){
        for(const id of selectedIds){
          await DB.update(user.token,"orders",id,{status});
        }
      }
      setOrders(prev=>prev.map(o=>selectedIds.includes(o.id)?{...o,status}:o));
      clearSelection();
    }catch(e){ alert("일괄 상태 변경에 실패했습니다."); }
  }

  async function bulkArchive(){
    if(selectedIds.length===0){ alert("선택한 발주가 없습니다."); return; }
    if(!window.confirm(`선택한 ${selectedIds.length}건을 보관하시겠습니까?`)) return;
    try{
      const archivedAt=new Date().toISOString();
      if(user?.token){
        for(const id of selectedIds){
          await DB.update(user.token,"orders",id,{is_archived:true,archived_at:archivedAt});
        }
      }
      setOrders(prev=>prev.map(o=>selectedIds.includes(o.id)?{...o,is_archived:true,archived_at:archivedAt}:o));
      clearSelection();
    }catch(e){ alert("일괄 보관에 실패했습니다."); }
  }

  async function bulkUnarchive(){
    if(selectedIds.length===0){ alert("선택한 발주가 없습니다."); return; }
    if(!window.confirm(`선택한 ${selectedIds.length}건을 보관 해제하시겠습니까?`)) return;
    try{
      if(user?.token){
        for(const id of selectedIds){
          await DB.update(user.token,"orders",id,{is_archived:false,archived_at:null});
        }
      }
      setOrders(prev=>prev.map(o=>selectedIds.includes(o.id)?{...o,is_archived:false,archived_at:null}:o));
      clearSelection();
    }catch(e){ alert("일괄 보관 해제에 실패했습니다."); }
  }

  function handleReorder(o){
    if(!window.confirm("새 발주를 진행하시겠습니까?")) return;
    try{
      localStorage.setItem("dworks_draft",JSON.stringify({items:o.items}));
      onNav("order");
    }catch{}
  }

  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontWeight:900,fontSize:20}}>발주 리스트</div>
          <Tag ch={`${filtered.length}건`} c={C.sub}/>
        </div>
        <div style={{fontSize:12,fontWeight:800,color:C.sub2}}>선택 {selectedIds.length}건</div>
      </div>

      <div style={{display:"flex",gap:7,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
        {["진행중","완료","보관함"].map(s=><button key={s} onClick={()=>{setBoxFilter(s);setFilter("전체");clearSelection();setOpen(null);}} style={{padding:"8px 14px",borderRadius:20,flexShrink:0,border:`1.5px solid ${boxFilter===s?C.acc:C.bdr}`,background:boxFilter===s?C.acc+"18":"#fff",color:boxFilter===s?C.acc:C.sub2,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:C.fn,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>{s}<span style={{fontSize:11,opacity:.9}}>{boxCounts[s]}</span></button>)}
      </div>

      <div style={{display:"flex",gap:7,marginBottom:dateFilter==="기간설정"?8:12,overflowX:"auto",paddingBottom:4}}>
        {["전체","오늘","어제","1주일","기간설정"].map(s=><button key={s} onClick={()=>{setDateFilter(s);clearSelection();setOpen(null);}} style={{padding:"6px 14px",borderRadius:20,flexShrink:0,border:`1.5px solid ${dateFilter===s?C.acc:C.bdr}`,background:dateFilter===s?C.acc+"18":"#fff",color:dateFilter===s?C.acc:C.sub2,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:C.fn,whiteSpace:"nowrap"}}>{s}</button>)}
      </div>

      {dateFilter==="기간설정"&&<div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{flex:1,padding:"8px 12px",border:`1px solid ${C.bdr}`,borderRadius:8,fontFamily:C.fn,fontSize:12,outline:"none",color:C.txt}}/><span style={{color:C.sub}}>-</span><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{flex:1,padding:"8px 12px",border:`1px solid ${C.bdr}`,borderRadius:8,fontFamily:C.fn,fontSize:12,outline:"none",color:C.txt}}/></div>}

      <div style={{display:"flex",gap:7,marginBottom:10,overflowX:"auto",paddingBottom:4}}>
        {statusTabs.map(s=><button key={s} onClick={()=>{setFilter(s);clearSelection();setOpen(null);}} style={{padding:"6px 14px",borderRadius:20,flexShrink:0,border:`1.5px solid ${filter===s?C.acc:C.bdr}`,background:filter===s?C.acc+"18":"#fff",color:filter===s?C.acc:C.sub2,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:C.fn,whiteSpace:"nowrap"}}>{s}</button>)}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <Btn ch={allSelected?"전체 해제":"전체 선택"} v="w" sz="s" onClick={()=>allSelected?clearSelection():selectAllFiltered()} st={{flex:1}}/>
        <Btn ch="전체 해제" v="w" sz="s" onClick={clearSelection} st={{flex:1}}/>
      </div>

      {filtered.length===0?<Empty icon="📋" text={boxFilter==="보관함"?"보관된 발주 내역이 없습니다":"조건에 맞는 발주 내역이 없습니다"}/>:filtered.map(o=>{
        const tot=(o.items||[]).reduce((s,i)=>s+(i.qty||0),0);
        const isO=open===o.id;
        const isSelected=selectedIds.includes(o.id);
        const title=Array.from(new Set((o.items||[]).map(it=>products.find(x=>x.id===it.pid)?.name||"-"))).join(", ");
        return <Card key={o.id} st={{marginBottom:10,cursor:"pointer",border:isSelected?`1.5px solid ${C.acc}`:`1px solid ${C.bdr}`}} onClick={()=>setOpen(isO?null:o.id)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
              <input type="checkbox" checked={isSelected} onChange={()=>toggleSelectOne(o.id)} onClick={e=>e.stopPropagation()} style={{width:18,height:18,accentColor:C.acc,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:13,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title}</div>
                <div style={{color:C.sub,fontSize:11}}>{o.date} · 총 {fmtN(tot)}장 · 품목 {(o.items||[]).length}개{Number(o.total_amount||0)>0 ? ` · ${fmtW(o.total_amount)}` : ""}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
              <Tag ch={o.status} c={SC[o.status]||C.sub}/>
              <span style={{color:C.sub,fontSize:12}}>{isO?"▲":"›"}</span>
            </div>
          </div>

          {isO&&<div onClick={e=>e.stopPropagation()}>
            <Divider/>
            {(o.items||[]).map((it,j)=>{const p=products.find(x=>x.id===it.pid);return<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:j<(o.items||[]).length-1?`1px solid ${C.bdr}`:"none",fontSize:12,gap:8}}><span style={{fontWeight:600,flex:1}}>{p?.name}</span><span style={{whiteSpace:"nowrap"}}>{it.color} · <strong>{fmtN(it.qty)}</strong>장</span></div>;})}
            <div style={{display:"flex",gap:7,marginTop:10,flexWrap:"wrap"}}>
              <Btn ch="🔄 재발주" sz="s" v="w" st={{padding:"5px 11px",fontSize:12,color:C.acc}} onClick={e=>{e.stopPropagation();handleReorder(o);}}/>
              {boxFilter!=="보관함"&&["진행중","완료","지연"].map(st=><Btn key={st} ch={st} sz="s" st={{padding:"5px 11px",background:o.status===st?(SC[st]||C.acc):"#fff",color:o.status===st?"#fff":(SC[st]||C.sub2),border:`1.5px solid ${SC[st]||C.bdr}`,fontSize:12}} onClick={()=>changeStatus(o.id,st)}/>)}
              {boxFilter!=="보관함"
                ? <Btn ch="보관" sz="s" v="w" st={{marginLeft:"auto",color:C.warn,fontSize:12,padding:"5px 11px"}} onClick={()=>archiveOrder(o.id)}/>
                : <Btn ch="보관 해제" sz="s" v="w" st={{marginLeft:"auto",color:C.acc,fontSize:12,padding:"5px 11px"}} onClick={()=>unarchiveOrder(o.id)}/>
              }
            </div>
            {boxFilter!=="보관함"&&<div style={{marginTop:8,fontSize:11,color:C.sub}}>보관하면 목록에서만 숨겨지고 데이터는 유지됩니다.</div>}
          </div>}
        </Card>;
      })}

      {selectedIds.length>0&&<div style={{position:"fixed",left:"50%",bottom:92,transform:"translateX(-50%)",width:"calc(100% - 24px)",maxWidth:456,background:"rgba(255,255,255,0.96)",border:`1px solid ${C.bdr}`,borderRadius:22,boxShadow:"0 18px 40px rgba(15,23,42,0.12)",backdropFilter:"blur(16px)",padding:12,boxSizing:"border-box",zIndex:70}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {boxFilter!=="보관함"&&filter!=="완료"&&<Btn ch="선택 완료" onClick={()=>bulkChangeStatus("완료")} st={{flex:1}}/>}
          {boxFilter!=="보관함"
            ? <Btn ch="선택 보관" v="w" onClick={bulkArchive} st={{flex:1}}/>
            : <Btn ch="선택 보관 해제" v="w" onClick={bulkUnarchive} st={{flex:1}}/>
          }
        </div>
      </div>}
    </div>
  );
}

function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",subTel:"",email:"",type:"원단",address:"",bizNo:"",memo:""});
  const [editId,setEditId]=useState(null);
  const [venSearch,setVenSearch]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  function openAdd(){setF({name:"",tel:"",subTel:"",email:"",type:"원단",address:"",bizNo:"",memo:""});setEditId(null);setSheet(true);}
  function openEdit(v){setF({...v});setEditId(v.id);setSheet(true);}
  async function save(){
    if(!f.name || !f.tel || !f.address){alert("필수 항목 입력");return;}
    const dataToSave = {name: f.name, tel: f.tel, sub_tel: f.subTel || null, email: f.email, type: f.type, address: f.address, biz_no: f.bizNo || null, memo: f.memo || null};
    try{
      if(editId){
        if(user?.token) await DB.update(user.token,"vendors",editId,dataToSave);
        setVendors(vv=>vv.map(v=>v.id===editId?{...v,...f}:v));
      }else{
        if(user?.token){
          const r=await DB.insert(user.token,"vendors",{...dataToSave,user_id:user.id});
          const nv = r[0];
          setVendors(vv=>[...vv, {...nv, subTel:nv.sub_tel||"", address:nv.address||"", bizNo:nv.biz_no||"", memo:nv.memo||""}]);
        }
      }
    }catch(e){alert("네트워크 에러"); return;}
    setSheet(false);
  }
  async function del(id){if(!window.confirm("삭제?"))return;if(user?.token)try{await DB.del(user.token,"vendors",id);}catch{}setVendors(vv=>vv.filter(x=>x.id!==id));}
  const filtered = vendors.filter(v=>match(v.name, venSearch)||match(v.tel, venSearch));
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontWeight:900,fontSize:20}}>거래처 관리</div><Btn ch="+ 추가" sz="s" st={{padding:"7px 14px"}} onClick={openAdd}/></div>
      <div style={{marginBottom:16}}><TxtInp val={venSearch} onChange={setVenSearch} ph="거래처명 초성 검색 (예: 어바웃 / ㅇㅂㅇ)"/></div>
      {filtered.length===0?<Empty icon="🏭" text="조건에 맞는 거래처가 없습니다"/>:filtered.map(v=><Card key={v.id} st={{marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:40,height:40,borderRadius:12,background:(VEN_C[v.type]||C.sub)+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{VEN_IC[v.type]||"🏭"}</div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}><span style={{fontWeight:800,fontSize:14}}>{v.name}</span><Tag ch={v.type} c={VEN_C[v.type]||C.sub}/></div><div style={{color:C.sub,fontSize:12}}>📱 {v.tel||"핸드폰 미등록"}{v.subTel ? ` · ☎️ ${v.subTel}` : ""}</div>{v.address&&<div style={{fontSize:11,color:C.sub2,marginTop:2}}>📍 {v.address}</div>}{v.bizNo&&<div style={{fontSize:11,color:C.sub,marginTop:2}}>🏢 {v.bizNo}</div>}{v.memo&&<div style={{fontSize:11,color:C.sub2,marginTop:2,display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical",overflow:"hidden"}}>📝 {v.memo}</div>}<div style={{fontSize:11,color:v.email?C.sub:C.warn,marginTop:2}}>{v.email||"⚠️ 이메일 미등록"}</div></div><div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}><Btn ch="수정" v="w" sz="s" st={{padding:"5px 11px",fontSize:12}} onClick={()=>openEdit(v)}/><Btn ch="삭제" v="w" sz="s" st={{padding:"5px 11px",fontSize:12,color:C.red}} onClick={()=>del(v.id)}/></div></div></Card>)}
      {sheet&&<Sheet title={editId?"거래처 수정":"거래처 추가"} onClose={()=>setSheet(false)}>
        <Field label="거래처명" req><TxtInp val={f.name} onChange={sf("name")} ph="이레텍스"/></Field>
        <Field label="핸드폰번호" req><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field>
        <Field label="전화번호 (선택)"><TxtInp val={f.subTel} onChange={sf("subTel")} ph="02-000-0000" type="tel"/></Field>
        <Field label="거래처 주소" req><TxtInp val={f.address} onChange={sf("address")} ph="서울시 종로구 ..." /></Field>
        <Field label="사업자 등록번호"><TxtInp val={f.bizNo} onChange={sf("bizNo")} ph="000-00-00000" /></Field>
        <Field label="이메일 (선택)"><TxtInp val={f.email} onChange={sf("email")} ph="order@fabric.com" type="email"/></Field>
        <Field label="업체 유형"><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{VEN_TYPES.map(t=>{const act=f.type===t;return<button key={t} onClick={()=>sf("type")(t)} style={{padding:"7px 13px",borderRadius:20,border:`1.5px solid ${act?(VEN_C[t]||C.acc):C.bdr}`,background:act?(VEN_C[t]||C.acc):"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:C.fn,display:"flex",alignItems:"center",gap:4}}>{VEN_IC[t]} {t}</button>;})}</div></Field>
        <Field label="메모"><div style={{border:`1px solid ${C.bdr}`,borderRadius:8,background:"#fff"}}><textarea value={f.memo||""} onChange={e=>sf("memo")(e.target.value)} placeholder="최소 수량, 결제 조건, 응대 메모 등을 입력하세요" style={{width:"100%",minHeight:88,border:"none",outline:"none",resize:"vertical",padding:"12px 14px",fontSize:13,color:C.txt,fontFamily:C.fn,background:"transparent",boxSizing:"border-box"}}/></div></Field>
        <G/><div style={{display:"flex",gap:10}}><Btn ch="취소" v="w" full st={{flex:1}} onClick={()=>setSheet(false)}/><Btn ch="저장" full st={{flex:2}} onClick={save}/></div>
      </Sheet>}
    </div>
  );
}
function SettingsPage({user,setUser,vendors,factories,setFactories,onLogout}){
  const [facSheet,setFacSheet]=useState(null);
  const [profileSheet,setProfileSheet]=useState(false);
  const [pf,setPf]=useState({name:user.name||"",company:user.company||"",tel:user.tel||"",brand:user.brand||"",position:user.position||"",address:user.address||""});
  async function saveProfile(){
    try{if(user?.token) await DB.updateUser(user.token, {name:pf.name,company:pf.company,tel:pf.tel,brand:pf.brand,position:pf.position,address:pf.address});}catch{}
    if(setUser)setUser(u=>({...u,...pf})); setProfileSheet(false); alert("저장되었습니다!");
  }
  async function saveFac(){
    if(!facSheet.name)return;
    const{id,...data}=facSheet;
    try{
      if(id){
        if(user?.token) await DB.update(user.token,"factories",id,{...data,biz_type:data.bizType, biz_no:data.bizNo||null, memo:data.memo||null});
        setFactories(ff=>ff.map(x=>x.id===id?{...x,...data}:x));
      }else{
        if(user?.token){
          const r=await DB.insert(user.token,"factories",{name:data.name,biz_type:data.bizType,address:data.address,tel:data.tel,account:data.account,biz_no:data.bizNo||null,memo:data.memo||null,user_id:user.id});
          setFactories(ff=>[...ff,{...r[0],bizType:r[0].biz_type||"", bizNo:r[0].biz_no||"", memo:r[0].memo||""}]);
        }
      }
    }catch(e){alert("네트워크 에러"); return;}
    setFacSheet(null);
  }
  async function delFac(id){if(!window.confirm("삭제?"))return;if(user?.token)try{await DB.del(user.token,"factories",id);}catch{}setFactories(ff=>ff.filter(x=>x.id!==id));}
  return(
    <div style={{padding:"18px 14px 94px"}}>
      <Card st={{background:"linear-gradient(135deg,#101828 0%, #0F172A 55%, #1E293B 100%)",border:"none",color:"#fff",padding:20,marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.56)"}}>Profile</div>
        <div style={{marginTop:12,fontSize:22,fontWeight:900,lineHeight:1.2}}>{user.company||"디자인워커스"}{user.brand?` · ${user.brand}`:""}</div>
        <div style={{marginTop:6,fontSize:13,color:"rgba(255,255,255,0.72)"}}>{user.name||"이름 없음"} {user.position?`· ${user.position}`:""}</div>
        <div style={{marginTop:2,fontSize:12,color:"rgba(255,255,255,0.58)"}}>{user.email}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:16}}>
          <div style={{padding:"14px 14px",borderRadius:20,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.10)"}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.58)",fontWeight:700}}>연결 거래처</div>
            <div style={{marginTop:6,fontSize:20,fontWeight:900}}>{vendors.length}</div>
          </div>
          <div style={{padding:"14px 14px",borderRadius:20,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.10)"}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.58)",fontWeight:700}}>등록 공장</div>
            <div style={{marginTop:6,fontSize:20,fontWeight:900}}>{factories.length}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:16}}>
          <Btn ch="프로필 수정" v="w" st={{flex:1,background:"rgba(255,255,255,0.08)",color:"#fff",border:"1px solid rgba(255,255,255,0.12)",boxShadow:"none"}} onClick={()=>setProfileSheet(true)}/>
          <Btn ch="로그아웃" v="w" st={{color:"#fff",background:"transparent",border:"1px solid rgba(255,255,255,0.12)",boxShadow:"none"}} onClick={onLogout}/>
        </div>
      </Card>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontWeight:900,fontSize:15,color:C.txt}}>공장 관리</div>
          <Btn ch="+ 추가" sz="s" onClick={()=>setFacSheet({id:null,name:"",bizType:"",address:"",tel:"",account:"",bizNo:"",memo:""})}/>
        </div>
        {factories.length===0?<div style={{textAlign:"center",padding:"20px 0",color:C.sub2,fontSize:13,fontWeight:700}}>등록된 공장이 없습니다</div>:factories.map(fc=><div key={fc.id} style={{padding:"12px 0",borderBottom:`1px solid ${C.bdr}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,flexWrap:"wrap"}}>
                <span style={{fontWeight:800,fontSize:14,color:C.txt}}>{fc.name}</span>
                {(fc.bizType||fc.biz_type)&&<Tag ch={fc.bizType||fc.biz_type} c={C.acc}/>}
              </div>
              {fc.address&&<div style={{color:C.sub2,fontSize:12,marginBottom:3}}>{fc.address}</div>}
              <div style={{color:C.sub2,fontSize:12}}>{fc.tel||"연락처 없음"}</div>
              {fc.bizNo&&<div style={{color:C.sub,fontSize:11,marginTop:3}}>{fc.bizNo}</div>}
              {fc.account&&<div style={{color:C.sub,fontSize:11,marginTop:2}}>{fc.account}</div>}
              {fc.memo&&<div style={{color:C.sub2,fontSize:11,marginTop:2,display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical",overflow:"hidden"}}>📝 {fc.memo}</div>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <Btn ch="수정" v="w" sz="s" st={{minWidth:64}} onClick={()=>setFacSheet({...fc,bizType:fc.bizType||fc.biz_type||"",bizNo:fc.bizNo||fc.biz_no||"",memo:fc.memo||""})}/>
              <Btn ch="삭제" v="w" sz="s" st={{minWidth:64,color:C.red}} onClick={()=>delFac(fc.id)}/>
            </div>
          </div>
        </div>)}
      </Card>
      {profileSheet&&<Sheet title="프로필 수정" onClose={()=>setProfileSheet(false)}>
        <Field label="업체명"><TxtInp val={pf.company} onChange={v=>setPf(p=>({...p,company:v}))} ph="회사명"/></Field>
        <Field label="브랜드명"><TxtInp val={pf.brand} onChange={v=>setPf(p=>({...p,brand:v}))} ph="브랜드명"/></Field>
        <Field label="이름"><TxtInp val={pf.name} onChange={v=>setPf(p=>({...p,name:v}))} ph="담당자명"/></Field>
        <Field label="직함"><TxtInp val={pf.position} onChange={v=>setPf(p=>({...p,position:v}))} ph="직함"/></Field>
        <Field label="연락처"><TxtInp val={pf.tel} onChange={v=>setPf(p=>({...p,tel:v}))} ph="010-0000-0000"/></Field>
        <Field label="주소"><TxtInp val={pf.address} onChange={v=>setPf(p=>({...p,address:v}))} ph="주소"/></Field>
        <div style={{display:"flex",gap:10,marginTop:8}}><Btn ch="취소" v="w" full st={{flex:1}} onClick={()=>setProfileSheet(false)}/><Btn ch="저장" full st={{flex:2}} onClick={saveProfile}/></div>
      </Sheet>}
      {facSheet&&<Sheet title={facSheet.id?"공장 수정":"공장 추가"} onClose={()=>setFacSheet(null)}>
        <Field label="공장명" req><TxtInp val={facSheet.name} onChange={v=>setFacSheet(p=>({...p,name:v}))} ph="공장명"/></Field>
        <Field label="업종"><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{BIZ_TYPES.map(t=>{const act=(facSheet.bizType||"")===t;return <button key={t} onClick={()=>setFacSheet(p=>({...p,bizType:t}))} style={{padding:"9px 13px",borderRadius:999,border:`1px solid ${act?C.acc:C.bdr}`,background:act?C.acc:"#fff",color:act?"#fff":C.sub2,fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:C.fn}}>{t}</button>;})}</div></Field>
        <Field label="주소"><TxtInp val={facSheet.address||""} onChange={v=>setFacSheet(p=>({...p,address:v}))} ph="공장 주소"/></Field>
        <Field label="연락처"><TxtInp val={facSheet.tel||""} onChange={v=>setFacSheet(p=>({...p,tel:v}))} ph="010-0000-0000"/></Field>
        <Field label="계좌정보"><TxtInp val={facSheet.account||""} onChange={v=>setFacSheet(p=>({...p,account:v}))} ph="은행 / 예금주 / 계좌번호"/></Field>
        <Field label="사업자번호"><TxtInp val={facSheet.bizNo||""} onChange={v=>setFacSheet(p=>({...p,bizNo:v}))} ph="000-00-00000"/></Field>
        <Field label="메모"><div style={{border:`1px solid ${C.bdr}`,borderRadius:8,background:"#fff"}}><textarea value={facSheet.memo||""} onChange={e=>setFacSheet(p=>({...p,memo:e.target.value}))} placeholder="리드타임, 작업 특이사항, 정산 메모 등을 입력하세요" style={{width:"100%",minHeight:88,border:"none",outline:"none",resize:"vertical",padding:"12px 14px",fontSize:13,color:C.txt,fontFamily:C.fn,background:"transparent",boxSizing:"border-box"}}/></div></Field>
        <div style={{display:"flex",gap:10,marginTop:8}}><Btn ch="취소" v="w" full st={{flex:1}} onClick={()=>setFacSheet(null)}/><Btn ch="저장" full st={{flex:2}} onClick={saveFac}/></div>
      </Sheet>}
    </div>
  );
}
// ── 메인 앱 컴포넌트 ──
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
      const[v,f,p,o]=await Promise.all([DB.list(token,"vendors"),DB.list(token,"factories"),DB.list(token,"products"),DB.list(token,"orders")]);
      setVendors(Array.isArray(v)?v.map(x=>({...x, subTel:x.sub_tel||"", address:x.address||"", bizNo:x.biz_no||"", memo:x.memo||""})):[]);
      setFactories(Array.isArray(f)?f.map(x=>({...x,bizType:x.biz_type||x.bizType||"", bizNo:x.biz_no||x.bizNo||"", memo:x.memo||""})):[]);
      setProducts(Array.isArray(p)?p.map(x=>({...x,factoryId:x.factory_id||x.factoryId||"",factoryTel:x.factory_tel||x.factoryTel||"",colors:x.colors||[],colorBom:x.color_bom||x.colorBom||{}, imageUrl:x.image_url||""})):[]);
      setOrders(Array.isArray(o)?o.map(x=>({...x,is_archived:!!x.is_archived,archived_at:x.archived_at||null})):[]);
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
            if(r.ok){setUser(u);setScreen("app");loadData(u.token);return;}
          }
        }
      }catch{}
      setScreen("splash");
    }
    checkSession();
  },[]);
  async function handleLogin(u, keep){
    if(keep) {
      try{localStorage.setItem("dworks_session",JSON.stringify(u));}catch{}
    } else {
      try{localStorage.removeItem("dworks_session");}catch{}
    }
    setUser(u);setScreen("app");await loadData(u.token);
  }
  async function handleLogout(){
    try{localStorage.removeItem("dworks_session");}catch{}
    setUser(null);setScreen("auth");
  }
  const TABS=[{k:"order", l:"발주하기"},{k:"prods", l:"상품"},{k:"list", l:"발주내역"},{k:"vendors", l:"거래처"},{k:"settings", l:"설정"}];
  if(screen==="loading")return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.fn,color:C.sub2}}>로딩 중...</div>;
  if(screen==="splash")return<SplashPage onStart={()=>setScreen("auth")}/>;
  if(screen!=="app"||!user)return<AuthPage onLogin={handleLogin}/>;
  const pages={
    dash:<DashPage orders={orders} products={products} onNav={setPage}/>,
    order:<OrderPage products={products} orders={orders} setOrders={setOrders} vendors={vendors} factories={factories} user={user} onNav={setPage}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} factories={factories} user={user}/>,
    list:<ListPage orders={orders} setOrders={setOrders} products={products} user={user} onNav={setPage}/>,
    vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,
    settings:<SettingsPage user={user} setUser={setUser} vendors={vendors} factories={factories} setFactories={setFactories} onLogout={handleLogout}/>,
  };
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,maxWidth:480,margin:"0 auto",position:"relative",boxShadow:"0 18px 50px rgba(15,23,42,0.10)"}}>
      <div style={{background:"rgba(255,255,255,0.92)",padding:"18px 16px 14px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${C.bdr}`,backdropFilter:"blur(16px)"}}>
        <div>
          <div style={{fontSize:11,color:C.sub,fontWeight:900,letterSpacing:"0.24em",textTransform:"uppercase"}}>DESIGN WALKERS</div>
          <button onClick={()=>setPage("dash")} style={{marginTop:6,background:"none",border:"none",padding:0,color:C.acc,fontWeight:900,fontSize:20,cursor:"pointer",fontFamily:C.fn,letterSpacing:"-0.02em"}}>D-Works</button>
        </div>
        <div style={{padding:"12px 16px",borderRadius:18,border:`1px solid ${C.bdr}`,background:"#fff",fontSize:14,fontWeight:900,color:C.sub2,boxShadow:"0 6px 18px rgba(15,23,42,0.04)"}}>
          {user.company || "디자인워커스"}
        </div>
      </div>
      <div style={{paddingBottom:96}}>{pages[page]||pages["dash"]}</div>
      <div style={{position:"fixed",bottom:14,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 24px)",maxWidth:456,background:"rgba(255,255,255,0.94)",border:`1px solid ${C.bdr}`,display:"flex",zIndex:60,height:72,borderRadius:28,boxShadow:"0 18px 40px rgba(15,23,42,0.10)",backdropFilter:"blur(16px)",padding:8,boxSizing:"border-box"}}>
        {TABS.map(t=><button key={t.k} onClick={()=>setPage(t.k)} style={{
          flex:1,
          background:page===t.k?"#FFFFFF":"transparent",
          border:"none",
          color:page===t.k?C.acc:C.sub2,
          cursor:"pointer",
          fontFamily:C.fn,
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          borderRadius:20,
          transition:"all 0.2s",
          boxShadow:page===t.k?"0 8px 20px rgba(15,23,42,0.08)":"none"
        }}>
          <span style={{fontSize:11,fontWeight:page===t.k?900:700,textAlign:"center",lineHeight:1,whiteSpace:"nowrap",wordBreak:"keep-all",letterSpacing:"-0.02em"}}>{t.l}</span>
        </button>)}
      </div>
    </div>
  );
}
