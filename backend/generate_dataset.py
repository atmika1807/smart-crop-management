"""
generate_dataset.py
Generates a balanced synthetic WSN crop dataset (19,200 samples).
Run this first before train_model.py
"""

import numpy as np
import pandas as pd
import os

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

CROP_PROFILES = {
    "Rice":      {"sm": (60,80), "t": (22,32), "h": (70,90), "n": (60,100), "p": (30,60),  "k": (60,100),  "ph": (5.5,7.0)},
    "Wheat":     {"sm": (35,55), "t": (15,25), "h": (50,70), "n": (50,90),  "p": (25,55),  "k": (50,90),   "ph": (6.0,7.5)},
    "Maize":     {"sm": (45,65), "t": (20,35), "h": (55,75), "n": (70,120), "p": (35,65),  "k": (70,110),  "ph": (5.8,7.0)},
    "Cotton":    {"sm": (30,50), "t": (25,38), "h": (45,65), "n": (40,80),  "p": (20,50),  "k": (50,90),   "ph": (5.8,8.0)},
    "Sugarcane": {"sm": (55,75), "t": (25,38), "h": (65,85), "n": (80,130), "p": (30,60),  "k": (80,130),  "ph": (6.0,7.5)},
    "Soybean":   {"sm": (40,60), "t": (20,30), "h": (55,75), "n": (20,60),  "p": (30,60),  "k": (60,100),  "ph": (6.0,7.0)},
    "Potato":    {"sm": (50,70), "t": (15,25), "h": (60,80), "n": (60,100), "p": (40,70),  "k": (90,140),  "ph": (5.0,6.5)},
    "Tomato":    {"sm": (50,70), "t": (20,30), "h": (60,80), "n": (60,110), "p": (35,65),  "k": (70,120),  "ph": (6.0,7.0)},
}

ACTIONS = ["Optimal", "Irrigate", "Fertilize", "Harvest", "Apply Pesticide", "Monitor"]


def gen_scenario(crop, profile, scenario):
    p = profile
    sm_mid = (p["sm"][0] + p["sm"][1]) / 2
    t_mid  = (p["t"][0]  + p["t"][1])  / 2
    h_mid  = (p["h"][0]  + p["h"][1])  / 2
    n_mid  = (p["n"][0]  + p["n"][1])  / 2
    p_mid  = (p["p"][0]  + p["p"][1])  / 2
    k_mid  = (p["k"][0]  + p["k"][1])  / 2
    ph_mid = (p["ph"][0] + p["ph"][1]) / 2

    def jitter(v, spread=0.08):
        return round(float(v) * (1 + np.random.uniform(-spread, spread)), 2)

    if scenario == "Optimal":
        return dict(crop=crop,
            soil_moisture=jitter(sm_mid), temperature=jitter(t_mid),
            humidity=jitter(h_mid), nitrogen=jitter(n_mid),
            phosphorus=jitter(p_mid), potassium=jitter(k_mid),
            ph=jitter(ph_mid, 0.04), action="Optimal")

    elif scenario == "Irrigate":
        return dict(crop=crop,
            soil_moisture=round(np.random.uniform(8, p["sm"][0] - 8), 1),
            temperature=jitter(t_mid * 1.05),
            humidity=round(np.random.uniform(20, 45), 1),
            nitrogen=jitter(n_mid), phosphorus=jitter(p_mid), potassium=jitter(k_mid),
            ph=jitter(ph_mid, 0.04), action="Irrigate")

    elif scenario == "Fertilize":
        low_n = np.random.random() > 0.4
        return dict(crop=crop,
            soil_moisture=jitter(sm_mid), temperature=jitter(t_mid),
            humidity=jitter(h_mid),
            nitrogen=round(np.random.uniform(5, p["n"][0] - 12), 1) if low_n else jitter(n_mid),
            phosphorus=round(np.random.uniform(3, p["p"][0] - 8), 1) if not low_n else jitter(p_mid),
            potassium=jitter(k_mid),
            ph=jitter(ph_mid, 0.04), action="Fertilize")

    elif scenario == "Harvest":
        return dict(crop=crop,
            soil_moisture=round(np.random.uniform(p["sm"][1] + 8, p["sm"][1] + 25), 1),
            temperature=jitter(t_mid * 0.97),
            humidity=round(np.random.uniform(p["h"][1] + 5, p["h"][1] + 18), 1),
            nitrogen=jitter(n_mid * 1.15), phosphorus=jitter(p_mid * 1.12),
            potassium=jitter(k_mid * 1.1), ph=jitter(ph_mid, 0.04), action="Harvest")

    elif scenario == "Apply Pesticide":
        return dict(crop=crop,
            soil_moisture=jitter(sm_mid),
            temperature=round(np.random.uniform(p["t"][1] + 4, p["t"][1] + 14), 1),
            humidity=round(np.random.uniform(p["h"][1] + 4, 97), 1),
            nitrogen=jitter(n_mid), phosphorus=jitter(p_mid), potassium=jitter(k_mid),
            ph=jitter(ph_mid, 0.04), action="Apply Pesticide")

    else:  # Monitor
        return dict(crop=crop,
            soil_moisture=round(np.random.uniform(p["sm"][0] - 7, p["sm"][0] + 3), 1),
            temperature=jitter(t_mid * 1.03),
            humidity=jitter(h_mid * 0.97),
            nitrogen=jitter(n_mid * 0.88), phosphorus=jitter(p_mid * 0.9),
            potassium=jitter(k_mid * 0.92),
            ph=round(ph_mid + np.random.uniform(-0.4, 0.4), 2),
            action="Monitor")


def main():
    rows = []
    for crop, profile in CROP_PROFILES.items():
        for action in ACTIONS:
            for _ in range(400):
                rows.append(gen_scenario(crop, profile, action))

    df = pd.DataFrame(rows)
    df = df.sample(frac=1, random_state=RANDOM_SEED).reset_index(drop=True)

    os.makedirs("../data", exist_ok=True)
    out = "../data/crop_dataset.csv"
    df.to_csv(out, index=False)

    print(f"Dataset saved : {out}")
    print(f"Total samples : {len(df)}")
    print(f"\nAction distribution:\n{df['action'].value_counts()}")


if __name__ == "__main__":
    main()
