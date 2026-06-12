import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8000";

const DISEASE_CONFIGS = {
  skin: {
    label: "Skin Disease", icon: "🔬",
    fields: [
      { key: "redness",       label: "Redness (0–10)"   },
      { key: "itching",       label: "Itching (0–10)"   },
      { key: "scaling",       label: "Scaling (0–10)"   },
      { key: "lesion_size",   label: "Lesion Size (cm)" },
      { key: "duration_days", label: "Duration (days)"  },
      { key: "age",           label: "Patient Age"      },
    ],
    parse: d => ({
      redness: parseFloat(d.redness), itching: parseFloat(d.itching),
      scaling: parseFloat(d.scaling), lesion_size: parseFloat(d.lesion_size),
      duration_days: parseInt(d.duration_days), age: parseInt(d.age),
    }),
  },
  diarrhea: {
    label: "Diarrhea", icon: "🌡️",
    fields: [
      { key: "loose_stool_freq",  label: "Loose Stool/Day"     },
      { key: "stomach_pain",      label: "Stomach Pain (0–10)" },
      { key: "nausea",            label: "Nausea (0–10)"       },
      { key: "vomiting",          label: "Vomiting (0/1)"      },
      { key: "fever",             label: "Fever °C"            },
      { key: "dehydration_level", label: "Dehydration (0–3)"   },
      { key: "blood_in_stool",    label: "Blood in Stool (0/1)"},
      { key: "age",               label: "Patient Age"         },
    ],
    parse: d => ({
      loose_stool_freq: parseInt(d.loose_stool_freq), stomach_pain: parseFloat(d.stomach_pain),
      nausea: parseFloat(d.nausea), vomiting: parseInt(d.vomiting),
      fever: parseFloat(d.fever), dehydration_level: parseInt(d.dehydration_level),
      blood_in_stool: parseInt(d.blood_in_stool), age: parseInt(d.age),
    }),
  },
  cholera: {
    label: "Cholera", icon: "💧",
    fields: [
      { key: "watery_stool",      label: "Watery Stool (0/1)"      },
      { key: "rice_water_stool",  label: "Rice-water Stool (0/1)"  },
      { key: "vomiting",          label: "Vomiting (0/1)"          },
      { key: "dehydration",       label: "Dehydration (0–3)"       },
      { key: "muscle_cramps",     label: "Muscle Cramps (0/1)"     },
      { key: "rapid_heart_rate",  label: "Heart Rate (bpm)"        },
      { key: "low_bp",            label: "Low BP (0/1)"            },
      { key: "contact_with_case", label: "Contact w/ Case (0/1)"  },
      { key: "unsafe_water",      label: "Unsafe Water (0/1)"      },
      { key: "age",               label: "Patient Age"             },
    ],
    parse: d => ({
      watery_stool: parseInt(d.watery_stool), rice_water_stool: parseInt(d.rice_water_stool),
      vomiting: parseInt(d.vomiting), dehydration: parseInt(d.dehydration),
      muscle_cramps: parseInt(d.muscle_cramps), rapid_heart_rate: parseInt(d.rapid_heart_rate),
      low_bp: parseInt(d.low_bp), contact_with_case: parseInt(d.contact_with_case),
      unsafe_water: parseInt(d.unsafe_water), age: parseInt(d.age),
    }),
  },
};

function Sidebar({ page, setPage }) {
  const items = [
    { id: "dashboard", icon: "📊", label: "Dashboard"  },
    { id: "predict",   icon: "🤖", label: "Predict"    },
    { id: "patients",  icon: "👥", label: "Patients"   },
    { id: "history",   icon: "📋", label: "History"    },
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>Healthcare AI</h1>
        <span>Disease Prediction System</span>
      </div>
      {items.map(i => (
        <div key={i.id} className={`nav-item ${page === i.id ? "active" : ""}`} onClick={() => setPage(i.id)}>
          <span className="nav-icon">{i.icon}</span>{i.label}
        </div>
      ))}
    </div>
  );
}

