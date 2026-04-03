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

// ── 상수 (디자인 시스템 전면 수정) ───────────────────────────
const C={
  bg:"#F8F9FA",   // 매우 연한 회색 배경 (아이폰 앱 느낌)
  card:"#FFFFFF", // 카드 및 요소 백색
  bdr:"#E9ECEF",  // 아주 연한 테두리
  acc:"#3772FF",  // 메인 블루
  txt:"#212529",  // 진한 회색 글씨
  sub:"#868E96",  // 서브 회색 글씨
  ok:"#2DCA72",
  warn:"#FF9E1B",
  red:"#FA5252",
  fn:"'Noto Sans KR', sans-serif" // 깔끔한 폰트
};

const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const CATS=["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const CAT_C={이너:C.acc,아우터:"#845EF7",팬츠:"#2DCA72",니트:"#FF9E1B",원피스:"#F783AC",스커트:"#38D9A9",기타:C.sub};
const VEN_TYPES=["원단","안감","단추","지퍼","심지","기타"];
const VEN_IC={원단:"🧶",안감:"📋",단추:"🔘",지퍼:"🤐",심지:"🪡",기타:"🏭"};
const VEN_C={원단:C.acc,안감:"#2DCA72",단추:"#FF9E1B",지퍼:"#845EF7",심지:"#38D9A9",기타:C.sub};
const SEASONS=["26SS","26FW","25SS","25FW"];
const MAT_TYPES=["메인원단","부속원단","단추","지퍼","안감","심지","기타"];
const BIZ_TYPES=["다이마루","직기","니트","데님","기타"];

// ── 공통 UI 컴포넌트 (디자인 전면 수정) ─────────────────────

// 버튼: 더 둥글고, 통통하게
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",ok:"#2DCA72",d:"#E9ECEF",red:C.red}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,ok:"#fff",d:C.sub,red:"#fff"}[v]||"#fff";
  const bd=v==="w"?`1px solid ${C.bdr}`:"none";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#E9ECEF":bg,color:disabled?C.sub:cl,border:bd,borderRadius:12,padding:sz==="s"?"8px 16px":"16px 0",fontSize:sz==="s"?12:15,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:C.fn,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,width:full?"100%":"auto",boxSizing:"border-box",lineHeight:1,...st}}>{ch}</button>;
};

// 폼 카드: 부드러운 테두리와 넓은 여백
function FCard({children,mb=16}){return<div style={{background:C.card,borderRadius:16,border:`1px solid ${C.bdr}`,marginBottom:mb,padding:"8px 0"}}>{children}</div>;}

// 폼 로우: 경계선을 없애고 깔끔하게
function FRow({label,children,last,req}){return<div style={{display:"flex",alignItems:"center",minHeight:60,padding:"0 20px",position:"relative"}}><div style={{width:90,fontSize:14,fontWeight:600,color:C.sub,flexShrink:0}}>{label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}</div><div style={{flex:1,display:"flex",alignItems:"center",minWidth:0,justifyContent:"flex-end"}}>{children}</div></div>;}

// 입력창: 테두리를 없애고 회색 배경으로 깔끔하게
const FInp=({val,onChange,ph,type="text"})=><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} style={{width:"100%",border:"none",outline:"none",background:"#F1F3F5",fontSize:14,color:C.txt,fontFamily:C.fn,padding:"10px 14px",minWidth:0,textAlign:"right",borderRadius:8,boxSizing:"border-box"}}/>;

// 셀렉트: 화살표 디자인 커스텀
const FSel=({val,onChange,children,ph})=><div style={{position:"relative",width:"100%"}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",background:"#F1F3F5",fontSize:14,color:val?C.txt:C.sub,fontFamily:C.fn,textAlign:"right",WebkitAppearance:"none",cursor:"pointer",padding:"10px 30px 10px 14px",borderRadius:8,boxSizing:"border-box"}}>{ph&&<option value="">{ph}</option>}{children}</select><span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:C.sub,pointerEvents:"none",fontSize:12}}>▼</span></div>;

// 태그: 더 작고 귀엽게
const Tag=({ch,c=C.acc})=><span style={{background:c+"12",color:c,padding:"4px 8px",borderRadius:6,fontSize:11,fontWeight:700,whiteSpace:"nowrap",fontFamily:C.fn}}>{ch}</span>;

// 카드 기본형: 은은한 그림자와 둥근 모서리
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:C.card,borderRadius:16,padding:20,boxSizing:"border-box",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",border:`1px solid ${C.bdr}`,cursor:onClick?"pointer":"default",...st}}>{children}</div>;

const Divider=()=><div style={{height:1,background:C.bdr,margin:"16px 0"}}/>;
const G=({h=12})=><div style={{height:h}}/>;

// 텅! 화면
const Empty=({icon,text})=><div style={{textAlign:"center",padding:"60px 20px",color:C.sub,background:C.card,borderRadius:16,border:`1px solid ${C.bdr}`}}><div style={{fontSize:48,marginBottom:16}}>{icon}</div><div style={{fontSize:15,fontWeight:600}}>{text}</div></div>;

// 필드 그룹
function Field({label,children,req}){return<div style={{marginBottom:20}}><div style={{fontSize:14,fontWeight:700,color:C.txt,marginBottom:8}}>{label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}</div>{children}</div>;}

// 일반 입력창: 텍스트 박스 형태
function TxtInp({val,onChange,ph,type="text",onKeyDown}){return<div style={{display:"flex",alignItems:"center",border:`1px solid ${C.bdr}`,borderRadius:12,background:"#fff",overflow:"hidden"}}><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} onKeyDown={onKeyDown} style={{flex:1,border:"none",outline:"none",padding:"16px",fontSize:14,color:C.txt,fontFamily:C.fn,background:"transparent"}}/></div>;}

