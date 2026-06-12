import React, { useState } from "react";
import axios from "axios";

const INIT = { redness: "", itching: "", scaling: "", lesion_size: "", duration_days: "", age: "" };

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

  return (
    <div className="card">
      <h2>🔬 Skin Disease Prediction</h2>
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
          <p className="confidence">{result.prediction}</p>
          <p>Confidence: <strong>{result.confidence}%</strong></p>
          <div style={{ marginTop: 12 }}>
            {Object.entries(result.all_proba).map(([k, v]) => (
              <div key={k} style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>{k}</span>
                <div style={{ background: "#c8e6c9", borderRadius: 4, height: 8, marginTop: 2 }}>
                  <div style={{ background: "#2e7d32", width: `${v}%`, height: "100%", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