function Dashboard({ setPage }) {
  return (
    <div>
      <div className="stats-row">
        {[
          ["AI Models",  "3",    "Active & Running",       "green"],
          ["Diseases",   "3",    "Skin, Diarrhea, Cholera","blue"],
          ["Avg Accuracy","~85%","Mock data model",        "amber"],
          ["Database",   "3NF",  "PostgreSQL",             "green"],
        ].map(([label, val, sub, color]) => (
          <div className="stat-card" key={label}>
            <div className="stat-label">{label}</div>
            <div className={`stat-value ${color}`}>{val}</div>
            <div className="stat-sub">{sub}</div>
          </div>
        ))}
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">🔬 Available Predictions</div>
          {Object.entries(DISEASE_CONFIGS).map(([key, cfg]) => (
            <div key={key} onClick={() => setPage("predict")}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0",
                borderBottom:"1px solid var(--border)", cursor:"pointer" }}>
              <span style={{ fontSize:24 }}>{cfg.icon}</span>
              <div>
                <div style={{ fontWeight:600, fontSize:14 }}>{cfg.label}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{cfg.fields.length} input features</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">🏗️ System Architecture</div>
          {[
            ["ML Layer",     "Python · Scikit-learn · Random Forest","green"],
            ["Backend API",  "FastAPI · Python · REST",              "blue"],
            ["Database",     "PostgreSQL · 3NF Normalized",          "amber"],
            ["Web Frontend", "React.js",                             "green"],
            ["Mobile App",   "Flutter · Dart",                       "blue"],
          ].map(([title, sub, color]) => (
            <div key={title} style={{ display:"flex", alignItems:"center", gap:12,
              padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", flexShrink:0,
                background: color==="green"?"var(--accent)":color==="blue"?"var(--accent2)":"var(--amber)" }}/>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{title}</div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PredictPage() {
  const [disease, setDisease]   = useState("skin");
  const [form, setForm]         = useState({});
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");

  const cfg = DISEASE_CONFIGS[disease];

  useEffect(() => {
    axios.get(`${API}/patients`).then(r => setPatients(r.data)).catch(() => {});
  }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const body = { ...cfg.parse(form) };
      if (patientId) body.patient_id = parseInt(patientId);
      const { data } = await axios.post(`${API}/predict/${disease}`, body);
      setResult(data);
    } catch {
      setError("Prediction failed. Make sure backend is running.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="disease-tabs">
        {Object.entries(DISEASE_CONFIGS).map(([key, c]) => (
          <button key={key} className={`dtab ${disease === key ? "active" : ""}`}
            onClick={() => { setDisease(key); setForm({}); setResult(null); setError(""); }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">{cfg.icon} {cfg.label} Prediction</div>

          {/* Patient selector */}
          <div className="fg" style={{ marginBottom:16 }}>
            <label>Select Patient (optional — saves to history)</label>
            <select value={patientId} onChange={e => setPatientId(e.target.value)}
              style={{ background:"var(--surface2)", border:"1px solid var(--border)",
                borderRadius:10, padding:"10px 14px", color:"var(--text)",
                fontSize:14, fontFamily:"DM Sans, sans-serif" }}>
              <option value="">— No patient selected —</option>
              {patients.map(p => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.name} (Age: {p.age})
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid">
            {cfg.fields.map(f => (
              <div className="fg" key={f.key}>
                <label>{f.label}</label>
                <input name={f.key} value={form[f.key] || ""} onChange={handle}
                  type="number" placeholder="0" />
              </div>
            ))}
          </div>
          <button className="btn-predict" onClick={submit} disabled={loading}>
            {loading ? "Predicting..." : "Run AI Prediction →"}
          </button>
          {patientId && <p style={{ fontSize:12, color:"var(--accent)", marginTop:8 }}>
            ✅ Result will be saved to History
          </p>}
          {error && <p style={{ color:"var(--danger)", marginTop:12, fontSize:13 }}>{error}</p>}
        </div>

        <div className="card">
          <div className="card-title">📈 Prediction Result</div>
          {!result && !loading && (
            <div className="empty-state">
              <div style={{ fontSize:40, marginBottom:12 }}>🤖</div>
              Fill in the symptoms and click<br/>Run AI Prediction
            </div>
          )}
          {loading && (
            <div className="empty-state">
              <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
              Analyzing symptoms...
            </div>
          )}
          {result && (
            <div className="result-box">
              <div className="result-label">Prediction Result</div>
              <div className="result-disease">{result.prediction}</div>
              <div className="result-conf">Confidence: <strong>{result.confidence}%</strong></div>
              {result.all_proba && (
                <div className="prob-bars">
                  {Object.entries(result.all_proba).map(([k, v]) => (
                    <div className="prob-row" key={k}>
                      <span className="prob-name">{k}</span>
                      <div className="prob-bar-bg">
                        <div className="prob-bar-fill" style={{ width:`${v}%` }} />
                      </div>
                      <span className="prob-pct">{v}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [form, setForm]         = useState({ name:"", age:"", gender:"Male", contact:"" });
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState("");

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try { const { data } = await axios.get(`${API}/patients`); setPatients(data); }
    catch { setPatients([]); }
  };

  const addPatient = async () => {
    setLoading(true); setMsg("");
    try {
      await axios.post(`${API}/patients`, {
        name: form.name, age: parseInt(form.age),
        gender: form.gender, contact: form.contact,
      });
      setMsg("✅ Patient added successfully!");
      setForm({ name:"", age:"", gender:"Male", contact:"" });
      fetchPatients();
    } catch { setMsg("❌ Failed. Is backend running?"); }
    finally { setLoading(false); }
  };

  return (
    <div className="two-col">
      <div className="card">
        <div className="card-title">➕ Add New Patient</div>
        {[
          { key:"name",    label:"Full Name",      type:"text"   },
          { key:"age",     label:"Age",            type:"number" },
          { key:"contact", label:"Contact Number", type:"text"   },
        ].map(f => (
          <div className="fg" key={f.key} style={{ marginBottom:12 }}>
            <label>{f.label}</label>
            <input type={f.type} value={form[f.key]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.label} />
          </div>
        ))}
        <div className="fg" style={{ marginBottom:12 }}>
          <label>Gender</label>
          <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
            style={{ background:"var(--surface2)", border:"1px solid var(--border)",
              borderRadius:10, padding:"10px 14px", color:"var(--text)", fontSize:14, fontFamily:"DM Sans, sans-serif" }}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <button className="btn-predict" onClick={addPatient} disabled={loading}>
          {loading ? "Adding..." : "Add Patient"}
        </button>
        {msg && <p style={{ marginTop:10, fontSize:13,
          color: msg.includes("❌") ? "var(--danger)" : "var(--accent)" }}>{msg}</p>}
      </div>
      <div className="card">
        <div className="card-title">👥 Patient List</div>
        {patients.length === 0
          ? <div className="empty-state">No patients yet.<br/>Add one from the left panel.</div>
          : <table className="data-table">
              <thead><tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th></tr></thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.patient_id}>
                    <td style={{ color:"var(--muted)" }}>{p.patient_id}</td>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td><span className="badge badge-blue">{p.gender}</span></td>
                    <td style={{ color:"var(--muted)" }}>{p.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>
    </div>
  );
}

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/predictions`)
      .then(r => { setHistory(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const badgeClass = label => {
    if (!label) return "badge-blue";
    const l = label.toLowerCase();
    if (l.includes("severe") || l.includes("confirmed")) return "badge-red";
    if (l.includes("moderate") || l.includes("suspected")) return "badge-amber";
    if (l.includes("mild") || l.includes("no ")) return "badge-green";
    return "badge-blue";
  };

  return (
    <div className="card">
      <div className="card-title">📋 Prediction History
        <span style={{ fontSize:12, color:"var(--muted)", fontWeight:400, marginLeft:8 }}>
          (Only saved when a patient is selected during prediction)
        </span>
      </div>
      {loading
        ? <div className="empty-state">Loading...</div>
        : history.length === 0
          ? <div className="empty-state">
              <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
              No predictions saved yet.<br/>
              <span style={{ fontSize:12, color:"var(--muted)" }}>
                Go to Predict → select a patient → run prediction → it will appear here.
              </span>
            </div>
          : <table className="data-table">
              <thead>
                <tr><th>Patient</th><th>Age</th><th>Disease</th><th>Result</th><th>Confidence</th><th>Date</th></tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.prediction_id}>
                    <td>{h.patient_name}</td>
                    <td>{h.age}</td>
                    <td>{h.disease_name}</td>
                    <td><span className={`badge ${badgeClass(h.predicted_label)}`}>{h.predicted_label}</span></td>
                    <td>{h.confidence}%</td>
                    <td style={{ color:"var(--muted)", fontSize:12 }}>
                      {new Date(h.predicted_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
      }
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const titles = {
    dashboard: "Dashboard", predict: "AI Prediction",
    patients:  "Patient Management", history: "Prediction History",
  };
  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <div className="main">
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:22 }}>{titles[page]}</h2>
          <p style={{ color:"var(--muted)", fontSize:13, marginTop:4 }}>Healthcare AI — Disease Prediction System</p>
        </div>
        {page === "dashboard" && <Dashboard setPage={setPage} />}
        {page === "predict"   && <PredictPage />}
        {page === "patients"  && <PatientsPage />}
        {page === "history"   && <HistoryPage />}
      </div>
    </div>
  );
}
