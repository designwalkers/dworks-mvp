import React, { useState, useEffect } from "react";

// ── Supabase 설정 (수정 금지) ──────────────────────────────────
const SB = "https://qimgostiseehdnvhmoph.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";

function ah(t){return{"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"};}
async function api(m,p,t,b){const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined});return r.json();}

// [데이터 안 사라지는 핵심 명령어]
const DB={
  signUp:(e,pw,meta)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:meta}),
  signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),
  list:(t,tbl)=>api("GET",`/rest/v1/${tbl}?select=*&order=created_at.asc`,t), // select=* 추가로 무조건 가져오기
  insert:(t,tbl,d)=>api("POST",`/rest/v1/${tbl}`,t,d),
  update:(t,tbl,id,d)=>api("PATCH",`/rest/v1/${tbl}?id=eq.${id}`,t,d),
  del:(t,tbl,id)=>fetch(`${SB}/rest/v1/${tbl}?id=eq.${id}`,{method:"DELETE",headers:ah(t)}),
};

// ── 디자인 상수 ──────────────────────────────────────────────────
const C={bg:"#F8F9FB",card:"#FFFFFF",bdr:"#E8ECF2",acc:"#3772FF",txt:"#111827",sub:"#9CA3AF",sub2:"#6B7280",ok:"#10B981",warn:"#F59E0B",red:"#EF4444",fn:"'Noto Sans KR',sans-serif"};
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");