// 일반 셀렉트창: 화살표 custom
function DropSel({val,onChange,children,ph}){return<div style={{position:"relative",border:`1px solid ${C.bdr}`,borderRadius:12,background:"#fff"}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",padding:"16px 36px 16px 16px",fontSize:14,color:val?C.txt:C.sub,fontFamily:C.fn,background:"transparent",WebkitAppearance:"none",cursor:"pointer"}}>{ph&&<option value="">{ph}</option>}{children}</select><span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:C.sub,pointerEvents:"none",fontSize:12}}>▼</span></div>;}

// 단계 바: 점으로 표현
function StepBar({cur,total=4}){return<div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>{Array.from({length:total},(_,i)=><div key={i} style={{width:i<=cur?24:8,height:8,borderRadius:4,background:i<=cur?C.acc:C.bdr,transition:"all 0.3s"}}/>)}</div>;}

// 바텀 시트: 더 부드러운 애니메이션
function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:9999,transition:"opacity 0.3s"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card,borderRadius:"24px 24px 0 0",padding:"0 24px 40px",width:"100%",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box",fontFamily:C.fn,maxWidth:480,transform:"translateY(0)",transition:"transform 0.3s ease-out"}}>
        <div style={{width:40,height:4,background:C.bdr,borderRadius:2,margin:"12px auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontWeight:800,fontSize:18,color:C.txt}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:20,fontFamily:C.fn}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// 라인 차트: 더 깔끔한 디자인
function LineChart({data}){
  if(!data||data.length<2)return<div style={{height:80,display:"flex",alignItems:"center",justifyContent:"center",color:C.sub,fontSize:13}}>데이터가 충분하지 않습니다</div>;
  const W=320,H=80,p=10,vs=data.map(d=>d.v),mn=Math.min(...vs),mx=Math.max(...vs),rng=mx-mn||1;
  const pts=data.map((d,i)=>[(p+(i/(data.length-1))*(W-p*2)),(H-p-((d.v-mn)/rng)*(H-p*2))]);
  const area=`M ${pts[0][0]},${H-p} ${pts.map(([x,y])=>`L ${x},${y}`).join(" ")} L ${pts[pts.length-1][0]},${H-p} Z`;
  return<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}><path d={area} fill={C.acc+"10"}/><polyline points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke={C.acc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>{pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3.5" fill={C.card} stroke={C.acc} strokeWidth="2"/>)}</svg>;
}

// ── 페이지 컴포넌트들 ──

function SplashPage({onStart}){
  const [slide,setSlide]=useState(0);
  const slides=[{title:"쉽고 빠른 발주,\n자동으로 뚝딱",desc:"매번 계산하고, 카톡 보내고...\n이젠 D-Works가 다 해드려요.",icon:"🚀"},{title:"BOM 등록하면\n소요량 자동 계산",desc:"상품별 원부자재만 등록해두세요.\n발주 수량 맞춰 알아서 계산됩니다.",icon:"🧮"},{title:"거래처별 발주서,\n원클릭 이메일 발송",desc:"업체별 발주서가 자동으로 생성되고\n버튼 한 번으로 발송까지 완료!",icon:"📧"},{title:"모든 발주 내역,\n똑똑하게 데이터화",desc:"과거 발주 이력을 언제든 확인하고\n생산 트렌드를 파악해보세요.",icon:"📊"}];
  return(
    <div style={{minHeight:"100vh",background:C.card,display:"flex",flexDirection:"column",fontFamily:C.fn,maxWidth:480,margin:"0 auto"}}>
      <div style={{padding:"60px 24px 20px",flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <div style={{fontSize:100, marginBottom:30}}>{slides[slide].icon}</div>
        <div style={{fontSize:28,fontWeight:900,textAlign:"center",whiteSpace:"pre-line",marginBottom:16,color:C.txt,lineHeight:1.3}}>{slides[slide].title}</div>
        <div style={{fontSize:15,color:C.sub,textAlign:"center",whiteSpace:"pre-line",lineHeight:1.6}}>{slides[slide].desc}</div>
      </div>
      <div style={{padding:"0 24px 50px"}}>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:30}}>{slides.map((_,i)=><div key={i} onClick={()=>setSlide(i)} style={{width:i===slide?28:8,height:8,borderRadius:4,background:i===slide?C.acc:C.bdr,cursor:"pointer",transition:"all 0.3s"}}/>)}</div>
        {slide<slides.length-1?<Btn ch="다음 →" full sz="l" onClick={()=>setSlide(s=>s+1)} st={{borderRadius:16,height:56}}/>:<Btn ch="D-Works 시작하기" full sz="l" onClick={onStart} st={{borderRadius:16,height:56}}/>}
        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:C.sub}}>이미 계정이 있나요? <span onClick={onStart} style={{color:C.acc,fontWeight:700,cursor:"pointer"}}>로그인</span></div>
      </div>
    </div>
  );
}

function AuthPage({onLogin}){
  const [tab,setTab]=useState("in");
  const [f,setF]=useState({company:"",brand:"",name:"",position:"",tel:"",email:"",pw:"",pw2:"",address:"",agree:false});
  const [err,setErr]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  async function submit(){setErr("");if(!f.email||!f.pw){setErr("이메일과 비밀번호를 입력하세요");return;}if(tab==="up"&&(!f.company||!f.name||!f.position||!f.tel||!f.agree)){setErr("필수 항목을 모두 입력하고 동의해주세요");return;}if(tab==="up"&&f.pw!==f.pw2){setErr("비밀번호가 일치하지 않습니다");return;}try{if(tab==="up"){const r=await DB.signUp(f.email,f.pw,{company:f.company,brand:f.brand,name:f.name,position:f.position,tel:f.tel,address:f.address});if(r.error){setErr(r.error.message.includes("already")?"이미 가입된 이메일":r.error.message);return;}alert("가입 완료! 로그인해주세요.");setTab("in");setF({company:"",brand:"",name:"",position:"",tel:"",email:"",pw:"",pw2:"",address:"",agree:false});}else{const r=await DB.signIn(f.email,f.pw);if(!r.access_token){const msg=r.error?.message||"";setErr(msg.includes("Invalid")||msg.includes("invalid")?"이메일 또는 비밀번호가 틀렸습니다":msg||"로그인 실패");return;}const meta=r.user?.user_metadata||{};onLogin({token:r.access_token,id:r.user.id,name:meta.name||f.email.split("@")[0],company:meta.company||"",email:r.user.email,tel:meta.tel||"",brand:meta.brand||"",position:meta.position||"",address:meta.address||""});}}catch(e){setErr("네트워크 오류");}}
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,maxWidth:480,margin:"0 auto"}}>
      <div style={{background:C.card,padding:"50px 24px 20px",borderBottom:`1px solid ${C.bdr}`,borderRadius:"0 0 24px 24px"}}>
        <div style={{fontSize:26,fontWeight:900,color:C.acc,textAlign:"center",letterSpacing:-1}}>D-Works</div>
        <div style={{fontSize:14,color:C.sub,marginTop:4,textAlign:"center"}}>쉽고 똑똑한 의류생산 발주 파트너</div>
      </div>
      <div style={{padding:"24px 24px 50px"}}>
        <div style={{display:"flex",borderBottom:`1.5px solid ${C.bdr}`,marginBottom:24}}>
          {[["in","로그인"],["up","회원가입"]].map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"14px 0",background:"none",border:"none",borderBottom:`3px solid ${tab===k?C.acc:"transparent"}`,color:tab===k?C.acc:C.sub,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:C.fn}}>{l}</button>)}
        </div>
        {tab==="up"&&<><Field label="업체명"><TxtInp val={f.company} onChange={sf("company")} ph="회사명을 입력하세요"/></Field><Field label="브랜드명"><TxtInp val={f.brand} onChange={sf("brand")} ph="브랜드명을 입력하세요 (선택)"/></Field><Field label="성함"><TxtInp val={f.name} onChange={sf("name")} ph="성함을 입력하세요"/></Field><Field label="직함"><TxtInp val={f.position} onChange={sf("position")} ph="예: 대표, 팀장, 매니저"/></Field><Field label="연락처"><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field></>}
        <Field label="이메일"><TxtInp val={f.email} onChange={sf("email")} ph="example@email.com" type="email"/></Field>
        <Field label="비밀번호"><TxtInp val={f.pw} onChange={sf("pw")} ph={tab==="up"?"6자 이상 입력하세요":"비밀번호를 입력하세요"} type="password"/></Field>
        {tab==="up"&&<><Field label="비밀번호 확인"><TxtInp val={f.pw2} onChange={sf("pw2")} ph="비밀번호를 다시 입력하세요" type="password"/></Field><Field label="사무실 주소"><TxtInp val={f.address} onChange={sf("address")} ph="주소를 입력하세요"/></Field><div style={{marginTop:24, padding:16, background:C.card, border:`1px solid ${C.bdr}`, borderRadius:12}}><div style={{fontSize:12, color:C.sub, lineHeight:1.6, height:80, overflowY:"auto", marginBottom:12}}><strong>[개인정보 수집 및 이용 안내]</strong><br/>1. 수기 계산 및 발주 업무 자동화를 위해 업체명, 성함, 연락처를 수집합니다.<br/>2. 수집된 정보는 서비스 제공 및 고객 관리를 위해서만 사용됩니다.<br/>3. 사용자는 언제든 탈퇴 및 정보 수정을 요청할 수 있습니다.</div><label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer"}}><input type="checkbox" checked={f.agree} onChange={e=>sf("agree")(e.target.checked)}/> <span style={{fontSize:13, fontWeight:700, color:C.txt}}>내용을 확인했으며 동의합니다 (필수)</span></label></div></>}
        {err&&<div style={{color:C.red,fontSize:13,marginTop:16,marginBottom:12,textAlign:"center",fontWeight:600}}>{err}</div>}
        <Btn ch={tab==="in"?"로그인":"가입하기"} onClick={submit} full sz="l" st={{borderRadius:16,height:56,fontSize:16}}/>
      </div>
    </div>
  );
}

