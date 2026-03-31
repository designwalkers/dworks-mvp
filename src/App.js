import { useState } from "react";

const C = {
  bg:"#F8F9FB", card:"#FFFFFF", card2:"#F3F6FA",
  bdr:"#E8ECF2", acc:"#3772FF", txt:"#111827", sub:"#8A96A8",
  ok:"#00C48C", warn:"#FF9500",
  fn:"'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif",
};

const uid = () => Math.random().toString(36).slice(2,8);
const fmtD = d => new Date(d).toLocaleDateString("ko-KR");
const today = () => new Date().toISOString().slice(0,10);
const fmtN = n => (n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");

const CATS = ["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const CAT_C = {이너:"#3772FF",아우터:"#9B8EFF",팬츠:"#00C48C",니트:"#FF9500",원피스:"#FF6B9D",스커트:"#00B4D8",기타:"#8A96A8"};
const VEN_TYPES = ["원단","안감","단추","지퍼","심지","기타"];
const VEN_IC = {원단:"🧶",안감:"📋",단추:"🔘",지퍼:"🤐",심지:"🪡",기타:"🏭"};
const VEN_C = {원단:"#3772FF",안감:"#00C48C",단추:"#FF9500",지퍼:"#9B8EFF",심지:"#00B4D8",기타:"#8A96A8"};
const FACTORIES = ["공장A","공장B","공장C","기타"];
const SEASONS = ["26SS","26FW","25SS","25FW"];

const INIT_VENDORS = [
  {id:"v1",name:"이레텍스",tel:"010-1234-5678",email:"order@iretex.com",type:"원단"},
  {id:"v2",name:"강남텍스타일",tel:"010-2345-6789",email:"",type:"원단"},
  {id:"v3",name:"한국단추",tel:"010-3456-7890",email:"btn@hankook.com",type:"단추"},
  {id:"v4",name:"지퍼전문",tel:"010-4567-8901",email:"",type:"지퍼"},
];
const INIT_PRODUCTS = [
  {id:"p1",name:"리켄 T",category:"이너",season:"26SS",factory:"공장A",colors:["아이보리","블랙","네이비"],bom:[{id:"b1",mat:"메인원단",amt:1.2,price:8000,vid:"v1"}]},
  {id:"p2",name:"거브 T",category:"이너",season:"26SS",factory:"공장A",colors:["베이지","화이트"],bom:[{id:"b2",mat:"메인원단",amt:1.1,price:7500,vid:"v1"}]},
  {id:"p3",name:"민스 자켓",category:"아우터",season:"26SS",factory:"공장B",colors:["네이비","카키"],bom:[{id:"b3",mat:"메인원단",amt:2.3,price:15000,vid:"v1"},{id:"b4",mat:"단추",amt:8,price:200,vid:"v3"}]},
  {id:"p4",name:"L 린츠 S",category:"팬츠",season:"26SS",factory:"공장B",colors:["카키","베이지"],bom:[{id:"b5",mat:"메인원단",amt:1.5,price:9000,vid:"v1"}]},
];
const INIT_ORDERS = [
  {id:"o1",items:[{pid:"p1",color:"아이보리",qty:200},{pid:"p2",color:"베이지",qty:150}],status:"완료",date:"2026-03-28",ts:"2026-03-28T09:00:00"},
  {id:"o2",items:[{pid:"p3",color:"네이비",qty:100}],status:"지연",date:"2026-03-29",ts:"2026-03-29T10:00:00"},
  {id:"o3",items:[{pid:"p1",color:"블랙",qty:120}],status:"지연",date:today(),ts:new Date().toISOString()},
];

// ─── UI 기본 컴포넌트 ────────────────────────────────────────

function Btn({ch, onClick, v="p", sz="m", full, disabled, st={}}) {
  const bgs = {p:C.acc, g:"#fff", ok:C.ok, warn:C.warn, d:C.card2};
  const cls = {p:"#fff", g:C.txt, ok:"#fff", warn:"#fff", d:C.sub};
  const bds = {p:"none", g:`1.5px solid ${C.bdr}`, ok:"none", warn:"none", d:"none"};
  const pds = {s:"7px 16px", m:"13px 22px", l:"15px 0"};
  const fss = {s:12, m:14, l:15};
  const brs = {s:8, m:12, l:14};
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#EDF0F5" : (bgs[v]||C.acc),
      color: disabled ? "#B0B8C4" : (cls[v]||"#fff"),
      border: disabled ? `1.5px solid ${C.bdr}` : (bds[v]||"none"),
      borderRadius: brs[sz]||12, padding: pds[sz]||pds.m,
      fontSize: fss[sz]||14, fontWeight: 700,
      cursor: disabled ? "default" : "pointer",
      fontFamily: C.fn, display:"inline-flex", alignItems:"center",
      justifyContent:"center", gap:6,
      width: full ? "100%" : "auto",
      boxSizing:"border-box", lineHeight:1.4, ...st
    }}>{ch}</button>
  );
}

// 와이어프레임 스타일 인라인 폼 행
function FRow({label, children, last, req}) {
  return (
    <div style={{
      display:"flex", alignItems:"center",
      borderBottom: last ? "none" : `1px solid ${C.bdr}`,
      minHeight:52, padding:"0 16px"
    }}>
      <div style={{width:76, fontSize:14, fontWeight:600, color:C.txt, flexShrink:0}}>
        {label}{req && <span style={{color:C.warn, marginLeft:2}}>*</span>}
      </div>
      <div style={{flex:1, display:"flex", alignItems:"center", minWidth:0}}>
        {children}
      </div>
    </div>
  );
}

