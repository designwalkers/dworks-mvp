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

// ── 디자인 상수 (정갈한 스타일로 보정) ─────────────────────────
const C={
  bg:"#F8F9FA",
  card:"#FFFFFF",
  bdr:"#E9ECEF",
  acc:"#3772FF",
  txt:"#212529",
  sub:"#868E96",
  sub2:"#495057",
  ok:"#212529", // 텍스트 위주 검정
  warn:"#FA5252",
  red:"#FA5252",
  fn:"'Noto Sans KR', sans-serif"
};

const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const CATS=["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const SEASONS=["26SS","26FW","25SS","25FW"];

// ── 공통 UI ───────────────────────────────────────────────────
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",ok:"#212529",d:"#E9ECEF",red:C.red}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,ok:"#fff",d:C.sub,red:"#fff"}[v]||"#fff";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#F1F3F5":bg,color:disabled?C.sub:cl,border:v==="w"?`1px solid ${C.bdr}`:"none",borderRadius:12,padding:sz==="s"?"10px 16px":"16px 0",fontSize:sz==="s"?13:15,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:C.fn,width:full?"100%":"auto",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,boxSizing:"border-box",...st}}>{ch}</button>;
};

const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:C.card,borderRadius:16,padding:20,border:`1px solid ${C.bdr}`,boxShadow:"0 1px 3px rgba(0,0,0,0.02)",cursor:onClick?"pointer":"default",boxSizing:"border-box",...st}}>{children}</div>;

