import React, { useState, useEffect } from "react";

// ── 1. 설정 및 API (Supabase 연결) ─────────────────────────────────
const SB="https://qimgostiseehdnvhmoph.supabase.co", KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";
const ah=t=>({"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"});
const api=async(m,p,t,b)=>{const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined});return r.json();};
const DB={signUp:(e,pw,m)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:m}),signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),signOut:t=>fetch(`${SB}/auth/v1/logout`,{method:"POST",headers:ah(t)}),updateUser:(t,m)=>api("PUT","/auth/v1/user",t,{data:m}),list:(t,tb)=>api("GET",`/rest/v1/${tb}?order=created_at.asc`,t),insert:(t,tb,d)=>api("POST",`/rest/v1/${tb}`,t,d),update:(t,tb,id,d)=>api("PATCH",`/rest/v1/${tb}?id=eq.${id}`,t,d),del:(t,tb,id)=>fetch(`${SB}/rest/v1/${tb}?id=eq.${id}`,{method:"DELETE",headers:ah(t)})};

// ── 2. 스타일 및 상수 ────────────────────────────────────────────
const C={bg:"#F8F9FB",card:"#FFFFFF",bdr:"#E8ECF2",acc:"#111827",txt:"#111827",sub:"#9CA3AF",sub2:"#6B7280",ok:"#10B981",red:"#EF4444",fn:"'Noto Sans KR',sans-serif"};
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const match=(t,q)=>{if(!q)return true; return (t||"").toLowerCase().includes(q.toLowerCase());};

// ── 3. 공통 UI 컴포넌트 ─────────────────────────────────────────
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",red:C.red}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,red:"#fff"}[v]||"#fff";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#EDF0F5":bg,color:disabled?"#B0B8C4":cl,border:v==="w"?`1.5px solid ${C.bdr}`:"none",borderRadius:12,padding:sz==="s"?"8px 14px":"14px 0",fontSize:sz==="s"?12:14,fontWeight:700,cursor:"pointer",fontFamily:C.fn,width:full?"100%":"auto",display:"inline-flex",alignItems:"center",justifyContent:"center",...st}}>{ch}</button>;
};
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:"#fff",borderRadius:20,border:`1px solid ${C.bdr}`,padding:20,boxSizing:"border-box",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.02)",...st}}>{children}</div>;
const Field=({label,children,req})=><div style={{marginBottom:18}}><div style={{fontSize:13,fontWeight:700,color:C.txt,marginBottom:8}}>{label}{req&&<span style={{color:C.red}}> *</span>}</div>{children}</div>;
const TxtInp=({val,onChange,ph,type="text"})=><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} style={{width:"100%",border:`1.5px solid ${C.bdr}`,borderRadius:10,padding:"13px 15px",fontSize:14,boxSizing:"border-box",fontFamily:C.fn,outline:"none"}}/>;
const Tag=({ch,c=C.acc})=><span style={{background:c+"12",color:c,padding:"3px 9px",borderRadius:6,fontSize:11,fontWeight:800}}>{ch}</span>;
const Divider=()=><div style={{height:1,background:C.bdr,margin:"16px 0"}}/>;

function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"28px 28px 0 0",padding:"0 20px 40px",width:"100%",maxHeight:"88vh",overflowY:"auto",boxSizing:"border-box",maxWidth:480,margin:"0 auto"}}>
        <div style={{width:36,height:4,background:C.bdr,borderRadius:2,margin:"12px auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><span style={{fontWeight:800,fontSize:19}}>{title}</span><button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:8,width:30,height:30,fontSize:16}}>✕</button></div>
        {children}
      </div>
    </div>
  );
}

// ── 4. 페이지 컴포넌트 ────────────────────────────────────────

