/**
 * Site Configuration File
 * Customize your gold rate website easily by editing values below
 * No code changes needed - just update these settings!
 */

export const siteConfig = {
  // ===== BRANDING =====
  brandName: "Sri Venkateshwara Jewellers",
  tagline: "Real-time Gold & Silver Rates | Hyderabad",
  description: "Find live gold and silver rates for Hyderabad, India. Premium jewelry with certified purity.",

  // ===== CONTACT INFORMATION =====
  phone: "+91 9014498917",
  email: "support@vamshiraghava.com",
  whatsapp: "+91 9014498917",
  address: "Hyderabad, Telangana",

  // ===== COLORS & STYLING =====
  primaryColor: "#1e87a7",      // Main brand color (blue)
  secondaryColor: "#ffd700",    // Gold accent
  accentColor: "#c0c0c0",       // Silver accent

  // ===== IMAGES =====
  bannerUrl: "/banner.png",
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
  // Add or edit images in the public/ folder and reference them here
  heroImages: [
    {
      url: "/gold1.png",
      title: "Premium Gold Jewelry",
      subtitle: "22K & 24K Certified Gold",
      cta: "View Collection",
    },
    {
      url: "/gold3.jpg",
      title: "Silver Designs",
      subtitle: "Pure 999 Silver Collection",
      cta: "Explore Silver",
    },
    {
      url: "/banner.png",
      title: "Live Rate Updates",
      subtitle: "Real-time Prices - Always Accurate",
      cta: "Check Rates",
    },
  ],

  // ===== WEBSITE FEATURES =====
  features: [
    {
      icon: "⏱️",
      title: "Live Updates",
      description: "Real-time gold & silver rates updated every 10 minutes",
    },
    {
      icon: "🏆",
      title: "Certified Quality",
      description: "100% authentic hallmarked jewelry with certificates",
    },
    {
      icon: "💳",
      title: "Easy Transactions",
      description: "Secure payment options for your peace of mind",
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Shop anytime, anywhere on any device",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Quick and reliable delivery service",
    },
    {
      icon: "🔒",
      title: "Secure & Safe",
      description: "Encrypted transactions and data protection",
    },
  ],

  // ===== SHOP CATEGORIES =====
  shopCategories: ["All", "Gold", "Silver"],

  // ===== PURITY OPTIONS =====
  goldPurities: [
    { name: "24K", percentage: 99.9, description: "Pure Gold" },
    { name: "22K", percentage: 91.6, description: "Indian Standard" },
    { name: "18K", percentage: 75, description: "Mixed Metal" },
  ],

  // ===== ADMIN SETTINGS =====
  // Default admin username: admin
  // Default admin password: admin
  // Change these in the .env.local file or in the admin panel
  adminSettings: {
    defaultUsername: "admin",
    defaultPassword: "admin",
  },
};
