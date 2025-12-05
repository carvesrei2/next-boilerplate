# How to Check if Migration Has Been Run

## Option 1: Check in Supabase Dashboard (Easiest)

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project (kkcpmpwvnyizuyyjhcco)
3. Click on **"Table Editor"** in the left sidebar
4. Check if you can see these tables:
   - ✅ `plants`
   - ✅ `favorites`
   - ✅ `garden_chores`
   - ✅ `plant_schedules`

If you see all 4 tables, the migration has been run! ✅

If any tables are missing, you need to run the migration (see below).

## Option 2: Check via SQL Editor

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Run this query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('plants', 'favorites', 'garden_chores', 'plant_schedules')
ORDER BY table_name;
```

If the query returns 4 rows (one for each table), the migration has been run! ✅

## Option 3: Test API Endpoint (After starting dev server)

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000/api/test-db

This will show you which tables exist and which are missing.

## If Migration Hasn't Been Run

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
6. Paste it into the SQL Editor
7. Click **"Run"** (or press Cmd/Ctrl + Enter)
8. Wait for the success message

After running, verify using Option 1 or Option 2 above.

