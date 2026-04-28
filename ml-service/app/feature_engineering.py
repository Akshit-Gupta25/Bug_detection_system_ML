# from collections import defaultdict
# import os  # ✅ ADD THIS

# def generate_features(data):
#     file_metrics = defaultdict(lambda: {
#         "file_name": "",
#         "change_count": 0,
#         "total_lines_added": 0,
#         "total_lines_deleted": 0,
#         "devlopers": set(),
#         "source_code": ""
#     })

#     for entry in data:
#         # 🔥 NORMALIZE FILE PATH
#         file = os.path.normpath(entry["file_name"]).replace("\\", "/")

#         file_metrics[file]["file_name"] = file
#         file_metrics[file]["change_count"] += 1
#         file_metrics[file]["total_lines_added"] += entry["lines_added"]
#         file_metrics[file]["total_lines_deleted"] += entry["lines_deleted"]
#         file_metrics[file]["devlopers"].add(entry["author"])

#         # ✅ KEEP FIRST NON-EMPTY SOURCE CODE
#         if not file_metrics[file]["source_code"] and entry.get("source_code"):
#             file_metrics[file]["source_code"] = entry["source_code"]

#     result = []

#     for file, metrics in file_metrics.items():
#         change_count = metrics["change_count"]
#         total_lines_added = metrics["total_lines_added"]
#         total_lines_deleted = metrics["total_lines_deleted"]
#         devloper_count = len(metrics["devlopers"])

#         result.append({
#             "file_name": file,
#             "change_count": change_count,
#             "total_lines_added": total_lines_added,
#             "total_lines_deleted": total_lines_deleted,
#             "devloper_count": devloper_count,

#             "churn_ratio": total_lines_added / (total_lines_deleted + 1),
#             "avg_changes_per_dev": change_count / (devloper_count + 1),
#             "stability_score": 1 / (change_count + 1),
#             "total_churn": total_lines_added + total_lines_deleted,

#             "source_code": metrics["source_code"]
#         })

#     return result
"""
feature_engineering.py — Enhanced Feature Pipeline
Upgrades:
  • 20+ features (was 8)
  • GitHub API enrichment (issue count, PR count, stars, last activity)
  • Better churn ratio (symmetric)
  • Commit message bug-keyword scoring
  • File age signal
  • Burst-change detection (many changes in short time)
  • Typo fix: devloper → developer
"""

from collections import defaultdict
import os
import re
import math
import requests
from datetime import datetime, timezone


# ── GitHub API helpers ────────────────────────────────────────────────────────

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")   # set in your .env

