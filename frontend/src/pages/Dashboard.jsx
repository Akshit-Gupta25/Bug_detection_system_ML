// import '../App.css';
// import { useState } from 'react';
// import RepoInput from '../components/RepoInput';
// import ResultsTable from '../components/ResutlsTable';
// import { analyzeeRepo } from '../api';
// import RiskChart from '../components/RiskChart';
// import CodeViewer from '../components/CodeViewer';
// import Navbar from './Navbar';

// const S = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   /* ── MATH GRID BACKGROUND ── */
//   .dash {
//     font-family: 'DM Sans', sans-serif;
//     min-height: 100vh;
//     background-color: #f5f4f0;
//     background-image:
//       linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px),
//       linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px),
//       linear-gradient(rgba(0,0,0,0.018) 1px, transparent 1px),
//       linear-gradient(90deg, rgba(0,0,0,0.018) 1px, transparent 1px);
//     background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px;
//     background-position: -1px -1px, -1px -1px, -1px -1px, -1px -1px;
//     position: relative;
//   }

//   /* faint vignette so grid fades at edges */
//   .dash::after {
//     content: '';
//     position: fixed; inset: 0;
//     background: radial-gradient(ellipse at center, transparent 50%, rgba(245,244,240,0.7) 100%);
//     pointer-events: none; z-index: 0;
//   }

//   /* everything sits above the grid overlay */
//   .dash > * { position: relative; z-index: 1; }

//   /* PAGE WRAPPER */
//   .dash-inner {
//     max-width: 1280px; margin: 0 auto;
//     padding: 0 32px;
//   }

//   /* PAGE HEADER */
//   .dash-header { padding: 32px 0 0; }
//   .dash-breadcrumb {
//     font-family: 'DM Mono', monospace;
//     font-size: 11px; color: #2563eb;
//     letter-spacing: 0.08em; margin-bottom: 8px;
//   }
//   .dash-breadcrumb span { color: #aaa; margin-right: 4px; }
//   .dash-title {
//     font-family: 'DM Serif Display', serif;
//     font-size: clamp(32px, 3.5vw, 46px);
//     color: #0a0a0a; letter-spacing: -0.8px; line-height: 1.05;
//   }
//   .dash-sub {
//     font-size: 14.5px; font-weight: 300; color: #888;
//     margin-top: 6px; margin-bottom: 24px;
//   }
//   .dash-title-row {
//     display: flex; align-items: flex-start; justify-content: space-between;
//   }

//   /* UPGRADE BTN */
//   .upgrade-btn {
//     font-family: 'DM Sans', sans-serif;
//     font-size: 13.5px; font-weight: 600;
//     background: #2563eb; color: #fff;
//     border: none; border-radius: 6px;
//     padding: 9px 18px; cursor: pointer;
//     display: flex; align-items: center; gap: 7px;
//     transition: background 0.15s, transform 0.1s;
//     flex-shrink: 0; margin-top: 6px;
//   }
//   .upgrade-btn:hover { background: #1d4ed8; }
//   .upgrade-btn:active { transform: scale(0.98); }
//   .upgrade-btn svg { width: 14px; height: 14px; }

//   /* QUOTA CARDS */
//   .quota-row {
//     display: grid; grid-template-columns: repeat(4, 1fr);
//     gap: 1px; background: #d0d0d0;
//     border: 1.5px solid #1a1a1a; border-radius: 6px;
//     overflow: hidden; margin-bottom: 24px;
//     box-shadow: 3px 3px 0 #1a1a1a;
//   }
//   .quota-card { background: #fff; padding: 14px 18px 12px; }
//   .quota-card:hover { background: #fafaf8; }
//   .quota-label {
//     font-family: 'DM Mono', monospace;
//     font-size: 10px; font-weight: 500; color: #aaa;
//     letter-spacing: 0.1em; margin-bottom: 8px; text-transform: uppercase;
//   }
//   .quota-bar-bg { height: 3px; background: #eee; border-radius: 2px; margin-bottom: 6px; }
//   .quota-bar-fill { height: 100%; background: #2563eb; border-radius: 2px; transition: width 0.5s ease; }
//   .quota-num { font-family: 'DM Mono', monospace; font-size: 13px; color: #0a0a0a; }

//   /* SCAN PANEL */
//   .scan-panel {
//     background: #fff;
//     border: 1.5px solid #1a1a1a; border-radius: 6px;
//     box-shadow: 4px 4px 0 #1a1a1a;
//     overflow: hidden; margin-bottom: 32px;
//   }
//   .scan-tabs {
//     display: grid; grid-template-columns: repeat(4, 1fr);
//     border-bottom: 1px solid #e5e5e5;
//   }
//   .scan-tab {
//     font-family: 'DM Mono', monospace;
//     font-size: 11.5px; font-weight: 500;
//     letter-spacing: 0.08em; padding: 14px 0;
//     text-align: center; cursor: pointer; color: #aaa;
//     border: none; background: none;
//     border-right: 1px solid #e5e5e5;
//     transition: background 0.15s, color 0.15s;
//     display: flex; align-items: center; justify-content: center; gap: 7px;
//   }
//   .scan-tab:last-child { border-right: none; }
//   .scan-tab:hover { background: #fafaf8; color: #0a0a0a; }
//   .scan-tab.active { background: #0a0a0a; color: #fff; }
//   .scan-tab svg { width: 14px; height: 14px; }

//   .scan-body { padding: 28px 28px 24px; }
//   .scan-field-label {
//     font-family: 'DM Mono', monospace;
//     font-size: 10.5px; font-weight: 500;
//     letter-spacing: 0.1em; color: #888;
//     text-transform: uppercase; margin-bottom: 9px;
//   }
//   .scan-input {
//     width: 100%; height: 50px;
//     border: 1.5px solid #2563eb; border-radius: 4px;
//     background: #fff; font-family: 'DM Mono', monospace;
//     font-size: 13.5px; color: #0a0a0a;
//     padding: 0 16px; outline: none;
//     transition: border-color 0.15s, box-shadow 0.15s;
//   }
//   .scan-input::placeholder { color: #bbb; }
//   .scan-input:focus { border-color: #1d4ed8; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
//   .scan-hint {
//     font-family: 'DM Mono', monospace;
//     font-size: 11px; color: #bbb; margin-top: 8px; letter-spacing: 0.02em;
//   }
//   .scan-footer {
//     display: flex; align-items: center; justify-content: space-between;
//     margin-top: 20px; padding-top: 18px; border-top: 1px solid #f0f0f0;
//   }
//   .scan-status { font-family: 'DM Mono', monospace; font-size: 11px; color: #aaa; letter-spacing: 0.06em; }
//   .scan-status.scanning { color: #2563eb; animation: pulse 1.5s infinite; }
//   @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
//   .scan-run-btn {
//     font-family: 'DM Sans', sans-serif;
//     font-size: 14.5px; font-weight: 600;
//     background: #2563eb; color: #fff;
//     border: none; border-radius: 5px;
//     padding: 10px 22px; cursor: pointer;
//     display: flex; align-items: center; gap: 8px;
//     transition: background 0.15s, transform 0.1s;
//   }
//   .scan-run-btn:hover:not(:disabled) { background: #1d4ed8; }
//   .scan-run-btn:active:not(:disabled) { transform: scale(0.99); }
//   .scan-run-btn:disabled { opacity: 0.55; cursor: not-allowed; }
//   .scan-spinner {
//     width: 15px; height: 15px;
//     border: 2px solid rgba(255,255,255,0.3);
//     border-top-color: #fff; border-radius: 50%;
//     animation: spin 0.65s linear infinite;
//   }
//   @keyframes spin { to { transform: rotate(360deg); } }