const Tag=({ch,c=C.acc})=><span style={{background:"#F1F3F5",color:C.sub2,padding:"4px 8px",borderRadius:6,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{ch}</span>;

function Field({label,children,req}){return<div style={{marginBottom:24}}><div style={{fontSize:15,fontWeight:800,color:C.txt,marginBottom:10}}>{label}{req&&<span style={{color:C.acc,marginLeft:3}}>*</span>}</div>{children}</div>;}

function TxtInp({val,onChange,ph,type="text",onKeyDown}){return<div style={{background:"#F1F3F5",borderRadius:12,padding:"0 16px"}}><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} onKeyDown={onKeyDown} style={{flex:1,width:"100%",border:"none",outline:"none",padding:"16px 0",fontSize:15,color:C.txt,fontFamily:C.fn,background:"transparent"}}/></div>;}

function DropSel({val,onChange,children,ph}){return<div style={{position:"relative",background:"#F1F3F5",borderRadius:12}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",padding:"16px",fontSize:15,color:val?C.txt:C.sub,fontFamily:C.fn,background:"transparent",WebkitAppearance:"none",cursor:"pointer"}}>{ph&&<option value="">{ph}</option>}{children}</select><span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:C.sub,pointerEvents:"none"}}>▼</span></div>;}

function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card,borderRadius:"24px 24px 0 0",padding:"0 24px 40px",width:"100%",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box",fontFamily:C.fn,maxWidth:480}}>
        <div style={{width:40,height:4,background:C.bdr,borderRadius:2,margin:"12px auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><span style={{fontWeight:800,fontSize:18}}>{title}</span><button onClick={onClose} style={{background:"none",border:"none",fontSize:20,color:C.sub}}>✕</button></div>
        {children}
      </div>
    </div>
  );
}

// ── 페이지 컴포넌트 ───────────────────────────────────────────

function AuthPage({onLogin}){
  const [tab,setTab]=useState("in");
  const [f,setF]=useState({company:"",name:"",tel:"",email:"",pw:"",agree:false});
  const [err,setErr]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  async function submit(){setErr("");if(!f.email||!f.pw)return setErr("이메일과 비밀번호 입력");try{if(tab==="up"){const r=await DB.signUp(f.email,f.pw,{company:f.company,name:f.name,tel:f.tel});if(r.error)return setErr(r.error.message);alert("가입완료! 로그인하세요");setTab("in");}else{const r=await DB.signIn(f.email,f.pw);if(!r.access_token)return setErr("로그인 실패");const m=r.user?.user_metadata||{};onLogin({token:r.access_token,id:r.user.id,name:m.name,company:m.company,email:r.user.email});}}catch{setErr("네트워크 오류");}}
  return(
    <div style={{minHeight:"100vh",background:C.bg,maxWidth:480,margin:"0 auto",padding:"40px 24px"}}>
      <div style={{fontSize:28,fontWeight:900,color:C.acc,textAlign:"center",marginBottom:40}}>D-Works</div>
      <div style={{display:"flex",gap:10,marginBottom:32}}>{[["in","로그인"],["up","회원가입"]].map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"14px 0",background:tab===k?C.acc:"none",color:tab===k?"#fff":C.sub,border:tab===k?"none":`1px solid ${C.bdr}`,borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer"}}>{l}</button>)}</div>
      {tab==="up"&&<><Field label="업체명" req><TxtInp val={f.company} onChange={sf("company")} ph="회사명"/></Field><Field label="성함" req><TxtInp val={f.name} onChange={sf("name")} ph="성함"/></Field><Field label="연락처" req><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000"/></Field></>}
      <Field label="이메일" req><TxtInp val={f.email} onChange={sf("email")} ph="example@email.com"/></Field>
      <Field label="비밀번호" req><TxtInp val={f.pw} onChange={sf("pw")} ph="6자 이상" type="password"/></Field>
      {err&&<div style={{color:C.red,textAlign:"center",marginBottom:16,fontWeight:600}}>{err}</div>}
      <Btn ch={tab==="in"?"로그인":"가입하기"} full sz="l" onClick={submit}/>
    </div>
  );
}

function DashPage({orders,products,onNav}){
  const chart=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return{label:d.toISOString().slice(5,10),v:orders.filter(o=>o.date===d.toISOString().slice(0,10)).length};});
  return(
    <div style={{padding:"24px 20px 100px"}}>
      <div style={{fontSize:24,fontWeight:900,marginBottom:24}}>대시보드</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24}}>
        {[ {l:"오늘 발주",v:orders.filter(o=>o.date===today()).length+"건"}, {l:"미출고",v:orders.filter(o=>o.status==="지연").length+"건"}, {l:"전체 상품",v:products.length+"종"} ].map(s=><div key={s.l} style={{background:"#fff",padding:"16px 8px",borderRadius:16,textAlign:"center",border:`1px solid ${C.bdr}`}}><div style={{fontSize:18,fontWeight:900,color:C.acc}}>{s.v}</div><div style={{fontSize:11,color:C.sub,marginTop:4,fontWeight:600}}>{s.l}</div></div>)}
      </div>
      <Card st={{marginBottom:24}}>
        <div style={{fontWeight:800,marginBottom:16}}>📈 발주 건수 추이</div>
        <LineChart data={chart}/><div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>{chart.map(d=><span key={d.label} style={{fontSize:10,color:C.sub}}>{d.label}</span>)}</div>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontWeight:800,fontSize:17}}>최근 발주 내역</span><button onClick={()=>onNav("list")} style={{background:"none",border:"none",color:C.sub,fontSize:13}}>더보기〉</button></div>
      {orders.slice(-3).reverse().map(o=><Card key={o.id} st={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:15}}>{Array.from(new Set(o.items.map(it=>products.find(p=>p.id===it.pid)?.name))).join(", ")}</span><Tag ch={o.date}/></div></Card>)}
    </div>
  );
}

