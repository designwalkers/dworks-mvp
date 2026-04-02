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
  updateUser: (t, meta) => api("PUT", "/auth/v1/user", t, { data: meta }),
  // [수정] 내 데이터만 가져오도록 쿼리 보강
  list: (t, tbl, uid) => api("GET", `/rest/v1/${tbl}?user_id=eq.${uid}&order=created_at.asc`, t),
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
      body: JSON.stringify({
        service_id: EJS.SID,
        template_id: EJS.TID,
        user_id: EJS.PK,
        template_params: { to_email: toEmail, to_name: toName, subject, message, from_name: "D-Works" }
      })
    });
    return r.status === 200;
  } catch { return false; }
}

// ── 디자인 상수 ──────────────────────────────────────────────────
const C = { bg: "#F8F9FB", card: "#FFFFFF", bdr: "#E8ECF2", acc: "#3772FF", txt: "#111827", sub: "#9CA3AF", sub2: "#6B7280", ok: "#10B981", warn: "#F59E
