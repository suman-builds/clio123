# Clinical Communication Portal

A comprehensive healthcare management platform with Supabase integration for authentication, database, and storage.

## Features

- User authentication (login, register, password reset)
- Role-based access control (admin, doctor, support)
- Patient management
- Appointment scheduling
- Messaging system
- Document management
- Clinical notes
- Admin dashboard
- And much more!

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- shadcn/ui components
- Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Setup Instructions

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update with your Supabase project URL and anon key

4. Set up the Supabase database:
   - Run the setup script for instructions:

```bash
npm run setup-db
```

5. Start the development server:

```bash
npm run dev
```

## Database Setup

The application requires a Supabase database with specific tables and security policies. Follow these steps to set up your database:

1. Create a new Supabase project
2. Navigate to the SQL Editor in your Supabase dashboard
3. Run the migration script from `supabase/migrations/20250701094527_shrill_frog.sql`
4. Create admin users as specified in `ADMIN_SETUP_INSTRUCTIONS.md`

## Demo Accounts

For testing purposes, you can use these demo accounts:

- **Admin**: admin@clinic.com / admin123
- **Doctor**: doctor@clinic.com / doctor123
- **Support**: support@clinic.com / support123

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── (auth)/           # Authentication pages
│   ├── (protected)/      # Protected routes
│   └── api/              # API routes
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   └── ui/               # UI components (shadcn)
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication utilities
│   ├── supabase.ts       # Supabase client
│   └── database.types.ts # Supabase database types
├── public/               # Static assets
└── supabase/             # Supabase configuration
    └── migrations/       # Database migrations
```

## Security

This application implements Row Level Security (RLS) policies in Supabase to ensure data is properly protected. Each user can only access data they are authorized to see based on their role.

## License

This project is licensed under the MIT License.