import React, { useState, useEffect } from "react";

// ── 1. API 설정 ─────────────────────────────────
const SB="https://qimgostiseehdnvhmoph.supabase.co", KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";
const ah=t=>({"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"});
const api=async(m,p,t,b)=>{try{const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined}); return r.json();}catch{return {error:true};}};
const DB={signUp:(e,pw,m)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:m}),signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),signOut:t=>fetch(`${SB}/auth/v1/logout`,{method:"POST",headers:ah(t)}),updateUser:(t,m)=>api("PUT","/auth/v1/user",t,{data:m}),list:(t,tb)=>api("GET",`/rest/v1/${tb}?order=created_at.asc`,t),insert:(t,tb,d)=>api("POST",`/rest/v1/${tb}`,t,d),update:(t,tb,id,d)=>api("PATCH",`/rest/v1/${tb}?id=eq.${id}`,t,d),del:(t,tb,id)=>fetch(`${SB}/rest/v1/${tb}?id=eq.${id}`,{method:"DELETE",headers:ah(t)})};

// ── 2. 스타일 및 상수 ────────────────────────────────────────────
const C={bg:"#F4F7FA",card:"#FFFFFF",bdr:"#E8ECF2",acc:"#111827",txt:"#111827",sub:"#9CA3AF",sub2:"#6B7280",ok:"#10B981",red:"#EF4444",fn:"'Noto Sans KR',sans-serif"};
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const match=(t,q)=>{if(!q)return true; return (t||"").toLowerCase().includes(q.toLowerCase());};

// ── 3. 공통 UI ──────────────────────────────────────────────────
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",red:C.red}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,red:"#fff"}[v]||"#fff";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#EDF0F5":bg,color:disabled?"#B0B8C4":cl,border:v==="w"?`1.5px solid ${C.bdr}`:"none",borderRadius:14,padding:sz==="s"?"8px 14px":"14px 0",fontSize:sz==="s"?12:14,fontWeight:700,cursor:"pointer",fontFamily:C.fn,width:full?"100%":"auto",display:"inline-flex",alignItems:"center",justifyContent:"center",...st}}>{ch}</button>;
};
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:"#fff",borderRadius:24,border:`1px solid ${C.bdr}`,padding:20,boxSizing:"border-box",marginBottom:12,boxShadow:"0 4px 12px rgba(0,0,0,0.02)",...st}}>{children}</div>;
const Field=({label,children,req})=><div style={{marginBottom:18}}><div style={{fontSize:13,fontWeight:700,color:C.txt,marginBottom:8}}>{label}{req&&<span style={{color:C.red}}> *</span>}</div>{children}</div>;
const TxtInp=({val,onChange,ph,type="text"})=><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} style={{width:"100%",border:`1.5px solid ${C.bdr}`,borderRadius:12,padding:"14px 16px",fontSize:14,boxSizing:"border-box",fontFamily:C.fn,outline:"none"}}/>;
const Tag=({ch,c=C.acc})=><span style={{background:c+"12",color:c,padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:800}}>{ch}</span>;

function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"flex-end",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"32px 32px 0 0",padding:"0 24px 40px",width:"100%",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box",maxWidth:480,margin:"0 auto"}}>
        <div style={{width:40,height:5,background:C.bdr,borderRadius:3,margin:"16px auto 24px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><span style={{fontWeight:800,fontSize:20}}>{title}</span><button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:10,width:32,height:32,fontSize:16}}>✕</button></div>
        {children}
      </div>
    </div>
  );
}

// ── 4. 페이지 컴포넌트 ────────────────────────────────────────

