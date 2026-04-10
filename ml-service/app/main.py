from fastapi import FastAPI
from app.data_collector import get_repo_data
from app.feature_engineering import generate_features
from app.model import train_model, predict_bug_risk
from app.utils import is_valid_code_file
from fastapi.middleware.cors import CORSMiddleware
from app.repo_health import calculate_repo_health

app = FastAPI()

# 🔓 Enable CORS (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "ML is running"}


@app.get("/analyze")
def analyze_repo(repo_url: str):

    print("🚀 API HIT")

    # 🔍 Step 1: Collect Data (Reduced commits for speed)
    raw_data = get_repo_data(repo_url, max_commits=10)
    print("✅ Data Collected:", len(raw_data))

    # ⚙️ Step 2: Feature Engineering
    features = generate_features(raw_data)
    print("✅ Features Generated:", len(features))

    # 🧹 Step 3: Filter valid code files
    features = [
        f for f in features
        if is_valid_code_file(f["file_name"])
    ]
    print("✅ After Filter:", len(features))

    # 🚫 Edge Case: No valid files
    if not features:
        return {
            "total_files": 0,
            "predictions": [],
            "repo_health_score": 100,
            "total_issues": 0,
            "risk_summary": {
                "high": 0,
                "medium": 0,
                "low": 0
            },
            "message": "No valid code files found"
        }

    # 🧠 Step 4: Train ML Model
    model = train_model(features)
    print("✅ Model Trained")

    # 📊 Step 5: Predict Bug Risk
    predictions = predict_bug_risk(model, features)
    print("✅ Predictions Done")

    # 📈 Step 6: Summary Metrics
    total_files = len(predictions)

    high = len([f for f in predictions if f["risk_level"] == "HIGH"])
    medium = len([f for f in predictions if f["risk_level"] == "MEDIUM"])
    low = len([f for f in predictions if f["risk_level"] == "LOW"])

    total_issues = sum(len(f.get("code_issues", [])) for f in predictions)

    # 🔥 Step 7: Repo Health Score
    repo_health_score = calculate_repo_health(predictions)
    print("🎯 Repo Health Score:", repo_health_score)

    print("🎉 ANALYSIS COMPLETE")

    # 📦 Final Response
    return {
        "total_files": total_files,
        "predictions": predictions,
        "repo_health_score": repo_health_score,
        "total_issues": total_issues,
        "risk_summary": {
            "high": high,
            "medium": medium,
            "low": low
        }
    }
