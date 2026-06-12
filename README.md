# 🏥 Healthcare AI — Final Year Project

AI-powered disease prediction system for **Skin Disease**, **Diarrhea**, and **Cholera**.

## 🗂️ Project Structure

```
healthcare-ai/
├── ml_model/          ← Python ML models (Random Forest + Logistic Regression)
│   ├── train_models.py
│   └── models/        ← Generated after training (.pkl files)
├── backend/           ← FastAPI REST API
│   ├── main.py
│   └── requirements.txt
├── frontend/          ← React.js Web Dashboard
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── pages/
│   │       ├── Dashboard.js
│   │       ├── SkinPredict.js
│   │       ├── DiarrheaPredict.js
│   │       └── CholeraPredict.js
│   └── package.json
├── mobile/            ← Flutter Mobile App
│   ├── lib/
│   │   ├── main.dart
│   │   └── screens/
│   │       ├── home_screen.dart
│   │       └── predict_screen.dart
│   └── pubspec.yaml
└── README.md
```

---

## ⚙️ Step 1 — Train the ML Models

```bash
cd ml_model
pip install scikit-learn numpy pandas
python train_models.py
```
This creates `models/` folder with 6 `.pkl` files (3 models + 3 scalers).

---

## ⚙️ Step 2 — Run the Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
API runs at: **http://localhost:8000**
Swagger docs: **http://localhost:8000/docs**

### API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/` | Health check |
| GET | `/health` | Model status |
| POST | `/predict/skin` | Skin disease prediction |
| POST | `/predict/diarrhea` | Diarrhea severity prediction |
| POST | `/predict/cholera` | Cholera risk prediction |

---

## ⚙️ Step 3 — Run the Web App (React)

```bash
cd frontend
npm install
npm start
```
Opens at: **http://localhost:3000**

---

## ⚙️ Step 4 — Run the Mobile App (Flutter)

```bash
cd mobile
flutter pub get
flutter run
```
> For real device testing, change `BASE_URL` in `predict_screen.dart`
> from `http://10.0.2.2:8000` to your PC's local IP (e.g. `http://192.168.1.5:8000`)

---

## 🔬 ML Models

| Disease | Algorithm | Features |
|---------|-----------|----------|
| Skin Disease | Random Forest | Redness, Itching, Scaling, Lesion size, Duration, Age |
| Diarrhea | Random Forest | Stool frequency, Pain, Nausea, Fever, Dehydration, Blood |
| Cholera | Logistic Regression | Watery stool, Vomiting, Dehydration, Heart rate, Water source |

## 📊 Replacing Mock Data with Real Kaggle Datasets

1. Download from Kaggle (e.g. "Skin Disease Dataset", "Cholera Dataset")
2. Save CSV files into `ml_model/data/`
3. Update `train_models.py` — replace `pd.DataFrame({...})` with `pd.read_csv("data/your_file.csv")`
4. Re-run `python train_models.py`

---

## 🛠️ Tech Stack

- **ML**: Python, Scikit-learn, Pandas, NumPy
- **Backend**: FastAPI, Uvicorn
- **Web**: React.js, React Router, Axios, Recharts
- **Mobile**: Flutter, Dart, http package
- **Database** (add later): MongoDB or PostgreSQL