//   /* EMPTY STATE */
//   .empty-state {
//     text-align: center; padding: 80px 0;
//     display: flex; flex-direction: column; align-items: center;
//   }
//   .empty-icon {
//     width: 64px; height: 64px;
//     background: #fff; border: 1.5px solid #e5e5e5; border-radius: 12px;
//     display: flex; align-items: center; justify-content: center;
//     margin-bottom: 16px;
//     box-shadow: 3px 3px 0 #e5e5e5;
//   }
//   .empty-icon svg { width: 28px; height: 28px; stroke: #ccc; }
//   .empty-title {
//     font-family: 'DM Serif Display', serif;
//     font-size: 20px; color: #0a0a0a; margin-bottom: 6px;
//   }
//   .empty-sub {
//     font-family: 'DM Mono', monospace;
//     font-size: 12px; color: #bbb; letter-spacing: 0.05em;
//   }

//   /* RESULTS WRAP */
//   .results-wrap { padding-bottom: 60px; }

//   /* STATS ROW — 4 metric cards */
//   .stats-row {
//     display: grid; grid-template-columns: repeat(4, 1fr);
//     gap: 10px; margin-bottom: 14px;
//   }
//   .stat-card {
//     background: #fff;
//     border: 1.5px solid #e5e5e5; border-radius: 6px;
//     padding: 18px 20px;
//     transition: border-color 0.15s, box-shadow 0.15s;
//     position: relative; overflow: hidden;
//   }
//   .stat-card::before {
//     content: '';
//     position: absolute; top: 0; left: 0; right: 0; height: 2px;
//   }
//   .stat-card:nth-child(1)::before { background: #2563eb; }
//   .stat-card:nth-child(2)::before { background: #dc2626; }
//   .stat-card:nth-child(3)::before { background: #d97706; }
//   .stat-card:nth-child(4)::before { background: #16a34a; }
//   .stat-card:hover { border-color: #c0c0c0; box-shadow: 2px 2px 0 #e0e0e0; }
//   .stat-card-label {
//     font-family: 'DM Mono', monospace;
//     font-size: 10px; color: #aaa;
//     letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;
//   }
//   .stat-card-val {
//     font-family: 'DM Serif Display', serif;
//     font-size: 32px; color: #0a0a0a; letter-spacing: -0.5px;
//   }

//   /* INFO ROW */
//   .info-row {
//     display: grid; grid-template-columns: 1fr 1fr 300px;
//     gap: 10px; margin-bottom: 14px;
//   }
//   .info-card {
//     background: #fff;
//     border: 1.5px solid #e5e5e5; border-radius: 6px;
//     padding: 20px 22px;
//     display: flex; flex-direction: column; justify-content: space-between;
//     transition: border-color 0.15s;
//   }
//   .info-card:hover { border-color: #c0c0c0; }
//   .info-card-label {
//     font-family: 'DM Mono', monospace;
//     font-size: 10px; color: #aaa;
//     letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px;
//   }
//   .info-card-name { font-size: 15px; font-weight: 600; color: #0a0a0a; }
//   .info-card-sub { font-size: 12.5px; color: #999; margin-top: 3px; }
//   .health-score {
//     font-family: 'DM Serif Display', serif;
//     font-size: 40px; letter-spacing: -1.5px;
//   }
//   .health-bar-bg { height: 5px; background: #f0f0f0; border-radius: 3px; margin-top: 12px; }
//   .health-bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s ease; }
//   .chart-card {
//     background: #fff;
//     border: 1.5px solid #e5e5e5; border-radius: 6px;
//     padding: 18px;
//     display: flex; flex-direction: column; align-items: center;
//   }
//   .chart-label {
//     font-family: 'DM Mono', monospace;
//     font-size: 10px; color: #aaa;
//     letter-spacing: 0.1em; text-transform: uppercase;
//     margin-bottom: 8px; align-self: flex-start;
//   }

//   /* TABLE CARD */
//   .table-card {
//     background: #fff;
//     border: 1.5px solid #1a1a1a; border-radius: 6px;
//     overflow: hidden; box-shadow: 4px 4px 0 #1a1a1a;
//   }
//   .table-card-header {
//     padding: 14px 20px; border-bottom: 1px solid #f0f0f0;
//     display: flex; align-items: center; justify-content: space-between;
//     background: #fafaf8;
//   }
//   .table-card-title {
//     font-family: 'DM Mono', monospace;
//     font-size: 11px; color: #888;
//     letter-spacing: 0.08em; text-transform: uppercase;
//   }

//   /* SIDE PANEL */
//   .backdrop {
//     position: fixed; inset: 0;
//     background: rgba(0,0,0,0.4);
//     backdrop-filter: blur(4px);
//     z-index: 40; animation: fadeIn 0.2s ease;
//   }
//   @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }

//   .side-panel {
//     position: fixed; top: 0; right: 0;
//     height: 100%; width: 440px;
//     background: #fff;
//     border-left: 1.5px solid #1a1a1a;
//     box-shadow: -6px 0 0 #1a1a1a;
//     z-index: 50; display: flex; flex-direction: column;
//     animation: slideIn 0.28s cubic-bezier(0.25,0.46,0.45,0.94);
//   }
//   @keyframes slideIn { from{transform:translateX(100%);} to{transform:translateX(0);} }

//   .panel-bar {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 14px 20px; border-bottom: 1px solid #ebebeb; flex-shrink: 0;
//     background: #fafaf8;
//   }
//   .panel-bar-left {
//     display: flex; align-items: center; gap: 9px;
//     font-family: 'DM Mono', monospace; font-size: 11px; color: #888;
//     letter-spacing: 0.05em;
//   }
//   .panel-bar-left svg { width: 14px; height: 14px; stroke: #aaa; }
//   .panel-close {
//     width: 28px; height: 28px;
//     background: #f0f0f0; border: 1px solid #e5e5e5;
//     border-radius: 5px; cursor: pointer;
//     display: flex; align-items: center; justify-content: center;
//     transition: background 0.15s; font-size: 13px; color: #666;
//   }
//   .panel-close:hover { background: #e5e5e5; color: #0a0a0a; }

//   .panel-body { padding: 20px; overflow-y: auto; flex: 1; }
//   .panel-section { margin-bottom: 22px; }
//   .panel-section-title {
//     font-family: 'DM Mono', monospace;
//     font-size: 10px; color: #aaa;
//     letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px;
//   }
//   .panel-filename {
//     font-size: 15px; font-weight: 600; color: #0a0a0a;
//     word-break: break-all; margin-bottom: 8px;
//   }
//   .risk-badge {
//     display: inline-block;
//     font-family: 'DM Mono', monospace;
//     font-size: 10.5px; font-weight: 500;
//     padding: 3px 10px; border-radius: 3px; letter-spacing: 0.06em;
//   }
//   .rb-high   { background: #fef2f2; color: #dc2626; }
//   .rb-medium { background: #fffbeb; color: #d97706; }
//   .rb-low    { background: #f0fdf4; color: #16a34a; }

//   .metrics-grid {
//     display: grid; grid-template-columns: repeat(3,1fr);
//     gap: 1px; background: #e5e5e5;
//     border: 1.5px solid #1a1a1a; border-radius: 5px;
//     overflow: hidden; box-shadow: 2px 2px 0 #1a1a1a;
//   }
//   .metric-cell { background: #fafaf8; padding: 14px; text-align: center; }
//   .metric-label {
//     font-family: 'DM Mono', monospace;
//     font-size: 10px; color: #aaa; letter-spacing: 0.08em; margin-bottom: 5px;
//   }
//   .metric-val {
//     font-family: 'DM Mono', monospace;
//     font-size: 20px; font-weight: 500; color: #0a0a0a;
//   }