// [대시보드] 데이터 연동 및 시안 디자인
function DashPage({orders,products}){
  const td=today();
  const tO=orders.filter(o=>o.date===td);
  const delayed=orders.filter(o=>o.status==="지연");
  const mQ=orders.filter(o=>o.date?.slice(0,7)===td.slice(0,7)).reduce((s,o)=>(o.items||[]).reduce((ss,it)=>ss+(it.qty||0),s),0);

  return(
    <div style={{padding:"20px 16px 80px"}}>
      <div style={{fontSize:22,fontWeight:900,textAlign:"center",marginBottom:24}}>대시 보드</div>
      <div style={{display:"flex",gap:12,marginBottom:16}}>
        <Card st={{flex:1,textAlign:"center",padding:"24px 10px"}}><div style={{color:"#3772FF",fontSize:26,fontWeight:900}}>{tO.length}건</div><div style={{fontSize:12,color:C.sub,marginTop:6,fontWeight:600}}>오늘 발주</div></Card>
        <Card st={{flex:1,textAlign:"center",padding:"24px 10px"}}><div style={{color:C.red,fontSize:26,fontWeight:900}}>{delayed.length}건</div><div style={{fontSize:12,color:C.sub,marginTop:6,fontWeight:600}}>미출고 발주</div></Card>
      </div>
      <Card st={{textAlign:"center",padding:"28px"}}><div style={{color:C.ok,fontSize:30,fontWeight:900}}>{fmtN(mQ)}매</div><div style={{fontSize:13,color:C.sub,marginTop:8,fontWeight:600}}>이달 누적 발주량</div></Card>
      {delayed.length>0 && <Card><div style={{fontWeight:800,marginBottom:12}}>⚠️ 빠른 확인 필요</div>{delayed.slice(0,3).map((o,i)=><div key={i} style={{fontSize:13,padding:"10px 0",borderBottom:i<2?`1px solid ${C.bdr}`:"none",display:'flex',justifyContent:'space-between'}}><span>{o.date} 발주건</span><Tag ch="지연" c={C.red}/></div>)}</Card>}
    </div>
  );
}

