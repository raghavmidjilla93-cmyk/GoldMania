# Setting up GitHub Repository

Follow these steps to push your project to GitHub:

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **New** (green button)
3. Enter repository name: `gold-rate-site`
4. Choose **Private** (recommended) or **Public**
5. **Don't** initialize with README, .gitignore, or license (we have them)
6. Click **Create repository**

## Step 2: Initialize Git Locally

Open terminal in your project and run:

```bash
# Initialize git
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Real-time gold and silver rates for Hyderabad"

# Add remote repository (replace USERNAME and REPO)
git remote add origin https://github.com/USERNAME/gold-rate-site.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace:**
- `USERNAME` with your GitHub username
- `gold-rate-site` with your repository name

## Step 3: Verify

1. Go to your GitHub repository
2. You should see all your files there
3. Check that `.env.local` is NOT visible (it should be in .gitignore)

## Step 4: Deploy

Choose your hosting platform:

### For Vercel (Easiest):
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your `gold-rate-site` repository
5. Add environment variables:
   - `GOLDAPI_KEY`: Your API key
   - `HYD_GOLD_MULTIPLIER`: 1.08012
   - `HYD_SILVER_MULTIPLIER`: 1.06
6. Click "Deploy"

Your live site will be available at your Vercel URL!

### For Other Platforms:
See [DEPLOYMENT.md](./DEPLOYMENT.md) for AWS, DigitalOcean, Netlify, etc.

## Subsequent Updates

After making changes:

```bash
# Stage changes
git add .

# Commit with a message
git commit -m "Your change description"

# Push to GitHub
git push
```

If you deployed on Vercel, it will automatically redeploy on every push!

## Need Help?

- GitHub Guide: [docs.github.com/en/get-started](https://docs.github.com/en/get-started)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Deployment: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
