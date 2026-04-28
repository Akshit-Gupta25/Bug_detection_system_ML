# import re

# def analyze_code_content(file_content):
#     issues = []

#     if not isinstance(file_content, str):
#         return issues

#     def add_issue(message, severity):
#         issues.append({
#             "message": message,
#             "severity": severity
#         })

#     # 🔴 Critical
#     if re.search(r"(API_KEY|SECRET|TOKEN)\s*=\s*['\"]", file_content):
#         add_issue("Possible hardcoded secret detected", "CRITICAL")

#     # 🔴 Debug logs
#     if re.search(r"console\.log|print\(", file_content):
#         add_issue("Debug logs found (remove before production)", "WARNING")

#     # 🔴 Loose equality
#     if re.search(r"[^=!]==[^=]", file_content):
#         add_issue("Use strict equality (=== instead of ==)", "WARNING")

#     # 🔴 var usage
#     if re.search(r"\bvar\b", file_content):
#         add_issue("Avoid using 'var', use let/const", "INFO")

#     # 🔴 TODO / FIXME
#     if re.search(r"TODO|FIXME", file_content):
#         add_issue("Unresolved TODO/FIXME in code", "WARNING")

#     # 🔴 Large file
#     if len(file_content) > 2000:
#         add_issue("File is too large, consider splitting", "INFO")

#     # 🔴 Missing error handling
#     if not re.search(r"\btry\b", file_content) and not re.search(r"\b(catch|except)\b", file_content):
#         add_issue("No error handling detected (try/catch missing)", "CRITICAL")

#     # 🔴 Async without error handling
#     if "async" in file_content and "try" not in file_content:
#         add_issue("Async function without proper error handling", "WARNING")

#     # 🔴 Too many exports
#     if file_content.count("export") > 10:
#         add_issue("Too many exports in a single file", "INFO")

#     # 🔴 Complex functions
#     if file_content.count("{") > 50:
#         add_issue("File contains large/complex functions", "INFO")

#     return issues
"""
code_analyzer.py — Deep Static Analysis Engine
Handles: pasted code snippets, uploaded files (.py .js .ts .jsx .tsx .java .cpp .c)
Detects: security, performance, maintainability, async issues, complexity, secrets
"""

import re
import ast
import math


# ─────────────────────────────────────────────────────────────────────────────
#  Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _add(issues, message, severity, category="general", line=None):
    issues.append({
        "message":  message,
        "severity": severity,       # CRITICAL | WARNING | INFO
        "category": category,       # security | performance | maintainability | async | complexity
        "line":     line,
    })


def _detect_language(content: str) -> str:
    """Heuristic language detection from content patterns."""
    if re.search(r"^\s*(import|from)\s+\w", content, re.MULTILINE):
        if re.search(r"def |class |print\(|#", content):
            return "python"
    if re.search(r"(const|let|var|=>|function|async|await|console\.|===)", content):
        if re.search(r"(import React|jsx|tsx|<[A-Z])", content):
            return "jsx"
        return "javascript"
    if re.search(r"(public class|void main|System\.out|@Override)", content):
        return "java"
    if re.search(r"(#include|std::|cout|cin|->)", content):
        return "cpp"
    return "unknown"


# ─────────────────────────────────────────────────────────────────────────────
#  Universal checks (apply to all languages)
# ─────────────────────────────────────────────────────────────────────────────

