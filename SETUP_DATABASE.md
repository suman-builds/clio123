# Database Setup Instructions

## Error: Table 'appointments' does not exist

The application is trying to access database tables that haven't been created yet. Follow these steps to set up your database:

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** tab in the left sidebar

### Step 2: Run the Migration Script
1. Copy the entire contents of `supabase/migrations/20250701094527_shrill_frog.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

### What this script does:
- Creates all necessary tables (profiles, patients, appointments, conversations, messages, etc.)
- Sets up Row Level Security (RLS) policies
- Creates indexes for better performance
- Adds demo data for testing
- Sets up triggers for automatic timestamp updates

### Step 3: Verify Setup
After running the script, you should see these tables in your database:
- `profiles`
- `patients` 
- `appointments`
- `conversations`
- `messages`
- `patient_files`
- `medical_notes`

### Demo Users Created:
- `admin@clinic.com` (Admin role)
- `doctor@clinic.com` (Doctor role)  
- `support@clinic.com` (Support role)
- Plus additional admin users for testing

### Next Steps:
1. Run the migration script in Supabase SQL Editor
2. Refresh your application
3. The error should be resolved and you can access the admin dashboard

**Note:** Make sure to run the COMPLETE script - it contains all the necessary table definitions, security policies, and demo data.