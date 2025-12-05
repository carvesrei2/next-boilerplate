# Step-by-Step: Run Database Migration in Supabase

## Step 1: Open Supabase Dashboard

1. Go to: **https://app.supabase.com**
2. Sign in to your account
3. Select your project: **kkcpmpwvnyizuyyjhcco**

## Step 2: Open SQL Editor

1. In the left sidebar, click on **"SQL Editor"** (it has a database icon)
2. You should see a blank SQL editor window

## Step 3: Open the Migration File

1. In your project, open the file: `supabase/migrations/002_dev_policies.sql`
2. **Select ALL** the contents (Cmd+A on Mac, Ctrl+A on Windows)
3. **Copy** it (Cmd+C on Mac, Ctrl+C on Windows)

## Step 4: Paste into Supabase SQL Editor

1. Click in the SQL Editor window in Supabase
2. **Paste** the migration code (Cmd+V on Mac, Ctrl+V on Windows)
3. You should see the SQL code appear in the editor

## Step 5: Run the Migration

1. Click the **"Run"** button (usually at the bottom right of the SQL editor)
   - OR press **Cmd+Enter** (Mac) or **Ctrl+Enter** (Windows)
2. Wait a few seconds for it to execute

## Step 6: Verify Success

You should see a message like:
- ✅ **"Success. No rows returned"** - This is GOOD! It means it ran successfully
- ✅ **"Success"** - Also good!

If you see an error (red text), let me know what it says.

## Step 7: Test in Your App

1. Go back to your browser with the app
2. **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Try adding a favorite again - it should work now!

## Alternative: Quick Test Endpoint

After running the migration, visit:
**http://localhost:3000/api/test-favorites**

If it says "Migration appears to be working correctly!" then you're all set! ✅

## Troubleshooting

### If you see "permission denied" error in Supabase:
- Make sure you're logged in as the project owner/admin
- Check that you have the correct project selected

### If the migration runs but favorites still don't work:
1. Hard refresh your browser
2. Check browser console (F12) for errors
3. Try the test endpoint: http://localhost:3000/api/test-favorites

### If you're not sure if it ran:
Run this query in SQL Editor to check:

```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename = 'favorites' 
  AND policyname LIKE 'Dev:%';
```

If you see `"Dev: Allow all favorites operations"`, the migration ran successfully! ✅

