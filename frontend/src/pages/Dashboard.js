import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <div className="card">
        <h2>Welcome to Healthcare AI 🏥</h2>
        <p style={{ color: "#555", marginBottom: 24 }}>
          AI-powered disease prediction for Skin Disease, Diarrhea, and Cholera.
          Select a disease below to get started.
        </p>
        <div className="disease-cards">
          <Link to="/skin" className="disease-card">
            <div className="icon">🔬</div>
            <h3>Skin Disease</h3>
            <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
              Eczema, Psoriasis, Fungal, Acne
            </p>
          </Link>
          <Link to="/diarrhea" className="disease-card">
            <div className="icon">🌡️</div>
            <h3>Diarrhea</h3>
            <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
              Mild / Moderate / Severe detection
            </p>
          </Link>
          <Link to="/cholera" className="disease-card">
            <div className="icon">💧</div>
            <h3>Cholera</h3>
            <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
              Suspected / Confirmed detection
            </p>
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="number">3</div>
          <div className="label">AI Models</div>
        </div>
        <div className="stat-card">
          <div className="number">~85%</div>
          <div className="label">Avg Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="number">10+</div>
          <div className="label">Features per Model</div>
        </div>
      </div>
    </div>
  );
}