// ── 공통 UI ───────────────────────────────────────────────────
const Btn=({ch,onClick,v="p",full,disabled,st={}})=>{
  const bg={p:C.acc,w:"#fff",ok:C.ok,d:C.bg}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,ok:"#fff",d:C.sub}[v]||"#fff";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#EDF0F5":bg,color:disabled?"#B0B8C4":cl,border:v==="w"?`1.5px solid ${C.bdr}`:"none",borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:700,cursor:"pointer",width:full?"100%":"auto",...st}}>{ch}</button>;
};
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:"#fff",borderRadius:12,border:`1px solid ${C.bdr}`,padding:16,boxSizing:"border-box",...st}}>{children}</div>;
const Tag=({ch,c=C.acc})=><span style={{background:c+"18",color:c,padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:700}}>{ch}</span>;
const G=({h=12})=><div style={{height:h}}/>;
function Field({label,children,req}){return<div style={{marginBottom:16}}><div style={{fontSize:13,fontWeight:600,color:C.txt,marginBottom:8}}>{label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}</div>{children}</div>;}
function TxtInp({val,onChange,ph,type="text"}){return<div style={{border:`1px solid ${C.bdr}`,borderRadius:8,background:"#fff"}}><input value={val||""} onChange={e=>onChange(e.target.value)} placeholder={ph} type={type} style={{width:"100%",border:"none",outline:"none",padding:"12px 14px",fontSize:13,boxSizing:"border-box"}}/></div>;}
function DropSel({val,onChange,children,ph}){return<div style={{border:`1px solid ${C.bdr}`,borderRadius:8,background:"#fff"}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",padding:"12px 14px",fontSize:13,background:"transparent"}}>{ph&&<option value="">{ph}</option>}{children}</select></div>;}

function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"0 20px 40px",width:"100%",maxHeight:"85vh",overflowY:"auto",maxWidth:480,margin:"0 auto"}}>
        <div style={{width:36,height:4,background:C.bdr,borderRadius:2,margin:"12px auto 16px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontWeight:800,fontSize:17}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:18}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── 페이지 컴포넌트 ─────────────────────────────────────────────

function DashPage({orders}){
  return <div style={{padding:14}}><h3>대시 보드</h3><Card>오늘 발주: {orders.filter(o=>o.date===today()).length}건</Card></div>;
}

function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [name,setName]=useState("");
  const [tel,setTel]=useState("");

  async function save(){
    if(!name) return;
    const data={name,tel,type:"원단",user_id:user.id};
    const r=await DB.insert(user.token,"vendors",data);
    setVendors([...vendors,Array.isArray(r)?r[0]:data]);
    setSheet(false); setName(""); setTel("");
  }

  return(
    <div style={{padding:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3>거래처 관리</h3><Btn ch="+ 추가" sz="s" onClick={()=>setSheet(true)} st={{padding:"5px 15px"}}/></div>
      {vendors.length===0?<p style={{textAlign:"center",color:C.sub}}>데이터 로딩 중...</p>:vendors.map(v=><Card key={v.id} st={{marginBottom:10}}><strong>{v.name}</strong><br/><span style={{fontSize:12,color:C.sub}}>{v.tel}</span></Card>)}
      {sheet&&<Sheet title="거래처 추가" onClose={()=>setSheet(false)}><Field label="거래처명"><TxtInp val={name} onChange={setName}/></Field><Field label="연락처"><TxtInp val={tel} onChange={setTel}/></Field><Btn ch="저장하기" full onClick={save}/></Sheet>}
    </div>
  );
}

function ProdsPage({products,setProducts,user}){
  const [sheet,setSheet]=useState(false);
  const [name,setName]=useState("");
  async function save(){
    const data={name,category:"이너",user_id:user.id};
    const r=await DB.insert(user.token,"products",data);
    setProducts([...products,Array.isArray(r)?r[0]:data]);
    setSheet(false); setName("");
  }
  return(
    <div style={{padding:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3>상품 관리</h3><Btn ch="+ 추가" onClick={()=>setSheet(true)}/></div>
      {products.map(p=><Card key={p.id} st={{marginBottom:10}}>{p.name}</Card>)}
      {sheet&&<Sheet title="상품 추가" onClose={()=>setSheet(false)}><Field label="상품명"><TxtInp val={name} onChange={setName}/></Field><Btn ch="저장" full onClick={save}/></Sheet>}
    </div>
  );
}

// ── 메인 앱 (App) ──────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("loading");
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dash");
  const [vendors,setVendors]=useState([]);
  const [products,setProducts]=useState([]);
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(false);

  async function loadData(token){
    setLoading(true);
    try{
      const [v,p,o]=await Promise.all([DB.list(token,"vendors"),DB.list(token,"products"),DB.list(token,"orders")]);
      setVendors(Array.isArray(v)?v:[]);
      setProducts(Array.isArray(p)?p:[]);
      setOrders(Array.isArray(o)?o:[]);
    }catch(e){console.error(e);}
    finally{setLoading(false);}
  }

  useEffect(()=>{
    const s=localStorage.getItem("dworks_session");
    if(s){
      const u=JSON.parse(s);
      if(u?.token){setUser(u);setScreen("app");loadData(u.token);return;}
    }
    setScreen("auth");
  },[]);

  function handleLogin(u){
    localStorage.setItem("dworks_session",JSON.stringify(u));
    setUser(u); setScreen("app"); loadData(u.token);
  }

  if(screen==="loading") return <div style={{textAlign:"center",padding:50}}>데이터 연결 중...</div>;
  if(screen==="auth") return <div style={{padding:50,textAlign:"center"}}><h2>D-Works</h2><Btn ch="시작하기" full onClick={()=>handleLogin({token:KEY,id:"5da1c316-db3b-4c29-8e5a-e2c7a",name:"Mr.Min"})}/></div>;

  const pages={
    dash:<DashPage orders={orders}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} user={user}/>,
    vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,
    settings:<div style={{padding:20}}><Btn ch="로그아웃" v="w" full onClick={()=>{localStorage.removeItem("dworks_session");window.location.reload();}}/></div>
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,maxWidth:480,margin:"0 auto",position:"relative"}}>
      <div style={{background:"#fff",padding:"14px",borderBottom:`1px solid ${C.bdr}`,display:"flex",justifyContent:"space-between"}}>
        <strong style={{color:C.acc,fontSize:18}} onClick={()=>setPage("dash")}>D-Works</strong>
        <span style={{fontSize:12}}>{user.name}</span>
      </div>
      <div style={{paddingBottom:80}}>{loading?<p style={{textAlign:"center",padding:20}}>로딩 중...</p>:pages[page]}</div>
      <div style={{position:"fixed",bottom:0,width:"100%",maxWidth:480,background:"#fff",display:"flex",borderTop:`1px solid ${C.bdr}`}}>
        {[{k:"dash",l:"홈"},{k:"prods",l:"상품"},{k:"vendors",l:"거래처"},{k:"settings",l:"설정"}].map(t=>(
          <button key={t.k} onClick={()=>setPage(t.k)} style={{flex:1,padding:"15px 0",background:"none",border:"none",color:page===t.k?C.acc:C.sub,fontWeight:page===t.k?700:400}}>{t.l}</button>
        ))}
      </div>
    </div>
  );
}
