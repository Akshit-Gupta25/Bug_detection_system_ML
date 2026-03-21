from collections import defaultdict

def generate_features(data):
    file_metrics = defaultdict(lambda : {
        "file_name" : "",
        "change_count" : 0,
        "total_lines_added" : 0,
        "total_lines_deleted" : 0,
        "devlopers" : set()
    })

    for entry in data :
        file = entry["file_name"]

        file_metrics[file]["file_name"] = file 
        file_metrics[file]["change_count"] += 1 
        file_metrics[file]["total_lines_added"] += entry["lines_added"]
        file_metrics[file]["total_lines_deleted"] += entry["lines_deleted"]
        file_metrics[file]["devlopers"].add(entry["author"])

    
    result = []

    for file , metrics in file_metrics.items():
        result.append({
            "file_name" : file,
            "change_count" : metrics["change_count"],
            "total_lines_added" : metrics["total_lines_added"],
            "total_lines_deleted" : metrics["total_lines_deleted"],
            "devloper_count" : len(metrics["devlopers"])
        })
    
    return result