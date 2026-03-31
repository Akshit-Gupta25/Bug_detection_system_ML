def get_fix_suggestion(issue):
    suggestions = {
        "No error handling detected (try/catch missing)":
            "Wrap risky operations inside try/catch blocks to prevent crashes.",

        "Async function without proper error handling":
            "Use try/catch with async/await or add .catch() to handle errors properly.",

        "Use strict equality (=== instead of ==)":
            "Replace '==' with '===' to avoid unexpected type coercion issues.",

        "Avoid using 'var', use let/const":
            "Replace 'var' with 'let' or 'const' for better scoping.",

        "Unresolved TODO/FIXME in code":
            "Resolve or remove TODO comments before production deployment.",

        "Debug logs found (remove before production)":
            "Remove console.log/print statements to keep production clean.",

        "Possible hardcoded secret detected":
            "Move secrets to environment variables (.env) for security."
    }

    return suggestions.get(issue, "No suggestion available")
