# 🌾 Smart Crop Management Dashboard

<div align="center">

![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![scikit-learn](https://img.shields.io/badge/scikit--learn-Decision%20Tree-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)
![IEEE](https://img.shields.io/badge/Published-IEEE%20ICCCNT%202023-00629B?style=flat-square&logo=ieee&logoColor=white)

**AI-powered real-time crop recommendation system using Wireless Sensor Network (WSN) data.**
Decision Tree ML model + Claude AI explanation engine, served via FastAPI + React dashboard.

[Features](#-features) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Docs](#-api-reference) · [Publication](#-publication)

</div>

---

## ✨ Features

- 📡 **Real-time WSN sensor simulation** — soil moisture, temperature, humidity, N-P-K nutrients, pH
- 🤖 **Decision Tree ML model** — 99% accuracy across 6 action classes, trained on 19,200 samples
- 🧠 **Claude AI explanation layer** — agronomist-level reasoning on top of ML predictions
- 📊 **Live sensor trend charts** — toggleable real-time feed with bar + line charts
- 🗂️ **Prediction history log** — session-level tracking of every analysis run
- 🌿 **8 crop profiles** — Rice, Wheat, Maize, Cotton, Sugarcane, Soybean, Potato, Tomato
- ⚡ **FastAPI backend** — REST API with `/predict`, `/metrics`, `/health` endpoints

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   React Frontend (Vite)           FastAPI Backend           │
│   ─────────────────               ───────────────           │
│                                                             │
│   Dashboard      ──── /api/health   ──►  Health check       │
│   Predict Page   ──── /api/predict  ──►  Decision Tree      │
│   Trends Page         (POST)             + Claude AI        │
│   History Page                                              │
│   Model Info     ──── /api/metrics  ──►  metrics.json       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Sensor Inputs (WSN)**
`Soil Moisture` · `Temperature` · `Humidity` · `Nitrogen` · `Phosphorus` · `Potassium` · `Soil pH`

**Predicted Actions**
`Irrigate` · `Fertilize` · `Harvest` · `Monitor` · `Apply Pesticide` · `Optimal`

---

## 📁 Project Structure

```
smart-crop-final/
│
├── backend/
│   ├── app.py                  # FastAPI server — /predict, /metrics, /health
│   ├── generate_dataset.py     # Synthetic WSN dataset generator (19,200 samples)
│   ├── train_model.py          # Decision Tree training + evaluation
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Root router + shared history state
│   │   ├── main.jsx            # React entry point
│   │   ├── index.css           # Global dark-theme styles
│   │   ├── api.js              # API client (fetch wrapper)
│   │   ├── constants.js        # Crops, sensor config, action metadata
│   │   ├── components/
│   │   │   ├── UI.jsx          # Reusable: badges, sliders, metric cards
│   │   │   └── Sidebar.jsx     # Navigation sidebar
│   │   └── pages/
│   │       ├── DashboardPage.jsx
│   │       ├── PredictPage.jsx
│   │       ├── TrendsPage.jsx
│   │       ├── HistoryPage.jsx
│   │       └── MetricsPage.jsx
│   ├── package.json
│   ├── vite.config.js          # Dev proxy → backend :8000
│   └── index.html
│
├── data/
│   └── crop_dataset.csv        # 19,200 synthetic WSN samples (pre-generated)
│
├── models/
│   ├── crop_model.pkl          # Trained Decision Tree classifier
│   ├── label_encoder.pkl       # Action label encoder
│   ├── scaler.pkl              # StandardScaler for features
│   └── metrics.json            # Accuracy, F1-score, feature importance
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm

### 1 · Clone the repository

```bash
git clone https://github.com/atmika1807/smart-crop-management.git
cd smart-crop-management
```

### 2 · Run the Backend

```bash
cd backend
pip install -r requirements.txt
```

> The dataset and trained model are already included. Skip to `uvicorn` unless you want to retrain from scratch.

```bash
# Optional: regenerate dataset and retrain model
python generate_dataset.py
python train_model.py

# Start the API server
python -m uvicorn app:app --reload --port 8000
```

Backend live at `http://localhost:8000`
Auto-docs at `http://localhost:8000/docs`

### 3 · Run the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

App live at **http://localhost:5173** 🎉

---

## 🤖 ML Model

| Property | Value |
|---|---|
| Algorithm | Decision Tree Classifier (scikit-learn) |
| Test Accuracy | **99%** |
| CV Accuracy | **99.3% ± 0.15%** |
| Training Samples | 19,200 (balanced — 6 classes × 8 crops × 400) |
| Features | 7 WSN sensor inputs |
| Output Classes | 6 action labels |

### Dataset Generation

Synthetic WSN data is generated with crop-specific sensor profiles. Six scenarios per crop:

| Scenario | Trigger Condition |
|---|---|
| **Optimal** | All sensors within ideal range |
| **Irrigate** | Soil moisture critically low, humidity low |
| **Fertilize** | Nitrogen or phosphorus below threshold |
| **Harvest** | Moisture and humidity above saturation |
| **Apply Pesticide** | Temperature and humidity spiked abnormally |
| **Monitor** | Marginal conditions, slight deviation from ideal |

---

## 📡 API Reference

```
GET  /health     Backend + model status
GET  /metrics    Accuracy, F1, feature importance
GET  /crops      Supported crop list
POST /predict    Run ML prediction + optional AI explanation
```

### POST /predict — Request

```json
{
  "crop": "Rice",
  "soil_moisture": 45.0,
  "temperature": 28.0,
  "humidity": 65.0,
  "nitrogen": 60.0,
  "phosphorus": 40.0,
  "potassium": 80.0,
  "ph": 6.5,
  "anthropic_api_key": "sk-ant-..."
}
```

### POST /predict — Response

```json
{
  "ml": {
    "action": "Irrigate",
    "confidence": 97.2,
    "probabilities": {
      "Irrigate": 97.2,
      "Monitor": 1.8,
      "Optimal": 0.7
    }
  },
  "ai": {
    "summary": "Soil moisture at 45% is significantly below the optimal range for Rice (60-80%).",
    "recommendations": [
      "Irrigate immediately with 30-40mm of water",
      "Monitor soil moisture every 6 hours until levels stabilize above 60%",
      "Consider mulching to reduce evaporation during recovery"
    ],
    "alerts": ["Risk of yield loss if irrigation is delayed beyond 12 hours"],
    "yield_forecast": "Medium",
    "next_check_in": "6 hours"
  },
  "crop": "Rice",
  "sensors": {}
}
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Recharts, Framer Motion |
| Backend | FastAPI, Uvicorn, Pydantic |
| ML | scikit-learn (Decision Tree), pandas, numpy, joblib |
| AI | Anthropic Claude API (claude-sonnet) |
| HTTP | httpx (async) |

---

## 📄 Publication

This project was developed as the functional prototype validating the research paper:

> **"Revolutionizing Crop Management: A Smart Approach with WSN and AI Technology"**
> Published at the **2023 14th International Conference on Computing Communication and Networking Technologies (ICCCNT)**
> Venue: IIT Delhi · Publisher: IEEE

The prototype demonstrates real-time AI-driven decision-making using simulated WSN sensor data, supporting the paper's proposed framework for precision agriculture.

---

## 👩‍💻 Author

**Atmika Manoj Parey**
M.S. Business Analytics · UMass Amherst
[Portfolio](https://atmika-manoj-parey.vercel.app) · [GitHub](https://github.com/atmika1807)
