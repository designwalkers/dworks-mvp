import React, { useState, useEffect } from "react";

// ── 1. API 및 설정 ─────────────────────────────────
const SB="https://qimgostiseehdnvhmoph.supabase.co", KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";
const ah=t=>({"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"});
const api=async(m,p,t,b)=>{try{const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined}); return r.json();}catch{return {error:true};}};
const DB={signUp:(e,pw,m)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:m}),signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),signOut:t=>fetch(`${SB}/auth/v1/logout`,{method:"POST",headers:ah(t)}),updateUser:(t,m)=>api("PUT","/auth/v1/user",t,{data:m}),list:(t,tb)=>api("GET",`/rest/v1/${tb}?order=created_at.asc`,t),insert:(t,tb,d)=>api("POST",`/rest/v1/${tb}`,t,d),update:(t,tb,id,d)=>api("PATCH",`/rest/v1/${tb}?id=eq.${id}`,t,d),del:(t,tb,id)=>fetch(`${SB}/rest/v1/${tb}?id=eq.${id}`,{method:"DELETE",headers:ah(t)})};

// ── 2. 스타일 및 상수 ────────────────────────────────────────────
const C={bg:"#F8F9FB",card:"#FFFFFF",bdr:"#E8ECF2",acc:"#3772FF",txt:"#111827",sub:"#9CA3AF",sub2:"#6B7280",ok:"#10B981",red:"#EF4444",fn:"'Noto Sans KR',sans-serif"};
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const match=(t,q)=>{if(!q)return true; return (t||"").toLowerCase().includes(q.toLowerCase());};
const CATS=["이너","아우터","팬츠","니트","원피스","스커트","기타"];

// ── 3. 공통 UI ──────────────────────────────────────────────────
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",red:C.red}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,red:"#fff"}[v]||"#fff";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#EDF0F5":bg,color:disabled?"#B0B8C4":cl,border:v==="w"?`1.5px solid ${C.bdr}`:"none",borderRadius:12,padding:sz==="s"?"8px 14px":"14px 0",fontSize:sz==="s"?12:14,fontWeight:700,cursor:"pointer",fontFamily:C.fn,width:full?"100%":"auto",display:"inline-flex",alignItems:"center",justifyContent:"center",...st}}>{ch}</button>;
};
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:"#fff",borderRadius:20,border:`1px solid ${C.bdr}`,padding:20,boxSizing:"border-box",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.02)",...st}}>{children}</div>;
const Field=({label,children,req})=><div style={{marginBottom:18}}><div style={{fontSize:13,fontWeight:700,color:C.txt,marginBottom:8}}>{label}{req&&<span style={{color:C.red}}> *</span>}</div>{children}</div>;
const TxtInp=({val,onChange,ph,type="text"})=><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} style={{width:"100%",border:`1.5px solid ${C.bdr}`,borderRadius:10,padding:"13px 15px",fontSize:14,boxSizing:"border-box",fontFamily:C.fn,outline:"none"}}/>;
const Tag=({ch,c=C.acc})=><span style={{background:c+"12",color:c,padding:"3px 9px",borderRadius:6,fontSize:11,fontWeight:800}}>{ch}</span>;

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

// [그래프 컴포넌트]
function LineChart({data}){
  if(!data||data.length<2)return<div style={{height:100,display:"flex",alignItems:"center",justifyContent:"center",color:C.sub,fontSize:12}}>데이터 수집 중...</div>;
  const W=300,H=80,p=10,vs=data.map(d=>d.v),mn=Math.min(...vs),mx=Math.max(...vs),rng=mx-mn||1;
  const pts=data.map((d,i)=>[(p+(i/(data.length-1))*(W-p*2)),(H-p-((d.v-mn)/rng)*(H-p*2))]);
  const area=`M ${pts[0][0]},${H-p} ${pts.map(([x,y])=>`L ${x},${y}`).join(" ")} L ${pts[pts.length-1][0]},${H-p} Z`;
  return<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:100}}><path d={area} fill={C.acc+"12"}/><polyline points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke={C.acc} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>{pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="4" fill={C.acc}/>)}</svg>;
}

