import React, { useState, useEffect } from "react";

// ── Supabase & API ─────────────────────────────────
const SB="https://qimgostiseehdnvhmoph.supabase.co", KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";
const ah=t=>({"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"});
const api=async(m,p,t,b)=>{const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined});return r.json();};
const DB={signUp:(e,pw,m)=>api("POST","/auth/v1/signup",null,{email:e,password:pw,data:m}),signIn:(e,pw)=>api("POST","/auth/v1/token?grant_type=password",null,{email:e,password:pw}),signOut:t=>fetch(`${SB}/auth/v1/logout`,{method:"POST",headers:ah(t)}),updateUser:(t,m)=>api("PUT","/auth/v1/user",t,{data:m}),list:(t,tb)=>api("GET",`/rest/v1/${tb}?order=created_at.asc`,t),insert:(t,tb,d)=>api("POST",`/rest/v1/${tb}`,t,d),update:(t,tb,id,d)=>api("PATCH",`/rest/v1/${tb}?id=eq.${id}`,t,d),del:(t,tb,id)=>fetch(`${SB}/rest/v1/${tb}?id=eq.${id}`,{method:"DELETE",headers:ah(t)})};
const EJS={SID:"service_raca1ke",TID:"template_hoej0ts",PK:"KlYRj7B6JNO01D2pm"};
const sendEmail=async(to,name,sub,msg)=>{if(!to)return false;try{const r=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:EJS.SID,template_id:EJS.TID,user_id:EJS.PK,template_params:{to_email:to,to_name:name,subject:sub,message:msg,from_name:"WTMT"}})});return r.status===200;}catch{return false;}};

