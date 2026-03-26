from fastapi import FastAPI 
from app.data_collector import get_repo_data
from app.feature_engineering import generate_features
from app.model import train_model , predict_bug_risk , is_valid_code_file
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
   CORSMiddleware,
   allow_origins =["*"],
   allow_credentials = True,
   allow_methods= ["*"],
   allow_headers = ["*"],
)
@app.get("/")
def home():
 return {"message": "ML is running"}


@app.get("/analyze")
def analyze_repo(repo_url: str):
    raw_data = get_repo_data(repo_url, max_commits=10)
    features = generate_features(raw_data)
    features = [f for f in features if is_valid_code_file(f["file_name"])]

    if not features:
        return {
            "total_files": 0,
            "predictions": [],
            "message": "No valid code files found"
        }

    model = train_model(features)
    predictions = predict_bug_risk(model, features)

    # 🔥 NEW: Calculate Repo Health Score
    total_files = len(predictions)

    high = len([f for f in predictions if f["risk_level"] == "HIGH"])
    medium = len([f for f in predictions if f["risk_level"] == "MEDIUM"])
    low = len([f for f in predictions if f["risk_level"] == "LOW"])

    total_issues = sum(len(f.get("code_issues", [])) for f in predictions)

    # 🎯 Score Logic (can improve later)
    score = 100 - (high * 10 + medium * 5 + total_issues * 2)
    score = max(score, 0)

    return {
        "total_files": total_files,
        "predictions": predictions,
        "repo_health_score": score,
        "total_issues": total_issues,
        "risk_summary": {
            "high": high,
            "medium": medium,
            "low": low
        }
    }

