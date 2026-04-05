import React, { useState, useEffect } from "react";

// ── Supabase & API (기존 유지) ─────────────────────────────────
const SB="https://qimgostiseehdnvhmoph.supabase.co", KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";
const ah=t=>({"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"});
const api=async(m,p,t,b)=>{const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined});return r.json();};
const DB={signUp:(e,pw,m)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:m}),signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),signOut:t=>fetch(`${SB}/auth/v1/logout`,{method:"POST",headers:ah(t)}),updateUser:(t,m)=>api("PUT","/auth/v1/user",t,{data:m}),list:(t,tb)=>api("GET",`/rest/v1/${tb}?order=created_at.asc`,t),insert:(t,tb,d)=>api("POST",`/rest/v1/${tb}`,t,d),update:(t,tb,id,d)=>api("PATCH",`/rest/v1/${tb}?id=eq.${id}`,t,d),del:(t,tb,id)=>fetch(`${SB}/rest/v1/${tb}?id=eq.${id}`,{method:"DELETE",headers:ah(t)})};
const EJS={SID:"service_raca1ke",TID:"template_hoej0ts",PK:"KlYRj7B6JNO01D2pm"};
const sendEmail=async(to,name,sub,msg)=>{if(!to)return false;try{const r=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:EJS.SID,template_id:EJS.TID,user_id:EJS.PK,template_params:{to_email:to,to_name:name,subject:sub,message:msg,from_name:"D-Works"}})});return r.status===200;}catch{return false;}};

// ── 유틸 및 상수 ──
const CHO=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const getCho=s=>(s||"").split("").map(c=>{const cd=c.charCodeAt(0);return(cd>=44032&&cd<=55203)?CHO[Math.floor((cd-44032)/588)]:c;}).join("");
const match=(t,q)=>{if(!q)return true;const txt=(t||"").toLowerCase(),qry=(q||"").toLowerCase();return txt.includes(qry)||getCho(txt).includes(getCho(qry));};
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