// [상품관리] BOM 등록 버튼 및 상세 항목 완벽 복구
function ProdsPage({products,setProducts,vendors,factories,user}){
  const [sheet,setSheet]=useState(false);
  const [step,setStep]=useState(0);
  const [selColor,setSelColor]=useState("");
  const [f,setF]=useState({name:"",category:"이너",season:"26SS",factoryId:"",colors:[],colorBom:{},imageUrl:""});
  const [ci,setCi]=useState("");
  const [br,setBr]=useState({mat:"",amt:"",vid:"",type:"원단"});
  const [vSearch,setVSearch]=useState("");

  const openAdd=()=>{setF({name:"",category:"이너",season:"26SS",factoryId:"",colors:[],colorBom:{},imageUrl:""});setStep(0);setSheet(true);};
  const addColor=()=>{if(!ci||f.colors.includes(ci))return; setF(p=>({...p,colors:[...p.colors,ci],colorBom:{...p.colorBom,[ci]:[]}})); setCi("");};
  const addBom=()=>{
    if(!br.mat||!br.amt||!br.vid) return alert("거래처와 원부자재 정보를 모두 입력하세요");
    const nb={...br,id:uid(),amt:Number(br.amt),unit:br.type==="단추"?"개":"yd"};
    setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:[...(p.colorBom[selColor]||[]),nb]}}));
    setBr({mat:"",amt:"",vid:"",type:"원단"});setVSearch("");
  };

  async function save(){
    if(!f.name||!f.colors.length) return alert("상품명과 색상을 입력해 주세요.");
    const data={...f, user_id:user.id, color_bom:f.colorBom, factory_id:f.factoryId};
    if(f.id){ await DB.update(user.token,"products",f.id,data); setProducts(ps=>ps.map(p=>p.id===f.id?{...f}:p)); }
    else { const r=await DB.insert(user.token,"products",data); setProducts(ps=>[...ps, r[0]]); }
    setSheet(false);
  }

  return(
    <div style={{padding:"20px 16px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontSize:20,fontWeight:900}}>상품 관리</div><Btn ch="+ 추가" sz="s" onClick={openAdd}/></div>
      {products.map(p=><Card key={p.id} onClick={()=>{setF(p);setStep(0);setSheet(true);}}><div style={{display:'flex',justifyContent:'space-between'}}><div><div style={{fontWeight:800,fontSize:16}}>{p.name}</div><div style={{fontSize:12,color:C.sub,marginTop:6}}>{(p.colors||[]).join(", ")}</div></div><Tag ch={p.season}/></div></Card>)}
      
      {sheet && <Sheet title={f.id?"상품 수정":"새 상품 등록"} onClose={()=>setSheet(false)}>
        <div style={{display:"flex",gap:6,marginBottom:20}}><div style={{flex:1,height:4,background:C.acc,borderRadius:2}}/><div style={{flex:1,height:4,background:step===1?C.acc:C.bdr,borderRadius:2}}/></div>
        {step===0 ? <>
          <Field label="상품명" req><TxtInp val={f.name} onChange={v=>setF(p=>({...p,name:v}))} ph="로얄 스트라이프 셔츠"/></Field>
          <Field label="공장 지정"><select value={f.factoryId} onChange={e=>setF(p=>({...p,factoryId:e.target.value}))} style={{width:"100%",padding:13,borderRadius:10,border:`1.5px solid ${C.bdr}`,fontFamily:C.fn}}><option value="">공장 선택</option>{factories.map(fc=><option key={fc.id} value={fc.id}>{fc.name}</option>)}</select></Field>
          <Field label="색상 추가"><div style={{display:"flex",gap:8}}><TxtInp val={ci} onChange={setCi} ph="예: 네이비"/><button onClick={addColor} style={{background:C.acc,color:"#fff",padding:"0 18px",borderRadius:10,border:"none",fontWeight:700}}>추가</button></div></Field>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>{f.colors.map(c=><span key={c} style={{background:C.bg,padding:"6px 12px",borderRadius:8,fontSize:13,fontWeight:700,border:`1px solid ${C.bdr}`}}>{c}</span>)}</div>
          <Btn ch="다음: 원부자재(BOM) 등록" full onClick={()=>{if(!f.colors.length)return alert("색상을 먼저 추가하세요");setSelColor(f.colors[0]);setStep(1);}}/>
        </> : <>
          <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto"}}>{f.colors.map(c=><button key={c} onClick={()=>setSelColor(c)} style={{padding:"10px 18px",borderRadius:20,border:`2px solid ${selColor===c?C.acc:C.bdr}`,background:selColor===c?C.acc:"#fff",color:selColor===c?"#fff":C.sub2,fontWeight:700,whiteSpace:'nowrap'}}>{c}</button>)}</div>
          <div style={{background:C.bg,padding:18,borderRadius:20,marginBottom:20,border:`1px solid ${C.bdr}`}}>
            <div style={{fontWeight:800,marginBottom:12,fontSize:15}}>[{selColor}] 원부자재 리스트</div>
            {(f.colorBom[selColor]||[]).map(b=><div key={b.id} style={{fontSize:13,marginBottom:8,display:'flex',justifyContent:'space-between'}}><span>• {b.mat} ({fmtN(b.amt)}{b.unit})</span><button onClick={()=>{setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:p.colorBom[selColor].filter(x=>x.id!==b.id)}}))}} style={{border:'none',background:'none',color:C.red}}>✕</button></div>)}
            <Divider/>
            <div style={{position:"relative",marginBottom:8}}><TxtInp val={vSearch} onChange={setVSearch} ph="거래처 검색(업체명)"/>{vSearch&&!br.vid&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",zIndex:99,border:`1px solid ${C.bdr}`,borderRadius:10,boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}>{vendors.filter(v=>v.name.includes(vSearch)).map(v=><div key={v.id} onClick={()=>{setBr(p=>({...p,vid:v.id}));setVSearch(v.name);}} style={{padding:14,borderBottom:`1px solid ${C.bg}`}}>{v.name} ({v.type})</div>)}</div>}</div>
            <TxtInp val={br.mat} onChange={v=>setBr(p=>({...p,mat:v}))} ph="원부자재 명칭"/>
            <div style={{display:"flex",gap:8,marginTop:8}}><TxtInp val={br.amt} onChange={v=>setBr(p=>({...p,amt:v}))} ph="소요량" type="number"/><Btn ch="+ 추가" sz="s" onClick={addBom}/></div>
          </div>
          <div style={{display:"flex",gap:10}}><Btn ch="이전" v="w" full onClick={()=>setStep(0)}/><Btn ch="상품 저장 완료" full onClick={save}/></div>
        </>}
      </Sheet>}
    </div>
  );
}

