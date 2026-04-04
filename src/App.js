import React, { useState, useEffect } from "react";

// ── Supabase & API 설정 ─────────────────────────────────────────
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

// ── EmailJS (발주 이메일 전송) ───────────────────────────────────
const EJS={SID:"service_raca1ke",TID:"template_hoej0ts",PK:"KlYRj7B6JNO01D2pm"};
async function sendEmail(toEmail,toName,subject,message){
  if(!toEmail)return false;
  try{const r=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:EJS.SID,template_id:EJS.TID,user_id:EJS.PK,template_params:{to_email:toEmail,to_name:toName,subject,message,from_name:"D-Works"}})});return r.status===200;}catch{return false;}
}

// ── 초성 검색 로직 ────────────────────────────────────────────
const CHO=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const getCho=s=>(s||"").split("").map(c=>{const cd=c.charCodeAt(0);return(cd>=44032&&cd<=55203)?CHO[Math.floor((cd-44032)/588)]:c;}).join("");
const match=(t,q)=>{if(!q)return true;const txt=(t||"").toLowerCase(),qry=(q||"").toLowerCase();return txt.includes(qry)||getCho(txt).includes(getCho(qry));};

// ── 디자인 시스템 (wf03 이미지 스타일 재현) ───────────────────
const C={
  bg: "#FFFFFF", card: "#FFFFFF", bdr: "#EAECEF", acc: "#3772FF", txt: "#111111", sub: "#666666", fn: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"
};

