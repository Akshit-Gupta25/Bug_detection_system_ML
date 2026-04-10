def calculate_repo_health(predictions):
    total_score = 0

    for file in predictions:

        # 🔴 Risk Level Weight
        if file.get("risk_level") == "HIGH":
            total_score += 30
        elif file.get("risk_level") == "MEDIUM":
            total_score += 15
        else:
            total_score += 5

        # 📊 Bug Probability Weight
        bug_prob = file.get("bug_probability", 0)
        total_score += bug_prob * 50

        # 🚨 Severity Weight
        for issue in file.get("code_issues", []):
            severity = issue.get("severity", "INFO")

            if severity == "CRITICAL":
                total_score += 20
            elif severity == "WARNING":
                total_score += 10
            else:
                total_score += 2

    # 📉 Normalize Score
    max_possible = len(predictions) * 100

    if max_possible == 0:
        return 100  # No files → healthy repo

    health_score = max(0, 100 - int((total_score / max_possible) * 100))

    return health_score
def get_health_label(score):
    if score > 70:
        return "Healthy"
    elif score > 40:
        return "Moderate"
    else:
        return "Critical"