function FInp({val, onChange, ph, type="text", onKeyDown}) {
  return (
    <input
      value={val||""} onChange={e => onChange && onChange(e.target.value)}
      placeholder={ph} type={type} onKeyDown={onKeyDown}
      style={{
        flex:1, border:"none", outline:"none", background:"transparent",
        fontSize:14, color:C.txt, fontFamily:C.fn,
        padding:"14px 0", minWidth:0,
        "::placeholder": {color: C.sub}
      }}
    />
  );
}

function FSel({val, onChange, children}) {
  return (
    <select
      value={val||""} onChange={e => onChange(e.target.value)}
      style={{
        flex:1, border:"none", outline:"none", background:"transparent",
        fontSize:14, color: val ? C.txt : C.sub, fontFamily:C.fn,
        padding:"14px 0", WebkitAppearance:"none"
      }}
    >
      {children}
    </select>
  );
}

// 섹션 묶음 카드
function FCard({children}) {
  return (
    <div style={{
      background:"#fff", borderRadius:14,
      border:`1px solid ${C.bdr}`, overflow:"hidden",
      marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,0.04)"
    }}>
      {children}
    </div>
  );
}

function SecTitle({ch}) {
  return <div style={{fontSize:15, fontWeight:800, color:C.txt, margin:"18px 0 8px", letterSpacing:"-0.3px"}}>{ch}</div>;
}

function Tag({ch, c=C.acc}) {
  return <span style={{background:c+"18", color:c, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700}}>{ch}</span>;
}

function Card({children, st={}, onClick}) {
  return (
    <div onClick={onClick} style={{
      background:"#fff", borderRadius:14, padding:18,
      border:`1px solid ${C.bdr}`,
      boxShadow:"0 1px 6px rgba(0,0,0,0.05)",
      boxSizing:"border-box", ...st
    }}>{children}</div>
  );
}

