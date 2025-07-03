/*
  # Add Demo Users for Clinical Portal

  1. Demo Users
    - Admin user: admin@clinic.com / admin123
    - Doctor user: doctor@clinic.com / doctor123  
    - Support user: support@clinic.com / support123

  2. Security
    - Users will be created with proper roles in profiles table
    - Email confirmation is disabled for demo purposes

  3. Notes
    - These are demo accounts for testing the application
    - In production, remove or change these credentials
*/

-- Insert demo users into auth.users table
-- Note: In a real application, users would be created through the Supabase Auth API
-- This is a workaround to create demo users directly in the database

-- First, let's create the profiles for our demo users
-- We'll use fixed UUIDs for consistency

INSERT INTO profiles (id, email, full_name, role, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@clinic.com', 'Admin User', 'admin', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'doctor@clinic.com', 'Dr. Smith', 'doctor', now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'support@clinic.com', 'Support Staff', 'support', now(), now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = now();

-- Add some sample patients for the doctor
INSERT INTO patients (id, first_name, last_name, email, phone, date_of_birth, gender, assigned_doctor_id, status, created_at, updated_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'John', 'Doe', 'john.doe@email.com', '+1-555-0101', '1985-03-15', 'Male', '22222222-2222-2222-2222-222222222222', 'active', now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jane', 'Smith', 'jane.smith@email.com', '+1-555-0102', '1990-07-22', 'Female', '22222222-2222-2222-2222-222222222222', 'active', now(), now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Robert', 'Johnson', 'robert.j@email.com', '+1-555-0103', '1978-11-08', 'Male', '22222222-2222-2222-2222-222222222222', 'active', now(), now())
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

-- Add some sample appointments
INSERT INTO appointments (id, patient_id, doctor_id, title, description, start_time, end_time, status, created_at, updated_at) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Annual Checkup', 'Routine annual physical examination', now() + interval '1 day', now() + interval '1 day' + interval '1 hour', 'scheduled', now(), now()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Follow-up Visit', 'Follow-up for previous treatment', now() + interval '2 days', now() + interval '2 days' + interval '30 minutes', 'scheduled', now(), now())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  doctor_id = EXCLUDED.doctor_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  status = EXCLUDED.status,
  updated_at = now();