def _check_universal(content: str, issues: list):
    lines = content.splitlines()
    total_lines = len(lines)

    # ── Security ──────────────────────────────────────────────────────────────
    secret_pat = re.compile(
        r'(API_KEY|SECRET|TOKEN|PASSWORD|PRIVATE_KEY|ACCESS_KEY)\s*=\s*["\'].+["\']',
        re.IGNORECASE
    )
    for i, line in enumerate(lines, 1):
        if secret_pat.search(line):
            _add(issues, f"Hardcoded secret detected (line {i})", "CRITICAL", "security", i)

    # SQL injection risk
    if re.search(r'(SELECT|INSERT|UPDATE|DELETE).*["\'].*\+.*["\']', content, re.IGNORECASE):
        _add(issues, "Possible SQL injection via string concatenation", "CRITICAL", "security")

    # Eval usage
    if re.search(r'\beval\s*\(', content):
        _add(issues, "eval() usage is dangerous — potential code injection", "CRITICAL", "security")

    # ── Maintainability ───────────────────────────────────────────────────────
    if re.search(r'\b(TODO|FIXME|HACK|XXX|BUG)\b', content):
        _add(issues, "Unresolved TODO/FIXME/HACK comment found", "WARNING", "maintainability")

    if total_lines > 300:
        _add(issues, f"File is very large ({total_lines} lines) — consider splitting", "INFO", "maintainability")
    elif total_lines > 150:
        _add(issues, f"File is large ({total_lines} lines) — review if single responsibility applies", "INFO", "maintainability")

    # Magic numbers
    magic = re.findall(r'(?<!["\'\w])\b(?!0\b|1\b)\d{2,}\b(?!["\'\w])', content)
    if len(magic) > 5:
        _add(issues, f"Multiple magic numbers found ({len(magic)}) — use named constants", "INFO", "maintainability")

    # Long lines
    long_lines = [i+1 for i, l in enumerate(lines) if len(l) > 120]
    if len(long_lines) > 3:
        _add(issues, f"Lines exceed 120 chars at lines: {long_lines[:5]} — hurts readability", "INFO", "maintainability")

    # Duplicate code blocks (simple heuristic: same 4-line block appears twice)
    if total_lines > 40:
        chunks = ["\n".join(lines[i:i+4]) for i in range(0, total_lines-4, 4)]
        seen_chunks = set()
        dup = False
        for c in chunks:
            stripped = c.strip()
            if len(stripped) > 60:
                if stripped in seen_chunks:
                    dup = True
                    break
                seen_chunks.add(stripped)
        if dup:
            _add(issues, "Possible duplicated code blocks detected — consider refactoring", "WARNING", "maintainability")


# ─────────────────────────────────────────────────────────────────────────────
#  JavaScript / TypeScript / JSX checks
# ─────────────────────────────────────────────────────────────────────────────

def _check_js(content: str, issues: list):
    lines = content.splitlines()

    # var usage
    if re.search(r'\bvar\b', content):
        _add(issues, "Avoid 'var' — use 'let' or 'const' for proper scoping", "WARNING", "maintainability")

    # Loose equality
    loose = [(i+1, l.strip()) for i, l in enumerate(lines) if re.search(r'[^=!]==[^=]', l)]
    if loose:
        _add(issues, f"Loose equality '==' found at {len(loose)} location(s) — use '===' instead", "WARNING", "maintainability")

    # Console.log in production code
    console_lines = [i+1 for i, l in enumerate(lines) if re.search(r'console\.(log|warn|error|debug)\s*\(', l)]
    if console_lines:
        _add(issues, f"console.* calls at lines {console_lines[:5]} — remove before production", "WARNING", "maintainability")

    # Async without try/catch
    has_async = bool(re.search(r'\basync\b', content))
    has_try   = bool(re.search(r'\btry\s*\{', content))
    has_catch = bool(re.search(r'\.catch\s*\(', content))
    if has_async and not has_try and not has_catch:
        _add(issues, "async function(s) detected with no try/catch or .catch() — unhandled rejections", "CRITICAL", "async")

    # Missing error handling entirely
    if not has_try and not has_catch:
        _add(issues, "No error handling found (try/catch or .catch) — crashes possible", "CRITICAL", "async")

    # Too many exports
    export_count = content.count("export")
    if export_count > 10:
        _add(issues, f"{export_count} exports in one file — consider splitting into modules", "INFO", "maintainability")

    # React specific
    if re.search(r'(import React|jsx|useState|useEffect)', content):
        _check_react(content, issues, lines)

    # Performance: nested loops
    nesting = len(re.findall(r'\bfor\s*\(', content))
    if nesting >= 3:
        _add(issues, f"{nesting} for-loops detected — check for O(n³) complexity", "WARNING", "performance")

    # Synchronous XHR
    if re.search(r'XMLHttpRequest|\.open\s*\(\s*["\']GET', content):
        _add(issues, "XMLHttpRequest usage — prefer fetch() or axios for modern async patterns", "INFO", "performance")

    # Prototype mutation
    if re.search(r'(Object|Array|String)\.prototype\.\w+\s*=', content):
        _add(issues, "Native prototype mutation — can break third-party code", "CRITICAL", "security")

    # Dangerously set inner HTML
    if re.search(r'dangerouslySetInnerHTML', content):
        _add(issues, "dangerouslySetInnerHTML used — XSS risk if content is not sanitised", "CRITICAL", "security")

    # localStorage with sensitive keys
    if re.search(r'localStorage\.setItem\s*\(\s*["\'].*(password|secret|token)', content, re.IGNORECASE):
        _add(issues, "Sensitive data stored in localStorage — use httpOnly cookies instead", "CRITICAL", "security")


