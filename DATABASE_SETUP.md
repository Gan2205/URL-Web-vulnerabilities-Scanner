# Database Setup Guide

The scan comparison feature requires a Supabase database to store and retrieve scan results. Follow these steps to set up the database:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization and enter project details
5. Wait for the project to be created

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## 3. Create Environment File

Create a file named `.env.local` in the `threatlens` directory with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual project URL and anon key.

## 4. Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-schema.sql` into the editor
3. Click "Run" to execute the SQL and create the necessary tables

## 5. Restart the Development Server

After creating the `.env.local` file:

```bash
npm run dev
```

## 6. Test the Setup

1. Perform a few scans on different URLs
2. Go to the History tab
3. Select 2 or more scans
4. Click "Compare Selected" to test the comparison feature

## Troubleshooting

### "Database not configured" Error
- Make sure you've created the `.env.local` file
- Verify the environment variables are correct
- Restart the development server after adding the environment file

### "Failed to fetch scan results" Error
- Check that the database schema was created successfully
- Verify your Supabase project is active
- Check the browser console for detailed error messages

### No Scans Available for Comparison
- Make sure you've performed at least 2 scans
- Check that scans are being saved to the database
- Look for any errors in the browser console during scanning

## Alternative: Use Without Database

If you prefer not to set up Supabase, the application will still work for individual scans, but comparison features will be disabled. Scan results will be stored locally in your browser.