// ── 공통 UI ──
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",ok:C.ok,d:C.bg}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,ok:"#fff",d:C.sub}[v]||"#fff";
  const bd=v==="w"?`1.5px solid ${C.bdr}`:"none";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#EDF0F5":bg,color:disabled?"#B0B8C4":cl,border:disabled?`1.5px solid ${C.bdr}`:bd,borderRadius:10,padding:sz==="s"?"7px 14px":"12px 0",fontSize:sz==="s"?12:14,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:C.fn,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,width:full?"100%":"auto",boxSizing:"border-box",lineHeight:1.4,...st}}>{ch}</button>;
};
function FCard({children,mb=12}){return<div style={{background:"#fff",borderRadius:14,border:`1px solid ${C.bdr}`,marginBottom:mb,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>{children}</div>;}
function FRow({label,children,last,req}){return<div style={{display:"flex",alignItems:"center",minHeight:50,padding:"0 14px",borderBottom:last?"none":`1px solid ${C.bdr}`,position:"relative"}}><div style={{width:80,fontSize:13,fontWeight:600,color:C.txt,flexShrink:0}}>{label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}</div><div style={{flex:1,display:"flex",alignItems:"center",minWidth:0}}>{children}</div></div>;}
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

// ── Splash 및 인증 (WL 규격 복구) ──
function SplashPage({onStart}){
  const [slide,setSlide]=useState(0);
  const slides=[{title:"WTMT 발주\n시스템",desc:"거래처 및 공장 관리부터\n원클릭 이메일 발주까지!",icon:"📋"},{title:"BOM 기반\n소요량 계산",desc:"상품별 원부자재를 등록하면\n발주 수량에 맞춰 자동 계산!",icon:"🧮"},{title:"거래처별\n원클릭 발송",desc:"업체별 발주서를 자동 생성하고\n WTMT 메일로 즉시 발송!",icon:"📧"},{title:"발주 이력\n데이터화",desc:"모든 발주가 DB에 저장되어\n언제든 조회 가능!",icon:"📊"}];
  return(
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",flexDirection:"column",fontFamily:C.fn}}>
      <div style={{padding:"44px 24px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{color:C.acc,fontWeight:900,fontSize:24,letterSpacing:1}}>WTMT</div>
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
      // ✅ 필수 항목 복구: 업체명, 브랜드명, 성함, 직함, 연락처
      if(!f.company||!f.brand||!f.name||!f.position||!f.tel){setErr("필수 항목을 모두 입력하세요");return;}
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
        onLogin({token:r.access_token,id:r.user.id,name:meta.name,company:meta.company,email:r.user.email,tel:meta.tel,brand:meta.brand,position:meta.position,address:meta.address}, f.keepLoggedIn);
      }
    }catch(e){setErr("네트워크 오류");}
    finally{setLoading(false);}
  }
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn}}>
      <div style={{background:"#fff",padding:"44px 20px 20px",borderBottom:`1px solid ${C.bdr}`}}>
        <div style={{fontSize:30,fontWeight:900,color:C.acc,letterSpacing:1}}>WTMT</div>
        <div style={{fontSize:13,color:C.sub,marginTop:4}}>발주 자동화 시스템</div>
      </div>
      <div style={{padding:"20px 20px 40px",maxWidth:480,margin:"0 auto"}}>
        <div style={{display:"flex",borderBottom:`1.5px solid ${C.bdr}`,marginBottom:20}}>
          {[["in","로그인"],["up","회원가입"]].map(([k,l])=><button key={k} onClick={()=>{setTab(k);setErr("");}} style={{flex:1,padding:"11px 0",background:"none",border:"none",borderBottom:`2.5px solid ${tab===k?C.acc:"transparent"}`,color:tab===k?C.acc:C.sub,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:C.fn,marginBottom:-2}}>{l}</button>)}
        </div>
        {tab==="up" && (
          <>
            <Field label="업체명" req><TxtInp val={f.company} onChange={sf("company")} ph="회사명"/></Field>
            {/* ✅ 브랜드명 항목 복구 */}
            <Field label="브랜드명" req><TxtInp val={f.brand} onChange={sf("brand")} ph="브랜드명"/></Field>
            <Field label="성함" req><TxtInp val={f.name} onChange={sf("name")} ph="성함"/></Field>
            {/* ✅ 직함 항목 복구 */}
            <Field label="직함" req><TxtInp val={f.position} onChange={sf("position")} ph="예: 대표"/></Field>
            <Field label="연락처" req><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field>
          </>
        )}
        <Field label="이메일" req><TxtInp val={f.email} onChange={sf("email")} ph="WTMT 메일주소" type="email"/></Field>
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
            <Field label="사무실 주소"><TxtInp val={f.address} onChange={sf("address")} ph="사무실 주소"/></Field>
            <div style={{marginTop:24, padding:14, background:"#fff", border:`1px solid ${C.bdr}`, borderRadius:10}}>
              <div style={{fontSize:12, color:C.sub2, lineHeight:1.6, height:80, overflowY:"auto", marginBottom:10}}><strong>[개인정보 수집 및 이용 안내]</strong><br/>1. 발주 업무 자동화를 위해 업체명, 브랜드명, 성함, 직함, 연락처를 수집합니다.</div>
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
  const td=today(),vs=new Date();vs.setDate(vs.getDate()-1);const yd=vs.toISOString().slice(0,10);
  const tO=orders.filter(o=>o.date===td);
  const mQ=orders.filter(o=>o.date?.slice(0,7)===td.slice(0,7)).reduce((s,o)=>s+(o.items||[]).reduce((ss,i)=>ss+(i.qty||0),0),0);
  const delayed=orders.filter(o=>o.status==="지연");
  const chart=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const ds=d.toISOString().slice(0,10);return{label:ds.slice(5),v:orders.filter(o=>o.date===ds).reduce((s,o)=>s+(o.items||[]).reduce((ss,ii)=>ss+(ii.qty||0),0),0)};});
  
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,textAlign:"center",marginBottom:14}}>대시 보드</div>
      <div style={{display:"flex", gap:10, marginBottom:16}}>
        <Card st={{flex:1, padding:"16px 10px", textAlign:"center", marginBottom:0}}>
          <div style={{color:C.acc, fontSize:20, fontWeight:900}}>{tO.length}건</div>
          <div style={{color:C.sub, fontSize:11, marginTop:4, fontWeight:600}}>오늘 발주</div>
        </Card>
        <Card st={{flex:1, padding:"16px 10px", textAlign:"center", marginBottom:0}}>
          <div style={{color:"#8B5CF6", fontSize:20, fontWeight:900}}>{delayed.length}건</div>
          <div style={{color:C.sub, fontSize:11, marginTop:4, fontWeight:600}}>미출고 발주</div>
        </Card>
        <Card st={{flex:1, padding:"16px 10px", textAlign:"center", marginBottom:0}}>
          <div style={{color:C.ok, fontSize:20, fontWeight:900}}>{fmtN(mQ)}매</div>
          <div style={{color:C.sub, fontSize:11, marginTop:4, fontWeight:600}}>이달 발주량</div>
        </Card>
      </div>
      <Card st={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontWeight:800,fontSize:14}}>⚠️ 지연 {delayed.length}건</span>
          {delayed.length>2&&<button onClick={()=>onNav("list")} style={{background:"none",border:"none",fontSize:12,color:C.sub,cursor:"pointer",fontFamily:C.fn}}>더보기</button>}
        </div>
        {delayed.length===0?<div style={{textAlign:"center",padding:"12px 0",color:C.sub,fontSize:12}}>지연 발주 없음 ✅</div>:<>
          <div style={{display:"flex", fontSize:11, fontWeight:600, color:C.sub, paddingBottom:6, borderBottom:`1px solid ${C.bdr}`, marginBottom:4}}>
            <div style={{flex:2}}>상품명</div>
            <div style={{width:60, textAlign:"center"}}>색상</div>
            <div style={{width:50, textAlign:"right"}}>수량</div>
            <div style={{width:44, textAlign:"center", marginLeft:8}}>상태</div>
          </div>
          {delayed.slice(0,5).flatMap(o=>(o.items||[]).map((it,j)=>{
            const p=products.find(x=>x.id===it.pid);
            return (
              <div key={`${o.id}-${j}`} style={{display:"flex", fontSize:12, padding:"6px 0", borderBottom:`1px solid ${C.bdr}`, alignItems:"center"}}>
                <div style={{flex:2, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{p?.name||"-"}</div>
                <div style={{width:60, color:C.sub2, textAlign:"center", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{it.color}</div>
                <div style={{width:50, fontWeight:700, textAlign:"right"}}>{fmtN(it.qty)}</div>
                <div style={{width:44, display:"flex", justifyContent:"center", marginLeft:8}}>
                  <Tag ch="지연" c={C.warn}/>
                </div>
              </div>
            );
          }))}
        </>}
      </Card>
      <Card><div style={{fontWeight:700,fontSize:13,marginBottom:10}}>📈 발주량 추이</div><LineChart data={chart}/><div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>{chart.filter((_,i)=>i%2===0).map(d=><span key={d.label} style={{fontSize:9,color:C.sub}}>{d.label}</span>)}</div></Card>
    </div>
  );
}

// ── 발주하기 ──
function OrderPage({products,orders,setOrders,vendors,factories,user}){
  const [step,setStep]=useState(1);
  const [items,setItems]=useState([]);
  const [memo,setMemo]=useState("");
  const [search,setSearch]=useState("");
  const [selProd,setSelProd]=useState(null);
  const [selColor,setSelColor]=useState("");
  const [qty,setQty]=useState("");
  const [sending,setSending]=useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  
  const DRAFT="dworks_draft";
  useEffect(()=>{try{const d=localStorage.getItem(DRAFT);if(d){const dr=JSON.parse(d);if(dr.items?.length>0){setItems(dr.items);alert("이전 발주 내역을 불러왔습니다.");}}}catch{};},[]);
  const filtered=products.filter(p=>match(p.name,search)||match(p.season,search));

  function addItem(){if(!selProd||!selColor||!qty){alert("상품·색상·수량을 입력하세요");return;}const idx=items.findIndex(i=>i.pid===selProd.id&&i.color===selColor);if(idx>=0)setItems(p=>p.map((it,i)=>i===idx?{...it,qty:it.qty+Number(qty)}:it));else setItems(p=>[...p,{pid:selProd.id,color:selColor,qty:Number(qty)}]);setSelProd(null);setSelColor("");setQty("");setSearch("");}
  
  function generatePreview() {
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
    if(!targets.length) {alert("발송할 거래처 이메일이 등록되어 있지 않습니다.");return;}
    const pData = [];
    for(const{vendor,lines}of targets){
      const companyName=user?.company||"WTMT";
      let body=`${vendor.name} 담당자님 안녕하세요.\n\n업체명 : ${companyName}\n\n`;
      const prodMap={};
      for(const l of lines){
        const pName=l.prod?.name||"-";
        if(!prodMap[pName])prodMap[pName]={matMap:{}};
        if(!prodMap[pName].matMap[l.mat])prodMap[pName].matMap[l.mat]={mat:l.mat,unit:l.unit,colors:[]};
        prodMap[pName].matMap[l.mat].colors.push(`${l.color} ${fmtN(l.soyo)}${l.unit}`);
      }
      for(const[pName,pDataObj]of Object.entries(prodMap)){
        for(const m of Object.values(pDataObj.matMap)){ body+=`${m.mat}\n`; m.colors.forEach(c=>{body+=`${c}\n`;}); body+=`\n`; }
        body+=`품목 : ${pName}\n\n`;
      }
      const p=lines[0]?.prod;
      body+=`입고처 : ${p?.factory||"-"}\n주소 : ${factories?.find(f=>f.name===p?.factory)?.address||"-"}\n연락처 : ${p?.factoryTel||"-"}\n\n`;
      if(memo)body+=`[요청 및 전달사항]\n${memo}\n\n`;
      body+=`감사합니다.\nWTMT`;
      pData.push({ vendor, body });
    }
    setPreviewData(pData); setShowPreview(true);
  }

  async function confirmOrder() {
    setSending(true);
    const groupedByPid = items.reduce((acc, it) => { if(!acc[it.pid]) acc[it.pid] = []; acc[it.pid].push(it); return acc; }, {});
    const ts = new Date().toISOString(), d = today(), newOrders = [];
    for(const [pid, groupItems] of Object.entries(groupedByPid)){
      const o = { items: groupItems, status: "진행중", date: d, ts };
      try{
        if(!user?.token) { alert("로그인 정보가 없습니다."); setSending(false); return; }
        const r = await DB.insert(user.token, "orders", {...o, user_id: user.id});
        if(r.error || r.code || !Array.isArray(r) || r.length === 0) { alert(`DB 에러: ${r.message}`); setSending(false); return; }
        newOrders.push(r[0]);
      }catch(e){ alert("네트워크 에러"); setSending(false); return; }
    }
    setOrders(p => [...newOrders, ...p]); try{localStorage.removeItem(DRAFT);}catch{}
    for(const data of previewData){ await sendEmail(data.vendor.email, data.vendor.name, `[D-Works 발주서] ${today()} - ${data.vendor.name}`, data.body); }
    setSending(false); setShowPreview(false); setStep(3);
  }

  function reset(){setStep(1);setItems([]);setSearch("");setSelProd(null);setSelColor("");setQty("");setMemo("");setPreviewData([]);setShowPreview(false);}
  if(step===3)return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",padding:24}}><div style={{fontSize:56,marginBottom:14}}>✅</div><div style={{fontWeight:900,fontSize:22,marginBottom:8}}>발주 완료!</div><div style={{color:C.sub,marginBottom:28,fontSize:13}}>{items.length}개 상품 발주</div><Btn ch="+ 새 발주 입력" onClick={reset} sz="l" st={{borderRadius:12}}/></div>;
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:4}}>{step===1?"발주 입력":"발주서 확인"}</div>
      <div style={{color:C.sub,fontSize:12,marginBottom:14}}>기본 정보를 입력해 주세요</div>
      <StepBar cur={step-1}/>
      {step===1&&<>
        <Card st={{marginBottom:12}}>
          <Field label="상품명"><div style={{position:"relative"}}><TxtInp val={search} onChange={v=>{setSearch(v);if(selProd&&v!==selProd.name)setSelProd(null);}} ph="🔍 상품명 초성 검색"/>{search&&!selProd&&filtered.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:8,zIndex:50,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:160,overflowY:"auto"}}>{filtered.map(p=><div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);setSelColor("");}} style={{padding:"10px 14px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer"}}><div style={{fontWeight:600,fontSize:13}}>{p.name}</div><div style={{color:C.sub,fontSize:11,marginTop:2}}>{p.season} · {(p.colors||[]).join(", ")}</div></div>)}</div>}</div></Field>
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
          <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>📋 발주 내역</div>
          {items.map((it,i)=>{const p=products.find(x=>x.id===it.pid);return<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.bdr}`}}><div><div style={{fontWeight:700,fontSize:13}}>{p?.name}</div><div style={{color:C.sub,fontSize:11,marginTop:2}}>{it.color} · {p?.factory}</div></div><span style={{fontWeight:800,color:C.acc,fontSize:15}}>{fmtN(it.qty)}장</span></div>;})}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:10}}><span style={{fontWeight:700,fontSize:13}}>총 수량</span><span style={{fontWeight:900,color:C.acc,fontSize:17}}>{fmtN(items.reduce((s,it)=>s+it.qty,0))}장</span></div>
        </Card>
        <div style={{marginBottom:16}}><div style={{fontWeight:700,fontSize:13,marginBottom:8,color:C.txt}}>📝 전달사항 (선택)</div><textarea value={memo} onChange={e=>setMemo(e.target.value)} placeholder="예: 소량 발주건으로 10야드는 본사로 부탁드립니다." style={{width:"100%",padding:"12px",border:`1px solid ${C.bdr}`,borderRadius:8,fontSize:13,fontFamily:C.fn,outline:"none",resize:"vertical",minHeight:"80px",boxSizing:"border-box"}}/></div>
        <div style={{display:"flex",gap:10}}><Btn ch="← 수정" v="w" full st={{flex:1}} onClick={()=>setStep(1)}/><Btn ch={"✅ 발주 미리보기"} full st={{flex:2,background:C.ok}} onClick={generatePreview} /></div>
      </>}
      {showPreview && (
        <Sheet title="최종 확인" onClose={() => setShowPreview(false)}>
          <div style={{ maxHeight: '55vh', overflowY: 'auto', marginBottom: 16 }}>
            {previewData.map((d, i) => (
              <div key={i} style={{ marginBottom: 16, border: `1px solid ${C.bdr}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontWeight: 800, color: C.acc, marginBottom: 8 }}>📧 {d.vendor.name}</div>
                <div style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>{d.body}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}><Btn ch="취소" v="w" full st={{ flex: 1 }} onClick={() => setShowPreview(false)} /><Btn ch={sending ? "발송 중..." : "🚀 발송"} full st={{ flex: 2, background: C.acc }} onClick={confirmOrder} disabled={sending} /></div>
        </Sheet>
      )}
    </div>
  );
}