def _gh_headers():
    h = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        h["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return h


def _parse_github_url(repo_url: str):
    """Extract owner/repo from any GitHub URL format."""
    repo_url = repo_url.rstrip("/").rstrip(".git")
    match = re.search(r"github\.com[:/]([^/]+)/([^/]+)", repo_url)
    if match:
        return match.group(1), match.group(2)
    return None, None


def fetch_github_repo_meta(repo_url: str) -> dict:
    """
    Fetch repo-level metadata from GitHub API.
    Returns empty dict gracefully if API is unavailable or not a GitHub URL.
    """
    owner, repo = _parse_github_url(repo_url)
    if not owner:
        return {}

    meta = {}
    base = f"https://api.github.com/repos/{owner}/{repo}"

    try:
        # Basic repo info
        r = requests.get(base, headers=_gh_headers(), timeout=8)
        if r.status_code == 200:
            d = r.json()
            meta["stars"]         = d.get("stargazers_count", 0)
            meta["forks"]         = d.get("forks_count", 0)
            meta["open_issues"]   = d.get("open_issues_count", 0)
            meta["watchers"]      = d.get("watchers_count", 0)
            meta["repo_size_kb"]  = d.get("size", 0)
            meta["has_wiki"]      = int(d.get("has_wiki", False))
            meta["has_projects"]  = int(d.get("has_projects", False))
            pushed_at = d.get("pushed_at", "")
            if pushed_at:
                last = datetime.fromisoformat(pushed_at.replace("Z", "+00:00"))
                meta["days_since_last_push"] = (
                    datetime.now(timezone.utc) - last
                ).days
            else:
                meta["days_since_last_push"] = 999

        # Contributors count
        r2 = requests.get(f"{base}/contributors?per_page=1&anon=true",
                          headers=_gh_headers(), timeout=8)
        if r2.status_code == 200:
            # GitHub returns Link header for pagination total
            link = r2.headers.get("Link", "")
            last_page = re.search(r'page=(\d+)>; rel="last"', link)
            meta["total_contributors"] = int(last_page.group(1)) if last_page else len(r2.json())

        # Open pull requests
        r3 = requests.get(f"{base}/pulls?state=open&per_page=1",
                          headers=_gh_headers(), timeout=8)
        if r3.status_code == 200:
            link3 = r3.headers.get("Link", "")
            last3 = re.search(r'page=(\d+)>; rel="last"', link3)
            meta["open_prs"] = int(last3.group(1)) if last3 else len(r3.json())

        # Recent releases / tags (activity signal)
        r4 = requests.get(f"{base}/releases?per_page=1",
                          headers=_gh_headers(), timeout=8)
        if r4.status_code == 200:
            releases = r4.json()
            meta["has_releases"] = int(len(releases) > 0)

    except Exception as e:
        print(f"⚠️  GitHub API fetch failed: {e}")

    return meta


# ── Commit message bug signal ─────────────────────────────────────────────────

BUG_KEYWORDS = re.compile(
    r"\b(fix|bug|error|crash|issue|hotfix|patch|revert|broken|fail|"
    r"regression|defect|typo|wrong|invalid|corrupt|exception|null|undefined)\b",
    re.IGNORECASE
)

def _bug_keyword_score(messages: list[str]) -> float:
    """Fraction of commit messages that contain bug-related keywords."""
    if not messages:
        return 0.0
    hits = sum(1 for m in messages if BUG_KEYWORDS.search(m))
    return round(hits / len(messages), 4)


# ── Burst detection ───────────────────────────────────────────────────────────

def _burst_score(timestamps: list) -> float:
    """
    Returns fraction of commit pairs that happened within 24 h of each other.
    High burst → many rapid fixes → unstable file.
    """
    if len(timestamps) < 2:
        return 0.0
    ts = sorted(timestamps)
    bursts = sum(
        1 for a, b in zip(ts, ts[1:])
        if (b - a).total_seconds() < 86400
    )
    return round(bursts / (len(ts) - 1), 4)


# ── Main feature generation ───────────────────────────────────────────────────

def generate_features(data: list, repo_url: str = "") -> list:
    """
    Build a rich feature vector for every file in the repo.

    Parameters
    ----------
    data       : list of dicts from data_collector.get_repo_data()
    repo_url   : original repo URL — used for GitHub API enrichment

    Returns
    -------
    list of feature dicts, one per file
    """
    # Fetch GitHub-level metadata once for the whole repo
    gh_meta = fetch_github_repo_meta(repo_url) if repo_url else {}
    print(f"📊 GitHub meta fetched: {list(gh_meta.keys())}")

    file_metrics = defaultdict(lambda: {
        "file_name":          "",
        "change_count":       0,
        "total_lines_added":  0,
        "total_lines_deleted":0,
        "developers":         set(),
        "source_code":        "",
        "commit_messages":    [],
        "timestamps":         [],
        "first_seen":         None,
        "last_seen":          None,
    })

    for entry in data:
        # Normalise path
        file = os.path.normpath(entry["file_name"]).replace("\\", "/")

        m = file_metrics[file]
        m["file_name"]           = file
        m["change_count"]       += 1
        m["total_lines_added"]  += entry.get("lines_added", 0)
        m["total_lines_deleted"]+= entry.get("lines_deleted", 0)
        m["developers"].add(entry.get("author", "unknown"))

        # Keep first non-empty source
        if not m["source_code"] and entry.get("source_code"):
            m["source_code"] = entry["source_code"]

        # Commit messages for bug-keyword scoring
        msg = entry.get("commit_message", "")
        if msg:
            m["commit_messages"].append(msg)

        # Timestamps for burst detection
        ts = entry.get("timestamp")
        if ts:
            m["timestamps"].append(ts)
            if m["first_seen"] is None or ts < m["first_seen"]:
                m["first_seen"] = ts
            if m["last_seen"] is None or ts > m["last_seen"]:
                m["last_seen"] = ts

    result = []

    for file, m in file_metrics.items():
        change_count        = m["change_count"]
        total_lines_added   = m["total_lines_added"]
        total_lines_deleted = m["total_lines_deleted"]
        developer_count     = len(m["developers"])
        total_churn         = total_lines_added + total_lines_deleted

        # ── Core ratios ──────────────────────────────────────────────────────
        churn_ratio          = total_churn / (change_count + 1)
        avg_changes_per_dev  = change_count / (developer_count + 1)

        # Stability: exponential decay — many changes = very unstable
        stability_score      = round(1 / (1 + math.log1p(change_count)), 4)

        # Symmetric churn: |added - deleted| / (total_churn + 1)
        # High → rewriting/replacing code aggressively
        asymmetry_score      = round(
            abs(total_lines_added - total_lines_deleted) / (total_churn + 1), 4
        )

        # ── Commit message signals ───────────────────────────────────────────
        bug_keyword_ratio    = _bug_keyword_score(m["commit_messages"])

        # ── Burst detection ───────────────────────────────────────────────────
        burst_score          = _burst_score(m["timestamps"])

        # ── File age (days from first to last commit touching this file) ──────
        if m["first_seen"] and m["last_seen"]:
            file_age_days = max(1, (m["last_seen"] - m["first_seen"]).days)
        else:
            file_age_days = 1

        # Changes per day — high = hot path, likely buggy
        change_rate_per_day  = round(change_count / file_age_days, 4)

        # ── Repo-level signals (same for all files, gives model context) ─────
        repo_open_issues     = gh_meta.get("open_issues", 0)
        repo_open_prs        = gh_meta.get("open_prs", 0)
        repo_contributors    = gh_meta.get("total_contributors", developer_count)
        repo_days_stale      = gh_meta.get("days_since_last_push", 0)
        repo_stars           = gh_meta.get("stars", 0)

        result.append({
            # ── Identity ─────────────────────────────────────────────────────
            "file_name":             file,
            "source_code":           m["source_code"],

            # ── File-level features (model input) ────────────────────────────
            "change_count":          change_count,
            "total_lines_added":     total_lines_added,
            "total_lines_deleted":   total_lines_deleted,
            "developer_count":       developer_count,          # fixed typo
            "churn_ratio":           round(churn_ratio, 4),
            "avg_changes_per_dev":   round(avg_changes_per_dev, 4),
            "stability_score":       stability_score,
            "total_churn":           total_churn,

            # ── NEW features ──────────────────────────────────────────────────
            "asymmetry_score":       asymmetry_score,
            "bug_keyword_ratio":     bug_keyword_ratio,
            "burst_score":           burst_score,
            "file_age_days":         file_age_days,
            "change_rate_per_day":   change_rate_per_day,

            # ── Repo-level context ────────────────────────────────────────────
            "repo_open_issues":      repo_open_issues,
            "repo_open_prs":         repo_open_prs,
            "repo_contributors":     repo_contributors,
            "repo_days_stale":       repo_days_stale,
            "repo_stars":            repo_stars,
        })

    return result


# ── Feature names used by the model ──────────────────────────────────────────

MODEL_FEATURES = [
    "change_count",
    "total_lines_added",
    "total_lines_deleted",
    "developer_count",
    "churn_ratio",
    "avg_changes_per_dev",
    "stability_score",
    "total_churn",
    "asymmetry_score",
    "bug_keyword_ratio",
    "burst_score",
    "file_age_days",
    "change_rate_per_day",
    "repo_open_issues",
    "repo_open_prs",
    "repo_contributors",
    "repo_days_stale",
    "repo_stars",
]