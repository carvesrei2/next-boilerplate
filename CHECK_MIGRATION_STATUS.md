# Check Migration Status

## Quick Check

The error you're seeing (`Error adding to favorites: {}`) is likely because the database migration hasn't been run yet.

## Verify Migration Status

### Option 1: Check in Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Run this query to check if the dev policies exist:

```sql
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE tablename IN ('favorites', 'plants', 'garden_chores', 'plant_schedules')
  AND policyname LIKE 'Dev:%'
ORDER BY tablename, policyname;
```

**If you see 4 policies** (one for each table starting with "Dev:"), the migration has been run ✅

**If you see 0 policies**, you need to run the migration ❌

### Option 2: Check Current Policies

Run this to see all current policies:

```sql
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'favorites'
ORDER BY policyname;
```

If you see policies with names like "Users can insert their own favorites" (without "Dev:"), those are the old restrictive policies that need to be replaced.

## Run the Migration

If the migration hasn't been run:

1. Go to **SQL Editor** in Supabase
2. Click **"New Query"**
3. Copy the **entire contents** of `supabase/migrations/002_dev_policies.sql`
4. Paste into the SQL Editor
5. Click **"Run"** (or Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

## After Running Migration

1. **Hard refresh your browser**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Try adding a favorite again
3. Check the browser console (F12) for any new error messages

## Still Having Issues?

If you've run the migration and it still doesn't work:

1. Check the browser console (F12 → Console tab) for detailed error messages
2. Verify your Supabase credentials in `.env.local` are correct
3. Make sure you're using the correct Supabase project
4. Try clearing browser cache and localStorage:
   - Open browser console (F12)
   - Run: `localStorage.clear()`
   - Refresh the page