def _check_react(content: str, issues: list, lines: list):
    # Missing key prop in lists
    if re.search(r'\.map\s*\(.*=>\s*(<[A-Za-z])', content) and 'key=' not in content:
        _add(issues, "List rendering without 'key' prop — causes React reconciliation issues", "WARNING", "performance")

    # useEffect with no deps
    no_dep = re.findall(r'useEffect\s*\(\s*\(\s*\)\s*=>', content)
    if no_dep:
        _add(issues, f"useEffect with no dependency array ({len(no_dep)}x) — may cause infinite loops", "WARNING", "performance")

    # Direct state mutation
    if re.search(r'this\.state\.\w+\s*=', content):
        _add(issues, "Direct state mutation detected — always use setState()", "CRITICAL", "performance")

    # Prop drilling (more than 3 levels of prop passing heuristic)
    prop_chains = re.findall(r'props\.\w+\.\w+\.\w+', content)
    if prop_chains:
        _add(issues, "Deep prop drilling detected — consider Context API or state management", "INFO", "maintainability")

    # Missing PropTypes or TypeScript types
    if not re.search(r'(PropTypes|: React\.FC|interface Props)', content):
        _add(issues, "No prop type definitions found — add PropTypes or TypeScript interfaces", "INFO", "maintainability")


# ─────────────────────────────────────────────────────────────────────────────
#  Python checks
# ─────────────────────────────────────────────────────────────────────────────

def _check_python(content: str, issues: list):
    lines = content.splitlines()

    # print() in production code
    print_lines = [i+1 for i, l in enumerate(lines) if re.search(r'\bprint\s*\(', l)]
    if print_lines:
        _add(issues, f"print() statements at lines {print_lines[:5]} — use logging module instead", "WARNING", "maintainability")

    # Bare except
    if re.search(r'except\s*:', content):
        _add(issues, "Bare 'except:' clause — catches all exceptions including SystemExit", "WARNING", "async")

    # Missing error handling
    has_try = bool(re.search(r'\btry\s*:', content))
    if not has_try:
        _add(issues, "No try/except blocks — unhandled exceptions will crash the program", "CRITICAL", "async")

    # Mutable default arguments
    if re.search(r'def \w+\(.*=\s*(\[\]|\{\})', content):
        _add(issues, "Mutable default argument ([] or {}) — shared across all calls, causes subtle bugs", "CRITICAL", "maintainability")

    # Global variables
    global_count = len(re.findall(r'^\s*global\s+\w+', content, re.MULTILINE))
    if global_count > 2:
        _add(issues, f"{global_count} global variable declarations — prefer function parameters", "WARNING", "maintainability")

    # Long functions via AST
    try:
        tree = ast.parse(content)
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                func_lines = (node.end_lineno or 0) - node.lineno
                if func_lines > 50:
                    _add(issues, f"Function '{node.name}' is {func_lines} lines long — consider splitting", "WARNING", "complexity", node.lineno)
                # Too many arguments
                args = node.args
                total_args = len(args.args) + len(args.kwonlyargs)
                if total_args > 6:
                    _add(issues, f"Function '{node.name}' has {total_args} parameters — hard to test", "INFO", "complexity", node.lineno)
    except SyntaxError:
        pass

    # Hardcoded credentials
    if re.search(r'(password|passwd|pwd)\s*=\s*["\'].+["\']', content, re.IGNORECASE):
        _add(issues, "Hardcoded password string detected", "CRITICAL", "security")

    # SQL concatenation
    if re.search(r'(execute|query)\s*\(\s*[f"\'].*\+', content, re.IGNORECASE):
        _add(issues, "SQL query built with string concatenation — SQL injection risk", "CRITICAL", "security")

    # Subprocess with shell=True
    if re.search(r'subprocess\.(run|call|Popen).*shell\s*=\s*True', content):
        _add(issues, "subprocess with shell=True — command injection risk", "CRITICAL", "security")

    # assert used for security checks
    if re.search(r'\bassert\b.*auth|permission|login', content, re.IGNORECASE):
        _add(issues, "assert used for security check — disabled in optimised Python (-O flag)", "CRITICAL", "security")

    # Performance: nested loops
    indent_for = [(i, len(l) - len(l.lstrip())) for i, l in enumerate(lines) if re.match(r'\s*for\s', l)]
    deep = [(i, ind) for i, ind in indent_for if ind > 8]
    if len(deep) >= 2:
        _add(issues, "Deeply nested loops detected — check algorithm complexity", "WARNING", "performance")


