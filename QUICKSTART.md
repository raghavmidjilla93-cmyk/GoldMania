# 🚀 Quick Start Guide - Getting Your Gold Rate Site Live

## ✅ What's Already Done

Your project is configured and ready to deploy:

✓ **API Integration**: Real-time gold & silver rates for Hyderabad via GoldAPI.io  
✓ **Environment Variables**: `.env.local` already configured with API key  
✓ **Next.js Setup**: Complete Next.js 16 project with TypeScript  
✓ **Documentation**: Comprehensive README, Deployment guide, and GitHub setup  

---

## 📋 Step-by-Step Deployment

### Phase 1: Test Locally (5 minutes)

1. **Start development server:**
   ```bash
   npm run dev
   ```
   
2. **Open in browser:**
   Visit `http://localhost:3000`
   
3. **Verify rates are loading:**
   You should see live gold and silver prices
   
4. **Stop server:**
   Press `Ctrl+C` in terminal

### Phase 2: Push to GitHub (10 minutes)

**Option A: Using Git Command Line**

1. **Open terminal in project folder**

2. **Initialize Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Real-time gold and silver rates for Hyderabad"
   ```

3. **Create GitHub repository:**
   - Go to github.com
   - Click "New" button
   - Name it: `gold-rate-site`
   - Click "Create repository"
   - Copy the URL

4. **Push to GitHub:**
   ```bash
   git remote add origin <your-github-url>
   git branch -M main
   git push -u origin main
   ```

**Option B: Using VS Code Git Integration**

1. **Open Source Control** in VS Code (left sidebar)
2. **Click "Initialize Repository"**
3. **Stage all changes:** Click the "+" button
4. **Commit:** Type message "Initial commit: Real-time gold rates"
5. **Publish to GitHub:** Follow VS Code prompts

### Phase 3: Deploy on Vercel (5 minutes) - RECOMMENDED

1. **Go to vercel.com**

2. **Sign up/Login with GitHub**

3. **Click "New Project"**

4. **Select your `gold-rate-site` repository**

5. **Add Environment Variables:**
   - Click "Environment Variables" in settings
   - Add these variables:
     ```
     GOLDAPI_KEY = your-api-key-from-.env.local
     HYD_GOLD_MULTIPLIER = 1.08012
     HYD_SILVER_MULTIPLIER = 1.06
     ```

6. **Click "Deploy"**

7. **Wait for deployment** (usually 2-3 minutes)

8. **Your site is LIVE!** 🎉
   - Vercel gives you a URL like: `https://gold-rate-site.vercel.app`

### Phase 4: Configure Custom Domain (Optional)

1. **In Vercel dashboard:**
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration

---

## 🔄 How to Update Your Site Later

After making changes:

```bash
# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

**Vercel automatically redeploys** when you push!

---

## 🧪 Testing the API

Test your rates API endpoint:

**Local:** `http://localhost:3000/api/rates`

**Live (after deployment):** `https://your-vercel-url.vercel.app/api/rates`

Should return JSON with current gold/silver prices.

---

## ⚙️ Customization

### Change Business Info
Edit `src/config/siteConfig.ts`:
```typescript
brandName: "Your Jewellers Name",
phone: "+91 XXXXXXXXXX",
email: "your@email.com",
```

### Adjust Price Multipliers
Edit `.env.local`:
```
HYD_GOLD_MULTIPLIER=1.08012    # 8% markup
HYD_SILVER_MULTIPLIER=1.06     # 6% markup
```

### Update Logo/Banner
Place images in `public/` folder and reference in `siteConfig.ts`

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Missing GOLDAPI_KEY" error** | Check `.env.local` has the API key |
| **Rates not showing** | Check browser console (F12) for errors |
| **Vercel deployment failed** | Ensure `.env.local` variables are in Vercel dashboard |
| **404 on live site** | Wait 5 minutes for Vercel to fully deploy |

---

## 📚 Documentation

- [README.md](./README.md) - Complete project documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment to AWS, Netlify, etc.
- [SETUP_GITHUB.md](./SETUP_GITHUB.md) - Detailed GitHub setup

---

## 🎯 You're Done! 

Your gold rate site is ready to:
- ✅ Show live gold & silver prices
- ✅ Update automatically every 10 minutes
- ✅ Be deployed globally on Vercel
- ✅ Handle real customer traffic

**Next:** Push to GitHub and deploy on Vercel!

Any questions? Check the documentation files or contact support.
