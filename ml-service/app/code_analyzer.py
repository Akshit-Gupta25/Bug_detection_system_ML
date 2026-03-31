import re

def analyze_code_content(file_content):
    issues = []

    # ✅ ADD THIS LINE
    if not isinstance(file_content, str):
        return issues

    # 🔴 Debug logs
    if re.search(r"console\.log|print\(", file_content):
        issues.append("Debug logs found (remove before production)")

    # 🔴 Loose equality
    if re.search(r"[^=!]==[^=]", file_content):
        issues.append("Use strict equality (=== instead of ==)")

    # 🔴 var usage
    if re.search(r"\bvar\b", file_content):
        issues.append("Avoid using 'var', use let/const")

    # 🔴 TODO / FIXME
    if re.search(r"TODO|FIXME", file_content):
        issues.append("Unresolved TODO/FIXME in code")

    # 🔴 Large file
    if len(file_content) > 2000:
        issues.append("File is too large, consider splitting")

    # 🔴 Missing error handling
    if "try" not in file_content and "catch" not in file_content:
        issues.append("No error handling detected (try/catch missing)")

    # 🔴 Async without error handling
    if "async" in file_content and "try" not in file_content:
        issues.append("Async function without proper error handling")

    # 🔴 Too many exports
    if file_content.count("export") > 10:
        issues.append("Too many exports in a single file")

    # 🔴 Possible hardcoded secrets
    if re.search(r"(API_KEY|SECRET|TOKEN)\s*=\s*['\"]", file_content):
        issues.append("Possible hardcoded secret detected")

    # 🔴 Long functions (basic heuristic)
    if file_content.count("{") > 50:
        issues.append("File contains large/complex functions")
    

    return issues
