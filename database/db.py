"""
Healthcare AI — Database Connection
PostgreSQL with psycopg2
"""

import psycopg2
import psycopg2.extras
import os

DB_CONFIG = {
    "host":     os.getenv("DB_HOST",     "localhost"),
    "port":     os.getenv("DB_PORT",     "5432"),
    "database": os.getenv("DB_NAME",     "healthcare_ai"),
    "user":     os.getenv("DB_USER",     "mrachingpru"),
    "password": os.getenv("DB_PASSWORD", ""),
}

def get_connection():
    return psycopg2.connect(**DB_CONFIG)

def get_cursor(conn):
    return conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)


# ── Patient helpers ───────────────────────────────────────────

def create_patient(name, age, gender, contact, created_by=None):
    conn = get_connection()
    cur  = get_cursor(conn)
    cur.execute(
        "INSERT INTO patients (name, age, gender, contact, created_by) VALUES (%s,%s,%s,%s,%s) RETURNING *",
        (name, age, gender, contact, created_by)
    )
    patient = cur.fetchone()
    conn.commit(); cur.close(); conn.close()
    return patient

def get_all_patients():
    conn = get_connection()
    cur  = get_cursor(conn)
    cur.execute("SELECT * FROM patients ORDER BY created_at DESC")
    rows = cur.fetchall()
    cur.close(); conn.close()
    return rows

def get_patient_by_id(patient_id):
    conn = get_connection()
    cur  = get_cursor(conn)
    cur.execute("SELECT * FROM patients WHERE patient_id = %s", (patient_id,))
    row = cur.fetchone()
    cur.close(); conn.close()
    return row


# ── Prediction helpers ────────────────────────────────────────

def save_prediction(patient_id, disease_id, user_id, predicted_label, confidence, input_features):
    conn = get_connection()
    cur  = get_cursor(conn)
    # Insert into predictions
    cur.execute(
        "INSERT INTO predictions (patient_id, disease_id, user_id) VALUES (%s,%s,%s) RETURNING prediction_id",
        (patient_id, disease_id, user_id)
    )
    prediction_id = cur.fetchone()["prediction_id"]
    # Insert into prediction_results
    cur.execute(
        "INSERT INTO prediction_results (prediction_id, predicted_label, confidence, input_features) VALUES (%s,%s,%s,%s)",
        (prediction_id, predicted_label, confidence, str(input_features))
    )
    conn.commit(); cur.close(); conn.close()
    return prediction_id

def get_predictions_for_patient(patient_id):
    conn = get_connection()
    cur  = get_cursor(conn)
    cur.execute("""
        SELECT p.prediction_id, p.predicted_at,
               d.disease_name, d.disease_type,
               pr.predicted_label, pr.confidence
        FROM predictions p
        JOIN diseases d ON p.disease_id = d.disease_id
        JOIN prediction_results pr ON p.prediction_id = pr.prediction_id
        WHERE p.patient_id = %s
        ORDER BY p.predicted_at DESC
    """, (patient_id,))
    rows = cur.fetchall()
    cur.close(); conn.close()
    return rows

def get_disease_by_name(name):
    conn = get_connection()
    cur  = get_cursor(conn)
    cur.execute("SELECT * FROM diseases WHERE disease_name ILIKE %s", (f"%{name}%",))
    row = cur.fetchone()
    cur.close(); conn.close()
    return row

def get_all_predictions():
    conn = get_connection()
    cur  = get_cursor(conn)
    cur.execute("""
        SELECT p.prediction_id, p.predicted_at,
               pt.name AS patient_name, pt.age,
               d.disease_name, d.disease_type,
               pr.predicted_label, pr.confidence
        FROM predictions p
        JOIN patients pt ON p.patient_id = pt.patient_id
        JOIN diseases d  ON p.disease_id = d.disease_id
        JOIN prediction_results pr ON p.prediction_id = pr.prediction_id
        ORDER BY p.predicted_at DESC
        LIMIT 100
    """)
    rows = cur.fetchall()
    cur.close(); conn.close()
    return rows
# ── User helpers ───────────────────────────────────────────

def create_user(name, email, password_hash, role_id=2):
    conn = get_connection()
    cur  = get_cursor(conn)
    cur.execute(
        "INSERT INTO users (name, email, password_hash, role_id) VALUES (%s,%s,%s,%s) RETURNING *",
        (name, email, password_hash, role_id)
    )
    user = cur.fetchone()
    conn.commit(); cur.close(); conn.close()
    return user

def get_user_by_email(email):
    conn = get_connection()
    cur  = get_cursor(conn)
    cur.execute("""
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = %s
    """, (email,))
    user = cur.fetchone()
    cur.close(); conn.close()
    return user

def get_all_users():
    conn = get_connection()
    cur  = get_cursor(conn)
    cur.execute("""
        SELECT u.user_id, u.name, u.email, r.role_name, u.created_at
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.created_at DESC
    """)
    rows = cur.fetchall()
    cur.close(); conn.close()
    return rows