// ── 상품 관리 (원본 규격 복구) ──
function ProdsPage({products,setProducts,vendors,factories,user}){
  const [catF,setCatF]=useState("전체");
  const [prodSearch,setProdSearch]=useState("");
  const [sortOrd,setSortOrd]=useState("최신순");
  const [sheet,setSheet]=useState(false);
  const [sheetStep,setSheetStep]=useState(0);
  const [selColor,setSelColor]=useState("");
  const [f,setF]=useState({name:"",category:"",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],colorBom:{},imageUrl:""});
  const [ci,setCi]=useState("");
  const [br,setBr]=useState({type:"원단",mat:"",amt:"",vid:"",price:"",color:""});
  const [editBomId,setEditBomId]=useState(null);
  const [venSearch,setVenSearch]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  const getUnit=t=>["단추","지퍼","기타"].includes(t)?"개":"yd";

  let filtered=catF==="전체"?products:products.filter(p=>p.category===catF);
  filtered = filtered.filter(p=>match(p.name,prodSearch));
  if(sortOrd==="최신순") filtered=[...filtered].reverse();
  else if(sortOrd==="시즌별") filtered=[...filtered].sort((a,b)=>b.season.localeCompare(a.season));
  else if(sortOrd==="공장별") filtered=[...filtered].sort((a,b)=>(a.factory||"").localeCompare(b.factory||""));

  function openAdd(){setF({name:"",category:"",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],colorBom:{},imageUrl:""});setCi("");setBr({type:"원단",mat:"",amt:"",vid:"",price:"",color:""});setSheetStep(0);setSheet(true);}
  function openEdit(p){setF({...p,colors:[...(p.colors||[])],colorBom:{...(p.colorBom||{})},factoryId:p.factory_id||p.factoryId||""});setSheetStep(0);setSheet(true);}
  function copyProd(p){setF({...p, id:undefined, name:p.name+" (복사)", colors:[...(p.colors||[])], colorBom:JSON.parse(JSON.stringify(p.colorBom||{})), factoryId:p.factory_id||p.factoryId||""});setSheetStep(0);setSheet(true);}
  function addColor(){const c=ci.trim();if(!c||f.colors.includes(c))return;setF(p=>({...p,colors:[...p.colors,c],colorBom:{...p.colorBom,[c]:[]}}));setCi("");}
  function removeColor(c){setF(p=>{const nb={...p.colorBom};delete nb[c];return{...p,colors:p.colors.filter(x=>x!==c),colorBom:nb};});if(selColor===c)setSelColor("");}
  const handleImageUpload = (e) => { const file = e.target.files[0]; if(file) { const reader = new FileReader(); reader.onloadend = () => { setF(prev => ({...prev, imageUrl: reader.result})); }; reader.readAsDataURL(file); } };
  
  function goToStep1(){ if(!f.name||f.colors.length===0){alert("명칭과 색상을 입력하세요");return;}setSelColor(f.colors[0]);setSheetStep(1); }
  function addBom(){ if(!br.mat||!br.amt||!br.vid)return; const newBom={...br, id:uid(), amt:Number(br.amt), unit:getUnit(br.type)}; setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:[...(p.colorBom[selColor]||[]), newBom]}})); setBr({type:"원단",mat:"",amt:"",vid:"",price:"",color:""});setVenSearch(""); }
  function removeBom(id){setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:p.colorBom[selColor].filter(b=>b.id!==id)}}));}

  async function save(){
    const sd={name:f.name, category:f.category, season:f.season, factory_id:f.factoryId||null, factory:f.factory, factory_tel:f.factoryTel, colors:f.colors, color_bom:f.colorBom, image_url:f.imageUrl};
    try{
      if(f.id&&user?.token){ await DB.update(user.token,"products",f.id,sd); setProducts(products.map(p=>p.id===f.id?{...f}:p)); }
      else if(user?.token){ const r=await DB.insert(user.token,"products",{...sd,user_id:user.id}); setProducts(p=>[...p,r[0]]); }
    }catch(e){alert("에러 발생");}
    setSheet(false);
  }
  async function delProd(id){if(!window.confirm("삭제?"))return; if(user?.token)try{await DB.del(user.token,"products",id);setProducts(p=>p.filter(x=>x.id!==id));}catch{}}

  const curBom=f.colorBom[selColor]||[];

  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontWeight:900,fontSize:20}}>상품 관리</div><Btn ch="+ 추가" sz="s" onClick={openAdd}/></div>
      <div style={{display:"flex",gap:7,marginBottom:12,overflowX:"auto",paddingBottom:4}}>{["전체",...CATS].map(cat=><button key={cat} onClick={()=>setCatF(cat)} style={{padding:"6px 12px",borderRadius:20,border:`1.5px solid ${catF===cat?C.acc:C.bdr}`,background:catF===cat?C.acc:"#fff",color:catF===cat?"#fff":C.sub2,fontSize:11,fontWeight:600}}>{cat}</button>)}</div>
      <div style={{marginBottom:14}}><TxtInp val={prodSearch} onChange={setProdSearch} ph="🔍 상품명 초성 검색"/></div>
      {filtered.length===0?<Empty icon="👕" text="상품이 없습니다"/>:filtered.map(p=>(
        <Card key={p.id} st={{marginBottom:10}} onClick={()=>openEdit(p)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{flex:1}}><div style={{fontWeight:800,fontSize:14}}>{p.name} <Tag ch={p.season}/></div><div style={{fontSize:11,color:C.sub,marginTop:4}}>{(p.colors||[]).join(", ")}</div></div>
            <div style={{display:'flex', gap:6}}><Btn ch="복사" v="w" sz="s" st={{color:C.acc}} onClick={(e)=>{e.stopPropagation();copyProd(p);}}/><Btn ch="삭제" v="w" sz="s" st={{color:C.red}} onClick={(e)=>{e.stopPropagation();delProd(p.id);}}/></div>
          </div>
        </Card>
      ))}
      {sheet&&<Sheet title={f.id?"상품 수정":"상품 등록"} onClose={()=>setSheet(false)}>
        <StepBar cur={sheetStep} total={2}/>
        {sheetStep===0&&<>
          <FCard><FRow label="상품명" req><FInp val={f.name} onChange={sf("name")} ph="상품명 입력"/></FRow>
          <FRow label="시즌"><FSel val={f.season} onChange={sf("season")}>{SEASONS.map(s=><option key={s} value={s}>{s}</option>)}</FSel></FRow>
          <FRow label="공장" last><FSel val={f.factoryId} onChange={v=>{const fc=factories.find(x=>x.id===v);setF(p=>({...p,factoryId:v,factory:fc?.name||"",factoryTel:fc?.tel||""}));}} ph="공장 선택">{factories.map(fc=><option key={fc.id} value={fc.id}>{fc.name}</option>)}</FSel></FRow></FCard>
          <Field label="작업지시서"><div style={{border: `1px dashed ${C.bdr}`, borderRadius: 8, padding: 16, textAlign: "center", background: "#fff"}} onClick={()=>document.getElementById('img-upload').click()}>{f.imageUrl ? <img src={f.imageUrl} style={{maxWidth: "100%", maxHeight: 200}} /> : "📸 사진 업로드"}<input id="img-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{display: "none"}} /></div></Field>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{CATS.map(cat=><button key={cat} onClick={()=>sf("category")(cat)} style={{padding:"5px 11px",borderRadius:20,border:`1.5px solid ${f.category===cat?C.acc:C.bdr}`,background:f.category===cat?C.acc:"#fff",color:f.category===cat?"#fff":C.sub2,fontSize:11}}>{cat}</button>)}</div>
          <div style={{background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:10,padding:12,marginBottom:20}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:10}}>{f.colors.map(c=><Tag key={c} ch={c}/>)}</div>
            <div style={{display:"flex",gap:6}}><input value={ci} onChange={e=>setCi(e.target.value)} placeholder="색상 추가" style={{flex:1,border:`1px solid ${C.bdr}`,borderRadius:8,padding:8}}/><button onClick={addColor} style={{background:C.acc,color:"#fff",border:"none",borderRadius:8,padding:"0 12px"}}>+ 추가</button></div>
          </div>
          <Btn ch="다음 : 원부자재 등록 →" full onClick={goToStep1}/></>}
        {sheetStep===1&&<>
          <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto"}}>{f.colors.map(c=><button key={c} onClick={()=>setSelColor(c)} style={{padding:"8px 16px",borderRadius:20,flexShrink:0,border:`2px solid ${selColor===c?C.acc:C.bdr}`,background:selColor===c?C.acc:"#fff",color:selColor===c?"#fff":C.sub2,fontWeight:700}}>{c}</button>)}</div>
          {selColor&&<div style={{background:"#F0F4FF",borderRadius:12,padding:14,marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:C.acc,marginBottom:10}}>[{selColor}] 원부자재 목록</div>
            {curBom.map(b=><div key={b.id} style={{fontSize:12,marginBottom:4, display:'flex', justifyContent:'space-between'}}><span>• {b.mat} ({b.amt}{b.unit})</span> <button onClick={()=>removeBom(b.id)} style={{background:'none', border:'none', color:C.red}}>✕</button></div>)}
            <Divider/>
            <div style={{fontSize:12,fontWeight:700,color:C.acc,marginBottom:10}}>✏️ 원부자재 추가</div>
            <FCard mb={8}>
              <FRow label="업체명"><div style={{flex:1,position:"relative"}}><input value={venSearch} onChange={e=>{setVenSearch(e.target.value); if(!e.target.value) setBr(p=>({...p,vid:''})); }} placeholder="검색" style={{width:"100%",border:"none",textAlign:"right"}}/>{venSearch&&!br.vid&&<div style={{position:"absolute",top:"100%",right:0,width:150,background:"#fff",border:`1px solid ${C.bdr}`,zIndex:50}}>{vendors.filter(v=>match(v.name,venSearch)).map(v=><div key={v.id} onClick={()=>{setBr(p=>({...p,vid:v.id}));setVenSearch(v.name);}} style={{padding:8}}>{v.name}</div>)}</div>}</div></FRow>
              <FRow label="유형"><FSel val={br.type} onChange={v=>setBr(p=>({...p,type:v}))}>{MAT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</FSel></FRow>
              <FRow label="명칭"><FInp val={br.mat} onChange={v=>setBr(p=>({...p,mat:v}))} ph="원부자재명"/></FRow>
              <FRow label="소요량" last><FInp val={br.amt} onChange={v=>setBr(p=>({...p,amt:v}))} ph="0" type="number"/></FRow>
            </FCard>
            <Btn ch="+ BOM 리스트에 추가" full onClick={addBom}/>
          </div>}
          <div style={{display:"flex",gap:10}}><Btn ch="← 이전" v="w" full onClick={()=>setSheetStep(0)}/><Btn ch="저장 완료" full onClick={save}/></div></>}
      </Sheet>}
    </div>
  );
}

