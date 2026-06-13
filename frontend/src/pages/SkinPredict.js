import React, { useState } from "react";
import axios from "axios";

const INIT = { redness: "", itching: "", scaling: "", lesion_size: "", duration_days: "", age: "" };

const DISEASE_INFO = {
  "Eczema":           { color: "#e57373", desc: "Chronic condition causing itchy, inflamed skin patches." },
  "Psoriasis":        { color: "#ba68c8", desc: "Autoimmune condition causing red, scaly skin patches." },
  "Fungal Infection": { color: "#4db6ac", desc: "Skin infection caused by fungi, often causing ring-shaped rashes." },
  "Acne":             { color: "#ffb74d", desc: "Common skin condition causing pimples and blackheads." },
};

export default function SkinPredict() {
  const [form, setForm] = useState(INIT);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const { data } = await axios.post("/predict/skin", {
        redness:       parseFloat(form.redness),
        itching:       parseFloat(form.itching),
        scaling:       parseFloat(form.scaling),
        lesion_size:   parseFloat(form.lesion_size),
        duration_days: parseInt(form.duration_days),
        age:           parseInt(form.age),
      });
      setResult(data);
    } catch {
      setError("Prediction failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const info = result ? DISEASE_INFO[result.prediction] : null;

  return (
    <div className="card">

      {/* Disease Banner Image */}
      <div style={{
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "20px",
        position: "relative",
        height: "180px",
      }}>
        <img
          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=900&q=80"
          alt="Skin Disease Prediction"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55)" }}
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "16px 20px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
        }}>
          <h2 style={{ margin: 0, fontSize: "22px", color: "#fff" }}>🔬 Skin Disease Prediction</h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#ccc" }}>
            Detects: Eczema · Psoriasis · Fungal Infection · Acne
          </p>
        </div>
      </div>

      <div className="form-grid">
        {[
          ["redness",       "Redness (0–10)"],
          ["itching",       "Itching (0–10)"],
          ["scaling",       "Scaling (0–10)"],
          ["lesion_size",   "Lesion Size (cm)"],
          ["duration_days", "Duration (days)"],
          ["age",           "Patient Age"],
        ].map(([name, label]) => (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <input name={name} value={form[name]} onChange={handle} type="number" placeholder="Enter value" />
          </div>
        ))}
      </div>

      <button className="btn" onClick={submit} disabled={loading}>
        {loading ? "Predicting..." : "Predict Disease"}
      </button>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

      {result && (
        <div className="result-box">
          <h3>Prediction Result</h3>

          {/* Result with disease color */}
          <div style={{
            background: info ? `${info.color}22` : "#e8f5e9",
            border: `2px solid ${info ? info.color : "#2e7d32"}`,
            borderRadius: "10px",
            padding: "14px 18px",
            marginBottom: "14px",
          }}>
            <p className="confidence" style={{ color: info ? info.color : "#2e7d32", margin: "0 0 4px" }}>
              {result.prediction}
            </p>
            <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#ccc" }}>
              {info ? info.desc : ""}
            </p>
            <p style={{ margin: 0 }}>Confidence: <strong>{result.confidence}%</strong></p>
          </div>

          {/* Probability bars */}
          <div style={{ marginTop: 12 }}>
            {Object.entries(result.all_proba).map(([k, v]) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                  <span>{k}</span>
                  <span>{v}%</span>
                </div>
                <div style={{ background: "#2a2a2a", borderRadius: 4, height: 8 }}>
                  <div style={{
                    background: DISEASE_INFO[k] ? DISEASE_INFO[k].color : "#2e7d32",
                    width: `${v}%`, height: "100%", borderRadius: 4,
                    transition: "width 0.5s ease"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}