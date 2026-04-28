# from fastapi import FastAPI, Depends
# from fastapi.middleware.cors import CORSMiddleware

# # 🔥 Core ML imports
# from app.data_collector import get_repo_data
# from app.feature_engineering import generate_features
# from app.model import train_model, predict_bug_risk
# from app.utils import is_valid_code_file
# from app.repo_health import calculate_repo_health

# # 🔐 Auth imports
# from app.auth.routes import router as auth_router
# from app.auth.utils import get_current_user


# app = FastAPI()

# # 🔓 Enable CORS (Frontend access)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # 🔐 Include Auth Routes
# app.include_router(auth_router, prefix="/auth", tags=["Auth"])


# @app.get("/")
# def home():
#     return {"message": "🚀 Bug Detection ML API Running"}


# # ✅ SECURED ANALYZE ENDPOINT
# @app.get("/analyze")
# def analyze_repo(repo_url: str, user=Depends(get_current_user)):

#     print(f"🚀 API HIT by user: {user}")

#     # 🔍 Step 1: Collect Data
#     raw_data = get_repo_data(repo_url, max_commits=10)
#     print("✅ Data Collected:", len(raw_data))

#     # ⚙️ Step 2: Feature Engineering
#     features = generate_features(raw_data)
#     print("✅ Features Generated:", len(features))

#     # 🧹 Step 3: Filter valid files
#     features = [
#         f for f in features
#         if is_valid_code_file(f["file_name"])
#     ]
#     print("✅ After Filter:", len(features))

#     # 🚫 Edge Case
#     if not features:
#         return {
#             "total_files": 0,
#             "predictions": [],
#             "repo_health_score": 100,
#             "total_issues": 0,
#             "risk_summary": {
#                 "high": 0,
#                 "medium": 0,
#                 "low": 0
#             },
#             "message": "No valid code files found"
#         }

#     # 🧠 Step 4: Train Model
#     model = train_model(features)
#     print("✅ Model Trained")

#     # 📊 Step 5: Predictions
#     predictions = predict_bug_risk(model, features)
#     print("✅ Predictions Done")

#     # 🔥 Step 6: Priority Score (Industry Feature)
#     for f in predictions:
#         bug_prob = f.get("bug_probability", 0)
#         churn = f.get("total_churn", 0)
#         stability = f.get("stability_score", 1)

#         f["priority_score"] = round(
#             bug_prob * 0.6 +
#             (churn / 100) * 0.3 +
#             (1 - stability) * 0.1,
#             3
#         )

#     # 🔥 Sort by priority
#     predictions = sorted(
#         predictions,
#         key=lambda x: x["priority_score"],
#         reverse=True
#     )

#     # 📈 Step 7: Summary
#     total_files = len(predictions)

#     high = len([f for f in predictions if f["risk_level"] == "HIGH"])
#     medium = len([f for f in predictions if f["risk_level"] == "MEDIUM"])
#     low = len([f for f in predictions if f["risk_level"] == "LOW"])

#     total_issues = sum(len(f.get("code_issues", [])) for f in predictions)

#     # 📊 Step 8: Repo Health
#     repo_health_score = calculate_repo_health(predictions)
#     print("🎯 Repo Health Score:", repo_health_score)

#     print("🎉 ANALYSIS COMPLETE")

#     return {
#         "total_files": total_files,
#         "predictions": predictions,
#         "repo_health_score": repo_health_score,
#         "total_issues": total_issues,
#         "risk_summary": {
#             "high": high,
#             "medium": medium,
#             "low": low
#         }
#     }
"""
main.py — BugHunter FastAPI Backend
Endpoints:
  GET  /analyze         — GitHub repo scan
  POST /analyze/paste   — Pasted code scan
  POST /analyze/file    — Uploaded file scan
  POST /analyze/url     — Website URL scan
"""

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import traceback

# Core ML
from app.data_collector      import get_repo_data
from app.feature_engineering import generate_features
from app.model               import train_model, predict_bug_risk
from app.utils               import is_valid_code_file
from app.repo_health         import calculate_repo_health
from app.code_analyzer       import analyze_code_content
from app.url_analzer        import analyze_url
from app.fix_suggestions     import get_fix_suggestion
from app.ai_explainer        import generate_ai_explanation

# Auth
from app.auth.routes import router as auth_router
from app.auth.utils  import get_current_user