// ── 유틸 및 상수 ──
const CHO=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const getCho=s=>(s||"").split("").map(c=>{const cd=c.charCodeAt(0);return(cd>=44032&&cd<=55203)?CHO[Math.floor((cd-44032)/588)]:c;}).join("");
const match=(t,q)=>{if(!q)return true;const txt=(t||"").toLowerCase(),qry=(q||"").toLowerCase();return txt.includes(qry)||getCho(txt).includes(getCho(qry));};
const C={bg:"#F8F9FB",card:"#FFFFFF",bdr:"#E8ECF2",acc:"#111827",txt:"#111827",sub:"#9CA3AF",sub2:"#6B7280",ok:"#10B981",warn:"#F59E0B",red:"#EF4444",fn:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif"};
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const CATS=["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const SEASONS=["26SS","26FW","25SS","25FW"];
const MAT_TYPES=["원단","안감","단추","지퍼","심지","기타"];

// ── 공통 UI ──
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",ok:"#10B981",d:C.bg}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,ok:"#fff",d:C.sub}[v]||"#fff";
  const bd=v==="w"?`1.5px solid ${C.bdr}`:"none";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#EDF0F5":bg,color:disabled?"#B0B8C4":cl,border:disabled?`1.5px solid ${C.bdr}`:bd,borderRadius:10,padding:sz==="s"?"7px 14px":"12px 0",fontSize:sz==="s"?12:14,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:C.fn,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,width:full?"100%":"auto",boxSizing:"border-box",lineHeight:1.4,...st}}>{ch}</button>;
};
function Field({label,children,req}){return<div style={{marginBottom:16}}><div style={{fontSize:13,fontWeight:600,color:C.txt,marginBottom:8}}>{label}{req&&<span style={{color:C.red,marginLeft:2}}>*</span>}</div>{children}</div>;}
function TxtInp({val,onChange,ph,type="text",onKeyDown}){return<div style={{display:"flex",alignItems:"center",border:`1px solid ${C.bdr}`,borderRadius:8,background:"#fff"}}><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} onKeyDown={onKeyDown} style={{flex:1,border:"none",outline:"none",padding:"12px 14px",fontSize:13,color:C.txt,fontFamily:C.fn,background:"transparent"}}/></div>;}
function DropSel({val,onChange,children,ph}){return<div style={{position:"relative",border:`1px solid ${C.bdr}`,borderRadius:8,background:"#fff"}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",padding:"12px 14px",fontSize:13,color:val?C.txt:C.sub,fontFamily:C.fn,background:"transparent",WebkitAppearance:"none",cursor:"pointer"}}>{ph&&<option value="">{ph}</option>}{children}</select><span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:C.sub,pointerEvents:"none",fontSize:11}}>∨</span></div>;}
const Tag=({ch,c="#3772FF"})=><span style={{background:c+"12",color:c,padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{ch}</span>;
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:"#fff",borderRadius:16,border:`1px solid ${C.bdr}`,padding:16,boxSizing:"border-box",...st}}>{children}</div>;
function StepBar({cur,total=2}){return<div style={{display:"flex",gap:6,marginBottom:20}}>{Array.from({length:total},(_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=cur?C.acc:C.bdr}}/>)}</div>;}

function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"24px 24px 0 0",padding:"0 20px 40px",width:"100%",maxHeight:"85vh",overflowY:"auto",boxSizing:"border-box",fontFamily:C.fn,maxWidth:480,margin:"0 auto"}}>
        <div style={{width:36,height:4,background:C.bdr,borderRadius:2,margin:"12px auto 16px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontWeight:800,fontSize:18,color:C.txt}}>{title}</span>
          <button onClick={onClose} style={{background:C.bg,border:"none",color:C.sub2,cursor:"pointer",width:28,height:28,borderRadius:8,fontSize:15}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Splash & Auth ──
function AuthPage({onLogin}){
  const [tab,setTab]=useState("in");
  const [f,setF]=useState({company:"",brand:"",name:"",position:"",tel:"",email:"",pw:"",pw2:"",address:"",agree:false, keepLoggedIn: true});
  const [loading,setLoading]=useState(false);
  const sf=k=>v=>setF(p=>({...p,[k]:v}));

  async function submit(){
    if(!f.email||!f.pw) return alert("필수 정보를 입력하세요");
    setLoading(true);
    try{
      if(tab==="up"){
        const r=await DB.signUp(f.email,f.pw,{company:f.company,brand:f.brand,name:f.name,position:f.position,tel:f.tel,address:f.address});
        if(r.error) return alert(r.error.message);
        alert("가입 완료! 로그인해 주세요."); setTab("in");
      }else{
        const r=await DB.signIn(f.email,f.pw);
        if(!r.access_token) return alert("아이디 혹은 비밀번호 오류");
        const meta=r.user?.user_metadata||{};
        onLogin({token:r.access_token,id:r.user.id,name:meta.name,company:meta.company,email:r.user.email,tel:meta.tel,brand:meta.brand,position:meta.position,address:meta.address}, f.keepLoggedIn);
      }
    }catch(e){alert("네트워크 오류");}finally{setLoading(false);}
  }
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,padding:"40px 20px"}}>
      <div style={{fontSize:32,fontWeight:900,color:C.acc,marginBottom:4}}>WTMT</div>
      <div style={{fontSize:14,color:C.sub,marginBottom:32}}>의류 생산 관리 솔루션</div>
      <div style={{display:"flex",gap:20,marginBottom:24,borderBottom:`1px solid ${C.bdr}`}}>
        <button onClick={()=>setTab("in")} style={{paddingBottom:12,borderBottom:`2px solid ${tab==="in"?C.acc:"transparent"}`,background:"none",border:"none",fontWeight:700,color:tab==="in"?C.acc:C.sub}}>로그인</button>
        <button onClick={()=>setTab("up")} style={{paddingBottom:12,borderBottom:`2px solid ${tab==="up"?C.acc:"transparent"}`,background:"none",border:"none",fontWeight:700,color:tab==="up"?C.acc:C.sub}}>회원가입</button>
      </div>
      {tab==="up" && <>
        <Field label="업체명" req><TxtInp val={f.company} onChange={sf("company")} ph="회사명"/></Field>
        <Field label="브랜드명" req><TxtInp val={f.brand} onChange={sf("brand")} ph="브랜드명 (WTMT)"/></Field>
        <Field label="성함" req><TxtInp val={f.name} onChange={sf("name")} ph="담당자 성함"/></Field>
        <Field label="직함" req><TxtInp val={f.position} onChange={sf("position")} ph="예: 대표"/></Field>
        <Field label="연락처" req><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000"/></Field>
      </>}
      <Field label="이메일" req><TxtInp val={f.email} onChange={sf("email")} ph="이메일 주소"/></Field>
      <Field label="비밀번호" req><TxtInp val={f.pw} onChange={sf("pw")} ph="비밀번호" type="password"/></Field>
      {tab==="in" && (
        <label style={{display:"flex", alignItems:"center", gap:8, marginBottom:20, cursor:"pointer"}}>
          <input type="checkbox" checked={f.keepLoggedIn} onChange={e=>sf("keepLoggedIn")(e.target.checked)} />
          <span style={{fontSize:13, fontWeight:600, color:C.sub2}}>로그인 상태 유지</span>
        </label>
      )}
      <Btn ch={loading?"진행 중...":tab==="in"?"로그인":"가입하기"} full sz="l" onClick={submit} disabled={loading}/>
    </div>
  );
}