//   .code-box { background: #0d1117; border: 1px solid #30363d; border-radius: 6px; overflow: hidden; }
//   .code-box-header {
//     background: #161b22; padding: 8px 14px;
//     display: flex; align-items: center; justify-content: space-between;
//     border-bottom: 1px solid #21262d;
//   }
//   .code-box-title { font-family: 'DM Mono', monospace; font-size: 10.5px; color: #6e7681; letter-spacing: 0.04em; }
//   .code-box-body { max-height: 200px; overflow: auto; }

//   .issue-item { border: 1px solid #fecaca; background: #fff5f5; border-radius: 5px; padding: 11px 13px; margin-bottom: 6px; }
//   .issue-msg { font-size: 13.5px; font-weight: 500; color: #dc2626; margin-bottom: 3px; }
//   .issue-sev { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.06em; color: #f87171; text-transform: uppercase; }

//   .fix-item { border: 1px solid #bbf7d0; background: #f0fdf4; border-radius: 5px; padding: 11px 13px; margin-bottom: 6px; font-size: 13.5px; color: #15803d; line-height: 1.5; }
//   .reason-item { border: 1px solid #fde68a; background: #fffbeb; border-radius: 5px; padding: 10px 13px; margin-bottom: 6px; font-size: 13px; color: #92400e; line-height: 1.5; }
//   .ai-box { border: 1px solid #c7d2fe; background: #eef2ff; border-radius: 5px; padding: 13px 14px; font-size: 13.5px; color: #3730a3; line-height: 1.6; }

//   @media(max-width:900px) {
//     .stats-row { grid-template-columns: repeat(2,1fr); }
//     .info-row  { grid-template-columns: 1fr; }
//     .side-panel { width: 100%; }
//   }
// `;

// export default function Dashboard() {
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [repoHealth, setRepoHealth] = useState(null);
//   const [repoUrl, setRepoUrl] = useState("");
//   const [activeTab, setActiveTab] = useState("github");

//   const handleAnalyze = async (url) => {
//     const target = url || repoUrl;
//     if (!target.trim()) return;
//     setLoading(true);
//     try {
//       const data = await analyzeeRepo(target);
//       const predictions = data.predictions || [];
//       setResults(predictions);
//       setRepoHealth(data.repo_health_score || 0);
//       setSelectedFile(predictions.length > 0 ? predictions[0] : null);
//     } catch (error) {
//       console.error("Error:", error);
//       setSelectedFile(null);
//       setRepoHealth(null);
//     }
//     setLoading(false);
//   };

//   const healthColor = repoHealth > 75 ? "#16a34a" : repoHealth > 50 ? "#d97706" : "#dc2626";

//   const tabs = [
//     { key:"paste",  label:"PASTE",  icon:<><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></> },
//     { key:"github", label:"GITHUB", icon:<><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></> },
//     { key:"url",    label:"URL",    icon:<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></> },
//     { key:"file",   label:"FILE",   icon:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
//   ];

//   return (
//     <>
//       <style>{S}</style>
//       <div className="dash">
//         <Navbar currentPage="dashboard" />

//         <div className="dash-inner">

//           {/* Page header */}
//           <div className="dash-header">
//             <div className="dash-breadcrumb"><span>/</span> CONTROL ROOM</div>
//             <div className="dash-title-row">
//               <div>
//                 <div className="dash-title">Run a new scan</div>
//                 <div className="dash-sub">Pick an input mode. Drop the target. Get categorized risks in seconds.</div>
//               </div>
//               <button className="upgrade-btn">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
//                 </svg>
//                 Upgrade
//               </button>
//             </div>
//           </div>

//           {/* Quota */}
//           <div className="quota-row">
//             {[
//               { label:"REPOS / WEEK",    used:0, total:2 },
//               { label:"WEBSITES / WEEK", used:0, total:1 },
//               { label:"FILES / WEEK",    used:0, total:10 },
//               { label:"PASTES / WEEK",   used:0, total:10 },
//             ].map((q, i) => (
//               <div className="quota-card" key={i}>
//                 <div className="quota-label">{q.label}</div>
//                 <div className="quota-bar-bg">
//                   <div className="quota-bar-fill" style={{width:`${(q.used/q.total)*100}%`}} />
//                 </div>
//                 <div className="quota-num">{q.used} / {q.total}</div>
//               </div>
//             ))}
//           </div>

//           {/* Scan Panel */}
//           <div className="scan-panel">
//             <div className="scan-tabs">
//               {tabs.map(t => (
//                 <button key={t.key} className={`scan-tab ${activeTab===t.key?"active":""}`} onClick={()=>setActiveTab(t.key)}>
//                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
//                   {t.label}
//                 </button>
//               ))}
//             </div>
//             <div className="scan-body">
//               <div className="scan-field-label">
//                 {activeTab==="github"?"GITHUB REPO URL":activeTab==="url"?"WEBSITE URL":activeTab==="file"?"UPLOAD FILE":"PASTE CODE"}
//               </div>
//               <input
//                 className="scan-input"
//                 placeholder={
//                   activeTab==="github"?"https://github.com/owner/repo":
//                   activeTab==="url"?"https://yourapp.com":
//                   activeTab==="paste"?"Paste your code snippet here...":
//                   "Drop a file or click to upload"
//                 }
//                 value={repoUrl}
//                 onChange={e=>setRepoUrl(e.target.value)}
//                 onKeyDown={e=>e.key==="Enter"&&handleAnalyze()}
//               />
//               <div className="scan-hint">
//                 {activeTab==="github"&&"We walk the tree and sample up to 8 source files for a holistic risk report."}
//                 {activeTab==="url"&&"We crawl rendered HTML and headers to identify risks and missing meta."}
//                 {activeTab==="paste"&&"Drop a snippet, a function, or an entire file for a focused diagnosis."}
//                 {activeTab==="file"&&"Supports .py, .js, .ts, .java, .jsx and more. Line-level bug highlighting."}
//               </div>
//               <div className="scan-footer">
//                 <div className={`scan-status ${loading?"scanning":""}`}>{loading?"SCANNING...":"READY"}</div>
//                 <button className="scan-run-btn" onClick={()=>handleAnalyze()} disabled={loading}>
//                   {loading?<><div className="scan-spinner"/>Scanning...</>:"Run scan →"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Results */}
//           <div className="results-wrap">
//             {results.length===0 && !loading && (
//               <div className="empty-state">
//                 <div className="empty-icon">
//                   <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
//                     <polyline points="14 2 14 8 20 8"/>
//                     <line x1="12" y1="13" x2="12" y2="17"/>
//                     <line x1="12" y1="11" x2="12.01" y2="11"/>
//                   </svg>
//                 </div>
//                 <div className="empty-title">No scan results yet</div>
//                 <div className="empty-sub">Enter a target above and run your first scan.</div>
//               </div>
//             )}

//             {results.length>0 && (
//               <>
//                 {/* Stats */}
//                 <div className="stats-row">
//                   <div className="stat-card">
//                     <div className="stat-card-label">Total Files</div>
//                     <div className="stat-card-val">{results.length}</div>
//                   </div>
//                   <div className="stat-card">
//                     <div className="stat-card-label">High Risk</div>
//                     <div className="stat-card-val" style={{color:"#dc2626"}}>{results.filter(f=>f.risk_level==="HIGH").length}</div>
//                   </div>
//                   <div className="stat-card">
//                     <div className="stat-card-label">Medium Risk</div>
//                     <div className="stat-card-val" style={{color:"#d97706"}}>{results.filter(f=>f.risk_level==="MEDIUM").length}</div>
//                   </div>
//                   <div className="stat-card">
//                     <div className="stat-card-label">Low Risk</div>
//                     <div className="stat-card-val" style={{color:"#16a34a"}}>{results.filter(f=>f.risk_level==="LOW").length}</div>
//                   </div>
//                 </div>

