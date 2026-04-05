import React, { useState, useEffect } from "react";

// ── 1. 설정 및 API (기존 Supabase 연결 유지) ─────────────────────────────────
const SB="https://qimgostiseehdnvhmoph.supabase.co", KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";
const ah=t=>({"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"});
const api=async(m,p,t,b)=>{const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined});return r.json();};
const DB={signUp:(e,pw,m)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:m}),signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),signOut:t=>fetch(`${SB}/auth/v1/logout`,{method:"POST",headers:ah(t)}),updateUser:(t,m)=>api("PUT","/auth/v1/user",t,{data:m}),list:(t,tb)=>api("GET",`/rest/v1/${tb}?order=created_at.asc`,t),insert:(t,tb,d)=>api("POST",`/rest/v1/${tb}`,t,d),update:(t,tb,id,d)=>api("PATCH",`/rest/v1/${tb}?id=eq.${id}`,t,d),del:(t,tb,id)=>fetch(`${SB}/rest/v1/${tb}?id=eq.${id}`,{method:"DELETE",headers:ah(t)})};
const sendEmail=async(to,name,sub,msg)=>{if(!to)return false;try{const r=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:"service_raca1ke",template_id:"template_hoej0ts",user_id:"KlYRj7B6JNO01D2pm",template_params:{to_email:to,to_name:name,subject:sub,message:msg,from_name:"WTMT"}})});return r.status===200;}catch{return false;}};

// ── 2. 스타일 및 유틸 ────────────────────────────────────────────
const match=(t,q)=>{if(!q)return true; const txt=(t||"").toLowerCase(),qry=(q||"").toLowerCase(); return txt.includes(qry);};
const C={bg:"#F8F9FB",card:"#FFFFFF",bdr:"#E8ECF2",acc:"#111827",txt:"#111827",sub:"#9CA3AF",sub2:"#6B7280",ok:"#10B981",red:"#EF4444",fn:"'Noto Sans KR',sans-serif"};
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const CATS=["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const MAT_TYPES=["원단","안감","단추","지퍼","심지","기타"];

// ── 3. 공통 UI 컴포넌트 ─────────────────────────────────────────
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",red:C.red}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,red:"#fff"}[v]||"#fff";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#EDF0F5":bg,color:disabled?"#B0B8C4":cl,border:v==="w"?`1px solid ${C.bdr}`:"none",borderRadius:12,padding:sz==="s"?"8px 14px":"14px 0",fontSize:sz==="s"?12:14,fontWeight:700,cursor:"pointer",width:full?"100%":"auto",...st}}>{ch}</button>;
};
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:"#fff",borderRadius:20,border:`1px solid ${C.bdr}`,padding:20,boxSizing:"border-box",marginBottom:12,...st}}>{children}</div>;
const Field=({label,children,req})=><div style={{marginBottom:16}}><div style={{fontSize:13,fontWeight:700,marginBottom:8}}>{label}{req&&<span style={{color:C.red}}> *</span>}</div>{children}</div>;
const TxtInp=({val,onChange,ph,type="text"})=><input value={val||""} onChange={e=>onChange(e.target.value)} placeholder={ph} type={type} style={{width:"100%",border:`1px solid ${C.bdr}`,borderRadius:10,padding:"12px 14px",fontSize:14,boxSizing:"border-box",fontFamily:C.fn}}/>;
const Tag=({ch,c=C.acc})=><span style={{background:c+"12",color:c,padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:800}}>{ch}</span>;

function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"24px 24px 0 0",padding:"0 20px 40px",width:"100%",maxHeight:"85vh",overflowY:"auto",boxSizing:"border-box",maxWidth:480,margin:"0 auto"}}>
        <div style={{width:36,height:4,background:C.bdr,borderRadius:2,margin:"12px auto 16px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><span style={{fontWeight:800,fontSize:18}}>{title}</span><button onClick={onClose} style={{background:"none",border:"none",fontSize:18}}>✕</button></div>
        {children}
      </div>
    </div>
  );
}

// ── 4. 각 페이지 컴포넌트 ────────────────────────────────────────

