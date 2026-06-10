# Deployment Guide

This guide covers deploying the Gold Rate Site to production environments.

## Prerequisites

- Node.js 18+ and npm/yarn installed
- A GoldAPI.io account with API key
- GitHub account (for code hosting)
- Hosting platform account (Vercel, Netlify, AWS, etc.)

## Local Setup

1. Clone the repository:
```bash
git clone <your-github-repo-url>
cd gold-rate-site
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your actual values:
```
GOLDAPI_KEY=your-actual-api-key
HYD_GOLD_MULTIPLIER=1.08012
HYD_SILVER_MULTIPLIER=1.06
```

5. Run development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the site.

## Building for Production

```bash
npm run build
npm run start
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project" and import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `GOLDAPI_KEY`: Your GoldAPI key
   - `HYD_GOLD_MULTIPLIER`: 1.08012
   - `HYD_SILVER_MULTIPLIER`: 1.06
5. Click Deploy

Your site will be live at a Vercel URL (or your custom domain).

### Option 2: Netlify

1. Push code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `.next`
7. Add environment variables and deploy

### Option 3: Self-Hosted (AWS, DigitalOcean, etc.)

1. Set up a server with Node.js
2. Clone repository
3. Install dependencies: `npm install`
4. Set environment variables
5. Build: `npm run build`
6. Use PM2 or similar to keep the app running:
```bash
pm2 start npm --name "gold-rates" -- start
```

## API Endpoints

- `GET /api/rates` - Returns current gold and silver rates for Hyderabad

Response format:
```json
{
  "updatedAt": "2024-01-27T10:30:00Z",
  "city": "Hyderabad",
  "note": "Hyderabad Retail (Approx.)",
  "units": {
    "gold": "₹ per 10 grams",
    "silver": "₹ per 1 kg"
  },
  "prices": {
    "gold": [
      { "purity": "Spot", "amount": 6500.25 },
      { "purity": "24K", "amount": 7020.27 },
      { "purity": "22K", "amount": 6438.58 },
      { "purity": "18K", "amount": 4829.54 }
    ],
    "silver": [{ "purity": "999", "amount": 89000.50 }]
  }
}
```

## Configuration

### GoldAPI Key
1. Visit [goldapi.io](https://www.goldapi.io/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to `.env.local`

### Adjusting Retail Multipliers

The multipliers in `.env.local` adjust spot prices to retail:
- `HYD_GOLD_MULTIPLIER`: Markup for gold (1.08 = 8% markup)
- `HYD_SILVER_MULTIPLIER`: Markup for silver (1.06 = 6% markup)

Adjust these based on your actual retail pricing strategy.

## Monitoring

- Set up alerts for API failures
- Monitor API rate limits (GoldAPI free tier: 1 request/minute)
- Check server logs regularly

## Troubleshooting

**"Missing GOLDAPI_KEY" error:**
- Ensure `.env.local` exists with valid API key
- Restart development server after changes

**"GoldAPI failed 429" error:**
- Rate limit hit. Space requests to 1 per minute minimum
- Current implementation waits 1100ms between requests

**Rates not updating:**
- Check if GoldAPI API is working at [status.goldapi.io](https://status.goldapi.io/)
- Verify network connectivity
- Check browser console for errors

## Support

For issues with:
- GoldAPI: Visit [goldapi.io/support](https://www.goldapi.io/support)
- Next.js: See [nextjs.org/docs](https://nextjs.org/docs)
- Deployment: Check your hosting platform's documentation
