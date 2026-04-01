import { useState, useEffect } from "react";

// ── EmailJS ───────────────────────────────────────────────────
const EJS = {
  SERVICE_ID:  "service_raca1ke",
  TEMPLATE_ID: "template_hoej0ts",
  PUBLIC_KEY:  "KlYRj7B6JNO01D2pm",
};
async function sendEmailJS(toEmail, toName, subject, message) {
  if (!toEmail) return false;
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        service_id: EJS.SERVICE_ID, template_id: EJS.TEMPLATE_ID, user_id: EJS.PUBLIC_KEY,
        template_params: { to_email:toEmail, to_name:toName, subject, message, from_name:"D-Works 발주 시스템" }
      })
    });
    return res.status === 200;
  } catch { return false; }
}

// ── 테마 ──────────────────────────────────────────────────────
const C = {
  bg:"#FFFFFF", page:"#F5F7FA", bdr:"#E5E9F0",
  acc:"#3772FF", txt:"#111827", sub:"#9CA3AF", sub2:"#6B7280",
  ok:"#10B981", warn:"#F59E0B", red:"#EF4444",
  fn:"'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif",
};

// ── 유틸 ──────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,8);
const today = () => new Date().toISOString().slice(0,10);
const fmtN = n => (n||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");

// ── 초기 데이터 ───────────────────────────────────────────────
const CATS = ["이너","아우터","팬츠","니트","원피스","스커트","기타"];
const CAT_C = {이너:"#3772FF",아우터:"#8B5CF6",팬츠:"#10B981",니트:"#F59E0B",원피스:"#EC4899",스커트:"#06B6D4",기타:"#9CA3AF"};
const SEASONS = ["26SS","26FW","25SS","25FW"];
const FACTORIES = ["공장A","공장B","공장C","기타"];
const VEN_TYPES = ["원단","안감","단추","지퍼","심지","기타"];
const VEN_IC = {원단:"🧶",안감:"📋",단추:"🔘",지퍼:"🤐",심지:"🪡",기타:"🏭"};
const VEN_C = {원단:"#3772FF",안감:"#10B981",단추:"#F59E0B",지퍼:"#8B5CF6",심지:"#06B6D4",기타:"#9CA3AF"};

const IV = {
  vendors:[
    {id:"v1",name:"이레텍스",tel:"010-1234-5678",email:"order@iretex.com",type:"원단"},
    {id:"v2",name:"강남텍스타일",tel:"010-2345-6789",email:"",type:"원단"},
    {id:"v3",name:"한국단추",tel:"010-3456-7890",email:"btn@hankook.com",type:"단추"},
    {id:"v4",name:"지퍼전문",tel:"010-4567-8901",email:"",type:"지퍼"},
  ],
  products:[
    {id:"p1",name:"리켄 T",category:"이너",season:"26SS",factory:"공장A",colors:["아이보리","블랙","네이비"],bom:[{id:"b1",mat:"메인원단",amt:1.2,price:8000,vid:"v1"}]},
    {id:"p2",name:"커브 T",category:"이너",season:"26SS",factory:"공장A",colors:["베이지","메란지"],bom:[{id:"b2",mat:"메인원단",amt:1.1,price:7500,vid:"v1"}]},
    {id:"p3",name:"빈스 자켓",category:"아우터",season:"26SS",factory:"공장B",colors:["네이비","카키"],bom:[{id:"b3",mat:"메인원단",amt:2.3,price:15000,vid:"v1"},{id:"b4",mat:"단추",amt:8,price:200,vid:"v3"}]},
    {id:"p4",name:"L 팬츠 S",category:"팬츠",season:"26SS",factory:"공장B",colors:["카키","베이지"],bom:[{id:"b5",mat:"메인원단",amt:1.5,price:9000,vid:"v1"}]},
  ],
  orders:[
    {id:"o1",items:[{pid:"p1",color:"아이보리",qty:200},{pid:"p2",color:"메란지",qty:150}],status:"완료",date:"2026-03-28",ts:"2026-03-28T09:00:00"},
    {id:"o2",items:[{pid:"p2",color:"베이지",qty:100},{pid:"p3",color:"네이비",qty:80}],status:"지연",date:"2026-03-29",ts:"2026-03-29T10:00:00"},
    {id:"o3",items:[{pid:"p3",color:"카키",qty:60}],status:"지연",date:today(),ts:new Date().toISOString()},
  ]
};

// ── 공통 UI ───────────────────────────────────────────────────
const Btn = ({ch,onClick,v="p",full,disabled,sz="m",st={}}) => {
  const bg={p:C.acc,w:"#fff",ok:C.ok}[v]||C.acc;
  const cl={p:"#fff",w:C.txt,ok:"#fff"}[v]||"#fff";
  const bd={w:`1px solid ${C.bdr}`}[v]||"none";
  const pd={s:"8px 16px",m:"13px 0",l:"15px 0"}[sz]||"13px 0";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:disabled?"#E5E9F0":bg, color:disabled?"#9CA3AF":cl,
      border:disabled?`1px solid ${C.bdr}`:bd, borderRadius:10,
      padding:pd, fontSize:sz==="s"?13:15, fontWeight:700,
      cursor:disabled?"default":"pointer", fontFamily:C.fn,
      display:"inline-flex", alignItems:"center", justifyContent:"center",
      gap:6, width:full?"100%":"auto", boxSizing:"border-box", lineHeight:1.4, ...st
    }}>{ch}</button>
  );
};

// 와이어프레임 스타일 입력 필드 (라벨 위, 입력창 별도)
function Field({label, children, req}) {
  return (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:14, fontWeight:600, color:C.txt, marginBottom:8}}>
        {label}{req&&<span style={{color:C.acc}}> *</span>}
      </div>
      {children}
    </div>
  );
}

function TxtInp({val, onChange, ph, type="text", onKeyDown, right}) {
  return (
    <div style={{display:"flex", alignItems:"center", border:`1px solid ${C.bdr}`, borderRadius:8, background:"#fff", overflow:"hidden"}}>
      <input value={val||""} onChange={e=>onChange&&onChange(e.target.value)}
        placeholder={ph} type={type} onKeyDown={onKeyDown}
        style={{flex:1, border:"none", outline:"none", padding:"13px 14px",
          fontSize:14, color:C.txt, fontFamily:C.fn, background:"transparent"}}/>
      {right}
    </div>
  );
}

function DropSel({val, onChange, children}) {
  return (
    <div style={{position:"relative", border:`1px solid ${C.bdr}`, borderRadius:8, background:"#fff"}}>
      <select value={val||""} onChange={e=>onChange(e.target.value)} style={{
        width:"100%", border:"none", outline:"none", padding:"13px 14px",
        fontSize:14, color:val?C.txt:C.sub, fontFamily:C.fn,
        background:"transparent", WebkitAppearance:"none", cursor:"pointer"
      }}>{children}</select>
      <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:C.sub,pointerEvents:"none",fontSize:12}}>∨</span>
    </div>
  );
}

