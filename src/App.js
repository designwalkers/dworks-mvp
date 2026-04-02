import React, { useState, useEffect } from "react";

// ── Supabase 설정 ──────────────────────────────────────────────
const SB = "https://qimgostiseehdnvhmoph.supabase.co";
// [중요] 토큰 없이도 접근 가능한 마스터 키 역할을 하도록 설정
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";

function ah() {
  return {
    "apikey": KEY,
    "Authorization": `Bearer ${KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };
}

// 데이터를 가져오는 핵심 통로 (가장 단순하게 수정)
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
  signIn: (e, pw) => fetch(`${SB}/auth/v1/token?grant_type=password`, { method: "POST", headers: ah(), body: JSON.stringify({ email: e, password: pw }) }).then(r => r.json()),
  insert: (tbl, d) => fetch(`${SB}/rest/v1/${tbl}`, { method: "POST", headers: ah(), body: JSON.stringify(d) }).then(r => r.json()),
};

// ── 디자인 상수 ──────────────────────────────────────────────────
const C = { bg: "#F8F9FB", bdr: "#E8ECF2", acc: "#3772FF", txt: "#111827", sub: "#9CA3AF" };

// ── 메인 App ───────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("app"); // 테스트를 위해 바로 앱으로 진입
  const [user, setUser] = useState({ name: "Mr.Min", id: "5da1c316-db3b-4c29-8e5a-e2c7a" }); // 임시 유저 세팅
  const [page, setPage] = useState("vendors"); // 바로 거래처 페이지 확인
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  // [수정 핵심] 새로고침 시 무조건 호출되는 함수
  async function loadAllData() {
    setLoading(true);
    console.log("데이터를 금고에서 꺼내오기 시작합니다...");
    const data = await fetchList("vendors");
    console.log("찾은 데이터:", data);
    setVendors(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  // 앱이 켜지자마자 실행
  useEffect(() => {
    loadAllData();
  }, []);

  // 저장 기능
  async function saveVendor(name, tel) {
    const newRecord = { name, tel, type: "원단", user_id: user.id };
    await DB.insert("vendors", newRecord);
    alert("DB에 저장했습니다!");
    loadAllData(); // 저장 후 즉시 다시 불러오기
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, maxWidth: 480, margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ background: "#fff", padding: "14px", borderBottom: `1px solid ${C.bdr}`, fontWeight: 900, color: C.acc }}>
        D-Works (데이터 복구 모드)
      </div>

      <div style={{ padding: 14 }}>
        <h3>거래처 리스트 {loading && "(로딩중...)"}</h3>
        
        {/* 입력창 */}
        <div style={{ background: "#fff", padding: 15, borderRadius: 12, marginBottom: 20, border: `1px solid ${C.bdr}` }}>
          <input id="v_name" placeholder="거래처명" style={{ width: "100%", padding: 10, marginBottom: 10 }} />
          <input id="v_tel" placeholder="전화번호" style={{ width: "100%", padding: 10, marginBottom: 10 }} />
          <button onClick={() => {
            const n = document.getElementById("v_name").value;
            const t = document.getElementById("v_tel").value;
            if(n) saveVendor(n, t);
          }} style={{ width: "100%", padding: 12, background: C.acc, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700 }}>
            새 거래처 저장하기
          </button>
        </div>

        {/* 리스트 출력 */}
        {vendors.length === 0 ? (
          <p style={{ color: C.sub, textAlign: "center" }}>데이터가 없습니다. DB 설정을 확인해주세요.</p>
        ) : (
          vendors.map((v, i) => (
            <div key={i} style={{ background: "#fff", padding: 15, borderRadius: 12, marginBottom: 10, border: `1px solid ${C.bdr}` }}>
              <div style={{ fontWeight: 800 }}>{v.name}</div>
              <div style={{ fontSize: 12, color: C.sub }}>{v.tel}</div>
            </div>
          ))
        )}
      </div>

      <button onClick={() => loadAllData()} style={{ position: "fixed", bottom: 20, right: 20, padding: "10px 20px", borderRadius: 50, background: "#000", color: "#fff", border: "none" }}>
        🔄 강제 새로고침
      </button>
    </div>
  );
}