// ── 발주 리스트 ──
function ListPage({orders,setOrders,products,user,onNav}){
  const [filter,setFilter]=useState("전체");
  const [open,setOpen]=useState(null);
  const SC={완료:C.ok,지연:C.warn,진행중:C.acc};
  const filtered=(filter==="전체"?orders:orders.filter(o=>o.status===filter)).sort((a,b)=>new Date(b.ts||0)-new Date(a.ts||0));
  async function changeStatus(id,status){if(user?.token)try{await DB.update(user.token,"orders",id,{status});setOrders(p=>p.map(x=>x.id===id?{...x,status}:x));}catch{}}
  async function delOrder(id){if(!window.confirm("삭제?"))return;if(user?.token)try{await DB.del(user.token,"orders",id);setOrders(p=>p.filter(x=>x.id!==id));}catch{}}
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:12}}>발주 리스트</div>
      <div style={{display:"flex",gap:7,marginBottom:14,overflowX:"auto"}}>{["전체","진행중","완료","지연"].map(s=><button key={s} onClick={()=>setFilter(s)} style={{padding:"6px 14px",borderRadius:20,flexShrink:0,border:`1.5px solid ${filter===s?C.acc:C.bdr}`,background:filter===s?C.acc+"18":"#fff",color:filter===s?C.acc:C.sub2,fontWeight:600,fontSize:12}}>{s}</button>)}</div>
      {filtered.length===0?<Empty icon="📋" text="발주 내역이 없습니다"/>:filtered.map(o=>{
        const isO=open===o.id;
        return<Card key={o.id} st={{marginBottom:10,cursor:"pointer"}} onClick={()=>setOpen(isO?null:o.id)}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div><div style={{fontWeight:700,fontSize:13}}>{o.date} 발주</div><div style={{color:C.sub,fontSize:11,marginTop:2}}>{(o.items||[]).length}개 품목</div></div>
            <Tag ch={o.status} c={SC[o.status]||C.sub}/>
          </div>
          {isO&&<div><Divider/>{(o.items||[]).map((it,j)=>{const p=products.find(x=>x.id===it.pid); return<div key={j} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0"}}>{p?.name} / {it.color} <strong>{it.qty}장</strong></div>;})}
          <div style={{display:"flex",gap:7,marginTop:10}}>{["진행중","완료","지연"].map(st=><Btn key={st} ch={st} sz="s" st={{padding:"4px 8px",fontSize:11}} onClick={()=>changeStatus(o.id,st)}/>)}<Btn ch="삭제" v="w" sz="s" st={{color:C.red,marginLeft:"auto"}} onClick={()=>delOrder(o.id)}/></div></div>}
        </Card>
      })}
    </div>
  );
}

// ── 거래처 관리 ──
function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",email:"",type:"원단",address:""});
  const [editId,setEditId]=useState(null);
  const [venSearch,setVenSearch]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  function openAdd(){setF({name:"",tel:"",email:"",type:"원단",address:""});setEditId(null);setSheet(true);}
  function openEdit(v){setF({...v});setEditId(v.id);setSheet(true);}
  async function save(){
    if(!f.name || !f.tel || !f.address){alert("필수 항목 입력");return;}
    if(editId){ await DB.update(user.token,"vendors",editId,f); setVendors(vv=>vv.map(v=>v.id===editId?{...v,...f}:v)); }
    else{ const r=await DB.insert(user.token,"vendors",{...f,user_id:user.id}); setVendors(vv=>[...vv, r[0]]); }
    setSheet(false);
  }
  async function delVen(id){if(!window.confirm("삭제?"))return; if(user?.token)try{await DB.del(user.token,"vendors",id);setVendors(vv=>vv.filter(x=>x.id!==id));}catch{}}
  const filtered = vendors.filter(v=>match(v.name, venSearch));
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontWeight:900,fontSize:20}}>거래처 관리</div><Btn ch="+ 추가" sz="s" onClick={openAdd}/></div>
      <div style={{marginBottom:16}}><TxtInp val={venSearch} onChange={setVenSearch} ph="🔍 거래처 검색"/></div>
      {filtered.map(v=><Card key={v.id} st={{marginBottom:10}} onClick={()=>openEdit(v)}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{flex:1}}><div style={{fontWeight:800,fontSize:14}}>{v.name} <Tag ch={v.type} c={VEN_C[v.type]}/></div><div style={{color:C.sub,fontSize:12,marginTop:2}}>📱 {v.tel} / 📍 {v.address}</div></div><Btn ch="삭제" v="w" sz="s" st={{color:C.red}} onClick={(e)=>{e.stopPropagation(); delVen(v.id);}}/></div></Card>)}
      {sheet&&<Sheet title={editId?"거래처 수정":"거래처 추가"} onClose={()=>setSheet(false)}>
        <Field label="거래처명" req><TxtInp val={f.name} onChange={sf("name")}/></Field>
        <Field label="핸드폰" req><TxtInp val={f.tel} onChange={sf("tel")}/></Field>
        <Field label="주소" req><TxtInp val={f.address} onChange={sf("address")}/></Field>
        <Field label="이메일"><TxtInp val={f.email} onChange={sf("email")}/></Field>
        <Field label="유형"><FSel val={f.type} onChange={sf("type")}>{VEN_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</FSel></Field>
        <Btn ch="저장" full onClick={save}/>
      </Sheet>}
    </div>
  );
}

