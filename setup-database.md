# Database Setup Instructions

## Setting up Supabase Database Tables

Your ThreatLens application is now configured with Supabase, but you need to create the database tables for full functionality.

### Steps to Set Up Database:

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in to your account
   - Select your project: `ucbsmsybshbahoalxlie`

2. **Open SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Click "New Query"

3. **Run the Schema**
   - Copy the entire contents of `supabase-schema.sql` file
   - Paste it into the SQL Editor
   - Click "Run" to execute the schema

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see two tables: `users` and `scan_results`

### What the Schema Creates:

- **users table**: Stores user profiles and authentication data
- **scan_results table**: Stores vulnerability scan results
- **Row Level Security (RLS)**: Ensures users can only access their own data
- **Indexes**: Optimizes database performance
- **Triggers**: Automatically updates timestamps

### After Setup:

Once the tables are created, your application will:
- ✅ Save scan results to the database
- ✅ Load scan history from the database
- ✅ Provide full user authentication features
- ✅ Enable data persistence across sessions

### Troubleshooting:

If you encounter any issues:
1. Make sure you're in the correct Supabase project
2. Check that the SQL executed without errors
3. Verify the tables appear in the Table Editor
4. Check the browser console for any remaining errors

The application will work without the database (using localStorage only), but setting up the database provides full functionality and data persistence.