// ── 4. 페이지 컴포넌트 ────────────────────────────────────────

// [대시보드] 오늘 발주 / 지연 발주 / 이달 수량 / 지연 내역 / 그래프
function DashPage({orders=[], products=[]}){
  const td=today();
  const tO=orders.filter(o=>o.date===td);
  const delayed=orders.filter(o=>o.status==="지연");
  const mQ=orders.filter(o=>o.date?.slice(0,7)===td.slice(0,7)).reduce((s,o)=>(o.items||[]).reduce((ss,it)=>ss+(it.qty||0),s),0);
  
  // 그래프용 데이터 (최근 7일)
  const chartData=Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(6-i));
    const ds=d.toISOString().slice(0,10);
    return { label:ds.slice(5), v:orders.filter(o=>o.date===ds).reduce((s,o)=>(o.items||[]).reduce((ss,it)=>ss+(it.qty||0),s),0) };
  });

  return(
    <div style={{padding:"14px 16px 100px"}}>
      <div style={{fontSize:22,fontWeight:900,textAlign:"center",margin:"10px 0 24px"}}>대시 보드</div>
      
      {/* 3대 지표 */}
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <Card st={{flex:1,textAlign:"center",padding:"20px 10px"}}><div style={{color:C.acc,fontSize:22,fontWeight:900}}>{tO.length}건</div><div style={{fontSize:11,color:C.sub,marginTop:6,fontWeight:600}}>오늘 발주</div></Card>
        <Card st={{flex:1,textAlign:"center",padding:"20px 10px"}}><div style={{color:C.red,fontSize:22,fontWeight:900}}>{delayed.length}건</div><div style={{fontSize:11,color:C.sub,marginTop:6,fontWeight:600}}>지연 발주</div></Card>
        <Card st={{flex:1,textAlign:"center",padding:"20px 10px"}}><div style={{color:C.ok,fontSize:22,fontWeight:900}}>{fmtN(mQ)}매</div><div style={{fontSize:11,color:C.sub,marginTop:6,fontWeight:600}}>이달 수량</div></Card>
      </div>

      {/* 지연 발주 내역 */}
      <Card>
        <div style={{fontWeight:800,marginBottom:14,fontSize:15}}>⚠️ 지연 내역</div>
        {delayed.length===0 ? <div style={{textAlign:'center',padding:'20px 0',color:C.sub,fontSize:13}}>지연된 발주가 없습니다.</div> : <>
          <div style={{display:'flex',fontSize:11,color:C.sub,paddingBottom:8,borderBottom:`1px solid ${C.bdr}`,marginBottom:8,fontWeight:700}}>
            <div style={{flex:2}}>상품명</div><div style={{width:60,textAlign:'center'}}>색상</div><div style={{width:50,textAlign:'right'}}>수량</div>
          </div>
          {delayed.flatMap(o=>(o.items||[]).map((it,idx)=>{
            const p=products.find(x=>x.id===it.pid);
            return (
              <div key={idx} style={{display:'flex',fontSize:13,padding:'10px 0',borderBottom:`1px solid ${C.bg}`,alignItems:'center'}}>
                <div style={{flex:2,fontWeight:700}}>{p?.name || "삭제된 상품"}</div>
                <div style={{width:60,textAlign:'center',color:C.sub2}}>{it.color}</div>
                <div style={{width:50,textAlign:'right',fontWeight:800,color:C.red}}>{fmtN(it.qty)}</div>
              </div>
            );
          }))}
        </>}
      </Card>

      {/* 발주량 추이 그래프 */}
      <Card>
        <div style={{fontWeight:800,marginBottom:16,fontSize:15}}>📈 발주량 추이</div>
        <LineChart data={chartData}/>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:10}}>
          {chartData.map(d=><span key={d.label} style={{fontSize:9,color:C.sub,fontWeight:600}}>{d.label}</span>)}
        </div>
      </Card>
    </div>
  );
}

