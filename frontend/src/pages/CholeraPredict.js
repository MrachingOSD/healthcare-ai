import React, { useState } from "react";
import axios from "axios";

const INIT = {
  watery_stool: "", rice_water_stool: "", vomiting: "", dehydration: "",
  muscle_cramps: "", rapid_heart_rate: "", low_bp: "",
  contact_with_case: "", unsafe_water: "", age: ""
};

const DISEASE_INFO = {
  "No Cholera":        { color: "#4db6ac", desc: "No cholera detected. Patient appears safe." },
  "Cholera Suspected": { color: "#ffb74d", desc: "Cholera suspected. Lab confirmation required immediately." },
  "Cholera Confirmed": { color: "#e57373", desc: "Cholera confirmed. Urgent medical attention needed." },
};

export default function CholeraPredict() {
  const [form, setForm] = useState(INIT);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const { data } = await axios.post("/predict/cholera", {
        watery_stool:      parseInt(form.watery_stool),
        rice_water_stool:  parseInt(form.rice_water_stool),
        vomiting:          parseInt(form.vomiting),
        dehydration:       parseInt(form.dehydration),
        muscle_cramps:     parseInt(form.muscle_cramps),
        rapid_heart_rate:  parseInt(form.rapid_heart_rate),
        low_bp:            parseInt(form.low_bp),
        contact_with_case: parseInt(form.contact_with_case),
        unsafe_water:      parseInt(form.unsafe_water),
        age:               parseInt(form.age),
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
          src="https://images.unsplash.com/photo-1584118624012-df056829fbd0?w=900&q=80"
          alt="Cholera Prediction"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5)" }}
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "16px 20px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
        }}>
          <h2 style={{ margin: 0, fontSize: "22px", color: "#fff" }}>💧 Cholera Prediction</h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#ccc" }}>
            Detects: No Cholera · Cholera Suspected · Cholera Confirmed
          </p>
        </div>
      </div>

      <div className="form-grid">
        {[
          ["watery_stool",      "Watery Stool (0=No, 1=Yes)"],
          ["rice_water_stool",  "Rice-water Stool (0=No, 1=Yes)"],
          ["vomiting",          "Vomiting (0=No, 1=Yes)"],
          ["dehydration",       "Dehydration (0–3)"],
          ["muscle_cramps",     "Muscle Cramps (0=No, 1=Yes)"],
          ["rapid_heart_rate",  "Heart Rate (bpm)"],
          ["low_bp",            "Low BP (0=No, 1=Yes)"],
          ["contact_with_case", "Contact with Case (0=No, 1=Yes)"],
          ["unsafe_water",      "Unsafe Water (0=No, 1=Yes)"],
          ["age",               "Patient Age"],
        ].map(([name, label]) => (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <input name={name} value={form[name]} onChange={handle} type="number" placeholder="Enter value" />
          </div>
        ))}
      </div>

      <button className="btn" onClick={submit} disabled={loading}>
        {loading ? "Predicting..." : "Predict Cholera Risk"}
      </button>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

      {result && (
        <div className="result-box">
          <h3>Prediction Result</h3>

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

          <div style={{ marginTop: 12 }}>
            {Object.entries(result.all_proba).map(([k, v]) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                  <span>{k}</span>
                  <span>{v}%</span>
                </div>
                <div style={{ background: "#2a2a2a", borderRadius: 4, height: 8 }}>
                  <div style={{
                    background: DISEASE_INFO[k] ? DISEASE_INFO[k].color : "#4db6ac",
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