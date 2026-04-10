import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from app.code_analyzer import analyze_code_content
from app.fix_suggestions import get_fix_suggestion
from app.utils import is_valid_code_file 


def train_model(features):
    df = pd.DataFrame(features)

    # 🔥 Synthetic Labels (temporary logic)
    df['bug_label'] = (
        (df['change_count'] > 5) |
        (df['total_lines_added'] + df['total_lines_deleted'] > 50) |
        (df['devloper_count'] > 2)
    ).astype(int)

    X = df[[
        "change_count",
        "total_lines_added",
        "total_lines_deleted",
        "devloper_count",
        "churn_ratio",
        "avg_changes_per_dev",
        "stability_score",
        "total_churn"
    ]]

    y = df["bug_label"]

    model = RandomForestClassifier()
    model.fit(X, y)

    return model


def predict_bug_risk(model, features):
    df = pd.DataFrame(features)

    X = df[[
        "change_count",
        "total_lines_added",
        "total_lines_deleted",
        "devloper_count",
        "churn_ratio",
        "avg_changes_per_dev",
        "stability_score",
        "total_churn"
    ]]

    # 🔥 Get probabilities (0 → 1)
    if len(model.classes_) == 1:
        predictions = [1.0 if model.classes_[0] == 1 else 0.0] * len(features)
    else:
        predictions = model.predict_proba(X)[:, 1]

    def get_risk_level(prob):
        if prob >= 0.7:
            return "HIGH"
        elif prob >= 0.3:
            return "MEDIUM"
        else:
            return "LOW"

    results = []

    for i, file in enumerate(features):
        prob = float(round(predictions[i], 4))

        source_code = file.get("source_code", "")
        if not isinstance(source_code, str):
            source_code = ""
        source_code = source_code[:1000]

        try:
            code_issues = analyze_code_content(source_code) if source_code else []
        except Exception as e:
            code_issues = [{
                "message": f"Error analyzing code: {str(e)}",
                "severity": "CRITICAL"
            }]

        if not code_issues:
            code_issues = [{
                "message": "No major issues detected",
                "severity": "INFO"
            }]

        fix_suggestions = []
        only_no_issue = (
            len(code_issues) == 1 and
            code_issues[0]["message"] == "No major issues detected"
        )

        if not only_no_issue:
            fix_suggestions = list(set([
                get_fix_suggestion(issue["message"]) for issue in code_issues
            ]))
        else:
            risk_level = get_risk_level(prob)
            if risk_level == "HIGH":
                fix_suggestions.extend([
                    "High risk due to frequent changes — consider refactoring.",
                    "Add unit tests to improve reliability.",
                    "Review code for hidden logical issues.",
                    "Ensure proper error handling across critical sections."
                ])
            elif risk_level == "MEDIUM":
                fix_suggestions.extend([
                    "Monitor this file for future changes.",
                    "Consider improving code structure.",
                    "Add test coverage if missing."
                ])
            else:
                fix_suggestions.append("Code looks stable. No immediate action required.")

        severity_count = {
            "critical": 0,
            "warning": 0,
            "info": 0
        }

        for issue in code_issues:
            if issue.get("severity") == "CRITICAL":
                severity_count["critical"] += 1
            elif issue.get("severity") == "WARNING":
                severity_count["warning"] += 1
            else:
                severity_count["info"] += 1

        results.append({
            "file_name": file["file_name"],
            "bug_probability": prob,
            "risk_level": get_risk_level(prob),
            "churn_ratio": round(file["churn_ratio"], 2),
            "avg_changes_per_dev": round(file["avg_changes_per_dev"], 2),
            "stability_score": round(file["stability_score"], 4),
            "total_churn": file["total_churn"],
            "source_code": source_code,
            "reasons": explain_predection(file),
            "code_issues": code_issues,
            "fix_suggestions": fix_suggestions,
            "severity_count": severity_count,
        })

    results = sorted(results, key=lambda x: x["bug_probability"], reverse=True)
    return results


def explain_predection(file):
    reasons = []

    if file["change_count"] > 5:
        reasons.append("High Change Frequency")

    if file["total_lines_added"] + file["total_lines_deleted"] > 50:
        reasons.append("High Code Churn")

    if file["devloper_count"] > 2:
        reasons.append("Multiple Developers Involved")

    if file["churn_ratio"] > 2:
        reasons.append("Unstable Code Changes")

    if file["avg_changes_per_dev"] > 3:
        reasons.append("High Developer Load")

    if file["stability_score"] < 0.2:
        reasons.append("Low File Stability")

    if not reasons:
        reasons.append("Low Risk Changes")

    return reasons