# ─────────────────────────────────────────────────────────────────────────────
#  Java checks
# ─────────────────────────────────────────────────────────────────────────────

def _check_java(content: str, issues: list):
    if not re.search(r'\btry\s*\{', content):
        _add(issues, "No try/catch blocks — exceptions will propagate uncaught", "CRITICAL", "async")
    if re.search(r'catch\s*\(\s*Exception\s+\w+\s*\)\s*\{\s*\}', content):
        _add(issues, "Empty catch block swallows exceptions silently", "CRITICAL", "async")
    if re.search(r'System\.out\.print', content):
        _add(issues, "System.out.print found — use a proper logger (SLF4J/Log4j)", "WARNING", "maintainability")
    if re.search(r'(String)\s+\w+\s*=\s*\w+\s*\+\s*\w+', content):
        _add(issues, "String concatenation in loop — use StringBuilder for performance", "WARNING", "performance")
    if re.search(r'password\s*=\s*"', content, re.IGNORECASE):
        _add(issues, "Hardcoded password detected", "CRITICAL", "security")


# ─────────────────────────────────────────────────────────────────────────────
#  Complexity score
# ─────────────────────────────────────────────────────────────────────────────

def _cyclomatic_complexity(content: str) -> int:
    """Rough cyclomatic complexity: 1 + decision points."""
    keywords = len(re.findall(
        r'\b(if|elif|else|for|while|case|catch|except|&&|\|\||\?)\b', content
    ))
    return 1 + keywords


# ─────────────────────────────────────────────────────────────────────────────
#  Public API
# ─────────────────────────────────────────────────────────────────────────────

def analyze_code_content(file_content: str, file_name: str = "") -> list:
    """
    Analyse source code and return a list of issue dicts.

    Each dict: { message, severity, category, line }
    severity: CRITICAL | WARNING | INFO
    category: security | performance | maintainability | async | complexity
    """
    if not isinstance(file_content, str) or not file_content.strip():
        return []

    issues = []

    lang = _detect_language(file_content)
    if file_name:
        if file_name.endswith((".py",)):             lang = "python"
        elif file_name.endswith((".js", ".ts", ".jsx", ".tsx")):  lang = "javascript"
        elif file_name.endswith(".java"):             lang = "java"
        elif file_name.endswith((".cpp", ".c")):      lang = "cpp"

    # Universal checks first
    _check_universal(file_content, issues)

    # Language-specific
    if lang in ("javascript", "jsx"):
        _check_js(file_content, issues)
    elif lang == "python":
        _check_python(file_content, issues)
    elif lang == "java":
        _check_java(file_content, issues)

    # Complexity check (universal)
    cc = _cyclomatic_complexity(file_content)
    if cc > 30:
        _add(issues, f"High cyclomatic complexity ({cc}) — code is hard to test and maintain", "WARNING", "complexity")
    elif cc > 15:
        _add(issues, f"Moderate cyclomatic complexity ({cc}) — consider breaking into smaller units", "INFO", "complexity")

    # Deduplicate by message
    seen_msgs = set()
    unique = []
    for issue in issues:
        if issue["message"] not in seen_msgs:
            seen_msgs.add(issue["message"])
            unique.append(issue)

    return unique