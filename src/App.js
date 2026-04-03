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

// ── 상수 (디자인 시스템) ───────────────────────────────
const C={ bg:"#F4F6FA", card:"#FFFFFF", bdr:"#E5E8EB", acc:"#3772FF", txt:"#191F28", sub:"#8B95A1", sub2:"#6B7280", ok:"#2DCA72", warn:"#F04452", red:"#F04452", fn:"'Noto Sans KR', -apple-system, sans-serif" };
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const CATS=["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const CAT_C={이너:C.acc,아우터:"#6F32FF",팬츠:C.ok,니트:"#FF9E1B",원피스:"#FF4B98",스커트:"#00D4EA",기타:C.sub};
const VEN_TYPES=["원단","안감","단추","지퍼","심지","기타"];
const VEN_IC={원단:"🧶",안감:"📋",단추:"🔘",지퍼:"🤐",심지:"🪡",기타:"🏭"};
const VEN_C={원단:C.acc,안감:C.ok,단추:"#FF9E1B",지퍼:"#6F32FF",심지:"#00D4EA",기타:C.sub};
const SEASONS=["26SS","26FW","25SS","25FW"];
const MAT_TYPES=["메인원단","부속원단","단추","지퍼","안감","심지","기타"];
const BIZ_TYPES=["다이마루","직기","니트","데님","기타"];

// ── 공통 UI ───────────────────────────────────────────────────
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",ok:C.ok,d:"#E5E8EB",red:C.red}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,ok:"#fff",d:C.sub,red:"#fff"}[v]||"#fff";
  const bd=v==="w"?`1.5px solid ${C.bdr}`:"none";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#E5E8EB":bg,color:disabled?C.sub:cl,border:bd,borderRadius:sz==="s"?8:12,padding:sz==="s"?"8px 16px":"16px 0",fontSize:sz==="s"?12:15,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:C.fn,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,width:full?"100%":"auto",boxSizing:"border-box",lineHeight:1,...st}}>{ch}</button>;
};
function FCard({children,mb=16}){return<div style={{background:C.card,borderRadius:16,border:`1px solid ${C.bdr}`,marginBottom:mb,padding:"8px 0"}}>{children}</div>;}
function FRow({label,children,last,req}){return<div style={{display:"flex",alignItems:"center",minHeight:60,padding:"0 20px",position:"relative"}}><div style={{width:90,fontSize:14,fontWeight:600,color:C.sub,flexShrink:0}}>{label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}</div><div style={{flex:1,display:"flex",alignItems:"center",minWidth:0,justifyContent:"flex-end"}}>{children}</div></div>;}
const FInp=({val,onChange,ph,type="text"})=><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} style={{width:"100%",border:"none",outline:"none",background:"#F4F6FA",fontSize:14,color:C.txt,fontFamily:C.fn,padding:"10px 14px",minWidth:0,textAlign:"right",borderRadius:8,boxSizing:"border-box"}}/>;
const FSel=({val,onChange,children,ph})=><div style={{position:"relative",width:"100%"}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",background:"#F4F6FA",fontSize:14,color:val?C.txt:C.sub,fontFamily:C.fn,textAlign:"right",WebkitAppearance:"none",cursor:"pointer",padding:"10px 30px 10px 14px",borderRadius:8,boxSizing:"border-box"}}>{ph&&<option value="">{ph}</option>}{children}</select><span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:C.sub,pointerEvents:"none",fontSize:12}}>▼</span></div>;
const Tag=({ch,c=C.acc})=><span style={{background:c+"12",color:c,padding:"4px 8px",borderRadius:6,fontSize:11,fontWeight:700,whiteSpace:"nowrap",fontFamily:C.fn}}>{ch}</span>;
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:C.card,borderRadius:16,padding:20,boxSizing:"border-box",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",border:`1px solid ${C.bdr}`,cursor:onClick?"pointer":"default",...st}}>{children}</div>;
const Divider=()=><div style={{height:1,background:C.bdr,margin:"16px 0"}}/>;
const G=({h=12})=><div style={{height:h}}/>;
const Empty=({icon,text})=><div style={{textAlign:"center",padding:"60px 20px",color:C.sub,background:C.card,borderRadius:16,border:`1px solid ${C.bdr}`}}><div style={{fontSize:48,marginBottom:16}}>{icon}</div><div style={{fontSize:15,fontWeight:600}}>{text}</div></div>;
function Field({label,children,req}){return<div style={{marginBottom:20}}><div style={{fontSize:14,fontWeight:700,color:C.txt,marginBottom:8,paddingLeft:4}}>{label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}</div>{children}</div>;}
function TxtInp({val,onChange,ph,type="text",onKeyDown}){return<div style={{display:"flex",alignItems:"center",background:"#F4F6FA",borderRadius:12,padding:"0 16px",border:`1px solid ${C.bdr}`}}><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} onKeyDown={onKeyDown} style={{flex:1,border:"none",outline:"none",padding:"16px 0",fontSize:14,color:C.txt,fontFamily:C.fn,background:"transparent"}}/></div>;}
function DropSel({val,onChange,children,ph}){return<div style={{position:"relative",background:"#F4F6FA",borderRadius:12,border:`1px solid ${C.bdr}`}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",padding:"16px 36px 16px 16px",fontSize:14,color:val?C.txt:C.sub,fontFamily:C.fn,background:"transparent",WebkitAppearance:"none",cursor:"pointer"}}>{ph&&<option value="">{ph}</option>}{children}</select><span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:C.sub,pointerEvents:"none",fontSize:12}}>▼</span></div>;}
function StepBar({cur,total=4}){return<div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>{Array.from({length:total},(_,i)=><div key={i} style={{width:i<=cur?24:8,height:8,borderRadius:4,background:i<=cur?C.acc:C.bdr,transition:"all 0.3s"}}/>)}</div>;}
function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card,borderRadius:"24px 24px 0 0",padding:"0 24px 40px",width:"100%",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box",fontFamily:C.fn,maxWidth:480}}>
        <div style={{width:40,height:4,background:C.bdr,borderRadius:2,margin:"12px auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontWeight:800,fontSize:18,color:C.txt}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.sub2,cursor:"pointer",fontSize:20,fontFamily:C.fn}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function LineChart({data}){
  if(!data||data.length<2)return<div style={{height:80,display:"flex",alignItems:"center",justifyContent:"center",color:C.sub,fontSize:13,background:"#F4F6FA",borderRadius:12}}>데이터가 충분하지 않습니다</div>;
  const W=320,H=80,p=12,vs=data.map(d=>d.v),mn=Math.min(...vs),mx=Math.max(...vs),rng=mx-mn||1;
  const pts=data.map((d,i)=>[(p+(i/(data.length-1))*(W-p*2)),(H-p-((d.v-mn)/rng)*(H-p*2))]);
  const area=`M ${pts[0][0]},${H-p} ${pts.map(([x,y])=>`L ${x},${y}`).join(" ")} L ${pts[pts.length-1][0]},${H-p} Z`;
  return<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}><path d={area} fill={C.acc+"10"}/><polyline points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke={C.acc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>{pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3.5" fill={C.card} stroke={C.acc} strokeWidth="2"/>)}</svg>;
}

// ── 페이지들 ──────────────────────────────────────────────────

function SplashPage({onStart}){
  const [slide,setSlide]=useState(0);
  const slides=[{title:"쉽고 빠른 발주,\n자동으로 뚝딱",desc:"매번 계산하고, 카톡 보내고...\n이젠 D-Works가 다 해드려요.",icon:"🚀"},{title:"BOM 등록하면\n소요량 자동 계산",desc:"상품별 원부자재만 등록해두세요.\n발주 수량 맞춰 알아서 계산됩니다.",icon:"🧮"},{title:"거래처별 발송,\n원클릭으로 끝",desc:"업체별 발주서가 자동으로 생성되고\n이메일로 즉시 발송됩니다.",icon:"📧"},{title:"모든 발주 내역,\n데이터로 관리",desc:"과거 발주 이력을 언제든 확인하고\n데이터로 스마트하게 관리하세요.",icon:"📊"}];
  return(
    <div style={{minHeight:"100vh",background:C.card,display:"flex",flexDirection:"column",fontFamily:C.fn,maxWidth:480,margin:"0 auto"}}>
      <div style={{padding:"60px 24px 20px",flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <div style={{fontSize:100, marginBottom:30}}>{slides[slide].icon}</div>
        <div style={{fontSize:28,fontWeight:900,textAlign:"center",whiteSpace:"pre-line",marginBottom:16,color:C.txt,lineHeight:1.3}}>{slides[slide].title}</div>
        <div style={{fontSize:15,color:C.sub2,textAlign:"center",whiteSpace:"pre-line",lineHeight:1.6}}>{slides[slide].desc}</div>
      </div>
      <div style={{padding:"0 24px 50px"}}>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:30}}>{slides.map((_,i)=><div key={i} onClick={()=>setSlide(i)} style={{width:i===slide?28:8,height:8,borderRadius:4,background:i===slide?C.acc:C.bdr,cursor:"pointer",transition:"all 0.3s"}}/>)}</div>
        {slide<slides.length-1?<Btn ch="다음 →" full sz="l" onClick={()=>setSlide(s=>s+1)} st={{borderRadius:16,height:56}}/>:<Btn ch="D-Works 시작하기" full sz="l" onClick={onStart} st={{borderRadius:16,height:56}}/>}
      </div>
    </div>
  );
}

function AuthPage({onLogin}){
  const [tab,setTab]=useState("in");
  const [f,setF]=useState({company:"",brand:"",name:"",position:"",tel:"",email:"",pw:"",pw2:"",address:"",agree:false});
  const [err,setErr]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  async function submit(){setErr("");if(!f.email||!f.pw){setErr("이메일과 비밀번호를 입력하세요");return;}if(tab==="up"){if(!f.company||!f.name||!f.position||!f.tel||!f.agree){setErr("필수 항목을 모두 입력하고 동의해주세요");return;}if(f.pw!==f.pw2){setErr("비밀번호가 일치하지 않습니다");return;}}try{if(tab==="up"){const r=await DB.signUp(f.email,f.pw,{company:f.company,brand:f.brand,name:f.name,position:f.position,tel:f.tel,address:f.address});if(r.error){setErr(r.error.message);return;}alert("가입 완료! 로그인해주세요.");setTab("in");}else{const r=await DB.signIn(f.email,f.pw);if(!r.access_token){setErr("이메일 또는 비밀번호가 틀렸습니다");return;}const m=r.user?.user_metadata||{};onLogin({token:r.access_token,id:r.user.id,name:m.name,company:m.company,email:r.user.email,tel:m.tel,brand:m.brand,position:m.position,address:m.address});}}catch{setErr("네트워크 오류");}}
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,maxWidth:480,margin:"0 auto"}}>
      <div style={{background:C.card,padding:"50px 24px 20px",borderBottom:`1px solid ${C.bdr}`,borderRadius:"0 0 24px 24px"}}>
        <div style={{fontSize:26,fontWeight:900,color:C.acc,textAlign:"center"}}>D-Works</div>
      </div>
      <div style={{padding:"24px 24px 50px"}}>
        <div style={{display:"flex",marginBottom:24,background:C.card,borderRadius:12,padding:2}}>
          {[["in","로그인"],["up","회원가입"]].map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"14px 0",background:tab===k?C.acc:"none",border:"none",borderRadius:10,color:tab===k?"#fff":C.sub,fontWeight:700,fontSize:14,cursor:"pointer"}}>{l}</button>)}
        </div>
        {tab==="up"&&<><Field label="업체명" req><TxtInp val={f.company} onChange={sf("company")} ph="회사명"/></Field><Field label="브랜드명"><TxtInp val={f.brand} onChange={sf("brand")} ph="브랜드명"/></Field><Field label="성함" req><TxtInp val={f.name} onChange={sf("name")} ph="이름"/></Field><Field label="직함" req><TxtInp val={f.position} onChange={sf("position")} ph="대표, 팀장 등"/></Field><Field label="연락처" req><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field></>}
        <Field label="이메일" req><TxtInp val={f.email} onChange={sf("email")} ph="example@email.com"/></Field>
        <Field label="비밀번호" req><TxtInp val={f.pw} onChange={sf("pw")} ph="6자 이상" type="password"/></Field>
        {tab==="up"&&<><Field label="비밀번호 확인" req><TxtInp val={f.pw2} onChange={sf("pw2")} ph="다시 입력" type="password"/></Field><Field label="주소"><TxtInp val={f.address} onChange={sf("address")} ph="사무실 주소"/></Field><div style={{padding:14,background:"#fff",borderRadius:10,marginBottom:20}}><label style={{display:"flex",gap:8,cursor:"pointer",fontSize:13}}><input type="checkbox" checked={f.agree} onChange={e=>sf("agree")(e.target.checked)}/>개인정보 수집 및 이용에 동의합니다 (필수)</label></div></>}
        {err&&<div style={{color:C.red,fontSize:13,marginBottom:16,textAlign:"center",fontWeight:600}}>{err}</div>}
        <Btn ch={tab==="in"?"로그인":"가입하기"} onClick={submit} full sz="l" st={{borderRadius:16,height:56}}/>
      </div>
    </div>
  );
}