function DashPage({orders,products,onNav}){
  const td=today(),vs=new Date();vs.setDate(vs.getDate()-1);const yd=vs.toISOString().slice(0,10);
  const tO=orders.filter(o=>o.date===td);
  const yO=orders.filter(o=>o.date===yd);
  const chart=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const ds=d.toISOString().slice(0,10);return{label:ds.slice(5),v:orders.filter(o=>o.date===ds).length};});
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{fontWeight:900,fontSize:22,marginBottom:20,paddingLeft:4}}>오늘의 생산 현황</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {[ {label:"오늘 발주",val:`${tO.length}건`,c:C.acc},{label:"어제 발주",val:`${yO.length}건`,c:C.ok} ].map(s=><Card key={s.label} st={{display:"flex",gap:16,alignItems:"center"}}><div style={{fontSize:36}}>📄</div><div><div style={{color:s.c,fontSize:24,fontWeight:900}}>{s.val}</div><div style={{color:C.sub,fontSize:12,marginTop:2}}>{s.label}</div></div></Card>)}
      </div>
      <Card st={{marginBottom:16}}><div style={{fontWeight:700,fontSize:15,marginBottom:12}}>📊 최근 7일 발주 건수</div><LineChart data={chart}/><div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>{chart.map(d=><span key={d.label} style={{fontSize:10,color:C.sub}}>{d.label}</span>)}</div></Card>
      <div style={{fontWeight:700,fontSize:15,marginBottom:12,paddingLeft:4}}>최신 발주 내역</div>
      {orders.length===0?<Empty icon="📋" text="아직 발주 내역이 없습니다"/>:orders.slice(-3).reverse().map(o=><Card key={o.id} st={{marginBottom:10}} onClick={()=>onNav("list")}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:14}}>{Array.from(new Set(o.items.map(it=>products.find(x=>x.id===it.pid)?.name||"-"))).join(", ")}</span><Tag ch={o.date}/></div></Card>)}
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
  useEffect(()=>{try{const d=localStorage.getItem(DRAFT);if(d){const dr=JSON.parse(d);if(dr.items?.length>0){setItems(dr.items);localStorage.removeItem(DRAFT);/*불러온 후 draft 삭제*/alert("임시저장된 발주 내역을 불러왔습니다!");}}}catch{};},[]);
  const filtered=products.filter(p=>match(p.name,search)||match(p.category,search));
      function addItem(){if(!selProd||!selColor||!qty){alert("상품, 색상, 수량을 모두 입력하세요.");return;}const idx=items.findIndex(i=>i.pid===selProd.id&&i.color===selColor);if(idx>=0)setItems(p=>p.map((it,i)=>i===idx?{...it,qty:it.qty+Number(qty)}:it));else setItems(p=>[...p,{pid:selProd.id,color:selColor,qty:Number(qty)}]);setSelProd(null);setSelColor("");setQty("");setSearch("");}
  function generatePreview() {
    if(!items.length){alert("발주할 항목이 없습니다.");return;}
    const venMap={};
    for(const it of items){
      const prod=products.find(x=>x.id===it.pid);
      if(!prod)continue;
      const bomList=prod.colorBom?.[it.color]||prod.bom||[];
      for(const b of bomList){
        const ven=vendors.find(v=>v.id===b.vid);
        if(!ven||!ven.email)continue;
        const soyo=Math.round(b.amt*it.qty*100)/100;
        if(!venMap[ven.id])venMap[ven.id]={vendor:ven,lines:[]};
        venMap[ven.id].lines.push({mat:b.mat,color:b.color||it.color,soyo,unit:b.unit||"yd",prod});
      }
    }
    const targets=Object.values(venMap);
    if(!targets.length){alert("발송할 업체 정보가 없거나 이메일이 미등록 상태입니다.");return;}
    const pData=[];
    for(const{vendor,lines}of targets){
      let body=`${vendor.name} 담당자님 안녕하세요.\n${user.company||"디자인워커스"} 발주서입니다.\n\n[발주 내역]\n\n`;
      const prodMap={};
      for(const l of lines){
        const pName=l.prod?.name||"-";
        if(!prodMap[pName])prodMap[pName]={matMap:{}};
        if(!prodMap[pName].matMap[l.mat])prodMap[pName].matMap[l.mat]={mat:l.mat,unit:l.unit,colors:[]};
        prodMap[pName].matMap[l.mat].colors.push(`${l.color} ${fmtN(l.soyo)}${l.unit}`);
      }
      for(const[pN,pD]of Object.entries(prodMap)){
        for(const m of Object.values(pD.matMap)){body+=`${m.mat}\n${m.colors.join("\n")}\n\n`;}
        body+=`품목 : ${pN}\n\n`;
      }
      const p=lines[0]?.prod;
      body+=`입고처 : ${p?.factory||"-"}\n주소 : ${factories.find(f=>f.name===p?.factory)?.address||"-"}\n연락처 : ${p?.factoryTel||"-"}\n\n`;
      if(memo)body+=`[요청사항]\n${memo}\n\n`;
      body+=`감사합니다.\nD-Works (by ${user.company})`;
      pData.push({vendor,body});
    }
    setPreviewData(pData); setShowPreview(true);
  }
  async function confirmOrder() {
    setSending(true);
    try{
      if(user?.token) await DB.insert(user.token, "orders", {items, date:today(), status:"진행중", ts:new Date().toISOString(), user_id:user.id});
      for(const data of previewData) await sendEmail(data.vendor.email, data.vendor.name, `[D-Works 발주] ${today()} ${user.company}`, data.body);
      setOrders(p=>[{id:uid(), items, date:today(), status:"진행중"}, ...p]);
      reset(); setStep(3);
    }catch{alert("오류 발생");} finally{setSending(false);}
  }
  function reset(){setStep(1);setItems([]);setSearch("");setSelProd(null);setSelColor("");setQty("");setMemo("");setPreviewData([]);setShowPreview(false);}
  if(step===3)return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",padding:24}}><div style={{fontSize:60,marginBottom:20}}>🎉</div><div style={{fontWeight:900,fontSize:24,marginBottom:8}}>발주 확정 완료!</div><div style={{color:C.sub,marginBottom:30,fontSize:14}}>거래처로 발주서 이메일이 발송되었습니다.</div><Btn ch="+ 새 발주 입력하기" onClick={reset} sz="l" st={{borderRadius:16,height:56}}/></div>;
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{fontWeight:900,fontSize:22,marginBottom:8,paddingLeft:4}}>{step===1?"발주 입력":"발주 최종 확인"}</div>
      <div style={{color:C.sub,fontSize:14,marginBottom:20,paddingLeft:4}}>원하시는 상품과 색상을 선택해 발주 리스트를 만들어주세요</div>
      <StepBar cur={step-1}/>
      {step===1&&<>
        <div style={{fontWeight:700,fontSize:15,marginBottom:12,paddingLeft:4}}>발주할 상품 추가</div>
        <Card st={{marginBottom:12}}>
          <Field label="상품명"><div style={{position:"relative"}}><TxtInp val={search} onChange={v=>{setSearch(v);if(selProd&&v!==selProd.name)setSelProd(null);}} ph="🔍 상품명 또는 카테고리 검색"/>{search&&!selProd&&filtered.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:12,zIndex:50,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",maxHeight:200,overflowY:"auto"}}>{filtered.map(p=><div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);setSelColor("");}} style={{padding:"14px 16px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer"}}><div style={{fontWeight:600,fontSize:14}}>{p.name}</div><div style={{color:C.sub,fontSize:12,marginTop:3}}>{p.category} · {p.colors.join(", ")}</div></div>)}</div>}</div></Field>
          <Field label="색상"><DropSel val={selColor} onChange={setSelColor} ph="색상 선택">{(selProd?.colors||[]).map(c=><option key={c} value={c}>{c}</option>)}</DropSel></Field>
          <Field label="수량"><TxtInp val={qty} onChange={setQty} ph="수량 입력" type="number"/></Field>
          <G/>
          <Btn ch="+ 발주 리스트에 추가" full onClick={addItem} disabled={!selProd||!selColor||!qty} st={{borderRadius:12}}/>
        </Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:12,paddingLeft:4}}>내가 만든 발주 리스트 (수정 가능)</div>
        {items.length===0?<Empty icon="🛒" text="추가된 항목이 없습니다"/>:items.map((it,i)=>{const p=products.find(x=>x.id===it.pid);return<Card key={i} st={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px"}}><div style={{display:"flex",gap:12,alignItems:"center"}}><Tag ch={p?.category||"-"} c={CAT_C[p?.category]||C.sub}/><div style={{fontWeight:700,fontSize:14}}>{p?.name} / {it.color}</div></div><div style={{display:"flex",gap:10,alignItems:"center"}}><input type="number" value={it.qty||""} onChange={e=>setItems(prev=>prev.map((item,idx)=>idx===i?{...item,qty:parseInt(e.target.value)||0}:item))} style={{width:60, padding:"6px", border:`1px solid ${C.bdr}`, borderRadius:8, textAlign:"right", fontSize:14, fontWeight:700, color:C.acc, outline:"none"}}/>장<button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:18,padding:0}}>✕</button></div></Card>;})}
        <Btn ch="발주 내역 확인 →" full onClick={()=>{if(!items.length){alert("항목 추가 필요");return;}setStep(2);}} disabled={!items.length} st={{borderRadius:16,height:56,fontSize:15,marginTop:20}}/>
      </>}
      {step===2&&<>
        <div style={{fontWeight:700,fontSize:15,marginBottom:12,paddingLeft:4}}>이번 발주 요약</div>
        <Card st={{marginBottom:16,textAlign:"center",padding:"24px 20px"}}>
          <div style={{fontSize:13,color:C.sub}}>총 발주 수량</div>
          <div style={{fontWeight:900,fontSize:32,marginTop:6,color:C.acc}}>{fmtN(items.reduce((s,it)=>s+it.qty,0))}장</div>
        </Card>
        <Field label="📝 전달사항 (선택)"><textarea value={memo} onChange={e=>setMemo(e.target.value)} placeholder="원단 롤 포장 부탁드려요.\n소량 발주건은 공장으로 직배송 해주세요." style={{width:"100%",padding:"16px",border:`1px solid ${C.bdr}`,borderRadius:12,fontSize:14,fontFamily:C.fn,outline:"none",resize:"vertical",minHeight:"100px",background:C.card,boxSizing:"border-box"}}/></Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:12}}><Btn ch="← 수정" v="w" full onClick={()=>setStep(1)} st={{borderRadius:16,height:56}}/><Btn ch="✅ 발주 미리보기" full onClick={generatePreview} st={{borderRadius:16,height:56,background:C.ok}}/></div>
      </>}
      {showPreview && <Sheet title="최종 발송 확인" onClose={()=>setShowPreview(false)}><div style={{fontSize:13,color:C.sub,marginBottom:16}}>아래 내용으로 거래처에 이메일이 발송됩니다.</div>{previewData.map((d,i)=>(<div key={i} style={{marginBottom:16,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}><div style={{fontWeight:800,fontSize:14,color:C.acc,marginBottom:8}}>📧 {d.vendor.name}</div><pre style={{fontSize:12,whiteSpace:"pre-wrap",lineHeight:1.6,fontFamily:C.fn,color:C.txt}}>{d.body}</pre></div>))}<div style={{display:"flex",gap:10}}><Btn ch="취소" v="w" full onClick={()=>setShowPreview(false)}/><Btn ch={sending?"발송 중...":"🚀 최종 발송하기"} full onClick={confirmOrder} disabled={sending}/></div></Sheet>}
    </div>
  );
}

