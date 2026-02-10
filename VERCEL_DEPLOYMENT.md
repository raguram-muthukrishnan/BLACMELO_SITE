# Vercel Deployment Instructions

## The Problem
Vercel is looking for a `build` directory, but Hydrogen outputs to `dist/client`.

## Solution: Configure in Vercel Dashboard

Since `vercel.json` settings are being ignored by Vercel's auto-detection, you need to manually configure the build settings in the Vercel dashboard:

### Steps:

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project (blacmelo-site)
3. Go to **Settings** → **General**
4. Scroll to **Build & Development Settings**
5. Click **Override** and set:
   - **Framework Preset**: `Other` (or `None`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/client`
   - **Install Command**: `npm install`
6. Click **Save**
7. Go to **Deployments** and click **Redeploy** on the latest deployment

## Important Note

Hydrogen is designed for Shopify Oxygen (Cloudflare Workers), not traditional hosting. Deploying to Vercel as a static site means you'll lose:
- Server-side rendering (SSR)
- API routes
- Dynamic cart functionality
- Session management

### Recommended Alternative

Consider deploying to **Shopify Oxygen** instead, which is optimized for Hydrogen:
```bash
npm run build
shopify hydrogen deploy
```

Or use **Cloudflare Pages** which supports the Workers runtime that Hydrogen expects.
