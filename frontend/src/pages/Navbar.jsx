import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .bh-nav {
    position: sticky; top: 0; z-index: 100;
    background: #ffffff;
    border-bottom: 1px solid #e5e5e5;
    font-family: 'DM Sans', sans-serif;
  }
  .bh-nav-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 32px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
  }

  /* LOGO */
  .bh-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; cursor: pointer;
  }
  .bh-logo-icon {
    width: 34px; height: 34px;
    background: #2563eb; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .bh-logo-icon svg { width: 18px; height: 18px; }
  .bh-logo-name { font-size: 16px; font-weight: 600; color: #0a0a0a; letter-spacing: -0.2px; }
  .bh-beta {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500;
    background: #0a0a0a; color: #fff;
    padding: 2px 7px; border-radius: 3px;
    letter-spacing: 0.05em; margin-left: 2px;
  }

  /* NAV LINKS */
  .bh-nav-links { display: flex; align-items: center; gap: 2px; }
  .bh-nav-link {
    font-size: 14px; font-weight: 400; color: #666;
    padding: 6px 13px; border-radius: 6px;
    cursor: pointer; text-decoration: none;
    transition: color 0.15s, background 0.15s;
    border: none; background: none;
    font-family: 'DM Sans', sans-serif;
  }
  .bh-nav-link:hover { color: #0a0a0a; background: #f5f5f5; }
  .bh-nav-link.active { color: #2563eb; font-weight: 500; }

  /* USER PILL */
  .bh-user-pill {
    display: flex; align-items: center; gap: 9px;
    padding: 5px 10px 5px 6px;
    border-radius: 8px; border: none;
    background: transparent; cursor: pointer;
    transition: background 0.15s;
    position: relative;
  }
  .bh-user-pill:hover { background: #f5f5f5; }
  .bh-user-pill.open { background: #f0f0f0; }

  .bh-avatar {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600; color: #fff;
    flex-shrink: 0; text-transform: uppercase;
  }
  .bh-user-info { display: flex; flex-direction: column; align-items: flex-start; gap: 1px; }
  .bh-user-email {
    font-family: 'DM Mono', monospace;
    font-size: 11.5px; color: #333;
    max-width: 160px; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; line-height: 1;
  }
  .bh-plan-badge {
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 500;
    background: #f5f5f5; color: #888;
    border: 1px solid #e5e5e5;
    padding: 1px 6px; border-radius: 3px;
    letter-spacing: 0.06em;
  }
  .bh-plan-badge.pro { background: #f0f6ff; color: #2563eb; border-color: #bfdbfe; }
  .bh-chevron {
    width: 14px; height: 14px; color: #aaa;
    transition: transform 0.2s; flex-shrink: 0;
  }
  .bh-chevron.open { transform: rotate(180deg); }

  /* DROPDOWN */
  .bh-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    width: 264px; background: #fff;
    border: 1.5px solid #1a1a1a; border-radius: 8px;
    box-shadow: 4px 4px 0 #1a1a1a;
    overflow: hidden; z-index: 200;
    animation: ddIn 0.15s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes ddIn {
    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .dd-header {
    padding: 14px 16px 12px;
    border-bottom: 1px solid #f0f0f0;
    display: flex; align-items: center; gap: 11px;
  }
  .dd-avatar-lg {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 600; color: #fff; flex-shrink: 0;
    text-transform: uppercase; font-family: 'DM Sans', sans-serif;
  }
  .dd-user-name { font-size: 14px; font-weight: 600; color: #0a0a0a; margin-bottom: 2px; letter-spacing: -0.1px; }
  .dd-user-email {
    font-family: 'DM Mono', monospace; font-size: 11px; color: #999;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 175px;
  }

  .dd-plan-row {
    padding: 10px 16px; border-bottom: 1px solid #f0f0f0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .dd-plan-label {
    font-family: 'DM Mono', monospace; font-size: 10.5px; color: #aaa;
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .dd-plan-badge {
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
    background: #f5f5f5; color: #666; border: 1px solid #e5e5e5;
    padding: 2px 9px; border-radius: 3px; letter-spacing: 0.06em;
  }
  .dd-plan-badge.pro { background: #f0f6ff; color: #2563eb; border-color: #bfdbfe; }
  .dd-upgrade-btn {
    font-family: 'DM Sans', sans-serif; font-size: 11.5px; font-weight: 600;
    background: #2563eb; color: #fff; border: none; border-radius: 4px;
    padding: 4px 10px; cursor: pointer; transition: background 0.15s;
    text-decoration: none; display: inline-flex; align-items: center; gap: 4px;
  }
  .dd-upgrade-btn:hover { background: #1d4ed8; }
  .dd-upgrade-btn svg { width: 10px; height: 10px; }

  .dd-nav { padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
  .dd-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 16px; font-size: 13.5px; color: #333;
    cursor: pointer; transition: background 0.12s;
    text-decoration: none; border: none; background: none;
    width: 100%; text-align: left; font-family: 'DM Sans', sans-serif;
  }
  .dd-nav-item:hover { background: #f8f8f8; color: #0a0a0a; }
  .dd-nav-item svg { width: 15px; height: 15px; stroke: #bbb; flex-shrink: 0; transition: stroke 0.12s; }
  .dd-nav-item:hover svg { stroke: #2563eb; }
  .dd-nav-item.profile-link { font-weight: 600; color: #0a0a0a; }
  .dd-arrow { margin-left: auto; font-size: 11px; color: #ccc; }

  .dd-footer { padding: 6px 0; }
  .dd-logout {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 16px; font-size: 13.5px; color: #dc2626;
    cursor: pointer; transition: background 0.12s;
    border: none; background: none; width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .dd-logout:hover { background: #fff5f5; }
  .dd-logout svg { width: 15px; height: 15px; stroke: #dc2626; flex-shrink: 0; }
`;

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function Navbar({ currentPage = "home" }) {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("aa@example.com");
  const [userName, setUserName] = useState("User");
  const [plan, setPlan] = useState("FREE");
  const dropRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        const email = payload.sub || payload.email || payload.user_email || "user@example.com";
        setUserEmail(email);
        const namePart = email.split("@")[0];
        setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        setPlan(payload.plan || "FREE");
      }
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const avatarLetter = userEmail.charAt(0).toUpperCase();
  const routerNavigate = useNavigate();
  const navigate = (path) => { setOpen(false); routerNavigate(path); };
  const handleLogout = () => { localStorage.removeItem("token"); routerNavigate("/login"); };

  const links = [
    { key: "home",      label: "Home",      path: "/" },
    { key: "dashboard", label: "Dashboard", path: "/dashboard" },
    { key: "history",   label: "History",   path: "/history" },
    { key: "pricing",   label: "Pricing",   path: "/pricing" },
  ];

  return (
    <>
      <style>{NAV_STYLES}</style>
      <nav className="bh-nav">
        <div className="bh-nav-inner">

          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div className="bh-logo" onClick={() => navigate("/")}>
              <div className="bh-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <span className="bh-logo-name">BugHunter</span>
              <span className="bh-beta">BETA</span>
            </div>

            <nav className="bh-nav-links">
              {links.map(l => (
                <button
                  key={l.key}
                  className={`bh-nav-link ${currentPage === l.key ? "active" : ""}`}
                  onClick={() => navigate(l.path)}
                >{l.label}</button>
              ))}
            </nav>
          </div>

          {/* Right: User pill + Dropdown */}
          <div style={{ position: "relative" }} ref={dropRef}>
            <button
              className={`bh-user-pill ${open ? "open" : ""}`}
              onClick={() => setOpen(o => !o)}
            >
              <div className="bh-avatar">{avatarLetter}</div>
              <div className="bh-user-info">
                <div className="bh-user-email">{userEmail}</div>
                <span className={`bh-plan-badge ${plan !== "FREE" ? "pro" : ""}`}>{plan}</span>
              </div>
              <svg className={`bh-chevron ${open ? "open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {open && (
              <div className="bh-dropdown">

                {/* Header */}
                <div className="dd-header">
                  <div className="dd-avatar-lg">{avatarLetter}</div>
                  <div>
                    <div className="dd-user-name">{userName}</div>
                    <div className="dd-user-email">{userEmail}</div>
                  </div>
                </div>

                {/* Plan */}
                <div className="dd-plan-row">
                  <span className="dd-plan-label">Current plan</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={`dd-plan-badge ${plan !== "FREE" ? "pro" : ""}`}>{plan}</span>
                    {plan === "FREE" && (
                      <a className="dd-upgrade-btn" href="/pricing">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                        Upgrade
                      </a>
                    )}
                  </div>
                </div>

                {/* Nav */}
                <div className="dd-nav">
                  <button className="dd-nav-item profile-link" onClick={() => navigate("/profile")}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    View Profile
                    <span className="dd-arrow">→</span>
                  </button>
                  <button className="dd-nav-item" onClick={() => navigate("/dashboard")}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Dashboard
                  </button>
                  <button className="dd-nav-item" onClick={() => navigate("/history")}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Scan History
                  </button>
                  <button className="dd-nav-item" onClick={() => navigate("/pricing")}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    Pricing
                  </button>
                </div>

                {/* Logout */}
                <div className="dd-footer">
                  <button className="dd-logout" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Log out
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}