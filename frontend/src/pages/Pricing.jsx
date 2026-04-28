import { useState } from "react";
import Navbar from "./Navbar";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pricing-page { font-family: 'DM Sans', sans-serif; background-color: #f5f4f0; background-image: linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.018) 1px, transparent 1px); background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px; min-height: 100vh; }

  .pricing-inner {
    max-width: 960px; margin: 0 auto; padding: 56px 32px 80px;
  }

  .pricing-breadcrumb {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #aaa; letter-spacing: 0.08em;
    margin-bottom: 10px; text-align: center;
  }
  .pricing-breadcrumb span { color: #ccc; margin-right: 4px; }

  .pricing-headline {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(36px, 4.5vw, 58px);
    color: #0a0a0a; letter-spacing: -1.2px;
    line-height: 1.05; text-align: center;
    margin-bottom: 0;
  }
  .pricing-headline em { font-style: italic; color: #2563eb; }
  .pricing-sub {
    text-align: center;
    font-size: 15px; font-weight: 300; color: #888;
    margin-top: 12px; margin-bottom: 32px;
  }

  /* Razorpay badge */
  .rp-badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: #555; background: #fff;
    border: 1px solid #e5e5e5; border-radius: 20px;
    padding: 5px 14px; margin: 0 auto 44px; display: flex;
    width: fit-content;
    letter-spacing: 0.04em;
  }
  .rp-badge svg { width: 14px; height: 14px; stroke: #888; }

  /* Plans grid */
  .plans-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border: 1.5px solid #1a1a1a;
    border-radius: 4px;
    box-shadow: 5px 5px 0 #1a1a1a;
    overflow: hidden;
    background: #e5e5e5;
    margin-bottom: 16px;
  }

  .plan-card {
    background: #fff;
    padding: 32px 30px 30px;
    position: relative;
    transition: background 0.15s;
  }
  .plan-card.dark {
    background: #0a0a0a;
  }
  .plan-card + .plan-card { border-left: 1px solid #e5e5e5; }
  .plan-card.dark + .plan-card { border-left: 1px solid #1e1e1e; }

  .plan-popular-tag {
    position: absolute; top: 16px; right: 16px;
    font-family: 'DM Mono', monospace;
    font-size: 9.5px; font-weight: 500;
    background: #2563eb; color: #fff;
    padding: 3px 10px; border-radius: 3px;
    letter-spacing: 0.08em; text-transform: uppercase;
  }

  .plan-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 600;
    color: #0a0a0a; margin-bottom: 2px;
  }
  .plan-card.dark .plan-name { color: #fff; }

  .plan-period {
    font-family: 'DM Mono', monospace;
    font-size: 10px; color: #bbb;
    letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 20px;
  }
  .plan-card.dark .plan-period { color: #555; }

  .plan-price {
    font-family: 'DM Serif Display', serif;
    font-size: 44px; color: #0a0a0a;
    letter-spacing: -1.5px; line-height: 1;
    margin-bottom: 4px;
  }
  .plan-card.dark .plan-price { color: #fff; }

  .plan-price-note {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #aaa;
    margin-bottom: 24px; letter-spacing: 0.03em;
  }
  .plan-card.dark .plan-price-note { color: #555; }

  .plan-cta {
    width: 100%; height: 44px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600;
    border-radius: 4px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.15s; margin-bottom: 26px;
    text-decoration: none;
  }
  .plan-cta.outline {
    background: #fff; color: #0a0a0a;
    border: 1.5px solid #d0d0d0;
  }
  .plan-cta.outline:hover { border-color: #0a0a0a; }
  .plan-cta.filled {
    background: #2563eb; color: #fff;
    border: 1.5px solid #2563eb;
  }
  .plan-cta.filled:hover { background: #1d4ed8; border-color: #1d4ed8; }
  .plan-cta.dark-filled {
    background: #fff; color: #0a0a0a;
    border: 1.5px solid #fff;
  }
  .plan-cta.dark-filled:hover { opacity: 0.88; }

  .plan-divider {
    border: none; border-top: 1px solid #f0f0f0; margin-bottom: 18px;
  }
  .plan-card.dark .plan-divider { border-top-color: #1e1e1e; }

  .plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .plan-feature {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 13.5px; color: #444; line-height: 1.4;
  }
  .plan-card.dark .plan-feature { color: rgba(255,255,255,0.55); }
  .plan-feature-check {
    width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px;
    color: #16a34a;
  }
  .plan-card.dark .plan-feature-check { color: #4ade80; }

  /* Bottom plans row (full width) */
  .plans-bottom {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0;
    border: 1.5px solid #1a1a1a;
    border-radius: 4px;
    box-shadow: 5px 5px 0 #1a1a1a;
    overflow: hidden;
    background: #e5e5e5;
  }

  /* FOOTER */
  .pricing-footer {
    margin-top: 40px; text-align: center;
    font-family: 'DM Mono', monospace;
    font-size: 11.5px; color: #bbb; letter-spacing: 0.04em;
  }
  .pricing-footer a { color: #888; text-decoration: none; }
  .pricing-footer a:hover { color: #0a0a0a; }

  /* FAQ Section */
  .faq-section { max-width: 960px; margin: 60px auto 0; padding: 0 32px; }
  .faq-title {
    font-family: 'DM Serif Display', serif;
    font-size: 28px; color: #0a0a0a; letter-spacing: -0.5px;
    margin-bottom: 20px;
  }
  .faq-item {
    border-top: 1px solid #e5e5e5;
    padding: 16px 0;
    cursor: pointer;
  }
  .faq-item:last-child { border-bottom: 1px solid #e5e5e5; }
  .faq-q {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 14.5px; font-weight: 500; color: #0a0a0a;
  }
  .faq-icon {
    width: 20px; height: 20px; flex-shrink: 0;
    color: #aaa; transition: transform 0.2s;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .faq-icon.open { transform: rotate(45deg); }
  .faq-a {
    font-size: 13.5px; font-weight: 300; color: #777;
    line-height: 1.7; margin-top: 10px;
    max-height: 0; overflow: hidden;
    transition: max-height 0.25s ease;
  }
  .faq-a.open { max-height: 200px; }
`;

const PLANS = [
  {
    name: "Free",
    period: "/ INDIVIDUALS",
    price: "₹0",
    priceNote: "forever",
    cta: "Current plan",
    ctaType: "outline",
    dark: false,
    features: [
      "2 repo scans / week",
      "1 website scan / week",
      "10 code files / week",
      "10 paste scans / week",
      "Full report access",
    ],
  },
  {
    name: "Monthly",
    period: "/ 30 DAYS",
    price: "₹219",
    priceNote: "/ 30 days",
    cta: "Upgrade",
    ctaType: "filled",
    dark: false,
    features: [
      "Unlimited repos",
      "Unlimited websites",
      "Unlimited files",
      "Priority analysis",
      "Early access to new features",
    ],
  },
  {
    name: "Quarterly",
    period: "/ 90 DAYS",
    price: "₹600",
    priceNote: "/ 90 days",
    cta: "Upgrade",
    ctaType: "dark-filled",
    dark: true,
    popular: true,
    features: [
      "All Monthly features",
      "Save ~9%",
      "Quarterly report export",
      "Priority support",
      "Advanced risk analytics",
    ],
  },
  {
    name: "Yearly",
    period: "/ 365 DAYS",
    price: "₹2100",
    priceNote: "/ 365 days",
    cta: "Upgrade",
    ctaType: "filled",
    dark: false,
    features: [
      "All features",
      "Save 20%",
      "Annual audit report",
      "Team seats (soon)",
      "Dedicated support",
    ],
  },
];

const FAQS = [
  { q: "Can I cancel anytime?", a: "Yes. All paid plans can be cancelled at any time from your account settings. You'll retain access until the end of your billing period." },
  { q: "What counts as a 'scan'?", a: "Each unique repo URL, website URL, file upload, or code paste is counted as one scan. Rescanning the same target counts as a new scan." },
  { q: "Are there team or enterprise plans?", a: "Team seats are coming soon on the Yearly plan. For enterprise or volume pricing, reach out to us directly at hello@bughunter.dev." },
  { q: "What payment methods are supported?", a: "We use Razorpay for secure payment processing. UPI, credit/debit cards, net banking, and wallets are all supported." },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <style>{S}</style>
      <div className="pricing-page">
        <Navbar currentPage="pricing" />

        <div className="pricing-inner">
          <div className="pricing-breadcrumb"><span>/</span> PRICING</div>
          <div className="pricing-headline">
            Scale your scans.<br/><em>Not your costs.</em>
          </div>
          <div className="pricing-sub">
            Start free. Upgrade when you need unlimited scans and priority analysis.
          </div>

          <div className="rp-badge">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            RAZORPAY · SECURE FOR UPI
          </div>

          {/* Top row: Free + Monthly */}
          <div className="plans-grid" style={{marginBottom:16}}>
            {PLANS.slice(0,2).map((plan, i) => (
              <div className={`plan-card ${plan.dark ? "dark" : ""}`} key={i}>
                {plan.popular && <span className="plan-popular-tag">BEST · POPULAR</span>}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-period">{plan.period}</div>
                <div className="plan-price">{plan.price}</div>
                <div className="plan-price-note">{plan.priceNote}</div>
                <a
                  className={`plan-cta ${plan.ctaType}`}
                  href={plan.ctaType === "outline" ? "#" : "/dashboard"}
                >
                  {plan.ctaType !== "outline" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  )}
                  {plan.cta}
                </a>
                <hr className="plan-divider"/>
                <ul className="plan-features">
                  {plan.features.map((f,j) => (
                    <li className="plan-feature" key={j}>
                      <svg className="plan-feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row: Quarterly + Yearly */}
          <div className="plans-bottom">
            {PLANS.slice(2,4).map((plan, i) => (
              <div className={`plan-card ${plan.dark ? "dark" : ""}`} key={i}>
                {plan.popular && <span className="plan-popular-tag">BEST · POPULAR</span>}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-period">{plan.period}</div>
                <div className="plan-price">{plan.price}</div>
                <div className="plan-price-note">{plan.priceNote}</div>
                <a
                  className={`plan-cta ${plan.ctaType}`}
                  href="/dashboard"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  {plan.cta}
                </a>
                <hr className="plan-divider"/>
                <ul className="plan-features">
                  {plan.features.map((f,j) => (
                    <li className="plan-feature" key={j}>
                      <svg className="plan-feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pricing-footer">
            Secure payments via <a href="#">Razorpay</a> · Cancel anytime · All plans include full report history
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <div className="faq-title">Frequently asked</div>
          {FAQS.map((faq, i) => (
            <div className="faq-item" key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="faq-q">
                {faq.q}
                <span className={`faq-icon ${openFaq === i ? "open" : ""}`}>+</span>
              </div>
              <div className={`faq-a ${openFaq === i ? "open" : ""}`}>{faq.a}</div>
            </div>
          ))}
          <div style={{height:64}}/>
        </div>
      </div>
    </>
  );
}