// ── 대시보드 (기존 유지) ──
function DashPage({orders,products,onNav}){
  const td=today();
  const tO=orders.filter(o=>o.date===td);
  const mQ=orders.filter(o=>o.date?.slice(0,7)===td.slice(0,7)).reduce((s,o)=>s+(o.items||[]).reduce((ss,i)=>ss+(i.qty||0),0),0);
  const delayed=orders.filter(o=>o.status==="지연");
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:22,textAlign:"center",marginBottom:20}}>대시 보드</div>
      <div style={{display:"flex", gap:10, marginBottom:16}}>
        <Card st={{flex:1, textAlign:"center"}}><div style={{color:"#3772FF", fontSize:22, fontWeight:900}}>{tO.length}건</div><div style={{color:C.sub, fontSize:11, marginTop:4}}>오늘 발주</div></Card>
        <Card st={{flex:1, textAlign:"center"}}><div style={{color:C.red, fontSize:22, fontWeight:900}}>{delayed.length}건</div><div style={{color:C.sub, fontSize:11, marginTop:4}}>지연 발주</div></Card>
        <Card st={{flex:1, textAlign:"center"}}><div style={{color:C.ok, fontSize:22, fontWeight:900}}>{fmtN(mQ)}매</div><div style={{color:C.sub, fontSize:11, marginTop:4}}>이달 수량</div></Card>
      </div>
      <Card st={{marginBottom:16}}>
        <div style={{fontWeight:800,marginBottom:12}}>⚠️ 지연 목록</div>
        {delayed.length===0?<div style={{textAlign:"center",color:C.sub,fontSize:13}}>지연된 발주가 없습니다.</div>:delayed.slice(0,3).map((o,i)=><div key={i} style={{fontSize:13,padding:"8px 0",borderBottom:i<2?`1px solid ${C.bdr}`:"none"}}>{o.date} - {(o.items||[]).map(it=>it.pid).join(", ")}</div>)}
      </Card>
    </div>
  );
}

