import React, { useState, useEffect } from "react";

// ── Supabase & API 설정 (데이터 유지의 핵심) ─────────────────────────
const SB = "https://qimgostiseehdnvhmoph.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";

function ah(t){return{"apikey":KEY,"Authorization":`Bearer ${t||KEY}`,"Content-Type":"application/json","Prefer":"return=representation"};}
async function api(m,p,t,b){const r=await fetch(`${SB}${p}`,{method:m,headers:ah(t),body:b?JSON.stringify(b):undefined});return r.json();}

const DB={
  list:(t,tbl)=>api("GET",`/rest/v1/${tbl}?select=*&order=created_at.asc`,t),
  insert:(t,tbl,d)=>api("POST",`/rest/v1/${tbl}`,t,d),
  update:(t,tbl,id,d)=>api("PATCH",`/rest/v1/${tbl}?id=eq.${id}`,t,d),
  del:(t,tbl,id)=>fetch(`${SB}/rest/v1/${tbl}?id=eq.${id}`,{method:"DELETE",headers:ah(t)}),
};

// ── 디자인 가이드 (초기 세련된 스타일 복구) ───────────────────────────
const C={bg:"#F8F9FB",card:"#FFFFFF",bdr:"#E8ECF2",acc:"#3772FF",txt:"#111827",sub:"#9CA3AF",sub2:"#6B7280",ok:"#10B981",warn:"#F59E0B",red:"#EF4444",fn:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif"};
const today=()=>new Date().toISOString().slice(0,10);
const VEN_C={원단:"#3772FF",안감:"#10B981",단추:"#F59E0B",지퍼:"#8B5CF6",심지:"#06B6D4",기타:"#9CA3AF"};
const VEN_IC={원단:"🧶",안감:"📋",단추:"🔘",지퍼:"🤐",심지:"🪡",기타:"🏭"};

// ── 공통 UI 컴포넌트 (디자인 복구) ──────────────────────────────────
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#fff",ok:C.ok,d:C.bg}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,ok:"#fff",d:C.sub}[v]||"#fff";
  const bd=v==="w"?`1.5px solid ${C.bdr}`:"none";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#EDF0F5":bg,color:disabled?"#B0B8C4":cl,border:disabled?`1.5px solid ${C.bdr}`:bd,borderRadius:12,padding:sz==="s"?"8px 16px":"14px 0",fontSize:14,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:C.fn,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,width:full?"100%":"auto",boxSizing:"border-box",lineHeight:1.4,...st}}>{ch}</button>;
};

const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:"#fff",borderRadius:14,border:`1px solid ${C.bdr}`,padding:18,boxSizing:"border-box",boxShadow:"0 2px 8px rgba(0,0,0,0.03)",...st}}>{children}</div>;

const Tag=({ch,c=C.acc})=><span style={{background:c+"15",color:c,padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{ch}</span>;

function Field({label,children,req}){return<div style={{marginBottom:18}}><div style={{fontSize:13,fontWeight:700,color:C.txt,marginBottom:8}}>{label}{req&&<span style={{color:C.acc,marginLeft:2}}>*</span>}</div>{children}</div>;}

function TxtInp({val,onChange,ph,type="text"}){return<div style={{border:`1px solid ${C.bdr}`,borderRadius:10,background:"#fff",overflow:"hidden"}}><input value={val||""} onChange={e=>onChange(e.target.value)} placeholder={ph} type={type} style={{width:"100%",border:"none",outline:"none",padding:"14px",fontSize:14,fontFamily:C.fn,boxSizing:"border-box"}}/></div>;}

function DropSel({val,onChange,children,ph}){return<div style={{border:`1px solid ${C.bdr}`,borderRadius:10,background:"#fff",position:"relative"}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",padding:"14px",fontSize:14,fontFamily:C.fn,background:"transparent",WebkitAppearance:"none",cursor:"pointer"}}>{ph&&<option value="">{ph}</option>}{children}</select><div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:C.sub,fontSize:10}}>▼</div></div>;}

function Sheet({title,onClose,children}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"flex-end",zIndex:9999}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"24px 24px 0 0",padding:"0 24px 44px",width:"100%",maxHeight:"85vh",overflowY:"auto",maxWidth:480,margin:"0 auto",boxSizing:"border-box"}}>
        <div style={{width:40,height:5,background:C.bdr,borderRadius:3,margin:"12px auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><span style={{fontWeight:900,fontSize:18}}>{title}</span><button onClick={onClose} style={{background:C.bg,border:"none",width:30,height:30,borderRadius:15,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>
        {children}
      </div>
    </div>
  );
}

// ── 페이지 컴포넌트 ─────────────────────────────────────────────

function DashPage({orders}){
  return(
    <div style={{padding:16}}>
      <div style={{fontSize:22,fontWeight:900,marginBottom:20}}>대시보드</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        <Card st={{textAlign:"center",padding:24}}><div style={{fontSize:12,color:C.sub,marginBottom:8}}>오늘 발주</div><div style={{fontSize:24,fontWeight:900,color:C.acc}}>{orders.filter(o=>o.date===today()).length}건</div></Card>
        <Card st={{textAlign:"center",padding:24}}><div style={{fontSize:12,color:C.sub,marginBottom:8}}>전체 거래처</div><div style={{fontSize:24,fontWeight:900,color:C.ok}}>{localStorage.getItem('dw_v_count')||0}개</div></Card>
      </div>
    </div>
  );
}

function VendorPage({vendors,setVendors,user,loadData}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",tel:"",type:"원단"});
  async function save(){
    if(!f.name) return;
    const data={...f, user_id:user.id};
    await DB.insert(user.token,"vendors",data);
    setSheet(false); setF({name:"",tel:"",type:"원단"});
    loadData(user.token); // 저장 후 즉시 최신 데이터 로드
  }
  async function del(id){
    if(!window.confirm("삭제하시겠습니까?")) return;
    await DB.del(user.token,"vendors",id);
    loadData(user.token);
  }
  return(
    <div style={{padding:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontSize:22,fontWeight:900}}>거래처 관리</div><Btn ch="+ 추가" sz="s" onClick={()=>setSheet(true)} st={{padding:"8px 16px"}}/></div>
      {vendors.length===0?<div style={{textAlign:"center",padding:60,color:C.sub,fontSize:14}}>등록된 거래처가 없습니다.</div>:vendors.map(v=>(
        <Card key={v.id} st={{marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{VEN_IC[v.type]||"🏭"}</div>
            <div><div style={{fontWeight:800,fontSize:15,marginBottom:2}}>{v.name}</div><div style={{fontSize:12,color:C.sub}}>{v.tel || "연락처 없음"}</div></div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
            <Tag ch={v.type} c={VEN_C[v.type]}/>
            <button onClick={()=>del(v.id)} style={{border:"none",background:"none",color:C.red,fontSize:11,cursor:"pointer",padding:0}}>삭제</button>
          </div>
        </Card>
      ))}
      {sheet && <Sheet title="새 거래처 등록" onClose={()=>setSheet(false)}><Field label="거래처명" req><TxtInp val={f.name}
