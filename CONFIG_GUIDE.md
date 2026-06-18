# 🎨 Website Configuration Guide

Complete guide to customize your Gold Rate website WITHOUT touching code!

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Site Settings (siteConfig)](#site-settings)
3. [Environment Variables](#environment-variables)
4. [Admin Panel Features](#admin-panel-features)
5. [Adding Images](#adding-images)
6. [Social Media Setup](#social-media-setup)
7. [Business Hours](#business-hours)
8. [FAQ](#faq)

---

## 🚀 Quick Start

### Step 1: Copy Environment File
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values (see section below)
```

### Step 2: Get Your GoldAPI Key
1. Visit [goldapi.io](https://goldapi.io)
2. Sign up for free
3. Get your API key from the dashboard
4. Paste it in `.env.local` as `GOLDAPI_KEY=your_key_here`

### Step 3: Start Customizing!
All main settings are in `src/config/siteConfig.ts`

---

## 🛠️ Site Settings (siteConfig.ts)

**File location:** `src/config/siteConfig.ts`

This file controls EVERYTHING visible on your website. Edit these values:

### Brand Information
```typescript
brandName: "Sri Venkateshwara Jewellers",     // Your shop name
tagline: "Real-time Gold & Silver Rates | Hyderabad",  // Your tagline
description: "Find live gold and silver...",  // SEO description
```

### Contact Information
```typescript
phone: "+91 9014498917",                      // WhatsApp number
email: "support@vamshiraghava.com",           // Contact email
whatsapp: "+91 9014498917",                   // WhatsApp number
address: "Hyderabad, Telangana",              // Your address
```

### Colors & Styling
```typescript
primaryColor: "#1e87a7",    // Main brand color (appears in buttons, links)
secondaryColor: "#ffd700",  // Gold accent color
accentColor: "#c0c0c0",     // Silver accent color
```

### Hero Slider Images
Edit the `heroImages` array to change the rotating banner:

```typescript
heroImages: [
  {
    url: "/gold1.png",              // Image file in public/ folder
    title: "Premium Gold Jewelry",  // Large text on image
    subtitle: "22K & 24K Gold",     // Smaller text
    cta: "View Collection",         // Button text
  },
  // Add more images here...
]
```

**To add your own images:**
1. Save images to `public/` folder (e.g., `public/my-image.jpg`)
2. Add to `heroImages` array with correct filename
3. Restart the development server

### Features Section
The "Why Choose Us?" section on home page:

```typescript
features: [
  {
    icon: "⏱️",           // Any emoji
    title: "Live Updates",
    description: "Real-time gold & silver rates...",
  },
  // Add more features...
]
```

### Business Hours
```typescript
businessHours: {
  monday: "10:00 AM - 8:00 PM",
  tuesday: "10:00 AM - 8:00 PM",
  // ... etc
  sunday: "12:00 PM - 6:00 PM",
}
```

### Social Media
```typescript
socialLinks: {
  facebook: "https://facebook.com/yourpage",
  instagram: "https://instagram.com/yourpage",
  twitter: "https://twitter.com/yourpage",
  youtube: "https://youtube.com/yourchannel",
}
```

---

## 🔐 Environment Variables

**File location:** `.env.local` (create from `.env.example`)

### Required Variables

#### GOLDAPI_KEY (Required!)
- Get from: https://goldapi.io/dashboard
- Used for: Fetching real-time gold/silver rates
- Example: `GOLDAPI_KEY=abc123def456`

#### Rate Multipliers (Optional - Adjust for Your Market)

**HYD_GOLD_MULTIPLIER**
- Controls gold price adjustment for Hyderabad
- Default: `1.08012` (adds 8.012%)
- Formula: `International Gold Rate × Multiplier = Your Gold Rate`
- Adjust if rates don't match your market

**HYD_SILVER_MULTIPLIER**
- Controls silver price adjustment for Hyderabad  
- Default: `1.06` (adds 6%)
- Adjust if rates don't match your market

### Optional Variables (For Future Use)
```
CLOUDINARY_CLOUD_NAME=  # Cloud storage for images
SMTP_HOST=              # Email service
```

---

## 👨‍💼 Admin Panel Features

**Access at:** `/admin`

### Default Login
```
Username: admin
Password: admin
```

**⚠️ Change these immediately after setup!** (in admin page)

### Features in Admin Panel

#### 1. Add Items with Images ✨
Upload jewelry items with photos:
- Item Name
- Metal Type (Gold/Silver)
- Weight (grams)
- Wastage % (labor charge)
- **Image Upload** (drag & drop supported)

Images are stored in browser's localStorage (client-side) for now.

#### 2. Gold Price Override 💰
Manually set the 24K gold price when API is unavailable.

#### 3. View Shop Items 📦
See all items you've added with preview images and calculated prices.

### Current Limitations & Future Improvements
- Images stored in browser only (localStorage) - limited to ~5MB
- No cloud storage integration yet
- No database persistence
- Passwords not encrypted

---

## 🖼️ Adding Images

### Where to Put Images
Create folder: `public/` (already exists)

### Supported Formats
- JPG / JPEG
- PNG
- GIF
- WebP

### How to Use

#### 1. Hero Slider Images
```typescript
// In siteConfig.ts
heroImages: [
  { url: "/my-gold-banner.jpg", ... }
]
```

#### 2. Featured Collection
Edit `src/app/page.tsx` and change image URLs:
```typescript
<img src="/my-image.jpg" alt="description" />
```

#### 3. Admin Panel
Upload via the image uploader in the form (client-side preview).

### Image Size Recommendations
- Hero slider: 1200 x 400px (landscape)
- Product gallery: 500 x 500px (square)
- Thumbnails: 300 x 200px (landscape)

### Image Optimization Tips
- Compress images before uploading (use TinyPNG.com)
- Use WebP format for faster loading
- Keep file sizes under 500KB
- Use descriptive filenames

---

## 📱 Social Media Setup

Edit `socialLinks` in `siteConfig.ts`:

```typescript
socialLinks: {
  facebook: "https://facebook.com/yourpage",     // Your Facebook URL
  instagram: "https://instagram.com/yourpage",   // Your Instagram profile
  twitter: "https://twitter.com/yourpage",       // Your Twitter profile
  youtube: "https://youtube.com/yourchannel",    // Your YouTube channel
}
```

### Where Social Links Appear
1. **Header** - Social icons in navigation
2. **Contact Page** - Social media section
3. **WhatsApp Link** - Uses `whatsapp` number from config

### Get Your URLs
- **Facebook:** facebook.com/[yourpage] 
- **Instagram:** instagram.com/[yourprofile]
- **Twitter:** twitter.com/[yourhandle]
- **YouTube:** youtube.com/[yourchannel]

---

## ⏰ Business Hours

Edit in `siteConfig.ts`:

```typescript
businessHours: {
  monday: "10:00 AM - 8:00 PM",
  tuesday: "10:00 AM - 8:00 PM",
  wednesday: "10:00 AM - 8:00 PM",
  thursday: "10:00 AM - 8:00 PM",
  friday: "10:00 AM - 8:00 PM",
  saturday: "10:00 AM - 8:00 PM",
  sunday: "12:00 PM - 6:00 PM",
}
```

---

## ❓ FAQ

### Q: How do I change the brand name?
**A:** Edit `brandName` in `src/config/siteConfig.ts`

### Q: The gold rates seem too high/low?
**A:** Adjust `HYD_GOLD_MULTIPLIER` in `.env.local`
- Higher number = higher price shown
- Lower number = lower price shown

### Q: Can I change the admin password?
**A:** Currently hardcoded. Edit login logic in `src/app/admin/page.tsx` or implement a database.

### Q: Where do uploaded images go?
**A:** Currently stored in browser's localStorage. 
- Limit: ~5MB per browser
- **Limitation:** Images lost if browser data is cleared
- **Future:** Cloud storage (S3, Cloudinary) recommended

### Q: How do I add more pages?
**A:** Create new file in `src/app/[pagename]/page.tsx`

### Q: Can I use a different API for rates?
**A:** Yes, edit `src/app/api/rates/route.ts` to use different provider

### Q: How do I deploy to production?
**A:** See `DEPLOYMENT.md` for Vercel instructions

### Q: My images aren't showing?
**A:** 
1. Check file is in `public/` folder
2. Use correct filename in config (case-sensitive)
3. Restart dev server

### Q: Rate multipliers not working?
**A:**
1. Restart server after editing `.env.local`
2. Make sure format is correct (e.g., `1.08012`)
3. Check API is returning rates first

---

## 📞 Support

For issues:
1. Check error messages in browser console (F12)
2. Check server logs in terminal
3. Verify `.env.local` has correct API key
4. See `README.md` for more info

## 🎯 Next Steps

1. ✅ Edit `siteConfig.ts` with your info
2. ✅ Set up `.env.local` with API key
3. ✅ Add your images to `public/` folder
4. ✅ Test admin panel (add items)
5. ✅ Update social media links
6. ✅ Deploy to Vercel (see DEPLOYMENT.md)

---

**Happy selling! 🎉**