// ── 상품 관리 (BOM 등록 기능 완벽 복구) ──
function ProdsPage({products,setProducts,vendors,factories,user}){
  const [sheet,setSheet]=useState(false);
  const [sheetStep,setSheetStep]=useState(0);
  const [selColor,setSelColor]=useState("");
  const [f,setF]=useState({name:"",category:"",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],colorBom:{},imageUrl:""});
  const [ci,setCi]=useState("");
  const [br,setBr]=useState({type:"원단",mat:"",amt:"",vid:"",price:"",color:""});
  const [venSearch,setVenSearch]=useState("");
  const sf=k=>v=>setF(p=>({...p,[k]:v}));

  function openAdd(){setF({name:"",category:"이너",season:"26SS",factoryId:"",factory:"",factoryTel:"",colors:[],colorBom:{},imageUrl:""});setCi("");setSheetStep(0);setSheet(true);}
  function openEdit(p){setF({...p, factoryId:p.factory_id||"", colorBom:p.color_bom||{}});setSheetStep(0);setSheet(true);}
  function addColor(){const c=ci.trim();if(!c||f.colors.includes(c))return;setF(p=>({...p,colors:[...p.colors,c],colorBom:{...p.colorBom,[c]:[]}}));setCi("");}
  const handleImageUpload=(e)=>{const file=e.target.files[0];if(file){const reader=new FileReader();reader.onloadend=()=>setF(p=>({...p,imageUrl:reader.result}));reader.readAsDataURL(file);}};
  
  function addBom(){
    if(!br.mat||!br.amt||!br.vid)return alert("거래처와 원부자재 정보를 입력하세요");
    const newBom={...br, id:uid(), amt:Number(br.amt), unit:br.type==="단추"?"개":"yd"};
    setF(p=>({...p,colorBom:{...p.colorBom,[selColor]:[...(p.colorBom[selColor]||[]), newBom]}}));
    setBr({type:"원단",mat:"",amt:"",vid:"",price:"",color:""});setVenSearch("");
  }

  async function save(){
    const data={...f, factory_id:f.factoryId, color_bom:f.colorBom, user_id:user.id};
    if(f.id){ await DB.update(user.token,"products",f.id,data); setProducts(ps=>ps.map(p=>p.id===f.id?{...f}:p)); }
    else{ const r=await DB.insert(user.token,"products",data); setProducts(ps=>[...ps, r[0]]); }
    setSheet(false);
  }

  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontWeight:900,fontSize:20}}>상품 관리</div><Btn ch="+ 상품 등록" sz="s" onClick={openAdd}/></div>
      {products.map(p=><Card key={p.id} st={{marginBottom:10}} onClick={()=>openEdit(p)}><div style={{fontWeight:800}}>{p.name} <Tag ch={p.season}/></div><div style={{fontSize:11,color:C.sub,marginTop:4}}>{(p.colors||[]).join(", ")}</div></Card>)}
      
      {sheet&&<Sheet title={f.id?"상품 수정":"상품 등록"} onClose={()=>setSheet(false)}>
        <StepBar cur={sheetStep} total={2}/>
        {sheetStep===0&&<>
          <Field label="상품명" req><TxtInp val={f.name} onChange={sf("name")} ph="상품명 입력"/></Field>
          <Field label="공장 선택"><DropSel val={f.factoryId} onChange={v=>{const fc=factories.find(x=>x.id===v);setF(p=>({...p,factoryId:v,factory:fc?.name,factoryTel:fc?.tel}));}} ph="공장 선택">{factories.map(fc=><option key={fc.id} value={fc.id}>{fc.name}</option>)}</DropSel></Field>
          <Field label="작업지시서"><div style={{border:`1px dashed ${C.bdr}`,borderRadius:12,padding:20,textAlign:"center"}} onClick={()=>document.getElementById('img-up').click()}>{f.imageUrl?<img src={f.imageUrl} style={{maxWidth:"100%",maxHeight:150}}/>:"📸 사진 선택"}<input id="img-up" type="file" style={{display:"none"}} onChange={handleImageUpload}/></div></Field>
          <Field label="색상 추가"><div style={{display:"flex",gap:8}}><TxtInp val={ci} onChange={setCi} ph="예: 블랙"/><button onClick={addColor} style={{background:C.acc,color:"#fff",padding:"0 15px",borderRadius:8,border:"none"}}>추가</button></div></Field>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:24}}>{f.colors.map(c=><span key={c} style={{background:C.bg,padding:"6px 12px",borderRadius:8,fontSize:13,fontWeight:600}}>{c}</span>)}</div>
          <Btn ch="다음: BOM 등록" full onClick={()=>{if(!f.name||!f.colors.length)return alert("이름과 색상을 입력하세요");setSelColor(f.colors[0]);setSheetStep(1);}}/>
        </>}
        {sheetStep===1&&<>
          <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto"}}>{f.colors.map(c=><button key={c} onClick={()=>setSelColor(c)} style={{padding:"8px 16px",borderRadius:20,border:`2px solid ${selColor===c?C.acc:C.bdr}`,background:selColor===c?C.acc:"#fff",color:selColor===c?"#fff":C.sub2,fontWeight:700}}>{c}</button>)}</div>
          {selColor&&<div style={{background:C.bg,borderRadius:16,padding:16,marginBottom:20}}>
            <div style={{fontWeight:800,marginBottom:12}}>[{selColor}] 원부자재 목록</div>
            {(f.colorBom[selColor]||[]).map(b=><div key={b.id} style={{fontSize:12,marginBottom:6}}>• {b.mat} / {b.amt}{b.unit}</div>)}
            <Divider/>
            <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>원부자재 추가</div>
            <div style={{position:"relative",marginBottom:8}}><TxtInp val={venSearch} onChange={setVenSearch} ph="거래처 검색"/>{venSearch&&!br.vid&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",zIndex:99,border:`1px solid ${C.bdr}`}}>{vendors.filter(v=>match(v.name,venSearch)).map(v=><div key={v.id} onClick={()=>{setBr(p=>({...p,vid:v.id}));setVenSearch(v.name);}} style={{padding:10}}>{v.name}</div>)}</div>}</div>
            <TxtInp val={br.mat} onChange={v=>setBr(p=>({...p,mat:v}))} ph="명칭 (예: 30수 코튼)"/>
            <div style={{display:"flex",gap:8,marginTop:8}}><TxtInp val={br.amt} onChange={v=>setBr(p=>({...p,amt:v}))} ph="소요량" type="number"/><Btn ch="+ 추가" sz="s" onClick={addBom}/></div>
          </div>}
          <div style={{display:"flex",gap:10}}><Btn ch="이전" v="w" full onClick={()=>setSheetStep(0)}/><Btn ch="최종 저장" full onClick={save}/></div>
        </>}
      </Sheet>}
    </div>
  );
}

