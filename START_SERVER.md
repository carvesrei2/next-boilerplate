# How to Start the Development Server

## Current Status
❌ Dependencies are NOT installed  
❌ Server is NOT running  
✅ Project files are ready

## Step-by-Step Instructions

### Step 1: Open Terminal
Open Terminal (or your preferred terminal application) on your Mac.

### Step 2: Navigate to Project Directory
```bash
cd /Users/carolinevestergaardreiter/Documents/next-boilerplate
```

### Step 3: Check if Node.js is Installed
```bash
node --version
npm --version
```

**If you see version numbers** (like `v18.0.0`), continue to Step 4.  
**If you see "command not found"**, you need to install Node.js first:
- Download from: https://nodejs.org/ (choose LTS version)
- Install it, then restart your terminal and try again

### Step 4: Install Dependencies
```bash
npm install
```

⏱️ This will take 2-5 minutes. You'll see lots of output as packages are downloaded.

**Wait for it to finish** - you should see something like:
```
added 500 packages, and audited 501 packages in 2m
```

### Step 5: Start the Development Server
```bash
npm run dev
```

You should see output like:
```
▲ Next.js 16.0.7
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Step 6: Open in Browser
Once you see "Ready", open your browser and go to:
**http://localhost:3000**

## Troubleshooting

### If `npm install` fails:
- Make sure you have internet connection
- Try: `npm install --verbose` to see detailed errors
- Check if you have enough disk space

### If `npm run dev` fails:
- Make sure `.env.local` exists with your credentials
- Check for error messages in the terminal
- Try: `npm run dev -- --port 3001` to use a different port

### If browser still shows ERR_CONNECTION_REFUSED:
- Make sure the server is actually running (check terminal)
- Wait a few seconds after "Ready" appears
- Try refreshing the page
- Check if firewall is blocking localhost

## Quick Commands Reference

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Stop server
Press Ctrl+C in the terminal

# Check if server is running
lsof -ti:3000
```

## Need Help?

If you're still having issues:
1. Check the terminal output for error messages
2. Make sure Node.js version is 18 or higher
3. Verify `.env.local` file exists with correct credentials
4. See TROUBLESHOOTING.md for more detailed help

