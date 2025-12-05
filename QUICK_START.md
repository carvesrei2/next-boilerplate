# Quick Start Guide

## Step 1: Install Dependencies

First, make sure you have Node.js installed (version 18+). Then install the project dependencies:

```bash
npm install
```

This will install all required packages including Next.js, React, Supabase clients, and Tailwind CSS.

## Step 2: Verify Environment Variables

Make sure your `.env.local` file is set up with:
- ✅ Supabase URL and keys
- ✅ Trefle API token
- ✅ Trefle API base URL

## Step 3: Run Database Migration (If Not Done)

If you haven't run the Supabase migration yet:
1. Go to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Click **Run**

## Step 4: Start the Development Server

```bash
npm run dev
```

The server will start on **http://localhost:3000**

## Step 5: Test the Application

Open your browser and go to: **http://localhost:3000**

### What to Test:

1. **Plant Search Tab** 🔍
   - Type a plant name (e.g., "rose", "tomato", "lavender")
   - Click "Search"
   - You should see results from Trefle API
   - Try clicking the ⭐ button to add a plant to favorites

2. **Favorites Tab** ⭐
   - View plants you've favorited
   - Remove favorites by clicking the ⭐ button

3. **My Plants Tab** 🌱
   - Currently shows your plant collection (empty until you add plants)
   - This is where plants you add to your collection will appear

4. **Calendar Tab** 📅
   - View and manage garden chores
   - Select different dates to see scheduled tasks
   - Mark chores as complete

### Testing the API Endpoints:

- **Test Database Connection**: http://localhost:3000/api/test-db
- **Test Plant Search API**: http://localhost:3000/api/botanical/search?q=rose

## Troubleshooting

### Port Already in Use
If port 3000 is busy, Next.js will automatically use the next available port (3001, 3002, etc.). Check the terminal output for the actual URL.

### Environment Variables Not Loading
- Make sure `.env.local` exists in the root directory
- Restart the dev server after changing `.env.local`
- Check that variable names match exactly (case-sensitive)

### Database Connection Issues
- Verify your Supabase credentials in `.env.local`
- Check that the migration has been run
- Visit http://localhost:3000/api/test-db to diagnose

### Trefle API Issues
- Verify your API token is correct
- Check the API base URL is set to `https://trefle.io/api/v1`
- Check browser console for API error messages

## Next Steps

Once everything is working:
- Add more features to plant management
- Customize the UI styling
- Add authentication for user-specific data
- Implement plant care schedule automation

Happy gardening! 🌿

