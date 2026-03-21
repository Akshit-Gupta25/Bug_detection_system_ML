import pandas as pd 
from sklearn.ensemble import RandomForestClassifier

def train_model(features):
    df = pd.DataFrame(features)

    # Create Synthetic Lables (Basically Temporary Logic )
    df['bug_label'] = (
        (df['change_count'] > 5) |
        (df['total_lines_added'] + df['total_lines_deleted'] > 50 ) |
        (df['devloper_count'] > 2)
    ).astype(int)

    X = df[["change_count" , "total_lines_added" , "total_lines_deleted" , "devloper_count" , "churn_ratio" , "avg_changes_per_dev" , "stability_score" , "total_churn"]]
    y = df["bug_label"]

    model = RandomForestClassifier()
    model.fit(X , y)

    return model 

def predict_bug_risk(model , features):
    import pandas as pd 

    df = pd.DataFrame(features)
    X = df[["change_count" , "total_lines_added" , "total_lines_deleted" , "devloper_count", "churn_ratio" , "avg_changes_per_dev" , "stability_score" , "total_churn"]]

    if len(model.classes_) == 1 : 
        predictions = [100 if model.classes_[0] == 1 else 0] * len(features)
    
    else : 
        
        predictions = model.predict_proba(X)[: , 1] * 100 
    def get_risk_level(prob):
        if prob >= 70 :
            return "HIGH"
        elif prob >= 30:
            return "MEDIUM"
        else:
            return "LOW"

    results = []
    for i,file in enumerate(features):
        prob = round(predictions[i] , 2)
        results.append({
            "file_name" : file["file_name"],
            "bug_probability" : f"{round(predictions[i] , 2 )}%",
            "risk_level" : get_risk_level(prob),
            "churn_ratio" : round(file["churn_ratio"], 2),
            "avg_changes_per_dev" : round(file["avg_changes_per_dev"], 2),
            "stability_score" : round(file["stability_score"], 4),
            "total_churn" : file["total_churn"],
            "reasons" : explain_predection(file) if prob > 0 else ["Clean Code"]
        })
#---------------------------------------------------------------------------------------------
        # results = sorted(results , key = lambda x: x["bug_probability"] , reverse=True)
#---------------------------------------- To get MOST Risky Files on TOP----------------------
    return results


def explain_predection(file):
    reasons = [] 

    if file["change_count"]  > 5:
        reasons.append("High Change Frequency")
    
    if file["total_lines_added"] + file["total_lines_deleted"] > 50: 
        reasons.append("High Code Churn")
    
    if file["devloper_count"] > 2:
        reasons.append("Multiple Devlopers Involved")
    
    if file["churn_ratio"] > 2:
        reasons.append("Unstable Code Changes")

    if file["avg_changes_per_dev"] > 3:
        reasons.append("High Devloper Load")

    if file["stability_score"] < 0.2:
        reasons.append("Low File Stability")       

    if not reasons:
        reasons.append("Low Risk Changes")

    return reasons



