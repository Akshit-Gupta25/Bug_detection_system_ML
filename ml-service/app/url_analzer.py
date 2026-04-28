"""
url_analyzer.py — Website / URL Deep Analysis Engine
Scans a rendered URL for:
  • UI / Layout issues
  • Performance signals
  • SEO & meta problems
  • Security headers
  • Authentication exposure
  • API endpoint leaks
  • Accessibility basics
  • Broken links / missing assets
"""

import re
import time
import requests
from urllib.parse import urljoin, urlparse


# ─────────────────────────────────────────────────────────────────────────────
#  Helpers
# ─────────────────────────────────────────────────────────────────────────────

TIMEOUT = 12

HEADERS_UA = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; BugHunter/1.0; +https://bughunter.dev)"
    )
}

def _issue(category: str, message: str, severity: str, detail: str = ""):
    return {
        "category": category,
        "message":  message,
        "severity": severity,   # CRITICAL | WARNING | INFO
        "detail":   detail,
    }


def _safe_get(url: str, **kwargs):
    try:
        return requests.get(url, headers=HEADERS_UA, timeout=TIMEOUT, **kwargs)
    except Exception as e:
        return None


# ─────────────────────────────────────────────────────────────────────────────
#  Security headers
# ─────────────────────────────────────────────────────────────────────────────

REQUIRED_HEADERS = {
    "Strict-Transport-Security": (
        "CRITICAL",
        "Missing HSTS header — site is vulnerable to protocol downgrade attacks",
    ),
    "X-Content-Type-Options": (
        "WARNING",
        "Missing X-Content-Type-Options — browser may MIME-sniff responses",
    ),
    "X-Frame-Options": (
        "WARNING",
        "Missing X-Frame-Options — site may be embeddable in iframes (clickjacking)",
    ),
    "Content-Security-Policy": (
        "WARNING",
        "Missing Content-Security-Policy — XSS attacks harder to mitigate",
    ),
    "Referrer-Policy": (
        "INFO",
        "Missing Referrer-Policy — referrer data may leak to third parties",
    ),
    "Permissions-Policy": (
        "INFO",
        "Missing Permissions-Policy — browser features not explicitly restricted",
    ),
}

DANGEROUS_HEADERS = {
    "Server":      "Server version exposed in headers — remove or obscure",
    "X-Powered-By":"Technology stack exposed (X-Powered-By) — remove this header",
    "X-AspNet-Version": "ASP.NET version exposed — update and remove this header",
}


def _check_security_headers(response, issues: list):
    for header, (severity, msg) in REQUIRED_HEADERS.items():
        if header not in response.headers:
            issues.append(_issue("security", msg, severity, f"Header: {header}"))

    for header, msg in DANGEROUS_HEADERS.items():
        if header in response.headers:
            issues.append(_issue("security", msg, "WARNING",
                                 f"{header}: {response.headers[header]}"))

    # HTTPS check
    if response.url.startswith("http://"):
        issues.append(_issue("security",
                             "Site is served over HTTP, not HTTPS — data is unencrypted",
                             "CRITICAL", response.url))

    # Mixed content signal (basic)
    if "upgrade-insecure-requests" not in response.headers.get("Content-Security-Policy", "").lower():
        if response.url.startswith("https://"):
            issues.append(_issue("security",
                                 "CSP does not include 'upgrade-insecure-requests' — mixed content possible",
                                 "INFO"))


# ─────────────────────────────────────────────────────────────────────────────
#  HTML analysis
# ─────────────────────────────────────────────────────────────────────────────

