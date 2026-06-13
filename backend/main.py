"""
Healthcare AI — FastAPI Backend
Run: uvicorn main:app --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle, os, numpy as np
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "../database"))
try:
    from db import (
        create_patient, get_all_patients, get_patient_by_id,
        save_prediction, get_predictions_for_patient,
        get_all_predictions, get_disease_by_name,
        create_user, get_user_by_email
    )
    DB_AVAILABLE = True
except Exception as e:
    print(f"DB connection failed: {e}")
    DB_AVAILABLE = False

app = FastAPI(title="Healthcare AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load models ──────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../ml_model/models")

def load(name):
    path = os.path.join(MODEL_DIR, name)
    if os.path.exists(path):
        return pickle.load(open(path, "rb"))
    return None

skin_model     = load("skin_model.pkl");     skin_scaler     = load("skin_scaler.pkl")
diarrhea_model = load("diarrhea_model.pkl"); diarrhea_scaler = load("diarrhea_scaler.pkl")
cholera_model  = load("cholera_model.pkl");  cholera_scaler  = load("cholera_scaler.pkl")

SKIN_LABELS     = ["Eczema", "Psoriasis", "Fungal Infection", "Acne"]
DIARRHEA_LABELS = ["No Diarrhea", "Mild", "Moderate", "Severe"]
CHOLERA_LABELS  = ["No Cholera", "Suspected", "Confirmed"]

# ── Request schemas ───────────────────────────────────────────
class SkinInput(BaseModel):
    redness: float
    itching: float
    scaling: float
    lesion_size: float
    duration_days: int
    age: int
    patient_id: int = None
    user_id: int = None

class DiarrheaInput(BaseModel):
    loose_stool_freq: int
    stomach_pain: float
    nausea: float
    vomiting: int
    fever: float
    dehydration_level: int
    blood_in_stool: int
    age: int
    patient_id: int = None
    user_id: int = None

class CholeraInput(BaseModel):
    watery_stool: int
    rice_water_stool: int
    vomiting: int
    dehydration: int
    muscle_cramps: int
    rapid_heart_rate: int
    low_bp: int
    contact_with_case: int
    unsafe_water: int
    age: int
    patient_id: int = None
    user_id: int = None

class PatientInput(BaseModel):
    name: str
    age: int
    gender: str
    contact: str = ""
    created_by: int = None

class RegisterInput(BaseModel):
    name: str
    email: str
    password: str
    role_id: int = 2

class LoginInput(BaseModel):
    email: str
    password: str

# ── Helper: save to DB if available ──────────────────────────
def try_save(patient_id, user_id, disease_name, predicted_label, confidence, features):
    if DB_AVAILABLE and patient_id:
        try:
            disease = get_disease_by_name(disease_name)
            disease_id = disease["disease_id"] if disease else None
            save_prediction(patient_id, disease_id, user_id, predicted_label, confidence, features)
        except Exception:
            pass

# ── Routes ────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Healthcare AI API is running 🚀"}

@app.get("/health")
def health():
    return {
        "skin_model":     skin_model is not None,
        "diarrhea_model": diarrhea_model is not None,
        "cholera_model":  cholera_model is not None,
        "database":       DB_AVAILABLE,
    }

# ── Auth routes ───────────────────────────────────────────────
@app.post("/auth/register")
def register(data: RegisterInput):
    if not DB_AVAILABLE:
        raise HTTPException(503, "Database not connected")
    existing = get_user_by_email(data.email)
    if existing:
        raise HTTPException(400, "Email already registered")
    user = create_user(data.name, data.email, data.password, data.role_id)
    return {"success": True, "user": dict(user)}

@app.post("/auth/login")
def login(data: LoginInput):
    if not DB_AVAILABLE:
        raise HTTPException(503, "Database not connected")
    user = get_user_by_email(data.email)
    if not user or user["password_hash"] != data.password:
        raise HTTPException(401, "Invalid email or password")
    return {"success": True, "user": dict(user)}

# ── Patient routes ────────────────────────────────────────────
@app.post("/patients")
def add_patient(data: PatientInput):
    if not DB_AVAILABLE:
        raise HTTPException(503, "Database not connected")
    p = create_patient(data.name, data.age, data.gender, data.contact, data.created_by)
    return {"success": True, "patient": dict(p)}

@app.get("/patients")
def list_patients():
    if not DB_AVAILABLE:
        raise HTTPException(503, "Database not connected")
    return [dict(p) for p in get_all_patients()]

@app.get("/patients/{patient_id}")
def get_patient(patient_id: int):
    if not DB_AVAILABLE:
        raise HTTPException(503, "Database not connected")
    p = get_patient_by_id(patient_id)
    if not p:
        raise HTTPException(404, "Patient not found")
    preds = get_predictions_for_patient(patient_id)
    return {"patient": dict(p), "predictions": [dict(r) for r in preds]}

@app.get("/predictions")
def all_predictions():
    if not DB_AVAILABLE:
        raise HTTPException(503, "Database not connected")
    return [dict(r) for r in get_all_predictions()]

# ── Prediction routes ─────────────────────────────────────────
@app.post("/predict/skin")
def predict_skin(data: SkinInput):
    if not skin_model:
        raise HTTPException(503, "Model not loaded. Run train_models.py first.")
    features = [data.redness, data.itching, data.scaling,
                data.lesion_size, data.duration_days, data.age]
    X      = skin_scaler.transform([features])
    pred   = int(skin_model.predict(X)[0])
    proba  = skin_model.predict_proba(X)[0].tolist()
    label  = SKIN_LABELS[pred]
    conf   = round(max(proba) * 100, 2)
    try_save(data.patient_id, data.user_id, label, label, conf, features)
    return {
        "disease":    "Skin Disease",
        "prediction": label,
        "confidence": conf,
        "all_proba":  {k: round(v*100,2) for k,v in zip(SKIN_LABELS, proba)},
    }

@app.post("/predict/diarrhea")
def predict_diarrhea(data: DiarrheaInput):
    if not diarrhea_model:
        raise HTTPException(503, "Model not loaded.")
    features = [data.loose_stool_freq, data.stomach_pain, data.nausea,
                data.vomiting, data.fever, data.dehydration_level,
                data.blood_in_stool, data.age]
    X     = diarrhea_scaler.transform([features])
    pred  = int(diarrhea_model.predict(X)[0])
    proba = diarrhea_model.predict_proba(X)[0].tolist()
    label = DIARRHEA_LABELS[pred]
    conf  = round(max(proba) * 100, 2)
    try_save(data.patient_id, data.user_id, label, label, conf, features)
    return {
        "disease":    "Diarrhea",
        "prediction": label,
        "confidence": conf,
        "all_proba":  {k: round(v*100,2) for k,v in zip(DIARRHEA_LABELS, proba)},
    }

@app.post("/predict/cholera")
def predict_cholera(data: CholeraInput):
    if not cholera_model:
        raise HTTPException(503, "Model not loaded.")
    features = [data.watery_stool, data.rice_water_stool, data.vomiting,
                data.dehydration, data.muscle_cramps, data.rapid_heart_rate,
                data.low_bp, data.contact_with_case, data.unsafe_water, data.age]
    X     = cholera_scaler.transform([features])
    pred  = int(cholera_model.predict(X)[0])
    proba = cholera_model.predict_proba(X)[0].tolist()
    label = CHOLERA_LABELS[pred]
    conf  = round(max(proba) * 100, 2)
    try_save(data.patient_id, data.user_id, label, label, conf, features)
    return {
        "disease":    "Cholera",
        "prediction": label,
        "confidence": conf,
        "all_proba":  {k: round(v*100,2) for k,v in zip(CHOLERA_LABELS, proba)},
    }