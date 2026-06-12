import React, { useState } from "react";
import axios from "axios";

const INIT = {
  watery_stool: "", rice_water_stool: "", vomiting: "", dehydration: "",
  muscle_cramps: "", rapid_heart_rate: "", low_bp: "",
  contact_with_case: "", unsafe_water: "", age: ""
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

  return (
    <div className="card">
      <h2>💧 Cholera Prediction</h2>
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
          <p className="confidence">{result.prediction}</p>
          <p>Confidence: <strong>{result.confidence}%</strong></p>
        </div>
      )}
    </div>
  );
}