def _check_html(html: str, base_url: str, issues: list):
    # ── SEO / Meta ────────────────────────────────────────────────────────────
    if not re.search(r'<title[^>]*>.+?</title>', html, re.IGNORECASE | re.DOTALL):
        issues.append(_issue("seo", "Missing <title> tag — critical for SEO and browser tabs", "CRITICAL"))
    elif re.search(r'<title[^>]*>\s*</title>', html, re.IGNORECASE):
        issues.append(_issue("seo", "Empty <title> tag detected", "CRITICAL"))

    if not re.search(r'<meta[^>]+name=["\']description["\']', html, re.IGNORECASE):
        issues.append(_issue("seo", "Missing meta description — affects search engine snippets", "WARNING"))

    if not re.search(r'<meta[^>]+name=["\']viewport["\']', html, re.IGNORECASE):
        issues.append(_issue("ui", "Missing viewport meta tag — site will not be mobile-responsive", "CRITICAL"))

    if not re.search(r'<html[^>]+lang=', html, re.IGNORECASE):
        issues.append(_issue("accessibility", "Missing lang attribute on <html> — required for screen readers", "WARNING"))

    # Canonical
    if not re.search(r'<link[^>]+rel=["\']canonical["\']', html, re.IGNORECASE):
        issues.append(_issue("seo", "No canonical URL tag — may cause duplicate content penalties", "INFO"))

    # Open Graph
    if not re.search(r'<meta[^>]+property=["\']og:', html, re.IGNORECASE):
        issues.append(_issue("seo", "No Open Graph meta tags — links won't preview on social media", "INFO"))

    # ── Accessibility ─────────────────────────────────────────────────────────
    # Images without alt
    imgs = re.findall(r'<img[^>]*>', html, re.IGNORECASE)
    no_alt = [img for img in imgs if 'alt=' not in img.lower()]
    if no_alt:
        issues.append(_issue("accessibility",
                             f"{len(no_alt)} image(s) missing alt attribute — screen reader inaccessible",
                             "WARNING", f"First: {no_alt[0][:80]}"))

    # Form inputs without labels
    inputs = re.findall(r'<input[^>]*type=["\'](?!hidden)["\'][^>]*>', html, re.IGNORECASE)
    labels = re.findall(r'<label[^>]*>', html, re.IGNORECASE)
    if len(inputs) > len(labels) + 1:
        issues.append(_issue("accessibility",
                             f"{len(inputs)} input(s) but only {len(labels)} label(s) — form accessibility issue",
                             "WARNING"))

    # ── UI / Layout ───────────────────────────────────────────────────────────
    # Inline styles (lots of them = layout management concern)
    inline_styles = len(re.findall(r'\bstyle\s*=\s*["\']', html, re.IGNORECASE))
    if inline_styles > 20:
        issues.append(_issue("ui",
                             f"{inline_styles} inline style attributes — use CSS classes for maintainability",
                             "INFO"))

    # Table-based layout
    if re.search(r'<table[^>]*layout', html, re.IGNORECASE) or html.count('<table') > 5:
        issues.append(_issue("ui", "Multiple <table> elements detected — check if used for layout (bad practice)", "INFO"))

    # Deprecated HTML tags
    deprecated = re.findall(r'<(center|font|marquee|blink|frame|frameset)[>\s]', html, re.IGNORECASE)
    if deprecated:
        issues.append(_issue("ui",
                             f"Deprecated HTML tags found: {list(set(deprecated))} — replace with modern CSS",
                             "WARNING"))

    # ── Performance ───────────────────────────────────────────────────────────
    # Render-blocking scripts in <head>
    head_match = re.search(r'<head[^>]*>(.*?)</head>', html, re.IGNORECASE | re.DOTALL)
    if head_match:
        head = head_match.group(1)
        blocking = re.findall(r'<script(?![^>]*async)(?![^>]*defer)[^>]*src=[^>]*>', head, re.IGNORECASE)
        if blocking:
            issues.append(_issue("performance",
                                 f"{len(blocking)} render-blocking <script> tag(s) in <head> — add async or defer",
                                 "WARNING"))

    # No lazy loading on images
    large_imgs = [img for img in imgs if 'loading=' not in img.lower()]
    if len(large_imgs) > 5:
        issues.append(_issue("performance",
                             f"{len(large_imgs)} images without loading='lazy' — may slow initial page load",
                             "INFO"))

    # External font blocking
    font_links = re.findall(r'<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*>', html, re.IGNORECASE)
    if font_links:
        has_preconnect = bool(re.search(r'<link[^>]+rel=["\']preconnect["\'][^>]+fonts', html, re.IGNORECASE))
        if not has_preconnect:
            issues.append(_issue("performance",
                                 "Google Fonts loaded without preconnect — adds DNS lookup latency",
                                 "INFO"))

    # ── Authentication exposure ───────────────────────────────────────────────
    # Login forms over non-HTTPS (already caught by header check, but double-check HTML)
    if re.search(r'<form[^>]*action=["\']http://', html, re.IGNORECASE):
        issues.append(_issue("authentication",
                             "Form submits to HTTP URL — credentials sent in plaintext",
                             "CRITICAL"))

    # Password field with autocomplete on
    pw_fields = re.findall(r'<input[^>]*type=["\']password["\'][^>]*>', html, re.IGNORECASE)
    for pf in pw_fields:
        if 'autocomplete="off"' not in pf and 'autocomplete=\'off\'' not in pf:
            issues.append(_issue("authentication",
                                 "Password input missing autocomplete='off' — browser may autofill unexpectedly",
                                 "INFO"))
            break

    # ── API / Data exposure ───────────────────────────────────────────────────
    # Exposed API keys in HTML/JS
    api_key_pat = re.compile(
        r'(api[_-]?key|apikey|secret|token|bearer)\s*[:=]\s*["\']([A-Za-z0-9_\-]{16,})["\']',
        re.IGNORECASE
    )
    api_matches = api_key_pat.findall(html)
    if api_matches:
        issues.append(_issue("security",
                             f"Possible API key/token exposed in HTML source ({len(api_matches)} match(es))",
                             "CRITICAL", f"Key type: {api_matches[0][0]}"))

    # Internal paths/endpoints leaked
    internal = re.findall(r'(\/api\/|\/admin\/|\/internal\/|\/v\d\/)["\']', html)
    if internal:
        issues.append(_issue("api",
                             f"Internal API paths visible in HTML: {list(set(internal))[:5]}",
                             "WARNING"))

    # Stack trace in HTML
    if re.search(r'(Traceback|NullPointerException|Stack trace|at \w+\.\w+\()', html):
        issues.append(_issue("security",
                             "Server error / stack trace visible in HTML — leaks implementation details",
                             "CRITICAL"))

    # Debug info
    if re.search(r'(DEBUG\s*=\s*True|debug mode|development mode)', html, re.IGNORECASE):
        issues.append(_issue("security",
                             "Debug mode indicator found in page content — disable before production",
                             "CRITICAL"))


