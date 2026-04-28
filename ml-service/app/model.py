# import pandas as pd
# from sklearn.ensemble import RandomForestClassifier
# from app.code_analyzer import analyze_code_content
# from app.fix_suggestions import get_fix_suggestion
# from app.utils import is_valid_code_file 
# from app.ai_explainer import generate_ai_explanation



# def train_model(features):
#     df = pd.DataFrame(features)

#     # 🔥 Synthetic Labels (temporary logic)
#     df['bug_label'] = (
#         (df['change_count'] > 5) |
#         (df['total_lines_added'] + df['total_lines_deleted'] > 50) |
#         (df['devloper_count'] > 2)
#     ).astype(int)

#     X = df[[
#         "change_count",
#         "total_lines_added",
#         "total_lines_deleted",
#         "devloper_count",
#         "churn_ratio",
#         "avg_changes_per_dev",
#         "stability_score",
#         "total_churn"
#     ]]

#     y = df["bug_label"]

#     model = RandomForestClassifier()
#     model.fit(X, y)

#     return model


# def predict_bug_risk(model, features):
#     df = pd.DataFrame(features)

#     X = df[[
#         "change_count",
#         "total_lines_added",
#         "total_lines_deleted",
#         "devloper_count",
#         "churn_ratio",
#         "avg_changes_per_dev",
#         "stability_score",
#         "total_churn"
#     ]]

#     # 🔥 Get probabilities (0 → 1)
#     if len(model.classes_) == 1:
#         predictions = [1.0 if model.classes_[0] == 1 else 0.0] * len(features)
#     else:
#         predictions = model.predict_proba(X)[:, 1]

#     def get_risk_level(prob):
#         if prob >= 0.7:
#             return "HIGH"
#         elif prob >= 0.3:
#             return "MEDIUM"
#         else:
#             return "LOW"

#     results = []

#     for i, file in enumerate(features):
#         prob = float(round(predictions[i], 4))

#         source_code = file.get("source_code", "")
#         if not isinstance(source_code, str):
#             source_code = ""
#         source_code = source_code[:1000]

#         try:
#             code_issues = analyze_code_content(source_code) if source_code else []
#         except Exception as e:
#             code_issues = [{
#                 "message": f"Error analyzing code: {str(e)}",
#                 "severity": "CRITICAL"
#             }]

#         if not code_issues:
#             code_issues = [{
#                 "message": "No major issues detected",
#                 "severity": "INFO"
#             }]

#         fix_suggestions = []
#         only_no_issue = (
#             len(code_issues) == 1 and
#             code_issues[0]["message"] == "No major issues detected"
#         )

#         if not only_no_issue:
#             fix_suggestions = list(set([
#                 get_fix_suggestion(issue["message"]) for issue in code_issues
#             ]))
#         else:
#             risk_level = get_risk_level(prob)
#             if risk_level == "HIGH":
#                 fix_suggestions.extend([
#                     "High risk due to frequent changes — consider refactoring.",
#                     "Add unit tests to improve reliability.",
#                     "Review code for hidden logical issues.",
#                     "Ensure proper error handling across critical sections."
#                 ])
#             elif risk_level == "MEDIUM":
#                 fix_suggestions.extend([
#                     "Monitor this file for future changes.",
#                     "Consider improving code structure.",
#                     "Add test coverage if missing."
#                 ])
#             else:
#                 fix_suggestions.append("Code looks stable. No immediate action required.")

#         severity_count = {
#             "critical": 0,
#             "warning": 0,
#             "info": 0
#         }

#         for issue in code_issues:
#             if issue.get("severity") == "CRITICAL":
#                 severity_count["critical"] += 1
#             elif issue.get("severity") == "WARNING":
#                 severity_count["warning"] += 1
#             else:
#                 severity_count["info"] += 1

