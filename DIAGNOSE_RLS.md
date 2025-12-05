# Diagnose RLS Policy Issues

## Check Current Policies

Run this query in Supabase SQL Editor to see what policies are currently active:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('favorites', 'plants', 'garden_chores', 'plant_schedules')
ORDER BY tablename, policyname;
```

## What to Look For

### ❌ Problem: Restrictive Policies
If you see policies like:
- `"Users can insert their own favorites"` with `qual` containing `auth.uid() = user_id`
- These require authentication and will block inserts

### ✅ Solution: Development Policies
After running migration `002_dev_policies.sql`, you should see:
- `"Dev: Allow all favorites operations"` with `qual` = `true`
- These allow all operations without authentication

## Quick Fix

1. **Run the migration** `002_dev_policies.sql` in Supabase SQL Editor
2. **Verify** by running the check query above
3. **Test** by visiting: http://localhost:3000/api/test-favorites

## Alternative: Temporarily Disable RLS (NOT RECOMMENDED)

If you want to quickly test without policies:

```sql
-- WARNING: This disables security! Only for development testing!
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE plants DISABLE ROW LEVEL SECURITY;
ALTER TABLE garden_chores DISABLE ROW LEVEL SECURITY;
ALTER TABLE plant_schedules DISABLE ROW LEVEL SECURITY;
```

**Then re-enable and add proper policies:**

```sql
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE garden_chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_schedules ENABLE ROW LEVEL SECURITY;
```

Then run `002_dev_policies.sql` to add the dev policies.

