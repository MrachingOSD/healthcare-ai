-- ============================================
-- Healthcare AI - Database Schema (3NF)
-- ============================================

-- 1. ROLES table (3NF fix)
CREATE TABLE IF NOT EXISTS roles (
    role_id   SERIAL PRIMARY KEY,
    role_name VARCHAR(20) UNIQUE NOT NULL CHECK (role_name IN ('admin', 'doctor'))
);

-- 2. USERS table (doctors/admins)
CREATE TABLE IF NOT EXISTS users (
    user_id       SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id       INT REFERENCES roles(role_id) DEFAULT 2,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. PATIENTS table
CREATE TABLE IF NOT EXISTS patients (
    patient_id  SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    age         INT NOT NULL CHECK (age > 0 AND age < 150),
    gender      VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    contact     VARCHAR(20),
    created_by  INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. DISEASES table
CREATE TABLE IF NOT EXISTS diseases (
    disease_id   SERIAL PRIMARY KEY,
    disease_name VARCHAR(100) NOT NULL,
    disease_type VARCHAR(50) NOT NULL,
    description  TEXT
);

-- 5. PREDICTIONS table
CREATE TABLE IF NOT EXISTS predictions (
    prediction_id SERIAL PRIMARY KEY,
    patient_id    INT REFERENCES patients(patient_id) ON DELETE CASCADE,
    disease_id    INT REFERENCES diseases(disease_id) ON DELETE CASCADE,
    user_id       INT REFERENCES users(user_id) ON DELETE SET NULL,
    predicted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. PREDICTION_RESULTS table
CREATE TABLE IF NOT EXISTS prediction_results (
    result_id         SERIAL PRIMARY KEY,
    prediction_id     INT REFERENCES predictions(prediction_id) ON DELETE CASCADE,
    predicted_label   VARCHAR(100) NOT NULL,
    confidence        FLOAT NOT NULL,
    input_features    TEXT NOT NULL
);

-- ============================================
-- Seed Data
-- ============================================

-- Insert roles
INSERT INTO roles (role_name) VALUES
('admin'),
('doctor')
ON CONFLICT DO NOTHING;

-- Insert diseases
INSERT INTO diseases (disease_name, disease_type, description) VALUES
('Eczema',             'Skin Disease', 'Chronic skin condition causing itchy, inflamed skin'),
('Psoriasis',          'Skin Disease', 'Autoimmune skin condition causing red, scaly patches'),
('Fungal Infection',   'Skin Disease', 'Skin infection caused by fungi'),
('Acne',               'Skin Disease', 'Common skin condition causing pimples'),
('Diarrhea - Mild',    'Diarrhea',    'Mild diarrhea with low dehydration risk'),
('Diarrhea - Moderate','Diarrhea',    'Moderate diarrhea requiring oral rehydration'),
('Diarrhea - Severe',  'Diarrhea',    'Severe diarrhea requiring medical attention'),
('No Cholera',         'Cholera',     'No cholera detected'),
('Cholera Suspected',  'Cholera',     'Cholera suspected, needs lab confirmation'),
('Cholera Confirmed',  'Cholera',     'Cholera confirmed by lab test')
ON CONFLICT DO NOTHING;

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role_id) VALUES
('Admin', 'admin@healthcare.com', 'admin123', 1)
ON CONFLICT DO NOTHING;