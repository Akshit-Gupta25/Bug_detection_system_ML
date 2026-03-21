from fastapi import FastAPI 
from app.data_collector import get_repo_data
from app.feature_engineering import generate_features
app = FastAPI()

@app.get("/")
def home():
 return {"message : ML is running "}


@app.get("/analyze")
def analyze_repo(repo_url: str):
    raw_data = get_repo_data(repo_url, max_commits=20)
    features = generate_features(raw_data)
    return {
        "total_files": len(features),
        "features_sample": features[:10]
    }
