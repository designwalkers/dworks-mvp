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
  const DRAFT="dworks_draft";
  useEffect(()=>{try{const d=localStorage.getItem(DRAFT);if(d){const dr=JSON.parse(d);if(dr.items?.length>0){setItems(dr.items);alert("임시저장된 발주를 불러왔습니다!");}}}catch{};},[]);
  const filtered=products.filter(p=>p.name?.includes(search)||p.season?.includes(search));
  function addItem(){if(!selProd||!selColor||!qty){alert("상품·색상·수량을 입력하세요");return;}const idx=items.findIndex(i=>i.pid===selProd.id&&i.color===selColor);if(idx>=0)setItems(p=>p.map((it,i)=>i===idx?{...it,qty:it.qty+Number(qty)}:it));else setItems(p=>[...p,{pid:selProd.id,color:selColor,qty:Number(qty)}]);setSelProd(null);setSelColor("");setQty("");setSearch("");}
  
  async function submit(){
    if(!items.length){alert("발주 항목 추가");return;}
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
    await sendMail();
    setStep(3);
  }

  async function sendMail(){
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
    if(!targets.length) { setSending(false); return; }
    let cnt=0;
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

      for(const[pName,pData]of Object.entries(prodMap)){
        for(const m of Object.values(pData.matMap)){
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

      if(await sendEmail(vendor.email,vendor.name,`[D-Works 발주서] ${today()} - ${vendor.name}`,body))cnt++;
    }
    setSending(false);
    if(cnt>0)console.log(`✅ ${cnt}곳 발주서 발송 완료`);
  }

  function reset(){setStep(1);setItems([]);setSearch("");setSelProd(null);setSelColor("");setQty("");setMemo("");}
  if(step===3)return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",padding:24}}><div style={{fontSize:56,marginBottom:14}}>✅</div><div style={{fontWeight:900,fontSize:22,marginBottom:8}}>발주 완료!</div><div style={{color:C.sub,marginBottom:28,fontSize:13}}>{items.length}개 상품 발주</div><Btn ch="+ 새 발주 입력" onClick={reset} sz="l" st={{borderRadius:12}}/></div>;
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:4}}>{step===1?"발주 입력":"발주서 확인"}</div>
      <div style={{color:C.sub,fontSize:12,marginBottom:14}}>기본 정보를 입력해 주세요</div>
      <StepBar cur={step-1}/>
      {step===1&&<>
        <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>발주 추가</div>
        <Card st={{marginBottom:12}}>
          <Field label="상품명"><div style={{position:"relative"}}><TxtInp val={search} onChange={v=>{setSearch(v);if(selProd&&v!==selProd.name)setSelProd(null);}}/>{search&&!selProd&&filtered.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:8,zIndex:50,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:160,overflowY:"auto"}}>{filtered.map(p=><div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);setSelColor("");}} style={{padding:"10px 14px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer"}}><div style={{fontWeight:600,fontSize:13}}>{p.name}</div><div style={{color:C.sub,fontSize:11,marginTop:2}}>{p.season} · {(p.colors||[]).join(", ")}</div></div>)}</div>}</div></Field>
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
        <div style={{display:"flex",gap:10}}><Btn ch="← 수정" v="w" full st={{flex:1}} onClick={()=>setStep(1)}/><Btn ch={sending?"발송 중...":"✅ 발주 완료"} full st={{flex:2,background:C.ok}} onClick={submit} disabled={sending}/></div>
      </>}
    </div>
  );
}