function DashPage({orders,products,onNav}){
  const td=today();
  const tO=orders.filter(o=>o.date===td);
  const chart=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const ds=d.toISOString().slice(0,10);return{label:ds.slice(5),v:orders.filter(o=>o.date===ds).length};});
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{fontWeight:900,fontSize:22,marginBottom:20,paddingLeft:4}}>생산 현황</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Card st={{display:"flex",gap:16,alignItems:"center"}}><div style={{fontSize:28}}>📝</div><div><div style={{color:C.acc,fontSize:22,fontWeight:900}}>{tO.length}건</div><div style={{color:C.sub,fontSize:12}}>오늘 발주</div></div></Card>
        <Card st={{display:"flex",gap:16,alignItems:"center"}}><div style={{fontSize:28}}>👕</div><div><div style={{color:C.ok,fontSize:22,fontWeight:900}}>{products.length}종</div><div style={{color:C.sub,fontSize:12}}>등록 상품</div></div></Card>
      </div>
      <Card st={{marginBottom:16}}><div style={{fontWeight:700,fontSize:15,marginBottom:12}}>📊 주간 발주 추이</div><LineChart data={chart}/></Card>
      <div style={{fontWeight:700,fontSize:15,marginBottom:12,paddingLeft:4}}>최근 발주</div>
      {orders.slice(-3).reverse().map(o=><Card key={o.id} st={{marginBottom:10}} onClick={()=>onNav("list")}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700}}>{Array.from(new Set(o.items.map(it=>products.find(x=>x.id===it.pid)?.name||"-"))).join(", ")}</span><Tag ch={o.date}/></div></Card>)}
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
  useEffect(()=>{try{const d=localStorage.getItem(DRAFT);if(d){const dr=JSON.parse(d);if(dr.items?.length>0){setItems(dr.items);}}}catch{};},[]);
  const filtered=products.filter(p=>match(p.name,search)||match(p.season,search));
  function addItem(){if(!selProd||!selColor||!qty){alert("상품·색상·수량을 입력하세요");return;}const idx=items.findIndex(i=>i.pid===selProd.id&&i.color===selColor);if(idx>=0)setItems(p=>p.map((it,i)=>i===idx?{...it,qty:it.qty+Number(qty)}:it));else setItems(p=>[...p,{pid:selProd.id,color:selColor,qty:Number(qty)}]);setSelProd(null);setSelColor("");setQty("");setSearch("");}
  function generatePreview() {
    if(!items.length){alert("항목 추가 필요");return;}
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
    if(!targets.length){alert("이메일 등록 업체 없음");return;}
    const pData=[];
    for(const{vendor,lines}of targets){
      let body=`${vendor.name} 담당자님 안녕하세요.\n업체명 : ${user?.company||"디자인워커스"}\n\n`;
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
      body+=`입고처 : ${p?.factory||"-"}\n연락처 : ${p?.factoryTel||"-"}\n`;
      if(memo)body+=`[전달사항]\n${memo}\n\n`;
      body+=`감사합니다.\nD-Works`;
      pData.push({vendor,body});
    }
    setPreviewData(pData); setShowPreview(true);
  }
  async function confirmOrder() {
    setSending(true);
    try{
      if(user?.token) await DB.insert(user.token, "orders", {items, date:today(), status:"진행중", ts:new Date().toISOString(), user_id:user.id});
      for(const data of previewData) await sendEmail(data.vendor.email, data.vendor.name, `[D-Works 발주] ${today()} - ${data.vendor.name}`, data.body);
      setOrders(p=>[{id:uid(), items, date:today(), status:"진행중"}, ...p]);
      reset(); setStep(3);
    }catch{alert("오류 발생");} finally{setSending(false);}
  }
  function reset(){setStep(1);setItems([]);setSearch("");setSelProd(null);setSelColor("");setQty("");setMemo("");localStorage.removeItem(DRAFT);}
  if(step===3)return<div style={{textAlign:"center",padding:"100px 24px"}}><div style={{fontSize:60,marginBottom:20}}>✅</div><div style={{fontWeight:900,fontSize:24,marginBottom:30}}>발주 발송 완료!</div><Btn ch="+ 새 발주하기" onClick={reset} full st={{borderRadius:16,height:56}}/></div>;
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{fontWeight:900,fontSize:22,marginBottom:20,paddingLeft:4}}>발주 입력</div>
      <StepBar cur={step-1}/>
      {step===1&&<>
        <Card st={{marginBottom:16}}>
          <Field label="상품명"><div style={{position:"relative"}}><TxtInp val={search} onChange={v=>{setSearch(v);if(selProd&&v!==selProd.name)setSelProd(null);}} ph="🔍 초성 검색"/>{search&&!selProd&&filtered.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:12,zIndex:50,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",maxHeight:200,overflowY:"auto"}}>{filtered.map(p=><div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);setSelColor("");}} style={{padding:"14px 16px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer"}}><div style={{fontWeight:600}}>{p.name}</div><div style={{color:C.sub,fontSize:12}}>{p.season}</div></div>)}</div>}</div></Field>
          <Field label="색상"><DropSel val={selColor} onChange={setSelColor} ph="색상 선택">{(selProd?.colors||[]).map(c=><option key={c} value={c}>{c}</option>)}</DropSel></Field>
          <Field label="수량"><TxtInp val={qty} onChange={setQty} ph="수량 입력" type="number"/></Field>
          <Btn ch="+ 리스트 추가" full onClick={addItem} disabled={!selProd||!selColor||!qty}/>
        </Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:12,paddingLeft:4}}>발주 리스트 (수정 가능)</div>
        {items.map((it,i)=>(<Card key={i} st={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px"}}><div style={{fontWeight:700}}>{products.find(x=>x.id===it.pid)?.name} / {it.color}</div><div style={{display:"flex",gap:8,alignItems:"center"}}><input type="number" value={it.qty||""} onChange={e=>setItems(prev=>prev.map((item,idx)=>idx===i?{...item,qty:parseInt(e.target.value)||0}:item))} style={{width:60,padding:"6px",border:`1px solid ${C.bdr}`,borderRadius:8,textAlign:"right",fontWeight:700,color:C.acc}}/>장<button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.sub2,fontSize:18}}>✕</button></div></Card>))}
        <Btn ch="발주 내역 확인 →" full onClick={()=>items.length?setStep(2):alert("항목 추가 필요")} disabled={!items.length} st={{borderRadius:16,height:56,marginTop:20}}/>
      </>}
      {step===2&&<>
        <Card st={{marginBottom:16,textAlign:"center",padding:"24px"}}><div style={{fontSize:13,color:C.sub2}}>총 발주 수량</div><div style={{fontWeight:900,fontSize:32,marginTop:6,color:C.acc}}>{fmtN(items.reduce((s,it)=>s+it.qty,0))}매</div></Card>
        <Field label="📝 전달사항"><textarea value={memo} onChange={e=>setMemo(e.target.value)} style={{width:"100%",padding:"16px",border:`1px solid ${C.bdr}`,borderRadius:12,minHeight:100,boxSizing:"border-box",fontFamily:C.fn}} ph="전달사항 입력..."/></Field>
        <div style={{display:"flex",gap:10}}><Btn ch="← 수정" v="w" full onClick={()=>setStep(1)}/><Btn ch="✅ 발주 미리보기" full onClick={generatePreview} st={{background:C.ok}}/></div>
      </>}
      {showPreview && <Sheet title="최종 확인" onClose={()=>setShowPreview(false)}>{previewData.map((d,i)=>(<div key={i} style={{marginBottom:16,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}><div style={{fontWeight:800,fontSize:14,color:C.acc,marginBottom:8}}>📧 {d.vendor.name}</div><pre style={{fontSize:12,whiteSpace:"pre-wrap",lineHeight:1.6}}>{d.body}</pre></div>))}<Btn ch={sending?"발송 중...":"🚀 최종 발송하기"} full onClick={confirmOrder} disabled={sending}/></Sheet>}
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => { setF(prev => ({...prev, imageUrl: reader.result})); };
      reader.readAsDataURL(file);
    }
  };

  function openAdd(){setF({name:"",category:"",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],colorBom:{},imageUrl:""});setCi("");setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");setSheetStep(0);setSelColor("");setEditBomId(null);setSheet(true);}
  function openEdit(p){setF({...p,colors:[...(p.colors||[])],colorBom:{...(p.colorBom||{})},imageUrl:p.imageUrl||""});setCi("");setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");setSheetStep(0);setSelColor("");setEditBomId(null);setSheet(true);}
  function copyProd(p){setF({...p,id:undefined,name:p.name+"(복사본)",colorBom:JSON.parse(JSON.stringify(p.colorBom||{}))});setSheetStep(0);setSheet(true);}
  function addColor(){const c=ci.trim();if(!c||f.colors.includes(c))return;setF(p=>({...p,colors:[...p.colors,c],colorBom:{...p.colorBom,[c]:p.colorBom[c]||[]}}));setCi("");}
  function removeColor(c){setF(p=>{const nb={...p.colorBom};delete nb[c];return{...p,colors:p.colors.filter(x=>x!==c),colorBom:nb};});}
  function addBom(){
    if(!br.mat||!br.amt)return;
    const newB = {...br, id:editBomId||uid(), amt:Number(br.amt), unit:getUnit(br.type)};
    setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:editBomId?p.colorBom[selColor].map(b=>b.id===editBomId?newB:b):[...(p.colorBom[selColor]||[]),newB]}}));
    setBr({type:"",mat:"",amt:"",vid:"",price:""});setVenSearch("");setEditBomId(null);
  }
  async function save(){
    if(!f.name)return;
    const sd={name:f.name,category:f.category,season:f.season,factory_id:f.factoryId||null,factory:f.factory,factory_tel:f.factoryTel,colors:f.colors,color_bom:f.colorBom,image_url:f.imageUrl};
    try{
      if(f.id&&user?.token){
        await DB.update(user.token,"products",f.id,sd);
        setProducts(products.map(p=>p.id===f.id?{...f}:p));
      } else if(user?.token){
        const r=await DB.insert(user.token,"products",{...sd,user_id:user.id});
        setProducts(p=>[...p, {...r[0], imageUrl:r[0].image_url}]);
      }
    }catch{alert("저장 오류 (image_url 컬럼 확인 요망)");} setSheet(false);
  }
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontWeight:900,fontSize:22}}>상품 관리</div><Btn ch="+ 상품 등록" sz="s" onClick={openAdd}/></div>
      <div style={{display:"flex",gap:7,marginBottom:12,overflowX:"auto",paddingBottom:4}}>{["전체",...CATS].map(cat=><button key={cat} onClick={()=>setCatF(cat)} style={{padding:"6px 12px",borderRadius:20,border:`1.5px solid ${catF===cat?C.acc:C.bdr}`,background:catF===cat?C.acc:"#fff",color:catF===cat?"#fff":C.sub,fontSize:12,fontWeight:600}}>{cat}</button>)}</div>
      <div style={{display:"flex",gap:8,marginBottom:14}}><div style={{flex:1}}><TxtInp val={prodSearch} onChange={setProdSearch} ph="🔍 상품명 초성 검색"/></div><div style={{width:100}}><DropSel val={sortOrd} onChange={setSortOrd}><option value="최신순">최신순</option><option value="시즌별">시즌별</option></DropSel></div></div>
      {filtered.map(p=>(<Card key={p.id} st={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{fontWeight:800,fontSize:16,marginBottom:6}}>{p.name} {p.imageUrl&&"🖼️"}</div><div style={{display:"flex",gap:6,marginBottom:8}}><Tag ch={p.category} c={CAT_C[p.category]}/><Tag ch={p.season}/></div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{p.colors.map(c=><span key={c} style={{fontSize:11,background:C.bg,padding:"2px 6px",borderRadius:4}}>{c}</span>)}</div></div><div style={{display:"flex",flexDirection:"column",gap:6}}><Btn ch="복사" v="w" sz="s" onClick={()=>copyProd(p)}/><Btn ch="수정" v="w" sz="s" onClick={()=>openEdit(p)}/></div></div></Card>))}
      {sheet&&<Sheet title={f.id?"상품 수정":"상품 등록"} onClose={()=>setSheet(false)}>
        <StepBar cur={sheetStep} total={2}/>
        {sheetStep===0&&<>
          <Field label="상품명" req><TxtInp val={f.name} onChange={sf("name")} ph="상품명 입력"/></Field>
          <Field label="작업지시서 (선택)"><div onClick={()=>document.getElementById('img-up').click()} style={{border:`1px dashed ${C.bdr}`,borderRadius:12,padding:20,textAlign:"center",background:C.bg}}>{f.imageUrl?<img src={f.imageUrl} style={{maxWidth:"100%",maxHeight:150}}/>:<div>📸 클릭하여 사진 업로드</div>}</div><input id="img-up" type="file" accept="image/*" style={{display:"none"} } onChange={handleImageUpload}/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="카테고리"><DropSel val={f.category} onChange={sf("category")}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</DropSel></Field><Field label="시즌"><DropSel val={f.season} onChange={sf("season")}>{SEASONS.map(s=><option key={s} value={s}>{s}</option>)}</DropSel></Field></div>
          <Field label="발주 색상 목록 (엔터)"><div style={{display:"flex",gap:8}}><TxtInp val={ci} onChange={setCi} onKeyDown={e=>e.key==="Enter"&&addColor()} ph="블랙, 화이트..."/><Btn ch="+" onClick={addColor} sz="s"/></div><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{f.colors.map(c=><Tag key={c} ch={c} onClick={()=>removeColor(c)}/>)}</div></Field>
          <Btn ch="다음: BOM 등록 →" full onClick={()=>f.name&&f.colors.length?setSheetStep(1):alert("이름과 색상 필수")} st={{borderRadius:16,height:56,marginTop:10}}/>
        </>}
        {sheetStep===1&&<>
          <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:16}}>{f.colors.map(c=><button key={c} onClick={()=>setSelColor(c)} style={{padding:"8px 16px",borderRadius:20,background:selColor===c?C.acc:C.card,color:selColor===c?"#fff":C.txt,border:`1px solid ${C.bdr}`}}>{c}</button>)}</div>
          {selColor&&<div style={{background:C.bg,borderRadius:16,padding:16}}><div style={{fontWeight:800,marginBottom:10}}>[{selColor}] 자재 추가</div><FCard><FRow label="업체명"><div style={{position:"relative"}}><input value={venSearch} onChange={e=>{setVenSearch(e.target.value);setBr(r=>({...r,vid:""}));}} ph="초성검색" style={{textAlign:"right",border:"none",outline:"none",background:"transparent"}}/>{venSearch&&!br.vid&&<div style={{position:"absolute",right:0,top:30,background:"#fff",zIndex:100,border:`1px solid ${C.bdr}`,borderRadius:8}}>{vendors.filter(v=>match(v.name,venSearch)).map(v=><div key={v.id} onClick={()=>{setBr(r=>({...r,vid:v.id}));setVenSearch(v.name);}} style={{padding:10}}>{v.name}</div>)}</div>}</div></FRow><FRow label="자재명"><FInp val={br.mat} onChange={v=>setBr(r=>({...r,mat:v}))}/></FRow><FRow label="소요량"><FInp val={br.amt} onChange={v=>setBr(r=>({...r,amt:v}))} type="number"/></FRow></FCard><Btn ch="+ 추가" full onClick={addBom}/></div>}
          <div style={{marginTop:16}}>{(f.colorBom[selColor]||[]).map(b=><Card key={b.id} st={{padding:12,marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between"}}><span>{b.mat} ({b.amt}{b.unit})</span><button onClick={()=>setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:p.colorBom[selColor].filter(x=>x.id!==b.id)}}))}>✕</button></div></Card>)}</div>
          <div style={{display:"flex",gap:10,marginTop:20}}><Btn ch="이전" v="w" full onClick={()=>setSheetStep(0)}/><Btn ch="저장 완료" full onClick={save}/></div>
        </>}
      </Sheet>}
    </div>
  );
}