app = FastAPI(title="BugHunter ML API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])


# ─────────────────────────────────────────────────────────────────────────────
#  Shared helpers
# ─────────────────────────────────────────────────────────────────────────────

def _empty_response(message="No valid code files found"):
    return {
        "total_files": 0,
        "predictions": [],
        "repo_health_score": 100,
        "total_issues": 0,
        "model_cv_auc": None,
        "risk_summary": {"high": 0, "medium": 0, "low": 0},
        "message": message,
    }


def _build_summary(predictions: list) -> dict:
    high   = len([f for f in predictions if f["risk_level"] == "HIGH"])
    medium = len([f for f in predictions if f["risk_level"] == "MEDIUM"])
    low    = len([f for f in predictions if f["risk_level"] == "LOW"])
    total_issues = sum(len(f.get("code_issues", [])) for f in predictions)
    return high, medium, low, total_issues


def _add_priority_scores(predictions: list) -> list:
    """Compute priority score and sort predictions."""
    for f in predictions:
        bug_prob  = f.get("bug_probability", 0)
        churn     = f.get("total_churn", 0)
        stability = f.get("stability_score", 1)
        f["priority_score"] = round(
            bug_prob  * 0.6 +
            (min(churn, 500) / 500) * 0.3 +
            (1 - stability) * 0.1,
            3
        )
    return sorted(predictions, key=lambda x: x["priority_score"], reverse=True)


def _single_file_result(
    file_name: str,
    source_code: str,
    scan_type: str = "paste"
) -> dict:
    """
    Analyse a single piece of code (paste or file upload).
    Returns a prediction-style dict.
    """
    source_code = (source_code or "")[:5000]

    issues = analyze_code_content(source_code, file_name)

    if not issues:
        issues = [{"message": "No major issues detected", "severity": "INFO", "category": "general", "line": None}]

    only_clean = (
        len(issues) == 1 and issues[0]["message"] == "No major issues detected"
    )

    fix_suggestions = []
    if not only_clean:
        fix_suggestions = list({get_fix_suggestion(i["message"]) for i in issues})
    else:
        fix_suggestions = ["Code looks clean. No immediate action required."]

    severity_count = {"critical": 0, "warning": 0, "info": 0}
    for issue in issues:
        sev = issue.get("severity", "INFO").upper()
        if sev == "CRITICAL":   severity_count["critical"] += 1
        elif sev == "WARNING":  severity_count["warning"]  += 1
        else:                   severity_count["info"]     += 1

    # Heuristic risk level for paste/file (no git history)
    if severity_count["critical"] >= 2:
        risk_level = "HIGH"
        bug_prob   = 0.85
    elif severity_count["critical"] >= 1 or severity_count["warning"] >= 3:
        risk_level = "MEDIUM"
        bug_prob   = 0.55
    else:
        risk_level = "LOW"
        bug_prob   = 0.15

    reasons = []
    if severity_count["critical"] > 0:
        reasons.append(f"{severity_count['critical']} Critical Issue(s) Detected")
    if severity_count["warning"] > 0:
        reasons.append(f"{severity_count['warning']} Warning(s) Found")
    if not reasons:
        reasons.append("No Significant Issues Found")

    return {
        "file_name":          file_name,
        "scan_type":          scan_type,
        "bug_probability":    bug_prob,
        "risk_level":         risk_level,
        "churn_ratio":        0,
        "avg_changes_per_dev":0,
        "stability_score":    1.0,
        "total_churn":        0,
        "source_code":        source_code[:1000],
        "reasons":            reasons,
        "code_issues":        issues,
        "fix_suggestions":    fix_suggestions,
        "severity_count":     severity_count,
        "priority_score":     bug_prob,
        "ai_explanation":     generate_ai_explanation({
            "risk_level":  risk_level,
            "reasons":     reasons,
            "code_issues": issues,
        }),
    }


# ─────────────────────────────────────────────────────────────────────────────
#  Routes
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/")
def home():
    return {"message": "🚀 BugHunter ML API v2.0 Running"}


# ── 1. GitHub Repo Scan ───────────────────────────────────────────────────────

@app.get("/analyze")
def analyze_repo(repo_url: str, user=Depends(get_current_user)):
    print(f"🚀 REPO SCAN by {user}: {repo_url}")
    try:
        # Step 1: Mine commits (100 max for better accuracy)
        raw_data = get_repo_data(repo_url, max_commits=100)
        print(f"✅ Data Collected: {len(raw_data)}")

        # Step 2: Feature engineering (passes repo_url for GitHub API enrichment)
        features = generate_features(raw_data, repo_url=repo_url)
        print(f"✅ Features Generated: {len(features)}")

        # Step 3: Filter
        features = [f for f in features if is_valid_code_file(f["file_name"])]
        print(f"✅ After Filter: {len(features)}")

        if not features:
            return _empty_response()

        # Step 4: Train (cached) + Predict
        model_tuple = train_model(features)
        print("✅ Model Ready")

        predictions = predict_bug_risk(model_tuple, features)
        print("✅ Predictions Done")

        # CV accuracy from model
        _, cv_score, feature_importance, _ = model_tuple

        # Step 5: Priority scores
        predictions = _add_priority_scores(predictions)

        # Step 6: Summary
        high, medium, low, total_issues = _build_summary(predictions)
        repo_health = calculate_repo_health(predictions)

        print(f"🎯 Health: {repo_health} | CV AUC: {cv_score}")

        return {
            "total_files":       len(predictions),
            "predictions":       predictions,
            "repo_health_score": repo_health,
            "total_issues":      total_issues,
            "model_cv_auc":      cv_score,
            "feature_importance":feature_importance,
            "risk_summary": {
                "high":   high,
                "medium": medium,
                "low":    low,
            },
        }

    except Exception as e:
        print(f"❌ Repo scan failed: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ── 2. Pasted Code Scan ───────────────────────────────────────────────────────

class PasteRequest(BaseModel):
    code:      str
    file_name: str = "snippet.txt"

@app.post("/analyze/paste")
def analyze_paste(req: PasteRequest, user=Depends(get_current_user)):
    print(f"🚀 PASTE SCAN by {user}: {req.file_name}")
    try:
        result = _single_file_result(req.file_name, req.code, scan_type="paste")
        return {
            "total_files":       1,
            "predictions":       [result],
            "repo_health_score": 100 - int(result["bug_probability"] * 60),
            "total_issues":      len(result["code_issues"]),
            "model_cv_auc":      None,
            "risk_summary": {
                "high":   1 if result["risk_level"] == "HIGH"   else 0,
                "medium": 1 if result["risk_level"] == "MEDIUM" else 0,
                "low":    1 if result["risk_level"] == "LOW"    else 0,
            },
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ── 3. File Upload Scan ───────────────────────────────────────────────────────

@app.post("/analyze/file")
async def analyze_file(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    print(f"🚀 FILE SCAN by {user}: {file.filename}")
    try:
        if not is_valid_code_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file.filename}. Allowed: .py .js .ts .jsx .tsx .java .cpp .c"
            )

        raw = await file.read()
        try:
            source_code = raw.decode("utf-8")
        except UnicodeDecodeError:
            source_code = raw.decode("latin-1", errors="replace")

        result = _single_file_result(file.filename, source_code, scan_type="file")

        return {
            "total_files":       1,
            "predictions":       [result],
            "repo_health_score": 100 - int(result["bug_probability"] * 60),
            "total_issues":      len(result["code_issues"]),
            "model_cv_auc":      None,
            "risk_summary": {
                "high":   1 if result["risk_level"] == "HIGH"   else 0,
                "medium": 1 if result["risk_level"] == "MEDIUM" else 0,
                "low":    1 if result["risk_level"] == "LOW"    else 0,
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ── 4. URL / Website Scan ─────────────────────────────────────────────────────

class UrlRequest(BaseModel):
    url: str

@app.post("/analyze/url")
def analyze_website(req: UrlRequest, user=Depends(get_current_user)):
    print(f"🚀 URL SCAN by {user}: {req.url}")
    try:
        result = analyze_url(req.url)
        issues = result["issues"]

        # Map URL issues into prediction-compatible format
        prediction = {
            "file_name":          result["url"],
            "scan_type":          "url",
            "bug_probability":    min(1.0, result["summary"]["critical"] * 0.15 + result["summary"]["warning"] * 0.07),
            "risk_level":         (
                "HIGH"   if result["summary"]["critical"] >= 3 else
                "MEDIUM" if result["summary"]["critical"] >= 1 or result["summary"]["warning"] >= 4 else
                "LOW"
            ),
            "response_time_ms":   result["response_time_ms"],
            "status_code":        result["status_code"],
            "tech_stack":         result["tech_stack"],
            "churn_ratio":        0,
            "avg_changes_per_dev":0,
            "stability_score":    1.0,
            "total_churn":        0,
            "source_code":        "",
            "reasons":            [f"{i['category'].upper()}: {i['message'][:60]}" for i in issues[:5]],
            "code_issues":        [
                {
                    "message":  i["message"],
                    "severity": i["severity"],
                    "category": i["category"],
                    "detail":   i.get("detail", ""),
                    "line":     None,
                } for i in issues
            ],
            "fix_suggestions":    list({
                get_fix_suggestion(i["message"]) for i in issues
                if get_fix_suggestion(i["message"]) != "No suggestion available"
            })[:8],
            "severity_count":     {
                "critical": result["summary"]["critical"],
                "warning":  result["summary"]["warning"],
                "info":     result["summary"]["info"],
            },
            "issues_by_category": result.get("issues_by_category", {}),
            "priority_score":     round(result["summary"]["critical"] * 0.15 + result["summary"]["warning"] * 0.05, 3),
            "ai_explanation":     (
                f"This URL scored {result['summary']['critical']} critical and "
                f"{result['summary']['warning']} warning issues. "
                f"Response time was {result['response_time_ms']}ms. "
                f"Framework detected: {result['tech_stack'].get('framework', 'Unknown')}. "
                f"Focus on resolving security headers and performance issues first."
            ),
        }

        return {
            "total_files":       1,
            "predictions":       [prediction],
            "repo_health_score": max(0, 100 - result["summary"]["critical"] * 15 - result["summary"]["warning"] * 5),
            "total_issues":      result["summary"]["total"],
            "model_cv_auc":      None,
            "url_meta": {
                "status_code":      result["status_code"],
                "response_time_ms": result["response_time_ms"],
                "tech_stack":       result["tech_stack"],
            },
            "risk_summary": {
                "high":   1 if result["summary"]["critical"] >= 3 else 0,
                "medium": 1 if 1 <= result["summary"]["critical"] < 3 else 0,
                "low":    1 if result["summary"]["critical"] == 0 else 0,
            },
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))