// ── 발주 리스트 (기본) ──
function ListPage({orders,products}){
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:16}}>발주 리스트</div>
      {orders.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(o=><Card key={o.id} st={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontWeight:800}}>{o.date} 발주</div><Tag ch={o.status}/></div>
        <div style={{fontSize:13,color:C.sub2,marginTop:8}}>{(o.items||[]).length}개 품목 진행 중</div>
      </Card>)}
    </div>
  );
}

// ── 거래처 관리 (항목 복구) ──
function VendorPage({vendors,setVendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",email:"",type:"원단",address:"",bizNo:""});
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  async function save(){
    if(!f.name||!f.tel) return alert("필수 정보를 입력하세요");
    if(f.id){ await DB.update(user.token,"vendors",f.id,f); setVendors(vs=>vs.map(v=>v.id===f.id?f:v)); }
    else{ const r=await DB.insert(user.token,"vendors",{...f,user_id:user.id}); setVendors(vs=>[...vs,r[0]]); }
    setSheet(false);
  }
  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontWeight:900,fontSize:20}}>거래처 관리</div><Btn ch="+ 거래처 추가" sz="s" onClick={()=>{setF({name:"",tel:"",email:"",type:"원단",address:"",bizNo:""});setSheet(true);}}/></div>
      {vendors.map(v=><Card key={v.id} st={{marginBottom:10}} onClick={()=>{setF(v);setSheet(true);}}><div style={{fontWeight:800}}>{v.name} <Tag ch={v.type} c="#FF8A00"/></div><div style={{fontSize:12,color:C.sub,marginTop:4}}>📱 {v.tel}</div></Card>)}
      {sheet&&<Sheet title="거래처 정보" onClose={()=>setSheet(false)}>
        <Field label="거래처명" req><TxtInp val={f.name} onChange={sf("name")}/></Field>
        <Field label="연락처" req><TxtInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000"/></Field>
        <Field label="주소" req><TxtInp val={f.address} onChange={sf("address")}/></Field>
        <Field label="사업자등록번호"><TxtInp val={f.bizNo} onChange={sf("bizNo")}/></Field>
        <Field label="이메일"><TxtInp val={f.email} onChange={sf("email")}/></Field>
        <Btn ch="저장하기" full onClick={save}/>
      </Sheet>}
    </div>
  );
}

