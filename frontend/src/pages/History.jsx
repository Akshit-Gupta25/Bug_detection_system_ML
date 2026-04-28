import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .history-page { font-family: 'DM Sans', sans-serif; background-color: #f5f4f0; background-image: linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.018) 1px, transparent 1px); background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px; min-height: 100vh; }

  .history-inner {
    max-width: 1280px; margin: 0 auto; padding: 36px 32px 64px;
  }

  .page-breadcrumb {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #aaa;
    letter-spacing: 0.08em; margin-bottom: 8px;
  }
  .page-breadcrumb span { color: #aaa; margin-right: 4px; }

  .page-title-row {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 28px;
  }
  .page-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(32px, 3.5vw, 46px);
    color: #0a0a0a; letter-spacing: -0.8px; line-height: 1.05;
  }

  .new-scan-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 600;
    background: #0a0a0a; color: #fff;
    border: 1.5px solid #0a0a0a;
    border-radius: 5px; padding: 9px 18px;
    cursor: pointer; display: flex; align-items: center; gap: 7px;
    transition: background 0.15s;
    text-decoration: none;
  }
  .new-scan-btn:hover { background: #222; }
  .new-scan-btn svg { width: 13px; height: 13px; }

  /* Empty state card */
  .history-card {
    background: #fff;
    border: 1.5px solid #1a1a1a;
    border-radius: 4px;
    box-shadow: 4px 4px 0 #1a1a1a;
    overflow: hidden;
  }

  .empty-wrap {
    padding: 80px 32px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
  }
  .empty-icon {
    width: 52px; height: 52px;
    background: #f5f5f5; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 18px;
  }
  .empty-icon svg { width: 24px; height: 24px; stroke: #ccc; }
  .empty-title {
    font-family: 'DM Serif Display', serif;
    font-size: 22px; color: #0a0a0a;
    letter-spacing: -0.3px; margin-bottom: 6px;
  }
  .empty-sub {
    font-size: 13.5px; color: #999; font-weight: 300;
    margin-bottom: 22px;
  }
  .empty-cta {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600;
    background: #2563eb; color: #fff;
    border: none; border-radius: 5px;
    padding: 10px 20px; cursor: pointer;
    display: inline-flex; align-items: center; gap: 7px;
    transition: background 0.15s;
    text-decoration: none;
  }
  .empty-cta:hover { background: #1d4ed8; }

  /* ── POPULATED STATE ── */
  .filter-bar {
    padding: 14px 20px;
    border-bottom: 1px solid #f0f0f0;
    display: flex; align-items: center; gap: 10px;
  }
  .filter-pill {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px; font-weight: 500;
    letter-spacing: 0.06em;
    padding: 5px 12px; border-radius: 20px;
    border: 1px solid #e5e5e5;
    background: #fff; color: #888;
    cursor: pointer; transition: all 0.15s;
    text-transform: uppercase;
  }
  .filter-pill:hover { border-color: #0a0a0a; color: #0a0a0a; }
  .filter-pill.on { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }

  .search-box {
    margin-left: auto;
    font-family: 'DM Mono', monospace;
    font-size: 12px; color: #0a0a0a;
    background: #fafaf8;
    border: 1px solid #e5e5e5; border-radius: 5px;
    padding: 6px 12px; outline: none;
    width: 200px; transition: border-color 0.15s;
  }
  .search-box::placeholder { color: #bbb; }
  .search-box:focus { border-color: #0a0a0a; }

  .history-table { width: 100%; border-collapse: collapse; }
  .history-table th {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500;
    color: #aaa; letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 12px 20px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
    background: #fafaf8;
  }
  .history-table td {
    padding: 14px 20px;
    border-bottom: 1px solid #f7f7f7;
    font-size: 13.5px; color: #333;
    vertical-align: middle;
  }
  .history-table tr:last-child td { border-bottom: none; }
  .history-table tr:hover td { background: #fafaf8; }

  .scan-type-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500;
    padding: 3px 9px; border-radius: 3px;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .st-github { background: #f0f0f0; color: #333; }
  .st-url    { background: #eff6ff; color: #2563eb; }
  .st-file   { background: #faf5ff; color: #7c3aed; }
  .st-paste  { background: #fff7ed; color: #c2410c; }
  .st-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  .risk-pill {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500;
    padding: 3px 9px; border-radius: 3px;
    letter-spacing: 0.06em;
  }
  .rp-high   { background: #fef2f2; color: #dc2626; }
  .rp-medium { background: #fffbeb; color: #d97706; }
  .rp-low    { background: #f0fdf4; color: #16a34a; }

  .target-cell {
    font-family: 'DM Mono', monospace; font-size: 12px;
    color: #0a0a0a; max-width: 260px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .date-cell {
    font-family: 'DM Mono', monospace; font-size: 11.5px; color: #aaa;
  }
  .files-cell {
    font-family: 'DM Mono', monospace; font-size: 12px; color: #555;
  }

  .row-action {
    font-family: 'DM Mono', monospace;
    font-size: 11px; font-weight: 500;
    color: #2563eb; background: none;
    border: 1px solid #bfdbfe; border-radius: 4px;
    padding: 4px 11px; cursor: pointer;
    letter-spacing: 0.04em;
    transition: background 0.15s, color 0.15s;
  }
  .row-action:hover { background: #2563eb; color: #fff; border-color: #2563eb; }

  .delete-btn {
    background: none; border: none;
    color: #ddd; cursor: pointer; padding: 4px 6px;
    border-radius: 4px; transition: color 0.15s, background 0.15s;
  }
  .delete-btn:hover { color: #dc2626; background: #fef2f2; }
  .delete-btn svg { width: 13px; height: 13px; }

  /* SUMMARY STRIP */
  .summary-strip {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 1px; background: #e5e5e5;
    border: 1px solid #e5e5e5; border-radius: 6px;
    overflow: hidden; margin-bottom: 20px;
  }
  .strip-cell {
    background: #fff; padding: 14px 18px;
  }
  .strip-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; color: #aaa;
    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px;
  }
  .strip-val {
    font-family: 'DM Serif Display', serif;
    font-size: 26px; color: #0a0a0a; letter-spacing: -0.5px;
  }

  .pagination {
    display: flex; align-items: center; justify-content: center;
    gap: 6px; padding: 18px 0 0;
  }
  .pg-btn {
    font-family: 'DM Mono', monospace; font-size: 12px;
    width: 32px; height: 32px; border-radius: 4px;
    border: 1px solid #e5e5e5; background: #fff; color: #555;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .pg-btn:hover, .pg-btn.on { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }
`;

const MOCK_SCANS = [
  { id:1, type:"github", target:"github.com/user/auth-service", date:"2026-04-24 14:32", files:12, high:4, risk:"HIGH" },
  { id:2, type:"url", target:"https://staging.myapp.com", date:"2026-04-23 09:11", files:1, high:2, risk:"MEDIUM" },
  { id:3, type:"file", target:"ml-service/model.py", date:"2026-04-22 18:55", files:1, high:3, risk:"HIGH" },
  { id:4, type:"paste", target:"Snippet: def train_model(features)...", date:"2026-04-21 11:30", files:1, high:0, risk:"LOW" },
  { id:5, type:"github", target:"github.com/user/frontend-app", date:"2026-04-20 16:44", files:8, high:1, risk:"MEDIUM" },
  { id:6, type:"url", target:"https://prod.bugfree.io/api", date:"2026-04-19 08:20", files:1, high:5, risk:"HIGH" },
];

export default function History() {
  const [scans, setScans] = useState(MOCK_SCANS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [hasScans] = useState(true); // set to false to see empty state

  const filtered = scans.filter(s => {
    const matchType = filter === "all" || s.type === filter;
    const matchSearch = s.target.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const typeClass = { github:"st-github", url:"st-url", file:"st-file", paste:"st-paste" };
  const riskClass = { HIGH:"rp-high", MEDIUM:"rp-medium", LOW:"rp-low" };

  return (
    <>
      <style>{S}</style>
      <div className="history-page">
        <Navbar currentPage="history" />
        <div className="history-inner">

          <div className="page-breadcrumb"><span>/</span> ARCHIVE</div>
          <div className="page-title-row">
            <div className="page-title">Scan history</div>
            <a className="new-scan-btn" href="/dashboard">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New scan
            </a>
          </div>

          {!hasScans ? (
            <div className="history-card">
              <div className="empty-wrap">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="13" x2="12" y2="17"/>
                    <line x1="12" y1="11" x2="12.01" y2="11"/>
                  </svg>
                </div>
                <div className="empty-title">No scans yet</div>
                <div className="empty-sub">Run your first scan to see results here.</div>
                <a className="empty-cta" href="/dashboard">Start scanning →</a>
              </div>
            </div>
          ) : (
            <>
              {/* Summary strip */}
              <div className="summary-strip">
                <div className="strip-cell">
                  <div className="strip-label">Total scans</div>
                  <div className="strip-val">{scans.length}</div>
                </div>
                <div className="strip-cell">
                  <div className="strip-label">High risk found</div>
                  <div className="strip-val" style={{color:"#dc2626"}}>{scans.filter(s=>s.risk==="HIGH").length}</div>
                </div>
                <div className="strip-cell">
                  <div className="strip-label">Files scanned</div>
                  <div className="strip-val">{scans.reduce((a,s)=>a+s.files,0)}</div>
                </div>
                <div className="strip-cell">
                  <div className="strip-label">This week</div>
                  <div className="strip-val">4</div>
                </div>
              </div>

              {/* Table card */}
              <div className="history-card">
                <div className="filter-bar">
                  {["all","github","url","file","paste"].map(f => (
                    <button key={f} className={`filter-pill ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>
                      {f === "all" ? "All" : f.toUpperCase()}
                    </button>
                  ))}
                  <input
                    className="search-box"
                    placeholder="Search target..."
                    value={search}
                    onChange={e=>setSearch(e.target.value)}
                  />
                </div>

                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Target</th>
                      <th>Date</th>
                      <th>Files</th>
                      <th>Risk</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(scan => (
                      <tr key={scan.id}>
                        <td>
                          <span className={`scan-type-badge ${typeClass[scan.type]}`}>
                            <span className="st-dot"/>
                            {scan.type.toUpperCase()}
                          </span>
                        </td>
                        <td><div className="target-cell">{scan.target}</div></td>
                        <td><div className="date-cell">{scan.date}</div></td>
                        <td><div className="files-cell">{scan.files} {scan.files===1?"file":"files"}</div></td>
                        <td>
                          <span className={`risk-pill ${riskClass[scan.risk]}`}>{scan.risk}</span>
                        </td>
                        <td>
                          <button className="row-action" onClick={() => window.location.href="/dashboard"}>
                            View →
                          </button>
                        </td>
                        <td>
                          <button className="delete-btn" onClick={()=>setScans(prev=>prev.filter(s=>s.id!==scan.id))}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{textAlign:"center", padding:"40px 20px", fontFamily:"'DM Mono',monospace", fontSize:12, color:"#bbb", letterSpacing:"0.05em"}}>
                          No scans match your filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {filtered.length > 0 && (
                  <div className="pagination">
                    {[1,2,3].map(n=>(
                      <button key={n} className={`pg-btn ${n===1?"on":""}`}>{n}</button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}