function AuthPage({onLogin}){
  const [tab,setTab]=useState("in");
  const [f,setF]=useState({company:"",brand:"",name:"",position:"",tel:"",email:"",pw:"",pw2:"",keepLoggedIn:true});
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  const [loading,setLoading]=useState(false);

  async function submit(){
    if(!f.email||!f.pw) return alert("이메일과 비밀번호를 입력하세요");
    setLoading(true);
    try{
      if(tab==="up"){
        const r=await DB.signUp(f.email,f.pw,{company:f.company,brand:f.brand,name:f.name,position:f.position,tel:f.tel});
        if(r.error) alert("가입 실패: " + (r.message||"다시 확인해주세요"));
        else { alert("가입 완료! 로그인해주세요."); setTab("in"); }
      } else {
        const r=await DB.signIn(f.email,f.pw);
        if(!r.access_token) alert("로그인 실패: 아이디/비번을 확인하세요");
        else {
          const meta = r.user?.user_metadata || {};
          onLogin({token:r.access_token, id:r.user.id, email:r.user.email, ...meta}, f.keepLoggedIn);
        }
      }
    } catch(e){ alert("서버 연결 오류"); } finally { setLoading(false); }
  }

  return(
    <div style={{minHeight:"100vh",background:"#fff",padding:"60px 24px"}}>
      <div style={{fontSize:36,fontWeight:900,color:C.acc,letterSpacing:"-1.5px",marginBottom:8}}>WTMT</div>
      <div style={{fontSize:15,color:C.sub2,marginBottom:40,fontWeight:500}}>의류 생산 공정의 새로운 기준</div>
      <div style={{display:"flex",gap:24,marginBottom:32,borderBottom:`1.5px solid ${C.bdr}`}}>
        <button onClick={()=>setTab("in")} style={{paddingBottom:14,borderBottom:`3px solid ${tab==="in"?C.acc:"transparent"}`,background:"none",border:"none",fontWeight:800,fontSize:17,color:tab==="in"?C.acc:C.sub}}>로그인</button>
        <button onClick={()=>setTab("up")} style={{paddingBottom:14,borderBottom:`3px solid ${tab==="up"?C.acc:"transparent"}`,background:"none",border:"none",fontWeight:800,fontSize:17,color:tab==="up"?C.acc:C.sub}}>회원가입</button>
      </div>
      {tab==="up" && <>
        <Field label="업체명" req><TxtInp val={f.company} onChange={sf("company")} ph="회사명을 입력하세요"/></Field>
        <Field label="브랜드명" req><TxtInp val={f.brand} onChange={sf("brand")} ph="예: WTMT"/></Field>
        <Field label="성함" req><TxtInp val={f.name} onChange={sf("name")} ph="담당자 성함"/></Field>
        <Field label="직함" req><TxtInp val={f.position} onChange={sf("position")} ph="예: 대표"/></Field>
        <Field label="연락처" req><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000"/></Field>
      </>}
      <Field label="이메일" req><TxtInp val={f.email} onChange={sf("email")} ph="example@email.com"/></Field>
      <Field label="비밀번호" req><TxtInp val={f.pw} onChange={sf("pw")} ph="6자 이상 입력" type="password"/></Field>
      {tab==="in" && (
        <label style={{display:"flex", alignItems:"center", gap:10, marginBottom:24, cursor:"pointer"}}>
          <input type="checkbox" checked={f.keepLoggedIn} onChange={e=>sf("keepLoggedIn")(e.target.checked)} style={{width:18, height:18}}/>
          <span style={{fontSize:14, fontWeight:600, color:C.sub2}}>로그인 상태 유지</span>
        </label>
      )}
      <Btn ch={loading?"연결 중...":tab==="in"?"로그인하기":"가입 신청하기"} full sz="l" onClick={submit} disabled={loading} st={{height:56, borderRadius:16}}/>
    </div>
  );
}

function DashPage({orders=[]}){
  const td=today();
  const tO=orders.filter(o=>o.date===td);
  const delayed=orders.filter(o=>o.status==="지연");
  const mQ=orders.filter(o=>o.date?.slice(0,7)===td.slice(0,7)).reduce((s,o)=>(o.items||[]).reduce((ss,it)=>ss+(it.qty||0),s),0);
  return(
    <div style={{padding:"20px 20px 100px"}}>
      <div style={{fontSize:24,fontWeight:900,textAlign:"center",marginBottom:30}}>대시 보드</div>
      <div style={{display:"flex",gap:12,marginBottom:16}}>
        <Card st={{flex:1,textAlign:"center",padding:"28px 10px"}}><div style={{color:"#3772FF",fontSize:28,fontWeight:900}}>{tO.length}건</div><div style={{fontSize:13,color:C.sub,marginTop:8,fontWeight:600}}>오늘 발주</div></Card>
        <Card st={{flex:1,textAlign:"center",padding:"28px 10px"}}><div style={{color:C.red,fontSize:28,fontWeight:900}}>{delayed.length}건</div><div style={{fontSize:13,color:C.sub,marginTop:8,fontWeight:600}}>지연 발주</div></Card>
      </div>
      <Card st={{textAlign:"center",padding:"32px"}}><div style={{color:C.ok,fontSize:32,fontWeight:900}}>{fmtN(mQ)}매</div><div style={{fontSize:14,color:C.sub,marginTop:10,fontWeight:600}}>이달 누적 발주량</div></Card>
      {delayed.length>0 && <Card><div style={{fontWeight:800,marginBottom:14,fontSize:15}}>⚠️ 지연 확인 필요</div>{delayed.slice(0,3).map((o,i)=><div key={i} style={{fontSize:14,padding:"12px 0",borderBottom:i<2?`1px solid ${C.bdr}`:"none",display:'flex',justifyContent:'space-between'}}><span>{o.date} 발주</span><Tag ch="지연" c={C.red}/></div>)}</Card>}
    </div>
  );
}