# ─────────────────────────────────────────────────────────────────────────────
#  Performance: response time & payload
# ─────────────────────────────────────────────────────────────────────────────

def _check_performance(response, elapsed_ms: float, issues: list):
    content_len = len(response.content)

    if elapsed_ms > 3000:
        issues.append(_issue("performance",
                             f"Slow response time: {elapsed_ms:.0f}ms — target is under 1500ms",
                             "CRITICAL", f"Time to first byte: {elapsed_ms:.0f}ms"))
    elif elapsed_ms > 1500:
        issues.append(_issue("performance",
                             f"Response time is {elapsed_ms:.0f}ms — could be improved",
                             "WARNING"))

    if content_len > 500_000:
        kb = content_len // 1024
        issues.append(_issue("performance",
                             f"HTML payload is {kb} KB — large initial load hurts Core Web Vitals",
                             "WARNING", f"Payload: {kb} KB"))

    # Caching headers
    cc = response.headers.get("Cache-Control", "")
    if not cc:
        issues.append(_issue("performance",
                             "No Cache-Control header — browsers won't cache this response",
                             "INFO"))
    elif "no-store" in cc:
        issues.append(_issue("performance",
                             "Cache-Control: no-store — page is never cached, every visit hits the server",
                             "INFO"))

    # Compression
    encoding = response.headers.get("Content-Encoding", "")
    if not encoding:
        issues.append(_issue("performance",
                             "Response is not compressed (no gzip/br) — enable compression on the server",
                             "WARNING"))


