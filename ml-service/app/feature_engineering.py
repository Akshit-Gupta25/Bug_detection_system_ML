from collections import defaultdict

def generate_features(data):
    file_metrics = defaultdict(lambda: {
        "file_name": "",
        "change_count": 0,
        "total_lines_added": 0,
        "total_lines_deleted": 0,
        "devlopers": set(),
        "source_code": ""
    })

    for entry in data:
        file = entry["file_name"]

        file_metrics[file]["file_name"] = file
        file_metrics[file]["change_count"] += 1
        file_metrics[file]["total_lines_added"] += entry["lines_added"]
        file_metrics[file]["total_lines_deleted"] += entry["lines_deleted"]
        file_metrics[file]["devlopers"].add(entry["author"])

        # ✅ KEEP FIRST NON-EMPTY SOURCE CODE
        if not file_metrics[file]["source_code"] and entry.get("source_code"):
            file_metrics[file]["source_code"] = entry["source_code"]

    result = []

    for file, metrics in file_metrics.items():
        change_count = metrics["change_count"]
        total_lines_added = metrics["total_lines_added"]
        total_lines_deleted = metrics["total_lines_deleted"]
        devloper_count = len(metrics["devlopers"])

        result.append({
            "file_name": file,
            "change_count": change_count,
            "total_lines_added": total_lines_added,
            "total_lines_deleted": total_lines_deleted,
            "devloper_count": devloper_count,

            "churn_ratio": total_lines_added / (total_lines_deleted + 1),
            "avg_changes_per_dev": change_count / (devloper_count + 1),
            "stability_score": 1 / (change_count + 1),
            "total_churn": total_lines_added + total_lines_deleted,

            # ✅ FIXED
            "source_code": metrics["source_code"]
        })

    return result
