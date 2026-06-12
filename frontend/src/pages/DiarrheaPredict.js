import React, { useState } from "react";
import axios from "axios";

const INIT = {
  loose_stool_freq: "", stomach_pain: "", nausea: "", vomiting: "",
  fever: "", dehydration_level: "", blood_in_stool: "", age: ""
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

  return (
    <div className="card">
      <h2>🌡️ Diarrhea Prediction</h2>
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
          <p className="confidence">{result.prediction}</p>
          <p>Confidence: <strong>{result.confidence}%</strong></p>
        </div>
      )}
    </div>
  );
}
