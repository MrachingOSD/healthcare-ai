import React, { useState } from "react";
import axios from "axios";

const INIT = {
  loose_stool_freq: "", stomach_pain: "", nausea: "", vomiting: "",
  fever: "", dehydration_level: "", blood_in_stool: "", age: ""
};

const DISEASE_INFO = {
  "No Diarrhea": { color: "#4db6ac", desc: "No diarrhea detected. Patient appears healthy." },
  "Mild":        { color: "#81c784", desc: "Mild diarrhea. Oral rehydration and rest recommended." },
  "Moderate":    { color: "#ffb74d", desc: "Moderate diarrhea. Medical attention and ORS advised." },
  "Severe":      { color: "#e57373", desc: "Severe diarrhea. Immediate medical attention required." },
};

export default function DiarrheaPredict() {
  const [form, setForm] = useState(INIT);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const { data } = await axios.post("/predict/diarrhea", {
        loose_stool_freq:  parseInt(form.loose_stool_freq),
        stomach_pain:      parseFloat(form.stomach_pain),
        nausea:            parseFloat(form.nausea),
        vomiting:          parseInt(form.vomiting),
        fever:             parseFloat(form.fever),
        dehydration_level: parseInt(form.dehydration_level),
        blood_in_stool:    parseInt(form.blood_in_stool),
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
          src="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=900&q=80"
          alt="Diarrhea Prediction"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5)" }}
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "16px 20px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
        }}>
          <h2 style={{ margin: 0, fontSize: "22px", color: "#fff" }}>🌡️ Diarrhea Prediction</h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#ccc" }}>
            Detects: No Diarrhea · Mild · Moderate · Severe
          </p>
        </div>
      </div>

      <div className="form-grid">
        {[
          ["loose_stool_freq",  "Loose Stool / Day"],
          ["stomach_pain",      "Stomach Pain (0–10)"],
          ["nausea",            "Nausea (0–10)"],
          ["vomiting",          "Vomiting (0=No, 1=Yes)"],
          ["fever",             "Fever (°C, e.g. 38.5)"],
          ["dehydration_level", "Dehydration (0=None, 1=Mild, 2=Moderate, 3=Severe)"],
          ["blood_in_stool",    "Blood in Stool (0=No, 1=Yes)"],
          ["age",               "Patient Age"],
        ].map(([name, label]) => (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <input name={name} value={form[name]} onChange={handle} type="number" placeholder="Enter value" />
          </div>
        ))}
      </div>

      <button className="btn" onClick={submit} disabled={loading}>
        {loading ? "Predicting..." : "Predict Severity"}
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
                    background: DISEASE_INFO[k] ? DISEASE_INFO[k].color : "#ffb74d",
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