function Sheet({title, onClose, children}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"flex-end",zIndex:900}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#fff", borderRadius:"20px 20px 0 0",
        padding:"8px 20px 40px", width:"100%", maxHeight:"88vh",
        overflowY:"auto", boxSizing:"border-box", fontFamily:C.fn
      }}>
        <div style={{width:36,height:4,background:C.bdr,borderRadius:2,margin:"12px auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontWeight:800,fontSize:17,color:C.txt}}>{title}</span>
          <button onClick={onClose} style={{background:C.card2,border:"none",color:C.sub,cursor:"pointer",width:30,height:30,borderRadius:8,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StepDots({cur, total}) {
  return (
    <div style={{display:"flex",gap:6,marginBottom:20,alignItems:"center"}}>
      {Array.from({length:total},(_,i) => (
        <div key={i} style={{height:4,borderRadius:2,background:i===cur?C.acc:C.bdr,flex:i===cur?2:1,transition:"all 0.3s"}}/>
      ))}
    </div>
  );
}

function Empty({icon, text, sub}) {
  return (
    <div style={{textAlign:"center",padding:"48px 20px",color:C.sub}}>
      <div style={{fontSize:40,marginBottom:12}}>{icon}</div>
      <div style={{fontSize:15,fontWeight:700,color:C.txt,marginBottom:4}}>{text}</div>
      {sub && <div style={{fontSize:13}}>{sub}</div>}
    </div>
  );
}

// 간단 차트
function LineChart({data}) {
  if (!data || data.length < 2) return (
    <div style={{height:70,display:"flex",alignItems:"center",justifyContent:"center",color:C.sub,fontSize:12}}>데이터 없음</div>
  );
  const W=300, H=70, p=10;
  const vs = data.map(d=>d.v);
  const mn=Math.min(...vs), mx=Math.max(...vs), rng=mx-mn||1;
  const pts = data.map((d,i) => {
    const x = p + (i/(data.length-1))*(W-p*2);
    const y = H-p-((d.v-mn)/rng)*(H-p*2);
    return [x,y];
  });
  const pstr = pts.map(([x,y])=>`${x},${y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}>
      <polyline points={pstr} fill="none" stroke={C.acc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3.5" fill={C.acc}/>)}
    </svg>
  );
}

// ─── 1. 로그인 ───────────────────────────────────────────────
function AuthPage({onLogin}) {
  const [tab, setTab] = useState("in");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [tel, setTel] = useState("");
  const [err, setErr] = useState("");

  function submit() {
    if (!email || !pw) { setErr("이메일과 비밀번호를 입력하세요"); return; }
    if (tab==="up" && !name) { setErr("이름을 입력하세요"); return; }
    if (tab==="up" && pw !== pw2) { setErr("비밀번호가 일치하지 않습니다"); return; }
    onLogin({ id:uid(), name: name||email.split("@")[0], company, email, tel });
  }

  return (
    <div style={{minHeight:"100vh", background:"#fff", fontFamily:C.fn, color:C.txt}}>
      {/* 헤더 */}
      <div style={{padding:"52px 24px 28px", borderBottom:`1px solid ${C.bdr}`}}>
        <div style={{fontSize:34, fontWeight:900, color:C.acc, letterSpacing:1}}>D-Works</div>
        <div style={{fontSize:14, color:C.sub, marginTop:6}}>의류 생산 발주 자동화</div>
      </div>

      <div style={{padding:"0 20px 40px", background:C.bg, minHeight:"calc(100vh - 118px)"}}>
        {/* 탭 */}
        <div style={{display:"flex", borderBottom:`1.5px solid ${C.bdr}`, marginBottom:20, marginTop:20}}>
          {[["in","로그인"],["up","회원가입"]].map(([k,l]) => (
            <button key={k} onClick={()=>{setTab(k);setErr("");}} style={{
              flex:1, padding:"13px 0", background:"none", border:"none",
              borderBottom:`2.5px solid ${tab===k?C.acc:"transparent"}`,
              color: tab===k ? C.acc : C.sub,
              fontWeight:700, fontSize:15, cursor:"pointer",
              fontFamily:C.fn, marginBottom:-2
            }}>{l}</button>
          ))}
        </div>

        {tab==="up" && (
          <FCard>
            <FRow label="이름" req>
              <FInp val={name} onChange={setName} ph="홍길동"/>
            </FRow>
            <FRow label="업체명" last>
              <FInp val={company} onChange={setCompany} ph="주식회사 디자인워커스"/>
            </FRow>
          </FCard>
        )}

        <FCard>
          <FRow label="이메일" req>
            <FInp val={email} onChange={setEmail} ph="이메일 입력" type="email"/>
            {tab==="up" && <Btn ch="인증" v="d" sz="s"/>}
          </FRow>
          <FRow label="비밀번호" req last={tab==="in"}>
            <FInp val={pw} onChange={setPw} ph="비밀번호 입력" type="password"
              onKeyDown={e => e.key==="Enter" && submit()}/>
          </FRow>
          {tab==="up" && <>
            <FRow label="비밀번호 확인" req>
              <FInp val={pw2} onChange={setPw2} ph="비밀번호 재입력" type="password"/>
            </FRow>
            <FRow label="연락처" last>
              <FInp val={tel} onChange={setTel} ph="휴대폰 번호 (* 제외)" type="tel"/>
              <Btn ch="인증" v="d" sz="s"/>
            </FRow>
          </>}
        </FCard>

        {tab==="up" && (
          <div style={{marginBottom:16}}>
            {["(필수) 이용약관에 동의합니다","(필수) 개인정보 수집 및 이용에 동의합니다"].map(t => (
              <label key={t} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:C.sub,cursor:"pointer",marginBottom:10}}>
                <input type="checkbox" style={{width:18,height:18,accentColor:C.acc}}/>{t}
              </label>
            ))}
          </div>
        )}

        {err && <div style={{color:"#E53E3E",fontSize:13,marginBottom:14,padding:"11px 16px",background:"#FFF5F5",borderRadius:10,border:"1px solid #FED7D7"}}>{err}</div>}

        <Btn ch={tab==="in"?"로그인":"가입하기"} onClick={submit} full sz="l" st={{borderRadius:14,height:52,fontSize:16,marginTop:4}}/>

        {tab==="in" && (
          <div style={{textAlign:"center",marginTop:18,color:C.sub,fontSize:13}}>
            계정이 없으신가요?{" "}
            <span onClick={()=>setTab("up")} style={{color:C.acc,fontWeight:700,cursor:"pointer"}}>회원가입</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 2. 대시보드 ─────────────────────────────────────────────
function DashPage({user, orders, products, onNav}) {
  const td = today();
  const yest = new Date(); yest.setDate(yest.getDate()-1);
  const yd = yest.toISOString().slice(0,10);
  const todayOrders = orders.filter(o=>o.date===td);
  const yesterdayOrders = orders.filter(o=>o.date===yd);
  const monthQty = orders.filter(o=>o.date.slice(0,7)===td.slice(0,7)).reduce((s,o)=>s+o.items.reduce((ss,i)=>ss+i.qty,0),0);
  const delayed = orders.filter(o=>o.status==="지연");

  const chartData = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(6-i));
    const ds=d.toISOString().slice(0,10);
    const v=orders.filter(o=>o.date===ds).reduce((s,o)=>s+o.items.reduce((ss,ii)=>ss+ii.qty,0),0);
    return {label:ds.slice(5), v};
  });

  return (
    <div style={{padding:"16px 16px 90px"}}>
      {/* 통계 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {[
          {label:"오늘 발주",val:`${todayOrders.length}건`,c:C.acc},
          {label:"어제 발주",val:`${yesterdayOrders.length}건`,c:"#9B8EFF"},
          {label:"이번달 발주량",val:`${fmtN(monthQty)}매`,c:C.ok},
        ].map(s=>(
          <Card key={s.label} st={{padding:14,textAlign:"center"}}>
            <div style={{color:s.c,fontSize:22,fontWeight:900,letterSpacing:"-0.5px"}}>{s.val}</div>
            <div style={{color:C.sub,fontSize:11,marginTop:4,fontWeight:600}}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* 지연 */}
      <Card st={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontWeight:800,fontSize:15}}><span style={{color:C.warn}}>⚠️ 지연</span> {delayed.length}건</span>
          {delayed.length>0 && <Btn ch="전체보기 →" v="g" sz="s" onClick={()=>onNav("list")}/>}
        </div>
        {delayed.length===0
          ? <div style={{textAlign:"center",padding:"16px 0",color:C.sub,fontSize:13}}>지연 발주 없음 ✅</div>
          : <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 60px 56px",gap:6,padding:"6px 0",borderBottom:`1px solid ${C.bdr}`,marginBottom:6}}>
              {["상품명","색상","수량","상태"].map(h=><div key={h} style={{fontSize:11,fontWeight:700,color:C.sub}}>{h}</div>)}
            </div>
            {delayed.slice(0,4).flatMap(o=>o.items.map((it,j)=>{
              const p=products.find(x=>x.id===it.pid);
              return (
                <div key={`${o.id}-${j}`} style={{display:"grid",gridTemplateColumns:"1fr 1fr 60px 56px",gap:6,padding:"8px 0",borderBottom:`1px solid ${C.bdr}`,alignItems:"center"}}>
                  <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p?.name||"-"}</div>
                  <div style={{fontSize:13,color:C.sub}}>{it.color}</div>
                  <div style={{fontSize:13,fontWeight:700}}>{fmtN(it.qty)}</div>
                  <Tag ch="지연" c={C.warn}/>
                </div>
              );
            }))}
          </>
        }
      </Card>

      {/* 차트 */}
      <Card>
        <div style={{fontWeight:800,fontSize:15,marginBottom:14}}>📈 발주량 추이 (최근 7일)</div>
        <LineChart data={chartData}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
          {chartData.filter((_,i)=>i%2===0).map(d=><span key={d.label} style={{fontSize:10,color:C.sub}}>{d.label}</span>)}
        </div>
      </Card>
    </div>
  );
}

// ─── 3. 발주 입력 ────────────────────────────────────────────
function OrderPage({products, orders, setOrders}) {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selProd, setSelProd] = useState(null);
  const [selColor, setSelColor] = useState("");
  const [qty, setQty] = useState("");

  const filtered = products.filter(p=>p.name.includes(search)||p.season.includes(search));

  function addItem() {
    if (!selProd||!selColor||!qty) { alert("상품, 색상, 수량을 모두 입력해주세요"); return; }
    const idx = items.findIndex(i=>i.pid===selProd.id&&i.color===selColor);
    if (idx>=0) setItems(prev=>prev.map((it,i)=>i===idx?{...it,qty:it.qty+Number(qty)}:it));
    else setItems(prev=>[...prev,{pid:selProd.id,color:selColor,qty:Number(qty)}]);
    setSelProd(null); setSelColor(""); setQty(""); setSearch("");
  }

  function submit() {
    if (!items.length) { alert("발주 항목을 추가해주세요"); return; }
    setOrders(prev=>[...prev,{id:uid(),items,status:"진행중",date:today(),ts:new Date().toISOString()}]);
    setStep(3);
  }

  function sendMail() {
    const lines = items.map(it=>{const p=products.find(x=>x.id===it.pid);return `• ${p?.name||"?"} / ${it.color} / ${fmtN(it.qty)}장`;}).join("\n");
    const body = encodeURIComponent(`발주서 보내드립니다.\n\n발주일: ${today()}\n\n[발주 내역]\n${lines}\n\n감사합니다.\n---\nD-Works`);
    window.open(`mailto:?subject=${encodeURIComponent("[D-Works 발주서] "+today())}&body=${body}`);
  }

  function reset() { setStep(1); setItems([]); setSearch(""); setSelProd(null); setSelColor(""); setQty(""); }

  if (step===3) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",padding:24}}>
      <div style={{fontSize:60,marginBottom:16}}>✅</div>
      <div style={{fontWeight:900,fontSize:24,marginBottom:8}}>발주 완료!</div>
      <div style={{color:C.sub,marginBottom:28,fontSize:14}}>{items.length}개 상품 발주</div>
      <Btn ch="+ 새 발주 입력" onClick={reset} sz="l"/>
    </div>
  );

  return (
    <div style={{padding:"16px 16px 90px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:step===1?"22px":"22px",fontWeight:900,letterSpacing:"-0.5px"}}>{step===1?"발주하기":"발주서 확인"}</div>
        <div style={{color:C.sub,fontSize:13,marginTop:4}}>기본 정보를 입력해 주세요</div>
        <div style={{marginTop:14}}><StepDots cur={step-1} total={4}/></div>
      </div>

      {step===1 && <>
        {/* 발주 추가 */}
        <SecTitle ch="발주 추가"/>
        <FCard>
          <FRow label="상품명">
            <div style={{flex:1,position:"relative"}}>
              <FInp val={search} onChange={v=>{setSearch(v);if(selProd&&v!==selProd.name)setSelProd(null);}} ph="상품명 검색"/>
              {search && !selProd && filtered.length>0 && (
                <div style={{position:"absolute",top:"100%",left:-16,right:-16,background:"#fff",border:`1.5px solid ${C.bdr}`,borderRadius:12,zIndex:50,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",maxHeight:200,overflowY:"auto"}}>
                  {filtered.map(p=>(
                    <div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);setSelColor("");}}
                      style={{padding:"12px 16px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer"}}>
                      <div style={{fontWeight:700,fontSize:14}}>{p.name}</div>
                      <div style={{color:C.sub,fontSize:12,marginTop:2}}>{p.season} · {p.colors.join(", ")}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FRow>
          <FRow label="색상">
            <FSel val={selColor} onChange={setSelColor}>
              <option value="">색상 선택</option>
              {(selProd?.colors||[]).map(c=><option key={c} value={c}>{c}</option>)}
            </FSel>
            <span style={{color:C.sub,fontSize:18}}>›</span>
          </FRow>
          <FRow label="수량" last>
            <FInp val={qty} onChange={setQty} ph="수량 입력" type="number"/>
            <span style={{color:C.sub,fontSize:14,marginRight:4}}>장</span>
          </FRow>
        </FCard>
        <Btn ch="+ 발주 리스트에 추가" full onClick={addItem} disabled={!selProd||!selColor||!qty} st={{marginBottom:16}}/>

        {/* 발주 리스트 */}
        <SecTitle ch="발주 리스트"/>
        <FCard>
          {items.length===0
            ? <div style={{padding:"20px 16px",color:C.sub,fontSize:13,textAlign:"center"}}>추가된 항목이 없습니다</div>
            : items.map((it,i)=>{
                const p=products.find(x=>x.id===it.pid);
                return (
                  <FRow key={i} label={p?.name||"-"} last={i===items.length-1}>
                    <span style={{color:C.sub,fontSize:13}}>{it.color}</span>
                    <span style={{fontWeight:700,color:C.acc,marginLeft:"auto",marginRight:8}}>{fmtN(it.qty)}장</span>
                    <button onClick={()=>setItems(prev=>prev.filter((_,j)=>j!==i))}
                      style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:18,lineHeight:1}}>✕</button>
                  </FRow>
                );
              })
          }
        </FCard>

        <div style={{display:"flex",gap:10,marginTop:4}}>
          <Btn ch="임시저장" v="g" full st={{flex:1}}/>
          <Btn ch="다음" full st={{flex:2}} onClick={()=>items.length?setStep(2):alert("발주 항목을 추가하세요")} disabled={!items.length}/>
        </div>
      </>}

      {step===2 && <>
        <FCard>
          <div style={{padding:"14px 16px",fontWeight:800,fontSize:15,borderBottom:`1px solid ${C.bdr}`}}>📋 발주 내역</div>
          {items.map((it,i)=>{
            const p=products.find(x=>x.id===it.pid);
            return (
              <FRow key={i} label={p?.name||"-"} last={i===items.length-1}>
                <span style={{color:C.sub,fontSize:13}}>{it.color} · {p?.factory||"-"}</span>
                <span style={{fontWeight:800,color:C.acc,marginLeft:"auto",fontSize:15}}>{fmtN(it.qty)}장</span>
              </FRow>
            );
          })}
        </FCard>
        <Card st={{marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:700}}>총 수량</span>
          <span style={{fontWeight:900,color:C.acc,fontSize:18}}>{fmtN(items.reduce((s,it)=>s+it.qty,0))}장</span>
        </Card>
        <Btn ch="📧 이메일 발송" v="g" full st={{marginBottom:10}} onClick={sendMail}/>
        <div style={{display:"flex",gap:10}}>
          <Btn ch="← 수정" v="g" full st={{flex:1}} onClick={()=>setStep(1)}/>
          <Btn ch="발주 완료" full st={{flex:2,background:C.ok}} onClick={submit}/>
        </div>
      </>}
    </div>
  );
}

// ─── 4. 상품 관리 ────────────────────────────────────────────
function ProdsPage({products, setProducts, vendors}) {
  const [catFilter, setCatFilter] = useState("전체");
  const [sheet, setSheet] = useState(false);
  const [f, setF] = useState({name:"",category:"",season:"26SS",factory:"",colors:[],bom:[]});
  const [colorInp, setColorInp] = useState("");
  const [bomRow, setBomRow] = useState({mat:"",amt:"",price:"",vid:""});
  const sf = k => v => setF(p=>({...p,[k]:v}));

  const filtered = catFilter==="전체" ? products : products.filter(p=>p.category===catFilter);

  function openAdd() { setF({name:"",category:"",season:"26SS",factory:"",colors:[],bom:[]}); setColorInp(""); setBomRow({mat:"",amt:"",price:"",vid:""}); setSheet(true); }
  function openEdit(p) { setF({...p,colors:[...p.colors],bom:p.bom.map(b=>({...b}))}); setColorInp(""); setBomRow({mat:"",amt:"",price:"",vid:""}); setSheet(true); }

  function addColor() {
    const c=colorInp.trim();
    if (!c||f.colors.includes(c)) return;
    setF(p=>({...p,colors:[...p.colors,c]}));
    setColorInp("");
  }
  function addBom() {
    if (!bomRow.mat||!bomRow.amt) return;
    setF(p=>({...p,bom:[...p.bom,{...bomRow,id:uid(),amt:Number(bomRow.amt),price:Number(bomRow.price)}]}));
    setBomRow({mat:"",amt:"",price:"",vid:""});
  }
  function save() {
    if (!f.name) return;
    setProducts(f.id ? products.map(p=>p.id===f.id?f:p) : [...products,{...f,id:uid()}]);
    setSheet(false);
  }
  function del(id) { if(window.confirm("삭제하시겠습니까?")) setProducts(products.filter(p=>p.id!==id)); }

  return (
    <div style={{padding:"16px 16px 90px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:20,fontWeight:900}}>상품 관리</div>
        <Btn ch="+ 상품 추가" sz="s" onClick={openAdd}/>
      </div>

      {/* 카테고리 필터 */}
      <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {["전체",...CATS].map(cat=>{
          const cnt = cat==="전체" ? products.length : products.filter(p=>p.category===cat).length;
          const act = catFilter===cat;
          return (
            <button key={cat} onClick={()=>setCatFilter(cat)} style={{
              padding:"8px 16px",borderRadius:20,whiteSpace:"nowrap",flexShrink:0,
              border:`1.5px solid ${act?(CAT_C[cat]||C.acc):C.bdr}`,
              background:act?(CAT_C[cat]||C.acc):"#fff",
              color:act?"#fff":C.sub, fontWeight:700, fontSize:13,
              cursor:"pointer", fontFamily:C.fn,
              display:"flex",alignItems:"center",gap:5
            }}>
              {cat}
              <span style={{background:act?"rgba(255,255,255,0.25)":"#F3F6FA",color:act?"#fff":(CAT_C[cat]||C.sub),borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:800}}>{cnt}</span>
            </button>
          );
        })}
      </div>

      {filtered.length===0
        ? <Empty icon="👕" text="등록된 상품이 없습니다" sub="상품을 추가해주세요"/>
        : filtered.map(p=>(
          <Card key={p.id} st={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:8}}>
                  <span style={{fontWeight:800,fontSize:16}}>{p.name}</span>
                  {p.category && <Tag ch={p.category} c={CAT_C[p.category]||C.sub}/>}
                  <Tag ch={p.season} c={C.acc}/>
                  {p.factory && <span style={{color:C.sub,fontSize:12}}>{p.factory}</span>}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:4}}>
                  {p.colors.map(c=><span key={c} style={{background:C.card2,borderRadius:20,padding:"3px 10px",fontSize:12,color:C.txt,border:`1px solid ${C.bdr}`}}>{c}</span>)}
                </div>
                <div style={{color:C.sub,fontSize:12}}>BOM {p.bom.length}종</div>
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:8}}>
                <Btn ch="수정" v="g" sz="s" onClick={()=>openEdit(p)}/>
                <Btn ch="삭제" v="g" sz="s" st={{color:C.warn}} onClick={()=>del(p.id)}/>
              </div>
            </div>
          </Card>
        ))
      }

      {sheet && (
        <Sheet title={f.id?"상품 수정":"1단계 원단 입력"} onClose={()=>setSheet(false)}>
          <StepDots cur={0} total={4}/>

          <SecTitle ch="기본 정보"/>
          <FCard>
            <FRow label="상품명" req>
              <FInp val={f.name} onChange={sf("name")} ph="상품명 입력"/>
            </FRow>
            <FRow label="시즌">
              <FSel val={f.season} onChange={sf("season")}>
                {SEASONS.map(s=><option key={s} value={s}>{s}</option>)}
              </FSel>
              <span style={{color:C.sub,fontSize:18}}>›</span>
            </FRow>
            <FRow label="공장" last>
              <FSel val={f.factory} onChange={sf("factory")}>
                <option value="">선택</option>
                {FACTORIES.map(fc=><option key={fc} value={fc}>{fc}</option>)}
              </FSel>
              <span style={{color:C.sub,fontSize:18}}>›</span>
            </FRow>
          </FCard>

          <SecTitle ch="카테고리"/>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
            {CATS.map(cat=>{
              const act=f.category===cat;
              return <button key={cat} onClick={()=>sf("category")(cat)} style={{
                padding:"8px 18px",borderRadius:20,
                border:`1.5px solid ${act?(CAT_C[cat]||C.acc):C.bdr}`,
                background:act?(CAT_C[cat]||C.acc):"#fff",
                color:act?"#fff":C.sub,fontWeight:700,fontSize:13,
                cursor:"pointer",fontFamily:C.fn
              }}>{cat}</button>;
            })}
          </div>

          <SecTitle ch="원단 정보"/>
          <FCard>
            <FRow label="원단명">
              <FInp val={bomRow.mat} onChange={v=>setBomRow(r=>({...r,mat:v}))} ph="원단명 입력"/>
            </FRow>
            <FRow label="색상">
              <div style={{flex:1,display:"flex",flexWrap:"wrap",gap:6,padding:"8px 0",alignItems:"center"}}>
                {f.colors.map(c=>(
                  <span key={c} style={{background:C.card2,borderRadius:20,padding:"4px 10px",fontSize:12,display:"flex",alignItems:"center",gap:4,border:`1px solid ${C.bdr}`}}>
                    {c}
                    <button onClick={()=>setF(p=>({...p,colors:p.colors.filter(x=>x!==c)}))}
                      style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:12,lineHeight:1,padding:0}}>✕</button>
                  </span>
                ))}
                <div style={{display:"flex",gap:4}}>
                  <input value={colorInp} onChange={e=>setColorInp(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&addColor()}
                    placeholder="색상 추가"
                    style={{border:`1px solid ${C.bdr}`,borderRadius:8,padding:"4px 8px",fontSize:12,fontFamily:C.fn,outline:"none",width:80}}/>
                  <button onClick={addColor} style={{background:C.acc,border:"none",color:"#fff",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:C.fn}}>+</button>
                </div>
              </div>
            </FRow>
            <FRow label="소요량">
              <FInp val={bomRow.amt} onChange={v=>setBomRow(r=>({...r,amt:v}))} ph="0.0" type="number"/>
            </FRow>
            <FRow label="단가" last>
              <FInp val={bomRow.price} onChange={v=>setBomRow(r=>({...r,price:v}))} ph="0" type="number"/>
            </FRow>
          </FCard>

          <SecTitle ch="업체 정보"/>
          <FCard>
            <FRow label="업체명" last>
              <FSel val={bomRow.vid} onChange={v=>setBomRow(r=>({...r,vid:v}))}>
                <option value="">업체명 선택</option>
                {vendors.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
              </FSel>
              <span style={{color:C.sub,fontSize:18}}>›</span>
            </FRow>
          </FCard>

          {f.bom.length>0 && (
            <div style={{marginBottom:10}}>
              {f.bom.map(b=>(
                <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:10,padding:"11px 16px",marginBottom:8}}>
                  <div>
                    <span style={{fontWeight:700}}>{b.mat}</span>
                    <span style={{color:C.sub,fontSize:12,marginLeft:8}}>{b.amt}yd · {fmtN(b.price)}원</span>
                  </div>
                  <button onClick={()=>setF(p=>({...p,bom:p.bom.filter(x=>x.id!==b.id)}))}
                    style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:18}}>✕</button>
                </div>
              ))}
            </div>
          )}
          <Btn ch="+ 원단 추가" v="g" full st={{marginBottom:20}} onClick={addBom}/>

          <div style={{display:"flex",gap:10}}>
            <Btn ch="임시저장" v="g" full st={{flex:1}} onClick={()=>setSheet(false)}/>
            <Btn ch="저장" full st={{flex:2}} onClick={save} disabled={!f.name}/>
          </div>
        </Sheet>
      )}
    </div>
  );
}

// ─── 5. 발주 리스트 ──────────────────────────────────────────
function ListPage({orders, setOrders, products}) {
  const [filter, setFilter] = useState("전체");
  const [open, setOpen] = useState(null);
  const STATUSES = ["전체","진행중","완료","지연"];
  const SC = {완료:C.ok,지연:C.warn,진행중:C.acc};
  const filtered = (filter==="전체"?orders:orders.filter(o=>o.status===filter)).sort((a,b)=>new Date(b.ts)-new Date(a.ts));

  return (
    <div style={{padding:"16px 16px 90px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:20,fontWeight:900}}>발주 리스트</div>
        <Tag ch={`${orders.length}건`} c={C.sub}/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {STATUSES.map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{
            padding:"7px 16px",borderRadius:20,flexShrink:0,
            border:`1.5px solid ${filter===s?C.acc:C.bdr}`,
            background:filter===s?C.acc+"18":"#fff",
            color:filter===s?C.acc:C.sub,fontWeight:700,fontSize:13,
            cursor:"pointer",fontFamily:C.fn,whiteSpace:"nowrap"
          }}>{s}</button>
        ))}
      </div>
      {filtered.length===0
        ? <Empty icon="📋" text="발주 내역이 없습니다"/>
        : filtered.map(o=>{
          const tot=o.items.reduce((s,i)=>s+i.qty,0);
          const isOpen=open===o.id;
          return (
            <Card key={o.id} st={{marginBottom:12,cursor:"pointer"}} onClick={()=>setOpen(isOpen?null:o.id)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>
                    {o.items.map(it=>products.find(x=>x.id===it.pid)?.name||"-").join(", ")}
                  </div>
                  <div style={{color:C.sub,fontSize:12}}>{o.date} · 총 {fmtN(tot)}장</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <Tag ch={o.status} c={SC[o.status]||C.sub}/>
                  <span style={{color:C.sub}}>{isOpen?"▲":"▼"}</span>
                </div>
              </div>
              {isOpen && (
                <div onClick={e=>e.stopPropagation()}>
                  <div style={{height:1,background:C.bdr,margin:"12px 0"}}/>
                  {o.items.map((it,j)=>{
                    const p=products.find(x=>x.id===it.pid);
                    return (
                      <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.bdr}`,fontSize:14}}>
                        <span style={{fontWeight:600}}>{p?.name}</span>
                        <span>{it.color} · <strong>{fmtN(it.qty)}</strong>장</span>
                      </div>
                    );
                  })}
                  <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
                    {["진행중","완료","지연"].map(st=>(
                      <Btn key={st} ch={st} sz="s"
                        v={o.status===st?"p":"g"}
                        st={o.status===st?{}:{color:SC[st]||C.sub}}
                        onClick={()=>setOrders(prev=>prev.map(x=>x.id===o.id?{...x,status:st}:x))}/>
                    ))}
                    <Btn ch="삭제" sz="s" v="g" st={{color:C.warn,marginLeft:"auto"}}
                      onClick={()=>{if(window.confirm("삭제?"))setOrders(prev=>prev.filter(x=>x.id!==o.id));}}/>
                  </div>
                </div>
              )}
            </Card>
          );
        })
      }
    </div>
  );
}