#         results.append({
#             "file_name": file["file_name"],
#             "bug_probability": prob,
#             "risk_level": get_risk_level(prob),
#             "churn_ratio": round(file["churn_ratio"], 2),
#             "avg_changes_per_dev": round(file["avg_changes_per_dev"], 2),
#             "stability_score": round(file["stability_score"], 4),
#             "total_churn": file["total_churn"],
#             "source_code": source_code,
#             "reasons": explain_predection(file),
#             "code_issues": code_issues,
#             "fix_suggestions": fix_suggestions,
#             "severity_count": severity_count,
#             "ai_explanation": generate_ai_explanation({
#             "risk_level": get_risk_level(prob),
#             "reasons": explain_predection(file),
#             "code_issues": code_issues
# }),
#         })

#     results = sorted(results, key=lambda x: x["bug_probability"], reverse=True)
#     return results


# def explain_predection(file):
#     reasons = []

#     if file["change_count"] > 5:
#         reasons.append("High Change Frequency")

#     if file["total_lines_added"] + file["total_lines_deleted"] > 50:
#         reasons.append("High Code Churn")

#     if file["devloper_count"] > 2:
#         reasons.append("Multiple Developers Involved")

#     if file["churn_ratio"] > 2:
#         reasons.append("Unstable Code Changes")

#     if file["avg_changes_per_dev"] > 3:
#         reasons.append("High Developer Load")

#     if file["stability_score"] < 0.2:
#         reasons.append("Low File Stability")

#     if not reasons:
#         reasons.append("Low Risk Changes")

#     return reasons

"""
model.py — Enhanced ML Pipeline
Upgrades:
  • GradientBoostingClassifier replaces plain RandomForest
    → better accuracy on tabular data, handles feature interactions
  • Smarter synthetic labels using 5 weighted heuristics
  • Calibrated probabilities (CalibratedClassifierCV)
  • Cross-validation score reported at training time
  • Model cached to disk — NOT retrained on every request
  • Uses full MODEL_FEATURES list from feature_engineering
  • Typo fix: devloper → developer throughout
"""

import os
import pickle
import hashlib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.preprocessing import RobustScaler
from sklearn.pipeline import Pipeline

from app.code_analyzer import analyze_code_content
from app.fix_suggestions import get_fix_suggestion
from app.utils import is_valid_code_file
from app.ai_explainer import generate_ai_explanation
from app.feature_engineering import MODEL_FEATURES

# ── Model cache path ──────────────────────────────────────────────────────────
MODEL_CACHE_DIR = "./model_cache"
os.makedirs(MODEL_CACHE_DIR, exist_ok=True)


def _cache_path(features: list) -> str:
    """Deterministic cache key based on file names + change counts."""
    sig = "|".join(
        f"{f['file_name']}:{f['change_count']}"
        for f in sorted(features, key=lambda x: x["file_name"])
    )
    h = hashlib.md5(sig.encode()).hexdigest()[:12]
    return os.path.join(MODEL_CACHE_DIR, f"model_{h}.pkl")


# ── Label generation ──────────────────────────────────────────────────────────

def _make_labels(df: pd.DataFrame) -> pd.Series:
    """
    Weighted heuristic labels — better than simple thresholds.
    Each heuristic contributes a score; files above the 60th percentile
    are labelled as buggy.  This avoids class imbalance extremes.
    """
    score = pd.Series(0.0, index=df.index)

    # 1. High change frequency (weight 2)
    if "change_count" in df:
        score += (df["change_count"] > df["change_count"].quantile(0.7)).astype(float) * 2

    # 2. Massive churn (weight 2)
    if "total_churn" in df:
        score += (df["total_churn"] > df["total_churn"].quantile(0.7)).astype(float) * 2

    # 3. Many developers touching same file (weight 1.5)
    if "developer_count" in df:
        score += (df["developer_count"] > 2).astype(float) * 1.5

    # 4. Commit messages contain bug keywords (weight 3 — strongest signal)
    if "bug_keyword_ratio" in df:
        score += (df["bug_keyword_ratio"] > 0.3).astype(float) * 3

    # 5. Burst changes (weight 2)
    if "burst_score" in df:
        score += (df["burst_score"] > 0.5).astype(float) * 2

    # 6. High change rate per day (weight 1.5)
    if "change_rate_per_day" in df:
        score += (df["change_rate_per_day"] > df["change_rate_per_day"].quantile(0.7)).astype(float) * 1.5

    # 7. Low stability (weight 1)
    if "stability_score" in df:
        score += (df["stability_score"] < 0.3).astype(float) * 1

    # Label: buggy if score is above the 55th percentile (balanced classes)
    threshold = score.quantile(0.55)
    return (score >= threshold).astype(int)


