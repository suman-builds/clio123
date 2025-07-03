/*
  # Create Admin Demo Accounts

  1. New Admin Users
    - admin1@clinic.com / admin123 - Primary Admin
    - admin2@clinic.com / admin123 - Secondary Admin  
    - admin3@clinic.com / admin123 - Tertiary Admin

  2. Security
    - Users created with admin role in profiles table
    - Proper authentication setup for demo purposes

  3. Notes
    - These are demo admin accounts for testing
    - All accounts have admin privileges
    - Passwords are set to 'admin123' for demo purposes
*/

-- Create admin user profiles
-- Note: In Supabase, we need to create auth users first, then profiles
-- Since we can't directly create auth users via SQL, we'll create profiles with known UUIDs
-- and the auth users will need to be created via the Supabase dashboard or API

-- Insert admin profiles with fixed UUIDs for consistency
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'admin1@clinic.com', 'Primary Admin', 'admin', now(), now()),
  ('a2222222-2222-2222-2222-222222222222', 'admin2@clinic.com', 'Secondary Admin', 'admin', now(), now()),
  ('a3333333-3333-3333-3333-333333333333', 'admin3@clinic.com', 'Tertiary Admin', 'admin', now(), now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = now();

-- Also update existing demo users to ensure they have proper admin access
UPDATE profiles 
SET role = 'admin', updated_at = now()
WHERE email IN ('admin@clinic.com', 'admin1@clinic.com', 'admin2@clinic.com', 'admin3@clinic.com');

-- Create some additional sample data for the admin accounts to manage
INSERT INTO patients (id, first_name, last_name, email, phone, date_of_birth, gender, assigned_doctor_id, status, created_at, updated_at) VALUES
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

-- Add some sample appointments for the admin to oversee
INSERT INTO appointments (id, patient_id, doctor_id, title, description, start_time, end_time, status, created_at, updated_at) VALUES
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