-- Create diagnoses table to store all plant diagnoses
CREATE TABLE IF NOT EXISTS diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_type VARCHAR(100) NOT NULL,
  issue VARCHAR(255) NOT NULL,
  issue_type VARCHAR(50) NOT NULL,
  confidence INTEGER NOT NULL,
  severity VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  treatments_organic TEXT[] NOT NULL,
  treatments_chemical TEXT[] NOT NULL,
  yield_impact INTEGER NOT NULL,
  safety_warnings TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat messages table for storing expert chat history
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnosis_id UUID NOT NULL REFERENCES diagnoses(id) ON DELETE CASCADE,
  message_type VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table for tracking farmer users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  preferred_crops TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create treatment history table
CREATE TABLE IF NOT EXISTS treatment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  diagnosis_id UUID REFERENCES diagnoses(id) ON DELETE CASCADE,
  treatment_applied VARCHAR(255) NOT NULL,
  applied_date TIMESTAMP NOT NULL,
  effectiveness VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_diagnoses_created_at ON diagnoses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnoses_crop_type ON diagnoses(crop_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_diagnosis_id ON chat_messages(diagnosis_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_treatment_history_user_id ON treatment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_treatment_history_diagnosis_id ON treatment_history(diagnosis_id);
