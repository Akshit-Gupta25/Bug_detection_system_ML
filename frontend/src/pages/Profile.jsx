import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .profile-page { font-family: 'DM Sans', sans-serif; background-color: #f5f4f0; background-image: linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.018) 1px, transparent 1px); background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px; min-height: 100vh; }

  .profile-inner {
    max-width: 900px; margin: 0 auto;
    padding: 36px 32px 80px;
  }

  .page-breadcrumb {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #aaa; letter-spacing: 0.08em; margin-bottom: 8px;
  }
  .page-breadcrumb span { color: #ccc; margin-right: 4px; }

  .page-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(30px, 3vw, 42px);
    color: #0a0a0a; letter-spacing: -0.8px;
    line-height: 1.05; margin-bottom: 28px;
  }

  /* PROFILE HEADER CARD */
  .profile-hero {
    background: #fff;
    border: 1.5px solid #1a1a1a;
    border-radius: 4px;
    box-shadow: 4px 4px 0 #1a1a1a;
    padding: 28px 28px 24px;
    display: flex; align-items: center; gap: 22px;
    margin-bottom: 20px;
    position: relative; overflow: hidden;
  }
  .profile-hero::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #2563eb, #7c3aed);
  }
  .profile-avatar-xl {
    width: 72px; height: 72px; border-radius: 16px;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif;
    font-size: 30px; color: #fff; flex-shrink: 0;
    text-transform: uppercase; letter-spacing: -1px;
    box-shadow: 0 4px 16px rgba(37,99,235,0.3);
  }
  .profile-hero-info { flex: 1; }
  .profile-hero-name {
    font-family: 'DM Serif Display', serif;
    font-size: 26px; color: #0a0a0a; letter-spacing: -0.5px;
    margin-bottom: 4px;
  }
  .profile-hero-email {
    font-family: 'DM Mono', monospace;
    font-size: 12.5px; color: #888; margin-bottom: 10px;
  }
  .profile-hero-badges { display: flex; align-items: center; gap: 8px; }
  .phb {
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
    padding: 3px 10px; border-radius: 3px; letter-spacing: 0.06em;
  }
  .phb-plan { background: #f5f5f5; color: #666; border: 1px solid #e5e5e5; }
  .phb-plan.pro { background: #f0f6ff; color: #2563eb; border: 1px solid #bfdbfe; }
  .phb-joined { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

  .profile-hero-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
  }
  .edit-profile-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    border: 1.5px solid #d0d0d0; border-radius: 5px;
    background: #fff; color: #333;
    padding: 7px 14px; cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    transition: border-color 0.15s, background 0.15s;
  }
  .edit-profile-btn:hover { border-color: #0a0a0a; background: #fafaf8; }
  .edit-profile-btn svg { width: 13px; height: 13px; stroke: #888; }

  /* GRID LAYOUT */
  .profile-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    margin-bottom: 16px;
  }

  /* SECTION CARD */
  .section-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 6px; overflow: hidden;
  }
  .section-card.full { grid-column: 1 / -1; }

  .card-header {
    padding: 14px 20px;
    border-bottom: 1px solid #f0f0f0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .card-header-title {
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
    color: #888; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .card-header-action {
    font-family: 'DM Mono', monospace; font-size: 11px; color: #2563eb;
    cursor: pointer; letter-spacing: 0.04em; border: none; background: none;
    transition: opacity 0.15s;
  }
  .card-header-action:hover { opacity: 0.7; }

  .card-body { padding: 18px 20px; }

  /* USAGE STATS */
  .usage-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;
  }
  .usage-item { }
  .usage-label {
    font-family: 'DM Mono', monospace; font-size: 10px; color: #aaa;
    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px;
  }
  .usage-vals {
    display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px;
  }
  .usage-used {
    font-family: 'DM Mono', monospace; font-size: 20px; font-weight: 500;
    color: #0a0a0a;
  }
  .usage-total {
    font-family: 'DM Mono', monospace; font-size: 12px; color: #bbb;
  }
  .usage-bar-bg {
    height: 4px; background: #f0f0f0; border-radius: 2px;
  }
  .usage-bar-fill {
    height: 100%; border-radius: 2px; transition: width 0.6s ease;
  }

  /* INFO ROWS */
  .info-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 0; border-bottom: 1px solid #f8f8f8;
  }
  .info-row:last-child { border-bottom: none; }
  .info-row-label {
    font-family: 'DM Mono', monospace; font-size: 11px; color: #aaa;
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .info-row-val {
    font-size: 13.5px; color: #0a0a0a; font-weight: 400;
    font-family: 'DM Sans', sans-serif;
  }
  .info-row-val.mono { font-family: 'DM Mono', monospace; font-size: 12.5px; color: #555; }

  /* CHANGE PASSWORD FORM */
  .pw-form { display: flex; flex-direction: column; gap: 12px; }
  .pw-field-label {
    font-family: 'DM Mono', monospace; font-size: 10.5px; color: #888;
    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px;
  }
  .pw-input {
    width: 100%; height: 42px;
    border: 1px solid #d0d0d0; border-radius: 4px;
    background: #fafaf8; font-family: 'DM Mono', monospace;
    font-size: 13px; color: #0a0a0a; padding: 0 12px; outline: none;
    transition: border-color 0.15s;
  }
  .pw-input:focus { border-color: #0a0a0a; background: #fff; }
  .pw-submit {
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 600;
    background: #0a0a0a; color: #fff; border: none; border-radius: 4px;
    padding: 10px 18px; cursor: pointer; align-self: flex-start;
    transition: background 0.15s;
    display: flex; align-items: center; gap: 7px;
  }
  .pw-submit:hover { background: #222; }
  .pw-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* RECENT SCANS */
  .recent-table { width: 100%; border-collapse: collapse; }
  .recent-table th {
    font-family: 'DM Mono', monospace; font-size: 10px; color: #aaa;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 10px 16px; text-align: left;
    border-bottom: 1px solid #f0f0f0; background: #fafaf8;
  }
  .recent-table td {
    padding: 11px 16px; border-bottom: 1px solid #f7f7f7;
    font-size: 13px; color: #444; vertical-align: middle;
  }
  .recent-table tr:last-child td { border-bottom: none; }
  .recent-table tr:hover td { background: #fafaf8; }
  .rt-type {
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
    padding: 2px 8px; border-radius: 3px; letter-spacing: 0.06em;
  }
  .rt-github { background: #f0f0f0; color: #444; }
  .rt-url    { background: #eff6ff; color: #2563eb; }
  .rt-file   { background: #faf5ff; color: #7c3aed; }
  .rt-risk {
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
    padding: 2px 8px; border-radius: 3px; letter-spacing: 0.06em;
  }
  .rt-high   { background: #fef2f2; color: #dc2626; }
  .rt-medium { background: #fffbeb; color: #d97706; }
  .rt-low    { background: #f0fdf4; color: #16a34a; }
  .rt-target {
    font-family: 'DM Mono', monospace; font-size: 11.5px; color: #555;
    max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .rt-date { font-family: 'DM Mono', monospace; font-size: 11px; color: #bbb; }

  /* DANGER ZONE */
  .danger-card {
    background: #fff; border: 1.5px solid #fecaca;
    border-radius: 6px; overflow: hidden; margin-top: 16px;
  }
  .danger-header {
    padding: 12px 20px; border-bottom: 1px solid #fef2f2;
    background: #fff5f5;
  }
  .danger-title {
    font-family: 'DM Mono', monospace; font-size: 11px; color: #dc2626;
    letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500;
  }
  .danger-body { padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; }
  .danger-desc { font-size: 13.5px; color: #555; }
  .danger-desc strong { color: #0a0a0a; font-weight: 600; }
  .danger-btn {
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    background: #fff; color: #dc2626;
    border: 1.5px solid #fecaca; border-radius: 4px;
    padding: 7px 14px; cursor: pointer; white-space: nowrap;
    transition: background 0.15s, border-color 0.15s;
  }
  .danger-btn:hover { background: #fef2f2; border-color: #dc2626; }

  /* TOAST */
  .toast {
    position: fixed; bottom: 28px; right: 28px;
    background: #0a0a0a; color: #fff;
    font-family: 'DM Mono', monospace; font-size: 12px;
    padding: 11px 18px; border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    letter-spacing: 0.04em; z-index: 999;
    animation: toastIn 0.25s ease;
  }
  .toast.success { background: #16a34a; }
  .toast.error   { background: #dc2626; }
  @keyframes toastIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
`;

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(json);
  } catch { return null; }
}

const RECENT_SCANS = [
  { type:"github", target:"github.com/user/auth-service", date:"Apr 24, 2026", risk:"HIGH" },
  { type:"url",    target:"https://staging.myapp.com",    date:"Apr 23, 2026", risk:"MEDIUM" },
  { type:"file",   target:"ml-service/model.py",          date:"Apr 22, 2026", risk:"HIGH" },
  { type:"github", target:"github.com/user/frontend",     date:"Apr 20, 2026", risk:"LOW" },
];

export default function Profile() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("aa@example.com");
  const [userName, setUserName]   = useState("User");
  const [plan, setPlan]           = useState("FREE");
  const [joinedDate]              = useState("April 2026");

  const [oldPw, setOldPw]   = useState("");
  const [newPw, setNewPw]   = useState("");
  const [confPw, setConfPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [toast, setToast]   = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        const email = payload.sub || payload.email || "user@example.com";
        setUserEmail(email);
        const namePart = email.split("@")[0];
        setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        setPlan(payload.plan || "FREE");
      }
    }
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChangePassword = async () => {
    if (!oldPw || !newPw || !confPw) { showToast("Fill in all fields.", "error"); return; }
    if (newPw !== confPw) { showToast("Passwords don't match.", "error"); return; }
    if (newPw.length < 6) { showToast("Min. 6 characters.", "error"); return; }
    setPwLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ old_password: oldPw, new_password: newPw }),
      });
      if (!res.ok) throw new Error("Incorrect current password.");
      showToast("Password updated ✓");
      setOldPw(""); setNewPw(""); setConfPw("");
    } catch (err) {
      showToast(err.message, "error");
    }
    setPwLoading(false);
  };

  const avatarLetter = userEmail.charAt(0).toUpperCase();

  const typeClass = { github:"rt-github", url:"rt-url", file:"rt-file" };
  const riskClass  = { HIGH:"rt-high", MEDIUM:"rt-medium", LOW:"rt-low" };

  return (
    <>
      <style>{S}</style>
      <div className="profile-page">
        <Navbar currentPage="profile" />

        <div className="profile-inner">
          <div className="page-breadcrumb"><span>/</span> ACCOUNT</div>
          <div className="page-title">Your profile</div>

          {/* Hero */}
          <div className="profile-hero">
            <div className="profile-avatar-xl">{avatarLetter}</div>
            <div className="profile-hero-info">
              <div className="profile-hero-name">{userName}</div>
              <div className="profile-hero-email">{userEmail}</div>
              <div className="profile-hero-badges">
                <span className={`phb phb-plan ${plan !== "FREE" ? "pro" : ""}`}>{plan}</span>
                <span className="phb phb-joined">Joined {joinedDate}</span>
              </div>
            </div>
            <div className="profile-hero-right">
              <button className="edit-profile-btn">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit profile
              </button>
              {plan === "FREE" && (
                  <button
                  onClick={() => navigate("/pricing")}
                  style={{
                    fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600,
                    background:"#2563eb", color:"#fff", borderRadius:4,
                    padding:"5px 12px", border:"none", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:5
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Upgrade plan
                </button>
              )}
            </div>
          </div>

          {/* Main grid */}
          <div className="profile-grid">

            {/* Usage this week */}
            <div className="section-card">
              <div className="card-header">
                <span className="card-header-title">Usage this week</span>
                <button className="card-header-action" onClick={() => navigate("/pricing")}>Upgrade →</button>
              </div>
              <div className="card-body">
                <div className="usage-grid">
                  {[
                    { label:"Repos",    used:0, total:2,  color:"#2563eb" },
                    { label:"Websites", used:0, total:1,  color:"#7c3aed" },
                    { label:"Files",    used:2, total:10, color:"#059669" },
                    { label:"Pastes",   used:5, total:10, color:"#d97706" },
                  ].map((u, i) => (
                    <div className="usage-item" key={i}>
                      <div className="usage-label">{u.label}</div>
                      <div className="usage-vals">
                        <span className="usage-used" style={{color: u.used >= u.total ? "#dc2626" : u.color}}>{u.used}</span>
                        <span className="usage-total">/ {u.total}</span>
                      </div>
                      <div className="usage-bar-bg">
                        <div className="usage-bar-fill" style={{
                          width: `${Math.min((u.used/u.total)*100, 100)}%`,
                          background: u.used >= u.total ? "#dc2626" : u.color
                        }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Account info */}
            <div className="section-card">
              <div className="card-header">
                <span className="card-header-title">Account info</span>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-row-label">Email</span>
                  <span className="info-row-val mono">{userEmail}</span>
                </div>
                <div className="info-row">
                  <span className="info-row-label">Display name</span>
                  <span className="info-row-val">{userName}</span>
                </div>
                <div className="info-row">
                  <span className="info-row-label">Plan</span>
                  <span className="info-row-val">{plan}</span>
                </div>
                <div className="info-row">
                  <span className="info-row-label">Member since</span>
                  <span className="info-row-val mono">{joinedDate}</span>
                </div>
                <div className="info-row">
                  <span className="info-row-label">Total scans</span>
                  <span className="info-row-val mono">7</span>
                </div>
              </div>
            </div>

            {/* Change password */}
            <div className="section-card">
              <div className="card-header">
                <span className="card-header-title">Change password</span>
              </div>
              <div className="card-body">
                <div className="pw-form">
                  <div>
                    <div className="pw-field-label">Current password</div>
                    <input className="pw-input" type="password" placeholder="••••••••"
                      value={oldPw} onChange={e => setOldPw(e.target.value)} />
                  </div>
                  <div>
                    <div className="pw-field-label">New password</div>
                    <input className="pw-input" type="password" placeholder="••••••••"
                      value={newPw} onChange={e => setNewPw(e.target.value)} />
                  </div>
                  <div>
                    <div className="pw-field-label">Confirm new password</div>
                    <input className="pw-input" type="password" placeholder="••••••••"
                      value={confPw} onChange={e => setConfPw(e.target.value)} />
                  </div>
                  <button className="pw-submit" onClick={handleChangePassword} disabled={pwLoading}>
                    {pwLoading ? "Updating..." : "Update password"}
                  </button>
                </div>
              </div>
            </div>

            {/* Notification / preferences placeholder */}
            <div className="section-card">
              <div className="card-header">
                <span className="card-header-title">Preferences</span>
              </div>
              <div className="card-body">
                {[
                  { label:"Email scan report",     desc:"Receive a report after each scan",      on: true  },
                  { label:"Weekly digest",          desc:"Summary of all scans each Monday",      on: false },
                  { label:"High-risk alerts",       desc:"Instant email on HIGH risk detections", on: true  },
                ].map((pref, i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"flex-start", justifyContent:"space-between",
                    padding:"10px 0", borderBottom: i < 2 ? "1px solid #f8f8f8" : "none"
                  }}>
                    <div>
                      <div style={{fontSize:13.5, fontWeight:500, color:"#0a0a0a", marginBottom:2}}>{pref.label}</div>
                      <div style={{fontSize:12, color:"#aaa"}}>{pref.desc}</div>
                    </div>
                    <div style={{
                      width:38, height:22, borderRadius:11,
                      background: pref.on ? "#2563eb" : "#e5e5e5",
                      flexShrink:0, cursor:"pointer", transition:"background 0.2s",
                      position:"relative", marginTop:2
                    }}>
                      <div style={{
                        width:16, height:16, borderRadius:"50%", background:"#fff",
                        position:"absolute", top:3,
                        left: pref.on ? 19 : 3,
                        transition:"left 0.2s",
                        boxShadow:"0 1px 3px rgba(0,0,0,0.2)"
                      }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent scans — full width */}
          <div className="section-card full" style={{gridColumn:"1/-1", marginBottom:16}}>
            <div className="card-header">
              <span className="card-header-title">Recent scans</span>
              <button className="card-header-action" onClick={() => navigate("/history")}>View all →</button>
            </div>
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Target</th>
                  <th>Date</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_SCANS.map((s, i) => (
                  <tr key={i}>
                    <td><span className={`rt-type ${typeClass[s.type]}`}>{s.type.toUpperCase()}</span></td>
                    <td><div className="rt-target">{s.target}</div></td>
                    <td><div className="rt-date">{s.date}</div></td>
                    <td><span className={`rt-risk ${riskClass[s.risk]}`}>{s.risk}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Danger zone */}
          <div className="danger-card">
            <div className="danger-header">
              <div className="danger-title">Danger zone</div>
            </div>
            <div className="danger-body">
              <div className="danger-desc">
                <strong>Delete account</strong> — permanently removes your account, scan history, and all data. This cannot be undone.
              </div>
              <button className="danger-btn" onClick={() => {
                if (window.confirm("Are you sure? This will permanently delete your account.")) {
                  showToast("Account deletion requested.", "error");
                }
              }}>
                Delete account
              </button>
            </div>
          </div>

        </div>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}