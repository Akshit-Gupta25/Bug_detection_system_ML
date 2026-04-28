# def get_fix_suggestion(issue):
#     suggestions = {
#         "No error handling detected (try/catch missing)":
#             "Wrap risky operations inside try/catch blocks to prevent crashes.",

#         "Async function without proper error handling":
#             "Use try/catch with async/await or add .catch() to handle errors properly.",

#         "Use strict equality (=== instead of ==)":
#             "Replace '==' with '===' to avoid unexpected type coercion issues.",

#         "Avoid using 'var', use let/const":
#             "Replace 'var' with 'let' or 'const' for better scoping.",

#         "Unresolved TODO/FIXME in code":
#             "Resolve or remove TODO comments before production deployment.",

#         "Debug logs found (remove before production)":
#             "Remove console.log/print statements to keep production clean.",

#         "Possible hardcoded secret detected":
#             "Move secrets to environment variables (.env) for security."
#     }

#     return suggestions.get(issue, "No suggestion available")
"""
fix_suggestions.py — Enhanced fix suggestion mappings
Covers all categories from code_analyzer and url_analyzer
"""

def get_fix_suggestion(issue: str) -> str:
    suggestions = {
        # Security
        "Hardcoded secret detected": "Move secrets to environment variables (.env) for security.",
        "Possible hardcoded secret detected": "Move secrets to environment variables (.env) for security.",
        "Possible SQL injection via string concatenation": "Use parameterized queries or ORM to prevent SQL injection.",
        "eval() usage is dangerous": "Replace eval() with safer alternatives like json.parse() or ast.literal_eval().",
        "Prototype mutation": "Avoid mutating native prototypes — create utility functions instead.",
        "dangerouslySetInnerHTML used": "Sanitize HTML with DOMPurify before using dangerouslySetInnerHTML.",
        "Sensitive data stored in localStorage": "Use httpOnly cookies or sessionStorage for sensitive data.",
        "Hardcoded password detected": "Use environment variables and secret management tools.",
        "subprocess with shell=True": "Set shell=False and pass commands as lists to prevent injection.",
        "assert used for security check": "Replace assert with proper if/raise checks — asserts are disabled in production.",
        "Missing HSTS header": "Add Strict-Transport-Security header to force HTTPS.",
        "Missing Content-Security-Policy": "Implement CSP header to mitigate XSS attacks.",
        "Site is served over HTTP": "Enable HTTPS with a valid SSL certificate.",
        "Form submits to HTTP URL": "Change form action to HTTPS to encrypt credentials.",
        "Possible API key/token exposed in HTML": "Move API keys to backend environment variables.",
        "Server error / stack trace visible": "Disable debug mode and implement custom error pages.",
        "Debug mode indicator found": "Set DEBUG=False or disable development mode before deploying.",

        # Async / Error handling
        "No error handling detected (try/catch missing)": "Wrap risky operations inside try/catch blocks to prevent crashes.",
        "Async function without proper error handling": "Use try/catch with async/await or add .catch() to handle errors properly.",
        "Bare 'except:' clause": "Catch specific exceptions instead of bare except: to avoid masking errors.",
        "Empty catch block swallows exceptions": "Log or handle exceptions inside catch blocks — don't leave them empty.",
        "No try/except blocks": "Add try/except around I/O operations and external API calls.",

        # Maintainability
        "Use strict equality (=== instead of ==)": "Replace '==' with '===' to avoid unexpected type coercion issues.",
        "Avoid using 'var', use let/const": "Replace 'var' with 'let' or 'const' for better scoping.",
        "Unresolved TODO/FIXME in code": "Resolve or remove TODO comments before production deployment.",
        "Unresolved TODO/FIXME/HACK comment": "Complete pending work or create tickets to track it.",
        "Debug logs found (remove before production)": "Remove console.log/print statements to keep production clean.",
        "print() statements": "Replace print() with logging module for better control.",
        "Mutable default argument": "Use None as default and initialize inside the function.",
        "Multiple magic numbers found": "Extract magic numbers into named constants for clarity.",
        "Lines exceed 120 chars": "Refactor long lines into multiple lines for readability.",
        "Possible duplicated code blocks": "Extract common logic into reusable functions.",
        "File is very large": "Split file into smaller modules following single responsibility principle.",
        "File is large": "Review if file can be split into focused modules.",
        "Deprecated HTML tags found": "Replace deprecated tags with modern semantic HTML and CSS.",

        # Performance
        "Slow response time": "Optimize backend queries, enable caching, and use a CDN.",
        "Response time is": "Profile slow endpoints and optimize database queries.",
        "HTML payload is": "Enable compression, lazy load images, and minimize JavaScript bundles.",
        "No Cache-Control header": "Add Cache-Control headers to improve caching behavior.",
        "Response is not compressed": "Enable gzip or brotli compression on your server.",
        "render-blocking <script>": "Add async or defer attributes to non-critical scripts.",
        "images without loading='lazy'": "Add loading='lazy' to below-the-fold images.",
        "Google Fonts loaded without preconnect": "Add <link rel='preconnect'> to reduce DNS lookup time.",
        "String concatenation in loop": "Use StringBuilder in Java or array.join() in JavaScript.",
        "Deeply nested loops": "Optimize algorithm to reduce time complexity.",
        "XMLHttpRequest usage": "Replace XMLHttpRequest with modern fetch() API.",

        # React specific
        "List rendering without 'key' prop": "Add unique 'key' prop to each list item for efficient reconciliation.",
        "useEffect with no dependency array": "Add dependency array to useEffect to prevent infinite loops.",
        "Direct state mutation detected": "Always use setState() or state setter functions — never mutate directly.",
        "Deep prop drilling detected": "Use Context API, Redux, or Zustand to avoid prop drilling.",
        "No prop type definitions found": "Add PropTypes or migrate to TypeScript for type safety.",

        # SEO
        "Missing <title> tag": "Add a descriptive <title> tag for SEO and browser tabs.",
        "Empty <title> tag": "Populate the <title> tag with meaningful page-specific content.",
        "Missing meta description": "Add a meta description tag to improve search result snippets.",
        "Missing viewport meta tag": "Add <meta name='viewport' content='width=device-width, initial-scale=1'> for mobile.",
        "No canonical URL tag": "Add <link rel='canonical'> to prevent duplicate content issues.",
        "No Open Graph meta tags": "Add Open Graph tags for better social media sharing previews.",

        # Accessibility
        "image(s) missing alt attribute": "Add descriptive alt text to all images for screen readers.",
        "input(s) but only": "Wrap inputs in <label> tags or use aria-label for accessibility.",
        "Missing lang attribute on <html>": "Add lang='en' (or appropriate language) to <html> tag.",

        # UI
        "inline style attributes": "Move inline styles to CSS classes for better maintainability.",
        "Multiple <table> elements detected": "Ensure tables are used for tabular data, not layout.",

        # Complexity
        "High cyclomatic complexity": "Break down complex functions into smaller, testable units.",
        "Moderate cyclomatic complexity": "Consider refactoring to reduce decision points.",
        "Function": "Split large functions into smaller helper functions.",
        "has": "parameters — Reduce parameter count or use an options object.",
    }

    # Partial match for dynamic messages
    for key, suggestion in suggestions.items():
        if key.lower() in issue.lower():
            return suggestion

    return "Review code for best practices and refactor as needed."