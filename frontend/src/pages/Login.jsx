import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : data.detail?.[0]?.msg || "Login failed");
      localStorage.setItem("token", data.access_token);
      setSuccess(true);
      setTimeout(() => (window.location.href = "/"), 1200);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .root {
          display: flex;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
        }

        .left {
          flex: 0 0 46%;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          padding: 36px 52px 52px;
          position: relative;
          overflow: hidden;
        }
        .left::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px);
          pointer-events: none;
        }
        .left::after {
          content: '';
          position: absolute;
          bottom: -120px; left: -80px;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(220,50,50,0.13) 0%, transparent 70%);
          pointer-events: none;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 11px;
          position: relative;
          z-index: 1;
        }
        .logo-icon {
          width: 38px; height: 38px;
          background: #2563eb;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .logo-icon svg { width: 20px; height: 20px; }
        .logo-name {
          font-size: 17px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.2px;
        }

        .left-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 1;
          padding-bottom: 40px;
        }

        .badge {
          font-family: 'DM Mono', monospace;
          font-size: 11.5px;
          font-weight: 500;
          color: #4ade80;
          letter-spacing: 0.08em;
          margin-bottom: 28px;
        }
        .badge span { color: rgba(255,255,255,0.22); margin-right: 4px; }

        .headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(38px, 4vw, 54px);
          line-height: 1.1;
          color: #ffffff;
          letter-spacing: -1px;
        }
        .headline em { font-style: italic; color: #ef4444; }

        .tagline {
          margin-top: 26px;
          font-size: 14.5px;
          font-weight: 300;
          color: rgba(255,255,255,0.38);
          line-height: 1.72;
          max-width: 340px;
        }

        .left-footer {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .stat { display: flex; flex-direction: column; gap: 3px; }
        .stat-num {
          font-family: 'DM Mono', monospace;
          font-size: 20px;
          font-weight: 500;
          color: #fff;
        }
        .stat-label {
          font-size: 11px;
          font-weight: 400;
          color: rgba(255,255,255,0.28);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .stat-div { width: 1px; height: 36px; background: rgba(255,255,255,0.1); }

        .right {
          flex: 1;
          background: #f3f2ee;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .right::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        .card {
          position: relative;
          z-index: 1;
          width: 390px;
          background: #ffffff;
          border: 1.5px solid #1a1a1a;
          border-radius: 2px;
          box-shadow: 6px 6px 0 #1a1a1a;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .card.mounted { opacity: 1; transform: translateY(0); }

        .card-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 22px;
          border-bottom: 1px solid #ebebeb;
        }
        .bar-left {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #aaa;
          letter-spacing: 0.05em;
        }
        .bar-left span { color: #ccc; margin-right: 4px; }
        .bar-right {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: #1a1a1a;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: opacity 0.15s;
          text-decoration: none;
        }
        .bar-right:hover { opacity: 0.55; }

        .card-body { padding: 30px 28px 26px; }

        .card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 33px;
          font-weight: 400;
          color: #0a0a0a;
          letter-spacing: -0.4px;
          line-height: 1.1;
          margin-bottom: 5px;
        }
        .card-sub {
          font-size: 14px;
          color: #999;
          font-weight: 300;
          margin-bottom: 26px;
        }

        .field { margin-bottom: 16px; }
        .field-label {
          display: block;
          font-family: 'DM Mono', monospace;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 7px;
        }
        .field-wrap { position: relative; }
        .field-input {
          width: 100%;
          height: 46px;
          border: 1px solid #d0d0d0;
          border-radius: 2px;
          background: #fafafa;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #0a0a0a;
          padding: 0 14px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .field-input::placeholder { color: #c0c0c0; font-weight: 300; }
        .field-input:focus { border-color: #0a0a0a; background: #fff; }
        .field-input.err { border-color: #ef4444; }
        .field-input.pass { padding-right: 40px; }

        .eye-btn {
          position: absolute; right: 11px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; padding: 4px;
          color: #bbb;
          display: flex; align-items: center;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: #555; }
        .eye-btn svg { width: 16px; height: 16px; }

        .forgot {
          display: block;
          text-align: right;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #aaa;
          text-decoration: none;
          letter-spacing: 0.03em;
          margin-top: 6px;
          transition: color 0.15s;
        }
        .forgot:hover { color: #1a1a1a; }

        .error-box {
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 2px;
          padding: 10px 12px;
          margin-bottom: 14px;
          font-size: 13px;
          color: #dc2626;
          display: flex; align-items: center; gap: 7px;
          animation: errIn 0.2s ease;
        }
        @keyframes errIn { from { opacity:0; transform:translateY(-4px);} to { opacity:1; transform:translateY(0);} }
        .error-box svg { width: 13px; height: 13px; flex-shrink: 0; fill: #dc2626; }

        .submit-btn {
          width: 100%;
          height: 50px;
          margin-top: 20px;
          border: 1.5px solid #0a0a0a;
          border-radius: 2px;
          background: #0a0a0a;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: background 0.15s, transform 0.1s;
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) { background: #222; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .submit-btn.ok { background: #16a34a; border-color: #16a34a; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ck { animation: pop 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes pop { from{transform:scale(0);} to{transform:scale(1);} }

        .back-home {
          display: block;
          text-align: center;
          margin-top: 16px;
          font-family: 'DM Mono', monospace;
          font-size: 11.5px;
          color: #bbb;
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: color 0.15s;
        }
        .back-home:hover { color: #555; }

        @media (max-width: 820px) {
          .root { flex-direction: column; }
          .left { flex: none; padding: 32px; min-height: 48vh; }
          .right { padding: 48px 20px; }
          .card { width: 100%; max-width: 400px; }
        }
      `}</style>

      <div className="root">

        {/* LEFT */}
        <div className="left">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <span className="logo-name">BugHunter</span>
          </div>

          <div className="left-content">
            <div className="badge"><span>//</span> QA ENGINE v1.0</div>
            <h1 className="headline">
              Predict.<br />
              Present.<br />
              <em>Prevent</em> bugs.
            </h1>
            <p className="tagline">
              An industrial-grade diagnostics engine. Scan GitHub repos, URLs,
              code snippets and files — get categorized risks with visual fixes.
            </p>
          </div>

          <div className="left-footer">
            <div className="stat">
              <span className="stat-num">99.2%</span>
              <span className="stat-label">Detection rate</span>
            </div>
            <div className="stat-div" />
            <div className="stat">
              <span className="stat-num">12k+</span>
              <span className="stat-label">Repos scanned</span>
            </div>
            <div className="stat-div" />
            <div className="stat">
              <span className="stat-num">&lt;2s</span>
              <span className="stat-label">Avg scan time</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className={`card ${mounted ? "mounted" : ""}`}>

            <div className="card-bar">
              <span className="bar-left"><span>/</span> SESSION</span>
              <Link to="/signup" className="fontsize -10">
                  Create account
              </Link>
            </div>

            <div className="card-body">
              <h2 className="card-title">Welcome back</h2>
              <p className="card-sub">Sign in to run scans</p>

              <div className="field">
                <label className="field-label">Email</label>
                <div className="field-wrap">
                  <input
                    type="email"
                    className={`field-input ${error ? "err" : ""}`}
                    placeholder="you@team.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    className={`field-input pass ${error ? "err" : ""}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button className="eye-btn" onClick={() => setShowPass(!showPass)} type="button" tabIndex={-1}>
                    {showPass ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                <a href="#" className="forgot">← forgot password</a>
              </div>

              {error && (
                <div className="error-box">
                  <svg viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7h2v2h-2v-2zm0-8h2v6h-2V7z"/></svg>
                  {error}
                </div>
              )}

              <button
                className={`submit-btn ${success ? "ok" : ""}`}
                onClick={handleLogin}
                disabled={loading || success}
              >
                {loading ? (
                  <><div className="spinner" /> Signing in...</>
                ) : success ? (
                  <>
                    <svg className="ck" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Success
                  </>
                ) : "Sign in"}
              </button>

              <a href="/" className="back-home">← back home</a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Login;