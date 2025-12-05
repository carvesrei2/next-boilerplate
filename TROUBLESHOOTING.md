# Troubleshooting: Site Can't Be Reached

## Issue: Dependencies Not Installed

The development server can't start because dependencies haven't been installed yet.

## Solution Steps:

### Step 1: Check if Node.js is Installed

Open a terminal and run:
```bash
node --version
npm --version
```

If you see version numbers (like `v18.0.0` and `9.0.0`), Node.js is installed. ✅

If you get "command not found", you need to install Node.js first.

### Step 2: Install Node.js (If Needed)

**On macOS:**
- Option 1: Download from https://nodejs.org/ (recommended: LTS version)
- Option 2: Install using Homebrew:
  ```bash
  brew install node
  ```

**On Windows:**
- Download the installer from https://nodejs.org/
- Run the installer and follow the prompts

**On Linux:**
```bash
# Using apt (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or using yum (CentOS/RHEL)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### Step 3: Verify Installation

After installing, close and reopen your terminal, then verify:
```bash
node --version
npm --version
```

### Step 4: Navigate to Project Directory

```bash
cd /Users/carolinevestergaardreiter/Documents/next-boilerplate
```

### Step 5: Install Dependencies

```bash
npm install
```

This will install all required packages. It may take a few minutes.

### Step 6: Start the Development Server

```bash
npm run dev
```

You should see output like:
```
▲ Next.js 16.0.7
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Step 7: Open in Browser

Once you see "Ready", open your browser and go to:
**http://localhost:3000**

## Common Issues:

### Issue: "Port 3000 is already in use"
**Solution:** Next.js will automatically use the next available port (3001, 3002, etc.). Check the terminal output for the actual URL.

### Issue: "Cannot find module"
**Solution:** Make sure you ran `npm install` and it completed successfully.

### Issue: Environment variables not loading
**Solution:** 
- Make sure `.env.local` exists in the project root
- Restart the dev server after creating/modifying `.env.local`

### Issue: "Permission denied"
**Solution:** On macOS/Linux, you might need to use `sudo` for npm install (not recommended). Better to fix npm permissions:
```bash
# Fix npm permissions (macOS/Linux)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

## Still Having Issues?

1. Make sure you're in the correct directory:
   ```bash
   pwd
   # Should show: /Users/carolinevestergaardreiter/Documents/next-boilerplate
   ```

2. Check if there are any error messages in the terminal

3. Try clearing the cache and reinstalling:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. Check the Next.js documentation: https://nextjs.org/docs/getting-started