function ProdsPage({products,setProducts,vendors,factories,user}){
  const [catF,setCatF]=useState("전체");
  const [sheet,setSheet]=useState(false);
  const [sheetStep,setSheetStep]=useState(0);
  const [selColor,setSelColor]=useState("");
  const [f,setF]=useState({name:"",category:"",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],colorBom:{}});
  const [ci,setCi]=useState("");
  const [br,setBr]=useState({type:"",mat:"",amt:"",vid:"",price:"",color:""});
  const [editBomId,setEditBomId]=useState(null);
  const [venSearch,setVenSearch]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  const getUnit=t=>["단추","지퍼","기타"].includes(t)?"개":"yd";
  const filtered=catF==="전체"?products:products.filter(p=>p.category===catF);

  function openAdd(){setF({name:"",category:"",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],colorBom:{}});setCi("");setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");setSheetStep(0);setSelColor("");setEditBomId(null);setSheet(true);}
  function openEdit(p){setF({...p,colors:[...(p.colors||[])],colorBom:{...(p.colorBom||{})}});setCi("");setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");setSheetStep(0);setSelColor("");setEditBomId(null);setSheet(true);}

  function addColor(){const c=ci.trim();if(!c||f.colors.includes(c))return;setF(p=>({...p,colors:[...p.colors,c],colorBom:{...p.colorBom,[c]:p.colorBom[c]||[]}}));setCi("");}
  function removeColor(c){setF(p=>{const nb={...p.colorBom};delete nb[c];return{...p,colors:p.colors.filter(x=>x!==c),colorBom:nb};});if(selColor===c)setSelColor("");}

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
    const sd={name:f.name,category:f.category,season:f.season,factory_id:f.factoryId||null,factory:f.factory,factory_tel:f.factoryTel,colors:f.colors,color_bom:f.colorBom};
    try{
      if(f.id&&user?.token){
        const r=await DB.update(user.token,"products",f.id,sd);
        if(r.error||r.code){alert(`[상품 수정 실패] Supabase products 테이블에 'color_bom' 컬럼을 반드시 추가해주세요! 대시보드 확인 요망.`);return;}
        setProducts(products.map(p=>p.id===f.id?{...f}:p));
      }
      else if(user?.token){
        const r=await DB.insert(user.token,"products",{...sd,user_id:user.id});
        if(r.error||r.code||!Array.isArray(r)||r.length===0){
          alert(`[상품 등록 실패] Supabase products 테이블에 'color_bom' 컬럼을 반드시 추가해주세요! 대시보드 확인 요망.`);
          return;
        }
        const newProd = r[0];
        setProducts(p=>[...p,{...newProd,factoryId:newProd.factory_id||"",factoryTel:newProd.factory_tel||"",colors:newProd.colors||[],colorBom:newProd.color_bom||{}}]);
      }
    }catch(e){
      alert("[네트워크 에러] 상품이 저장되지 않았습니다.");
      return;
    }
    setSheet(false);
  }

  async function del(id){if(!window.confirm("삭제?"))return;if(user?.token)try{await DB.del(user.token,"products",id);}catch{}setProducts(products.filter(p=>p.id!==id));}

  const curBom=f.colorBom[selColor]||[];

  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontWeight:900,fontSize:20}}>상품 관리</div><Btn ch="+ 추가" sz="s" st={{padding:"7px 14px"}} onClick={openAdd}/></div>
      <div style={{display:"flex",gap:7,marginBottom:14,overflowX:"auto",paddingBottom:4}}>{["전체",...CATS].map(cat=>{const cnt=cat==="전체"?products.length:products.filter(p=>p.category===cat).length;const act=catF===cat;return<button key={cat} onClick={()=>setCatF(cat)} style={{padding:"6px 12px",borderRadius:20,flexShrink:0,whiteSpace:"nowrap",border:`1.5px solid ${act?(CAT_C[cat]||C.acc):C.bdr}`,background:act?(CAT_C[cat]||C.acc):"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:C.fn}}>{cat} {cnt}</button>;})}
      </div>
      {filtered.length===0?<Empty icon="👕" text="등록된 상품이 없습니다"/>:filtered.map(p=>(
        <Card key={p.id} st={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:6}}><span style={{fontWeight:800,fontSize:14}}>{p.name}</span>{p.category&&<Tag ch={p.category} c={CAT_C[p.category]||C.sub}/>}<Tag ch={p.season} c={C.acc}/></div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:4}}>{(p.colors||[]).map(c=><span key={c} style={{background:C.bg,borderRadius:20,padding:"2px 8px",fontSize:11,color:C.sub2,border:`1px solid ${C.bdr}`}}>{c}</span>)}</div>
              <div style={{color:C.sub,fontSize:11}}>
                {p.factory&&`📍 ${p.factory}`}
                {p.colorBom&&Object.values(p.colorBom).some(b=>b.length>0)&&` · BOM 등록됨`}
                {!p.colorBom&&(p.bom?.length>0)&&` · BOM ${p.bom.length}종 (구버전)`}
              </div>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:8}}><Btn ch="수정" v="w" sz="s" st={{padding:"5px 11px",fontSize:12}} onClick={()=>openEdit(p)}/><Btn ch="삭제" v="w" sz="s" st={{padding:"5px 11px",fontSize:12,color:C.red}} onClick={()=>del(p.id)}/></div>
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
              <input value={ci} onChange={e=>setCi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addColor()} placeholder="색상명 입력 (예: 블랙, 네이비)" style={{flex:1,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"9px 12px",fontSize:13,fontFamily:C.fn,outline:"none",color:C.txt}}/>
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
                <FRow label="업체명"><div style={{flex:1,position:"relative",display:"flex",alignItems:"center"}}><input value={venSearch} onChange={e=>{setVenSearch(e.target.value);if(!e.target.value)setBr(r=>({...r,vid:""}));}} placeholder="업체명 검색" style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:C.txt,fontFamily:C.fn,textAlign:"right"}}/>{br.vid&&<span style={{color:C.ok,fontSize:13,marginLeft:4,flexShrink:0}}>✓</span>}{venSearch&&!br.vid&&(()=>{const fv=vendors.filter(v=>v.name?.includes(venSearch));return fv.length>0?<div style={{position:"absolute",top:"100%",right:0,width:180,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:8,zIndex:9999,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:130,overflowY:"auto"}}>{fv.map(v=><div key={v.id} onClick={()=>{setBr(r=>({...r,vid:v.id}));setVenSearch(v.name);}} style={{padding:"8px 12px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:600}}>{v.name}</span><Tag ch={v.type} c={VEN_C[v.type]||C.sub}/></div>)}</div>:null;})()}</div><span style={{color:C.sub,fontSize:11,flexShrink:0,marginLeft:4}}>∨</span></FRow>
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

function ListPage({orders,setOrders,products,user}){
  const [filter,setFilter]=useState("전체");
  const [dateFilter,setDateFilter]=useState("전체");
  const [startDate,setStartDate]=useState("");
  const [endDate,setEndDate]=useState("");
  const [open,setOpen]=useState(null);
  const SC={완료:C.ok,지연:C.warn,진행중:C.acc};

  const getPastDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0,10);
  };
  const tToday = today();
  const tYest = getPastDate(1);
  const tWeek = getPastDate(7);

  let dateFiltered = orders;
  if (dateFilter === "오늘") dateFiltered = orders.filter(o => o.date === tToday);
  else if (dateFilter === "어제") dateFiltered = orders.filter(o => o.date === tYest);
  else if (dateFilter === "1주일") dateFiltered = orders.filter(o => o.date >= tWeek && o.date <= tToday);
  else if (dateFilter === "기간설정") {
    dateFiltered = orders.filter(o => {
      if(startDate && endDate) return o.date >= startDate && o.date <= endDate;
      if(startDate) return o.date >= startDate;
      if(endDate) return o.date <= endDate;
      return true;
    });
  }

  const filtered=(filter==="전체"?dateFiltered:dateFiltered.filter(o=>o.status===filter)).sort((a,b)=>new Date(b.ts||0)-new Date(a.ts||0));

  async function changeStatus(id,status){if(user?.token)try{await DB.update(user.token,"orders",id,{status});}catch{}setOrders(p=>p.map(x=>x.id===id?{...x,status}:x));}
  async function delOrder(id){if(!window.confirm("삭제?"))return;if(user?.token)try{await DB.del(user.token,"orders",id);}catch{}setOrders(p=>p.filter(x=>x.id!==id));}
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:900,fontSize:20}}>발주 리스트</div>
        <Tag ch={`${filtered.length}건`} c={C.sub}/>
      </div>
      <div style={{display:"flex",gap:7,marginBottom:dateFilter==="기간설정"?8:12,overflowX:"auto",paddingBottom:4}}>
        {["전체","오늘","어제","1주일","기간설정"].map(s=><button key={s} onClick={()=>setDateFilter(s)} style={{padding:"6px 14px",borderRadius:20,flexShrink:0,border:`1.5px solid ${dateFilter===s?C.acc:C.bdr}`,background:dateFilter===s?C.acc+"18":"#fff",color:dateFilter===s?C.acc:C.sub2,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:C.fn}}>{s}</button>)}
      </div>
      {dateFilter==="기간설정"&&<div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{flex:1,padding:"8px 12px",border:`1px solid ${C.bdr}`,borderRadius:8,fontFamily:C.fn,fontSize:12,outline:"none",color:C.txt}}/><span style={{color:C.sub}}>-</span><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{flex:1,padding:"8px 12px",border:`1px solid ${C.bdr}`,borderRadius:8,fontFamily:C.fn,fontSize:12,outline:"none",color:C.txt}}/></div>}
      <div style={{display:"flex",gap:7,marginBottom:14,overflowX:"auto",paddingBottom:4}}>{["전체","진행중","완료","지연"].map(s=><button key={s} onClick={()=>setFilter(s)} style={{padding:"6px 14px",borderRadius:20,flexShrink:0,border:`1.5px solid ${filter===s?C.acc:C.bdr}`,background:filter===s?C.acc+"18":"#fff",color:filter===s?C.acc:C.sub2,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:C.fn}}>{s}</button>)}</div>
      {filtered.length===0?<Empty icon="📋" text="발주 내역이 없습니다"/>:filtered.map(o=>{const tot=(o.items||[]).reduce((s,i)=>s+(i.qty||0),0);const isO=open===o.id;return<Card key={o.id} st={{marginBottom:10,cursor:"pointer"}} onClick={()=>setOpen(isO?null:o.id)}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:13,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{Array.from(new Set((o.items||[]).map(it=>products.find(x=>x.id===it.pid)?.name||"-"))).join(", ")}</div><div style={{color:C.sub,fontSize:11}}>{o.date} · {fmtN(tot)}장</div></div><div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0,marginLeft:8}}><Tag ch={o.status} c={SC[o.status]||C.sub}/><span style={{color:C.sub,fontSize:12}}>{isO?"▲":"▼"}</span></div></div>{isO&&<div onClick={e=>e.stopPropagation()}><Divider/>{(o.items||[]).map((it,j)=>{const p=products.find(x=>x.id===it.pid);return<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.bdr}`,fontSize:12}}><span style={{fontWeight:600}}>{p?.name}</span><span>{it.color} · <strong>{fmtN(it.qty)}</strong>장</span></div>;})}<div style={{display:"flex",gap:7,marginTop:10,flexWrap:"wrap"}}>{["진행중","완료","지연"].map(st=><Btn key={st} ch={st} sz="s" st={{padding:"5px 11px",background:o.status===st?(SC[st]||C.acc):"#fff",color:o.status===st?"#fff":(SC[st]||C.sub2),border:`1.5px solid ${SC[st]||C.bdr}`,fontSize:12}} onClick={()=>changeStatus(o.id,st)}/>)}<Btn ch="삭제" sz="s" v="w" st={{marginLeft:"auto",color:C.red,fontSize:12,padding:"5px 11px"}} onClick={()=>delOrder(o.id)}/></div></div>}</Card>;})}
    </div>
  );
}

function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",subTel:"",email:"",type:"원단",address:"",bizNo:""});
  const [editId,setEditId]=useState(null);
  const sf=k=>v=>setF(p=>({...p,[k]:v}));

  function openAdd(){setF({name:"",tel:"",subTel:"",email:"",type:"원단",address:"",bizNo:""});setEditId(null);setSheet(true);}
  function openEdit(v){setF({...v});setEditId(v.id);setSheet(true);}

  async function save(){
    if(!f.name || !f.tel || !f.address){
      alert("거래처명, 핸드폰번호, 거래처 주소는 필수 입력 항목입니다.");
      return;
    }
    const dataToSave = {
      name: f.name,
      tel: f.tel, 
      sub_tel: f.subTel || null,
      email: f.email,
      type: f.type,
      address: f.address,
      biz_no: f.bizNo || null
    };
    try{
      if(editId){
        if(user?.token){
          const r=await DB.update(user.token,"vendors",editId,dataToSave);
          if(r.error||r.code){
            alert(`[거래처 수정 실패] Supabase 'vendors' 테이블에 sub_tel, address, biz_no 컬럼이 없거나 권한이 없습니다.\n(${r.message||''})`);
            return;
          }
        }
        setVendors(vv=>vv.map(v=>v.id===editId?{...v,...f}:v));
      }else{
        if(user?.token){
          const r=await DB.insert(user.token,"vendors",{...dataToSave,user_id:user.id});
          if(r.error||r.code||!Array.isArray(r)||r.length===0){
            alert(`[거래처 추가 실패] Supabase 'vendors' 테이블에 sub_tel, address, biz_no 컬럼이 없거나 권한이 없습니다.\n(${r.message||''})`);
            return;
          }
          const nv = r[0];
          setVendors(vv=>[...vv, {...nv, subTel:nv.sub_tel||"", address:nv.address||"", bizNo:nv.biz_no||""}]);
        }
      }
    }catch(e){
      alert("[네트워크 에러] 거래처 저장에 실패했습니다."); return;
    }
    setSheet(false);
  }

  async function del(id){if(!window.confirm("삭제?"))return;if(user?.token)try{await DB.del(user.token,"vendors",id);}catch{}setVendors(vv=>vv.filter(x=>x.id!==id));}
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><div style={{fontWeight:900,fontSize:20}}>거래처 관리</div><Btn ch="+ 추가" sz="s" st={{padding:"7px 14px"}} onClick={openAdd}/></div>
      {vendors.length===0?<Empty icon="🏭" text="등록된 거래처가 없습니다"/>:vendors.map(v=><Card key={v.id} st={{marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:40,height:40,borderRadius:12,background:(VEN_C[v.type]||C.sub)+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{VEN_IC[v.type]||"🏭"}</div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}><span style={{fontWeight:800,fontSize:14}}>{v.name}</span><Tag ch={v.type} c={VEN_C[v.type]||C.sub}/></div><div style={{color:C.sub,fontSize:12}}>📱 {v.tel||"핸드폰 미등록"}{v.subTel ? ` · ☎️ ${v.subTel}` : ""}</div>{v.address&&<div style={{fontSize:11,color:C.sub2,marginTop:2}}>📍 {v.address}</div>}{v.bizNo&&<div style={{fontSize:11,color:C.sub,marginTop:2}}>🏢 {v.bizNo}</div>}<div style={{fontSize:11,color:v.email?C.sub:C.warn,marginTop:2}}>{v.email||"⚠️ 이메일 미등록"}</div></div><div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}><Btn ch="수정" v="w" sz="s" st={{padding:"5px 11px",fontSize:12}} onClick={()=>openEdit(v)}/><Btn ch="삭제" v="w" sz="s" st={{padding:"5px 11px",fontSize:12,color:C.red}} onClick={()=>del(v.id)}/></div></div></Card>)}
      {sheet&&<Sheet title={editId?"거래처 수정":"거래처 추가"} onClose={()=>setSheet(false)}>
        <Field label="거래처명" req><TxtInp val={f.name} onChange={sf("name")} ph="이레텍스"/></Field>
        <Field label="핸드폰번호" req><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field>
        <Field label="전화번호 (선택)"><TxtInp val={f.subTel} onChange={sf("subTel")} ph="02-000-0000" type="tel"/></Field>
        <Field label="거래처 주소" req><TxtInp val={f.address} onChange={sf("address")} ph="서울시 종로구 ..." /></Field>
        <Field label="사업자 등록번호"><TxtInp val={f.bizNo} onChange={sf("bizNo")} ph="000-00-00000" /></Field>
        <Field label="이메일 (발주서 발송용)"><TxtInp val={f.email} onChange={sf("email")} ph="order@fabric.com" type="email"/></Field>
        <Field label="업체 유형"><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{VEN_TYPES.map(t=>{const act=f.type===t;return<button key={t} onClick={()=>sf("type")(t)} style={{padding:"7px 13px",borderRadius:20,border:`1.5px solid ${act?(VEN_C[t]||C.acc):C.bdr}`,background:act?(VEN_C[t]||C.acc):"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:C.fn,display:"flex",alignItems:"center",gap:4}}>{VEN_IC[t]} {t}</button>;})}</div></Field>
        <G/><div style={{display:"flex",gap:10}}><Btn ch="취소" v="w" full st={{flex:1}} onClick={()=>setSheet(false)}/><Btn ch="저장" full st={{flex:2}} onClick={save}/></div>
      </Sheet>}
    </div>
  );
}

function SettingsPage({user,setUser,vendors,factories,setFactories,onLogout}){
  const [facSheet,setFacSheet]=useState(null);
  const [profileSheet,setProfileSheet]=useState(false);

  // 프로필 상태에 회원가입 시 추가한 모든 정보 연동
  const [pf,setPf]=useState({
    name:user.name||"",
    company:user.company||"",
    tel:user.tel||"",
    brand:user.brand||"",
    position:user.position||"",
    address:user.address||""
  });

  async function saveProfile(){
    try{
      if(user?.token) {
        await DB.updateUser(user.token, {
          name:pf.name,
          company:pf.company,
          tel:pf.tel,
          brand:pf.brand,
          position:pf.position,
          address:pf.address
        });
      }
    }catch{}
    if(setUser)setUser(u=>({...u,...pf}));
    setProfileSheet(false);
    alert("저장되었습니다!");
  }

  async function saveFac(){
    if(!facSheet.name)return;
    const{id,...data}=facSheet;
    try{
      if(id){
        if(user?.token){
          const r=await DB.update(user.token,"factories",id,{...data,biz_type:data.bizType, biz_no:data.bizNo||null});
          if(r.error||r.code){alert(`[공장 수정 실패] Supabase factories 테이블에 biz_no 컬럼이 없거나 권한이 없습니다.\n(${r.message||''})`); return;}
        }
        setFactories(ff=>ff.map(x=>x.id===id?{...x,...data}:x));
      }else{
        if(user?.token){
          const r=await DB.insert(user.token,"factories",{name:data.name,biz_type:data.bizType,address:data.address,tel:data.tel,account:data.account,biz_no:data.bizNo||null,user_id:user.id});
          if(r.error||r.code||!Array.isArray(r)||r.length===0){alert(`[공장 추가 실패] Supabase factories 테이블에 biz_no 컬럼이 없거나 권한이 없습니다.\n(${r.message||''})`); return;}
          setFactories(ff=>[...ff,{...r[0],bizType:r[0].biz_type||"", bizNo:r[0].biz_no||""}]);
        }
      }
    }catch(e){
      alert("[네트워크 에러] 공장 저장에 실패했습니다."); return;
    }
    setFacSheet(null);
  }
  async function delFac(id){if(!window.confirm("삭제?"))return;if(user?.token)try{await DB.del(user.token,"factories",id);}catch{}setFactories(ff=>ff.filter(x=>x.id!==id));}
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:18}}>환경설정</div>
      <Card st={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:22,background:C.acc+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👤</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:14}}>{user.name||"이름 없음"} {user.position && <span style={{fontSize:12, fontWeight:500, color:C.sub}}>{user.position}</span>}</div>
            <div style={{color:C.sub,fontSize:12,marginTop:2}}>{user.email}</div>
            {user.company&&<div style={{color:C.sub,fontSize:11}}>{user.company} {user.brand ? `(${user.brand})` : ''}</div>}
          </div>
          <Btn ch="수정" v="w" sz="s" st={{padding:"5px 11px",fontSize:12}} onClick={()=>setProfileSheet(true)}/>
        </div>
        <Divider/><Btn ch="로그아웃" v="w" full st={{color:C.red}} onClick={onLogout}/>
      </Card>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontWeight:700,fontSize:14}}>🏭 공장 관리</div><Btn ch="+ 추가" sz="s" st={{padding:"5px 11px",fontSize:12}} onClick={()=>setFacSheet({id:null,name:"",bizType:"",address:"",tel:"",account:"",bizNo:""})}/></div>
        {factories.length===0?<div style={{textAlign:"center",padding:"12px 0",color:C.sub,fontSize:12}}>등록된 공장이 없습니다</div>:factories.map(fc=><div key={fc.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.bdr}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}><span style={{fontWeight:700,fontSize:13}}>{fc.name}</span>{(fc.bizType||fc.biz_type)&&<Tag ch={fc.bizType||fc.biz_type} c={C.acc}/>}</div>{fc.address&&<div style={{color:C.sub,fontSize:11,marginBottom:1}}>📍 {fc.address}</div>}<div style={{color:C.sub,fontSize:11}}>📞 {fc.tel||"연락처 없음"}</div>{fc.bizNo&&<div style={{color:C.sub,fontSize:11,marginTop:2}}>🏢 {fc.bizNo}</div>}{fc.account&&<div style={{color:C.sub,fontSize:10,marginTop:2}}>🏦 {fc.account}</div>}</div><div style={{display:"flex",gap:5,flexShrink:0,marginLeft:8}}><Btn ch="수정" v="w" sz="s" st={{padding:"4px 10px",fontSize:11}} onClick={()=>setFacSheet({...fc,bizType:fc.bizType||fc.biz_type||"",bizNo:fc.bizNo||fc.biz_no||""})}/><Btn ch="삭제" v="w" sz="s" st={{padding:"4px 10px",fontSize:11,color:C.red}} onClick={()=>delFac(fc.id)}/></div></div></div>)}
      </Card>
      {facSheet!==null&&<Sheet title={facSheet.id?"공장 수정":"공장 추가"} onClose={()=>setFacSheet(null)}>
        <Field label="공장명" req><TxtInp val={facSheet.name||""} onChange={v=>setFacSheet(p=>({...p,name:v}))} ph="예: OO봉제"/></Field>
        <Field label="사업자 등록번호"><TxtInp val={facSheet.bizNo||""} onChange={v=>setFacSheet(p=>({...p,bizNo:v}))} ph="000-00-00000"/></Field>
        <Field label="업종"><DropSel val={facSheet.bizType||""} onChange={v=>setFacSheet(p=>({...p,bizType:v}))} ph="업종 선택">{BIZ_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</DropSel></Field>
        <Field label="주소"><TxtInp val={facSheet.address||""} onChange={v=>setFacSheet(p=>({...p,address:v}))} ph="서울시 중구 OO동"/></Field>
        <Field label="연락처"><TxtInp val={facSheet.tel||""} onChange={v=>setFacSheet(p=>({...p,tel:v}))} ph="02-0000-0000" type="tel"/></Field>
        <Field label="계좌번호"><TxtInp val={facSheet.account||""} onChange={v=>setFacSheet(p=>({...p,account:v}))} ph="은행명 계좌번호 예금주"/></Field>
        <G/><div style={{display:"flex",gap:10}}><Btn ch="취소" v="w" full st={{flex:1}} onClick={()=>setFacSheet(null)}/><Btn ch="저장" full st={{flex:2}} onClick={saveFac}/></div>
      </Sheet>}
      
      {/* 프로필 수정 폼에 확장된 필드들 추가 */}
      {profileSheet&&<Sheet title="프로필 수정" onClose={()=>setProfileSheet(false)}>
        <Field label="업체명" req><TxtInp val={pf.company} onChange={v=>setPf(p=>({...p,company:v}))} ph="회사명을 입력하세요"/></Field>
        <Field label="브랜드명"><TxtInp val={pf.brand} onChange={v=>setPf(p=>({...p,brand:v}))} ph="브랜드명을 입력하세요 (선택)"/></Field>
        <Field label="성함" req><TxtInp val={pf.name} onChange={v=>setPf(p=>({...p,name:v}))} ph="성함을 입력하세요"/></Field>
        <Field label="직함" req><TxtInp val={pf.position} onChange={v=>setPf(p=>({...p,position:v}))} ph="예: 대표, 팀장, 매니저"/></Field>
        <Field label="연락처" req><TxtInp val={pf.tel} onChange={v=>setPf(p=>({...p,tel:v}))} ph="010-0000-0000" type="tel"/></Field>
        <Field label="사무실 주소"><TxtInp val={pf.address} onChange={v=>setPf(p=>({...p,address:v}))} ph="주소를 입력하세요"/></Field>
        <G/><div style={{display:"flex",gap:10}}><Btn ch="취소" v="w" full st={{flex:1}} onClick={()=>setProfileSheet(false)}/><Btn ch="저장" full st={{flex:2}} onClick={saveProfile}/></div>
      </Sheet>}
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
      const[v,f,p,o]=await Promise.all([DB.list(token,"vendors"),DB.list(token,"factories"),DB.list(token,"products"),DB.list(token,"orders")]);
      if(v?.code==="PGRST301"||v?.message?.includes("JWT")||o?.code==="PGRST301"){
        try{localStorage.removeItem("dworks_session");}catch{}
        setUser(null);setScreen("auth");setLoading(false);return;
      }
      setVendors(Array.isArray(v)?v.map(x=>({...x, subTel:x.sub_tel||"", address:x.address||"", bizNo:x.biz_no||""})):[]);
      setFactories(Array.isArray(f)?f.map(x=>({...x,bizType:x.biz_type||x.bizType||"", bizNo:x.biz_no||x.bizNo||""})):[]);
      setProducts(Array.isArray(p)?p.map(x=>({...x,factoryId:x.factory_id||x.factoryId||"",factoryTel:x.factory_tel||x.factoryTel||"",colors:x.colors||[],colorBom:x.color_bom||x.colorBom||{},bom:x.bom||[]})):[]);
      setOrders(Array.isArray(o)?o:[]);
    }catch(e){
      try{localStorage.removeItem("dworks_session");}catch{}
      setUser(null);setScreen("auth");
    }
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
            else{localStorage.removeItem("dworks_session");}
          }
        }
      }catch{}
      setScreen("splash");
    }
    checkSession();
  },[]);

  async function handleLogin(u){try{localStorage.setItem("dworks_session",JSON.stringify(u));}catch{}setUser(u);setScreen("app");await loadData(u.token);}
  async function handleLogout(){if(user?.token)try{await DB.signOut(user.token);}catch{}try{localStorage.removeItem("dworks_session");}catch{}setUser(null);setScreen("auth");setVendors([]);setFactories([]);setProducts([]);setOrders([]);}

  const TABS=[{k:"order",i:"📝",l:"발주하기"},{k:"prods",i:"👕",l:"상품"},{k:"list",i:"📋",l:"발주리스트"},{k:"vendors",i:"🏭",l:"거래처"},{k:"settings",i:"⚙️",l:"설정"}];

  if(screen==="loading")return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",fontFamily:C.fn}}><div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:900,color:C.acc,marginBottom:12}}>D-Works</div><div style={{width:32,height:32,border:`3px solid ${C.bdr}`,borderTop:`3px solid ${C.acc}`,borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div></div>;
  if(screen==="splash")return<SplashPage onStart={()=>setScreen("auth")}/>;
  if(screen!=="app"||!user)return<AuthPage onLogin={handleLogin}/>;
  if(loading)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",fontFamily:C.fn}}><div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:900,color:C.acc,marginBottom:12}}>D-Works</div><div style={{color:C.sub,fontSize:13,marginBottom:16}}>데이터 불러오는 중...</div><div style={{width:32,height:32,border:`3px solid ${C.bdr}`,borderTop:`3px solid ${C.acc}`,borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div></div>;

  const pages={
    dash:<DashPage orders={orders} products={products} onNav={setPage}/>,
    order:<OrderPage products={products} orders={orders} setOrders={setOrders} vendors={vendors} factories={factories} user={user}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} factories={factories} user={user}/>,
    list:<ListPage orders={orders} setOrders={setOrders} products={products} user={user}/>,
    vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,
    settings:<SettingsPage user={user} setUser={setUser} vendors={vendors} factories={factories} setFactories={setFactories} onLogout={handleLogout}/>,
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,color:C.txt,maxWidth:480,margin:"0 auto",position:"relative",boxShadow:"0 0 40px rgba(0,0,0,0.1)"}}>
      <div style={{background:"#fff",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${C.bdr}`}}>
        <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:19,cursor:"pointer",fontFamily:C.fn,letterSpacing:1}}>D-Works</button>
        <span style={{color:C.sub,fontSize:12}}>{user.name}</span>
      </div>
      <div style={{paddingBottom:60}}>{pages[page]||pages["dash"]}</div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:`1px solid ${C.bdr}`,display:"flex",zIndex:50}}>
        {TABS.map(t=><button key={t.k} onClick={()=>setPage(t.k)} style={{flex:1,padding:"9px 4px",background:"none",border:"none",color:page===t.k?C.acc:C.sub,cursor:"pointer",fontFamily:C.fn,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><div style={{width:28,height:28,borderRadius:9,background:page===t.k?C.acc+"15":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:16}}>{t.i}</span></div><span style={{fontSize:9,fontWeight:page===t.k?700:500}}>{t.l}</span></button>)}
      </div>
    </div>
  );
}