function ProdsPage({products=[],setProducts,vendors=[],factories=[],user}){
  const [sheet,setSheet]=useState(false);
  const [step,setStep]=useState(0);
  const [selColor,setSelColor]=useState("");
  const [f,setF]=useState({name:"",colors:[],colorBom:{},factoryId:""});
  const [ci,setCi]=useState("");
  const [br,setBr]=useState({mat:"",amt:"",vid:""});
  const [vSearch,setVSearch]=useState("");

  const addColor=()=>{if(!ci||f.colors.includes(ci))return; setF(p=>({...p,colors:[...p.colors,ci],colorBom:{...p.colorBom,[ci]:[]}})); setCi("");};
  const addBom=()=>{
    if(!br.mat||!br.amt||!br.vid) return alert("거래처와 정보를 입력하세요");
    const nb={...br,id:uid(),amt:Number(br.amt),unit:"yd"};
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
    <div style={{padding:"20px 16px 100px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div style={{fontSize:22,fontWeight:900}}>상품 관리</div><Btn ch="+ 상품 등록" sz="s" onClick={()=>{setF({name:"",colors:[],colorBom:{},factoryId:""});setStep(0);setSheet(true);}}/></div>
      {products.map(p=><Card key={p.id} onClick={()=>{setF(p);setStep(0);setSheet(true);}} st={{padding:24}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontWeight:800,fontSize:17}}>{p.name}</div><Tag ch={p.season||"26SS"}/></div><div style={{fontSize:13,color:C.sub2,marginTop:10,fontWeight:500}}>{(p.colors||[]).join(", ")}</div></Card>)}
      {sheet && <Sheet title={f.id?"상품 수정":"새 상품 등록"} onClose={()=>setSheet(false)}>
        <div style={{display:"flex",gap:8,marginBottom:24}}><div style={{flex:1,height:5,background:C.acc,borderRadius:3}}/><div style={{flex:1,height:5,background:step===1?C.acc:C.bdr,borderRadius:3}}/></div>
        {step===0 ? <>
          <Field label="상품명" req><TxtInp val={f.name} onChange={v=>setF(p=>({...p,name:v}))} ph="예: 로얄 트윌 셔츠"/></Field>
          <Field label="공장 지정"><select value={f.factoryId} onChange={e=>setF(p=>({...p,factoryId:e.target.value}))} style={{width:"100%",padding:14,borderRadius:12,border:`1.5px solid ${C.bdr}`,fontFamily:C.fn,outline:"none"}}><option value="">공장 선택</option>{factories.map(fc=><option key={fc.id} value={fc.id}>{fc.name}</option>)}</select></Field>
          <Field label="색상 추가"><div style={{display:"flex",gap:10}}><TxtInp val={ci} onChange={setCi} ph="예: 아이보리"/><button onClick={addColor} style={{background:C.acc,color:"#fff",padding:"0 20px",borderRadius:12,border:"none",fontWeight:800}}>추가</button></div></Field>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:30}}>{f.colors.map(c=><span key={c} style={{background:C.bg,padding:"8px 16px",borderRadius:10,fontSize:14,fontWeight:700,border:`1px solid ${C.bdr}`}}>{c}</span>)}</div>
          <Btn ch="다음: 원부자재(BOM) 등록" full onClick={()=>{if(!f.colors.length)return alert("색상을 1개 이상 추가하세요");setSelColor(f.colors[0]);setStep(1);}} st={{height:52}}/>
        </> : <>
          <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4}}>{f.colors.map(c=><button key={c} onClick={()=>setSelColor(c)} style={{padding:"12px 20px",borderRadius:24,border:`2.5px solid ${selColor===c?C.acc:C.bdr}`,background:selColor===c?C.acc:"#fff",color:selColor===c?"#fff":C.sub2,fontWeight:800,whiteSpace:'nowrap'}}>{c}</button>)}</div>
          <div style={{background:C.bg,padding:20,borderRadius:24,marginBottom:24,border:`1px solid ${C.bdr}`}}>
            <div style={{fontWeight:800,marginBottom:16,fontSize:16}}>[{selColor}] BOM 등록</div>
            {(f.colorBom[selColor]||[]).map(b=><div key={b.id} style={{fontSize:14,marginBottom:10,display:'flex',justifyContent:'space-between',background:'#fff',padding:'10px 14px',borderRadius:10,border:`1px solid ${C.bdr}`}}><span>• {b.mat} / {fmtN(b.amt)}yd</span><button onClick={()=>{setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:p.colorBom[selColor].filter(x=>x.id!==b.id)}}))}} style={{border:'none',background:'none',color:C.red,fontWeight:700}}>✕</button></div>)}
            <div style={{marginTop:16,borderTop:`1.5px dashed ${C.bdr}`,paddingTop:16}}>
              <div style={{position:"relative",marginBottom:10}}><TxtInp val={vSearch} onChange={setVSearch} ph="공급 거래처 검색"/><div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",zIndex:99,borderRadius:12,boxShadow:"0 10px 20px rgba(0,0,0,0.1)"}}>{vSearch && !br.vid && vendors.filter(v=>v.name.includes(vSearch)).map(v=><div key={v.id} onClick={()=>{setBr(p=>({...p,vid:v.id}));setVSearch(v.name);}} style={{padding:14,borderBottom:`1px solid ${C.bg}`,fontWeight:600}}>{v.name}</div>)}</div></div>
              <TxtInp val={br.mat} onChange={v=>setBr(p=>({...p,mat:v}))} ph="원부자재명 (예: 40수 실켓)"/>
              <div style={{display:"flex",gap:10,marginTop:10}}><TxtInp val={br.amt} onChange={v=>setBr(p=>({...p,amt:v}))} ph="소요량" type="number"/><Btn ch="+ 추가" sz="s" onClick={addBom} st={{width:80}}/></div>
            </div>
          </div>
          <div style={{display:"flex",gap:12}}><Btn ch="이전으로" v="w" full onClick={()=>setStep(0)}/><Btn ch="상품 저장 완료" full onClick={save}/></div>
        </>}
      </Sheet>}
    </div>
  );
}

