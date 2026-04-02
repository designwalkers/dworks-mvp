import React, { useState, useEffect } from "react";

// ── Supabase & API 설정 ────────────────────────────────────────
const SB = "https://qimgostiseehdnvhmoph.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";

function ah(t){return{"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"};}
async function api(m,p,t,b){const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined});return r.json();}

const DB={
  signUp:(e,pw,meta)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:meta}),
  signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),
  list:(t,tbl)=>api("GET",`/rest/v1/${tbl}?select=*&order=created_at.asc`,t),
  insert:(t,tbl,d)=>api("POST",`/rest/v1/${tbl}`,t,d),
  update:(t,tbl,id,d)=>api("PATCH",`/rest/v1/${tbl}?id=eq.${id}`,t,d),
  del:(t,tbl,id)=>fetch(`${SB}/rest/v1/${tbl}?id=eq.${id}`,{method:"DELETE",headers:ah(t)}),
};

// ── 상수 및 디자인 가이드 ─────────────────────────────────────────
const C={bg:"#F8F9FB",card:"#FFFFFF",bdr:"#E8ECF2",acc:"#3772FF",txt:"#111827",sub:"#9CA3AF",sub2:"#6B7280",ok:"#10B981",warn:"#F59E0B",red:"#EF4444",fn:"'Noto Sans KR',sans-serif"};
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const CATS=["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const CAT_C={이너:"#3772FF",아우터:"#8B5CF6",팬츠:"#10B981",니트:"#F59E0B",원피스:"#EC4899",스커트:"#06B6D4",기타:"#9CA3AF"};

// ── 공통 UI 컴포넌트 ─────────────────────────────────────────────
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",ok:C.ok}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,ok:"#fff"}[v]||"#fff";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#EDF0F5":bg,color:disabled?"#B0B8C4":cl,border:v==="w"?`1.5px solid ${C.bdr}`:"none",borderRadius:10,padding:sz==="s"?"8px 16px":"14px 0",fontSize:14,fontWeight:700,cursor:"pointer",width:full?"100%":"auto",fontFamily:C.fn,display:"flex",alignItems:"center",justifyContent:"center",gap:6,...st}}>{ch}</button>;
};
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:"#fff",borderRadius:14,border:`1px solid ${C.bdr}`,padding:18,boxSizing:"border-box",boxShadow:"0 2px 4px rgba(0,0,0,0.02)",...st}}>{children}</div>;
const Tag=({ch,c=C.acc})=><span style={{background:c+"15",color:c,padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{ch}</span>;
const G=({h=12})=><div style={{height:h}}/>;
function Field({label,children,req}){return<div style={{marginBottom:18}}><div style={{fontSize:13,fontWeight:700,color:C.txt,marginBottom:8}}>{label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}</div>{children}</div>;}
function TxtInp({val,onChange,ph,type="text"}){return<div style={{border:`1px solid ${C.bdr}`,borderRadius:10,background:"#fff",overflow:"hidden"}}><input value={val||""} onChange={e=>onChange(e.target.value)} placeholder={ph} type={type} style={{width:"100%",border:"none",outline:"none",padding:"14px",fontSize:14,fontFamily:C.fn,boxSizing:"border-box"}}/></div>;}
function DropSel({val,onChange,children,ph}){return<div style={{border:`1px solid ${C.bdr}`,borderRadius:10,background:"#fff",position:"relative"}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",padding:"14px",fontSize:14,fontFamily:C.fn,background:"transparent",WebkitAppearance:"none"}}>{ph&&<option value="">{ph}</option>}{children}</select><div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:C.sub,fontSize:10}}>▼</div></div>;}
function StepBar({cur,total=3}){return<div style={{display:"flex",gap:6,marginBottom:24}}>{Array.from({length:total},(_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=cur?C.acc:C.bdr,transition:"0.3s"}}/>)}</div>;}

function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"flex-end",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"24px 24px 0 0",padding:"0 24px 44px",width:"100%",maxHeight:"85vh",overflowY:"auto",maxWidth:480,margin:"0 auto"}}>
        <div style={{width:40,height:5,background:C.bdr,borderRadius:3,margin:"12px auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><span style={{fontWeight:900,fontSize:18}}>{title}</span><button onClick={onClose} style={{background:C.bg,border:"none",width:30,height:30,borderRadius:15,fontSize:14,cursor:"pointer"}}>✕</button></div>
        {children}
      </div>
    </div>
  );
}

// ── 페이지 컴포넌트 ─────────────────────────────────────────────

function DashPage({orders}){
  const delayed = orders.filter(o=>o.status==="지연");
  return(
    <div style={{padding:16}}>
      <div style={{fontSize:22,fontWeight:900,marginBottom:20}}>대시보드</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        <Card st={{textAlign:"center",padding:24}}><div style={{fontSize:12,color:C.sub,marginBottom:8}}>오늘 발주</div><div style={{fontSize:24,fontWeight:900,color:C.acc}}>{orders.filter(o=>o.date===today()).length}건</div></Card>
        <Card st={{textAlign:"center",padding:24}}><div style={{fontSize:12,color:C.sub,marginBottom:8}}>지연 알림</div><div style={{fontSize:24,fontWeight:900,color:C.red}}>{delayed.length}건</div></Card>
      </div>
      <Card><div style={{fontWeight:800,marginBottom:12}}>최근 발주 현황</div>{orders.slice(0,3).map(o=><div key={o.id} style={{fontSize:13,padding:"8px 0",borderBottom:`1px solid ${C.bdr}`}}>{o.date} - <Tag ch={o.status}/></div>)}</Card>
    </div>
  );
}

function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",type:"원단"});
  async function save(){
    if(!f.name) return;
    const data={...f, user_id:user.id};
    const r=await DB.insert(user.token,"vendors",data);
    setVendors([...vendors,Array.isArray(r)?r[0]:data]);
    setSheet(false); setF({name:"",tel:"",type:"원단"});
  }
  return(
    <div style={{padding:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontSize:22,fontWeight:900}}>거래처 관리</div><Btn ch="+ 거래처 추가" sz="s" onClick={()=>setSheet(true)}/></div>
      {vendors.length===0?<div style={{textAlign:"center",padding:60,color:C.sub}}>데이터 로딩 중...</div>:vendors.map(v=><Card key={v.id} st={{marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><div style={{fontWeight:800,fontSize:15,marginBottom:4}}>{v.name}</div><div style={{fontSize:12,color:C.sub}}>{v.tel || "연락처 없음"}</div></div><Tag ch={v.type}/></Card>)}
      {sheet && <Sheet title="새 거래처 등록" onClose={()=>setSheet(false)}><Field label="거래처명" req><TxtInp val={f.name} onChange={v=>setF({...f,name:v})} ph="거래처 이름을 입력하세요"/></Field><Field label="연락처"><TxtInp val={f.tel} onChange={v=>setF({...f,tel:v})} ph="010-0000-0000"/></Field><Field label="유형"><DropSel val={f.type} onChange={v=>setF({...f,type:v})}>{["원단","안감","단추","지퍼","기타"].map(t=><option key={t} value={t}>{t}</option>)}</DropSel></Field><G/><Btn ch="거래처 저장하기" full onClick={save}/></Sheet>}
    </div>
  );
}

function ProdsPage({products,setProducts,user}){
  const [sheet,setSheet]=useState(false);
  const [name,setName]=useState("");
  async function save(){
    if(!name) return;
    const data={name,category:"이너",user_id:user.id};
    const r=await DB.insert(user.token,"products",data);
    setProducts([...products,Array.isArray(r)?r[0]:data]);
    setSheet(false); setName("");
  }
  return(
    <div style={{padding:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontSize:22,fontWeight:900}}>상품 관리</div><Btn ch="+ 상품 등록" sz="s" onClick={()=>setSheet(true)}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{products.map(p=><Card key={p.id} st={{textAlign:"center"}}><div style={{fontWeight:800,marginBottom:8}}>{p.name}</div><Tag ch={p.category} c={CAT_C[p.category]}/></Card>)}</div>
      {sheet && <Sheet title="새 상품 등록" onClose={()=>setSheet(false)}><Field label="상품명" req><TxtInp val={name} onChange={setName} ph="샘플 상품명을 입력하세요"/></Field><G/><Btn ch="상품 저장하기" full onClick={save}/></Sheet>}
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

  async function loadData(token, userId){
    setLoading(true);
    try{
      const [v,p,o]=await Promise.all([DB.list(token,"vendors"),DB.list(token,"products"),DB.list(token,"orders")]);
      // 내 데이터만 필터링해서 보여주기
      const myV = Array.isArray(v)?v.filter(x=>x.user_id===userId):[];
      const myP = Array.isArray(p)?p.filter(x=>x.user_id===userId):[];
      const myO = Array.isArray(o)?o.filter(x=>x.user_id===userId):[];
      setVendors(myV); setProducts(myP); setOrders(myO);
    }catch(e){console.error(e);}
    finally{setLoading(false);}
  }

  useEffect(()=>{
    const s=localStorage.getItem("dworks_session");
    if(s){
      const u=JSON.parse(s);
      if(u?.token){setUser(u);setScreen("app");loadData(u.token, u.id);return;}
    }
    setScreen("auth");
  },[]);

  function handleLogin(u){
    localStorage.setItem("dworks_session",JSON.stringify(u));
    setUser(u); setScreen("app"); loadData(u.token, u.id);
  }

  if(screen==="loading") return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.fn,fontSize:14,color:C.sub}}>데이터 로드 중...</div>;
  if(screen==="auth") return <div style={{padding:60,textAlign:"center",fontFamily:C.fn}}>
    <div style={{fontSize:32,fontWeight:900,color:C.acc,marginBottom:10}}>D-Works</div>
    <div style={{fontSize:14,color:C.sub,marginBottom:40}}>디자인 워커스 발주 시스템</div>
    <Btn ch="시스템 시작하기" full onClick={()=>handleLogin({token:KEY,id:"5da1c316-db3b-4c29-8e5a-e2c7a",name:"민용기"})}/>
  </div>;

  const pages={
    dash:<DashPage orders={orders} products={products}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} user={user}/>,
    vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,
    settings:<div style={{padding:40}}><Card st={{textAlign:"center"}}><strong>{user.name}</strong> 님 안녕하세요<G/><Btn ch="로그아웃" v="w" full onClick={()=>{localStorage.removeItem("dworks_session");window.location.reload();}}/></Card></div>
  };

  const TABS=[{k:"dash",l:"홈",i:"🏠"},{k:"prods",l:"상품",i:"👕"},{k:"vendors",l:"거래처",i:"🏭"},{k:"settings",l:"설정",i:"⚙️"}];

  return(
    <div style={{minHeight:"100vh",background:C.bg,maxWidth:480,margin:"0 auto",position:"relative",fontFamily:C.fn,boxShadow:"0 0 20px rgba(0,0,0,0.05)"}}>
      <div style={{background:"#fff",padding:"16px 20px",borderBottom:`1px solid ${C.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100}}>
        <strong style={{color:C.acc,fontSize:20,letterSpacing:"-0.5px"}} onClick={()=>setPage("dash")}>D-Works</strong>
        <span style={{fontSize:12,fontWeight:600,color:C.sub2}}>{user.name}</span>
      </div>
      <div style={{paddingBottom:100}}>{loading?<p style={{textAlign:"center",padding:40,fontSize:13,color:C.sub}}>최신 데이터를 가져오는 중...</p>:pages[page]}</div>
      <div style={{position:"fixed",bottom:0,width:"100%",maxWidth:480,background:"#fff",display:"flex",borderTop:`1px solid ${C.bdr}`,paddingBottom:10,zIndex:100}}>
        {TABS.map(t=>(
          <button key={t.k} onClick={()=>setPage(t.k)} style={{flex:1,padding:"14px 0",background:"none",border:"none",color:page===t.k?C.acc:C.sub,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <span style={{fontSize:18}}>{t.i}</span>
            <span style={{fontSize:10,fontWeight:700}}>{t.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
