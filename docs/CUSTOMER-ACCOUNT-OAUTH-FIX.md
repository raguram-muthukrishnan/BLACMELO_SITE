# Customer Account OAuth Error - Redirect URI Mismatch Fix

## 🔴 Current Error

```
Something went wrong
redirect_uri mismatch

Request ID: cf12b8d4-0650-45d5-8cab-bd88e2315160
client_id: bd4faebd-c7c3-49ff-b118-cf9491029541
scope: openid email customer-account-api:full
redirect_uri: https://localhost:3000/account/authorize
```

**Error Type**: OAuth redirect_uri mismatch  
**Cause**: The redirect URI in your request doesn't match what's configured in Shopify

---

## 🔍 Problem Analysis

### What's Happening
1. Your app tries to log in a customer
2. Redirects to Shopify OAuth: `https://shopify.com/authentication/...`
3. Shopify checks if the `redirect_uri` matches the configured value
4. **Mismatch detected** → Error shown

### Current Configuration
From your `.env` file:
```env
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=bd4faebd-c7c3-49ff-b118-cf9491029541
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://shopify.com/86233186590
PUBLIC_STORE_DOMAIN=blacmelo.myshopify.com
```

### The Issue
The redirect URI being sent is: `https://localhost:3000/account/authorize`

But Shopify expects a different URI (likely one of these):
- `http://localhost:3000/account/authorize` (http vs https)
- `https://127.0.0.1:3000/account/authorize` (different host)
- A production domain that's configured
- Or the URI isn't configured at all in Shopify

---

## ✅ Solution Steps

### Step 1: Check Your Development Server URL

First, verify what URL your development server is actually running on:

```bash
# When you run your dev server, check the output
npm run dev
# or
npx shopify hydrogen dev
```

Look for output like:
```
Local:   http://localhost:3000
Network: http://192.168.1.x:3000
```

**Note the protocol**: Is it `http://` or `https://`?

---

### Step 2: Configure Redirect URIs in Shopify Admin

You need to add the correct redirect URI to your Shopify app configuration.

#### Option A: Using Shopify CLI (Recommended)

1. **Link your local environment**:
```bash
cd hydrogen-storefront
npx shopify hydrogen link
```

2. **Check your app configuration**:
```bash
npx shopify app info
```

3. **Update app configuration**:
The Shopify CLI should automatically configure the correct redirect URIs for development.

#### Option B: Manual Configuration in Shopify Admin

1. **Go to Shopify Admin**:
   - Navigate to: `Settings` → `Customer accounts`
   - Or go to: `Settings` → `Apps and sales channels` → `Develop apps`

2. **Find your Hydrogen app**:
   - Look for the app with Client ID: `bd4faebd-c7c3-49ff-b118-cf9491029541`

3. **Add Redirect URIs**:
   Add these URIs to the allowed redirect URIs list:
   
   **For Development**:
   ```
   http://localhost:3000/account/authorize
   http://127.0.0.1:3000/account/authorize
   https://localhost:3000/account/authorize
   https://127.0.0.1:3000/account/authorize
   ```

   **For Production** (when you deploy):
   ```
   https://yourdomain.com/account/authorize
   ```

4. **Save the configuration**

---

### Step 3: Verify Environment Variables

Make sure your `.env` file has all required variables:

```env
# Required for Customer Accounts
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=bd4faebd-c7c3-49ff-b118-cf9491029541
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://shopify.com/86233186590

# Required for Storefront
PUBLIC_STORE_DOMAIN=blacmelo.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=aa223f0ea60ca23a2257eb8520eec555

# Required for Session
SESSION_SECRET=2ce895c54c6a7bb1997dbf1a46a747b371fd562a

# Optional but recommended
PUBLIC_CHECKOUT_DOMAIN=blacmelo.myshopify.com
```

---

### Step 4: Restart Your Development Server

After making changes:

```bash
# Stop the current server (Ctrl+C)

# Clear any cached data
rm -rf .cache
rm -rf dist

# Restart the server
npm run dev
# or
npx shopify hydrogen dev
```

---

### Step 5: Test the Login Flow

1. Navigate to: `http://localhost:3000/account/login`
2. You should be redirected to Shopify OAuth
3. After authentication, you should be redirected back to: `http://localhost:3000/account/authorize`
4. Then automatically redirected to: `http://localhost:3000/account`

---

## 🔧 Alternative Solutions

### Solution A: Use Shopify Hydrogen Dev Server

Instead of running a standard dev server, use Shopify's Hydrogen dev server which handles OAuth configuration automatically:

```bash
npx shopify hydrogen dev
```

This command:
- Sets up the correct redirect URIs
- Handles HTTPS certificates
- Configures environment variables
- Manages OAuth flow properly

---

### Solution B: Use Hydrogen Tunnel for Development

If you need to test with a public URL:

```bash
npx shopify hydrogen dev --tunnel
```

This creates a public URL like: `https://your-app-name.tryhydrogen.dev`

Then add this redirect URI in Shopify:
```
https://your-app-name.tryhydrogen.dev/account/authorize
```

