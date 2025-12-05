# Plant & Garden Management System

A comprehensive Next.js application for managing your plant collection, garden schedules, and plant care routines. This app helps you track your plants, look up botanical information, favorite species, and maintain a calendar of recommended plant care chores.

## Features

- 🌱 **Plant Collection Management** - Add and organize your plants
- 🔍 **Plant Lookup** - Search and browse botanical species using external API
- ⭐ **Favorites** - Save your favorite plants for quick access
- 📅 **Garden Calendar** - View and manage plant care schedules based on recommended chores
- 💾 **Data Persistence** - All data stored securely in Supabase

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Database**: [Supabase](https://supabase.com) - PostgreSQL database with real-time capabilities
- **Botanical API**: [Trefle API](https://trefle.io/) - Comprehensive plant species database
- **Styling**: CSS (with Next.js font optimization)

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- API token for botanical species data

## Getting Started

### 1. Install Dependencies

First, install the base dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then install the Supabase client libraries:

```bash
npm install @supabase/supabase-js @supabase/ssr
# or
yarn add @supabase/supabase-js @supabase/ssr
# or
pnpm add @supabase/supabase-js @supabase/ssr
# or
bun add @supabase/supabase-js @supabase/ssr
```

### 2. Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Botanical API
BOTANICAL_API_TOKEN=your_botanical_api_token
NEXT_PUBLIC_BOTANICAL_API_URL=https://api.example.com  # Update with your actual API base URL
```

**To get your Supabase credentials:**
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key
5. Copy the service_role key (keep this secret!)

**Trefle API Configuration:**
- Get your API token from [Trefle.io](https://trefle.io/) (create an account and retrieve your personal access token)
- The base URL is already configured: `https://trefle.io/api/v1`
- Add your Trefle API token to `BOTANICAL_API_TOKEN` in `.env.local`
- Documentation: [Trefle API Docs](https://docs.trefle.io/)

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the files.

### 4. Set Up Supabase Database

Run the database migration to create all necessary tables:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the migration

This will create the following tables:
- `plants` - Store user's plant collection
- `favorites` - Track favorited plant species
- `garden_chores` - Store scheduled plant care tasks
- `plant_schedules` - Manage plant care schedules

**Note**: The migration includes Row Level Security (RLS) policies. Make sure you have authentication set up in Supabase. If you're using Supabase Auth, the policies will work automatically. Otherwise, you may need to adjust the RLS policies based on your authentication setup.

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   └── botanical/      # Botanical API proxy routes
│   │   ├── page.tsx            # Main application page
│   │   └── layout.tsx         # Root layout
│   ├── components/              # React components
│   │   ├── PlantCollection.tsx # Plant collection display
│   │   ├── PlantSearch.tsx     # Plant search functionality
│   │   ├── Favorites.tsx       # Favorites management
│   │   └── GardenCalendar.tsx  # Calendar view for chores
│   ├── lib/                    # Utility libraries
│   │   ├── supabase/           # Supabase client setup
│   │   └── botanical-api.ts    # Botanical API client
│   └── types/                   # TypeScript type definitions
│       └── database.ts          # Database schema types
├── supabase/
│   └── migrations/             # Database migrations
│       └── 001_initial_schema.sql
├── public/                     # Static assets
└── .env.local                  # Environment variables (not committed)
```

## Development

### Key Components

- **PlantCollection** - Displays all plants in your collection
- **PlantSearch** - Search for plants using the botanical API and add to favorites
- **Favorites** - View and manage your favorited plant species
- **GardenCalendar** - View and manage scheduled plant care chores

### Customization

- Edit `src/app/page.tsx` to modify the main page layout
- Update components in `src/components/` to customize functionality
- Modify `src/lib/botanical-api.ts` to adjust API integration (update the base URL if needed)
- The app uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize and load fonts

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important**: Make sure to add your environment variables in the Vercel project settings before deploying.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