// [대시보드] 시안 디자인 적용
function DashPage({orders,products}){
  const td=today();
  const tO=orders.filter(o=>o.date===td);
  const delayed=orders.filter(o=>o.status==="지연");
  const mQ=orders.filter(o=>o.date?.slice(0,7)===td.slice(0,7)).reduce((s,o)=>(o.items||[]).reduce((ss,it)=>ss+(it.qty||0),s),0);
  
  return(
    <div style={{padding:"20px 16px 80px"}}>
      <div style={{fontSize:22,fontWeight:900,textAlign:"center",marginBottom:24}}>대시 보드</div>
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <Card st={{flex:1,textAlign:"center",padding:"24px 10px"}}><div style={{color:"#3772FF",fontSize:24,fontWeight:900}}>{tO.length}건</div><div style={{fontSize:12,color:C.sub,marginTop:6}}>오늘 발주</div></Card>
        <Card st={{flex:1,textAlign:"center",padding:"24px 10px"}}><div style={{color:"#8B5CF6",fontSize:24,fontWeight:900}}>{delayed.length}건</div><div style={{fontSize:12,color:C.sub,marginTop:6}}>미출고 발주</div></Card>
      </div>
      <Card st={{textAlign:"center",padding:"24px"}}><div style={{color:C.ok,fontSize:26,fontWeight:900}}>{fmtN(mQ)}매</div><div style={{fontSize:12,color:C.sub,marginTop:6}}>이달 총 발주량</div></Card>
      {delayed.length>0 && <Card st={{border:`1px solid ${C.warn||'#F59E0B'}`}}><div style={{fontWeight:800,marginBottom:10}}>⚠️ 지연 목록</div>{delayed.slice(0,3).map((o,i)=><div key={i} style={{fontSize:13,marginBottom:6}}>{o.date} - {o.status}</div>)}</Card>}
    </div>
  );
}

