# 🌾 Smart Crop Management Dashboard

> Real-time AI crop recommendation system using WSN sensor data.  
> Decision Tree ML model + Claude AI explanation engine.  
> **IEEE ICCCNT 2023 · IIT Delhi**

---

## Folder Structure

```
smart-crop/
├── backend/
│   ├── app.py                  ← FastAPI server
│   ├── generate_dataset.py     ← Synthetic WSN dataset generator
│   ├── train_model.py          ← Decision Tree training script
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── api.js
│   │   ├── constants.js
│   │   ├── components/
│   │   │   ├── UI.jsx
│   │   │   └── Sidebar.jsx
│   │   └── pages/
│   │       ├── DashboardPage.jsx
│   │       ├── PredictPage.jsx
│   │       ├── TrendsPage.jsx
│   │       ├── HistoryPage.jsx
│   │       └── MetricsPage.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── data/
│   └── crop_dataset.csv        ← 19,200 synthetic WSN samples (pre-generated)
│
├── models/
│   ├── crop_model.pkl          ← Trained Decision Tree (pre-trained)
│   ├── label_encoder.pkl
│   ├── scaler.pkl
│   └── metrics.json
│
└── README.md
```

---

## How to Run

### Terminal 1 — Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

> The dataset and trained model are already included.  
> You only need to run `generate_dataset.py` and `train_model.py` if you want to retrain from scratch.

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Features

| Page | Description |
|---|---|
| Dashboard | Overview, backend health, action reference |
| Predict | 7 sensor sliders → ML prediction + optional Claude AI explanation |
| Trends | Live/simulated WSN sensor time-series charts |
| History | Log of all predictions this session |
| Model Info | Feature importance, per-class precision/recall/F1 |

---

## ML Model

| Property | Value |
|---|---|
| Algorithm | Decision Tree Classifier |
| Test Accuracy | 98.96% |
| CV Accuracy | 99.33% ± 0.15% |
| Training samples | 19,200 (balanced) |
| Features | 7 WSN sensor inputs |
| Actions | 6 classes |

---

## Claude AI Integration (optional)

The Predict page has an optional **Anthropic API Key** field.  
When provided, Claude generates a 2-sentence diagnosis, 3 recommendations, yield forecast, and next check-in time — layered on top of the ML prediction.

Get a key at: https://console.anthropic.com

---

## Citation

```
A. Manoj-Parey et al., "Revolutionizing Crop Management: A Smart Approach
with WSN and AI Technology," 2023 14th International Conference on
Computing Communication and Networking Technologies (ICCCNT), IIT Delhi, 2023. IEEE.
```