---

### Solution C: Update Customer Account Settings

If you're using the new Customer Account API (which you are), ensure it's enabled:

1. **Go to Shopify Admin**:
   - `Settings` → `Customer accounts`

2. **Enable "New customer accounts"**:
   - Select "New customer accounts" (not "Classic customer accounts")
   - This enables the Customer Account API

3. **Configure login options**:
   - Enable "Accounts are optional"
   - Or "Accounts are required" based on your needs

4. **Save changes**

---

## 🚨 Common Issues & Fixes

### Issue 1: HTTPS vs HTTP Mismatch
**Error**: redirect_uri uses https but server runs on http

**Fix**: 
- Use `npx shopify hydrogen dev` which provides HTTPS
- Or add both http and https URIs to Shopify config

### Issue 2: localhost vs 127.0.0.1
**Error**: Using 127.0.0.1 but configured for localhost

**Fix**: Add both to allowed redirect URIs

### Issue 3: Port Number Mismatch
**Error**: Server runs on port 3001 but configured for 3000

**Fix**: 
- Check your actual port: `npm run dev` output
- Update redirect URI to match the port
- Or configure your server to use port 3000

### Issue 4: Missing Environment Variables
**Error**: Customer account API not initialized

**Fix**: Run `npx shopify hydrogen env pull` to get all variables

### Issue 5: Stale Cache
**Error**: Changes not taking effect

**Fix**: 
```bash
rm -rf .cache dist node_modules/.vite
npm run dev
```

---

## 📋 Verification Checklist

After applying fixes, verify:

- [ ] Development server is running
- [ ] Can access homepage without errors
- [ ] Clicking "Login" redirects to Shopify
- [ ] After Shopify login, redirects back to your site
- [ ] No "redirect_uri mismatch" error
- [ ] Successfully lands on `/account` page
- [ ] Customer data loads correctly
- [ ] Logout works properly

---

## 🔐 Security Notes

### Development
- `http://localhost` is acceptable for development
- Never commit `.env` file to git
- Use different CLIENT_ID for dev and production

### Production
- **MUST use HTTPS** in production
- Configure production domain in Shopify
- Use environment variables in your hosting platform
- Never expose CLIENT_ID in client-side code (it's okay, it's public)

---

## 📝 Quick Fix Commands

```bash
# 1. Pull latest environment variables
npx shopify hydrogen env pull

# 2. Link your local environment
npx shopify hydrogen link

# 3. Start dev server with proper OAuth handling
npx shopify hydrogen dev

# 4. Or start with tunnel for public URL
npx shopify hydrogen dev --tunnel
```

---

## 🎯 Expected Behavior After Fix

### Login Flow
1. User clicks "Login" → `/account/login`
2. Redirects to Shopify OAuth
3. User authenticates with Shopify
4. Shopify redirects to → `/account/authorize`
5. App exchanges code for access token
6. Redirects to → `/account` (dashboard)

### Logout Flow
1. User clicks "Sign out"
2. POST to `/account/logout`
3. Session cleared
4. Redirects to homepage

---

## 🆘 Still Not Working?

### Check Shopify CLI Version
```bash
npm list @shopify/cli
# Should be latest version
npm install -g @shopify/cli@latest
```

### Check Hydrogen Version
```bash
npm list @shopify/hydrogen
# Should be 2024.1.0 or later
npm install @shopify/hydrogen@latest
```

### Enable Debug Logging
Add to your `.env`:
```env
DEBUG=hydrogen:*
```

Then check console output for detailed error messages.

### Contact Shopify Support
If the issue persists:
1. Go to Shopify Admin → Help
2. Provide:
   - Client ID: `bd4faebd-c7c3-49ff-b118-cf9491029541`
   - Store: `blacmelo.myshopify.com`
   - Error: "redirect_uri mismatch"
   - Request ID from error page

---

## 📚 Additional Resources

- [Shopify Customer Account API Docs](https://shopify.dev/docs/api/customer)
- [Hydrogen Customer Accounts Guide](https://shopify.dev/docs/custom-storefronts/hydrogen/customer-accounts)
- [OAuth 2.0 Redirect URI](https://www.oauth.com/oauth2-servers/redirect-uris/)
- [Shopify CLI Hydrogen Commands](https://shopify.dev/docs/api/shopify-cli/hydrogen)

---

## 💡 Pro Tips

1. **Always use Shopify CLI**: `npx shopify hydrogen dev` handles OAuth automatically
2. **Use tunnels for testing**: Great for testing on mobile devices
3. **Keep environment variables synced**: Run `npx shopify hydrogen env pull` regularly
4. **Test in incognito**: Avoid cached authentication issues
5. **Check browser console**: Look for additional error details

---

## Summary

The "redirect_uri mismatch" error occurs because Shopify doesn't recognize your redirect URI. 

**Quick Fix**:
```bash
npx shopify hydrogen dev
```

This command automatically configures the correct redirect URIs and handles OAuth properly.

If you need more control, manually add your development URLs to the Shopify app configuration in the admin panel.