const Tag = ({ch,c=C.acc}) => <span style={{background:c+"18",color:c,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{ch}</span>;
const Card = ({children,st={},onClick}) => <div onClick={onClick} style={{background:"#fff",borderRadius:12,border:`1px solid ${C.bdr}`,padding:16,boxSizing:"border-box",...st}}>{children}</div>;
const G = ({h=12}) => <div style={{height:h}}/>;
const Divider = () => <div style={{height:1,background:C.bdr,margin:"14px 0"}}/>;
const Empty = ({icon,text}) => <div style={{textAlign:"center",padding:"48px 20px",color:C.sub}}><div style={{fontSize:40,marginBottom:10}}>{icon}</div><div style={{fontSize:14,fontWeight:600,color:C.sub2}}>{text}</div></div>;

function StepBar({cur,total=4}) {
  return (
    <div style={{display:"flex",gap:6,marginBottom:20}}>
      {Array.from({length:total},(_,i)=>(
        <div key={i} style={{flex:i===cur?2:1,height:4,borderRadius:2,
          background:i<=cur?C.acc:C.bdr,transition:"all 0.3s"}}/>
      ))}
    </div>
  );
}

function Sheet({title,onClose,children}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"flex-end",zIndex:900}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#fff",borderRadius:"20px 20px 0 0",
        padding:"0 20px 40px",width:"100%",maxHeight:"90vh",
        overflowY:"auto",boxSizing:"border-box",fontFamily:C.fn
      }}>
        <div style={{width:36,height:4,background:C.bdr,borderRadius:2,margin:"12px auto 16px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontWeight:800,fontSize:18,color:C.txt}}>{title}</span>
          <button onClick={onClose} style={{background:C.page,border:"none",color:C.sub2,cursor:"pointer",width:30,height:30,borderRadius:8,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.fn}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// 차트
function LineChart({data}) {
  if (!data||data.length<2) return <div style={{height:80,display:"flex",alignItems:"center",justifyContent:"center",color:C.sub,fontSize:13}}>데이터 없음</div>;
  const W=300,H=80,p=12;
  const vs=data.map(d=>d.v);
  const mn=Math.min(...vs),mx=Math.max(...vs),rng=mx-mn||1;
  const pts=data.map((d,i)=>{
    const x=p+(i/(data.length-1))*(W-p*2);
    const y=H-p-((d.v-mn)/rng)*(H-p*2);
    return [x,y];
  });
  const fillPts = [...pts.map(([x,y])=>`${x},${y}`)];
  const areaPath = `M ${pts[0][0]},${H-p} ${pts.map(([x,y])=>`L ${x},${y}`).join(" ")} L ${pts[pts.length-1][0]},${H-p} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}>
      <path d={areaPath} fill={C.acc+"18"}/>
      <polyline points={fillPts.join(" ")} fill="none" stroke={C.acc} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" fill={C.acc}/>)}
    </svg>
  );
}

// ── 1. 스플래시 / 소개 화면 ───────────────────────────────────
function SplashScreen({onStart}) {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      icon:"📋",
      title:"발주 업무,\n이제 자동으로",
      desc:"20~60개 원부자재 수동 계산,\n카카오톡 개별 전달 — 이제 그만!",
      screen: (
        <div style={{background:"#fff",borderRadius:16,padding:20,border:`1px solid ${C.bdr}`,maxWidth:280,margin:"0 auto"}}>
          <div style={{fontSize:12,fontWeight:700,color:C.sub,marginBottom:12}}>발주 입력</div>
          <StepBar cur={0}/>
          <div style={{fontWeight:700,fontSize:14,marginBottom:10,color:C.acc}}>발주 추가</div>
          {[["상품명","리켄 T"],["색상","아이보리"],["수량","200"]].map(([l,v])=>(
            <div key={l} style={{marginBottom:8}}>
              <div style={{fontSize:11,color:C.sub,marginBottom:3}}>{l}</div>
              <div style={{border:`1px solid ${C.bdr}`,borderRadius:6,padding:"8px 10px",fontSize:12,color:C.txt}}>{v}</div>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <div style={{flex:1,padding:"9px 0",border:`1px solid ${C.bdr}`,borderRadius:8,textAlign:"center",fontSize:12,color:C.sub2}}>임시저장</div>
            <div style={{flex:2,padding:"9px 0",background:C.acc,borderRadius:8,textAlign:"center",fontSize:12,color:"#fff",fontWeight:700}}>다음</div>
          </div>
        </div>
      )
    },
    {
      icon:"📊",
      title:"대시보드로\n한눈에 파악",
      desc:"오늘 발주, 지연 현황, 발주량 추이를\n실시간으로 확인하세요.",
      screen: (
        <div style={{background:"#fff",borderRadius:16,padding:20,border:`1px solid ${C.bdr}`,maxWidth:280,margin:"0 auto"}}>
          <div style={{fontWeight:800,fontSize:16,textAlign:"center",marginBottom:12}}>대시 보드</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            {[["오늘 발주","2건",C.acc],["미슬고 발주","3건","#8B5CF6"],["이달 발주량","6,200매",C.ok]].map(([l,v,c])=>(
              <div key={l} style={{border:`1px solid ${C.bdr}`,borderRadius:8,padding:"8px 4px",textAlign:"center"}}>
                <div style={{fontWeight:800,fontSize:13,color:c}}>{v}</div>
                <div style={{fontSize:9,color:C.sub,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{border:`1px solid ${C.bdr}`,borderRadius:8,padding:"10px 12px"}}>
            <div style={{fontSize:11,fontWeight:700,marginBottom:8}}>⚠️ 지연 2건</div>
            {[["리켄 T","아이보리","완료"],["커브 T","메란지","지연"],["빈스 자켓","네이비","지연"]].map(([p,c,s])=>(
              <div key={p} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:`1px solid ${C.bdr}`}}>
                <span>{p}</span><span style={{color:C.sub}}>{c}</span>
                <span style={{color:s==="지연"?C.warn:C.ok,fontWeight:700}}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      icon:"👕",
      title:"상품 & BOM\n체계적 관리",
      desc:"상품별 원단 구성(BOM)을 등록하면\n소요량이 자동으로 계산됩니다.",
      screen: (
        <div style={{background:"#fff",borderRadius:16,padding:20,border:`1px solid ${C.bdr}`,maxWidth:280,margin:"0 auto"}}>
          <div style={{fontSize:12,fontWeight:700,color:C.sub,marginBottom:12}}>1단계 원단 입력</div>
          <StepBar cur={0}/>
          <div style={{fontWeight:700,fontSize:13,color:C.txt,marginBottom:8}}>기본 정보</div>
          {[["상품명",""],["시즌","26SS ∨"],["공장","공장A ∨"]].map(([l,v])=>(
            <div key={l} style={{border:`1px solid ${C.bdr}`,borderRadius:6,padding:"9px 12px",marginBottom:6,fontSize:12}}>
              <span style={{color:C.sub,marginRight:8}}>{l}</span>
              <span style={{color:v?C.txt:C.sub}}>{v||l+" 입력"}</span>
            </div>
          ))}
          <div style={{fontWeight:700,fontSize:13,color:C.txt,margin:"10px 0 8px"}}>원단 정보</div>
          {[["원단명",""],["색상","아이보리 ∨"],["소요량","1.2"],["단가","8,000"]].map(([l,v])=>(
            <div key={l} style={{border:`1px solid ${C.bdr}`,borderRadius:6,padding:"8px 12px",marginBottom:5,fontSize:11}}>
              <span style={{color:C.sub,marginRight:6}}>{l}</span>
              <span>{v||""}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      icon:"📧",
      title:"원클릭\n이메일 발주",
      desc:"거래처별로 발주서가 자동 생성되고\n이메일로 즉시 발송됩니다.",
      screen: (
        <div style={{background:"#fff",borderRadius:16,padding:20,border:`1px solid ${C.bdr}`,maxWidth:280,margin:"0 auto"}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>발주서 확인</div>
          <div style={{border:`1px solid ${C.bdr}`,borderRadius:8,overflow:"hidden",marginBottom:10}}>
            <div style={{background:C.page,padding:"8px 12px",fontSize:11,fontWeight:700,color:C.sub2}}>📋 발주 내역</div>
            {[["리켄 T","아이보리","200장"],["빈스 자켓","네이비","80장"]].map(([p,c,q])=>(
              <div key={p} style={{display:"flex",justifyContent:"space-between",padding:"9px 12px",borderBottom:`1px solid ${C.bdr}`,fontSize:12}}>
                <div><div style={{fontWeight:700}}>{p}</div><div style={{color:C.sub,fontSize:10}}>{c}</div></div>
                <span style={{fontWeight:800,color:C.acc}}>{q}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"9px 12px",fontSize:12}}>
              <span style={{fontWeight:700}}>총 수량</span>
              <span style={{fontWeight:800,color:C.acc}}>280장</span>
            </div>
          </div>
          <div style={{padding:"10px 0",border:`1px solid ${C.bdr}`,borderRadius:8,textAlign:"center",fontSize:12,color:C.sub2,marginBottom:8}}>📧 이메일 발송</div>
          <div style={{padding:"10px 0",background:C.ok,borderRadius:8,textAlign:"center",fontSize:12,color:"#fff",fontWeight:700}}>발주 완료</div>
        </div>
      )
    }
  ];

  return (
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:C.fn,display:"flex",flexDirection:"column"}}>
      {/* 헤더 */}
      <div style={{padding:"52px 24px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{color:C.acc,fontWeight:900,fontSize:26,letterSpacing:1}}>D-Works</div>
        <button onClick={onStart} style={{background:"none",border:"none",color:C.sub,fontSize:14,cursor:"pointer",fontFamily:C.fn}}>건너뛰기</button>
      </div>

      {/* 목업 화면 */}
      <div style={{padding:"0 24px",flex:1}}>
        <div style={{marginBottom:24}}>
          {slides[slide].screen}
        </div>

        {/* 텍스트 */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:26,fontWeight:900,color:C.txt,lineHeight:1.4,marginBottom:10,whiteSpace:"pre-line"}}>
            {slides[slide].title}
          </div>
          <div style={{fontSize:14,color:C.sub2,lineHeight:1.8,whiteSpace:"pre-line"}}>
            {slides[slide].desc}
          </div>
        </div>

        {/* 인디케이터 */}
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:28}}>
          {slides.map((_,i)=>(
            <div key={i} onClick={()=>setSlide(i)} style={{
              width:i===slide?24:8, height:8, borderRadius:4,
              background:i===slide?C.acc:C.bdr, cursor:"pointer", transition:"all 0.3s"
            }}/>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <div style={{padding:"0 24px 40px",display:"flex",gap:10}}>
        {slide < slides.length-1 ? (
          <>
            <Btn ch="이전" v="w" full st={{flex:1,display:slide===0?"none":"flex"}} onClick={()=>setSlide(s=>s-1)}/>
            <Btn ch="다음 →" full st={{flex:2}} onClick={()=>setSlide(s=>s+1)}/>
          </>
        ) : (
          <Btn ch="시작하기 →" full sz="l" onClick={onStart}/>
        )}
      </div>
    </div>
  );
}

// ── 2. 로그인 / 회원가입 ──────────────────────────────────────
function AuthPage({onLogin}) {
  const [tab, setTab] = useState("in");
  const [f, setF] = useState({name:"",company:"",email:"",pw:"",pw2:"",tel:""});
  const [err, setErr] = useState("");
  const sf = k => v => setF(p=>({...p,[k]:v}));

  function submit() {
    if (!f.email||!f.pw) { setErr("이메일과 비밀번호를 입력하세요"); return; }
    if (tab==="up"&&!f.name) { setErr("이름을 입력하세요"); return; }
    if (tab==="up"&&f.pw!==f.pw2) { setErr("비밀번호가 일치하지 않습니다"); return; }
    onLogin({id:uid(),name:f.name||f.email.split("@")[0],company:f.company,email:f.email,tel:f.tel});
  }

  return (
    <div style={{minHeight:"100vh",background:C.page,fontFamily:C.fn,color:C.txt}}>
      <div style={{background:"#fff",padding:"48px 24px 24px",borderBottom:`1px solid ${C.bdr}`}}>
        <div style={{fontSize:32,fontWeight:900,color:C.acc,letterSpacing:1}}>D-Works</div>
        <div style={{fontSize:13,color:C.sub,marginTop:6}}>의류 생산 발주 자동화 서비스</div>
      </div>
      <div style={{padding:"20px 20px 40px"}}>
        <div style={{display:"flex",borderBottom:`1.5px solid ${C.bdr}`,marginBottom:20}}>
          {[["in","로그인"],["up","회원가입"]].map(([k,l])=>(
            <button key={k} onClick={()=>{setTab(k);setErr("");}} style={{
              flex:1,padding:"12px 0",background:"none",border:"none",
              borderBottom:`2.5px solid ${tab===k?C.acc:"transparent"}`,
              color:tab===k?C.acc:C.sub,fontWeight:700,fontSize:15,
              cursor:"pointer",fontFamily:C.fn,marginBottom:-2
            }}>{l}</button>
          ))}
        </div>

        {tab==="up" && <>
          <Field label="이름" req><TxtInp val={f.name} onChange={sf("name")} ph="이름 입력"/></Field>
          <Field label="업체명"><TxtInp val={f.company} onChange={sf("company")} ph="업체명 입력"/></Field>
        </>}

        <Field label="이메일" req>
          <TxtInp val={f.email} onChange={sf("email")} ph="이메일 입력" type="email"
            right={tab==="up"?<button style={{padding:"0 14px",color:C.acc,fontWeight:700,fontSize:13,background:"none",border:"none",cursor:"pointer",fontFamily:C.fn,whiteSpace:"nowrap"}}>인증</button>:null}/>
        </Field>

        <Field label="비밀번호" req><TxtInp val={f.pw} onChange={sf("pw")} ph="비밀번호 입력" type="password" onKeyDown={e=>e.key==="Enter"&&submit()}/></Field>

        {tab==="up" && <>
          <Field label="비밀번호 확인" req><TxtInp val={f.pw2} onChange={sf("pw2")} ph="비밀번호 재입력" type="password"/></Field>
          <Field label="연락처">
            <TxtInp val={f.tel} onChange={sf("tel")} ph="휴대폰 번호 입력 (* 제외)" type="tel"
              right={<button style={{padding:"0 14px",color:C.acc,fontWeight:700,fontSize:13,background:"none",border:"none",cursor:"pointer",fontFamily:C.fn,whiteSpace:"nowrap"}}>인증</button>}/>
          </Field>
          <div style={{marginBottom:16}}>
            {["전체동의",["필수) 이용약관 동의"],["필수) 개인정보 수집 및 이용 동의"]].map((t,i)=>(
              <label key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:C.sub2,cursor:"pointer",marginBottom:8}}>
                <input type="checkbox" style={{width:16,height:16,accentColor:C.acc}}/>
                {Array.isArray(t)?`(${t[0]}`:t}
              </label>
            ))}
          </div>
        </>}

        {err && <div style={{color:C.red,fontSize:13,marginBottom:12,padding:"10px 14px",background:"#FFF5F5",borderRadius:8,border:"1px solid #FECACA"}}>{err}</div>}

        <Btn ch={tab==="in"?"로그인":"가입하기"} onClick={submit} full sz="l" st={{borderRadius:10,height:52,fontSize:16}}/>

        {tab==="in"&&<div style={{textAlign:"center",marginTop:16,color:C.sub,fontSize:13}}>
          계정이 없으신가요? <span onClick={()=>setTab("up")} style={{color:C.acc,fontWeight:700,cursor:"pointer"}}>회원가입</span>
        </div>}
      </div>
    </div>
  );
}

// ── 3. 대시보드 ───────────────────────────────────────────────
function DashPage({orders, products, onNav}) {
  const td=today();
  const yest=new Date(); yest.setDate(yest.getDate()-1);
  const yd=yest.toISOString().slice(0,10);
  const tO=orders.filter(o=>o.date===td);
  const yO=orders.filter(o=>o.date===yd);
  const mQ=orders.filter(o=>o.date.slice(0,7)===td.slice(0,7)).reduce((s,o)=>s+o.items.reduce((ss,i)=>ss+i.qty,0),0);
  const delayed=orders.filter(o=>o.status==="지연");
  const chartData=Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(6-i));
    const ds=d.toISOString().slice(0,10);
    return {label:ds.slice(5),v:orders.filter(o=>o.date===ds).reduce((s,o)=>s+o.items.reduce((ss,ii)=>ss+ii.qty,0),0)};
  });

  return (
    <div style={{padding:"16px 16px 90px"}}>
      <div style={{fontWeight:900,fontSize:22,textAlign:"center",marginBottom:16}}>대시 보드</div>
      {/* 통계 3칸 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,marginBottom:16,border:`1px solid ${C.bdr}`,borderRadius:12,overflow:"hidden"}}>
        {[
          {label:"오늘 발주",val:`${tO.length}건`,c:C.acc},
          {label:"미슬고 발주",val:`${yO.length}건`,c:"#8B5CF6"},
          {label:"이달 발주량",val:`${fmtN(mQ)}매`,c:C.ok},
        ].map((s,i)=>(
          <div key={s.label} style={{background:"#fff",padding:"14px 8px",textAlign:"center",borderLeft:i>0?`1px solid ${C.bdr}`:"none"}}>
            <div style={{color:s.c,fontSize:22,fontWeight:900,letterSpacing:"-0.5px"}}>{s.val}</div>
            <div style={{color:C.sub,fontSize:11,marginTop:4,fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 지연 목록 */}
      <Card st={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontWeight:800,fontSize:15}}>
            <span style={{color:C.warn}}>① </span>지연 {delayed.length}건
          </span>
          {delayed.length>2&&<button onClick={()=>onNav("list")} style={{background:"none",border:"none",fontSize:13,color:C.sub,cursor:"pointer",fontFamily:C.fn}}>더보기</button>}
        </div>
        {delayed.length===0
          ? <div style={{textAlign:"center",padding:"16px 0",color:C.sub,fontSize:13}}>지연 발주가 없습니다 ✅</div>
          : <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 80px 60px 50px",fontSize:12,fontWeight:600,color:C.sub,padding:"0 0 8px",borderBottom:`1px solid ${C.bdr}`,marginBottom:6}}>
              {["상품명","색상","수량","상태"].map(h=><div key={h}>{h}</div>)}
            </div>
            {delayed.flatMap(o=>o.items.map((it,j)=>{
              const p=products.find(x=>x.id===it.pid);
              return (
                <div key={`${o.id}-${j}`} style={{display:"grid",gridTemplateColumns:"1fr 80px 60px 50px",fontSize:13,padding:"7px 0",borderBottom:`1px solid ${C.bdr}`,alignItems:"center"}}>
                  <div style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p?.name||"-"}</div>
                  <div style={{color:C.sub2}}>{it.color}</div>
                  <div>{fmtN(it.qty)}</div>
                  <div style={{color:C.warn,fontWeight:700,fontSize:12}}>지연</div>
                </div>
              );
            }))}
          </>
        }
      </Card>

      {/* 차트 */}
      <Card>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>발주량 추이</div>
        <LineChart data={chartData}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
          {chartData.filter((_,i)=>i%2===0).map(d=><span key={d.label} style={{fontSize:10,color:C.sub}}>{d.label}</span>)}
        </div>
      </Card>
    </div>
  );
}

// ── 4. 발주 입력 ──────────────────────────────────────────────
function OrderPage({products, orders, setOrders, vendors}) {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selProd, setSelProd] = useState(null);
  const [selColor, setSelColor] = useState("");
  const [qty, setQty] = useState("");
  const [sending, setSending] = useState(false);

  const filtered = products.filter(p=>p.name.includes(search)||p.season.includes(search));

  function addItem() {
    if (!selProd||!selColor||!qty) { alert("상품, 색상, 수량을 모두 입력해주세요"); return; }
    const idx=items.findIndex(i=>i.pid===selProd.id&&i.color===selColor);
    if (idx>=0) setItems(p=>p.map((it,i)=>i===idx?{...it,qty:it.qty+Number(qty)}:it));
    else setItems(p=>[...p,{pid:selProd.id,color:selColor,qty:Number(qty)}]);
    setSelProd(null); setSelColor(""); setQty(""); setSearch("");
  }

  function submit() {
    if (!items.length) { alert("발주 항목을 추가해주세요"); return; }
    setOrders(p=>[...p,{id:uid(),items,status:"진행중",date:today(),ts:new Date().toISOString()}]);
    setStep(3);
  }

  async function sendMail() {
    // ── BOM 기반 업체별 소요량 계산 ──────────────────────────
    const venMap = {}; // {vid: {vendor, lines:[...]}}

    for (const it of items) {
      const prod = products.find(x=>x.id===it.pid);
      if (!prod) continue;

      for (const b of (prod.bom||[])) {
        const ven = vendors.find(v=>v.id===b.vid);
        if (!ven) continue;

        const soyo = Math.round(b.amt * it.qty * 100) / 100; // 소요량 계산

        if (!venMap[ven.id]) venMap[ven.id] = {vendor:ven, lines:[]};
        venMap[ven.id].lines.push(
          `■ 원부자재명: ${b.type ? b.type+" / " : ""}${b.mat}\n` +
          `  컬러: ${it.color}\n` +
          `  발주 수량(소요량): ${fmtN(soyo)} ${b.unit||"yd"}\n` +
          `  제품명: ${prod.name}\n` +
          `  입고처: ${prod.factory||"-"}\n` +
          `  연락처: ${prod.factoryTel||"-"}`
        );
      }
    }

    const targets = Object.values(venMap).filter(v=>v.vendor.email);
    if (!targets.length) {
      alert("발송 가능한 이메일이 없습니다.\n거래처 관리에서 이메일을 등록해주세요.");
      return;
    }

    setSending(true);
    let cnt=0;
    for (const {vendor, lines} of targets) {
      const subject = `[D-Works 발주서] ${today()} - ${vendor.name}`;
      const message =
        `${vendor.name} 담당자님 안녕하세요.\n` +
        `D-Works 발주서 보내드립니다.\n\n` +
        `📅 발주일: ${today()}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `[발주 내역]\n\n` +
        lines.join("\n\n") +
        `\n\n━━━━━━━━━━━━━━━━━━━━\n` +
        `확인 후 회신 부탁드립니다.\n감사합니다.\n\n---\nD-Works 발주 자동화 시스템`;

      if (await sendEmailJS(vendor.email, vendor.name, subject, message)) cnt++;
    }
    setSending(false);
    if (cnt>0) alert(`✅ ${cnt}곳 거래처에 발주서를 발송했습니다!`);
    else alert("발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
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
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
        {step===2&&<button onClick={()=>setStep(1)} style={{background:"none",border:"none",color:C.sub,fontSize:13,cursor:"pointer",fontFamily:C.fn}}>← 대시보드</button>}
      </div>
      <div style={{fontWeight:900,fontSize:22,marginBottom:4}}>{step===1?"발주 입력":"발주서 확인"}</div>
      <div style={{color:C.sub,fontSize:13,marginBottom:14}}>기본 정보를 입력해 주세요</div>
      <StepBar cur={step-1}/>

      {step===1 && <>
        {/* 발주 추가 */}
        <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>발주 추가</div>
        <Card st={{marginBottom:14}}>
          <Field label="상품명">
            <div style={{position:"relative"}}>
              <TxtInp val={search} onChange={v=>{setSearch(v);if(selProd&&v!==selProd.name)setSelProd(null);}} ph="상품명 입력"/>
              {search&&!selProd&&filtered.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:`1px solid ${C.bdr}`,borderRadius:8,zIndex:50,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",maxHeight:180,overflowY:"auto"}}>
                  {filtered.map(p=>(
                    <div key={p.id} onClick={()=>{setSelProd(p);setSearch(p.name);setSelColor("");}}
                      style={{padding:"11px 14px",borderBottom:`1px solid ${C.bdr}`,cursor:"pointer"}}>
                      <div style={{fontWeight:600,fontSize:14}}>{p.name}</div>
                      <div style={{color:C.sub,fontSize:12,marginTop:2}}>{p.season} · {p.colors.join(", ")}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Field>
          <Field label="색상">
            <DropSel val={selColor} onChange={setSelColor}>
              <option value="">색상 선택</option>
              {(selProd?.colors||[]).map(c=><option key={c} value={c}>{c}</option>)}
            </DropSel>
          </Field>
          <Field label="수량">
            <TxtInp val={qty} onChange={setQty} ph="수량 입력" type="number"/>
          </Field>
        </Card>
        <Btn ch="+ 발주 리스트에 추가" full onClick={addItem} disabled={!selProd||!selColor||!qty} st={{marginBottom:20}}/>

        {/* 발주 리스트 */}
        <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>발주 리스트</div>
        <Card st={{marginBottom:20}}>
          {items.length===0
            ? <div style={{textAlign:"center",padding:"20px 0",color:C.sub,fontSize:13}}>추가된 항목이 없습니다</div>
            : items.map((it,i)=>{
                const p=products.find(x=>x.id===it.pid);
                return (
                  <div key={i}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.sub2}}>상품 : {it.color}</div>
                      <button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:16}}>✕</button>
                    </div>
                    <div style={{border:`1px solid ${C.bdr}`,borderRadius:6,padding:"10px 12px",marginBottom:8,display:"flex",justifyContent:"space-between",fontSize:13}}>
                      <span>{p?.name} / {it.color}</span>
                      <span style={{fontWeight:700,color:C.acc}}>{fmtN(it.qty)}장</span>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:C.sub2,marginBottom:4}}>수량</div>
                    <div style={{border:`1px solid ${C.bdr}`,borderRadius:6,padding:"10px 12px",marginBottom:10,fontSize:13}}>{fmtN(it.qty)}</div>
                  </div>
                );
              })
          }
        </Card>

        <div style={{display:"flex",gap:10}}>
          <Btn ch="임시저장" v="w" full st={{flex:1}}/>
          <Btn ch="다음" full st={{flex:2}} onClick={()=>items.length?setStep(2):alert("발주 항목을 추가하세요")} disabled={!items.length}/>
        </div>
      </>}

      {step===2 && <>
        <Card st={{marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>📋 발주 내역</div>
          {items.map((it,i)=>{
            const p=products.find(x=>x.id===it.pid);
            return (
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.bdr}`}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{p?.name}</div>
                  <div style={{color:C.sub,fontSize:12,marginTop:2}}>{it.color} · {p?.factory}</div>
                </div>
                <span style={{fontWeight:800,color:C.acc,fontSize:16}}>{fmtN(it.qty)}장</span>
              </div>
            );
          })}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12}}>
            <span style={{fontWeight:700}}>총 수량</span>
            <span style={{fontWeight:900,color:C.acc,fontSize:18}}>{fmtN(items.reduce((s,it)=>s+it.qty,0))}장</span>
          </div>
        </Card>
        <Btn ch={sending?"발송 중...":"📧 이메일 발송"} v="w" full st={{marginBottom:10}} onClick={sendMail} disabled={sending}/>
        <div style={{display:"flex",gap:10}}>
          <Btn ch="← 수정" v="w" full st={{flex:1}} onClick={()=>setStep(1)}/>
          <Btn ch="발주 완료" full st={{flex:2,background:C.ok}} onClick={submit}/>
        </div>
      </>}
    </div>
  );
}

// ── 5. 상품 관리 ──────────────────────────────────────────────
function ProdsPage({products, setProducts, vendors}) {
  const [catF, setCatF] = useState("전체");
  const [sheet, setSheet] = useState(false);
  const [f, setF] = useState({name:"",category:"",season:"26SS",factory:"",colors:[],bom:[]});
  const [ci, setCi] = useState("");
  const [br, setBr] = useState({type:"",mat:"",amt:"",vid:""});
  const [editBomId, setEditBomId] = useState(null); // 수정 중인 BOM id
  const sf=k=>v=>setF(p=>({...p,[k]:v}));
  const filtered = catF==="전체"?products:products.filter(p=>p.category===catF);

  function openAdd() { setF({name:"",category:"",season:"26SS",factory:"",factoryTel:"",colors:[],bom:[]}); setCi(""); setBr({type:"",mat:"",amt:"",vid:""}); setSheet(true); }
  function openEdit(p) { setF({...p,colors:[...p.colors],bom:p.bom.map(b=>({...b}))}); setCi(""); setBr({type:"",mat:"",amt:"",vid:""}); setSheet(true); }
  function addColor() { const c=ci.trim(); if(!c||f.colors.includes(c))return; setF(p=>({...p,colors:[...p.colors,c]})); setCi(""); }
  function addBom() {
    if(!br.mat||!br.amt) return;
    if (editBomId) {
      // 수정 모드
      setF(p=>({...p,bom:p.bom.map(b=>b.id===editBomId?{...b,...br,amt:Number(br.amt)}:b)}));
      setEditBomId(null);
    } else {
      // 추가 모드
      setF(p=>({...p,bom:[...p.bom,{...br,id:uid(),amt:Number(br.amt)}]}));
    }
    setBr({type:"",mat:"",amt:"",vid:""});
  }
  function save() { if(!f.name)return; setProducts(f.id?products.map(p=>p.id===f.id?f:p):[...products,{...f,id:uid()}]); setSheet(false); }
  function del(id) { if(window.confirm("삭제?")) setProducts(products.filter(p=>p.id!==id)); }

  return (
    <div style={{padding:"16px 16px 90px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontWeight:900,fontSize:20}}>상품 관리</div>
        <Btn ch="+ 상품 추가" sz="s" st={{padding:"8px 16px"}} onClick={openAdd}/>
      </div>
      {/* 카테고리 필터 */}
      <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {["전체",...CATS].map(cat=>{
          const cnt=cat==="전체"?products.length:products.filter(p=>p.category===cat).length;
          const act=catF===cat;
          return <button key={cat} onClick={()=>setCatF(cat)} style={{
            padding:"7px 14px",borderRadius:20,flexShrink:0,whiteSpace:"nowrap",
            border:`1.5px solid ${act?(CAT_C[cat]||C.acc):C.bdr}`,
            background:act?(CAT_C[cat]||C.acc):"#fff",
            color:act?"#fff":C.sub2,fontWeight:700,fontSize:12,
            cursor:"pointer",fontFamily:C.fn
          }}>{cat} {cnt}</button>;
        })}
      </div>
      {filtered.length===0?<Empty icon="👕" text="등록된 상품이 없습니다"/>:filtered.map(p=>(
        <Card key={p.id} st={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap",marginBottom:8}}>
                <span style={{fontWeight:800,fontSize:15}}>{p.name}</span>
                {p.category&&<Tag ch={p.category} c={CAT_C[p.category]||C.sub}/>}
                <Tag ch={p.season} c={C.acc}/>
                {p.factory&&<span style={{color:C.sub,fontSize:11}}>{p.factory}</span>}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:4}}>
                {p.colors.map(c=><span key={c} style={{background:C.page,borderRadius:20,padding:"3px 10px",fontSize:11,color:C.sub2,border:`1px solid ${C.bdr}`}}>{c}</span>)}
              </div>
              <div style={{color:C.sub,fontSize:11}}>BOM {p.bom.length}종</div>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:8}}>
              <Btn ch="수정" v="w" sz="s" st={{padding:"6px 12px"}} onClick={()=>openEdit(p)}/>
              <Btn ch="삭제" v="w" sz="s" st={{padding:"6px 12px",color:C.red}} onClick={()=>del(p.id)}/>
            </div>
          </div>
        </Card>
      ))}
      {sheet&&(
        <Sheet title={f.id?"상품 수정":"1단계 원단 입력"} onClose={()=>setSheet(false)}>
          <StepBar cur={0}/>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>기본 정보</div>
          <Field label="상품명" req><TxtInp val={f.name} onChange={sf("name")} ph="상품명 입력"/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="시즌"><DropSel val={f.season} onChange={sf("season")}>{SEASONS.map(s=><option key={s} value={s}>{s}</option>)}</DropSel></Field>
            <Field label="입고처(공장명)"><TxtInp val={f.factory||""} onChange={sf("factory")} ph="예: OO봉제"/></Field>
          </div>
          <Field label="입고처 연락처"><TxtInp val={f.factoryTel||""} onChange={sf("factoryTel")} ph="예: 010-0000-0000" type="tel"/></Field>
          <Field label="카테고리">
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {CATS.map(cat=>{const act=f.category===cat;return<button key={cat} onClick={()=>sf("category")(cat)} style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${act?(CAT_C[cat]||C.acc):C.bdr}`,background:act?(CAT_C[cat]||C.acc):"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:C.fn}}>{cat}</button>;})}
            </div>
          </Field>
          <Divider/>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>부자재 정보</div>

          {/* 부자재 타입 선택 */}
          <Field label="부자재 유형">
            <div style={{display:"flex",flexWrap:"wrap",gap:7,paddingBottom:4}}>
              {["메인원단","부속원단","단추","지퍼","안감","심지","기타"].map(t=>{
                const act=br.type===t;
                return <button key={t} onClick={()=>setBr(r=>({...r,type:t}))} style={{
                  padding:"7px 14px",borderRadius:20,whiteSpace:"nowrap",
                  border:`1.5px solid ${act?C.acc:C.bdr}`,
                  background:act?C.acc:"#fff",
                  color:act?"#fff":C.sub2,fontWeight:600,fontSize:12,
                  cursor:"pointer",fontFamily:C.fn
                }}>{t}</button>;
              })}
            </div>
          </Field>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Field label="품목명"><TxtInp val={br.mat} onChange={v=>setBr(r=>({...r,mat:v}))} ph="예: 30수 면 싱글"/></Field>
            <Field label="색상">
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:6}}>
                {f.colors.map(c=><span key={c} style={{background:C.page,borderRadius:20,padding:"3px 8px",fontSize:11,display:"flex",alignItems:"center",gap:4,border:`1px solid ${C.bdr}`}}>
                  {c}<button onClick={()=>setF(p=>({...p,colors:p.colors.filter(x=>x!==c)}))} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:11,lineHeight:1,padding:0}}>✕</button>
                </span>)}
              </div>
              <div style={{display:"flex",gap:6}}>
                <input value={ci} onChange={e=>setCi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addColor()} placeholder="색상 추가" style={{flex:1,border:`1px solid ${C.bdr}`,borderRadius:6,padding:"7px 10px",fontSize:12,fontFamily:C.fn,outline:"none"}}/>
                <button onClick={addColor} style={{background:C.acc,border:"none",color:"#fff",borderRadius:6,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:C.fn}}>+</button>
              </div>
            </Field>
            <Field label="소요량"><TxtInp val={br.amt} onChange={v=>setBr(r=>({...r,amt:v}))} ph="0.0" type="number"/></Field>
          </div>

          <Divider/>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>업체 정보</div>
          <Field label="업체명">
            <DropSel val={br.vid} onChange={v=>setBr(r=>({...r,vid:v}))}>
              <option value="">업체명 선택</option>
              {vendors.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
            </DropSel>
          </Field>
          {f.bom.length>0&&f.bom.map(b=>{
            const ven=vendors.find(v=>v.id===b.vid);
            const isEditing=editBomId===b.id;
            return (
              <div key={b.id} style={{background:isEditing?C.acc+"10":C.page,borderRadius:8,padding:"10px 12px",marginBottom:6,border:`1.5px solid ${isEditing?C.acc:C.bdr}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <><span style={{background:C.acc+"15",color:C.acc,borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:700,marginRight:6}}>{b.type||"원단"}</span><span style={{fontWeight:700,fontSize:13}}>{b.mat}</span></>
                    <span style={{color:C.sub,fontSize:11,marginLeft:8}}>{b.amt}yd</span>
                    {ven&&<span style={{color:C.sub,fontSize:11,marginLeft:6}}>· {ven.name}</span>}
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>{
                      if(isEditing){setEditBomId(null);setBr({type:"",mat:"",amt:"",vid:""});}
                      else{setEditBomId(b.id);setBr({type:b.type||"",mat:b.mat,amt:String(b.amt),vid:b.vid||""});}
                    }} style={{background:"none",border:"none",color:isEditing?C.acc:C.sub,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:C.fn}}>
                      {isEditing?"취소":"수정"}
                    </button>
                    <button onClick={()=>{setF(p=>({...p,bom:p.bom.filter(x=>x.id!==b.id)}));if(isEditing){setEditBomId(null);setBr({type:"",mat:"",amt:"",vid:""});}}} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:14}}>✕</button>
                  </div>
                </div>
              </div>
            );
          })}
          <Btn ch={editBomId?"✓ 수정 완료":"+ 부자재 추가"} v={editBomId?"p":"w"} full st={{marginBottom:20}} onClick={addBom}/>
          <div style={{display:"flex",gap:10}}>
            <Btn ch="임시저장" v="w" full st={{flex:1}} onClick={()=>setSheet(false)}/>
            <Btn ch="저장" full st={{flex:2}} onClick={save} disabled={!f.name}/>
          </div>
        </Sheet>
      )}
    </div>
  );
}

// ── 6. 발주 리스트 ────────────────────────────────────────────
function ListPage({orders, setOrders, products}) {
  const [filter, setFilter] = useState("전체");
  const [open, setOpen] = useState(null);
  const SC={완료:C.ok,지연:C.warn,진행중:C.acc};
  const filtered=(filter==="전체"?orders:orders.filter(o=>o.status===filter)).sort((a,b)=>new Date(b.ts)-new Date(a.ts));
  return (
    <div style={{padding:"16px 16px 90px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontWeight:900,fontSize:20}}>발주 리스트</div>
        <Tag ch={`${orders.length}건`} c={C.sub}/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {["전체","진행중","완료","지연"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{
            padding:"7px 16px",borderRadius:20,flexShrink:0,
            border:`1.5px solid ${filter===s?C.acc:C.bdr}`,
            background:filter===s?C.acc+"18":"#fff",
            color:filter===s?C.acc:C.sub2,fontWeight:600,fontSize:13,
            cursor:"pointer",fontFamily:C.fn
          }}>{s}</button>
        ))}
      </div>
      {filtered.length===0?<Empty icon="📋" text="발주 내역이 없습니다"/>:filtered.map(o=>{
        const tot=o.items.reduce((s,i)=>s+i.qty,0);
        const isO=open===o.id;
        return (
          <Card key={o.id} st={{marginBottom:10,cursor:"pointer"}} onClick={()=>setOpen(isO?null:o.id)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{o.items.map(it=>products.find(x=>x.id===it.pid)?.name||"-").join(", ")}</div>
                <div style={{color:C.sub,fontSize:12}}>{o.date} · {fmtN(tot)}장</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <Tag ch={o.status} c={SC[o.status]||C.sub}/>
                <span style={{color:C.sub}}>{isO?"▲":"▼"}</span>
              </div>
            </div>
            {isO&&<div onClick={e=>e.stopPropagation()}>
              <Divider/>
              {o.items.map((it,j)=>{const p=products.find(x=>x.id===it.pid);return(
                <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.bdr}`,fontSize:13}}>
                  <span style={{fontWeight:600}}>{p?.name}</span>
                  <span>{it.color} · <strong>{fmtN(it.qty)}</strong>장</span>
                </div>
              );})}
              <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
                {["진행중","완료","지연"].map(st=>(
                  <Btn key={st} ch={st} sz="s" st={{padding:"6px 14px",background:o.status===st?SC[st]:"#fff",color:o.status===st?"#fff":SC[st],border:`1.5px solid ${SC[st]}`}}
                    onClick={()=>setOrders(p=>p.map(x=>x.id===o.id?{...x,status:st}:x))}/>
                ))}
                <Btn ch="삭제" sz="s" v="w" st={{marginLeft:"auto",color:C.red,padding:"6px 14px"}}
                  onClick={()=>{if(window.confirm("삭제?"))setOrders(p=>p.filter(x=>x.id!==o.id));}}/>
              </div>
            </div>}
          </Card>
        );
      })}
    </div>
  );
}

