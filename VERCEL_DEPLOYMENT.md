# 🚀 Vercel Deployment Guide

Complete step-by-step instructions to deploy your Gold Rate website to Vercel.

---

## 📋 Prerequisites

✅ GitHub account with repo pushed  
✅ Vercel account (free at vercel.com)  
✅ GoldAPI key from goldapi.io  

---

## 🔧 Step 1: Connect GitHub to Vercel

### Option A: Visit Vercel Directly
1. Go to **https://vercel.com**
2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Accept permissions

### Option B: If Already Signed In
1. Go to **https://vercel.com/dashboard**
2. Click **"Add New"** → **"Project"**

---

## 🔗 Step 2: Import Your GitHub Repository

1. In Vercel dashboard, click **"Import Project"**
2. Paste your repository URL:
   ```
   https://github.com/raghavmidjilla93-cmyk/GoldMania
   ```
3. Or search for the repo if it appears in suggestions
4. Click **"Import"**

---

## ⚙️ Step 3: Configure Project Settings

### Framework
- **Framework Preset:** Next.js (should auto-detect)
- **Root Directory:** `./gold-rate-site` (if needed, adjust path)

### Build Settings
- **Build Command:** `npm run build` (default is fine)
- **Output Directory:** `.next` (default is fine)
- **Install Command:** `npm install` (default)

Click **"Continue"** if these look correct.

---

## 🔐 Step 4: Add Environment Variables (CRITICAL!)

**This is the most important step!**

In Vercel, you'll see a section for **"Environment Variables"**

Add these 3 variables:

### Variable 1: GOLDAPI_KEY
- **Name:** `GOLDAPI_KEY`
- **Value:** Your API key from goldapi.io
  - Get from: https://goldapi.io/dashboard
  - Copy the API key
  - Paste here

### Variable 2: HYD_GOLD_MULTIPLIER
- **Name:** `HYD_GOLD_MULTIPLIER`
- **Value:** `1.08012`
  - (Adjust based on your market rates)

### Variable 3: HYD_SILVER_MULTIPLIER
- **Name:** `HYD_SILVER_MULTIPLIER`
- **Value:** `1.06`
  - (Adjust based on your market rates)

**Example Screenshot:**
```
Name: GOLDAPI_KEY
Value: [your-key-here]
✓ ✓ ✓

Name: HYD_GOLD_MULTIPLIER
Value: 1.08012
✓ ✓ ✓

Name: HYD_SILVER_MULTIPLIER
Value: 1.06
✓ ✓ ✓
```

---

## ✅ Step 5: Deploy!

1. Click **"Deploy"** button
2. Wait for deployment to complete (usually 2-3 minutes)
3. You'll see: **"Congratulations! Your project has been successfully deployed"**
4. Click the **"Visit"** button to see your live site!

---

## 📊 Monitoring the Deployment

### Watch the Build Log
1. After clicking Deploy, you'll see a **"Building"** screen
2. The log shows progress:
   ```
   ✓ Installed dependencies
   ✓ Running build
   ✓ Generating static pages
   ✓ Finalizing optimization
   ```

### If Build Fails
- Check the error message in the log
- Most common issues:
  - **Missing API key:** Add it to environment variables
  - **Missing dependency:** Run `npm install` locally and push
  - **TypeScript error:** Check `npm run build` locally first

---

## 🧪 Step 6: Test Your Live Site

Your site is now live! Test these features:

### Home Page
- ✅ Hero slider rotates automatically
- ✅ Gold/silver rates display
- ✅ Images load correctly
- ✅ Navigation links work
- ✅ WhatsApp button shows correct number

### Rates API
- ✅ Test the rates endpoint:
  ```
  https://your-domain.vercel.app/api/rates
  ```
  Should return JSON with gold/silver prices

### Admin Panel
- ✅ Visit `/admin`
- ✅ Login with `admin` / `admin`
- ✅ Test image upload
- ✅ Add a test item
- ✅ Verify prices calculate

### Mobile
- ✅ Test on phone/tablet
- ✅ Check responsive design
- ✅ WhatsApp link works

---

## 🔄 Redeployment (After Local Changes)

Whenever you make changes locally:

1. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your message"
   git push origin deploy-ready
   ```

2. **Vercel auto-detects the push!**
   - Automatic deployment starts
   - New version live in 2-3 minutes
   - Check deployment status on Vercel dashboard

---

## 🌐 Custom Domain Setup (Optional)

1. In Vercel dashboard → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Usually takes 24-48 hours to propagate

---

## 🔧 Update Environment Variables (After Deployment)

If you need to change multipliers or API key:

1. Go to Vercel dashboard
2. Click your project
3. **"Settings"** → **"Environment Variables"**
4. Edit the variable
5. **Redeploy:** 
   - Click **"Deployments"** tab
   - Click the latest deployment
   - Click **"Redeploy"**

---

## 📞 Troubleshooting

### Issue: Rates not showing
**Solution:**
- Check `GOLDAPI_KEY` is set in Vercel env vars
- Verify API key is valid at goldapi.io
- Check browser console (F12) for errors

### Issue: Images not loading
**Solution:**
- Images must be in `public/` folder
- Check filenames match `siteConfig.ts`
- Redeploy after adding images

### Issue: Admin login not working
**Solution:**
- Default is `admin` / `admin`
- Check localStorage isn't disabled
- Try incognito mode
- Check browser console for errors

### Issue: Build failed
**Solution:**
- Check TypeScript errors locally: `npm run build`
- Fix errors then push again
- Vercel will auto-redeploy

---

## 📈 Performance Tips

1. **Optimize images:**
   - Keep under 500KB per image
   - Use WebP format when possible
   - Use TinyPNG.com to compress

2. **Monitor rates updates:**
   - Currently every 10 minutes
   - Adjust in `siteConfig.ts` if needed

3. **Use Vercel Analytics (optional):**
   - Free with Vercel
   - Shows page loads, errors, performance
   - Access from project dashboard

---

## ✨ Your Site Features

**Live on Vercel:**
- ✅ Real-time gold/silver rates (updated every 10 minutes)
- ✅ Interactive hero slider
- ✅ Product gallery
- ✅ Admin panel for image uploads
- ✅ Mobile responsive
- ✅ WhatsApp integration
- ✅ 99.99% uptime guarantee

---

## 📚 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Project URL:** Check your Vercel dashboard
- **GitHub Repo:** https://github.com/raghavmidjilla93-cmyk/GoldMania
- **GoldAPI:** https://goldapi.io
- **Next.js Docs:** https://nextjs.org/docs

---

## 🎯 Next Steps After Deployment

1. ✅ Share live URL with customers
2. ✅ Update business hours if needed (in `siteConfig.ts`)
3. ✅ Add more product images to admin
4. ✅ Test WhatsApp integration works
5. ✅ Monitor rates for accuracy
6. ✅ Collect feedback from users

---

## 💡 Pro Tips

- **Auto-deploy on every push:** Already enabled by default
- **Preview deployments:** Every pull request gets a preview URL
- **Rollback if needed:** Easy to revert to previous deployment
- **Scale automatically:** Vercel handles traffic spikes
- **Free SSL:** HTTPS enabled automatically

---

**Your site is ready for the world! 🌍**

For help, check Vercel docs or your project settings.

**Current Status:**
- GitHub: ✅ Pushed (commit: 5977bc5b)
- Vercel: Ready to deploy
- API Key: Ready (add to Vercel env vars)
