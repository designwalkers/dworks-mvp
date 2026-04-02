import React, { useState, useEffect } from "react";

// ── Supabase 설정 ──────────────────────────────────────────────
const SB = "https://qimgostiseehdnvhmoph.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbWdvc3Rpc2VlaGRudmhtb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ1NDgsImV4cCI6MjA5MDU5MDU0OH0.7upLxWR1OqwvIx71Z4pFHUU7BFswDvcOQE9edjcL2yg";

function ah(t) {
  return {
    "apikey": KEY,
    "Authorization": `Bearer ${t || KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };
}

async function api(m, p, t, b) {
  try {
    const r = await fetch(`${SB}${p}`, {
      method: m,
      headers: ah(t),
      body: b ? JSON.stringify(b) : undefined
    });
    return r.json();
  } catch (e) {
    console.error("API Error:", e);
    return { error: e };
  }
}

const DB = {
  signUp: (e, pw, meta) => api("POST", "/auth/v1/signup", null, { email: e, password: pw, data: meta }),
  signIn: (e, pw) => api("POST", "/auth/v1/token?grant_type=password", null, { email: e, password: pw }),
  signOut: (t) => fetch(`${SB}/auth/v1/logout`, { method: "POST", headers: ah(t) }),
  // [수정 핵심] 필터링 없이 일단 모든 데이터를 다 가져오도록 주소를 단순화했습니다.
  list: (t, tbl) => api("GET", `/rest/v1/${tbl}?select=*&order=created_at.asc`, t),
  insert: (t, tbl, d) => api("POST", `/rest/v1/${tbl}`, t, d),
  update: (t, tbl, id, d) => api("PATCH", `/rest/v1/${tbl}?id=eq.${id}`, t, d),
  del: (t, tbl, id) => fetch(`${SB}/rest/v1/${tbl}?id=eq.${id}`, { method: "DELETE", headers: ah(t) }),
};

// ── EmailJS ───────────────────────────────────────────────────
const EJS = { SID: "service_raca1ke", TID: "template_hoej0ts", PK: "KlYRj7B6JNO01D2pm" };
async function sendEmail(toEmail, toName, subject, message) {
  if (!toEmail) return false;
  try {
    const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: EJS.SID, template_id: EJS.TID, user_id: EJS.PK, template_params: { to_email: toEmail, to_name: toName, subject, message, from_name: "D-Works" } })
    });
    return r.status === 200;
  } catch { return false; }
}

// ── 디자인 상수 ──────────────────────────────────────────────────
const C = { bg: "#F8F9FB", bdr: "#E8ECF2", acc: "#3772FF", txt: "#111827", sub: "#9CA3AF", sub2: "#6B7280", ok: "#10B981", red: "#EF4444", fn: "'Noto Sans KR',sans-serif" };
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const fmtN = n => (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const CATS = ["이너", "아우터", "팬츠", "니트", "원피스", "스커트", "기타"];
const VEN_TYPES = ["원단", "안감", "단추", "지퍼", "심지", "기타"];
const VEN_IC = { 원단: "🧶", 안감: "📋", 단추: "🔘", 지퍼: "🤐", 심지: "🪡", 기타: "🏭" };
const VEN_C = { 원단: "#3772FF", 안감: "#10B981", 단추: "#F59E0B", 지퍼: "#8B5CF6", 심지: "#06B6D4", 기타: "#9CA3AF" };

// ── 공통 UI 컴포넌트 ─────────────────────────────────────────────
const Btn = ({ ch, onClick, v = "p", full, disabled, st = {} }) => {
  const bg = { p: C.acc, w: "#fff", ok: C.ok }[v] || C.acc;
  const cl = { p: "#fff", w: C.txt, ok: "#fff" }[v] || "#fff";
  return <button onClick={onClick} disabled={disabled} style={{ background: disabled ? "#EDF0F5" : bg, color: disabled ? "#B0B8C4" : cl, border: v === "w" ? `1px solid ${C.bdr}` : "none", borderRadius: 10, padding: "12px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", width: full ? "100%" : "auto", ...st }}>{ch}</button>;
};
const Card = ({ children, st = {}, onClick }) => <div onClick={onClick} style={{ background: "#fff", borderRadius: 12, border: `1px solid ${C.bdr}`, padding: 16, boxSizing: "border-box", ...st }}>{children}</div>;
const Tag = ({ ch, c = C.acc }) => <span style={{ background: c + "18", color: c, padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{ch}</span>;
const G = ({ h = 12 }) => <div style={{ height: h }} />;
function Field({ label, children }) { return <div style={{ marginBottom: 16 }}><div style={{ fontSize: 13, fontWeight: 600, color: C.txt, marginBottom: 8 }}>{label}</div>{children}</div>; }
function TxtInp({ val, onChange, type = "text", onKeyDown }) { return <div style={{ border: `1px solid ${C.bdr}`, borderRadius: 8, background: "#fff" }}><input value={val || ""} onChange={e => onChange(e.target.value)} type={type} onKeyDown={onKeyDown} style={{ width: "100%", border: "none", outline: "none", padding: "12px 14px", fontSize: 13, boxSizing: "border-box" }} /></div>; }
function DropSel({ val, onChange, children }) { return <div style={{ border: `1px solid ${C.bdr}`, borderRadius: 8, background: "#fff" }}><select value={val || ""} onChange={e => onChange(e.target.value)} style={{ width: "100%", border: "none", outline: "none", padding: "12px 14px", fontSize: 13, background: "transparent" }}>{children}</select></div>; }

function Sheet({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", zIndex: 9999 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "0 20px 40px", width: "100%", maxHeight: "85vh", overflowY: "auto", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ width: 36, height: 4, background: C.bdr, borderRadius: 2, margin: "12px auto 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 800, fontSize: 17 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── 페이지들 ──────────────────────────────────────────────────

function DashPage({ orders, products }) {
  return <div style={{ padding: 14 }}><h2>대시 보드</h2><Card>오늘 발주: {orders.filter(o => o.date === today()).length}건</Card></div>;
}

function OrderPage({
