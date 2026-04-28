import { useEffect, useState } from "react";
import Navbar from "./Navbar";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home { font-family: 'DM Sans', sans-serif; background-color: #fafaf8; background-image: linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.018) 1px, transparent 1px); background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px; min-height: 100vh; }

  /* HERO */
  .hero {
    max-width: 1280px; margin: 0 auto;
    padding: 80px 32px 64px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 11px; font-weight: 500;
    color: #16a34a;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 20px;
    padding: 4px 12px;
    margin-bottom: 24px;
    letter-spacing: 0.06em;
  }
  .hero-badge-dot {
    width: 6px; height: 6px;
    background: #16a34a;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(1.4);} }

  .hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(42px, 5vw, 68px);
    line-height: 1.04;
    letter-spacing: -1.5px;
    color: #0a0a0a;
    margin-bottom: 8px;
  }
  .hero-title em { font-style: italic; color: #2563eb; }

  .hero-sub-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(42px, 5vw, 68px);
    line-height: 1.04;
    letter-spacing: -1.5px;
    color: #0a0a0a;
    margin-bottom: 20px;
  }

  .hero-desc {
    font-size: 15.5px; font-weight: 300;
    color: #555; line-height: 1.7;
    max-width: 420px; margin-bottom: 32px;
  }

  .hero-cta-row {
    display: flex; align-items: center; gap: 14px; margin-bottom: 32px;
  }
  .btn-primary {
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px; font-weight: 600;
    background: #2563eb; color: #fff;
    border: none; border-radius: 6px;
    padding: 11px 22px; cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    transition: background 0.15s, transform 0.1s;
    text-decoration: none;
  }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-primary:active { transform: scale(0.99); }
  .btn-outline {
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px; font-weight: 500;
    background: #fff; color: #0a0a0a;
    border: 1.5px solid #d0d0d0;
    border-radius: 6px; padding: 10px 20px;
    cursor: pointer; transition: border-color 0.15s, background 0.15s;
    text-decoration: none;
  }
  .btn-outline:hover { border-color: #0a0a0a; }
  .hero-fine {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #aaa;
    letter-spacing: 0.04em;
  }

  .hero-stats {
    display: flex; gap: 32px;
    padding-top: 28px;
    border-top: 1px solid #e8e8e8;
  }
  .hstat {}
  .hstat-num {
    font-family: 'DM Mono', monospace;
    font-size: 22px; font-weight: 500;
    color: #0a0a0a;
  }
  .hstat-label {
    font-size: 12px; color: #999;
    text-transform: uppercase; letter-spacing: 0.07em;
    margin-top: 2px;
  }

  /* TERMINAL MOCKUP */
  .hero-right { display: flex; flex-direction: column; gap: 16px; }
  .terminal {
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  }
  .term-bar {
    background: #161b22;
    padding: 10px 16px;
    display: flex; align-items: center; gap: 8px;
    border-bottom: 1px solid #21262d;
  }
  .term-dot { width: 10px; height: 10px; border-radius: 50%; }
  .term-title {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #6e7681;
    margin-left: 8px;
    letter-spacing: 0.04em;
  }
  .term-body { padding: 18px 20px; font-family: 'DM Mono', monospace; font-size: 12.5px; line-height: 1.8; }
  .tc-dim { color: #6e7681; }
  .tc-g { color: #3fb950; }
  .tc-b { color: #58a6ff; }
  .tc-y { color: #e3b341; }
  .tc-r { color: #f85149; }
  .tc-w { color: #c9d1d9; }
  .tc-cursor { display: inline-block; width: 8px; height: 14px; background: #3fb950; vertical-align: middle; animation: blink 1s infinite; }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }

  /* SECTION */
  .section { max-width: 1280px; margin: 0 auto; padding: 72px 32px; }
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #999; letter-spacing: 0.1em;
    margin-bottom: 10px;
  }
  .section-label span { color: #2563eb; margin-right: 6px; }
  .section-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(32px, 3.5vw, 46px);
    color: #0a0a0a; letter-spacing: -0.8px;
    line-height: 1.1; margin-bottom: 16px;
  }
  .section-sub {
    font-size: 15px; font-weight: 300; color: #666;
    max-width: 460px; line-height: 1.7;
  }

  /* INPUT MODES GRID */
  .modes-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: #e5e5e5;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 40px;
  }
  .mode-card {
    background: #fff;
    padding: 28px 24px;
    transition: background 0.15s;
  }
  .mode-card:hover { background: #fafaf8; }
  .mode-quota {
    font-family: 'DM Mono', monospace;
    font-size: 10px; color: #bbb;
    letter-spacing: 0.08em; margin-bottom: 16px;
    text-align: right;
  }
  .mode-icon {
    width: 36px; height: 36px;
    background: #f0f6ff; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
  }
  .mode-icon svg { width: 18px; height: 18px; stroke: #2563eb; }
  .mode-name {
    font-size: 15px; font-weight: 600; color: #0a0a0a;
    margin-bottom: 8px;
  }
  .mode-desc { font-size: 13px; font-weight: 300; color: #888; line-height: 1.6; }

  /* DIVIDER */
  .divider { border: none; border-top: 1px solid #e8e8e8; margin: 0 32px; }

  /* OUTPUT SECTION */
  .output-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 64px; align-items: start;
    margin-top: 0;
  }
  .output-list { margin-top: 32px; display: flex; flex-direction: column; gap: 2px; }
  .output-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 18px 20px;
    border: 1px solid transparent;
    border-radius: 8px;
    transition: border-color 0.15s, background 0.15s;
    cursor: default;
  }
  .output-item:hover { border-color: #e5e5e5; background: #fff; }
  .output-item-icon {
    width: 34px; height: 34px; flex-shrink: 0;
    background: #f0f6ff; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }
  .output-item-icon svg { width: 16px; height: 16px; stroke: #2563eb; }
  .output-item-title { font-size: 14.5px; font-weight: 600; color: #0a0a0a; margin-bottom: 3px; }
  .output-item-desc { font-size: 13px; font-weight: 300; color: #888; line-height: 1.55; }

  /* REPORT PREVIEW */
  .report-preview {
    background: #fff;
    border: 1.5px solid #1a1a1a;
    border-radius: 4px;
    box-shadow: 5px 5px 0 #1a1a1a;
    overflow: hidden;
    margin-top: 32px;
  }
  .rp-header {
    background: #0d1117; padding: 12px 18px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .rp-title { font-family: 'DM Mono', monospace; font-size: 11px; color: #6e7681; }
  .rp-dots { display: flex; gap: 6px; }
  .rp-body { padding: 20px; }
  .rp-row {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 4px;
    margin-bottom: 4px;
    font-size: 13px;
  }
  .rp-row:nth-child(odd) { background: #fafaf8; }
  .rp-severity {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500;
    padding: 2px 7px; border-radius: 3px;
    letter-spacing: 0.05em;
  }
  .sev-high { background: #fef2f2; color: #dc2626; }
  .sev-med { background: #fffbeb; color: #d97706; }
  .sev-low { background: #f0fdf4; color: #16a34a; }
  .rp-file { font-family: 'DM Mono', monospace; font-size: 11.5px; color: #555; flex: 1; }
  .rp-pct { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500; color: #dc2626; }

  /* CTA BANNER */
  .cta-band {
    background: #0a0a0a;
    padding: 72px 32px;
    text-align: center;
  }
  .cta-band-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(32px, 4vw, 52px);
    color: #fff; letter-spacing: -1px;
    margin-bottom: 12px;
  }
  .cta-band-title em { font-style: italic; color: #3b82f6; }
  .cta-band-sub { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.45); margin-bottom: 28px; }
  .cta-band-btns { display: flex; align-items: center; justify-content: center; gap: 14px; }
  .btn-white {
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px; font-weight: 600;
    background: #fff; color: #0a0a0a;
    border: none; border-radius: 6px;
    padding: 11px 22px; cursor: pointer;
    transition: opacity 0.15s;
    text-decoration: none;
  }
  .btn-white:hover { opacity: 0.88; }
  .btn-ghost {
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px; font-weight: 500;
    background: transparent; color: rgba(255,255,255,0.6);
    border: 1.5px solid rgba(255,255,255,0.2);
    border-radius: 6px; padding: 10px 20px;
    cursor: pointer; transition: border-color 0.15s, color 0.15s;
    text-decoration: none;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

  /* FOOTER */
  .footer {
    border-top: 1px solid #e8e8e8;
    padding: 24px 32px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 11.5px; color: #bbb;
    letter-spacing: 0.03em;
    background: #fafaf8;
  }

  @media(max-width:900px){
    .hero { grid-template-columns: 1fr; }
    .modes-grid { grid-template-columns: 1fr 1fr; }
    .output-grid { grid-template-columns: 1fr; }
  }
`;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  return (
    <>
      <style>{S}</style>
      <div className="home">
        <Navbar currentPage="home" />

        {/* HERO */}
        <div className="hero">
          <div>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              CLAUDE SONNET 4.5 — LIVE
            </div>
            <div className="hero-title">Predict. Present.</div>
            <div className="hero-sub-title"><em>Prevent</em> bugs<br/>before shipping.</div>
            <p className="hero-desc">
              An industrial-grade QA engine. Paste code, drop a repo, or point us at a URL — get categorized risks, severity mapping, and visual fixes in under 30 seconds.
            </p>
            <div className="hero-cta-row">
              <a className="btn-primary" href="/dashboard">
                Start free scan →
              </a>
              <a className="btn-outline" href="/pricing">See pricing</a>
            </div>
            <div className="hero-fine">No credit card · 2 repos + 1 URL + 10 files / week free</div>

            <div className="hero-stats">
              <div className="hstat">
                <div className="hstat-num">10+</div>
                <div className="hstat-label">Risk categories</div>
              </div>
              <div className="hstat">
                <div className="hstat-num">&lt;30s</div>
                <div className="hstat-label">Avg scan time</div>
              </div>
              <div className="hstat">
                <div className="hstat-num">4</div>
                <div className="hstat-label">Input modes</div>
              </div>
              <div className="hstat">
                <div className="hstat-num">AI</div>
                <div className="hstat-label">Claude Sonnet 4.5</div>
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="hero-right">
            <div className="terminal">
              <div className="term-bar">
                <div className="term-dot" style={{background:"#ff5f57"}} />
                <div className="term-dot" style={{background:"#febc2e"}} />
                <div className="term-dot" style={{background:"#28c840"}} />
                <span className="term-title">bughunter — scan report</span>
              </div>
              <div className="term-body">
                <div><span className="tc-dim">$</span> <span className="tc-g">bughunter</span> <span className="tc-w">scan ./api/auth.py</span></div>
                <div><span className="tc-y">→ Running 7 QA techniques...</span></div>
                <div><span className="tc-r">✗ auth.py:42 insecure bcrypt rounds</span></div>
                <div><span className="tc-r">✗ auth.py:103 injecting range</span></div>
                <div><span className="tc-y">⚠ auth.py:185 missing rate-limit</span></div>
                <div><span className="tc-dim">────────────────────────────</span></div>
                <div><span className="tc-g">✓</span> <span className="tc-w">4 medium · 3 high · 1 critical</span></div>
                <div><span className="tc-b">→ Generating fixes...</span></div>
                <div>&nbsp;<span className="tc-cursor" /></div>
              </div>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* INPUT MODES */}
        <div className="section">
          <div className="section-label"><span>01</span> / INPUTS</div>
          <div className="section-title">Four ways in.<br/>One diagnostic engine.</div>

          <div className="modes-grid">
            {[
              { icon: <><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3"/></>, name:"GitHub Repo", quota:"/ REPOS", desc:"Scan any public repo. We walk the tree, sample key files, and generate a whole-project risk report." },
              { icon: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>, name:"Website URL", quota:"/ WEBSITES", desc:"Crawl rendered HTML and headers. Identify XSS defects, console-leak risks, missing meta, and UI issues." },
              { icon: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>, name:"Paste Code", quota:"/ PASTES", desc:"Drop a snippet, a function, or an entire file into the textarea. Fastest path to a focused diagnosis." },
              { icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>, name:"Upload File", quota:"/ FILES", desc:"Ingest a single source file — py, js, java, ts and more. Line-level bug highlighting." },
            ].map((m, i) => (
              <div className="mode-card" key={i}>
                <div className="mode-quota">0 {m.quota}</div>
                <div className="mode-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{m.icon}</svg>
                </div>
                <div className="mode-name">{m.name}</div>
                <div className="mode-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <hr className="divider" />

        {/* OUTPUT */}
        <div className="section">
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start"}}>
            <div>
              <div className="section-label"><span>02</span> / OUTPUT</div>
              <div className="section-title">The 3P Report:<br/>Predict. Present.<br/><em style={{fontStyle:"italic",color:"#2563eb"}}>Prevent.</em></div>
              <p className="section-sub" style={{marginTop:16}}>Every scan produces a structured report with severity mapping, categorized risks, buggy-snippet highlighting, and bullet-point solutions — designed for engineering teams who ship to production.</p>
              <div className="output-list">
                {[
                  { title:"Risky Components", desc:"Functions, UI variables, APIs, tests — categorized with severity." },
                  { title:"Buggy Snippet Highlighting", desc:"Exact file/line references with the offending code block extracted." },
                  { title:"Visual Solutions", desc:"Bullet-point fixes plus a corrected code snippet you can paste back." },
                  { title:"Preventive Playbook", desc:"What to change in your workflow, tests, or tooling to stop this class of bug." },
                ].map((item, i) => (
                  <div className="output-item" key={i}>
                    <div className="output-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="output-item-title">{item.title}</div>
                      <div className="output-item-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-preview">
              <div className="rp-header">
                <div className="rp-dots">
                  <div className="term-dot" style={{background:"#ff5f57"}} />
                  <div className="term-dot" style={{background:"#febc2e"}} />
                  <div className="term-dot" style={{background:"#28c840"}} />
                </div>
                <span className="rp-title">scan-report.json</span>
              </div>
              <div className="rp-body">
                {[
                  { f:"auth.py", s:"HIGH", p:"96%" },
                  { f:"model.py", s:"HIGH", p:"91%" },
                  { f:"routes.js", s:"MEDIUM", p:"74%" },
                  { f:"utils.ts", s:"MEDIUM", p:"68%" },
                  { f:"config.env", s:"HIGH", p:"88%" },
                  { f:"index.jsx", s:"LOW", p:"31%" },
                  { f:"helpers.py", s:"LOW", p:"22%" },
                ].map((row, i) => (
                  <div className="rp-row" key={i}>
                    <span className={`rp-severity ${row.s==="HIGH"?"sev-high":row.s==="MEDIUM"?"sev-med":"sev-low"}`}>{row.s}</span>
                    <span className="rp-file">{row.f}</span>
                    <span className="rp-pct" style={{color:row.s==="LOW"?"#16a34a":row.s==="MEDIUM"?"#d97706":"#dc2626"}}>{row.p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-band">
          <div className="cta-band-title">Ship <em>defect-free</em> code.</div>
          <div className="cta-band-sub">Start scanning in 30 seconds. No credit card required.</div>
          <div className="cta-band-btns">
            <a className="btn-white" href="/dashboard">Start free scan →</a>
            <a className="btn-ghost" href="/pricing">View pricing</a>
          </div>
        </div>

        <div className="footer">
          Secure payments via Razorpay · Cancel anytime · All plans include full report history
        </div>
      </div>
    </>
  );
}