function ProdsPage({products,setProducts,vendors,user}){
  const [search,setSearch]=useState("");
  const [sheet,setSheet]=useState(false);
  const [ci,setCi]=useState("");
  const [f,setF]=useState({name:"",category:"이너",season:"25SS",colors:[],bom:[],imageUrl:""});
  const [editId,setEditId]=useState(null);
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  function openAdd(){setF({name:"",category:"이너",season:"25SS",colors:[],bom:[],imageUrl:""});setCi("");setEditId(null);setSheet(true);}
  function openEdit(p){setF({...p,colors:[...(p.colors||[])], bom:[...(p.bom||[])],imageUrl:p.imageUrl||""});setCi("");setEditId(p.id);setSheet(true);}
  const handleImage = (e) => {
    const file = e.target.files[0];
    if(file) { const reader = new FileReader(); reader.onloadend = () => { setF(p => ({...p, imageUrl: reader.result})); }; reader.readAsDataURL(file); }
  };
  async function save(){if(!f.name)return;try{if(editId){if(user?.token)await DB.update(user.token,"products",editId,{...f,image_url:f.imageUrl});setProducts(products.map(p=>p.id===editId?{...f}:p));}else{if(user?.token){const r=await DB.insert(user.token,"products",{...f,image_url:f.imageUrl,user_id:user.id});setProducts(p=>[...p,{...f,id:r[0].id}]);}}}catch{alert("오류 발생");}setSheet(false);}
  async function del(id){if(!window.confirm("삭제할까요?"))return;if(user?.token)try{await DB.del(user.token,"products",id);}catch{}setProducts(products.filter(p=>p.id!==id));}
  function addColor(){const c=ci.trim();if(!c||f.colors.includes(c))return;setF(p=>({...p,colors:[...p.colors,c]}));setCi("");}
  function removeColor(c){setF(p=>({...p,colors:p.colors.filter(x=>x!==c)}));}
  const filtered=products.filter(p=>match(p.name,search)||match(p.category,search));
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontWeight:900,fontSize:22,paddingLeft:4}}>내 상품 목록</div><Btn ch="+ 상품 추가" sz="s" onClick={openAdd} st={{borderRadius:10}}/></div>
      <div style={{marginBottom:16}}><TxtInp val={search} onChange={setSearch} ph="🔍 상품명 또는 카테고리 검색"/></div>
      {filtered.length===0?<Empty icon="👕" text="조건에 맞는 상품이 없습니다"/>:filtered.map(p=>(
        <Card key={p.id} st={{marginBottom:12,display:"flex",gap:16,alignItems:"flex-start"}}><div style={{width:60,height:60,borderRadius:12,background:"#F1F3F5",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>{p.imageUrl?<img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:24}}>👕</span>}</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{p.name}</div><div style={{display:"flex",gap:6,alignItems:"center",marginTop:6,marginBottom:8}}><Tag ch={p.category} c={CAT_C[p.category]||C.sub}/><Tag ch={p.season}/></div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{(p.colors||[]).map(c=><span key={c} style={{background:"#F4F6FA",borderRadius:6,padding:"4px 8px",fontSize:12,color:C.txt,fontFamily:C.fn,fontWeight:600}}>{c}</span>)}</div></div><div style={{display:"flex",flexDirection:"column",gap:8,flexShrink:0}}><Btn ch="수정" v="w" sz="s" st={{padding:"6px 14px",fontSize:13,borderRadius:10}} onClick={()=>openEdit(p)}/><Btn ch="삭제" v="w" sz="s" st={{padding:"6px 14px",fontSize:13,borderRadius:10,color:C.red,borderColor:C.bdr}} onClick={()=>del(p.id)}/></div></Card>
      ))}
      {sheet&&<Sheet title={editId?"상품 정보 수정":"새 상품 등록"} onClose={()=>setSheet(false)}>
        <Field label="상품명"><TxtInp val={f.name} onChange={sf("name")} ph="예: 리젠 T, 커브 데님"/></Field>
        <Field label="작업지시서"><div onClick={()=>document.getElementById('img-in').click()} style={{height:150,background:"#F1F3F5",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer"}}>{f.imageUrl?<img src={f.imageUrl} style={{height:"100%"}}/>:<span style={{color:C.sub}}>📸 클릭하여 사진 업로드</span>}</div><input id="img-in" type="file" accept="image/*" onChange={handleImage} style={{display:"none"}}/></Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Field label="카테고리"><DropSel val={f.category} onChange={sf("category")}>{CATS.map(cat=><option key={cat} value={cat}>{cat}</option>)}</DropSel></Field><Field label="시즌"><DropSel val={f.season} onChange={sf("season")}>{SEASONS.map(s=><option key={s} value={s}>{s}</option>)}</DropSel></Field></div>
        <Field label="발주 색상 목록 (엔터/추가)"><div style={{display:"flex",gap:8,marginBottom:12}}><TxtInp val={ci} onChange={setCi} onKeyDown={e=>e.key==="Enter"&&addColor()} ph="블랙, 아이보리..."/><Btn ch="+ 추가" onClick={addColor}/></div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{f.colors.map(c=><Card key={c} st={{padding:"8px 12px",borderRadius:8,display:"flex",gap:10,alignItems:"center",background:"#F4F6FA"}}><span style={{fontSize:13,fontWeight:700}}>{c}</span><button onClick={()=>removeColor(c)} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:16,padding:0}}>✕</button></Card>)}</div></Field>
        <G h={30}/><Btn ch="저장하기" full sz="l" onClick={save} disabled={!f.name} st={{borderRadius:16,height:56,fontSize:16}}/>
      </Sheet>}
    </div>
  );
}

function ListPage({orders,products,user,onNav}){
  const [search,setSearch]=useState("");
  const filtered=orders.filter(o=>o.items.some(it=>match(products.find(p=>p.id===it.pid)?.name,search)));
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{fontWeight:900,fontSize:22,marginBottom:20,paddingLeft:4}}>모든 발주 내역</div>
      <div style={{marginBottom:16}}><TxtInp val={search} onChange={setSearch} ph="🔍 상품명으로 검색"/></div>
      {filtered.length===0?<Empty icon="📋" text="발주 내역이 없습니다"/>:filtered.map(o=><Card key={o.id} st={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontWeight:700,fontSize:15}}>{Array.from(new Set(o.items.map(it=>products.find(p=>p.id===it.pid)?.name||"-"))).join(", ")}</div><div style={{display:"flex",gap:8,alignItems:"center"}}><Tag ch={o.date}/><Btn ch="🔄 재발주" sz="s" v="w" onClick={()=>{localStorage.setItem("dworks_draft",JSON.stringify({items:o.items}));onNav("order");}}st={{padding:"4px 10px",fontSize:12,color:C.acc}}/></div></div><Divider/>{(o.items||[]).map((it,j)=>{const p=products.find(x=>x.id===it.pid);return<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.bdr}`,fontSize:13}}><span style={{fontWeight:600}}>{p?.name} / {it.color}</span><span><strong>{fmtN(it.qty)}매</strong></span></div>;})}</Card>)}
    </div>
  );
}

function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",email:"",type:"원단"});
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  async function save(){if(!f.name)return;try{if(user?.token){const r=await DB.insert(user.token,"vendors",{...f,user_id:user.id});setVendors(vv=>[...vv,{...f,id:r[0].id}]);}}catch{}setSheet(false);}
  async function del(id){if(!window.confirm("삭제할까요?"))return;if(user?.token)try{await DB.del(user.token,"vendors",id);}catch{}setVendors(vv=>vv.filter(x=>x.id!==id));}
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontWeight:900,fontSize:22,paddingLeft:4}}>내 거래처 목록</div><Btn ch="+ 업체 추가" sz="s" onClick={()=>{setF({name:"",tel:"",email:"",type:"원단"});setSheet(true)}} st={{borderRadius:10}}/></div>
      {vendors.length===0?<Empty icon="🏭" text="등록된 거래처가 없습니다"/>:vendors.map(v=><Card key={v.id} st={{marginBottom:12,display:"flex",alignItems:"center",gap:16}}><div style={{width:48,height:48,borderRadius:14,background:(VEN_C[v.type]||C.sub)+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{VEN_IC[v.type]||"🏭"}</div><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{fontWeight:700,fontSize:15}}>{v.name}</span><Tag ch={v.type} c={VEN_C[v.type]||C.sub}/></div><div style={{color:C.sub,fontSize:12}}>📱 {v.tel||"전화번호 없음"}{v.email && ` · 📧 ${v.email}`}</div></div><button onClick={()=>del(v.id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18,padding:0}}>✕</button></Card>)}
      {sheet&&<Sheet title="거래처 추가" onClose={()=>setSheet(false)}><Field label="업체명"><TxtInp val={f.name} onChange={sf("name")} ph="업체 이름을 입력하세요"/></Field><Field label="유형"><DropSel val={f.type} onChange={sf("type")}>{VEN_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</DropSel></Field><Field label="연락처"><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field><Field label="이메일 (발주용)"><TxtInp val={f.email} onChange={sf("email")} ph="order@email.com" type="email"/></Field><G h={30}/><Btn ch="등록하기" full sz="l" onClick={save} disabled={!f.name} st={{borderRadius:16,height:56}}/></Sheet>}
    </div>
  );
}

function SettingsPage({user,onLogout}){
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{fontWeight:900,fontSize:22,marginBottom:20,paddingLeft:4}}>환경설정</div>
      <Card st={{marginBottom:16,display:"flex",alignItems:"center",gap:16}}><div style={{width:56,height:56,borderRadius:28,background:C.acc+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>👤</div><div><div style={{fontWeight:800,fontSize:17}}>{user.name}</div><div style={{color:C.sub,fontSize:12,marginTop:2}}>{user.company} / {user.email}</div></div></Card>
      <Btn ch="로그아웃" v="red" full onClick={onLogout} st={{borderRadius:16,height:56,fontSize:16}}/>
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
  const TABS=[ {k:"dash",i:"🏠",l:"대시보드"},{k:"order",i:"🖊️",l:"발주하기"},{k:"prods",i:"👕",l:"상품"},{k:"list",i:"📋",l:"내역"},{k:"vendors",i:"🏭",l:"거래처"} ];
  async function loadData(token){setLoading(true);try{const[v,f,p,o]=await Promise.all([DB.list(token,"vendors"),DB.list(token,"factories"),DB.list(token,"products"),DB.list(token,"orders")]);if(v?.code==="PGRST301"){localStorage.removeItem("dworks_session");setUser(null);setScreen("auth");return;}setVendors(v);setFactories(f);setProducts(p?.map(x=>({...x,imageUrl:x.image_url}))||[]);setOrders(o);}catch(e){setScreen("splash");}finally{setLoading(false);}}
  useEffect(()=>{const check=async()=>{try{const s=localStorage.getItem("dworks_session");if(s){const u=JSON.parse(s);if(u?.token){setUser(u);setScreen("app");await loadData(u.token);return;}}}catch{}setScreen("splash");};check();},[]);
  async function handleLogin(u){try{localStorage.setItem("dworks_session",JSON.stringify(u));}catch{}setUser(u);setScreen("app");await loadData(u.token);}
  if(screen==="loading")return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",fontFamily:C.fn}}>로딩 중...</div>;
  if(screen==="splash")return<SplashPage onStart={()=>setScreen("auth")}/>;
  if(screen==="auth"||!user)return<AuthPage onLogin={handleLogin}/>;
  if(loading)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",fontFamily:C.fn}}>데이터 불러오는 중...</div>;
  const pages={dash:<DashPage orders={orders} products={products} onNav={setPage}/>,order:<OrderPage products={products} orders={orders} setOrders={setOrders} vendors={vendors} factories={factories} user={user} onNav={setPage}/>,prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} user={user}/>,list:<ListPage orders={orders} products={products} user={user} onNav={setPage}/>,vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,settings:<SettingsPage user={user} onLogout={()=>{localStorage.removeItem("dworks_session");setUser(null);setScreen("auth");}}/>};
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,color:C.txt,maxWidth:480,margin:"0 auto",position:"relative"}}>
      <div style={{background:C.card,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,borderBottom:`1px solid ${C.bdr}`,borderRadius:"0 0 20px 20px"}}>
        <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:19,cursor:"pointer"}}>D-Works</button>
        <div onClick={()=>setPage("settings")} style={{width:32,height:32,borderRadius:16,background:C.acc+"15",color:C.acc,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,cursor:"pointer"}}>{user.name.slice(-2)}</div>
      </div>
      <div style={{paddingBottom:80}}>{pages[page]||pages.dash}</div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.card,borderTop:`1px solid ${C.bdr}`,display:"flex",zIndex:100,borderRadius:"20px 20px 0 0",padding:"4px 0 10px",boxShadow:"0 -2px 10px rgba(0,0,0,0.03)"}}>
        {TABS.map(t=><button key={t.k} onClick={()=>setPage(t.k)} style={{flex:1,padding:"10px",background:"none",border:"none",color:page===t.k?C.acc:C.sub,cursor:"pointer",fontFamily:C.fn,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><div style={{fontSize:18,borderRadius:10,padding:4,background:page===t.k?C.acc+"10":"none"}}>{t.i}</div><span style={{fontSize:9,fontWeight:page===t.k?700:500}}>{t.l}</span></button>)}
      </div>
    </div>
  );
}
