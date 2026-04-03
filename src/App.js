import React, { useState, useEffect } from "react";

// ── Supabase ──────────────────────────────────────────────────
const SB = "https://qimgostiseehdnvhmoph.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";
function ah(t){return{"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"};}
async function api(m,p,t,b){const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined});return r.json();}
const DB={
  signUp:(e,pw,meta)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:meta}),
  signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),
  signOut:(t)=>fetch(`${SB}/auth/v1/logout`,{method:"POST",headers:ah(t)}),
  updateUser:(t,meta)=>api("PUT","/auth/v1/user",t,{data:meta}),
  list:(t,tbl)=>api("GET",`/rest/v1/${tbl}?order=created_at.asc`,t),
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

// ── 초성 검색 로직 ────────────────────────────────────────────
const CHO=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const getCho=s=>(s||"").split("").map(c=>{const cd=c.charCodeAt(0);return(cd>=44032&&cd<=55203)?CHO[Math.floor((cd-44032)/588)]:c;}).join("");
const match=(t,q)=>{if(!q)return true;const txt=(t||"").toLowerCase(),qry=(q||"").toLowerCase();return txt.includes(qry)||getCho(txt).includes(getCho(qry));};

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
  const [f,setF]=useState({company:"",brand:"",name:"",position:"",tel:"",email:"",pw:"",pw2:"",address:"",agree:false});
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const sf=k=>v=>setF(p=>({...p,[k]:v}));

  async function submit(){
    setErr("");
    if(!f.email||!f.pw){setErr("이메일과 비밀번호를 입력하세요");return;}
    if(tab==="up"){
      if(!f.company){setErr("업체명을 입력하세요");return;}
      if(!f.name){setErr("성함을 입력하세요");return;}
      if(!f.position){setErr("직함을 입력하세요");return;}
      if(!f.tel){setErr("연락처를 입력하세요");return;}
      if(f.pw!==f.pw2){setErr("비밀번호가 일치하지 않습니다");return;}
      if(f.pw.length<6){setErr("비밀번호 6자 이상");return;}
      if(!f.agree){setErr("개인정보 수집 및 이용에 동의해주세요");return;}
    }

    setLoading(true);
    try{
      if(tab==="up"){
        const r=await DB.signUp(f.email,f.pw,{
          company:f.company,
          brand:f.brand,
          name:f.name,
          position:f.position,
          tel:f.tel,
          address:f.address
        });
        if(r.error){setErr(r.error.message.includes("already")?"이미 가입된 이메일":r.error.message);return;}
        const r2=await DB.signIn(f.email,f.pw);
        if(!r2.access_token){setErr("가입완료! 로그인해주세요");setTab("in");return;}
        onLogin({
          token:r2.access_token,
          id:r2.user.id,
          name:f.name,
          company:f.company,
          email:f.email,
          tel:f.tel,
          brand:f.brand,
          position:f.position,
          address:f.address
        });
      }else{
        const r=await DB.signIn(f.email,f.pw);
        if(!r.access_token){const msg=r.error?.message||"";setErr(msg.includes("Invalid")||msg.includes("invalid")?"이메일 또는 비밀번호가 틀렸습니다":msg||"로그인 실패");return;}
        const meta=r.user?.user_metadata||{};
        onLogin({
          token:r.access_token,
          id:r.user.id,
          name:meta.name||f.email.split("@")[0],
          company:meta.company||"",
          email:r.user.email,
          tel:meta.tel||"",
          brand:meta.brand||"",
          position:meta.position||"",
          address:meta.address||""
        });
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
            <Field label="업체명" req><TxtInp val={f.company} onChange={sf("company")} ph="회사명을 입력하세요"/></Field>
            <Field label="브랜드명"><TxtInp val={f.brand} onChange={sf("brand")} ph="브랜드명을 입력하세요 (선택)"/></Field>
            <Field label="성함" req><TxtInp val={f.name} onChange={sf("name")} ph="성함을 입력하세요"/></Field>
            <Field label="직함" req><TxtInp val={f.position} onChange={sf("position")} ph="예: 대표, 팀장, 매니저"/></Field>
            <Field label="연락처" req><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field>
          </>
        )}

        <Field label="이메일" req><TxtInp val={f.email} onChange={sf("email")} ph="example@email.com" type="email"/></Field>
        <Field label="비밀번호" req><TxtInp val={f.pw} onChange={sf("pw")} ph={tab==="up"?"6자 이상":"비밀번호"} type="password" onKeyDown={e=>e.key==="Enter"&&submit()}/></Field>
        
        {tab==="up" && (
          <>
            <Field label="비밀번호 확인" req><TxtInp val={f.pw2} onChange={sf("pw2")} ph="비밀번호 재입력" type="password"/></Field>
            <Field label="주소"><TxtInp val={f.address} onChange={sf("address")} ph="사무실 주소를 입력하세요"/></Field>
            
            <div style={{marginTop:24, padding:14, background:"#fff", border:`1px solid ${C.bdr}`, borderRadius:10}}>
              <div style={{fontSize:12, color:C.sub2, lineHeight:1.6, height:80, overflowY:"auto", marginBottom:10}}>
                <strong>[개인정보 수집 및 이용 안내]</strong><br/>
                1. 수기 계산 및 발주 업무 자동화를 위해 업체명, 성함, 연락처를 수집합니다.<br/>
                2. 수집된 정보는 서비스 제공 및 고객 관리를 위해서만 사용됩니다.<br/>
                3. 사용자는 언제든 탈퇴 및 정보 수정을 요청할 수 있습니다.
              </div>
              <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer"}}>
                <input type="checkbox" checked={f.agree} onChange={e=>sf("agree")(e.target.checked)} style={{width:16, height:16}} />
                <span style={{fontSize:13, fontWeight:600, color:C.txt}}>내용을 확인했으며 동의합니다 (필수)</span>
              </label>
            </div>
          </>
        )}

        {err&&<div style={{color:C.red,fontSize:13,marginTop:16,marginBottom:12,padding:"10px 14px",background:"#FFF5F5",borderRadius:8,border:"1px solid #FED7D7"}}>{err}</div>}
        <Btn ch={loading?(tab==="in"?"로그인 중...":"가입 중..."):(tab==="in"?"로그인":"가입하기")} onClick={submit} full sz="l" disabled={loading} st={{borderRadius:10,height:50,fontSize:15,marginTop:20}}/>
        {tab==="in"&&<div style={{textAlign:"center",marginTop:14,fontSize:13,color:C.sub}}>계정이 없으신가요? <span onClick={()=>setTab("up")} style={{color:C.acc,fontWeight:700,cursor:"pointer"}}>회원가입</span></div>}
      </div>
    </div>
  );
}

