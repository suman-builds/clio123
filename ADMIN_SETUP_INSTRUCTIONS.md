# Admin Account Setup Instructions

## Important: Manual Step Required

After running the migration, you need to manually create the auth users in your Supabase dashboard:

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users

### Step 2: Create Admin Users
Create these three admin users manually:

**Admin 1:**
- Email: `admin1@clinic.com`
- Password: `admin123`
- User ID: `a1111111-1111-1111-1111-111111111111`

**Admin 2:**
- Email: `admin2@clinic.com`
- Password: `admin123`
- User ID: `a2222222-2222-2222-2222-222222222222`

**Admin 3:**
- Email: `admin3@clinic.com`
- Password: `admin123`
- User ID: `a3333333-3333-3333-3333-333333333333`

### Step 3: Set User IDs
When creating each user:
1. Click "Create new user"
2. Enter the email and password
3. **Important:** Set the User UID to the specific UUID listed above for each user
4. Disable "Send email confirmation" for demo purposes

### Step 4: Verify Setup
After creating the users:
1. The migration has already created the corresponding profiles
2. Try logging in with any of the admin accounts
3. You should have full admin access to all features

## Alternative: Use Existing Demo Account
If you prefer, you can also use the existing demo account:
- Email: `admin@clinic.com`
- Password: `admin123`
- User ID: `11111111-1111-1111-1111-111111111111`

## Security Note
These are demo credentials. In production:
- Use strong, unique passwords
- Enable email confirmation
- Remove or change these demo accounts