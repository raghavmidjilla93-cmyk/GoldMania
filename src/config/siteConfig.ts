/**
 * Site Configuration File
 * Customize your gold rate website easily by editing values below
 * No code changes needed - just update these settings!
 */

export const siteConfig = {
  // ===== BRANDING =====
  brandName: "Gold Mania",
  tagline: "Where Gold Meets Luxury · Hyderabad",
  description: "Hyderabad's trusted destination for live gold & silver rates, BIS hallmarked jewellery, and bespoke designs crafted to perfection.",

  // ===== CONTACT INFORMATION =====
  phone: "+91 7981757384",
  email: "karthikmidjilla@gmail.com",
  whatsapp: "+91 7981757384",
  address: "Hyderabad, Telangana",

  // ===== COLORS & STYLING =====
  primaryColor: "#1e87a7",      // Main brand color (blue)
  secondaryColor: "#ffd700",    // Gold accent
  accentColor: "#c0c0c0",       // Silver accent

  // ===== IMAGES =====
  bannerUrl: "/gold3.jpg",
  logoUrl: "/logo.png",

  // ===== RATES & UPDATES =====
  rateUpdateInterval: 10 * 60 * 1000, // Update rates every 10 minutes
  defaultGoldPrice: 6500,              // Default 24K gold price (₹ per 10g)

  // ===== BUSINESS HOURS =====
  businessHours: {
    monday: "10:00 AM - 8:00 PM",
    tuesday: "10:00 AM - 8:00 PM",
    wednesday: "10:00 AM - 8:00 PM",
    thursday: "10:00 AM - 8:00 PM",
    friday: "10:00 AM - 8:00 PM",
    saturday: "10:00 AM - 8:00 PM",
    sunday: "12:00 PM - 6:00 PM",
  },

  // ===== SOCIAL MEDIA LINKS =====
  socialLinks: {
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourpage",
    twitter: "https://twitter.com/yourpage",
    youtube: "https://youtube.com/yourchannel",
  },

  // ===== HERO SLIDER IMAGES =====
  heroImages: [
    {
      url: "/gold1.png",
      label: "PURE GOLD · 24K",
      title: "Hyderabad's Finest Gold",
      subtitle: "BIS Hallmarked · Certified Purity · Zero Compromise",
      cta: "View Collection",
    },
    {
      url: "/gold3.jpg",
      label: "DESIGNER · 22K",
      title: "Crafted for Royalty",
      subtitle: "Handcrafted Jewellery · Custom Orders Welcome",
      cta: "Enquire on WhatsApp",
    },
    {
      url: "/banner.png",
      label: "LIVE RATES · DAILY",
      title: "Transparent Pricing",
      subtitle: "Rate Shown = Rate You Pay · No Hidden Charges",
      cta: "Today's Rates",
    },
  ],

  // ===== WEBSITE FEATURES =====
  features: [
    {
      icon: "◆",
      title: "Live Market Rates",
      description: "Gold & silver rates updated every 10 minutes from IBJA and Hyderabad market",
    },
    {
      icon: "◈",
      title: "BIS Hallmarked",
      description: "Every piece Government certified — 22K, 18K, 14K with full purity guarantee",
    },
    {
      icon: "◇",
      title: "Custom Jewellery",
      description: "Bespoke designs made to your exact vision — bridal sets, rings, chains and more",
    },
    {
      icon: "◉",
      title: "Transparent Pricing",
      description: "Zero hidden charges — rate shown on site is exactly what you pay at counter",
    },
    {
      icon: "♦",
      title: "Trusted Since 2000",
      description: "Over two decades serving Hyderabad families with trust, quality and fair prices",
    },
    {
      icon: "✦",
      title: "WhatsApp Enquiry",
      description: "Get instant quotes, rate alerts and consultations directly on WhatsApp",
    },
  ],

  // ===== SHOP CATEGORIES =====
  shopCategories: ["All", "Gold", "Silver"],

  // ===== PURITY OPTIONS =====
  goldPurities: [
    { name: "24K", percentage: 99.9, description: "Pure Gold" },
    { name: "22K", percentage: 91.6, description: "Indian Standard"