// ─── 6. 거래처 ───────────────────────────────────────────────
function VendorPage({vendors, setVendors}) {
  const [sheet, setSheet] = useState(false);
  const [f, setF] = useState({name:"",tel:"",email:"",type:"원단"});
  const [editId, setEditId] = useState(null);
  const sf = k => v => setF(p=>({...p,[k]:v}));

  function openAdd() { setF({name:"",tel:"",email:"",type:"원단"}); setEditId(null); setSheet(true); }
  function openEdit(v) { setF({...v}); setEditId(v.id); setSheet(true); }
  function save() {
    if (!f.name) return;
    setVendors(editId ? vendors.map(v=>v.id===editId?{...f,id:editId}:v) : [...vendors,{...f,id:uid()}]);
    setSheet(false);
  }

  return (
    <div style={{padding:"16px 16px 90px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontSize:20,fontWeight:900}}>거래처 관리</div>
        <Btn ch="+ 거래처 추가" sz="s" onClick={openAdd}/>
      </div>
      {/* 유형 요약 */}
      <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {VEN_TYPES.filter(t=>vendors.some(v=>v.type===t)).map(t=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:6,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:20,padding:"6px 14px",flexShrink:0}}>
            <span>{VEN_IC[t]}</span>
            <span style={{fontSize:12,fontWeight:700,color:VEN_C[t]||C.sub}}>{t}</span>
            <span style={{fontSize:12,fontWeight:800}}>{vendors.filter(v=>v.type===t).length}</span>
          </div>
        ))}
      </div>
      {vendors.length===0
        ? <Empty icon="🏭" text="등록된 거래처가 없습니다"/>
        : vendors.map(v=>(
          <Card key={v.id} st={{marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:(VEN_C[v.type]||C.sub)+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                {VEN_IC[v.type]||"🏭"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{fontWeight:800,fontSize:15}}>{v.name}</span>
                  <Tag ch={v.type} c={VEN_C[v.type]||C.sub}/>
                </div>
                <div style={{color:C.sub,fontSize:13}}>{v.tel||"연락처 없음"}</div>
                <div style={{fontSize:12,color:v.email?C.sub:C.warn,marginTop:2}}>{v.email||"⚠️ 이메일 미등록"}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                <Btn ch="수정" v="g" sz="s" onClick={()=>openEdit(v)}/>
                <Btn ch="삭제" v="g" sz="s" st={{color:C.warn}} onClick={()=>{if(window.confirm("삭제?"))setVendors(vv=>vv.filter(x=>x.id!==v.id));}}/>
              </div>
            </div>
          </Card>
        ))
      }
      {sheet && (
        <Sheet title={editId?"거래처 수정":"거래처 추가"} onClose={()=>setSheet(false)}>
          <SecTitle ch="기본 정보"/>
          <FCard>
            <FRow label="거래처명" req>
              <FInp val={f.name} onChange={sf("name")} ph="이레텍스"/>
            </FRow>
            <FRow label="전화번호">
              <FInp val={f.tel} onChange={sf("tel")} ph="010-0000-0000" type="tel"/>
            </FRow>
            <FRow label="이메일" last>
              <FInp val={f.email} onChange={sf("email")} ph="order@fabric.com" type="email"/>
            </FRow>
          </FCard>
          <SecTitle ch="업체 유형"/>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>
            {VEN_TYPES.map(t=>{
              const act=f.type===t;
              return <button key={t} onClick={()=>sf("type")(t)} style={{
                padding:"9px 18px",borderRadius:20,
                border:`1.5px solid ${act?(VEN_C[t]||C.acc):C.bdr}`,
                background:act?(VEN_C[t]||C.acc):"#fff",
                color:act?"#fff":C.sub,fontWeight:700,fontSize:13,
                cursor:"pointer",fontFamily:C.fn,display:"flex",alignItems:"center",gap:5
              }}>{VEN_IC[t]} {t}</button>;
            })}
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn ch="취소" v="g" full st={{flex:1}} onClick={()=>setSheet(false)}/>
            <Btn ch="저장" full st={{flex:2}} onClick={save}/>
          </div>
        </Sheet>
      )}
    </div>
  );
}

// ─── 7. 설정 ─────────────────────────────────────────────────
function SettingsPage({user, vendors, onLogout, onNav}) {
  return (
    <div style={{padding:"16px 16px 90px"}}>
      <div style={{fontSize:20,fontWeight:900,marginBottom:20}}>환경설정</div>
      <Card st={{marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:48,height:48,borderRadius:24,background:C.acc+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>👤</div>
          <div>
            <div style={{fontWeight:800,fontSize:15}}>{user.name}</div>
            <div style={{color:C.sub,fontSize:13,marginTop:2}}>{user.email}</div>
            {user.company&&<div style={{color:C.sub,fontSize:12,marginTop:1}}>{user.company}</div>}
          </div>
        </div>
        <div style={{height:1,background:C.bdr,margin:"14px 0"}}/>
        <Btn ch="로그아웃" v="g" full st={{color:C.warn}} onClick={onLogout}/>
      </Card>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:700}}>🏭 거래처 관리</div>
            <div style={{color:C.sub,fontSize:13,marginTop:4}}>{vendors.length}개 등록됨</div>
          </div>
          <Btn ch="관리 →" v="g" sz="s" onClick={()=>onNav("vendors")}/>
        </div>
      </Card>
    </div>
  );
}

// ─── 앱 루트 ─────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dash");
  const [vendors, setVendors] = useState(INIT_VENDORS);
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [orders, setOrders] = useState(INIT_ORDERS);

  if (!user) return <AuthPage onLogin={setUser}/>;

  const tabs = [
    {k:"order",i:"📝",l:"발주하기"},
    {k:"prods",i:"👕",l:"상품"},
    {k:"list",i:"📋",l:"발주리스트"},
    {k:"vendors",i:"🏭",l:"거래처"},
    {k:"settings",i:"⚙️",l:"설정"},
  ];

  const pageMap = {
    dash:     <DashPage user={user} orders={orders} products={products} onNav={setPage}/>,
    order:    <OrderPage products={products} orders={orders} setOrders={setOrders}/>,
    prods:    <ProdsPage products={products} setProducts={setProducts} vendors={vendors}/>,
    list:     <ListPage orders={orders} setOrders={setOrders} products={products}/>,
    vendors:  <VendorPage vendors={vendors} setVendors={setVendors}/>,
    settings: <SettingsPage user={user} vendors={vendors} onLogout={()=>setUser(null)} onNav={setPage}/>,
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.fn,color:C.txt}}>
      {/* 헤더 */}
      <div style={{background:"#fff",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,borderBottom:`1px solid ${C.bdr}`,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
        <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:20,cursor:"pointer",fontFamily:C.fn,letterSpacing:1}}>D-Works</button>
        <span style={{color:C.sub,fontSize:13}}>{user.name}</span>
      </div>

      {/* 콘텐츠 */}
      <div style={{paddingBottom:80}}>
        {pageMap[page] || pageMap["dash"]}
      </div>

      {/* 하단 탭 */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:`1px solid ${C.bdr}`,display:"flex",zIndex:100,boxShadow:"0 -2px 12px rgba(0,0,0,0.06)"}}>
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setPage(t.k)} style={{
            flex:1,padding:"10px 4px 10px",background:"none",border:"none",
            color:page===t.k?C.acc:C.sub,cursor:"pointer",fontFamily:C.fn,
            display:"flex",flexDirection:"column",alignItems:"center",gap:3
          }}>
            <div style={{width:32,height:32,borderRadius:10,background:page===t.k?C.acc+"15":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:18}}>{t.i}</span>
            </div>
            <span style={{fontSize:10,fontWeight:page===t.k?700:500}}>{t.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
