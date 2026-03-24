"""
train_model.py
Trains a Decision Tree classifier on the WSN crop dataset.
Run AFTER generate_dataset.py
"""

import os, json
import joblib
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score

RANDOM_SEED = 42
DATA_PATH   = "../data/crop_dataset.csv"
MODEL_DIR   = "../models"

FEATURES = ["soil_moisture","temperature","humidity","nitrogen","phosphorus","potassium","ph"]
TARGET   = "action"


def main():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}. Run generate_dataset.py first.")

    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df)} rows")

    X = df[FEATURES].values
    y = df[TARGET].values

    le     = LabelEncoder()
    y_enc  = le.fit_transform(y)
    scaler = StandardScaler()
    X_sc   = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_sc, y_enc, test_size=0.2, random_state=RANDOM_SEED, stratify=y_enc)

    clf = DecisionTreeClassifier(
        max_depth=12, min_samples_split=10,
        min_samples_leaf=5, random_state=RANDOM_SEED, class_weight="balanced")
    clf.fit(X_train, y_train)

    y_pred   = clf.predict(X_test)
    acc      = accuracy_score(y_test, y_pred)
    cv       = cross_val_score(clf, X_sc, y_enc, cv=5, scoring="accuracy")
    report   = classification_report(y_test, y_pred, target_names=le.classes_, output_dict=True)

    print(f"Test Accuracy : {acc:.4f}")
    print(f"CV Accuracy   : {cv.mean():.4f} ± {cv.std():.4f}")
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    metrics = {
        "test_accuracy": round(acc, 4),
        "cv_accuracy_mean": round(float(cv.mean()), 4),
        "cv_accuracy_std":  round(float(cv.std()), 4),
        "classification_report": report,
        "feature_importance": dict(zip(FEATURES, clf.feature_importances_.round(4).tolist())),
        "classes": le.classes_.tolist(),
    }

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(clf,    f"{MODEL_DIR}/crop_model.pkl")
    joblib.dump(le,     f"{MODEL_DIR}/label_encoder.pkl")
    joblib.dump(scaler, f"{MODEL_DIR}/scaler.pkl")
    with open(f"{MODEL_DIR}/metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\nSaved to {MODEL_DIR}/")


if __name__ == "__main__":
    main()