// ── 환경설정 (WL 항목 및 디자인 적용) ──
function SettingsPage({user,setUser,factories,setFactories,onLogout}){
  const [facSheet,setFacSheet]=useState(null);
  const [profileSheet,setProfileSheet]=useState(false);
  const [pf,setPf]=useState({name:user.name,brand:user.brand,tel:user.tel,address:user.address});

  async function saveProfile(){
    if(user?.token){
      const r = await fetch(`${SB}/auth/v1/user`, { method:"PUT", headers:ah(user.token), body:JSON.stringify({data:pf}) });
      const res = await r.json();
      if(res.id){ if(setUser)setUser(u=>({...u,...pf})); setProfileSheet(false); alert("저장되었습니다!"); }
    }
  }
  async function saveFac(){
    if(!facSheet.name)return;
    const{id,...data}=facSheet;
    if(id){ await DB.update(user.token,"factories",id,{...data,biz_type:data.bizType,biz_no:data.bizNo}); setFactories(ff=>ff.map(x=>x.id===id?{...x,...data}:x)); }
    else{ const r=await DB.insert(user.token,"factories",{...data,biz_type:data.bizType,biz_no:data.bizNo,user_id:user.id}); setFactories(ff=>[...ff,r[0]]); }
    setFacSheet(null);
  }
  async function delFac(id){if(!window.confirm("삭제?"))return; if(user?.token)try{await DB.del(user.token,"factories",id);setFactories(ff=>ff.filter(x=>x.id!==id));}catch{}}

  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:18}}>환경설정</div>
      <Card st={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:22,background:C.acc+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👤</div>
          <div style={{flex:1}}><div style={{fontWeight:800,fontSize:14}}>{user.name} ({user.brand})</div><div style={{color:C.sub,fontSize:12}}>{user.email}</div></div>
          <Btn ch="수정" v="w" sz="s" onClick={()=>setProfileSheet(true)}/>
        </div>
        <Divider/><Btn ch="로그아웃" v="w" full st={{color:C.red}} onClick={onLogout}/>
      </Card>
      
      <div style={{fontWeight:700,fontSize:15,margin:'20px 0 10px'}}>공장 목록</div>
      {factories.map(fc=><Card key={fc.id} st={{marginBottom:10}} onClick={()=>setFacSheet({...fc,bizType:fc.biz_type||fc.bizType,bizNo:fc.biz_no||fc.bizNo})}><div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><div style={{fontSize:13, fontWeight:700}}>{fc.name} / {fc.biz_type||fc.bizType}</div> <Btn ch='삭제' v='w' sz='s' st={{color:C.red}} onClick={(e)=>{e.stopPropagation(); delFac(fc.id);}}/></div></Card>)}
      <Btn ch="+ 새 공장 등록" full v="w" onClick={()=>setFacSheet({id:null,name:"",bizType:"다이마루",address:"",tel:"",account:"",bizNo:""})}/>

      {profileSheet&&<Sheet title="WL 정보 수정" onClose={()=>setProfileSheet(false)}>
        <Field label="브랜드명"><TxtInp val={pf.brand} onChange={v=>setPf(p=>({...p,brand:v}))}/></Field>
        <Field label="성함"><TxtInp val={pf.name} onChange={v=>setPf(p=>({...p,name:v}))}/></Field>
        <Field label="연락처"><TxtInp val={pf.tel} onChange={v=>setPf(p=>({...p,tel:v}))}/></Field>
        <Btn ch="저장" full onClick={saveProfile}/>
      </Sheet>}

      {facSheet&&<Sheet title="WTMT 공장 정보" onClose={()=>setFacSheet(null)}>
        <Field label="공장명" req><TxtInp val={facSheet.name} onChange={v=>setFacSheet(p=>({...p,name:v}))}/></Field>
        {/* ✅ WTMT 필수 항목 복구: 사업자등록번호 */}
        <Field label="사업자등록번호"><TxtInp val={facSheet.bizNo} onChange={v=>setFacSheet(p=>({...p,bizNo:v}))}/></Field>
        <Field label="주소"><TxtInp val={facSheet.address} onChange={v=>setFacSheet(p=>({...p,address:v}))}/></Field>
        {/* ✅ WTMT 필수 항목 복구: 계좌번호 */}
        <Field label="계좌번호"><TxtInp val={facSheet.account} onChange={v=>setFacSheet(p=>({...p,account:v}))}/></Field>
        <Field label="연락처"><TxtInp val={facSheet.tel} onChange={v=>setFacSheet(p=>({...p,tel:v}))}/></Field>
        <Btn ch="저장" full onClick={saveFac}/>
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
      setVendors(Array.isArray(v)?v:[]);
      setFactories(Array.isArray(f)?f:[]);
      // ✅ color_bom 복구 규격 적용
      setProducts(Array.isArray(p)?p.map(x=>({...x, colorBom:x.color_bom||{}})):[]);
      setOrders(Array.isArray(o)?o:[]);
    }catch(e){setScreen("auth");}
    finally{setLoading(false);}
  }

  useEffect(()=>{
    async function checkSession(){
      const s=localStorage.getItem("dworks_session");
      if(s){ const u=JSON.parse(s); setUser(u); setScreen("app"); loadData(u.token); }
      else setScreen("splash");
    }
    checkSession();
  },[]);

  async function handleLogin(u, keep){
    if(keep) try{localStorage.setItem("dworks_session",JSON.stringify(u));}catch{}
    setUser(u); setScreen("app"); await loadData(u.token);
  }

  async function handleLogout(){ try{localStorage.removeItem("dworks_session");}catch{} setUser(null); setScreen("auth"); }

  // ✅ 새로운 디자인: 아이콘 없는 중앙 정렬 박스 메뉴
  const TABS=[{k:"order", l:"발주하기"},{k:"prods", l:"상품"},{k:"list", l:"발주리스트"},{k:"vendors", l:"거래처"},{k:"settings", l:"설정"}];

  if(screen==="loading")return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>로딩 중...</div>;
  if(screen==="splash")return<SplashPage onStart={()=>setScreen("auth")}/>;
  if(screen!=="app"||!user)return<AuthPage onLogin={handleLogin}/>;

  const pages={
    dash:<DashPage orders={orders} products={products} onNav={setPage}/>,
    order:<OrderPage products={products} orders={orders} setOrders={setOrders} vendors={vendors} factories={factories} user={user} onNav={setPage}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} factories={factories} user={user}/>,
    list:<ListPage orders={orders} setOrders={setOrders} products={products} user={user} onNav={setPage}/>,
    vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,
    settings:<SettingsPage user={user} setUser={setUser} factories={factories} setFactories={setFactories} onLogout={handleLogout}/>,
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,maxWidth:480,margin:"0 auto",position:"relative",boxShadow:"0 0 40px rgba(0,0,0,0.1)"}}>
      <div style={{background:"#fff",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${C.bdr}`}}>
        {/* ✅ 새로운 디자인: 상단 브랜드 WTMT 변경 */}
        <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:19,cursor:"pointer",fontFamily:C.fn,letterSpacing:1}}>WTMT</button>
        <span style={{color:C.sub,fontSize:12,fontWeight:600}}>{user.name} ({user.brand})</span>
      </div>
      <div style={{paddingBottom:80}}>{pages[page]||pages["dash"]}</div>
      
      {/* 🚀 새로운 디자인: 하단 박스 메뉴 바 고정 🚀 */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:`1px solid ${C.bdr}`,display:"flex",zIndex:50, height:65}}>
        {TABS.map(t=><button key={t.k} onClick={()=>setPage(t.k)} style={{
          flex:1,
          background:page===t.k?C.acc+"08":"none",
          border:"none",
          borderRight:t.k!=="settings"?`1px solid ${C.bdr}`:"none",
          color:page===t.k?C.acc:C.sub2,
          cursor:"pointer",
          fontFamily:C.fn,
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          padding:"0 4px",
          transition:"all 0.2s"
        }}>
          <span style={{fontSize:12, fontWeight:page===t.k?800:600, textAlign:"center", lineHeight:1.2}}>{t.l}</span>
        </button>)}
      </div>
    </div>
  );
}