//                 {/* Health + Risky + Chart */}
//                 <div className="info-row">
//                   <div className="info-card">
//                     <div>
//                       <div className="info-card-label">Repo Health Score</div>
//                       <div className="health-score" style={{color:healthColor}}>{repoHealth} / 100</div>
//                       <div className="info-card-sub">Overall stability index</div>
//                     </div>
//                     <div className="health-bar-bg">
//                       <div className="health-bar-fill" style={{width:`${repoHealth}%`,background:healthColor}}/>
//                     </div>
//                   </div>

//                   <div className="info-card">
//                     <div className="info-card-label">Most Risky File</div>
//                     <div className="info-card-name">{results[0]?.file_name}</div>
//                     <div className="info-card-sub">High bug probability</div>
//                     <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:14}}>
//                       <span className="risk-badge rb-high">HIGH RISK</span>
//                       <span style={{fontFamily:"'DM Mono',monospace",fontSize:28,fontWeight:500,color:"#dc2626"}}>
//                         {(results[0]?.bug_probability*100).toFixed(0)}%
//                       </span>
//                     </div>
//                   </div>

//                   <div className="chart-card">
//                     <div className="chart-label">Risk Distribution</div>
//                     <RiskChart data={results}/>
//                   </div>
//                 </div>

//                 {/* Table */}
//                 <div className="table-card">
//                   <div className="table-card-header">
//                     <span className="table-card-title">File scan results — {results.length} files</span>
//                   </div>
//                   <ResultsTable data={results} onRowClick={setSelectedFile} selectedFile={selectedFile}/>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* SIDE PANEL */}
//         {selectedFile && (
//           <>
//             <div className="backdrop" onClick={()=>setSelectedFile(null)}/>
//             <div className="side-panel">
//               <div className="panel-bar">
//                 <div className="panel-bar-left">
//                   <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
//                     <polyline points="14 2 14 8 20 8"/>
//                   </svg>
//                   FILE DETAILS
//                 </div>
//                 <button className="panel-close" onClick={()=>setSelectedFile(null)}>✕</button>
//               </div>

//               <div className="panel-body">
//                 <div className="panel-section">
//                   <div className="panel-section-title">File</div>
//                   <div className="panel-filename">{selectedFile.file_name}</div>
//                   <span className={`risk-badge ${selectedFile.risk_level==="HIGH"?"rb-high":selectedFile.risk_level==="MEDIUM"?"rb-medium":"rb-low"}`}>
//                     {selectedFile.risk_level}
//                   </span>
//                 </div>

//                 <div className="panel-section">
//                   <div className="metrics-grid">
//                     <div className="metric-cell">
//                       <div className="metric-label">BUG %</div>
//                       <div className="metric-val" style={{color:"#dc2626"}}>{(selectedFile.bug_probability*100).toFixed(0)}%</div>
//                     </div>
//                     <div className="metric-cell">
//                       <div className="metric-label">CHURN</div>
//                       <div className="metric-val">{selectedFile.total_churn}</div>
//                     </div>
//                     <div className="metric-cell">
//                       <div className="metric-label">STABILITY</div>
//                       <div className="metric-val" style={{color:"#2563eb"}}>{selectedFile.stability_score}</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="panel-section">
//                   <div className="panel-section-title">Code</div>
//                   <div className="code-box">
//                     <div className="code-box-header">
//                       <span className="code-box-title">Code Preview</span>
//                       <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#555",cursor:"col-resize"}}>Drag to resize ↔</span>
//                     </div>
//                     <div className="code-box-body"><CodeViewer code={selectedFile.source_code}/></div>
//                   </div>
//                 </div>

//                 {selectedFile.code_issues?.length>0 && (
//                   <div className="panel-section">
//                     <div className="panel-section-title">Issues</div>
//                     {selectedFile.code_issues.map((issue,i)=>(
//                       <div className="issue-item" key={i}>
//                         <div className="issue-msg">{issue.message}</div>
//                         <div className="issue-sev">{issue.severity}</div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {selectedFile.fix_suggestions?.length>0 && (
//                   <div className="panel-section">
//                     <div className="panel-section-title">Fix Suggestions</div>
//                     {selectedFile.fix_suggestions.map((fix,i)=>(
//                       <div className="fix-item" key={i}>💡 {fix}</div>
//                     ))}
//                   </div>
//                 )}

//                 {selectedFile.reasons?.length>0 && (
//                   <div className="panel-section">
//                     <div className="panel-section-title">Why Risky?</div>
//                     {selectedFile.reasons.map((reason,i)=>(
//                       <div className="reason-item" key={i}>⚡ {reason}</div>
//                     ))}
//                   </div>
//                 )}

//                 {selectedFile.ai_explanation && (
//                   <div className="panel-section">
//                     <div className="panel-section-title">AI Insight</div>
//                     <div className="ai-box">{selectedFile.ai_explanation}</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// }

