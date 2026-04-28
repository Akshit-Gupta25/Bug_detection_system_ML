# def generate_ai_explanation(file):

#     reasons = file.get("reasons", [])
#     risk = file.get("risk_level", "LOW")
#     issues = file.get("code_issues", [])

#     explanation = f"This file is marked as {risk} risk because "

#     if reasons:
#         explanation += ", ".join(reasons).lower()
#     else:
#         explanation += "of general instability patterns"

#     if issues and issues[0]["message"] != "No major issues detected":
#         explanation += ". Additionally, code issues like "
#         explanation += ", ".join([i["message"] for i in issues[:2]])

#     explanation += ". Consider improving code quality, adding tests, and refactoring."

#     return explanation

def generate_ai_explanation(file):

    reasons = file.get("reasons", [])
    risk = file.get("risk_level", "LOW")
    issues = file.get("code_issues", [])

    explanation = f"This file is marked as {risk} risk because "

    if reasons:
        explanation += ", ".join(reasons).lower()
    else:
        explanation += "of general instability patterns"

    if issues and issues[0]["message"] != "No major issues detected":
        explanation += ". Additionally, code issues like "
        explanation += ", ".join([i["message"] for i in issues[:2]])

    explanation += ". Consider improving code quality, adding tests, and refactoring."

    return explanation