# Setup Instructions for Clinical Communication Portal

## 1. Environment Setup

1. Create a `.env.local` file in the root of your project with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Database Setup

1. Go to the SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy the contents of `supabase/migrations/20250701094527_shrill_frog.sql`
4. Paste into the SQL Editor and run the query

## 3. Create Auth Users (REQUIRED)

After running the migration, you need to manually create the auth users in your Supabase dashboard:

1. Go to **Authentication > Users**
2. Click "Add User"
3. Create the following users with the specified UUIDs:

**Admin:**
- Email: `admin@clinic.com`
- Password: `admin123`
- User ID: `11111111-1111-1111-1111-111111111111`

**Doctor:**
- Email: `doctor@clinic.com`
- Password: `doctor123`
- User ID: `22222222-2222-2222-2222-222222222222`

**Support:**
- Email: `support@clinic.com`
- Password: `support123`
- User ID: `33333333-3333-3333-3333-333333333333`

**Additional Admin Users (Optional):**
- Email: `admin1@clinic.com`
- Password: `admin123`
- User ID: `a1111111-1111-1111-1111-111111111111`

- Email: `admin2@clinic.com`
- Password: `admin123`
- User ID: `a2222222-2222-2222-2222-222222222222`

- Email: `admin3@clinic.com`
- Password: `admin123`
- User ID: `a3333333-3333-3333-3333-333333333333`

## 4. Important Notes

- The migration script creates the database tables and profiles
- You must manually create the auth users with the exact UUIDs specified
- Make sure to disable email confirmation for demo purposes
- After creating the users, you should be able to log in with any of the demo accounts

## 5. Troubleshooting

If you encounter login errors:
1. Verify that you've created the auth users with the exact UUIDs specified
2. Check that your Supabase URL and anon key are correct in `.env.local`
3. Ensure the migration script ran successfully by checking if the tables exist