// ── 7. 환경설정 ───────────────────────────────────────────────
function SettingsPage({user, vendors, setVendors, onLogout}) {
  const [sheet, setSheet] = useState(false);
  const [f, setF] = useState({name:"",tel:"",email:"",type:"원단"});
  const [editId, setEditId] = useState(null);
  const sf=k=>v=>setF(p=>({...p,[k]:v}));

  function openAdd() { setF({name:"",tel:"",email:"",type:"원단"}); setEditId(null); setSheet(true); }
  function openEdit(v) { setF({...v}); setEditId(v.id); setSheet(true); }
  function save() { if(!f.name)return; setVendors(editId?vendors.map(v=>v.id===editId?{...f,id:editId}:v):[...vendors,{...f,id:uid()}]); setSheet(false); }

  return (
    <div style={{padding:"16px 16px 90px"}}>
      <div style={{fontWeight:900,fontSize:20,marginBottom:20}}>환경설정</div>
      <Card st={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:46,height:46,borderRadius:23,background:C.acc+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👤</div>
          <div>
            <div style={{fontWeight:800,fontSize:15}}>{user.name}</div>
            <div style={{color:C.sub,fontSize:13,marginTop:2}}>{user.email}</div>
            {user.company&&<div style={{color:C.sub,fontSize:12}}>{user.company}</div>}
          </div>
        </div>
        <Divider/>
        <Btn ch="로그아웃" v="w" full st={{color:C.red}} onClick={onLogout}/>
      </Card>

      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:15}}>🏭 거래처 관리</div>
          <Btn ch="+ 추가" sz="s" st={{padding:"6px 12px"}} onClick={openAdd}/>
        </div>
        {vendors.length===0?<div style={{textAlign:"center",padding:"16px 0",color:C.sub,fontSize:13}}>등록된 거래처가 없습니다</div>:
        vendors.map(v=>(
          <div key={v.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${C.bdr}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:(VEN_C[v.type]||C.sub)+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{VEN_IC[v.type]||"🏭"}</div>
              <div>
                <div style={{fontWeight:700,fontSize:13}}>{v.name}</div>
                <div style={{color:v.email?C.sub:C.warn,fontSize:11,marginTop:1}}>{v.email||"이메일 미등록"}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:6}}>
              <Btn ch="수정" v="w" sz="s" st={{padding:"5px 10px",fontSize:12}} onClick={()=>openEdit(v)}/>
              <Btn ch="삭제" v="w" sz="s" st={{padding:"5px 10px",fontSize:12,color:C.red}} onClick={()=>{if(window.confirm("삭제?"))setVendors(vv=>vv.filter(x=>x.id!==v.id));}}/>
            </div>
          </div>
        ))}
      </Card>

      {sheet&&(
        <Sheet title={editId?"거래처 수정":"거래처 추가"} onClose={()=>setSheet(false)}>
          <Field label="거래처명" req><TxtInp val={f.name||""} onChange={sf("name")} ph="거래처명 입력"/></Field>
          <Field label="전화번호"><TxtInp val={f.tel||""} onChange={sf("tel")} ph="010-0000-0000" type="tel"/></Field>
          <Field label="이메일 (발주서 발송용)"><TxtInp val={f.email||""} onChange={sf("email")} ph="order@example.com" type="email"/></Field>
          <Field label="업체 유형">
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {VEN_TYPES.map(t=>{const act=f.type===t;return<button key={t} onClick={()=>sf("type")(t)} style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${act?(VEN_C[t]||C.acc):C.bdr}`,background:act?(VEN_C[t]||C.acc):"#fff",color:act?"#fff":C.sub2,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:C.fn,display:"flex",alignItems:"center",gap:4}}>{VEN_IC[t]} {t}</button>;})}
            </div>
          </Field>
          <G h={8}/>
          <div style={{display:"flex",gap:10}}>
            <Btn ch="취소" v="w" full st={{flex:1}} onClick={()=>setSheet(false)}/>
            <Btn ch="저장" full st={{flex:2}} onClick={save}/>
          </div>
        </Sheet>
      )}
    </div>
  );
}

// ── 앱 루트 ───────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash"); // splash | auth | app
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dash");
  const [vendors, setVendors] = useState(IV.vendors);
  const [products, setProducts] = useState(IV.products);
  const [orders, setOrders] = useState(IV.orders);

  if (screen==="splash") return <SplashScreen onStart={()=>setScreen("auth")}/>;
  if (screen==="auth"||!user) return <AuthPage onLogin={u=>{setUser(u);setScreen("app");}}/>;

  const tabs=[
    {k:"order",i:"📝",l:"발주하기"},
    {k:"prods",i:"👕",l:"상품"},
    {k:"list",i:"📋",l:"발주리스트"},
    {k:"settings",i:"⚙️",l:"환경설정"},
  ];

  const pages={
    dash:     <DashPage orders={orders} products={products} onNav={setPage}/>,
    order:    <OrderPage products={products} orders={orders} setOrders={setOrders} vendors={vendors}/>,
    prods:    <ProdsPage products={products} setProducts={setProducts} vendors={vendors}/>,
    list:     <ListPage orders={orders} setOrders={setOrders} products={products}/>,
    settings: <SettingsPage user={user} vendors={vendors} setVendors={setVendors} onLogout={()=>{setUser(null);setScreen("auth");}}/>,
  };

  return (
    <div style={{minHeight:"100vh",background:C.page,fontFamily:C.fn,color:C.txt}}>
      <div style={{background:"#fff",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,borderBottom:`1px solid ${C.bdr}`}}>
        <button onClick={()=>setPage("dash")} style={{background:"none",border:"none",color:C.acc,fontWeight:900,fontSize:20,cursor:"pointer",fontFamily:C.fn,letterSpacing:1}}>D-Works</button>
        <span style={{color:C.sub,fontSize:13}}>{user.name}</span>
      </div>
      <div style={{paddingBottom:80}}>{pages[page]||pages["dash"]}</div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:`1px solid ${C.bdr}`,display:"flex",zIndex:100}}>
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setPage(t.k)} style={{
            flex:1,padding:"10px 4px 10px",background:"none",border:"none",
            color:page===t.k?C.acc:C.sub,cursor:"pointer",fontFamily:C.fn,
            display:"flex",flexDirection:"column",alignItems:"center",gap:3
          }}>
            <div style={{width:30,height:30,borderRadius:9,background:page===t.k?C.acc+"15":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:17}}>{t.i}</span>
            </div>
            <span style={{fontSize:10,fontWeight:page===t.k?700:500}}>{t.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