// [설정] 프로필 브랜드명 및 공장 계좌번호 항목 복구
function SettingsPage({user,setUser,factories,setFactories,onLogout}){
  const [facSheet,setFacSheet]=useState(null);
  const [pfSheet,setPfSheet]=useState(false);
  const [pf,setPf]=useState({name:user.name,brand:user.brand,tel:user.tel,position:user.position});

  async function savePf(){
    const r=await fetch(`${SB}/auth/v1/user`,{method:"PUT",headers:ah(user.token),body:JSON.stringify({data:pf})});
    if(r.ok){ setUser(u=>({...u,...pf})); setPfSheet(false); alert("프로필이 수정되었습니다."); }
  }
  async function saveFac(){
    if(!facSheet.name) return alert("공장명을 입력하세요");
    if(facSheet.id){ await DB.update(user.token,"factories",facSheet.id,facSheet); setFactories(fs=>fs.map(f=>f.id===facSheet.id?facSheet:f)); }
    else { const r=await DB.insert(user.token,"factories",{...facSheet,user_id:user.id}); setFactories(fs=>[...fs,r[0]]); }
    setFacSheet(null);
  }

  return(
    <div style={{padding:"20px 16px 80px"}}>
      <div style={{fontSize:20,fontWeight:900,marginBottom:24}}>환경 설정</div>
      <Card st={{background:C.acc,color:"#fff",padding:"32px 24px"}}>
        <div style={{fontSize:14,opacity:0.7,marginBottom:6}}>{user.company}</div>
        <div style={{fontSize:24,fontWeight:900,marginBottom:20}}>{user.brand} · {user.name} <span style={{fontSize:14,fontWeight:400}}>{user.position}</span></div>
        <Btn ch="계정 정보 수정" v="w" sz="s" st={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"none"}} onClick={()=>setPfSheet(true)}/>
      </Card>
      
      <div style={{fontWeight:800,fontSize:16,marginTop:32,marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>🏭 공장 정보 관리 <button onClick={()=>setFacSheet({name:"",bizNo:"",address:"",tel:"",account:""})} style={{fontSize:13,color:C.acc,background:'none',border:'none',fontWeight:700}}>+ 추가</button></div>
      {factories.map(fc=><Card key={fc.id} onClick={()=>setFacSheet(fc)}><div style={{fontWeight:800,fontSize:15}}>{fc.name}</div><div style={{fontSize:12,color:C.sub,marginTop:6}}>📍 {fc.address || "주소 미등록"}</div></Card>)}
      
      <Btn ch="로그아웃" v="red" full onClick={onLogout} st={{marginTop:20,borderRadius:16,height:55}}/>

      {pfSheet && <Sheet title="계정 정보 수정" onClose={()=>setPfSheet(false)}>
        <Field label="브랜드명" req><TxtInp val={pf.brand} onChange={v=>setPf(p=>({...p,brand:v}))}/></Field>
        <Field label="성함" req><TxtInp val={pf.name} onChange={v=>setPf(p=>({...p,name:v}))}/></Field>
        <Field label="직함"><TxtInp val={pf.position} onChange={v=>setPf(p=>({...p,position:v}))}/></Field>
        <Field label="연락처" req><TxtInp val={pf.tel} onChange={v=>setPf(p=>({...p,tel:v}))}/></Field>
        <Btn ch="저장하기" full onClick={savePf}/>
      </Sheet>}

      {facSheet && <Sheet title="공장 상세 정보" onClose={()=>setFacSheet(null)}>
        <Field label="공장명" req><TxtInp val={facSheet.name} onChange={v=>setFacSheet(p=>({...p,name:v}))}/></Field>
        <Field label="사업자등록번호"><TxtInp val={facSheet.bizNo} onChange={v=>setFacSheet(p=>({...p,bizNo:v}))}/></Field>
        <Field label="주소"><TxtInp val={facSheet.address} onChange={v=>setFacSheet(p=>({...p,address:v}))}/></Field>
        <Field label="계좌번호 (발주서 포함)"><TxtInp val={facSheet.account} onChange={v=>setFacSheet(p=>({...p,account:v}))} ph="은행명 000-00-00000 예금주"/></Field>
        <Field label="연락처"><TxtInp val={facSheet.tel} onChange={v=>setFacSheet(p=>({...p,tel:v}))}/></Field>
        <div style={{display:'flex',gap:10}}>{facSheet.id && <Btn ch="삭제" v="red" full onClick={async()=>{if(window.confirm("삭제하시겠습니까?")){await DB.del(user.token,"factories",facSheet.id); setFactories(fs=>fs.filter(x=>x.id!==facSheet.id)); setFacSheet(null);}}}/>} <Btn ch="공장 정보 저장" full onClick={saveFac}/></div>
      </Sheet>}
    </div>
  );
}

// [기타] 발주리스트 및 거래처는 기존 원본 규격 유지
function ListPage({orders}){
  return(
    <div style={{padding:"20px 16px 80px"}}>
      <div style={{fontSize:20,fontWeight:900,marginBottom:20}}>발주 리스트</div>
      {orders.length===0 ? <div style={{textAlign:'center',padding:'100px 0',color:C.sub}}>발주 내역이 없습니다.</div> : orders.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(o=>(
        <Card key={o.id}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:800,fontSize:15}}>{o.date} 발주</div><div style={{fontSize:12,color:C.sub,marginTop:6}}>{(o.items||[]).length}개 품목 진행</div></div><Tag ch={o.status} c={o.status==="지연"?C.red:C.ok}/></div></Card>
      ))}
    </div>
  );
}

