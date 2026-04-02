import React, { useState, useEffect } from "react";

// ── Supabase 설정 ──────────────────────────────────────────────
const SB = "https://qimgostiseehdnvhmoph.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";

function ah() {
  return {
    "apikey": KEY,
    "Authorization": `Bearer ${KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };
}

// 데이터를 가져오는 핵심 통로 (가장 단순하고 강력하게 수정)
async function fetchList(tbl) {
  try {
    const r = await fetch(`${SB}/rest/v1/${tbl}?select=*&order=created_at.asc`, {
      method: "GET",
      headers: ah()
    });
    return r.json();
  } catch (e) {
    console.error(tbl + " 로딩 실패:", e);
    return [];
  }
}

const DB = {
  insert: (tbl, d) => fetch(`${SB}/rest/v1/${tbl}`, { method: "POST", headers: ah(), body: JSON.stringify(d) }).then(r => r.json()),
  del: (tbl, id) => fetch(`${SB}/rest/v1/${tbl}?id=eq.${id}`, { method: "DELETE", headers: ah() }),
};

// ── 디자인 상수 ──────────────────────────────────────────────────
const C = { bg: "#F8F9FB", bdr: "#E8ECF2", acc: "#3772FF", txt: "#111827", sub: "#9CA3AF", ok: "#10B981", red: "#EF4444", fn: "'Noto Sans KR',sans-serif" };

// ── 공통 UI ───────────────────────────────────────────────────
const Btn = ({ ch, onClick, v = "p", full, st = {} }) => {
  const bg = { p: C.acc, w: "#fff", ok: C.ok }[v] || C.acc;
  const cl = { p: "#fff", w: C.txt, ok: "#fff" }[v] || "#fff";
  return <button onClick={onClick} style={{ background: bg, color: cl, border: v === "w" ? `1.5px solid ${C.bdr}` : "none", borderRadius: 12, padding: "14px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", width: full ? "100%" : "auto", fontFamily: C.fn, ...st }}>{ch}</button>;
};
const Card = ({ children, st = {} }) => <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${C.bdr}`, padding: 18, boxSizing: "border-box", boxShadow: "0 2px 8px rgba(0,0,0,0.03)", ...st }}>{children}</div>;
const Tag = ({ ch, c = C.acc }) => <span style={{ background: c + "15", color: c, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{ch}</span>;

function Sheet({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", zIndex: 9999 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "0 24px 44px", width: "100%", maxHeight: "85vh", overflowY: "auto", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ width: 40, height: 5, background: C.bdr, borderRadius: 3, margin: "12px auto 20px" }} />
        <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", marginBottom: 20 }}><span style={{ fontWeight: 900, fontSize: 18 }}>{title}</span><button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button></div>
        {children}
      </div>
    </div>
  );
}

// ── 메인 App ───────────────────────────────────────────────────
export default function App() {
  const [user] = useState({ name: "민용기", id: "5da1c316-db3b-4c29-8e5a-e2c7a" });
  const [page, setPage] = useState("dash");
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [f, setF] = useState({ name: "", tel: "", type: "원단" });

  // [수정 핵심] 데이터를 금고에서 꺼내오는 함수 (새로고침 시 자동 실행)
  async function loadAllData() {
    setLoading(true);
    try {
      const [vData, pData] = await Promise.all([fetchList("vendors"), fetchList("products")]);
      setVendors(Array.isArray(vData) ? vData : []);
      setProducts(Array.isArray(pData) ? pData : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadAllData(); }, []);

  async function saveVendor() {
    if (!f.name) return;
    const data = { ...f, user_id: user.id };
    await DB.insert("vendors", data);
    setSheet(false);
    setF({ name: "", tel: "", type: "원단" });
    loadAllData(); // 저장 후 즉시 새로고침 없이 리스트 갱신
  }

  async function deleteItem(tbl, id) {
    if (!window.confirm("삭제하시겠습니까?")) return;
    await DB.del(tbl, id);
    loadAllData();
  }

  const pages = {
    dash: (
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>대시보드</div>
        <Card st={{ textAlign: "center", padding: 30 }}>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 8 }}>등록된 거래처</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: C.acc }}>{vendors.length}개</div>
        </Card>
      </div>
    ),
    vendors: (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>거래처 관리</div>
          <Btn ch="+ 추가" onClick={() => setSheet(true)} st={{ padding: "8px 16px" }} />
        </div>
        {vendors.length === 0 ? <p style={{ textAlign: "center", color: C.sub, padding: 40 }}>데이터를 불러오는 중...</p> : vendors.map(v => (
          <Card key={v.id} st={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{v.name}</div>
              <div style={{ fontSize: 12, color: C.sub }}>{v.tel}</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Tag ch={v.type} />
              <button onClick={() => deleteItem("vendors", v.id)} style={{ border: "none", background: "none", color: C.red, fontSize: 12, cursor: "pointer" }}>삭제</button>
            </div>
          </Card>
        ))}
      </div>
    ),
    prods: (
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>상품 관리</div>
        <p style={{ textAlign: "center", color: C.sub }}>상품 관리 기능 준비 중...</p>
      </div>
    )
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: C.fn, boxShadow: "0 0 20px rgba(0,0,0,0.05)" }}>
      {/* 상단바 */}
      <div style={{ background: "#fff", padding: "16px 20px", borderBottom: `1px solid ${C.bdr}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <strong style={{ color: C.acc, fontSize: 20 }} onClick={() => setPage("dash")}>D-Works</strong>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{user.name}</span>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ paddingBottom: 100 }}>{loading && <p style={{ textAlign: "center", fontSize: 12, color: C.sub }}>업데이트 중...</p>}{pages[page]}</div>

      {/* 하단 탭바 */}
      <div style={{ position: "fixed", bottom: 0, width: "100%", maxWidth: 480, background: "#fff", display: "flex", borderTop: `1px solid ${C.bdr}`, paddingBottom: 10, zIndex: 100 }}>
        {[{ k: "dash", l: "홈", i: "🏠" }, { k: "prods", l: "상품", i: "👕" }, { k: "vendors", l: "거래처", i: "🏭" }].map(t => (
          <button key={t.k} onClick={() => setPage(t.k)} style={{ flex: 1, padding: "14px 0", background: "none", border: "none", color: page === t.k ? C.acc : C.sub, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 18 }}>{t.i}</span>
            <span style={{ fontSize: 10, fontWeight: 700 }}>{t.l}</span>
          </button>
        ))}
      </div>

      {/* 추가 시트 */}
      {sheet && (
        <Sheet title="새 거래처 등록" onClose={() => setSheet(false)}>
          <div style={{ marginBottom: 15 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>거래처명</div>
            <input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} style={{ width: "100%", padding: "14px", border: `1px solid ${C.bdr}`, borderRadius: 10, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 15 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>전화번호</div>
            <input value={f.tel} onChange={e => setF({ ...f, tel: e.target.value })} style={{ width: "100%", padding: "14px", border: `1px solid ${C.bdr}`, borderRadius: 10, outline: "none", boxSizing: "border-box" }} />
          </div>
          <Btn ch="거래처 저장하기" full onClick={saveVendor} />
        </Sheet>
      )}
    </div>
  );
}