function DashPage({orders,products,onNav}){
  const td=today(),vs=new Date();vs.setDate(vs.getDate()-1);const yd=vs.toISOString().slice(0,10);
  const tO=orders.filter(o=>o.date===td);
  const mQ=orders.filter(o=>o.date?.slice(0,7)===td.slice(0,7)).reduce((s,o)=>s+(o.items||[]).reduce((ss,i)=>ss+(i.qty||0),0),0);
  const delayed=orders.filter(o=>o.status==="지연");
  const chart=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const ds=d.toISOString().slice(0,10);return{label:ds.slice(5),v:orders.filter(o=>o.date===ds).reduce((s,o)=>s+(o.items||[]).reduce((ss,ii)=>ss+(ii.qty||0),0),0)};});
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,textAlign:"center",marginBottom:14}}>대시 보드</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,marginBottom:14,border:`1px solid ${C.bdr}`,borderRadius:12,overflow:"hidden"}}>
        {[{label:"오늘 발주",val:`${tO.length}건`,c:C.acc},{label:"미출고 발주",val:`${delayed.length}건`,c:"#8B5CF6"},{label:"이달 발주량",val:`${fmtN(mQ)}매`,c:C.ok}].map((s,i)=><div key={s.label} style={{background:"#fff",padding:"12px 6px",textAlign:"center",borderLeft:i>0?`1px solid ${C.bdr}`:"none"}}><div style={{color:s.c,fontSize:20,fontWeight:900}}>{s.val}</div><div style={{color:C.sub,fontSize:10,marginTop:3,fontWeight:600}}>{s.label}</div></div>)}
      </div>
      <Card st={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontWeight:800,fontSize:14}}>⚠️ 지연 {delayed.length}건</span>
          {delayed.length>2&&<button onClick={()=>onNav("list")} style={{background:"none",border:"none",fontSize:12,color:C.sub,cursor:"pointer",fontFamily:C.fn}}>더보기</button>}
        </div>
        {delayed.length===0?<div style={{textAlign:"center",padding:"12px 0",color:C.sub,fontSize:12}}>지연 발주 없음 ✅</div>:<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 70px 50px 44px",fontSize:11,fontWeight:600,color:C.sub,padding:"0 0 6px",borderBottom:`1px solid ${C.bdr}`,marginBottom:4}}>{["상품명","색상","수량","상태"].map(h=><div key={h}>{h}</div>)}</div>
          {delayed.slice(0,5).flatMap(o=>(o.items||[]).map((it,j)=>{const p=products.find(x=>x.id===it.pid);return<div key={`${o.id}-${j}`} style={{display:"grid",gridTemplateColumns:"1fr 70px 50px 44px",fontSize:12,padding:"6px 0",borderBottom:`1px solid ${C.bdr}`,alignItems:"center"}}><div style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p?.name||"-"}</div><div style={{color:C.sub2}}>{it.color}</div><div>{fmtN(it.qty)}</div><Tag ch="지연" c={C.warn}/></div>;}))}</>}
      </Card>
      <Card><div style={{fontWeight:700,fontSize:13,marginBottom:10}}>📈 발주량 추이</div><LineChart data={chart}/><div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>{chart.filter((_,i)=>i%2===0).map(d=><span key={d.label} style={{fontSize:9,color:C.sub}}>{d.label}</span>)}</div></Card>
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
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  
  const DRAFT="dworks_draft";
  useEffect(()=>{
    try{
      const d=localStorage.getItem(DRAFT);
      if(d){
        const dr=JSON.parse(d);
        if(dr.items?.length>0){
          setItems(dr.items);
          alert("이전 발주(또는 임시저장) 내역을 불러왔습니다.\n수량을 확인하고 수정해주세요!");
        }
      }
    }catch{};
  },[]);
  
  const filtered=products.filter(p=>match(p.name,search)||match(p.season,search));

  function addItem(){if(!selProd||!selColor||!qty){alert("상품·색상·수량을 입력하세요");return;}const idx=items.findIndex(i=>i.pid===selProd.id&&i.color===selColor);if(idx>=0)setItems(p=>p.map((it,i)=>i===idx?{...it,qty:it.qty+Number(qty)}:it));else setItems(p=>[...p,{pid:selProd.id,color:selColor,qty:Number(qty)}]);setSelProd(null);setSelColor("");setQty("");setSearch("");}
  
  function generatePreview() {
    if(!items.length){alert("발주 항목 추가");return;}
    const venMap={};
    for(const it of items){
      const prod=products.find(x=>x.id===it.pid);
      if(!prod)continue;
      const bomList=prod.colorBom?.[it.color]||prod.bom||[];
      for(const b of bomList){
        const ven=vendors.find(v=>v.id===b.vid);
        if(!ven)continue;
        const soyo=Math.round(b.amt*it.qty*100)/100;
        if(!venMap[ven.id])venMap[ven.id]={vendor:ven,lines:[]};
        venMap[ven.id].lines.push({mat:b.mat,color:b.color||it.color,soyo,unit:b.unit||"yd",prod});
      }
    }
    const targets=Object.values(venMap).filter(v=>v.vendor.email);
    if(!targets.length) {
      alert("발송할 거래처 이메일이 등록되어 있지 않습니다.\n거래처 관리에서 이메일을 확인해주세요.");
      return;
    }

    const pData = [];
    for(const{vendor,lines}of targets){
      const companyName=user?.company||"디자인워커스";
      let body=`${vendor.name} 담당자님 안녕하세요.\n\n업체명 : ${companyName}\n\n`;
      
      const prodMap={};
      for(const l of lines){
        const pName=l.prod?.name||"-";
        if(!prodMap[pName])prodMap[pName]={matMap:{}};
        if(!prodMap[pName].matMap[l.mat])prodMap[pName].matMap[l.mat]={mat:l.mat,unit:l.unit,colors:[]};
        prodMap[pName].matMap[l.mat].colors.push(`${l.color} ${fmtN(l.soyo)}${l.unit}`);
      }

      for(const[pName,pDataObj]of Object.entries(prodMap)){
        for(const m of Object.values(pDataObj.matMap)){
          body+=`${m.mat}\n`;
          m.colors.forEach(c=>{body+=`${c}\n`;});
          body+=`\n`;
        }
        body+=`품목 : ${pName}\n\n`;
      }
      
      const p=lines[0]?.prod;
      body+=`입고처 : ${p?.factory||"-"}\n`;
      const factoryObj=factories?.find(f=>f.name===p?.factory);
      body+=`주소 : ${factoryObj?.address||"-"}\n`;
      body+=`연락처 : ${p?.factoryTel||"-"}\n\n`;
      
      if(memo)body+=`[요청 및 전달사항]\n${memo}\n\n`;
      body+=`감사합니다 문제 있으면 피드백 주세요.\nD-Works`;

      pData.push({ vendor, body });
    }
    
    setPreviewData(pData);
    setShowPreview(true);
  }

  async function confirmOrder() {
    setSending(true);
    const groupedByPid = items.reduce((acc, it) => {
      if(!acc[it.pid]) acc[it.pid] = [];
      acc[it.pid].push(it);
      return acc;
    }, {});

    const ts = new Date().toISOString();
    const d = today();
    const newOrders = [];

    for(const [pid, groupItems] of Object.entries(groupedByPid)){
      const o = { items: groupItems, status: "진행중", date: d, ts };
      try{
        if(!user?.token) { alert("로그인 정보가 없습니다. 다시 로그인해주세요."); setSending(false); return; }
        const r = await DB.insert(user.token, "orders", {...o, user_id: user.id});
        if(r.error || r.code || !Array.isArray(r) || r.length === 0) { 
          alert(`[발주 저장 실패] DB 에러입니다.\n사유: ${r.message}`); 
          setSending(false); 
          return; 
        }
        newOrders.push(r[0]);
      }catch(e){
        alert("[네트워크 에러] 발주가 저장되지 않았습니다. 인터넷 연결을 확인하세요.");
        setSending(false);
        return;
      }
    }
    setOrders(p => [...newOrders, ...p]);
    try{localStorage.removeItem(DRAFT);}catch{}

    let cnt=0;
    for(const data of previewData){
      if(await sendEmail(data.vendor.email, data.vendor.name, `[D-Works 발주서] ${today()} - ${data.vendor.name}`, data.body)) {
        cnt++;
      }
    }

    setSending(false);
    setShowPreview(false);
    if(cnt>0)console.log(`✅ ${cnt}곳 발주서 발송 완료`);
    setStep(3);
  }

  function reset(){setStep(1);setItems([]);setSearch("");setSelProd(null);setSelColor("");setQty("");setMemo("");setPreviewData([]);setShowPreview(false);}
  if(step===3)return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",padding:24}}><div style={{fontSize:56,marginBottom:14}}>✅</div><div style={{fontWeight:900,fontSize:22,marginBottom:8}}>발주 완료!</div><div style={{color:C.sub,marginBottom:28,fontSize:13}}>{items.length}개 상품 발주</div><Btn ch="+ 새 발주 입력" onClick={reset} sz="l" st={{borderRadius:12}}/></div>;
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:4}}>{step===1?"발주 입력":"발주서 확인"}</div>
      <div style={{color:C.sub,fontSize:12,marginBottom:14}}>기본 정보를 입력해 주세요</div>
      <StepBar cur={step-1}/>
      {step===1&&<>
        <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>발주 추가</div>
        <Card st={{marginBottom:12}}>
          <Field label="상품명"><div style={{position:"relative"}}><TxtInp val={search} onChange={v=>{setSearch(v);if(selProd&&v!==selProd.name)setSelProd(null);}} ph="🔍 상품명 초성 검색"/>{search&&!selProd&&filtered.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:8,zIndex:50,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:160,overflowY:"auto"}}>{filtered.map(p=><div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);setSelColor("");}} style={{padding:"10px 14px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer"}}><div style={{fontWeight:600,fontSize:13}}>{p.name}</div><div style={{color:C.sub,fontSize:11,marginTop:2}}>{p.season} · {(p.colors||[]).join(", ")}</div></div>)}</div>}</div></Field>
          <Field label="색상"><DropSel val={selColor} onChange={setSelColor} ph="색상 선택">{(selProd?.colors||[]).map(c=><option key={c} value={c}>{c}</option>)}</DropSel></Field>
          <Field label="수량"><TxtInp val={qty} onChange={setQty} ph="수량 입력" type="number"/></Field>
        </Card>
        <Btn ch="+ 발주 리스트에 추가" full onClick={addItem} disabled={!selProd||!selColor||!qty} st={{marginBottom:18}}/>
        <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>발주 리스트</div>
        <Card st={{marginBottom:18}}>{items.length===0?<div style={{padding:"16px 0",color:C.sub,fontSize:12,textAlign:"center"}}>추가된 항목 없음</div>:items.map((it,i)=>{const p=products.find(x=>x.id===it.pid);return<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.bdr}`}}><div style={{fontSize:13}}><span style={{fontWeight:700}}>{p?.name}</span> / {it.color}</div><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontWeight:700,color:C.acc,fontSize:13}}>{fmtN(it.qty)}장</span><button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:16}}>✕</button></div></div>;})}</Card>
        <div style={{display:"flex",gap:10}}>
          <Btn ch="임시저장" v="w" full st={{flex:1}} onClick={()=>{if(!items.length){alert("저장할 항목이 없습니다");return;}try{localStorage.setItem(DRAFT,JSON.stringify({items}));alert(`✅ 임시저장 완료!`);}catch{}}}/>
          <Btn ch="다음" full st={{flex:2}} onClick={()=>items.length?setStep(2):alert("항목 추가 필요")} disabled={!items.length}/>
        </div>
      </>}
      {step===2&&<>
        <Card st={{marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>📋 발주 내역</div>
          {items.map((it,i)=>{const p=products.find(x=>x.id===it.pid);return<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.bdr}`}}><div><div style={{fontWeight:700,fontSize:13}}>{p?.name}</div><div style={{color:C.sub,fontSize:11,marginTop:2}}>{it.color} · {p?.factory}</div></div><span style={{fontWeight:800,color:C.acc,fontSize:15}}>{fmtN(it.qty)}장</span></div>;})}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:10}}><span style={{fontWeight:700,fontSize:13}}>총 수량</span><span style={{fontWeight:900,color:C.acc,fontSize:17}}>{fmtN(items.reduce((s,it)=>s+it.qty,0))}장</span></div>
        </Card>
        <div style={{marginBottom:16}}><div style={{fontWeight:700,fontSize:13,marginBottom:8,color:C.txt}}>📝 전달사항 (선택)</div><textarea value={memo} onChange={e=>setMemo(e.target.value)} placeholder="예: 소량 발주건으로 10야드는 본사로, 나머지는 공장으로 배송 부탁드립니다." style={{width:"100%",padding:"12px",border:`1px solid ${C.bdr}`,borderRadius:8,fontSize:13,fontFamily:C.fn,outline:"none",resize:"vertical",minHeight:"80px",boxSizing:"border-box"}}/></div>
        
        <div style={{display:"flex",gap:10}}><Btn ch="← 수정" v="w" full st={{flex:1}} onClick={()=>setStep(1)}/><Btn ch={"✅ 발주 미리보기"} full st={{flex:2,background:C.ok}} onClick={generatePreview} /></div>
      </>}

      {showPreview && (
        <Sheet title="발주 내용 최종 확인" onClose={() => setShowPreview(false)}>
          <div style={{ fontSize: 13, color: C.sub, marginBottom: 16 }}>
            아래 내용으로 총 <strong style={{color:C.txt}}>{previewData.length}곳</strong>의 거래처에 이메일 발주서가 발송됩니다.
          </div>
          
          <div style={{ maxHeight: '55vh', overflowY: 'auto', marginBottom: 16, paddingRight: 4 }}>
            {previewData.map((d, i) => (
              <div key={i} style={{ marginBottom: 16, border: `1px solid ${C.bdr}`, borderRadius: 10, padding: 14, background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 10, color: C.acc, borderBottom: `1px dashed ${C.bdr}`, paddingBottom: 8 }}>
                  📧 받는 사람: {d.vendor.name} <span style={{fontWeight:500, color:C.sub}}>({d.vendor.email})</span>
                </div>
                <div style={{ fontSize: 12, whiteSpace: "pre-wrap", lineHeight: 1.6, color: C.txt }}>
                  {d.body}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn ch="취소" v="w" full st={{ flex: 1 }} onClick={() => setShowPreview(false)} />
            <Btn ch={sending ? "발송 중..." : "🚀 최종 발송하기"} full st={{ flex: 2, background: C.acc }} onClick={confirmOrder} disabled={sending} />
          </div>
        </Sheet>
      )}
    </div>
  );
}
