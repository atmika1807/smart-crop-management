"""
app.py  —  FastAPI backend
Run: uvicorn app:app --reload --port 8000
"""

import os, json
import joblib
import numpy as np
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI(title="Smart Crop API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = "../models"
FEATURES  = ["soil_moisture","temperature","humidity","nitrogen","phosphorus","potassium","ph"]

try:
    clf     = joblib.load(f"{MODEL_DIR}/crop_model.pkl")
    le      = joblib.load(f"{MODEL_DIR}/label_encoder.pkl")
    scaler  = joblib.load(f"{MODEL_DIR}/scaler.pkl")
    with open(f"{MODEL_DIR}/metrics.json") as f:
        metrics = json.load(f)
    print("ML artifacts loaded.")
except FileNotFoundError:
    clf = le = scaler = metrics = None
    print("WARNING: Run train_model.py first.")


# ── Schemas ──────────────────────────────────────────────

class SensorInput(BaseModel):
    crop: str
    soil_moisture: float = Field(..., ge=0, le=100)
    temperature:   float = Field(..., ge=-10, le=60)
    humidity:      float = Field(..., ge=0, le=100)
    nitrogen:      float = Field(..., ge=0, le=200)
    phosphorus:    float = Field(..., ge=0, le=150)
    potassium:     float = Field(..., ge=0, le=250)
    ph:            float = Field(..., ge=0, le=14)
    anthropic_api_key: Optional[str] = None


# ── Routes ────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Smart Crop API running"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "ml_model_loaded": clf is not None,
        "model_accuracy": metrics["test_accuracy"] if metrics else None,
    }


@app.get("/metrics")
def get_metrics():
    if not metrics:
        raise HTTPException(503, "Run train_model.py first")
    return metrics


@app.get("/crops")
def get_crops():
    return {"crops": ["Rice","Wheat","Maize","Cotton","Sugarcane","Soybean","Potato","Tomato"]}


@app.post("/predict")
async def predict(data: SensorInput):
    if clf is None:
        raise HTTPException(503, "ML model not loaded. Run train_model.py first.")

    X = np.array([[getattr(data, f) for f in FEATURES]])
    X_sc = scaler.transform(X)
    idx  = clf.predict(X_sc)[0]
    prob = clf.predict_proba(X_sc)[0]

    action     = le.inverse_transform([idx])[0]
    confidence = round(float(prob[idx]) * 100, 1)
    probs      = {le.inverse_transform([i])[0]: round(float(p)*100,1) for i,p in enumerate(prob)}

    ai_result = None
    if data.anthropic_api_key:
        try:
            ai_result = await get_ai_explanation(data, action, data.anthropic_api_key)
        except Exception as e:
            print(f"AI error: {e}")

    return {
        "ml": {"action": action, "confidence": confidence, "probabilities": probs},
        "ai": ai_result,
        "crop": data.crop,
        "sensors": {f: getattr(data, f) for f in FEATURES},
    }


async def get_ai_explanation(data, ml_action, api_key):
    prompt = f"""You are an expert agricultural AI. An ML model predicted "{ml_action}" for:
Crop: {data.crop}
Soil Moisture: {data.soil_moisture}%, Temperature: {data.temperature}°C, Humidity: {data.humidity}%
Nitrogen: {data.nitrogen} mg/kg, Phosphorus: {data.phosphorus} mg/kg, Potassium: {data.potassium} mg/kg
Soil pH: {data.ph}

Respond ONLY with JSON (no markdown):
{{"summary":"<2 sentences>","recommendations":["<r1>","<r2>","<r3>"],"alerts":[],"yield_forecast":"<Low|Medium|High>","next_check_in":"<e.g. 24 hours>"}}"""

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={"x-api-key": api_key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
            json={"model": "claude-sonnet-4-20250514", "max_tokens": 600,
                  "messages": [{"role": "user", "content": prompt}]},
        )
    raw = r.json()["content"][0]["text"].strip().replace("```json","").replace("```","")
    return json.loads(raw)
