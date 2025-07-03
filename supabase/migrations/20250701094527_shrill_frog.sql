/*
  # Complete Database Setup for Clinical Communication Tool
  
  This script combines all migrations and sets up the complete database schema.
  Run this in your Supabase SQL Editor to create all necessary tables and policies.
  
  1. Tables Created:
    - profiles (user profiles with roles)
    - patients (patient records)
    - appointments (appointment scheduling)
    - conversations (chat conversations)
    - messages (individual messages)
    - patient_files (file storage)
    - medical_notes (medical documentation)
  
  2. Demo Data:
    - Admin users for testing
    - Sample patients and appointments
    - Proper role assignments
  
  3. Security:
    - Row Level Security enabled on all tables
    - Role-based access control policies
    - Proper data isolation
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'support' CHECK (role IN ('admin', 'doctor', 'support')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  date_of_birth date,
  gender text,
  address text,
  assigned_doctor_id uuid REFERENCES profiles(id),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  participants uuid[] NOT NULL DEFAULT ARRAY[]::uuid[],
  title text,
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id),
  content text NOT NULL,
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
  file_url text,
  file_name text,
  file_size bigint,
  created_at timestamptz DEFAULT now()
);

-- Create patient_files table
CREATE TABLE IF NOT EXISTS patient_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create medical_notes table
CREATE TABLE IF NOT EXISTS medical_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id),
  title text NOT NULL,
  content text NOT NULL,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_patients_assigned_doctor ON patients(assigned_doctor_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations USING GIN(participants);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all patients" ON patients;
DROP POLICY IF EXISTS "Doctors can manage assigned patients" ON patients;
DROP POLICY IF EXISTS "Support can read all patients" ON patients;
DROP POLICY IF EXISTS "Users can manage appointments they're involved in" ON appointments;
DROP POLICY IF EXISTS "Users can access conversations they participate in" ON conversations;
DROP POLICY IF EXISTS "Users can read messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can manage files for accessible patients" ON patient_files;
DROP POLICY IF EXISTS "Users can manage notes for accessible patients" ON medical_notes;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for patients
CREATE POLICY "Admins can manage all patients"
  ON patients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Doctors can manage assigned patients"
  ON patients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'doctor'
    ) AND (assigned_doctor_id = auth.uid() OR assigned_doctor_id IS NULL)
  );

CREATE POLICY "Support can read all patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('support', 'doctor', 'admin')
    )
  );

-- RLS Policies for appointments
CREATE POLICY "Users can manage appointments they're involved in"
  ON appointments FOR ALL
  TO authenticated
  USING (
    doctor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'support')
    )
  );

-- RLS Policies for conversations
CREATE POLICY "Users can access conversations they participate in"
  ON conversations FOR ALL
  TO authenticated
  USING (
    auth.uid() = ANY(participants) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can read messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id AND (
        auth.uid() = ANY(participants) OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id AND auth.uid() = ANY(participants)
    )
  );

-- RLS Policies for patient_files
CREATE POLICY "Users can manage files for accessible patients"
  ON patient_files FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients p
      JOIN profiles pr ON pr.id = auth.uid()
      WHERE p.id = patient_id AND (
        pr.role = 'admin' OR
        (pr.role = 'doctor' AND p.assigned_doctor_id = auth.uid()) OR
        pr.role = 'support'
      )
    )
  );

-- RLS Policies for medical_notes
CREATE POLICY "Users can manage notes for accessible patients"
  ON medical_notes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients p
      JOIN profiles pr ON pr.id = auth.uid()
      WHERE p.id = patient_id AND (
        pr.role = 'admin' OR
        (pr.role = 'doctor' AND p.assigned_doctor_id = auth.uid()) OR
        pr.role = 'support'
      )
    )
  );

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS patients_updated_at ON patients;
DROP TRIGGER IF EXISTS appointments_updated_at ON appointments;
DROP TRIGGER IF EXISTS conversations_updated_at ON conversations;
DROP TRIGGER IF EXISTS medical_notes_updated_at ON medical_notes;
DROP TRIGGER IF EXISTS messages_update_conversation ON messages;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER medical_notes_updated_at
  BEFORE UPDATE ON medical_notes
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation when new message is added
CREATE TRIGGER messages_update_conversation
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Insert demo users into profiles table
-- Note: These profiles will be linked to auth.users when users sign up with these emails
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@clinic.com', 'Admin User', 'admin', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'doctor@clinic.com', 'Dr. Smith', 'doctor', now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'support@clinic.com', 'Support Staff', 'support', now(), now()),
  ('a1111111-1111-1111-1111-111111111111', 'admin1@clinic.com', 'Primary Admin', 'admin', now(), now()),
  ('a2222222-2222-2222-2222-222222222222', 'admin2@clinic.com', 'Secondary Admin', 'admin', now(), now()),
  ('a3333333-3333-3333-3333-333333333333', 'admin3@clinic.com', 'Tertiary Admin', 'admin', now(), now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = now();

-- Add sample patients for the doctor
INSERT INTO patients (id, first_name, last_name, email, phone, date_of_birth, gender, assigned_doctor_id, status, created_at, updated_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'John', 'Doe', 'john.doe@email.com', '+1-555-0101', '1985-03-15', 'Male', '22222222-2222-2222-2222-222222222222', 'active', now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jane', 'Smith', 'jane.smith@email.com', '+1-555-0102', '1990-07-22', 'Female', '22222222-2222-2222-2222-222222222222', 'active', now(), now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Robert', 'Johnson', 'robert.j@email.com', '+1-555-0103', '1978-11-08', 'Male', '22222222-2222-2222-2222-222222222222', 'active', now(), now()),
  ('p1111111-1111-1111-1111-111111111111', 'Alice', 'Johnson', 'alice.j@email.com', '+1-555-0201', '1988-05-12', 'Female', '22222222-2222-2222-2222-222222222222', 'active', now(), now()),
  ('p2222222-2222-2222-2222-222222222222', 'Michael', 'Brown', 'michael.b@email.com', '+1-555-0202', '1975-09-30', 'Male', '22222222-2222-2222-2222-222222222222', 'active', now(), now()),
  ('p3333333-3333-3333-3333-333333333333', 'Sarah', 'Wilson', 'sarah.w@email.com', '+1-555-0203', '1992-12-18', 'Female', '22222222-2222-2222-2222-222222222222', 'active', now(), now())
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  date_of_birth = EXCLUDED.date_of_birth,
  gender = EXCLUDED.gender,
  assigned_doctor_id = EXCLUDED.assigned_doctor_id,
  status = EXCLUDED.status,
  updated_at = now();

-- Add sample appointments
INSERT INTO appointments (id, patient_id, doctor_id, title, description, start_time, end_time, status, created_at, updated_at) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Annual Checkup', 'Routine annual physical examination', now() + interval '1 day', now() + interval '1 day' + interval '1 hour', 'scheduled', now(), now()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Follow-up Visit', 'Follow-up for previous treatment', now() + interval '2 days', now() + interval '2 days' + interval '30 minutes', 'scheduled', now(), now()),
  ('ap111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Consultation', 'Initial consultation for new patient', now() + interval '3 days', now() + interval '3 days' + interval '45 minutes', 'scheduled', now(), now()),
  ('ap222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Follow-up', 'Follow-up appointment for ongoing treatment', now() + interval '5 days', now() + interval '5 days' + interval '30 minutes', 'scheduled', now(), now())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  doctor_id = EXCLUDED.doctor_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  status = EXCLUDED.status,
  updated_at = now();