// [상품관리] BOM 등록 로직 완전 복구
function ProdsPage({products,setProducts,vendors,factories,user}){
  const [sheet,setSheet]=useState(false);
  const [step,setStep]=useState(0);
  const [selColor,setSelColor]=useState("");
  const [f,setF]=useState({name:"",colors:[],colorBom:{},factoryId:""});
  const [ci,setCi]=useState("");
  const [br,setBr]=useState({mat:"",amt:"",vid:""});
  const [vSearch,setVSearch]=useState("");

  const openAdd=()=>{setF({name:"",colors:[],colorBom:{},factoryId:""});setStep(0);setSheet(true);};
  const addColor=()=>{if(!ci||f.colors.includes(ci))return; setF(p=>({...p,colors:[...p.colors,ci],colorBom:{...p.colorBom,[ci]:[]}})); setCi("");};
  const addBom=()=>{
    if(!br.mat||!br.amt||!br.vid) return alert("항목을 모두 입력하세요");
    const nb={...br,id:uid(),unit:"yd"};
    setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:[...(p.colorBom[selColor]||[]),nb]}}));
    setBr({mat:"",amt:"",vid:""});setVSearch("");
  };

  async function save(){
    if(!f.name||!f.colors.length) return alert("이름과 색상을 입력하세요");
    const data={...f, user_id:user.id, color_bom:f.colorBom, factory_id:f.factoryId};
    if(f.id){ await DB.update(user.token,"products",f.id,data); setProducts(ps=>ps.map(p=>p.id===f.id?{...f}:p)); }
    else { const r=await DB.insert(user.token,"products",data); setProducts(ps=>[...ps, r[0]]); }
    setSheet(false);
  }

  return(
    <div style={{padding:"20px 16px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontSize:20,fontWeight:900}}>상품 관리</div><Btn ch="+ 추가" sz="s" onClick={openAdd}/></div>
      {products.map(p=><Card key={p.id} onClick={()=>{setF(p);setStep(0);setSheet(true);}}><div style={{fontWeight:800}}>{p.name}</div><div style={{fontSize:12,color:C.sub,marginTop:6}}>{(p.colors||[]).join(", ")}</div></Card>)}
      
      {sheet && <Sheet title="상품 등록/수정" onClose={()=>setSheet(false)}>
        <StepBar cur={step}/>
        {step===0 ? <>
          <Field label="상품명" req><TxtInp val={f.name} onChange={v=>setF(p=>({...p,name:v}))}/></Field>
          <Field label="공장"><select value={f.factoryId} onChange={e=>setF(p=>({...p,factoryId:e.target.value}))} style={{width:"100%",padding:12,borderRadius:10,border:`1px solid ${C.bdr}`}}><option value="">공장 선택</option>{factories.map(fc=><option key={fc.id} value={fc.id}>{fc.name}</option>)}</select></Field>
          <Field label="색상 추가"><div style={{display:"flex",gap:8}}><TxtInp val={ci} onChange={setCi} ph="예: 블랙"/><button onClick={addColor} style={{background:C.acc,color:"#fff",padding:"0 15px",borderRadius:10,border:"none"}}>추가</button></div></Field>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>{f.colors.map(c=><Tag key={c} ch={c}/>)}</div>
          <Btn ch="다음: BOM 등록" full onClick={()=>{if(!f.colors.length)return;setSelColor(f.colors[0]);setStep(1);}}/>
        </> : <>
          <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto"}}>{f.colors.map(c=><button key={c} onClick={()=>setSelColor(c)} style={{padding:"10px 16px",borderRadius:20,border:`2px solid ${selColor===c?C.acc:C.bdr}`,background:selColor===c?C.acc:"#fff",color:selColor===c?"#fff":C.sub2,fontWeight:700}}>{c}</button>)}</div>
          <div style={{background:C.bg,padding:16,borderRadius:16,marginBottom:20}}>
            <div style={{fontWeight:800,marginBottom:12}}>[{selColor}] 원부자재</div>
            {(f.colorBom[selColor]||[]).map(b=><div key={b.id} style={{fontSize:13,marginBottom:6}}>• {b.mat} / {b.amt}yd</div>)}
            <div style={{marginTop:12,borderTop:`1px dashed ${C.bdr}`,paddingTop:12}}>
              <div style={{position:"relative",marginBottom:8}}><TxtInp val={vSearch} onChange={setVSearch} ph="거래처 검색"/>{vSearch&&!br.vid&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",zIndex:99,border:`1px solid ${C.bdr}`}}>{vendors.filter(v=>v.name.includes(vSearch)).map(v=><div key={v.id} onClick={()=>{setBr(p=>({...p,vid:v.id}));setVSearch(v.name);}} style={{padding:12,borderBottom:`1px solid ${C.bg}`}}>{v.name}</div>)}</div>}</div>
              <TxtInp val={br.mat} onChange={v=>setBr(p=>({...p,mat:v}))} ph="원부자재명"/>
              <div style={{display:"flex",gap:8,marginTop:8}}><TxtInp val={br.amt} onChange={v=>setBr(p=>({...p,amt:v}))} ph="수량" type="number"/><Btn ch="+ 추가" sz="s" onClick={addBom}/></div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}><Btn ch="이전" v="w" full onClick={()=>setStep(0)}/><Btn ch="최종 저장" full onClick={save}/></div>
        </>}
      </Sheet>}
    </div>
  );
}

// [발주리스트] 페이지
function ListPage({orders,products}){
  return(
    <div style={{padding:"20px 16px 80px"}}>
      <div style={{fontSize:20,fontWeight:900,marginBottom:20}}>발주 리스트</div>
      {orders.length===0 ? <Empty text="발주 내역이 없습니다."/> : orders.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(o=>(
        <Card key={o.id}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div><div style={{fontWeight:800,fontSize:15}}>{o.date} 발주</div><div style={{fontSize:12,color:C.sub,marginTop:4}}>{(o.items||[]).length}개 품목</div></div>
            <Tag ch={o.status} c={o.status==="완료"?C.ok:o.status==="지연"?C.red:"#3772FF"}/>
          </div>
        </Card>
      ))}
    </div>
  );
}

// [거래처] 페이지
function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",address:"",email:"",type:"원단"});
  const openAdd=()=>{setF({name:"",tel:"",address:"",email:"",type:"원단"});setSheet(true);};
  async function save(){
    if(!f.name||!f.tel) return alert("이름과 연락처는 필수입니다.");
    if(f.id){ await DB.update(user.token,"vendors",f.id,f); setVendors(vs=>vs.map(v=>v.id===f.id?f:v)); }
    else { const r=await DB.insert(user.token,"vendors",{...f,user_id:user.id}); setVendors(vs=>[...vs,r[0]]); }
    setSheet(false);
  }
  return(
    <div style={{padding:"20px 16px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontSize:20,fontWeight:900}}>거래처 관리</div><Btn ch="+ 추가" sz="s" onClick={openAdd}/></div>
      {vendors.map(v=><Card key={v.id} onClick={()=>{setF(v);setSheet(true);}}><div style={{fontWeight:800}}>{v.name} <Tag ch={v.type} c="#FF8A00"/></div><div style={{fontSize:12,color:C.sub,marginTop:6}}>📱 {v.tel}</div></Card>)}
      {sheet && <Sheet title="거래처 등록/수정" onClose={()=>setSheet(false)}>
        <Field label="거래처명" req><TxtInp val={f.name} onChange={v=>setF(p=>({...p,name:v}))}/></Field>
        <Field label="연락처" req><TxtInp val={f.tel} onChange={v=>setF(p=>({...p,tel:v}))}/></Field>
        <Field label="주소"><TxtInp val={f.address} onChange={v=>setF(p=>({...p,address:v}))}/></Field>
        <Field label="이메일"><TxtInp val={f.email} onChange={v=>setF(p=>({...p,email:v}))}/></Field>
        <Btn ch="저장하기" full onClick={save}/>
      </Sheet>}
    </div>
  );
}

// [설정] 페이지 로직 정밀 복구
function SettingsPage({user,setUser,factories,setFactories,onLogout}){
  const [facSheet,setFacSheet]=useState(null);
  const [pfSheet,setPfSheet]=useState(false);
  const [pf,setPf]=useState({name:user.name||"",brand:user.brand||"",tel:user.tel||""});

  async function savePf(){
    const r=await fetch(`${SB}/auth/v1/user`,{method:"PUT",headers:ah(user.token),body:JSON.stringify({data:pf})});
    if(r.ok){ setUser(u=>({...u,...pf})); setPfSheet(false); alert("수정되었습니다."); }
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
      <Card st={{background:C.acc,color:"#fff",padding:"30px 20px"}}>
        <div style={{fontSize:14,opacity:0.8,marginBottom:8}}>{user.company || "디자인워커스"}</div>
        <div style={{fontSize:22,fontWeight:900,marginBottom:16}}>{user.brand || "브랜드명"} · {user.name}</div>
        <Btn ch="프로필 수정" v="w" sz="s" st={{background:"rgba(255,255,255,0.2)",color:"#fff",border:"none"}} onClick={()=>setPfSheet(true)}/>
      </Card>
      <div style={{fontWeight:800,fontSize:16,marginTop:30,marginBottom:12}}>🏭 공장 관리</div>
      {factories.map(fc=><Card key={fc.id} onClick={()=>setFacSheet(fc)}><div style={{fontWeight:700}}>{fc.name}</div><div style={{fontSize:12,color:C.sub,marginTop:4}}>{fc.tel || "연락처 없음"}</div></Card>)}
      <Btn ch="+ 새 공장 등록" full v="w" onClick={()=>setFacSheet({name:"",bizNo:"",address:"",tel:"",account:""})}/>
      <Divider h={40}/>
      <Btn ch="로그아웃" v="red" full onClick={onLogout}/>

      {pfSheet && <Sheet title="내 정보 수정" onClose={()=>setPfSheet(false)}>
        <Field label="브랜드명"><TxtInp val={pf.brand} onChange={v=>setPf(p=>({...p,brand:v}))}/></Field>
        <Field label="성함"><TxtInp val={pf.name} onChange={v=>setPf(p=>({...p,name:v}))}/></Field>
        <Field label="연락처"><TxtInp val={pf.tel} onChange={v=>setPf(p=>({...p,tel:v}))}/></Field>
        <Btn ch="변경사항 저장" full onClick={savePf}/>
      </Sheet>}
      {facSheet && <Sheet title="공장 상세 설정" onClose={()=>setFacSheet(null)}>
        <Field label="공장명" req><TxtInp val={facSheet.name} onChange={v=>setFacSheet(p=>({...p,name:v}))}/></Field>
        <Field label="사업자등록번호"><TxtInp val={facSheet.bizNo} onChange={v=>setFacSheet(p=>({...p,bizNo:v}))}/></Field>
        <Field label="주소"><TxtInp val={facSheet.address} onChange={v=>setFacSheet(p=>({...p,address:v}))}/></Field>
        <Field label="계좌정보"><TxtInp val={facSheet.account} onChange={v=>setFacSheet(p=>({...p,account:v}))} ph="은행명 계좌번호 예금주"/></Field>
        <Field label="연락처"><TxtInp val={facSheet.tel} onChange={v=>setFacSheet(p=>({...p,tel:v}))}/></Field>
        <Btn ch="공장 정보 저장" full onClick={saveFac}/>
      </Sheet>}
    </div>
  );
}

// ── 5. 메인 앱 ──────────────────────────────────────────────────
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
    }catch(e){setScreen("auth");}
  }

  useEffect(()=>{
    const s=localStorage.getItem("dworks_session");
    if(s){ const u=JSON.parse(s); setUser(u); loadData(u.token); }
    else setScreen("splash");
  },[]);

  async function handleLogin(u,keep){ if(keep)localStorage.setItem("dworks_session",JSON.stringify(u)); setUser(u); loadData(u.token); }
  function handleLogout(){ localStorage.removeItem("dworks_session"); setUser(null); setScreen("auth"); }

  if(screen==="loading") return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.fn}}>로딩 중...</div>;
  if(screen==="splash") return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#fff"}}><div style={{fontSize:40,fontWeight:900,color:C.acc,marginBottom:20}}>WTMT</div><Btn ch="시작하기" onClick={()=>setScreen("auth")} sz="l" st={{padding:"14px 40px"}}/></div>;
  if(screen==="auth"||!user) return <AuthPage onLogin={handleLogin}/>;

  const pages={
    dash:<DashPage orders={orders} products={products}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} factories={factories} user={user}/>,
    list:<ListPage orders={orders} products={products}/>,
    vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,
    settings:<SettingsPage user={user} setUser={setUser} factories={factories} setFactories={setFactories} onLogout={handleLogout}/>,
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,maxWidth:480,margin:"0 auto",position:"relative",boxShadow:"0 0 40px rgba(0,0,0,0.1)"}}>
      <div style={{background:"#fff",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${C.bdr}`}}>
        <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:20}}>WTMT</button>
        <span style={{fontSize:12,fontWeight:800,color:C.sub2}}>{user.brand || user.name}</span>
      </div>
      
      {/* 실제 페이지 로드 영역 */}
      <div>{pages[page] || pages["dash"]}</div>
      
      {/* 🚀 하단 중앙 정렬 박스 메뉴 🚀 */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:`1px solid ${C.bdr}`,display:"flex",height:70,zIndex:50}}>
        {[
          {k:"dash",l:"대시보드"},{k:"prods",l:"상품관리"},{k:"list",l:"발주리스트"},{k:"vendors",l:"거래처"},{k:"settings",l:"설정"}
        ].map(t=>(
          <button key={t.k} onClick={()=>setPage(t.k)} style={{
            flex:1, background:page===t.k?"#f0f2f5":"none", border:"none", borderRight:t.k!=="settings"?`1px solid ${C.bdr}`:"none", color:page===t.k?C.acc:C.sub2, fontWeight:page===t.k?800:500, fontSize:12, transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center"
          }}>{t.l}</button>
        ))}
      </div>
    </div>
  );
}

const Empty=({text})=><div style={{textAlign:"center",padding:"100px 20px",color:C.sub,fontSize:14}}>{text}</div>;
const Divider=({h=20})=><div style={{height:h}}/>;
