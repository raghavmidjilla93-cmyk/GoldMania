# Gold Rate Site - Real-Time Gold & Silver Rates for Hyderabad

A modern web application that displays real-time gold and silver rates for Hyderabad, India using the GoldAPI.io service.

**Live**: [Your deployment URL here]  
**Built with**: Next.js 16, React 19, TypeScript, Tailwind CSS

## Features

✨ **Real-Time Rates**
- Live gold prices (24K, 22K, 18K, and Spot)
- Live silver prices (999 purity)
- Automatic updates every 10 minutes

📱 **Responsive Design**
- Mobile-friendly interface
- Hero slider with banner images
- Clean, modern UI

🔄 **API Integration**
- REST API endpoint for rates: `/api/rates`
- Adjustable retail multipliers for Hyderabad market
- Error handling and fallbacks

🎯 **Business Features**
- Contact page
- Shop information
- Admin dashboard
- Site configuration management

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- GoldAPI.io API key (free at [goldapi.io](https://www.goldapi.io/))

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/gold-rate-site.git
cd gold-rate-site
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

4. **Update `.env.local` with your values:**
```
GOLDAPI_KEY=your-actual-api-key-from-goldapi
HYD_GOLD_MULTIPLIER=1.08012
HYD_SILVER_MULTIPLIER=1.06
```

5. **Run development server:**
```bash
npm run dev
```

6. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Deployment

### Easiest: Vercel
1. Push code to GitHub
2. Connect GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy (automatic on every push)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions for:
- Netlify
- AWS
- DigitalOcean
- Self-hosted servers

## API Documentation

### GET /api/rates

Returns current gold and silver rates for Hyderabad.

**Response:**
```json
{
  "updatedAt": "2024-01-27T10:30:00Z",
  "city": "Hyderabad",
  "prices": {
    "gold": [
      { "purity": "24K", "amount": 7020.27 },
      { "purity": "22K", "amount": 6438.58 },
      { "purity": "18K", "amount": 4829.54 }
    ],
    "silver": [
      { "purity": "999", "amount": 89000.50 }
    ]
  }
}
```

## Configuration

### Site Settings
Edit `src/config/siteConfig.ts`:
```typescript
export const siteConfig = {
  brandName: "Sri Venkateshwara Jewellers",
  phone: "+91 9014498917",
  email: "support@vamshiraghava.com",
  address: "Hyderabad, Telangana",
  // ... more settings
};
```

### Rate Multipliers
Edit `.env.local`:
- `HYD_GOLD_MULTIPLIER`: Markup on gold spot price (1.08 = 8%)
- `HYD_SILVER_MULTIPLIER`: Markup on silver spot price (1.06 = 6%)

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── page.tsx     # Home page with rates
│   ├── api/rates/   # API endpoint for rates
│   ├── admin/       # Admin dashboard
│   ├── contact/     # Contact page
│   └── shop/        # Shop page
├── components/       # React components
│   ├── Header.tsx
│   └── HeroSlider.tsx
└── config/          # Configuration files
    └── siteConfig.ts

public/              # Static assets
```

## Technologies

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Runtime**: Node.js
- **API**: GoldAPI.io (real-time commodity prices)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GOLDAPI_KEY` | GoldAPI.io API key | `goldapi-xxx-io` |
| `HYD_GOLD_MULTIPLIER` | Gold price markup | `1.08012` |
| `HYD_SILVER_MULTIPLIER` | Silver price markup | `1.06` |

## Troubleshooting

**Issue**: "Missing GOLDAPI_KEY"
- **Solution**: Make sure `.env.local` exists with valid API key

**Issue**: Rates not updating
- **Solution**: Check if GoldAPI is working at [status.goldapi.io](https://status.goldapi.io)

**Issue**: 429 (Rate limit) errors
- **Solution**: GoldAPI free tier allows 1 request/minute - don't make more frequent requests

## Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run ESLint
```

## GitHub Setup

See [SETUP_GITHUB.md](./SETUP_GITHUB.md) for step-by-step instructions to:
- Initialize git locally
- Push to GitHub
- Set up automatic deployment

## License

This project is private and proprietary to Sri Venkateshwara Jewellers.

## Support & Contact

- **Website**: [Your website URL]
- **Phone**: +91 9014498917
- **Email**: support@vamshiraghava.com
- **Address**: Hyderabad, Telangana

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Set up `.env.local` with GoldAPI key
3. ✅ Test locally: `npm run dev`
4. 📦 Push to GitHub (see [SETUP_GITHUB.md](./SETUP_GITHUB.md))
5. 🚀 Deploy to Vercel or your hosting (see [DEPLOYMENT.md](./DEPLOYMENT.md))
6. ⚙️ Configure custom domain and SSL
7. 📊 Monitor API and rates

---

Built with ❤️ for Sri Venkateshwara Jewellers