function ListPage({orders=[]}){
  return(
    <div style={{padding:"20px 20px 100px"}}>
      <div style={{fontSize:22,fontWeight:900,marginBottom:24}}>발주 리스트</div>
      {orders.length===0 ? <div style={{textAlign:'center',padding:'100px 0',color:C.sub}}>기록된 발주가 없습니다.</div> : orders.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(o=>(
        <Card key={o.id} st={{padding:24}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:800,fontSize:16}}>{o.date} 발주</div><div style={{fontSize:13,color:C.sub2,marginTop:6,fontWeight:500}}>{(o.items||[]).length}개 품목 진행 중</div></div><Tag ch={o.status} c={o.status==="지연"?C.red:C.ok}/></div></Card>
      ))}
    </div>
  );
}

function VendorPage({vendors=[],setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",address:"",email:"",type:"원단",bizNo:""});
  const openAdd=()=>{setF({name:"",tel:"",address:"",email:"",type:"원단",bizNo:""});setSheet(true);};
  async function save(){
    if(!f.name||!f.tel) return alert("거래처명과 연락처는 필수입니다.");
    if(f.id){ await DB.update(user.token,"vendors",f.id,f); setVendors(vs=>vs.map(v=>v.id===f.id?f:v)); }
    else { const r=await DB.insert(user.token,"vendors",{...f,user_id:user.id}); setVendors(vs=>[...vs,r[0]]); }
    setSheet(false);
  }
  return(
    <div style={{padding:"20px 20px 100px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div style={{fontSize:22,fontWeight:900}}>거래처 관리</div><Btn ch="+ 추가" sz="s" onClick={openAdd}/></div>
      {vendors.map(v=><Card key={v.id} onClick={()=>{setF(v);setSheet(true);}} st={{padding:24}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontWeight:800,fontSize:17}}>{v.name}</div><Tag ch={v.type} c="#FF8A00"/></div><div style={{fontSize:13,color:C.sub2,marginTop:8}}>📱 {v.tel}</div></Card>)}
      {sheet && <Sheet title="거래처 상세 정보" onClose={()=>setSheet(false)}>
        <Field label="거래처명" req><TxtInp val={f.name} onChange={v=>setF(p=>({...p,name:v}))}/></Field>
        <Field label="연락처" req><TxtInp val={f.tel} onChange={v=>setF(p=>({...p,tel:v}))}/></Field>
        <Field label="주소"><TxtInp val={f.address} onChange={v=>setF(p=>({...p,address:v}))}/></Field>
        <Field label="사업자등록번호"><TxtInp val={f.bizNo} onChange={v=>setF(p=>({...p,bizNo:v}))}/></Field>
        <Btn ch="거래처 정보 저장" full onClick={save} st={{height:52,marginTop:10}}/>
      </Sheet>}
    </div>
  );
}

function SettingsPage({user,setUser,factories=[],setFactories,onLogout}){
  const [facSheet,setFacSheet]=useState(null);
  const [pfSheet,setPfSheet]=useState(false);
  const [pf,setPf]=useState({name:user?.name||"",brand:user?.brand||"",tel:user?.tel||"",position:user?.position||""});

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
    <div style={{padding:"20px 20px 100px"}}>
      <div style={{fontSize:22,fontWeight:900,marginBottom:24,textAlign:'center'}}>설정</div>
      <Card st={{background:C.acc,color:"#fff",padding:"36px 24px"}}>
        <div style={{fontSize:14,opacity:0.7,marginBottom:8}}>{user?.company || "WL 솔루션"}</div>
        <div style={{fontSize:26,fontWeight:900,marginBottom:20}}>{user?.brand || "브랜드명"} · {user?.name} <span style={{fontSize:14,fontWeight:400,opacity:0.8}}>{user?.position}</span></div>
        <Btn ch="내 프로필 수정" v="w" sz="s" st={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"none",fontWeight:800}} onClick={()=>setPfSheet(true)}/>
      </Card>
      
      <div style={{fontWeight:800,fontSize:17,marginTop:40,marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>🏭 생산 공장 리스트 <button onClick={()=>setFacSheet({name:"",bizNo:"",address:"",tel:"",account:""})} style={{fontSize:13,color:C.acc,background:C.bg,border:'none',padding:'6px 12px',borderRadius:8,fontWeight:800}}>+ 추가</button></div>
      {factories.map(fc=><Card key={fc.id} onClick={()=>setFacSheet(fc)} st={{padding:24}}><div style={{fontWeight:800,fontSize:16}}>{fc.name}</div><div style={{fontSize:13,color:C.sub2,marginTop:8}}>📞 {fc.tel || "연락처 미등록"}</div></Card>)}
      
      <Btn ch="안전하게 로그아웃" v="red" full onClick={onLogout} st={{marginTop:40,borderRadius:18,height:58,fontWeight:800}}/>

      {pfSheet && <Sheet title="내 프로필 수정" onClose={()=>setPfSheet(false)}>
        <Field label="브랜드명" req><TxtInp val={pf.brand} onChange={v=>setPf(p=>({...p,brand:v}))}/></Field>
        <Field label="성함" req><TxtInp val={pf.name} onChange={v=>setPf(p=>({...p,name:v}))}/></Field>
        <Field label="직함"><TxtInp val={pf.position} onChange={v=>setPf(p=>({...p,position:v}))}/></Field>
        <Field label="연락처" req><TxtInp val={pf.tel} onChange={v=>setPf(p=>({...p,tel:v}))}/></Field>
        <Btn ch="수정 내용 저장" full onClick={savePf} st={{height:52,marginTop:12}}/>
      </Sheet>}

      {facSheet && <Sheet title="공장 상세 정보" onClose={()=>setFacSheet(null)}>
        <Field label="공장명" req><TxtInp val={facSheet.name} onChange={v=>setFacSheet(p=>({...p,name:v}))}/></Field>
        <Field label="사업자등록번호"><TxtInp val={facSheet.bizNo} onChange={v=>setFacSheet(p=>({...p,bizNo:v}))}/></Field>
        <Field label="주소"><TxtInp val={facSheet.address} onChange={v=>setFacSheet(p=>({...p,address:v}))}/></Field>
        <Field label="계좌번호 (발주서 자동 포함)"><TxtInp val={facSheet.account} onChange={v=>setFacSheet(p=>({...p,account:v}))} ph="은행명 000-00-000000 예금주"/></Field>
        <Field label="연락처"><TxtInp val={facSheet.tel} onChange={v=>setFacSheet(p=>({...p,tel:v}))}/></Field>
        <div style={{display:'flex',gap:12,marginTop:12}}>
          {facSheet.id && <Btn ch="삭제" v="red" full onClick={async()=>{if(window.confirm("공장을 삭제하시겠습니까?")){await DB.del(user.token,"factories",facSheet.id); setFactories(fs=>fs.filter(x=>x.id!==facSheet.id)); setFacSheet(null);}}}/>} 
          <Btn ch="저장하기" full onClick={saveFac}/>
        </div>
      </Sheet>}
    </div>
  );
}

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
      setVendors(Array.isArray(v)?v:[]); 
      setFactories(Array.isArray(f)?f:[]);
      setProducts(Array.isArray(p)?p.map(x=>({...x,colorBom:x.color_bom||{}})):[]);
      setOrders(Array.isArray(o)?o:[]); 
      setScreen("app");
    }catch(e){ setScreen("auth"); }
  }

  useEffect(()=>{
    const s=localStorage.getItem("dworks_session");
    if(s){ try{const u=JSON.parse(s); setUser(u); loadData(u.token);}catch{setScreen("auth");} }
    else setScreen("auth");
  },[]);

  async function handleLogin(u,keep){ if(keep)localStorage.setItem("dworks_session",JSON.stringify(u)); setUser(u); loadData(u.token); }
  function handleLogout(){ localStorage.removeItem("dworks_session"); setUser(null); setScreen("auth"); }

  if(screen==="loading") return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.fn,fontWeight:800,fontSize:20,color:C.acc}}>WTMT 로딩 중...</div>;
  if(screen==="auth"||!user) return <AuthPage onLogin={handleLogin}/>;

  const pages={
    dash:<DashPage orders={orders} products={products}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} factories={factories} user={user}/>,
    list:<ListPage orders={orders}/>,
    vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,
    settings:<SettingsPage user={user} setUser={setUser} factories={factories} setFactories={setFactories} onLogout={handleLogout}/>,
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,maxWidth:480,margin:"0 auto",position:"relative",boxShadow:"0 0 50px rgba(0,0,0,0.1)"}}>
      <div style={{background:"#fff",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:`1.5px solid ${C.bdr}`}}>
        <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:22,cursor:"pointer",letterSpacing:'-1px'}}>WTMT</button>
        <span style={{fontSize:13,fontWeight:800,color:C.sub2}}>{user.brand || user.name}님</span>
      </div>
      
      <div>{pages[page]}</div>
      
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:`1.5px solid ${C.bdr}`,display:"flex",height:75,zIndex:50,paddingBottom:window.innerWidth<400?10:0}}>
        {[
          {k:"dash",l:"대시보드"},{k:"prods",l:"상품관리"},{k:"list",l:"발주리스트"},{k:"vendors",l:"거래처"},{k:"settings",l:"설정"}
        ].map(t=>(
          <button key={t.k} onClick={()=>setPage(t.k)} style={{
            flex:1, background:page===t.k?"#F0F3F7":"none", border:"none", borderRight:t.k!=="settings"?`1px solid ${C.bdr}`:"none", color:page===t.k?C.acc:C.sub2, fontWeight:page===t.k?800:600, fontSize:12, transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center"
          }}>{t.l}</button>
        ))}
      </div>
    </div>
  );
}
