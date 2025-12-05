# Fix for Favorites Feature

## Problem
The favorites feature wasn't working because:
1. The database requires a `user_id` field
2. Row Level Security (RLS) policies require authentication
3. We don't have authentication set up yet

## Solution
I've made two changes:

### 1. Code Changes ✅ (Already Done)
- Added user ID management using localStorage
- Updated all components to use the user ID
- Added better error handling

### 2. Database Migration Required ⚠️

You need to run a new migration to allow inserts without authentication (for development).

**Steps:**

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Click **"New Query"**
5. Copy and paste the **entire contents** of `supabase/migrations/002_dev_policies.sql`
6. Click **"Run"** (or press Cmd/Ctrl + Enter)

This migration will:
- Remove the restrictive authentication-based policies
- Add development-friendly policies that allow operations without auth
- Allow the app to work with localStorage-based user IDs

## After Running the Migration

1. **Refresh your browser** (hard refresh: Cmd+Shift+R)
2. Try adding a favorite again - it should work now!

## Testing

1. Go to the **Search** tab
2. Search for a plant (e.g., "rose")
3. Click the ⭐ button on a plant
4. You should see "Added to favorites!" message
5. Go to the **Favorites** tab to see your favorited plants

## Important Notes

⚠️ **These policies are for development only!** 

Before deploying to production, you should:
- Set up proper authentication (Supabase Auth)
- Replace these development policies with proper RLS policies that use `auth.uid()`
- Remove the localStorage-based user ID system

## Troubleshooting

If favorites still don't work after running the migration:

1. Check browser console for errors (F12 → Console tab)
2. Verify the migration ran successfully in Supabase SQL Editor
3. Try clearing browser cache and localStorage:
   - Open browser console (F12)
   - Run: `localStorage.clear()`
   - Refresh the page
4. Check that `.env.local` has correct Supabase credentials