function OrderPage({products,orders,setOrders,vendors,user,onNav}){
  const [step,setStep]=useState(1);
  const [items,setItems]=useState([]);
  const [search,setSearch]=useState("");
  const [selProd,setSelProd]=useState(null);
  const [selColor,setSelColor]=useState("");
  const [qty,setQty]=useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  
  useEffect(()=>{const d=localStorage.getItem("dworks_draft");if(d){const dr=JSON.parse(d);if(dr.items?.length>0)setItems(dr.items);}},[]);
  
  const addItem=()=>{if(!selProd||!selColor||!qty)return;setItems(p=>[...p,{pid:selProd.id,color:selColor,qty:Number(qty)}]);setSelProd(null);setQty("");setSearch("");};
  
  const generatePreview=()=>{
    const vM={};for(const it of items){const p=products.find(x=>x.id===it.pid);if(!p)continue;for(const b of p.bom||[]){const ven=vendors.find(v=>v.id===b.vid);if(!ven?.email)continue;if(!vM[ven.id])vM[ven.id]={v:ven,lines:[]};vM[ven.id].lines.push({p,it,b});}}
    const pD=Object.values(vM).map(t=>{let b=`${t.v.name} 담당자님 안녕하세요.\n${user.company} 발주서입니다.\n\n`;t.lines.forEach(l=>{b+=`- ${l.p.name}(${l.color}): ${l.b.mat} ${fmtN(Math.round(l.b.amt*l.it.qty*100)/100)}${l.b.unit}\n`});b+=`\n감사합니다.\nD-Works`;return{vendor:t.v,body:b}});
    setPreviewData(pD);setShowPreview(true);
  };

  const confirmOrder=async()=>{try{if(user?.token)await DB.insert(user.token,"orders",{items,date:today(),status:"진행중",ts:new Date().toISOString(),user_id:user.id});for(const d of previewData)await sendEmail(d.vendor.email,d.vendor.name,"발주서",d.body);alert("발송 완료!");localStorage.removeItem("dworks_draft");onNav("list");}catch{alert("오류");}};

  return(
    <div style={{padding:"24px 20px 100px"}}>
      <div style={{fontSize:24,fontWeight:900,marginBottom:8}}>발주 입력</div>
      <div style={{color:C.sub,fontSize:14,marginBottom:24}}>상품을 선택하고 리스트에 추가해주세요</div>
      <Card st={{marginBottom:24}}>
        <Field label="상품명"><div style={{position:"relative"}}><TxtInp val={search} onChange={v=>{setSearch(v);setSelProd(null);}} ph="🔍 초성 검색 가능"/>{search&&!selProd&&<div style={{position:"absolute",left:0,right:0,top:55,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:12,zIndex:50,maxHeight:200,overflowY:"auto"}}>{products.filter(p=>match(p.name,search)).map(p=><div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);}} style={{padding:16,borderBottom:`1px solid ${C.bdr}`}}>{p.name}</div>)}</div>}</div></Field>
        <Field label="색상"><DropSel val={selColor} onChange={setSelColor} ph="색상 선택">{(selProd?.colors||[]).map(c=><option key={c} value={c}>{c}</option>)}</DropSel></Field>
        <Field label="수량"><TxtInp val={qty} onChange={setQty} ph="수량 입력" type="number"/></Field>
        <Btn ch="+ 리스트에 추가" full onClick={addItem} disabled={!selProd||!qty}/>
      </Card>
      <div style={{fontWeight:800,fontSize:17,marginBottom:16}}>발주 리스트</div>
      {items.length===0?<Empty icon="🛒" text="추가된 상품이 없습니다"/>:items.map((it,i)=><Card key={i} st={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontWeight:700}}>{products.find(p=>p.id===it.pid)?.name} / {it.color}</div><div style={{display:"flex",alignItems:"center",gap:8}}><input type="number" value={it.qty} onChange={e=>setItems(prev=>prev.map((item,idx)=>idx===i?{...item,qty:Number(e.target.value)}:item))} style={{width:60,textAlign:"right",padding:8,borderRadius:8,border:`1px solid ${C.bdr}`,fontSize:14,fontWeight:700,color:C.acc}}/>장<button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.sub,fontSize:18}}>✕</button></div></Card>)}
      <Btn ch="✅ 발주서 미리보기" full sz="l" st={{marginTop:24,height:56,borderRadius:16}} disabled={!items.length} onClick={generatePreview}/>
      {showPreview && <Sheet title="최종 발송 확인" onClose={()=>setShowPreview(false)}>{previewData.map((d,i)=>(<div key={i} style={{marginBottom:16,padding:16,background:C.bg,borderRadius:12}}><div style={{fontWeight:800,color:C.acc,marginBottom:8}}>📧 {d.vendor.name}</div><pre style={{fontSize:12,whiteSpace:"pre-wrap",lineHeight:1.6}}>{d.body}</pre></div>))}<Btn ch="🚀 이대로 최종 발송" full onClick={confirmOrder}/></Sheet>}
    </div>
  );
}function ProdsPage({products,setProducts,vendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",category:"이너",season:"25SS",colors:[],bom:[],imageUrl:""});
  const [editId,setEditId]=useState(null);
  const [search,setSearch]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if(file) { const reader = new FileReader(); reader.onloadend = () => { setF(p => ({...p, imageUrl: reader.result})); }; reader.readAsDataURL(file); }
  };

  async function save(){if(!f.name)return;try{if(editId){if(user?.token)await DB.update(user.token,"products",editId,{...f,image_url:f.imageUrl});setProducts(products.map(p=>p.id===editId?{...f}:p));}else{if(user?.token){const r=await DB.insert(user.token,"products",{...f,image_url:f.imageUrl,user_id:user.id});setProducts(p=>[...p,{...f,id:r[0].id}]);}}}catch{alert("image_url 컬럼을 추가해주세요.");}setSheet(false);}

  return(
    <div style={{padding:"24px 20px 100px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div style={{fontSize:24,fontWeight:900}}>상품 관리</div><Btn ch="+ 상품 등록" sz="s" onClick={()=>{setF({name:"",category:"이너",season:"25SS",colors:[],bom:[],imageUrl:""});setEditId(null);setSheet(true);}}/></div>
      <div style={{marginBottom:20}}><TxtInp val={search} onChange={setSearch} ph="🔍 상품명 초성 검색"/></div>
      {products.filter(p=>match(p.name,search)).map(p=>(<Card key={p.id} st={{marginBottom:12,display:"flex",gap:16,alignItems:"flex-start"}}><div style={{width:60,height:60,borderRadius:12,background:"#F1F3F5",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>{p.imageUrl?<img src={p.imageUrl} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"👕"}</div><div style={{flex:1}}><div style={{fontWeight:800,fontSize:16}}>{p.name}</div><div style={{fontSize:12,color:C.sub,marginTop:4}}>{p.category} · {p.season}</div><div style={{display:"flex",gap:4,marginTop:6}}>{p.colors.map(c=><Tag key={c} ch={c}/>)}</div></div><button onClick={()=>{setF({...p,imageUrl:p.imageUrl});setEditId(p.id);setSheet(true);}} style={{background:"none",border:"none",color:C.acc,fontWeight:700,fontSize:13}}>수정</button></Card>))}
      {sheet&&<Sheet title={editId?"상품 수정":"상품 등록"} onClose={()=>setSheet(false)}>
        <Field label="상품명"><TxtInp val={f.name} onChange={sf("name")} ph="상품명 입력"/></Field>
        <Field label="작업지시서"><div onClick={()=>document.getElementById('img-in').click()} style={{height:150,background:"#F1F3F5",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>{f.imageUrl?<img src={f.imageUrl} style={{height:"100%"} }/>:<span>📸 사진 업로드</span>}</div><input id="img-in" type="file" accept="image/*" onChange={handleImage} style={{display:"none"}}/></Field>
        <Field label="색상 (쉼표로 구분)"><TxtInp val={f.colors.join(",")} onChange={v=>sf("colors")(v.split(","))} ph="블랙,화이트,네이비"/></Field>
        <Btn ch="저장하기" full sz="l" onClick={save}/>
      </Sheet>}
    </div>
  );
}

function ListPage({orders,products,user,onNav}){
  const [open,setOpen]=useState(null);
  return(
    <div style={{padding:"24px 20px 100px"}}>
      <div style={{fontSize:24,fontWeight:900,marginBottom:24}}>발주 내역</div>
      {orders.map(o=>(<Card key={o.id} st={{marginBottom:12}} onClick={()=>setOpen(open===o.id?null:o.id)}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontWeight:700}}>{Array.from(new Set(o.items.map(it=>products.find(p=>p.id===it.pid)?.name))).join(", ")}</div><Tag ch={o.status}/></div>{open===o.id&&<div style={{marginTop:16}}><Divider/>{o.items.map((it,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:14}}>{products.find(p=>p.id===it.pid)?.name}({it.color}) <strong>{it.qty}매</strong></div>)}<Btn ch="🔄 동일 내역 재발주" full v="w" st={{marginTop:16,color:C.acc,borderColor:C.acc}} onClick={(e)=>{e.stopPropagation();localStorage.setItem("dworks_draft",JSON.stringify({items:o.items}));onNav("order");}}/></div>}</Card>))}
    </div>
  );
}

function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",email:"",type:"원단"});
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  async function save(){if(!f.name)return;try{if(user?.token){const r=await DB.insert(user.token,"vendors",{...f,user_id:user.id});setVendors(vv=>[...vv,r[0]]);}}catch{}setSheet(false);}
  return(
    <div style={{padding:"24px 20px 100px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div style={{fontSize:24,fontWeight:900}}>거래처 관리</div><Btn ch="+ 업체 추가" sz="s" onClick={()=>{setF({name:"",tel:"",email:"",type:"원단"});setSheet(true);}}/></div>
      {vendors.map(v=>(<Card key={v.id} st={{marginBottom:12}}><div style={{fontWeight:800,fontSize:16}}>{v.name} <Tag ch={v.type}/></div><div style={{fontSize:13,color:C.sub,marginTop:4}}>{v.tel} · {v.email}</div></Card>))}
      {sheet&&<Sheet title="거래처 등록" onClose={()=>setSheet(false)}><Field label="업체명"><TxtInp val={f.name} onChange={sf("name")}/></Field><Field label="이메일"><TxtInp val={f.email} onChange={sf("email")}/></Field><Btn ch="등록하기" full onClick={save}/></Sheet>}
    </div>
  );
}

function SettingsPage({user,onLogout}){
  return(
    <div style={{padding:"24px 20px 100px"}}>
      <div style={{fontSize:24,fontWeight:900,marginBottom:24}}>설정</div>
      <Card st={{marginBottom:24,display:"flex",alignItems:"center",gap:16}}><div style={{width:56,height:56,borderRadius:28,background:C.acc+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>👤</div><div><div style={{fontWeight:800,fontSize:18}}>{user.name}</div><div style={{fontSize:13,color:C.sub,marginTop:2}}>{user.company} / {user.email}</div></div></Card>
      <Btn ch="로그아웃" v="red" full onClick={onLogout} st={{height:56,borderRadius:16}}/>
    </div>
  );
}

export default function App(){
  const [screen,setScreen]=useState("loading");
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dash");
  const [vendors,setVendors]=useState([]);
  const [products,setProducts]=useState([]);
  const [orders,setOrders]=useState([]);
  async function loadData(token){try{const[v,p,o]=await Promise.all([DB.list(token,"vendors"),DB.list(token,"products"),DB.list(token,"orders")]);setVendors(v||[]);setProducts(p?.map(x=>({...x,imageUrl:x.image_url}))||[]);setOrders(o||[]);}catch{setScreen("auth");}}
  useEffect(()=>{const check=async()=>{try{const s=localStorage.getItem("dworks_session");if(s){const u=JSON.parse(s);if(u?.token){setUser(u);setScreen("app");await loadData(u.token);return;}}}catch{}setScreen("splash");};check();},[]);
  async function handleLogin(u){try{localStorage.setItem("dworks_session",JSON.stringify(u));}catch{}setUser(u);setScreen("app");await loadData(u.token);}
  const TABS=[ {k:"dash",i:"🏠",l:"대시보드"},{k:"order",i:"🖊️",l:"발주하기"},{k:"prods",i:"👕",l:"상품"},{k:"list",i:"📋",l:"내역"} ];
  if(screen==="loading") return <div style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center",fontFamily:C.fn}}>잠시만 기다려주세요...</div>;
  if(screen==="splash") return <SplashPage onStart={()=>setScreen("auth")}/>;
  if(screen==="auth"||!user) return <AuthPage onLogin={handleLogin}/>;
  const pgs={dash:<DashPage orders={orders} products={products} onNav={setPage}/>,order:<OrderPage products={products} orders={orders} vendors={vendors} user={user} onNav={setPage}/>,prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} user={user}/>,list:<ListPage orders={orders} products={products} user={user} onNav={setPage}/>,settings:<SettingsPage user={user} onLogout={()=>{localStorage.removeItem("dworks_session");setUser(null);setScreen("auth");}}/>};
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,color:C.txt,maxWidth:480,margin:"0 auto",position:"relative"}}>
      <div style={{background:C.card,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,borderBottom:`1px solid ${C.bdr}`,borderRadius:"0 0 20px 20px"}}><button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:19,cursor:"pointer"}}>D-Works</button><div onClick={()=>setPage("settings")} style={{width:32,height:32,borderRadius:16,background:C.acc+"15",color:C.acc,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,cursor:"pointer"}}>{user.name.slice(-2)}</div></div>
      <div style={{paddingBottom:80}}>{pgs[page]||pgs.dash}</div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.card,borderTop:`1px solid ${C.bdr}`,display:"flex",zIndex:100,borderRadius:"20px 20px 0 0",padding:"8px 0 16px",boxShadow:"0 -2px 10px rgba(0,0,0,0.03)"}}>
        {TABS.map(t=><button key={t.k} onClick={()=>setPage(t.k)} style={{flex:1,padding:"8px",background:"none",border:"none",color:page===t.k?C.acc:C.sub,cursor:"pointer",fontFamily:C.fn,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><div style={{fontSize:20,borderRadius:10,padding:4,background:page===t.k?C.acc+"10":"none"}}>{t.i}</div><span style={{fontSize:10,fontWeight:page===t.k?700:500}}>{t.l}</span></button>)}
      </div>
    </div>
  );
}