import '../App.css';
import { useState, useRef, useEffect } from 'react';
import ResultsTable from '../components/ResutlsTable';
import RiskChart from '../components/RiskChart';
import CodeViewer from '../components/CodeViewer';
import Navbar from './Navbar';
import { analyzeeRepo, analyzePaste, analyzeFile, analyzeWebUrl } from '../api';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dash {
    font-family: 'DM Sans', sans-serif; min-height: 100vh;
    background-color: #f5f4f0;
    background-image:
      linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px),
      linear-gradient(rgba(0,0,0,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.018) 1px, transparent 1px);
    background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px;
  }

  .dash-inner { max-width: 1280px; margin: 0 auto; padding: 0 32px; }

  /* HEADER */
  .dash-header { padding: 32px 0 0; }
  .dash-breadcrumb { font-family:'DM Mono',monospace; font-size:11px; color:#2563eb; letter-spacing:0.08em; margin-bottom:8px; }
  .dash-breadcrumb span { color:#aaa; margin-right:4px; }
  .dash-title-row { display:flex; align-items:flex-start; justify-content:space-between; }
  .dash-title { font-family:'DM Serif Display',serif; font-size:clamp(30px,3.5vw,44px); color:#0a0a0a; letter-spacing:-0.8px; }
  .dash-sub { font-size:14px; font-weight:300; color:#888; margin-top:5px; margin-bottom:22px; }
  .upgrade-btn {
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
    background:#2563eb; color:#fff; border:none; border-radius:6px;
    padding:9px 17px; cursor:pointer; display:flex; align-items:center; gap:6px;
    transition:background 0.15s; flex-shrink:0; margin-top:6px;
  }
  .upgrade-btn:hover { background:#1d4ed8; }
  .upgrade-btn svg { width:13px; height:13px; }

  /* QUOTA */
  .quota-row {
    display:grid; grid-template-columns:repeat(4,1fr);
    gap:1px; background:#d0d0d0;
    border:1.5px solid #1a1a1a; border-radius:6px;
    overflow:hidden; margin-bottom:22px;
    box-shadow:3px 3px 0 #1a1a1a;
  }
  .quota-card { background:#fff; padding:13px 17px 11px; transition:background 0.12s; }
  .quota-card:hover { background:#fafaf8; }
  .quota-label { font-family:'DM Mono',monospace; font-size:9.5px; color:#aaa; letter-spacing:0.1em; margin-bottom:7px; text-transform:uppercase; }
  .quota-bar-bg { height:3px; background:#eee; border-radius:2px; margin-bottom:5px; }
  .quota-bar-fill { height:100%; background:#2563eb; border-radius:2px; transition:width 0.5s; }
  .quota-num { font-family:'DM Mono',monospace; font-size:12.5px; color:#0a0a0a; }

  /* SCAN PANEL */
  .scan-panel {
    background:#fff; border:1.5px solid #1a1a1a; border-radius:6px;
    box-shadow:4px 4px 0 #1a1a1a; overflow:hidden; margin-bottom:28px;
  }
  .scan-tabs { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid #e5e5e5; }
  .scan-tab {
    font-family:'DM Mono',monospace; font-size:11px; font-weight:500;
    letter-spacing:0.08em; padding:13px 0; text-align:center; cursor:pointer;
    color:#aaa; border:none; background:none;
    border-right:1px solid #e5e5e5;
    transition:background 0.15s, color 0.15s;
    display:flex; align-items:center; justify-content:center; gap:6px;
  }
  .scan-tab:last-child { border-right:none; }
  .scan-tab:hover { background:#fafaf8; color:#0a0a0a; }
  .scan-tab.active { background:#0a0a0a; color:#fff; }
  .scan-tab svg { width:13px; height:13px; }

  .scan-body { padding:26px 26px 22px; }
  .scan-field-label { font-family:'DM Mono',monospace; font-size:10px; font-weight:500; letter-spacing:0.1em; color:#888; text-transform:uppercase; margin-bottom:8px; }
  .scan-input {
    width:100%; height:48px; border:1.5px solid #2563eb; border-radius:4px;
    background:#fff; font-family:'DM Mono',monospace; font-size:13px; color:#0a0a0a;
    padding:0 16px; outline:none; transition:border-color 0.15s, box-shadow 0.15s;
  }
  .scan-input::placeholder { color:#bbb; }
  .scan-input:focus { border-color:#1d4ed8; box-shadow:0 0 0 3px rgba(37,99,235,0.1); }
  .scan-textarea {
    width:100%; min-height:140px; border:1.5px solid #2563eb; border-radius:4px;
    background:#fff; font-family:'DM Mono',monospace; font-size:12px; color:#0a0a0a;
    padding:12px 16px; outline:none; resize:vertical;
    transition:border-color 0.15s, box-shadow 0.15s; line-height:1.6;
  }
  .scan-textarea::placeholder { color:#bbb; }
  .scan-textarea:focus { border-color:#1d4ed8; box-shadow:0 0 0 3px rgba(37,99,235,0.1); }

  .file-drop-zone {
    border:2px dashed #d0d0d0; border-radius:6px; padding:36px;
    text-align:center; cursor:pointer; transition:border-color 0.15s, background 0.15s;
    background:#fafaf8;
  }
  .file-drop-zone:hover, .file-drop-zone.drag-over { border-color:#2563eb; background:#f0f6ff; }
  .file-drop-zone svg { width:32px; height:32px; stroke:#bbb; margin-bottom:10px; }
  .file-drop-zone-title { font-size:14px; font-weight:500; color:#444; margin-bottom:4px; }
  .file-drop-zone-sub { font-size:12px; color:#aaa; font-family:'DM Mono',monospace; }
  .file-selected { font-family:'DM Mono',monospace; font-size:12px; color:#2563eb; margin-top:8px; }

  .scan-hint { font-family:'DM Mono',monospace; font-size:11px; color:#bbb; margin-top:7px; letter-spacing:0.02em; }
  .scan-footer {
    display:flex; align-items:center; justify-content:space-between;
    margin-top:18px; padding-top:16px; border-top:1px solid #f0f0f0;
  }
  .scan-status { font-family:'DM Mono',monospace; font-size:10.5px; color:#aaa; letter-spacing:0.06em; }
  .scan-status.scanning { color:#2563eb; animation:statusPulse 1.5s infinite; }
  @keyframes statusPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .scan-run-btn {
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600;
    background:#2563eb; color:#fff; border:none; border-radius:5px;
    padding:10px 20px; cursor:pointer;
    display:flex; align-items:center; gap:8px;
    transition:background 0.15s, transform 0.1s;
  }
  .scan-run-btn:hover:not(:disabled) { background:#1d4ed8; }
  .scan-run-btn:active:not(:disabled) { transform:scale(0.99); }
  .scan-run-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .scan-spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.65s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* ERROR BANNER */
  .error-banner {
    background:#fff5f5; border:1.5px solid #fecaca; border-radius:6px;
    padding:12px 16px; margin-bottom:16px;
    display:flex; align-items:center; gap:10px;
    font-size:13.5px; color:#dc2626;
    animation:errIn 0.2s ease;
  }
  @keyframes errIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
  .error-banner svg { width:15px; height:15px; fill:#dc2626; flex-shrink:0; }

  /* EMPTY STATE */
  .empty-state { text-align:center; padding:70px 0; display:flex; flex-direction:column; align-items:center; }
  .empty-icon { width:60px; height:60px; background:#fff; border:1.5px solid #e5e5e5; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; box-shadow:3px 3px 0 #e5e5e5; }
  .empty-icon svg { width:26px; height:26px; stroke:#ccc; }
  .empty-title { font-family:'DM Serif Display',serif; font-size:19px; color:#0a0a0a; margin-bottom:5px; }
  .empty-sub { font-family:'DM Mono',monospace; font-size:11.5px; color:#bbb; letter-spacing:0.04em; }

  /* RESULTS */
  .results-wrap { padding-bottom:60px; }

  /* STATS ROW */
  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:12px; }
  .stat-card {
    background:#fff; border:1.5px solid #e5e5e5; border-radius:6px; padding:17px 19px;
    position:relative; overflow:hidden; transition:border-color 0.15s;
  }
  .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2.5px; }
  .stat-card:nth-child(1)::before { background:#2563eb; }
  .stat-card:nth-child(2)::before { background:#dc2626; }
  .stat-card:nth-child(3)::before { background:#d97706; }
  .stat-card:nth-child(4)::before { background:#16a34a; }
  .stat-card:hover { border-color:#c0c0c0; }
  .stat-card-label { font-family:'DM Mono',monospace; font-size:10px; color:#aaa; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:7px; }
  .stat-card-val { font-family:'DM Serif Display',serif; font-size:30px; color:#0a0a0a; letter-spacing:-0.5px; }

  /* INFO ROW */
  .info-row { display:grid; grid-template-columns:1fr 1fr 290px; gap:10px; margin-bottom:12px; }
  .info-card { background:#fff; border:1.5px solid #e5e5e5; border-radius:6px; padding:19px 21px; display:flex; flex-direction:column; justify-content:space-between; transition:border-color 0.15s; }
  .info-card:hover { border-color:#c0c0c0; }
  .info-card-label { font-family:'DM Mono',monospace; font-size:10px; color:#aaa; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:9px; }
  .info-card-name { font-size:14px; font-weight:600; color:#0a0a0a; word-break:break-all; }
  .info-card-sub { font-size:12px; color:#999; margin-top:3px; }
  .health-score { font-family:'DM Serif Display',serif; font-size:38px; letter-spacing:-1.5px; }
  .health-bar-bg { height:4px; background:#f0f0f0; border-radius:2px; margin-top:10px; }
  .health-bar-fill { height:100%; border-radius:2px; transition:width 0.8s; }
  .chart-card { background:#fff; border:1.5px solid #e5e5e5; border-radius:6px; padding:16px; display:flex; flex-direction:column; align-items:center; }
  .chart-label { font-family:'DM Mono',monospace; font-size:10px; color:#aaa; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:8px; align-self:flex-start; }

  /* MODEL ACCURACY BADGE */
  .accuracy-badge {
    display:inline-flex; align-items:center; gap:6px;
    font-family:'DM Mono',monospace; font-size:10.5px; font-weight:500;
    background:#f0fdf4; color:#16a34a;
    border:1px solid #bbf7d0; border-radius:3px;
    padding:3px 10px; margin-top:8px;
  }
  .accuracy-badge svg { width:11px; height:11px; stroke:#16a34a; }

  /* TABLE CARD */
  .table-card { background:#fff; border:1.5px solid #1a1a1a; border-radius:6px; overflow:hidden; box-shadow:4px 4px 0 #1a1a1a; }
  .table-card-header { padding:13px 20px; border-bottom:1px solid #f0f0f0; display:flex; align-items:center; justify-content:space-between; background:#fafaf8; }
  .table-card-title { font-family:'DM Mono',monospace; font-size:10.5px; color:#888; letter-spacing:0.08em; text-transform:uppercase; }

  /* ── FLOATING DETAIL CARD (replaces side panel) ── */
  .detail-backdrop {
    position:fixed; inset:0;
    background:rgba(0,0,0,0.3);
    backdrop-filter:blur(3px);
    z-index:40;
    animation:fadeIn 0.18s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .detail-card {
    position:fixed;
    top:50%; right:32px;
    transform:translateY(-50%);
    width:480px; max-height:88vh;
    background:#fff;
    border:1.5px solid #1a1a1a;
    border-radius:10px;
    box-shadow:6px 6px 0 #1a1a1a;
    z-index:50;
    display:flex; flex-direction:column;
    animation:cardPop 0.22s cubic-bezier(0.34,1.2,0.64,1);
    overflow:hidden;
  }
  @keyframes cardPop { from{opacity:0;transform:translateY(calc(-50% + 20px)) scale(0.96)} to{opacity:1;transform:translateY(-50%) scale(1)} }

  .dc-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 18px; border-bottom:1px solid #f0f0f0;
    background:#fafaf8; flex-shrink:0;
  }
  .dc-header-left { display:flex; align-items:center; gap:9px; }
  .dc-header-left svg { width:14px; height:14px; stroke:#aaa; }
  .dc-filename {
    font-family:'DM Mono',monospace; font-size:12px; font-weight:500;
    color:#0a0a0a; max-width:280px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    letter-spacing:0.02em;
  }
  .dc-close {
    width:26px; height:26px; background:#f0f0f0;
    border:1px solid #e5e5e5; border-radius:5px;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    font-size:12px; color:#666; transition:background 0.15s;
  }
  .dc-close:hover { background:#e5e5e5; color:#0a0a0a; }

  .dc-body { padding:18px; overflow-y:auto; flex:1; }

  .dc-section { margin-bottom:18px; }
  .dc-section-title { font-family:'DM Mono',monospace; font-size:9.5px; color:#aaa; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:9px; }

  /* Risk + metrics strip */
  .dc-top-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
  .risk-badge { display:inline-block; font-family:'DM Mono',monospace; font-size:10px; font-weight:500; padding:3px 9px; border-radius:3px; letter-spacing:0.06em; }
  .rb-high   { background:#fef2f2; color:#dc2626; }
  .rb-medium { background:#fffbeb; color:#d97706; }
  .rb-low    { background:#f0fdf4; color:#16a34a; }

  .metrics-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:#e5e5e5; border:1.5px solid #e5e5e5; border-radius:5px; overflow:hidden; }
  .metric-cell { background:#fafaf8; padding:12px; text-align:center; }
  .metric-label { font-family:'DM Mono',monospace; font-size:9.5px; color:#aaa; letter-spacing:0.08em; margin-bottom:4px; }
  .metric-val { font-family:'DM Mono',monospace; font-size:18px; font-weight:500; color:#0a0a0a; }

  /* Category-coloured issue items */
  .issue-item { border-radius:5px; padding:10px 12px; margin-bottom:5px; }
  .issue-item.cat-security     { background:#fff5f5; border:1px solid #fecaca; }
  .issue-item.cat-performance  { background:#fff7ed; border:1px solid #fed7aa; }
  .issue-item.cat-maintainability { background:#fefce8; border:1px solid #fde68a; }
  .issue-item.cat-async        { background:#fdf4ff; border:1px solid #e9d5ff; }
  .issue-item.cat-complexity   { background:#eff6ff; border:1px solid #bfdbfe; }
  .issue-item.cat-accessibility{ background:#f0fdf4; border:1px solid #bbf7d0; }
  .issue-item.cat-seo          { background:#f8fafc; border:1px solid #cbd5e1; }
  .issue-item.cat-api          { background:#fff7ed; border:1px solid #fed7aa; }
  .issue-item.cat-ui           { background:#f5f3ff; border:1px solid #ddd6fe; }
  .issue-item.cat-general      { background:#f9fafb; border:1px solid #e5e7eb; }

  .issue-cat-badge {
    font-family:'DM Mono',monospace; font-size:9px; font-weight:500;
    text-transform:uppercase; letter-spacing:0.08em;
    padding:1px 7px; border-radius:2px; margin-right:6px;
    display:inline-block;
  }
  .issue-msg { font-size:12.5px; font-weight:500; color:#0a0a0a; margin-bottom:2px; display:inline; }
  .issue-sev { font-family:'DM Mono',monospace; font-size:9.5px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; margin-top:3px; }
  .sev-critical { color:#dc2626; }
  .sev-warning  { color:#d97706; }
  .sev-info     { color:#2563eb; }

  .fix-item { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:5px; padding:10px 12px; margin-bottom:5px; font-size:12.5px; color:#15803d; line-height:1.5; }
  .reason-item { background:#fffbeb; border:1px solid #fde68a; border-radius:5px; padding:9px 12px; margin-bottom:5px; font-size:12.5px; color:#92400e; line-height:1.5; }
  .ai-box { background:#eef2ff; border:1px solid #c7d2fe; border-radius:5px; padding:12px 13px; font-size:12.5px; color:#3730a3; line-height:1.6; }

  .code-box { background:#0d1117; border:1px solid #30363d; border-radius:5px; overflow:hidden; }
  .code-box-header { background:#161b22; padding:7px 13px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #21262d; }
  .code-box-title { font-family:'DM Mono',monospace; font-size:10px; color:#6e7681; letter-spacing:0.04em; }
  .code-box-body { max-height:180px; overflow:auto; }

  /* URL TECH STACK */
  .tech-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:8px; }
  .tech-pill {
    font-family:'DM Mono',monospace; font-size:10px;
    background:#f0f0f0; color:#444;
    border:1px solid #e5e5e5; border-radius:3px;
    padding:3px 9px; letter-spacing:0.04em;
  }
  .tech-pill.active { background:#f0f6ff; color:#2563eb; border-color:#bfdbfe; }

  /* CATEGORY FILTER TABS on issues */
  .cat-tabs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
  .cat-tab {
    font-family:'DM Mono',monospace; font-size:10px; font-weight:500;
    padding:4px 10px; border-radius:3px;
    border:1px solid #e5e5e5; background:#fff; color:#888;
    cursor:pointer; transition:all 0.12s; letter-spacing:0.04em;
  }
  .cat-tab:hover { border-color:#0a0a0a; color:#0a0a0a; }
  .cat-tab.on { background:#0a0a0a; color:#fff; border-color:#0a0a0a; }

  @media(max-width:900px) {
    .stats-row { grid-template-columns:repeat(2,1fr); }
    .info-row  { grid-template-columns:1fr; }
    .detail-card { width:calc(100% - 32px); right:16px; top:auto; bottom:16px; transform:none; max-height:70vh; }
  }
`;

// ── Category styling map ───────────────────────────────────────────────────────
const CAT_COLORS = {
  security:        { bg:"#fef2f2", color:"#dc2626", label:"SECURITY" },
  performance:     { bg:"#fff7ed", color:"#c2410c", label:"PERF" },
  maintainability: { bg:"#fefce8", color:"#854d0e", label:"MAINT" },
  async:           { bg:"#fdf4ff", color:"#7e22ce", label:"ASYNC" },
  complexity:      { bg:"#eff6ff", color:"#1d4ed8", label:"COMPLEX" },
  accessibility:   { bg:"#f0fdf4", color:"#166534", label:"A11Y" },
  seo:             { bg:"#f8fafc", color:"#475569", label:"SEO" },
  api:             { bg:"#fff7ed", color:"#c2410c", label:"API" },
  ui:              { bg:"#f5f3ff", color:"#6d28d9", label:"UI" },
  general:         { bg:"#f9fafb", color:"#374151", label:"GENERAL" },
  authentication:  { bg:"#fff5f5", color:"#dc2626", label:"AUTH" },
};

export default function Dashboard() {
  const [results,      setResults]      = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [repoHealth,   setRepoHealth]   = useState(null);
  const [cvAuc,        setCvAuc]        = useState(null);
  const [repoUrl,      setRepoUrl]      = useState("");
  const [pasteCode,    setPasteCode]    = useState("");
  const [pasteName,    setPasteName]    = useState("snippet.js");
  const [webUrl,       setWebUrl]       = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver,     setDragOver]     = useState(false);
  const [activeTab,    setActiveTab]    = useState("github");
  const [error,        setError]        = useState("");
  const [issueFilter,  setIssueFilter]  = useState("all");
  const fileInputRef = useRef(null);

  const healthColor = repoHealth > 75 ? "#16a34a" : repoHealth > 50 ? "#d97706" : "#dc2626";

  const handleResult = (data) => {
    setResults(data.predictions || []);
    setRepoHealth(data.repo_health_score || 0);
    setCvAuc(data.model_cv_auc || null);
    if (data.predictions?.length > 0) setSelectedFile(data.predictions[0]);
  };

  const handleAnalyze = async () => {
    setError("");
    setLoading(true);
    try {
      let data;
      if (activeTab === "github")  data = await analyzeeRepo(repoUrl);
      else if (activeTab === "url") data = await analyzeWebUrl(webUrl);
      else if (activeTab === "paste") data = await analyzePaste(pasteCode, pasteName);
      else if (activeTab === "file") {
        if (!uploadedFile) { setError("Please select a file first."); setLoading(false); return; }
        data = await analyzeFile(uploadedFile);
      }
      handleResult(data);
    } catch (err) {
      setError(err.message || "Scan failed. Please try again.");
    }
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setUploadedFile(f);
  };

  const tabs = [
    { key:"paste",  label:"PASTE",  icon:<><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></> },
    { key:"github", label:"GITHUB", icon:<><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></> },
    { key:"url",    label:"URL",    icon:<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></> },
    { key:"file",   label:"FILE",   icon:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
  ];

  // Detail card issues with category filter
  const allIssues = selectedFile?.code_issues || [];
  const cats = [...new Set(allIssues.map(i => i.category || "general"))];
  const filteredIssues = issueFilter === "all"
    ? allIssues
    : allIssues.filter(i => (i.category || "general") === issueFilter);

  return (
    <>
      <style>{S}</style>
      <div className="dash">
        <Navbar currentPage="dashboard" />
        <div className="dash-inner">

          {/* Header */}
          <div className="dash-header">
            <div className="dash-breadcrumb"><span>/</span> CONTROL ROOM</div>
            <div className="dash-title-row">
              <div>
                <div className="dash-title">Run a new scan</div>
                <div className="dash-sub">Pick an input mode. Drop the target. Get categorized risks in seconds.</div>
              </div>
              <button className="upgrade-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Upgrade
              </button>
            </div>
          </div>

          {/* Quota */}
          <div className="quota-row">
            {[
              { label:"REPOS / WEEK", used:0, total:2 },
              { label:"WEBSITES / WEEK", used:0, total:1 },
              { label:"FILES / WEEK", used:0, total:10 },
              { label:"PASTES / WEEK", used:0, total:10 },
            ].map((q,i) => (
              <div className="quota-card" key={i}>
                <div className="quota-label">{q.label}</div>
                <div className="quota-bar-bg"><div className="quota-bar-fill" style={{width:`${(q.used/q.total)*100}%`}}/></div>
                <div className="quota-num">{q.used} / {q.total}</div>
              </div>
            ))}
          </div>

          {/* Scan Panel */}
          <div className="scan-panel">
            <div className="scan-tabs">
              {tabs.map(t => (
                <button key={t.key} className={`scan-tab ${activeTab===t.key?"active":""}`} onClick={()=>{ setActiveTab(t.key); setError(""); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="scan-body">

              {activeTab === "github" && (
                <>
                  <div className="scan-field-label">GITHUB REPO URL</div>
                  <input className="scan-input" placeholder="https://github.com/owner/repo" value={repoUrl}
                    onChange={e=>setRepoUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAnalyze()} />
                  <div className="scan-hint">We walk the tree and sample up to 100 commits for a holistic risk report.</div>
                </>
              )}

              {activeTab === "url" && (
                <>
                  <div className="scan-field-label">WEBSITE URL</div>
                  <input className="scan-input" placeholder="https://yourapp.com" value={webUrl}
                    onChange={e=>setWebUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAnalyze()} />
                  <div className="scan-hint">We crawl the page for security headers, UI issues, SEO, performance, API leaks, auth problems and more.</div>
                </>
              )}

              {activeTab === "paste" && (
                <>
                  <div style={{display:"flex", gap:12, marginBottom:10}}>
                    <div style={{flex:1}}>
                      <div className="scan-field-label">FILE NAME (optional)</div>
                      <input className="scan-input" placeholder="e.g. auth.py, App.jsx" value={pasteName}
                        onChange={e=>setPasteName(e.target.value)} style={{height:38}} />
                    </div>
                  </div>
                  <div className="scan-field-label">PASTE YOUR CODE</div>
                  <textarea className="scan-textarea" placeholder="Paste a snippet, function, or entire file..."
                    value={pasteCode} onChange={e=>setPasteCode(e.target.value)} />
                  <div className="scan-hint">Detects security, async, complexity, and maintainability issues across Python, JS, TS, Java, C++.</div>
                </>
              )}

              {activeTab === "file" && (
                <>
                  <div className="scan-field-label">UPLOAD FILE</div>
                  <div
                    className={`file-drop-zone ${dragOver?"drag-over":""}`}
                    onClick={()=>fileInputRef.current?.click()}
                    onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                    onDragLeave={()=>setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/><line x1="12" y1="13" x2="12" y2="19"/><polyline points="9 16 12 13 15 16"/>
                    </svg>
                    <div className="file-drop-zone-title">Drop a file or click to browse</div>
                    <div className="file-drop-zone-sub">.py  .js  .ts  .jsx  .tsx  .java  .cpp  .c</div>
                    {uploadedFile && <div className="file-selected">✓ {uploadedFile.name}</div>}
                  </div>
                  <input ref={fileInputRef} type="file" style={{display:"none"}}
                    accept=".py,.js,.ts,.jsx,.tsx,.java,.cpp,.c"
                    onChange={e=>setUploadedFile(e.target.files[0])} />
                  <div className="scan-hint">Line-level bug highlighting across all major languages.</div>
                </>
              )}

              {error && (
                <div className="error-banner">
                  <svg viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7h2v2h-2v-2zm0-8h2v6h-2V7z"/></svg>
                  {error}
                </div>
              )}

              <div className="scan-footer">
                <div className={`scan-status ${loading?"scanning":""}`}>{loading?"SCANNING...":"READY"}</div>
                <button className="scan-run-btn" onClick={handleAnalyze} disabled={loading}>
                  {loading ? <><div className="scan-spinner"/>Scanning...</> : "Run scan →"}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="results-wrap">
            {results.length===0 && !loading && (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="12" y1="11" x2="12.01" y2="11"/>
                  </svg>
                </div>
                <div className="empty-title">No scan results yet</div>
                <div className="empty-sub">Enter a target above and run your first scan.</div>
              </div>
            )}

            {results.length>0 && (
              <>
                <div className="stats-row">
                  <div className="stat-card">
                    <div className="stat-card-label">Total Files</div>
                    <div className="stat-card-val">{results.length}</div>
                    {cvAuc && <div className="accuracy-badge"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Model AUC: {cvAuc}</div>}
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-label">High Risk</div>
                    <div className="stat-card-val" style={{color:"#dc2626"}}>{results.filter(f=>f.risk_level==="HIGH").length}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-label">Medium Risk</div>
                    <div className="stat-card-val" style={{color:"#d97706"}}>{results.filter(f=>f.risk_level==="MEDIUM").length}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-label">Low Risk</div>
                    <div className="stat-card-val" style={{color:"#16a34a"}}>{results.filter(f=>f.risk_level==="LOW").length}</div>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-card">
                    <div>
                      <div className="info-card-label">Repo Health Score</div>
                      <div className="health-score" style={{color:healthColor}}>{repoHealth} / 100</div>
                      <div className="info-card-sub">Overall stability index</div>
                    </div>
                    <div className="health-bar-bg"><div className="health-bar-fill" style={{width:`${repoHealth}%`,background:healthColor}}/></div>
                  </div>
                  <div className="info-card">
                    <div className="info-card-label">Most Risky File</div>
                    <div className="info-card-name">{results[0]?.file_name}</div>
                    <div className="info-card-sub">Highest bug probability</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12}}>
                      <span className="risk-badge rb-high">HIGH RISK</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:26,fontWeight:500,color:"#dc2626"}}>
                        {((results[0]?.bug_probability||0)*100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="chart-card">
                    <div className="chart-label">Risk Distribution</div>
                    <RiskChart data={results}/>
                  </div>
                </div>

                <div className="table-card">
                  <div className="table-card-header">
                    <span className="table-card-title">File scan results — {results.length} files</span>
                  </div>
                  <ResultsTable data={results} onRowClick={(f)=>{setSelectedFile(f);setIssueFilter("all");}} selectedFile={selectedFile}/>
                </div>
              </>
            )}
          </div>
        </div>

        {/* FLOATING DETAIL CARD */}
        {selectedFile && (
          <>
            <div className="detail-backdrop" onClick={()=>setSelectedFile(null)}/>
            <div className="detail-card">

              <div className="dc-header">
                <div className="dc-header-left">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <div className="dc-filename" title={selectedFile.file_name}>{selectedFile.file_name}</div>
                </div>
                <button className="dc-close" onClick={()=>setSelectedFile(null)}>✕</button>
              </div>

              <div className="dc-body">

                {/* Risk + metrics */}
                <div className="dc-top-row">
                  <span className={`risk-badge ${selectedFile.risk_level==="HIGH"?"rb-high":selectedFile.risk_level==="MEDIUM"?"rb-medium":"rb-low"}`}>
                    {selectedFile.risk_level} RISK
                  </span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:22,fontWeight:500,color: selectedFile.risk_level==="HIGH"?"#dc2626":selectedFile.risk_level==="MEDIUM"?"#d97706":"#16a34a"}}>
                    {((selectedFile.bug_probability||0)*100).toFixed(0)}%
                  </span>
                </div>

                {/* Show tech stack for URL scans */}
                {selectedFile.tech_stack && (
                  <div className="dc-section">
                    <div className="dc-section-title">Tech Stack Detected</div>
                    <div className="tech-row">
                      <span className={`tech-pill ${selectedFile.tech_stack.framework?"active":""}`}>{selectedFile.tech_stack.framework||"Unknown"}</span>
                      {selectedFile.tech_stack.has_analytics && <span className="tech-pill active">Analytics</span>}
                      {selectedFile.tech_stack.has_cdn && <span className="tech-pill active">CDN</span>}
                      {selectedFile.tech_stack.has_spa && <span className="tech-pill active">SPA</span>}
                      {selectedFile.response_time_ms && <span className="tech-pill">{selectedFile.response_time_ms}ms</span>}
                      {selectedFile.status_code && <span className="tech-pill">HTTP {selectedFile.status_code}</span>}
                    </div>
                  </div>
                )}

                {/* Metrics (only for repo/paste/file scans) */}
                {!selectedFile.tech_stack && (
                  <div className="dc-section">
                    <div className="metrics-grid">
                      <div className="metric-cell">
                        <div className="metric-label">BUG %</div>
                        <div className="metric-val" style={{color:"#dc2626"}}>{((selectedFile.bug_probability||0)*100).toFixed(0)}%</div>
                      </div>
                      <div className="metric-cell">
                        <div className="metric-label">CHURN</div>
                        <div className="metric-val">{selectedFile.total_churn}</div>
                      </div>
                      <div className="metric-cell">
                        <div className="metric-label">STABILITY</div>
                        <div className="metric-val" style={{color:"#2563eb"}}>{selectedFile.stability_score}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Code preview (not for URL scans) */}
                {selectedFile.source_code && !selectedFile.tech_stack && (
                  <div className="dc-section">
                    <div className="dc-section-title">Code</div>
                    <div className="code-box">
                      <div className="code-box-header">
                        <span className="code-box-title">Code Preview</span>
                      </div>
                      <div className="code-box-body"><CodeViewer code={selectedFile.source_code}/></div>
                    </div>
                  </div>
                )}

                {/* Issues with category filter */}
                {allIssues.length > 0 && (
                  <div className="dc-section">
                    <div className="dc-section-title">Issues ({allIssues.length})</div>
                    {cats.length > 1 && (
                      <div className="cat-tabs">
                        <button className={`cat-tab ${issueFilter==="all"?"on":""}`} onClick={()=>setIssueFilter("all")}>All</button>
                        {cats.map(c=>(
                          <button key={c} className={`cat-tab ${issueFilter===c?"on":""}`} onClick={()=>setIssueFilter(c)}>
                            {(CAT_COLORS[c]||{label:c.toUpperCase()}).label}
                          </button>
                        ))}
                      </div>
                    )}
                    {filteredIssues.map((issue,i)=>{
                      const cat = issue.category || "general";
                      const cc = CAT_COLORS[cat] || CAT_COLORS.general;
                      return (
                        <div key={i} className={`issue-item cat-${cat}`}>
                          <span className="issue-cat-badge" style={{background:cc.bg,color:cc.color}}>{cc.label}</span>
                          <span className="issue-msg">{issue.message}</span>
                          <div className={`issue-sev sev-${issue.severity?.toLowerCase()}`}>{issue.severity}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Fix suggestions */}
                {selectedFile.fix_suggestions?.length > 0 && (
                  <div className="dc-section">
                    <div className="dc-section-title">Fix Suggestions</div>
                    {selectedFile.fix_suggestions.map((fix,i)=>( <div key={i} className="fix-item">💡 {fix}</div> ))}
                  </div>
                )}

                {/* Reasons */}
                {selectedFile.reasons?.length > 0 && (
                  <div className="dc-section">
                    <div className="dc-section-title">Why Risky?</div>
                    {selectedFile.reasons.map((r,i)=>( <div key={i} className="reason-item">⚡ {r}</div> ))}
                  </div>
                )}

                {/* AI explanation */}
                {selectedFile.ai_explanation && (
                  <div className="dc-section">
                    <div className="dc-section-title">AI Insight</div>
                    <div className="ai-box">{selectedFile.ai_explanation}</div>
                  </div>
                )}

              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}