# ── Training ──────────────────────────────────────────────────────────────────

def train_model(features: list):
    """
    Train a calibrated GradientBoosting pipeline.
    Returns (pipeline, cv_accuracy, feature_importances).
    Caches the trained model to disk.
    """
    cache_file = _cache_path(features)
    if os.path.exists(cache_file):
        print(f"✅ Loading cached model: {cache_file}")
        with open(cache_file, "rb") as f:
            return pickle.load(f)

    df = pd.DataFrame(features)

    # Only use columns that exist in this dataset
    available = [c for c in MODEL_FEATURES if c in df.columns]
    X = df[available].fillna(0)
    y = _make_labels(df)

    print(f"📊 Training on {len(X)} files, {len(available)} features")
    print(f"📊 Class distribution: {y.value_counts().to_dict()}")

    # Build pipeline: scaler → GBM → calibration
    base = GradientBoostingClassifier(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.08,
        subsample=0.85,
        min_samples_leaf=2,
        random_state=42,
    )

    pipeline = Pipeline([
        ("scaler", RobustScaler()),
        ("clf",    CalibratedClassifierCV(base, cv=3, method="isotonic")),
    ])

    # Cross-validation (only meaningful with ≥ 10 samples)
    cv_score = None
    if len(X) >= 10:
        try:
            cv = StratifiedKFold(n_splits=min(5, len(X) // 2), shuffle=True, random_state=42)
            scores = cross_val_score(pipeline, X, y, cv=cv, scoring="roc_auc")
            cv_score = round(float(scores.mean()), 3)
            print(f"✅ Cross-val ROC-AUC: {cv_score} ± {scores.std():.3f}")
        except Exception as e:
            print(f"⚠️  CV skipped: {e}")

    pipeline.fit(X, y)

    # Feature importances from the inner GBM (not calibrated wrapper)
    try:
        inner_gbm = pipeline.named_steps["clf"].estimators[0]  # first fold
        importances = dict(zip(available, inner_gbm.feature_importances_.round(4)))
        importances = dict(sorted(importances.items(), key=lambda x: -x[1]))
    except Exception:
        importances = {}

    result = (pipeline, cv_score, importances, available)

    with open(cache_file, "wb") as f:
        pickle.dump(result, f)
    print(f"💾 Model cached to {cache_file}")

    return result


# ── Prediction ────────────────────────────────────────────────────────────────

def predict_bug_risk(model_tuple, features: list) -> list:
    """
    Run predictions and assemble the full result payload.
    model_tuple = (pipeline, cv_score, importances, feature_cols)
    """
    pipeline, cv_score, importances, feature_cols = model_tuple

    df = pd.DataFrame(features)
    X  = df[feature_cols].fillna(0)

    raw_proba = pipeline.predict_proba(X)
    # class order: [0=clean, 1=buggy]
    bug_col = list(pipeline.classes_).index(1) if 1 in pipeline.classes_ else 1
    predictions = raw_proba[:, bug_col]

    def get_risk_level(prob: float) -> str:
        if prob >= 0.65:
            return "HIGH"
        elif prob >= 0.35:
            return "MEDIUM"
        else:
            return "LOW"

    results = []

    for i, file in enumerate(features):
        prob       = float(round(predictions[i], 4))
        risk_level = get_risk_level(prob)

        source_code = file.get("source_code", "")
        if not isinstance(source_code, str):
            source_code = ""
        source_code = source_code[:1500]   # slightly longer for better analysis

        # Static code analysis
        try:
            code_issues = analyze_code_content(source_code) if source_code else []
        except Exception as e:
            code_issues = [{"message": f"Analysis error: {str(e)}", "severity": "CRITICAL"}]

        if not code_issues:
            code_issues = [{"message": "No major issues detected", "severity": "INFO"}]

        # Fix suggestions
        only_clean = (
            len(code_issues) == 1 and
            code_issues[0]["message"] == "No major issues detected"
        )

        if not only_clean:
            fix_suggestions = list(set(
                get_fix_suggestion(issue["message"]) for issue in code_issues
            ))
        else:
            if risk_level == "HIGH":
                fix_suggestions = [
                    "High risk due to frequent changes — consider refactoring.",
                    "Add unit tests to improve reliability.",
                    "Review code for hidden logical issues.",
                    "Ensure proper error handling across critical sections.",
                ]
            elif risk_level == "MEDIUM":
                fix_suggestions = [
                    "Monitor this file for future changes.",
                    "Consider improving code structure.",
                    "Add test coverage if missing.",
                ]
            else:
                fix_suggestions = ["Code looks stable. No immediate action required."]

        # Severity counts
        severity_count = {"critical": 0, "warning": 0, "info": 0}
        for issue in code_issues:
            sev = issue.get("severity", "INFO").upper()
            if sev == "CRITICAL":
                severity_count["critical"] += 1
            elif sev == "WARNING":
                severity_count["warning"] += 1
            else:
                severity_count["info"] += 1

        reasons = explain_prediction(file)

        results.append({
            "file_name":          file["file_name"],
            "bug_probability":    prob,
            "risk_level":         risk_level,
            "churn_ratio":        round(file.get("churn_ratio", 0), 2),
            "avg_changes_per_dev":round(file.get("avg_changes_per_dev", 0), 2),
            "stability_score":    round(file.get("stability_score", 1), 4),
            "total_churn":        file.get("total_churn", 0),
            "source_code":        source_code,
            "reasons":            reasons,
            "code_issues":        code_issues,
            "fix_suggestions":    fix_suggestions,
            "severity_count":     severity_count,
            "model_cv_auc":       cv_score,    # surfaced to frontend
            "ai_explanation":     generate_ai_explanation({
                "risk_level":  risk_level,
                "reasons":     reasons,
                "code_issues": code_issues,
            }),
        })

    results.sort(key=lambda x: x["bug_probability"], reverse=True)
    return results


# ── Explainability ────────────────────────────────────────────────────────────

def explain_prediction(file: dict) -> list:
    reasons = []

    if file.get("change_count", 0) > 5:
        reasons.append("High Change Frequency")
    if file.get("total_churn", 0) > 100:
        reasons.append("High Code Churn")
    if file.get("developer_count", 0) > 2:
        reasons.append("Multiple Developers Involved")
    if file.get("churn_ratio", 0) > 2:
        reasons.append("Unstable Code Changes")
    if file.get("avg_changes_per_dev", 0) > 3:
        reasons.append("High Developer Load")
    if file.get("stability_score", 1) < 0.2:
        reasons.append("Low File Stability")
    if file.get("bug_keyword_ratio", 0) > 0.3:
        reasons.append("Commit Messages Suggest Bug History")
    if file.get("burst_score", 0) > 0.5:
        reasons.append("Rapid Burst of Changes Detected")
    if file.get("change_rate_per_day", 0) > 1:
        reasons.append("Frequent Daily Modifications")

    return reasons or ["Low Risk — No Major Signals"]