# ─────────────────────────────────────────────────────────────────────────────
#  Component / Framework detection
# ─────────────────────────────────────────────────────────────────────────────

def _detect_components(html: str) -> dict:
    tech = {}

    if re.search(r'(react|__NEXT_DATA__|_next\/static)', html, re.IGNORECASE):
        tech["framework"] = "React / Next.js"
    elif re.search(r'(ng-version|angular)', html, re.IGNORECASE):
        tech["framework"] = "Angular"
    elif re.search(r'(data-v-|__vue)', html, re.IGNORECASE):
        tech["framework"] = "Vue.js"
    else:
        tech["framework"] = "Unknown / Vanilla"

    tech["has_analytics"] = bool(re.search(r'(gtag|_ga|google-analytics|mixpanel|segment)', html, re.IGNORECASE))
    tech["has_cdn"]       = bool(re.search(r'(cloudflare|fastly|cdn\.jsdelivr|unpkg\.com)', html, re.IGNORECASE))
    tech["has_spa"]       = bool(re.search(r'(id=["\']root["\']|id=["\']app["\'])', html, re.IGNORECASE))

    return tech


# ─────────────────────────────────────────────────────────────────────────────
#  Public API
# ─────────────────────────────────────────────────────────────────────────────

def analyze_url(url: str) -> dict:
    """
    Full website analysis.

    Returns
    -------
    {
        "url": str,
        "status_code": int,
        "response_time_ms": float,
        "issues": list[dict],
        "summary": dict,
        "tech_stack": dict,
    }
    """
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    issues = []

    # ── Fetch ────────────────────────────────────────────────────────────────
    t0 = time.time()
    response = _safe_get(url, allow_redirects=True)
    elapsed_ms = (time.time() - t0) * 1000

    if response is None:
        return {
            "url":              url,
            "status_code":      0,
            "response_time_ms": 0,
            "issues": [_issue("general", f"Could not reach {url} — connection failed or host unreachable", "CRITICAL")],
            "summary":          {"total": 1, "critical": 1, "warning": 0, "info": 0},
            "tech_stack":       {},
        }

    # ── Status code checks ────────────────────────────────────────────────────
    status = response.status_code
    if status >= 500:
        issues.append(_issue("general", f"Server error {status} — backend is returning 5xx responses", "CRITICAL"))
    elif status >= 400:
        issues.append(_issue("general", f"Client error {status} — page not found or access denied", "WARNING"))
    elif status == 301 or status == 302:
        issues.append(_issue("general", f"Redirect detected ({status}) → {response.url}", "INFO"))

    # ── Run all checks ────────────────────────────────────────────────────────
    html = response.text

    _check_security_headers(response, issues)
    _check_html(html, url, issues)
    _check_performance(response, elapsed_ms, issues)

    # ── Tech stack ────────────────────────────────────────────────────────────
    tech = _detect_components(html)

    # ── Summary ───────────────────────────────────────────────────────────────
    summary = {
        "total":    len(issues),
        "critical": sum(1 for i in issues if i["severity"] == "CRITICAL"),
        "warning":  sum(1 for i in issues if i["severity"] == "WARNING"),
        "info":     sum(1 for i in issues if i["severity"] == "INFO"),
    }

    # Group by category for frontend
    by_category = {}
    for issue in issues:
        cat = issue["category"]
        by_category.setdefault(cat, []).append(issue)

    return {
        "url":              response.url,
        "status_code":      status,
        "response_time_ms": round(elapsed_ms, 1),
        "issues":           issues,
        "issues_by_category": by_category,
        "summary":          summary,
        "tech_stack":       tech,
    }