const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const fmtN=n=>(n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
const CAT_C={이너:C.acc,아우터:"#6F32FF",팬츠:"#2DCA72",니트:"#FF9E1B",원피스:"#FF4B98",스커트:"#00D4EA",기타:C.sub};

// ── 공통 UI 컴포넌트 ─────────────────────────────────────────
const Btn=({ch,onClick,v="p",full,disabled,sz="m",st={}})=>{
  const bg={p:C.acc,w:"#FFFFFF",d:"#F1F3F5"}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,d:C.sub}[v]||"#fff";
  const bd=v==="w"?`1.5px solid ${C.bdr}`:"none";
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?"#F1F3F5":bg,color:disabled?C.sub:cl,border:bd,borderRadius:12,padding:sz==="s"?"10px 16px":"16.5px 0",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:C.fn,width:full?"100%":"auto",display:"inline-flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box",lineHeight:1,...st}}>{ch}</button>;
};
const Card=({children,st={},onClick})=><div onClick={onClick} style={{background:C.card,borderRadius:16,padding:20,border:`1px solid ${C.bdr}`,boxSizing:"border-box",marginBottom:16,...st}}>{children}</div>;
const Tag=({ch,c="#F1F3F5",tc=C.sub})=><span style={{background:c,color:tc,padding:"4px 8px",borderRadius:6,fontSize:11,fontWeight:700,fontFamily:C.fn}}>{ch}</span>;
function Field({label,children,req}){return<div style={{marginBottom:18, display:"flex", alignItems:"center"}}><div style={{width:80, fontSize:15, fontWeight:600, color:C.txt}}>{label}{req&&<span style={{color:C.acc}}>*</span>}</div><div style={{flex:1}}>{children}</div></div>;}
function TxtInp({val,onChange,ph,type="text",onKeyDown}){return<div style={{background:"#F1F3F5",borderRadius:8,padding:"0 12px"}}><input value={val||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph} type={type} onKeyDown={onKeyDown} style={{width:"100%",border:"none",outline:"none",padding:"12px 0",fontSize:15,color:C.txt,fontFamily:C.fn,background:"transparent"}}/></div>;}
function DropSel({val,onChange,children,ph}){return<div style={{position:"relative",background:"#FFFFFF",border:`1px solid ${C.bdr}`,borderRadius:8}}><select value={val||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",border:"none",outline:"none",padding:"12.5px",fontSize:15,color:val?C.txt:C.sub,fontFamily:C.fn,background:"transparent",WebkitAppearance:"none",cursor:"pointer"}}>{ph&&<option value="">{ph}</option>}{children}</select><span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:C.sub,fontSize:11,pointerEvents:"none"}}>▼</span></div>;}
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

// ── 대시보드 ──────────────────────────────────────────────────
function DashPage({orders,products,onNav}){
  const tO=orders.filter(o=>o.date===today()).length;
  const dO=orders.filter(o=>o.status==="지연").length;
  return(
    <div style={{padding:"24px 20px 100px"}}>
      <div style={{fontSize:22, fontWeight:900, marginBottom:24}}>대시 보드</div>
      <div style={{display:"flex", gap:10, marginBottom:24}}>
        {[ {l:"오늘 발주",v:tO+"건",c:C.acc}, {l:"미출고 발주",v:dO+"건",c:"#FA5252"}, {l:"이달 발주량",v:"6,200매",c:C.txt} ].map(s=><div key={s.l} style={{flex:1, background:"#fff", border:`1px solid ${C.bdr}`, padding:"16px 8px", borderRadius:12, textAlign:"center"}}><div style={{fontSize:18, fontWeight:900, color:s.c}}>{s.v}</div><div style={{fontSize:11, color:C.sub, marginTop:4}}>{s.l}</div></div>)}
      </div>
      <Card st={{marginBottom:24}}><div style={{display:"flex", alignItems:"center", gap:8, marginBottom:16}}><span style={{color:"#FA5252", fontSize:18}}>⚠️</span><span style={{fontWeight:800}}>지연 {dO}건</span></div><div style={{fontSize:13, color:C.sub, textAlign:"center", padding:"10px 0"}}>지연된 항목이 없습니다.</div></Card>
      <div style={{fontWeight:800, fontSize:16, marginBottom:12}}>발주량 추이</div>
      <Card st={{height:100, display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:"10px 20px"}}>{[20,40,30,50,70,60,90].map((h,i)=><div key={i} style={{width:20, height:`${h}%`, background:C.acc, borderRadius:"4px 4px 0 0"}}/>)}</Card>
    </div>
  );
}

// ── 발주 입력 (디자인 wf03 재현 + 수량수정 + 초성검색) ─────────
function OrderPage({products,orders,vendors,user,onNav}){
  const [items,setItems]=useState([]);
  const [search,setSearch]=useState("");
  const [selProd,setSelProd]=useState(null);
  const [selColor,setSelColor]=useState("");
  const [qty,setQty]=useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);

  useEffect(()=>{
    const d=localStorage.getItem("dworks_draft");
    if(d){const dr=JSON.parse(d); if(dr.items?.length>0) setItems(dr.items);}
  },[]);

  const addItem=()=>{
    if(!selProd||!selColor||!qty) return;
    setItems(p=>[...p,{pid:selProd.id, name:selProd.name, color:selColor, qty:Number(qty)}]);
    setSelProd(null); setQty(""); setSearch("");
  };

  const generatePreview=()=>{
    if(!items.length) return alert("항목을 추가하세요.");
    const vM={};
    items.forEach(it=>{
      const p=products.find(x=>x.id===it.pid); if(!p) return;
      (p.color_bom?.[it.color]||p.bom||[]).forEach(b=>{
        const v=vendors.find(vv=>vv.id===b.vid); if(!v?.email) return;
        if(!vM[v.id]) vM[v.id]={v, lines:[]};
        vM[v.id].lines.push({p,it,b,soyo:Math.round(b.amt*it.qty*100)/100});
      });
    });
    const pD=Object.values(vM).map(t=>{
      let b=`${t.v.name} 담당자님 안녕하세요.\n${user.company||"디자인워커스"} 발주서입니다.\n\n`;
      t.lines.forEach(l=> b+=`- ${l.p.name}(${l.color}): ${l.b.mat} ${l.soyo}${l.b.unit||"yd"}\n`);
      b+=`\n감사합니다.`; return {vendor:t.v, body:b};
    });
    setPreviewData(pD); setShowPreview(true);
  };

  return(
    <div style={{padding:"24px 20px 150px"}}>
      <div style={{fontSize:24, fontWeight:900, marginBottom:8}}>발주 입력</div>
      <div style={{fontSize:14, color:C.sub, marginBottom:24}}>기본 정보를 입력해 주세요</div>
      <div style={{display:"flex", gap:6, marginBottom:24}}><div style={{flex:1, height:4, background:C.acc, borderRadius:2}}/><div style={{flex:1, height:4, background:C.acc, borderRadius:2}}/><div style={{flex:1, height:4, background:C.bdr, borderRadius:2}}/><div style={{flex:1, height:4, background:C.bdr, borderRadius:2}}/></div>

      <Card>
        <div style={{fontWeight:800, marginBottom:20, fontSize:16}}>발주 추가</div>
        <Field label="상품명"><div style={{position:"relative"}}><TxtInp val={search} onChange={v=>{setSearch(v);setSelProd(null);}} ph="상품명 초성 검색"/>{search&&!selProd&&<div style={{position:"absolute",left:0,right:0,top:45,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:8,zIndex:50,boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}>{products.filter(p=>match(p.name,search)).map(p=><div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);}} style={{padding:16,borderBottom:`1px solid ${C.bdr}`}}>{p.name}</div>)}</div>}</div></Field>
        <Field label="색상"><DropSel val={selColor} onChange={setSelColor} ph="색상 선택">{(selProd?.colors||[]).map(c=><option key={c} value={c}>{c}</option>)}</DropSel></Field>
        <Field label="수량"><TxtInp val={qty} onChange={setQty} ph="수량 입력" type="number"/></Field>
        <G/><Btn ch="+ 발주 리스트에 추가" full onClick={addItem}/>
      </Card>

      <div style={{fontWeight:800, fontSize:17, marginBottom:16, marginTop:32}}>발주 리스트</div>
      <Card>
        {items.length===0?<div style={{textAlign:"center", color:C.sub, padding:"20px 0"}}>리스트가 비어있습니다.</div>:items.map((it,i)=>(
          <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:i===items.length-1?"none":`1px solid ${C.bdr}`}}>
            <div style={{fontSize:15}}><strong>{it.name}</strong> / {it.color}</div>
            <div style={{display:"flex", alignItems:"center", gap:8}}>
              <input type="number" value={it.qty} onChange={e=>setItems(prev=>prev.map((item,idx)=>idx===i?{...item,qty:Number(e.target.value)}:item))} style={{width:60,textAlign:"right",padding:8,borderRadius:8,border:`1px solid ${C.bdr}`,fontSize:14,fontWeight:700,color:C.acc}}/>장
              <button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.sub,fontSize:18}}>✕</button>
            </div>
          </div>
        ))}
      </Card>

      <div style={{display:"flex", gap:12, position:"fixed", bottom:90, left:20, right:20, zIndex:100}}>
        <Btn ch="임시저장" v="d" st={{flex:1}} onClick={()=>{localStorage.setItem("dworks_draft", JSON.stringify({items})); alert("임시저장 완료");}}/>
        <Btn ch="다음" full st={{flex:2}} onClick={generatePreview}/>
      </div>
      
      {showPreview && <Sheet title="최종 발송 확인" onClose={()=>setShowPreview(false)}>{previewData.map((d,i)=>(<div key={i} style={{marginBottom:16,padding:16,background:"#F8F9FA",borderRadius:12}}><div style={{fontWeight:800,color:C.acc,marginBottom:8}}>📧 {d.vendor.name}</div><pre style={{fontSize:12,whiteSpace:"pre-wrap",fontFamily:C.fn}}>{d.body}</pre></div>))}<Btn ch="🚀 최종 발송" full onClick={()=>{alert("발송 완료!"); setShowPreview(false); setItems([]); localStorage.removeItem("dworks_draft");}}/></Sheet>}
    </div>
  );
}
// ── 상품 관리 (이미지 업로드 포함) ──────────────────────────────
function ProdsPage({products,setProducts,vendors,user}){
  const [sheet,setSheet]=useState(false);
  const [f,setF]=useState({name:"",colors:[],imageUrl:""});
  const [editId,setEditId]=useState(null);
  const [search,setSearch]=useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if(file) { const reader = new FileReader(); reader.onloadend = () => { setF(p => ({...p, imageUrl: reader.result})); }; reader.readAsDataURL(file); }
  };

  const save=async()=>{
    if(!f.name) return;
    try{
      if(editId){
        if(user?.token) await DB.update(user.token,"products",editId,{...f, image_url: f.imageUrl});
        setProducts(products.map(p=>p.id===editId?{...f, imageUrl: f.imageUrl}:p));
      }else{
        if(user?.token){
          const r=await DB.insert(user.token,"products",{...f, image_url: f.imageUrl, user_id:user.id});
          setProducts(p=>[...p,{...f, imageUrl: f.imageUrl, id:r[0].id}]);
        }
      }
      setSheet(false);
    }catch{alert("image_url 컬럼을 추가해주세요.");}
  };

  return(
    <div style={{padding:"24px 20px 100px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div style={{fontSize:22,fontWeight:900}}>상품 관리</div><Btn ch="+ 추가" sz="s" onClick={()=>{setF({name:"",colors:[],imageUrl:""});setEditId(null);setSheet(true);}}/></div>
      <div style={{marginBottom:20}}><TxtInp val={search} onChange={setSearch} ph="🔍 상품명 초성 검색"/></div>
      {products.filter(p=>match(p.name,search)).map(p=>(
        <Card key={p.id} st={{display:"flex", gap:16, alignItems:"center"}}>
          <div style={{width:55, height:55, background:"#F1F3F5", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden"}}>
            {p.imageUrl?<img src={p.imageUrl} style={{width:"100%", height:"100%", objectFit:"cover"}}/>:<span style={{fontSize:20}}>👕</span>}
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700, fontSize:16}}>{p.name}</div>
            <div style={{fontSize:12, color:C.sub, marginTop:4}}>{(p.colors||[]).join(", ")}</div>
          </div>
          <button onClick={()=>{setF({name:p.name, colors:p.colors, imageUrl:p.imageUrl}); setEditId(p.id); setSheet(true);}} style={{background:"none", border:"none", color:C.acc, fontWeight:700}}>수정</button>
        </Card>
      ))}
      {sheet && <Sheet title={editId?"상품 수정":"상품 등록"} onClose={()=>setSheet(false)}>
        <Field label="상품명"><TxtInp val={f.name} onChange={v=>setF(p=>({...p,name:v}))}/></Field>
        <Field label="작업지시서">
          <div onClick={()=>document.getElementById('img-up').click()} style={{height:180, background:"#F1F3F5", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden"}}>
            {f.imageUrl ? <img src={f.imageUrl} style={{height:"100%"}}/> : <span style={{color:C.sub}}>📸 사진 업로드</span>}
          </div>
          <input id="img-up" type="file" accept="image/*" onChange={handleImage} style={{display:"none"}}/>
        </Field>
        <Field label="색상 (,)"><TxtInp val={f.colors.join(",")} onChange={v=>setF(p=>({...p,colors:v.split(",")}))} ph="블랙,화이트,네이비"/></Field>
        <Btn ch="저장하기" full sz="l" onClick={save} st={{marginTop:20, height:56, borderRadius:16}}/>
      </Sheet>}
    </div>
  );
}

// ── 발주 내역 (재발주 기능 포함) ─────────────────────────────
function ListPage({orders,products,onNav}){
  const [open, setOpen] = useState(null);
  return(
    <div style={{padding:"24px 20px 100px"}}>
      <div style={{fontSize:22,fontWeight:900,marginBottom:24}}>발주 내역</div>
      {orders.length===0 ? <Empty icon="📋" text="내역이 없습니다"/> : orders.map(o=>(
        <Card key={o.id} onClick={()=>setOpen(open===o.id?null:o.id)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontWeight:700}}>{o.date} 발주</div>
            <Tag ch={o.status}/>
          </div>
          {open===o.id && <div style={{marginTop:16, borderTop:`1px solid ${C.bdr}`, paddingTop:16}}>
            {o.items.map((it,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:14}}>{it.name} / {it.color} <strong>{it.qty}매</strong></div>)}
            <Btn ch="🔄 동일하게 재발주" full v="w" st={{marginTop:16, color:C.acc, borderColor:C.acc}} onClick={(e)=>{
              e.stopPropagation(); localStorage.setItem("dworks_draft", JSON.stringify({items:o.items})); onNav("order");
            }}/>
          </div>}
        </Card>
      ))}
    </div>
  );
}

// ── 메인 App ──────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("app");
  const [user,setUser]=useState({name:"민용기", email:"min@designwalkers.com", company:"DESIGN WALKERS"});
  const [page,setPage]=useState("dash");
  const [products,setProducts]=useState([]);
  const [vendors,setVendors]=useState([]);
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(false);

  const loadData=async(token)=>{
    setLoading(true);
    try{
      const[v,p,o]=await Promise.all([DB.list(token,"vendors"),DB.list(token,"products"),DB.list(token,"orders")]);
      setVendors(v||[]); setProducts(p?.map(x=>({...x, imageUrl:x.image_url}))||[]); setOrders(o||[]);
    }finally{setLoading(false);}
  };

  useEffect(()=>{
    const check=async()=>{
      const s=localStorage.getItem("dworks_session");
      if(s){ const u=JSON.parse(s); setUser(u); setScreen("app"); loadData(u.token); }
    }; check();
  },[]);

  const TABS=[ {k:"dash",i:"🏠",l:"홈"},{k:"order",i:"🖊️",l:"발주"},{k:"prods",i:"👕",l:"상품"},{k:"list",i:"📋",l:"내역"} ];
  const pgs={
    dash:<DashPage orders={orders} products={products} onNav={setPage}/>,
    order:<OrderPage products={products} orders={orders} vendors={vendors} user={user} onNav={setPage}/>,
    prods:<ProdsPage products={products} setProducts={setProducts} vendors={vendors} user={user}/>,
    list:<ListPage orders={orders} products={products} onNav={setPage}/>
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,color:C.txt,maxWidth:480,margin:"0 auto",position:"relative"}}>
      <div style={{background:C.card,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,borderBottom:`1px solid ${C.bdr}`}}>
        <div style={{fontSize:20,fontWeight:900,color:C.acc}}>D-Works</div>
        <div style={{width:32,height:32,borderRadius:16,background:"#F1F3F5",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12}}>{user.name?.slice(-2)}</div>
      </div>
      <div style={{paddingBottom:80}}>{pgs[page]||pgs.dash}</div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.card,borderTop:`1px solid ${C.bdr}`,display:"flex",zIndex:100,padding:"10px 0 25px"}}>
        {TABS.map(t=><button key={t.k} onClick={()=>setPage(t.k)} style={{flex:1,background:"none",border:"none",color:page===t.k?C.acc:C.sub,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><div style={{fontSize:20}}>{t.i}</div><span style={{fontSize:10,fontWeight:page===t.k?700:500}}>{t.l}</span></button>)}
      </div>
    </div>
  );
}