function ListPage({orders,products,onNav}){
  const [filter,setFilter]=useState("전체");
  const [dateFilter,setDateFilter]=useState("전체");
  const [startDate,setStartDate]=useState("");
  const [endDate,setEndDate]=useState("");
  const [open,setOpen]=useState(null);
  const SC={완료:C.ok,지연:C.warn,진행중:C.acc};
  const getPastDate=(days)=>{const d=new Date();d.setDate(d.getDate()-days);return d.toISOString().slice(0,10);};
  let dF=orders;
  if(dateFilter==="오늘") dF=orders.filter(o=>o.date===today());
  else if(dateFilter==="어제") dF=orders.filter(o=>o.date===getPastDate(1));
  else if(dateFilter==="1주일") dF=orders.filter(o=>o.date>=getPastDate(7));
  else if(dateFilter==="기간설정"&&startDate&&endDate) dF=orders.filter(o=>o.date>=startDate&&o.date<=endDate);
  const filtered=(filter==="전체"?dF:dF.filter(o=>o.status===filter)).sort((a,b)=>new Date(b.ts||0)-new Date(a.ts||0));
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontWeight:900,fontSize:22}}>발주 내역</div><Tag ch={`${filtered.length}건`}/></div>
      <div style={{display:"flex",gap:7,marginBottom:12,overflowX:"auto",paddingBottom:4}}>{["전체","오늘","어제","1주일","기간설정"].map(s=><button key={s} onClick={()=>setDateFilter(s)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${dateFilter===s?C.acc:C.bdr}`,background:dateFilter===s?C.acc:"#fff",color:dateFilter===s?"#fff":C.sub,fontSize:12,fontWeight:600}}>{s}</button>)}</div>
      {dateFilter==="기간설정"&&<div style={{display:"flex",gap:8,marginBottom:12}}><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{flex:1,padding:10,border:`1px solid ${C.bdr}`,borderRadius:8}}/><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{flex:1,padding:10,border:`1px solid ${C.bdr}`,borderRadius:8}}/></div>}
      <div style={{display:"flex",gap:7,marginBottom:16,overflowX:"auto"}}>{["전체","진행중","완료","지연"].map(s=><button key={s} onClick={()=>setFilter(s)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${filter===s?C.acc:C.bdr}`,background:filter===s?C.acc+"12":"#fff",color:filter===s?C.acc:C.sub,fontSize:12,fontWeight:600}}>{s}</button>)}</div>
      {filtered.map(o=>(<Card key={o.id} st={{marginBottom:12}} onClick={()=>setOpen(open===o.id?null:o.id)}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontWeight:700}}>{Array.from(new Set(o.items.map(it=>products.find(x=>x.id===it.pid)?.name||"-"))).join(", ")}</div><div style={{display:"flex",gap:8,alignItems:"center"}}><Tag ch={o.status} c={SC[o.status]}/><span style={{fontSize:12,color:C.sub}}>{open===o.id?"▲":"▼"}</span></div></div>{open===o.id&&<div style={{marginTop:16}}><Divider/>{o.items.map((it,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"8px 0"}}>{products.find(x=>x.id===it.pid)?.name} / {it.color} <strong>{it.qty}매</strong></div>)}<div style={{display:"flex",gap:8,marginTop:12}}><Btn ch="🔄 재발주" sz="s" v="w" onClick={(e)=>{e.stopPropagation();localStorage.setItem("dworks_draft",JSON.stringify({items:o.items}));onNav("order");}}/>{["완료","지연"].map(s=><Btn key={s} ch={s} sz="s" v="w" onClick={async(e)=>{e.stopPropagation();if(user?.token)await DB.update(user.token,"orders",o.id,{status:s});window.location.reload();}}/>)}</div></div></Card>))}
    </div>
  );
}

