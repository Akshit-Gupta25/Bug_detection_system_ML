import re

def analyze_code_content(file_content):
    issues = []

    if not isinstance(file_content, str):
        return issues

    def add_issue(message, severity):
        issues.append({
            "message": message,
            "severity": severity
        })

    # 🔴 Critical
    if re.search(r"(API_KEY|SECRET|TOKEN)\s*=\s*['\"]", file_content):
        add_issue("Possible hardcoded secret detected", "CRITICAL")

    # 🔴 Debug logs
    if re.search(r"console\.log|print\(", file_content):
        add_issue("Debug logs found (remove before production)", "WARNING")

    # 🔴 Loose equality
    if re.search(r"[^=!]==[^=]", file_content):
        add_issue("Use strict equality (=== instead of ==)", "WARNING")

    # 🔴 var usage
    if re.search(r"\bvar\b", file_content):
        add_issue("Avoid using 'var', use let/const", "INFO")

    # 🔴 TODO / FIXME
    if re.search(r"TODO|FIXME", file_content):
        add_issue("Unresolved TODO/FIXME in code", "WARNING")

    # 🔴 Large file
    if len(file_content) > 2000:
        add_issue("File is too large, consider splitting", "INFO")

    # 🔴 Missing error handling
    if not re.search(r"\btry\b", file_content) and not re.search(r"\b(catch|except)\b", file_content):
        add_issue("No error handling detected (try/catch missing)", "CRITICAL")

    # 🔴 Async without error handling
    if "async" in file_content and "try" not in file_content:
        add_issue("Async function without proper error handling", "WARNING")

    # 🔴 Too many exports
    if file_content.count("export") > 10:
        add_issue("Too many exports in a single file", "INFO")

    # 🔴 Complex functions
    if file_content.count("{") > 50:
        add_issue("File contains large/complex functions", "INFO")

    return issues
