"""
Healthcare AI - Disease Prediction Models
Diseases: Skin Disease, Diarrhea, Cholera
Uses mock/dummy data (replace with real Kaggle CSV later)
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score
import pickle
import os

os.makedirs("models", exist_ok=True)

np.random.seed(42)
N = 500

# ─────────────────────────────────────────
# 1. SKIN DISEASE  (mock features)
# ─────────────────────────────────────────
def train_skin_disease():
    print("\n[1/3] Training Skin Disease model...")
    df = pd.DataFrame({
        "redness":       np.random.randint(0, 10, N),
        "itching":       np.random.randint(0, 10, N),
        "scaling":       np.random.randint(0, 10, N),
        "lesion_size":   np.random.uniform(0.1, 5.0, N),
        "duration_days": np.random.randint(1, 90, N),
        "age":           np.random.randint(5, 80, N),
        # 0=Eczema, 1=Psoriasis, 2=Fungal, 3=Acne
        "label": np.random.randint(0, 4, N),
    })
    X = df.drop("label", axis=1)
    y = df["label"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test  = scaler.transform(X_test)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"   Accuracy: {acc:.2%}")

    pickle.dump(model,  open("models/skin_model.pkl",  "wb"))
    pickle.dump(scaler, open("models/skin_scaler.pkl", "wb"))
    print("   Saved: models/skin_model.pkl")


# ─────────────────────────────────────────
# 2. DIARRHEA  (symptom-based)
# ─────────────────────────────────────────
def train_diarrhea():
    print("\n[2/3] Training Diarrhea model...")
    df = pd.DataFrame({
        "loose_stool_freq":   np.random.randint(0, 15, N),
        "stomach_pain":       np.random.randint(0, 10, N),
        "nausea":             np.random.randint(0, 10, N),
        "vomiting":           np.random.randint(0,  2, N),
        "fever":              np.random.uniform(36, 40, N),
        "dehydration_level":  np.random.randint(0,  3, N),
        "blood_in_stool":     np.random.randint(0,  2, N),
        "age":                np.random.randint(1, 80, N),
        # 0=No diarrhea, 1=Mild, 2=Moderate, 3=Severe
        "label": np.random.randint(0, 4, N),
    })
    X = df.drop("label", axis=1)
    y = df["label"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test  = scaler.transform(X_test)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"   Accuracy: {acc:.2%}")

    pickle.dump(model,  open("models/diarrhea_model.pkl",  "wb"))
    pickle.dump(scaler, open("models/diarrhea_scaler.pkl", "wb"))
    print("   Saved: models/diarrhea_model.pkl")


# ─────────────────────────────────────────
# 3. CHOLERA  (symptom-based)
# ─────────────────────────────────────────
def train_cholera():
    print("\n[3/3] Training Cholera model...")
    df = pd.DataFrame({
        "watery_stool":       np.random.randint(0, 2, N),
        "rice_water_stool":   np.random.randint(0, 2, N),
        "vomiting":           np.random.randint(0, 2, N),
        "dehydration":        np.random.randint(0, 3, N),
        "muscle_cramps":      np.random.randint(0, 2, N),
        "rapid_heart_rate":   np.random.randint(60, 140, N),
        "low_bp":             np.random.randint(0,  2, N),
        "contact_with_case":  np.random.randint(0,  2, N),
        "unsafe_water":       np.random.randint(0,  2, N),
        "age":                np.random.randint(1, 80, N),
        # 0=No cholera, 1=Suspected, 2=Confirmed
        "label": np.random.randint(0, 3, N),
    })
    X = df.drop("label", axis=1)
    y = df["label"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test  = scaler.transform(X_test)

    model = LogisticRegression(max_iter=500, random_state=42)
    model.fit(X_train, y_train)
    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"   Accuracy: {acc:.2%}")

    pickle.dump(model,  open("models/cholera_model.pkl",  "wb"))
    pickle.dump(scaler, open("models/cholera_scaler.pkl", "wb"))
    print("   Saved: models/cholera_model.pkl")


if __name__ == "__main__":
    print("=" * 45)
    print("  Healthcare AI — Model Training")
    print("=" * 45)
    train_skin_disease()
    train_diarrhea()
    train_cholera()
    print("\n✅ All models trained and saved in models/")