function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",subTel:"",email:"",type:"원단",address:"",bizNo:""});
  const [editId,setEditId]=useState(null);
  const [vS,setVS]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  function openAdd(){setF({name:"",tel:"",subTel:"",email:"",type:"원단",address:"",bizNo:""});setEditId(null);setSheet(true);}
  async function save(){if(!f.name||!f.tel||!f.address){alert("필수항목 입력");return;}try{if(editId){if(user?.token)await DB.update(user.token,"vendors",editId,{name:f.name,tel:f.tel,sub_tel:f.subTel,email:f.email,type:f.type,address:f.address,biz_no:f.bizNo});setVendors(vv=>vv.map(v=>v.id===editId?{...v,...f}:v));}else{if(user?.token){const r=await DB.insert(user.token,"vendors",{...f,sub_tel:f.subTel,biz_no:f.bizNo,user_id:user.id});setVendors(vv=>[...vv,r[0]]);}}}catch{alert("저장오류");}setSheet(false);}
  const filtered=vendors.filter(v=>match(v.name,vS));
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontWeight:900,fontSize:22}}>거래처 관리</div><Btn ch="+ 업체 등록" sz="s" onClick={openAdd}/></div>
      <div style={{marginBottom:16}}><TxtInp val={vS} onChange={setVS} ph="🔍 업체명 초성 검색"/></div>
      {filtered.map(v=>(<Card key={v.id} st={{marginBottom:12,display:"flex",alignItems:"center",gap:16}}><div style={{width:48,height:48,borderRadius:14,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{VEN_IC[v.type]}</div><div style={{flex:1}}><div style={{fontWeight:700}}>{v.name} <Tag ch={v.type} c={VEN_C[v.type]}/></div><div style={{fontSize:12,color:C.sub2,marginTop:4}}>{v.tel} · {v.email||"이메일 없음"}</div></div></Card>))}
      {sheet&&<Sheet title={editId?"거래처 수정":"거래처 등록"} onClose={()=>setSheet(false)}><Field label="업체명" req><TxtInp val={f.name} onChange={sf("name")}/></Field><Field label="핸드폰" req><TxtInp val={f.tel} onChange={sf("tel")}/></Field><Field label="주소" req><TxtInp val={f.address} onChange={sf("address")}/></Field><Field label="이메일"><TxtInp val={f.email} onChange={sf("email")}/></Field><Btn ch="저장하기" full onClick={save} st={{height:56,borderRadius:16,marginTop:20}}/></Sheet>}
    </div>
  );
}