// [상품관리] 카테고리 + 원부자재(BOM) 복구
function ProdsPage({products=[],setProducts,vendors=[],factories=[],user}){
  const [sheet,setSheet]=useState(false);
  const [step,setStep]=useState(0);
  const [selColor,setSelColor]=useState("");
  const [f,setF]=useState({name:"",category:"이너",colors:[],colorBom:{},factoryId:""});
  const [ci,setCi]=useState("");
  const [br,setBr]=useState({mat:"",amt:"",vid:"",type:"원단"});
  const [vSearch,setVSearch]=useState("");

  const addColor=()=>{if(!ci||f.colors.includes(ci))return; setF(p=>({...p,colors:[...p.colors,ci],colorBom:{...p.colorBom,[ci]:[]}})); setCi("");};
  const addBom=()=>{
    if(!br.mat||!br.amt||!br.vid) return alert("항목을 모두 입력하세요");
    const nb={...br,id:uid(),amt:Number(br.amt),unit:br.type==="단추"?"개":"yd"};
    setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:[...(p.colorBom[selColor]||[]),nb]}}));
    setBr({mat:"",amt:"",vid:"",type:"원단"});setVSearch("");
  };
  async function save(){
    const data={...f, user_id:user.id, color_bom:f.colorBom, factory_id:f.factoryId};
    if(f.id){ await DB.update(user.token,"products",f.id,data); setProducts(ps=>ps.map(p=>p.id===f.id?{...f}:p)); }
    else { const r=await DB.insert(user.token,"products",data); setProducts(ps=>[...ps, r[0]]); }
    setSheet(false);
  }
  return(
    <div style={{padding:"20px 16px 100px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div style={{fontSize:20,fontWeight:900}}>상품 관리</div><Btn ch="+ 추가" sz="s" onClick={()=>{setF({name:"",category:"이너",colors:[],colorBom:{},factoryId:""});setStep(0);setSheet(true);}}/></div>
      {products.map(p=><Card key={p.id} onClick={()=>{setF(p);setStep(0);setSheet(true);}}><div style={{display:'flex',justifyContent:'space-between'}}><div><div style={{fontWeight:800}}>{p.name}</div><Tag ch={p.category}/></div></div></Card>)}
      {sheet && <Sheet title="상품 정보" onClose={()=>setSheet(false)}>
        {step===0 ? <>
          <Field label="상품명" req><TxtInp val={f.name} onChange={v=>setF(p=>({...p,name:v}))}/></Field>
          <Field label="카테고리" req><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{CATS.map(c=><button key={c} onClick={()=>setF(p=>({...p,category:c}))} style={{padding:"8px 14px",borderRadius:10,border:`2px solid ${f.category===c?C.acc:C.bdr}`,background:f.category===c?C.acc:"#fff",color:f.category===c?"#fff":C.sub2,fontWeight:700}}>{c}</button>)}</div></Field>
          <Field label="색상 추가"><div style={{display:"flex",gap:8}}><TxtInp val={ci} onChange={setCi}/><button onClick={addColor} style={{background:C.acc,color:"#fff",padding:"0 15px",borderRadius:10,border:"none"}}>추가</button></div></Field>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>{f.colors.map(c=><Tag key={c} ch={c}/>)}</div>
          <Btn ch="다음: 원부자재 등록" full onClick={()=>{if(!f.colors.length)return;setSelColor(f.colors[0]);setStep(1);}}/>
        </> : <>
          <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto"}}>{f.colors.map(c=><button key={c} onClick={()=>setSelColor(c)} style={{padding:"10px 18px",borderRadius:20,border:`2px solid ${selColor===c?C.acc:C.bdr}`,background:selColor===c?C.acc:"#fff",color:selColor===c?"#fff":C.sub2,fontWeight:700}}>{c}</button>)}</div>
          <div style={{background:C.bg,padding:16,borderRadius:16,marginBottom:20}}>
            <div style={{fontWeight:800,marginBottom:12}}>[{selColor}] 원부자재 목록</div>
            {(f.colorBom[selColor]||[]).map(b=><div key={b.id} style={{fontSize:13,marginBottom:6}}>• {b.mat} / {b.amt}{b.unit}</div>)}
            <div style={{marginTop:12,borderTop:`1px dashed ${C.bdr}`,paddingTop:12}}>
              <div style={{position:"relative",marginBottom:8}}><TxtInp val={vSearch} onChange={setVSearch} ph="공급업체 검색"/>{vSearch&&!br.vid&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",zIndex:99,border:`1px solid ${C.bdr}`}}>{vendors.filter(v=>v.name.includes(vSearch)).map(v=><div key={v.id} onClick={()=>{setBr(p=>({...p,vid:v.id}));setVSearch(v.name);}} style={{padding:12}}>{v.name}</div>)}</div>}</div>
              <TxtInp val={br.mat} onChange={v=>setBr(p=>({...p,mat:v}))} ph="원부자재명"/>
              <div style={{display:"flex",gap:8,marginTop:8}}><TxtInp val={br.amt} onChange={v=>setBr(p=>({...p,amt:v}))} ph="수량" type="number"/><Btn ch="+ 추가" sz="s" onClick={addBom}/></div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}><Btn ch="이전" v="w" full onClick={()=>setStep(0)}/><Btn ch="상품 저장" full onClick={save}/></div>
        </>}
      </Sheet>}
    </div>
  );
}

// [설정] 공장 상세 항목 복구
function SettingsPage({user,setUser,factories=[],setFactories,onLogout}){
  const [facSheet,setFacSheet]=useState(null);
  const [pfSheet,setPfSheet]=useState(false);
  const [pf,setPf]=useState({name:user.name,brand:user.brand,tel:user.tel});

  async function savePf(){
    const r=await fetch(`${SB}/auth/v1/user`,{method:"PUT",headers:ah(user.token),body:JSON.stringify({data:pf})});
    if(r.ok){ setUser(u=>({...u,...pf})); setPfSheet(false); alert("수정 완료"); }
  }
  async function saveFac(){
    if(facSheet.id){ await DB.update(user.token,"factories",facSheet.id,facSheet); setFactories(fs=>fs.map(f=>f.id===facSheet.id?facSheet:f)); }
    else { const r=await DB.insert(user.token,"factories",{...facSheet,user_id:user.id}); setFactories(fs=>[...fs,r[0]]); }
    setFacSheet(null);
  }
  return(
    <div style={{padding:"20px 16px 100px"}}>
      <div style={{fontSize:20,fontWeight:900,marginBottom:24}}>설정</div>
      <Card st={{background:C.acc,color:"#fff"}}>
        <div style={{fontSize:22,fontWeight:900}}>{user.brand} · {user.name}</div>
        <Btn ch="수정" v="w" sz="s" st={{marginTop:16,background:"rgba(255,255,255,0.2)",color:"#fff",border:"none"}} onClick={()=>setPfSheet(true)}/>
      </Card>
      <div style={{fontWeight:800,marginTop:30,marginBottom:12}}>🏭 공장 관리</div>
      {factories.map(fc=><Card key={fc.id} onClick={()=>setFacSheet(fc)}><div style={{fontWeight:700}}>{fc.name}</div></Card>)}
      <Btn ch="+ 새 공장 등록" full v="w" onClick={()=>setFacSheet({name:"",bizNo:"",address:"",tel:"",account:""})}/>
      <Btn ch="로그아웃" v="red" full onClick={onLogout} st={{marginTop:40}}/>

      {pfSheet && <Sheet title="내 정보 수정" onClose={()=>setPfSheet(false)}>
        <Field label="브랜드명"><TxtInp val={pf.brand} onChange={v=>setPf(p=>({...p,brand:v}))}/></Field>
        <Field label="성함"><TxtInp val={pf.name} onChange={v=>setPf(p=>({...p,name:v}))}/></Field>
        <Field label="연락처"><TxtInp val={pf.tel} onChange={v=>setPf(p=>({...p,tel:v}))}/></Field>
        <Btn ch="저장" full onClick={savePf}/>
      </Sheet>}
      {facSheet && <Sheet title="공장 정보" onClose={()=>setFacSheet(null)}>
        <Field label="공장명" req><TxtInp val={facSheet.name} onChange={v=>setFacSheet(p=>({...p,name:v}))}/></Field>
        <Field label="사업자등록번호"><TxtInp val={facSheet.bizNo} onChange={v=>setFacSheet(p=>({...p,bizNo:v}))}/></Field>
        <Field label="계좌번호"><TxtInp val={facSheet.account} onChange={v=>setFacSheet(p=>({...p,account:v}))}/></Field>
        <Field label="주소"><TxtInp val={facSheet.address} onChange={v=>setFacSheet(p=>({...p,address:v}))}/></Field>
        <Btn ch="저장" full onClick={saveFac}/>
      </Sheet>}
    </div>
  );
}

// [공통] 로그인 외 나머지 페이지 기본
function OrderPage(){ return <div style={{padding:20}}>발주하기 준비 중</div>; }
function ListPage({orders=[]}){ return <div style={{padding:20}}>발주 리스트 ({orders.length}건)</div>; }
function VendorPage({vendors=[]}){ return <div style={{padding:20}}>거래처 관리 ({vendors.length}곳)</div>; }

// ── 5. 메인 앱 (Root) ───────────────────────────────────────────────
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
      setVendors(Array.isArray(v)?v:[]); setFactories(Array.isArray(f)?f:[]); setProducts(Array.isArray(p)?p:[]); setOrders(Array.isArray(o)?o:[]);
      setScreen("app");
    }catch(e){setScreen("auth");}
  }

  useEffect(()=>{
    const s=localStorage.getItem("dworks_session");
    if(s){ try{const u=JSON.parse(s); setUser(u); loadData(u.token);}catch{setScreen("auth");} }
    else setScreen("auth");
  },[]);

  async function handleLogin(u,keep){ if(keep)localStorage.setItem("dworks_session",JSON.stringify(u)); setUser(u); loadData(u.token); }
  function handleLogout(){ localStorage.removeItem("dworks_session"); setUser(null); setScreen("auth"); }

  if(screen==="loading") return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>D-Works 로딩 중...</div>;
  if(screen==="auth"||!user) return <AuthPage onLogin={handleLogin}/>;

  const pages={
    dash:<DashPage orders={orders} products={products}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} factories={factories} user={user}/>,
    order:<OrderPage />,
    list:<ListPage orders={orders}/>,
    vendors:<VendorPage vendors={vendors}/>,
    settings:<SettingsPage user={user} setUser={setUser} factories={factories} setFactories={setFactories} onLogout={handleLogout}/>,
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,maxWidth:480,margin:"0 auto",position:"relative",boxShadow:"0 0 40px rgba(0,0,0,0.1)"}}>
      <div style={{background:"#fff",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${C.bdr}`}}>
        <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:22,cursor:"pointer"}}>D-Works</button>
        <span style={{fontSize:12,fontWeight:800,color:C.sub2}}>{user.brand || user.name}</span>
      </div>
      <div>{pages[page]}</div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:`1px solid ${C.bdr}`,display:"flex",height:70,zIndex:50}}>
        {[{k:"dash",l:"대시보드"},{k:"prods",l:"상품관리"},{k:"list",l:"발주리스트"},{k:"vendors",l:"거래처"},{k:"settings",l:"설정"}].map(t=>(
          <button key={t.k} onClick={()=>setPage(t.k)} style={{flex:1,background:page===t.k?"#f0f2f5":"none",border:"none",color:page===t.k?C.acc:C.sub2,fontWeight:page===t.k?800:500,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>{t.l}</button>
        ))}
      </div>
    </div>
  );
}