// ── 환경설정 (공장 상세항목 복구) ──
function SettingsPage({user,setUser,factories,setFactories,onLogout}){
  const [facSheet,setFacSheet]=useState(null);
  const [pfSheet,setPfSheet]=useState(false);
  const [pf,setPf]=useState({name:user.name,brand:user.brand,tel:user.tel});

  async function savePf(){
    const r=await fetch(`${SB}/auth/v1/user`,{method:"PUT",headers:ah(user.token),body:JSON.stringify({data:pf})});
    if(r.ok){ setUser(u=>({...u,...pf})); setPfSheet(false); alert("수정 완료"); }
  }
  async function saveFac(){
    if(!facSheet.name) return alert("공장명을 입력하세요");
    if(facSheet.id){ await DB.update(user.token,"factories",facSheet.id,facSheet); setFactories(fs=>fs.map(f=>f.id===facSheet.id?facSheet:f)); }
    else{ const r=await DB.insert(user.token,"factories",{...facSheet,user_id:user.id}); setFactories(fs=>[...fs,r[0]]); }
    setFacSheet(null);
  }

  return(
    <div style={{padding:"14px 14px 80px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:20}}>환경설정</div>
      <Card st={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:800,fontSize:16}}>{user.name} ({user.brand})</div><div style={{fontSize:12,color:C.sub}}>{user.email}</div></div>
          <Btn ch="수정" v="w" sz="s" onClick={()=>setPfSheet(true)}/>
        </div>
        <Divider/><Btn ch="로그아웃" v="w" full st={{color:C.red}} onClick={onLogout}/>
      </Card>
      <div style={{fontWeight:800,marginBottom:12}}>🏭 공장 관리</div>
      {factories.map(fc=><Card key={fc.id} st={{marginBottom:10}} onClick={()=>setFacSheet(fc)}><div style={{fontWeight:700}}>{fc.name}</div><div style={{fontSize:11,color:C.sub}}>{fc.tel}</div></Card>)}
      <Btn ch="+ 새 공장 등록" full v="w" onClick={()=>setFacSheet({name:"",bizNo:"",address:"",tel:"",account:""})}/>

      {pfSheet&&<Sheet title="프로필 수정" onClose={()=>setPfSheet(false)}>
        <Field label="브랜드명"><TxtInp val={pf.brand} onChange={v=>setPf(p=>({...p,brand:v}))}/></Field>
        <Field label="성함"><TxtInp val={pf.name} onChange={v=>setPf(p=>({...p,name:v}))}/></Field>
        <Field label="연락처"><TxtInp val={pf.tel} onChange={v=>setPf(p=>({...p,tel:v}))}/></Field>
        <Btn ch="저장" full onClick={savePf}/>
      </Sheet>}
      {facSheet&&<Sheet title="공장 상세 정보" onClose={()=>setFacSheet(null)}>
        <Field label="공장명" req><TxtInp val={facSheet.name} onChange={v=>setFacSheet(p=>({...p,name:v}))}/></Field>
        <Field label="사업자등록번호"><TxtInp val={facSheet.bizNo} onChange={v=>setFacSheet(p=>({...p,bizNo:v}))}/></Field>
        <Field label="주소"><TxtInp val={facSheet.address} onChange={v=>setFacSheet(p=>({...p,address:v}))}/></Field>
        <Field label="연락처"><TxtInp val={facSheet.tel} onChange={v=>setFacSheet(p=>({...p,tel:v}))}/></Field>
        <Field label="계좌번호"><TxtInp val={facSheet.account} onChange={v=>setFacSheet(p=>({...p,account:v}))}/></Field>
        <Btn ch="저장" full onClick={saveFac}/>
      </Sheet>}
    </div>
  );
}

// ── 메인 앱 ──
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
      setProducts(Array.isArray(p)?p:[]);
      setOrders(Array.isArray(o)?o:[]);
      setScreen("app");
    }catch(e){setScreen("auth");}
  }

  useEffect(()=>{
    const s=localStorage.getItem("dworks_session");
    if(s){ const u=JSON.parse(s); setUser(u); loadData(u.token); }
    else setScreen("splash");
  },[]);

  async function handleLogin(u,keep){ if(keep)localStorage.setItem("dworks_session",JSON.stringify(u)); setUser(u); loadData(u.token); }
  function handleLogout(){ localStorage.removeItem("dworks_session"); setUser(null); setScreen("auth"); }

  if(screen==="loading") return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>로딩 중...</div>;
  if(screen==="splash") return <SplashPage onStart={()=>setScreen("auth")}/>;
  if(screen==="auth"||!user) return <AuthPage onLogin={handleLogin}/>;

  const pages={
    dash:<DashPage orders={orders} products={products} onNav={setPage}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} factories={factories} user={user}/>,
    list:<ListPage orders={orders} products={products}/>,
    vendors:<VendorPage vendors={vendors} setVendors={setVendors} user={user}/>,
    settings:<SettingsPage user={user} setUser={setUser} factories={factories} setFactories={setFactories} onLogout={handleLogout}/>,
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,maxWidth:480,margin:"0 auto",position:"relative",boxShadow:"0 0 40px rgba(0,0,0,0.1)"}}>
      <div style={{background:"#fff",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${C.bdr}`}}>
        <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:20,cursor:"pointer"}}>WTMT</button>
        <span style={{fontSize:12,fontWeight:700,color:C.sub2}}>{user.brand || user.name}</span>
      </div>
      <div style={{paddingBottom:80}}>{pages[page]}</div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:`1px solid ${C.bdr}`,display:"flex",height:65,zIndex:50}}>
        {[{k:"dash",l:"대시보드"},{k:"prods",l:"상품관리"},{k:"list",l:"발주리스트"},{k:"vendors",l:"거래처"},{k:"settings",l:"설정"}].map(t=>(
          <button key={t.k} onClick={()=>setPage(t.k)} style={{flex:1,background:page===t.k?"#f3f4f6":"none",border:"none",color:page===t.k?C.acc:C.sub2,fontWeight:page===t.k?800:500,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {t.l}
          </button>
        ))}
      </div>
    </div>
  );
}