function SettingsPage({user,setUser,onLogout}){
  const [prof,setProf]=useState(null);
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{fontWeight:900,fontSize:22,marginBottom:20}}>환경설정</div>
      <Card st={{marginBottom:16,display:"flex",alignItems:"center",gap:16}}><div style={{width:56,height:56,borderRadius:28,background:C.acc+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>👤</div><div style={{flex:1}}><div style={{fontWeight:800,fontSize:17}}>{user.name} {user.position}</div><div style={{color:C.sub,fontSize:12,marginTop:2}}>{user.company} / {user.email}</div></div><button onClick={()=>setProf({...user})} style={{color:C.acc,fontWeight:700,background:"none",border:"none"}}>정보수정</button></Card>
      <Btn ch="로그아웃" v="red" full onClick={onLogout} st={{borderRadius:16,height:56}}/>
      {prof&&<Sheet title="회원 정보 수정" onClose={()=>setProf(null)}><Field label="업체명"><TxtInp val={prof.company} onChange={v=>setProf(p=>({...p,company:v}))}/></Field><Field label="성함"><TxtInp val={prof.name} onChange={v=>setProf(p=>({...p,name:v}))}/></Field><Field label="직함"><TxtInp val={prof.position} onChange={v=>setProf(p=>({...p,position:v}))}/></Field><Field label="연락처"><TxtInp val={prof.tel} onChange={v=>setProf(p=>({...p,tel:v}))}/></Field><Btn ch="변경 사항 저장" full onClick={async()=>{await DB.updateUser(user.token,prof); setUser(u=>({...u,...prof})); setProf(null); alert("수정되었습니다.");}} st={{height:56,borderRadius:16,marginTop:20}}/></Sheet>}
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
  async function loadData(token){setLoading(true);try{const[v,f,p,o]=await Promise.all([DB.list(token,"vendors"),DB.list(token,"factories"),DB.list(token,"products"),DB.list(token,"orders")]);setVendors(v||[]);setFactories(f||[]);setProducts(p?.map(x=>({...x, imageUrl:x.image_url}))||[]);setOrders(o||[]);}catch{setScreen("auth");}finally{setLoading(false);}}
  useEffect(()=>{const check=async()=>{try{const s=localStorage.getItem("dworks_session");if(s){const u=JSON.parse(s);if(u?.token){setUser(u);setScreen("app");await loadData(u.token);return;}}}catch{}setScreen("splash");};check();},[]);
  async function handleLogin(u){try{localStorage.setItem("dworks_session",JSON.stringify(u));}catch{}setUser(u);setScreen("app");await loadData(u.token);}
  async function handleLogout(){if(user?.token)try{await DB.signOut(user.token);}catch{}localStorage.removeItem("dworks_session");setUser(null);setScreen("auth");}
  const TABS=[ {k:"dash",i:"🏠",l:"대시보드"},{k:"order",i:"🖊️",l:"발주하기"},{k:"prods",i:"👕",l:"상품"},{k:"list",i:"📋",l:"발주리스트"} ];
  if(screen==="loading")return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg,fontFamily:C.fn}}>로딩 중...</div>;
  if(screen==="splash")return<SplashPage onStart={()=>setScreen("auth")}/>;
  if(screen==="auth"||!user)return<AuthPage onLogin={handleLogin}/>;
  const pgs={dash:<DashPage orders={orders} products={products} onNav={setPage}/>,order:<OrderPage products={products} orders={orders} setOrders={setOrders} vendors={vendors} factories={factories} user={user} onNav={setPage}/>,prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} user={user}/>,list:<ListPage orders={orders} products={products} user={user} onNav={setPage}/>,vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,settings:<SettingsPage user={user} setUser={setUser} onLogout={handleLogout}/>};
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,color:C.txt,maxWidth:480,margin:"0 auto",position:"relative"}}>
      <div style={{background:C.card,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,borderBottom:`1px solid ${C.bdr}`,borderRadius:"0 0 20px 20px"}}>
        <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:19,cursor:"pointer",fontFamily:C.fn}}>D-Works</button>
        <div onClick={()=>setPage("settings")} style={{width:32,height:32,borderRadius:16,background:C.acc+"15",color:C.acc,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,cursor:"pointer"}}>{user.name.slice(-2)}</div>
      </div>
      <div style={{paddingBottom:80}}>{pgs[page]||pgs.dash}</div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.card,borderTop:`1px solid ${C.bdr}`,display:"flex",zIndex:100,borderRadius:"20px 20px 0 0",padding:"4px 0 10px",boxShadow:"0 -2px 10px rgba(0,0,0,0.03)"}}>
        {TABS.map(t=><button key={t.k} onClick={()=>setPage(t.k)} style={{flex:1,padding:"10px",background:"none",border:"none",color:page===t.k?C.acc:C.sub,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><div style={{fontSize:18,borderRadius:10,padding:4,background:page===t.k?C.acc+"10":"none"}}>{t.i}</div><span style={{fontSize:9,fontWeight:page===t.k?700:500}}>{t.l}</span></button>)}
      </div>
    </div>
  );
}