function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",address:"",email:"",type:"원단"});
  async function save(){
    if(!f.name||!f.tel) return alert("이름과 연락처는 필수입니다.");
    if(f.id){ await DB.update(user.token,"vendors",f.id,f); setVendors(vs=>vs.map(v=>v.id===f.id?f:v)); }
    else { const r=await DB.insert(user.token,"vendors",{...f,user_id:user.id}); setVendors(vs=>[...vs,r[0]]); }
    setSheet(false);
  }
  return(
    <div style={{padding:"20px 16px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontSize:20,fontWeight:900}}>거래처 관리</div><button onClick={()=>{setF({name:"",tel:"",address:"",email:"",type:"원단"});setSheet(true);}} style={{background:C.acc,color:'#fff',border:'none',padding:'8px 16px',borderRadius:10,fontWeight:700}}>+ 추가</button></div>
      {vendors.map(v=><Card key={v.id} onClick={()=>{setF(v);setSheet(true);}}><div style={{fontWeight:800,fontSize:15}}>{v.name} <Tag ch={v.type} c="#FF8A00"/></div><div style={{fontSize:12,color:C.sub,marginTop:6}}>📱 {v.tel}</div></Card>)}
      {sheet && <Sheet title="거래처 정보" onClose={()=>setSheet(false)}>
        <Field label="거래처명" req><TxtInp val={f.name} onChange={v=>setF(p=>({...p,name:v}))}/></Field>
        <Field label="연락처" req><TxtInp val={f.tel} onChange={v=>setF(p=>({...p,tel:v}))}/></Field>
        <Field label="주소" req><TxtInp val={f.address} onChange={v=>setF(p=>({...p,address:v}))}/></Field>
        <Field label="이메일"><TxtInp val={f.email} onChange={v=>setF(p=>({...p,email:v}))}/></Field>
        <Btn ch="거래처 저장" full onClick={save}/>
      </Sheet>}
    </div>
  );
}

// ── 5. 메인 앱 (App) ───────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("loading");
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dash");
  const [vendors,setVendors]=useState([]);
  const [factories,setFactories]=useState([]);
  const [products,setProducts]=useState([]);
  const [orders,setOrders]=useState([]);

  async function loadData(token){
    try{
      const [v,f,p,o]=await Promise.all([DB.list(token,"vendors"),DB.list(token,"factories"),DB.list(token,"products"),DB.list(token,"orders")]);
      setVendors(Array.isArray(v)?v:[]); setFactories(Array.isArray(f)?f:[]);
      setProducts(Array.isArray(p)?p.map(x=>({...x,colorBom:x.color_bom||{}})):[]);
      setOrders(Array.isArray(o)?o:[]); setScreen("app");
    }catch(e){ setScreen("auth"); }
  }

  useEffect(()=>{
    const s=localStorage.getItem("dworks_session");
    if(s){ try{const u=JSON.parse(s); setUser(u); loadData(u.token);}catch{setScreen("auth");} }
    else setScreen("auth");
  },[]);

  async function handleLogin(u,keep){ if(keep)localStorage.setItem("dworks_session",JSON.stringify(u)); setUser(u); loadData(u.token); }
  function handleLogout(){ localStorage.removeItem("dworks_session"); setUser(null); setScreen("auth"); }

  if(screen==="loading") return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.fn,fontWeight:700}}>WTMT 로딩 중...</div>;
  if(screen==="auth"||!user) return <AuthPage onLogin={handleLogin}/>;

  const pages={
    dash:<DashPage orders={orders} products={products}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} factories={factories} user={user}/>,
    list:<ListPage orders={orders}/>,
    vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,
    settings:<SettingsPage user={user} setUser={setUser} factories={factories} setFactories={setFactories} onLogout={handleLogout}/>,
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,maxWidth:480,margin:"0 auto",position:"relative",boxShadow:"0 0 40px rgba(0,0,0,0.1)"}}>
      {/* 상단바 */}
      <div style={{background:"#fff",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${C.bdr}`}}>
        <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:22,cursor:"pointer",letterSpacing:'-0.5px'}}>WTMT</button>
        <span style={{fontSize:12,fontWeight:800,color:C.sub2}}>{user.brand || user.name}</span>
      </div>
      
      {/* 페이지 로드 */}
      <div style={{minHeight:'calc(100vh - 140px)'}}>{pages[page]}</div>
      
      {/* 하단 박스 메뉴 (중앙 정렬) */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:`1px solid ${C.bdr}`,display:"flex",height:70,zIndex:50}}>
        {[
          {k:"dash",l:"대시보드"},{k:"prods",l:"상품관리"},{k:"list",l:"발주리스트"},{k:"vendors",l:"거래처"},{k:"settings",l:"설정"}
        ].map(t=>(
          <button key={t.k} onClick={()=>setPage(t.k)} style={{
            flex:1, background:page===t.k?"#f0f2f5":"none", border:"none", borderRight:t.k!=="settings"?`1px solid ${C.bdr}`:"none", color:page===t.k?C.acc:C.sub2, fontWeight:page===t.k?800:600, fontSize:12, transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center"
          }}>{t.l}</button>
        ))}
      </div>
    </div>
  );
}
