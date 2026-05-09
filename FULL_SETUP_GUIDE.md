# 🚀 Complete ThreatLens Database Setup Guide

## Step 1: Create Supabase Project

1. **Go to Supabase:** [https://supabase.com](https://supabase.com)
2. **Sign Up/Login:** Create a free account
3. **Create New Project:**
   - Click "New Project"
   - Project name: `ThreatLens`
   - Database password: (create a strong password and save it!)
   - Region: Choose closest to you
   - Click "Create new project"

## Step 2: Get Your Credentials

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy these values:**
   - **Project URL:** `https://your-project-id.supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Update Environment Variables

Run this command to update your `.env.local` file:

```bash
node update-env.js
```

Or manually edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy the entire contents** of `supabase-schema.sql`
3. **Paste into the SQL Editor**
4. **Click "Run"** to execute the schema

## Step 5: Test the Setup

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test the database connection:**
   ```bash
   curl http://localhost:3000/api/test-db
   ```

3. **Test compare functionality:**
   - Go to `http://localhost:3000`
   - Perform a few scans
   - Try the compare feature

## Step 6: Verify Everything Works

✅ **Checklist:**
- [ ] Supabase project created
- [ ] Credentials added to `.env.local`
- [ ] Database schema executed
- [ ] Development server restarted
- [ ] Database connection test passes
- [ ] Compare feature works
- [ ] Scheduling feature works

## Troubleshooting

### "Database connection failed"
- Check your `.env.local` file has correct credentials
- Verify your Supabase project is active
- Restart the development server

### "Failed to fetch scan results"
- Check database schema was created successfully
- Verify RLS policies are in place
- Check browser console for detailed errors

### Compare feature not working
- Make sure you have at least 2 scans in your history
- Check that scans are being saved to database
- Verify user authentication is working

## What This Enables

With the database setup complete, you'll have:

✅ **Compare Feature:** Compare multiple scan results side-by-side
✅ **Scheduling:** Set up automated scans at custom intervals
✅ **History:** Persistent scan history across sessions
✅ **User Profiles:** User-specific data and preferences
✅ **Email Reports:** Automated email notifications for scheduled scans

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure the database schema was executed successfully
4. Restart the development server after making changes

---

**🎉 Once complete, your ThreatLens application will have full database functionality!**
