# Local Development OAuth Setup - Complete Solution

## 🎯 The Problem

**Symptom**: Login works on live site but fails locally with "redirect_uri mismatch"

**Root Cause**: 
- Live site domain is configured in Shopify: ✅ Works
- Localhost domain is NOT configured in Shopify: ❌ Fails

**Error Details**:
```
redirect_uri: https://localhost:3000/account/authorize
Error: redirect_uri mismatch
```

---

## 🔧 Solution Options

### ✅ Option 1: Use Customer Account Push Flag (RECOMMENDED)

This is the **easiest and most reliable** solution for local development.

#### Step 1: Start Dev Server with Customer Account Push

```bash
cd hydrogen-storefront
npm run dev -- --customer-account-push
```

Or directly:
```bash
npx shopify hydrogen dev --customer-account-push
```

#### What This Does:
- Creates a public HTTPS tunnel (e.g., `https://your-app.tryhydrogen.dev`)
- **Automatically pushes the tunnel URL to Shopify admin**
- Configures OAuth redirect URIs automatically
- Handles HTTPS certificates
- Works exactly like production

#### Step 2: Access Your Site
The terminal will show:
```
┃ Tunneling URL: https://your-app-name.tryhydrogen.dev
┃ Local:         http://localhost:3000
┃ Customer Account API: Configured ✓
```

Use the **tryhydrogen.dev** URL for testing customer login.

#### Advantages:
- ✅ No Shopify admin configuration needed
- ✅ Automatic HTTPS
- ✅ Works on any device (mobile testing)
- ✅ Shareable URL for team testing
- ✅ OAuth works out of the box

---

### ✅ Option 2: Configure Localhost in Shopify Admin

If you prefer using `localhost` directly, you need to manually configure it.

#### Step 1: Find Your Hydrogen App in Shopify

1. **Go to Shopify Admin**: https://blacmelo.myshopify.com/admin
2. **Navigate to**: Settings → Apps and sales channels → Develop apps
3. **Find your Hydrogen app** with Client ID: `bd4faebd-c7c3-49ff-b118-cf9491029541`

#### Step 2: Add Localhost Redirect URIs

1. Click on your Hydrogen app
2. Go to **Configuration** tab
3. Find **Customer Account API** section
4. Under **Redirect URIs**, add:

```
http://localhost:3000/account/authorize
https://localhost:3000/account/authorize
http://127.0.0.1:3000/account/authorize
https://127.0.0.1:3000/account/authorize
```

5. **Save** the configuration

#### Step 3: Restart Your Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

#### Step 4: Test Login

1. Go to: `http://localhost:3000/account/login`
2. Should redirect to Shopify OAuth
3. After login, should redirect back successfully

#### Disadvantages:
- ⚠️ Requires manual Shopify admin configuration
- ⚠️ May need to configure HTTPS locally
- ⚠️ Only works on your machine

---

### ✅ Option 3: Use Shopify CLI Link Command

This links your local environment to your Shopify store.

#### Step 1: Link Your Environment

```bash
cd hydrogen-storefront
npx shopify hydrogen link
```

Follow the prompts:
- Select your store: `blacmelo.myshopify.com`
- Confirm the app

#### Step 2: Pull Environment Variables

```bash
npx shopify hydrogen env pull
```

This updates your `.env` file with the correct configuration.

#### Step 3: Start Dev Server

```bash
npm run dev
```

#### What This Does:
- Syncs your local environment with Shopify
- Ensures correct CLIENT_ID and API URLs
- May automatically configure redirect URIs

---

## 🚀 Recommended Workflow

### For Daily Development:

```bash
# Start with customer account push for OAuth testing
npm run dev -- --customer-account-push
```

**Use the tryhydrogen.dev URL** when testing:
- Customer login/logout
- Account pages
- Order history
- Profile updates

**Use localhost** for:
- UI development
- Non-authenticated pages
- General browsing

### For Production Deployment:

Your production domain is already configured, so login will work automatically once deployed.

---

## 📋 Step-by-Step: Quick Fix

### Immediate Solution (5 minutes):

1. **Stop your current dev server** (Ctrl+C)

2. **Start with customer account push**:
   ```bash
   npm run dev -- --customer-account-push
   ```

3. **Wait for the tunnel URL**:
   ```
   ┃ Tunneling URL: https://abc123.tryhydrogen.dev
   ┃ Customer Account API: Configured ✓
   ```

4. **Open the tunnel URL** in your browser

5. **Test login**:
   - Click login/account link
   - Should redirect to Shopify
   - Login with test customer
   - Should redirect back successfully

6. **Done!** ✅

---

## 🔍 Verification Steps

After applying the fix, verify:

### 1. Check Dev Server Output
```bash
npm run dev -- --customer-account-push
```

Look for:
```
✓ Tunneling URL: https://your-app.tryhydrogen.dev
✓ Customer Account API: Configured
✓ OAuth: Ready
```

### 2. Test Login Flow
1. Navigate to: `https://your-app.tryhydrogen.dev/account/login`
2. Should redirect to Shopify OAuth
3. Login with credentials
4. Should redirect to: `https://your-app.tryhydrogen.dev/account/authorize`
5. Should auto-redirect to: `https://your-app.tryhydrogen.dev/account`
6. Should see customer dashboard

### 3. Test Account Features
- [ ] View orders
- [ ] Update profile
- [ ] Manage addresses
- [ ] Logout

---

## 🐛 Troubleshooting

### Issue: Tunnel URL Not Generated

**Solution**:
```bash
# Update Shopify CLI
npm install -g @shopify/cli@latest

# Try again
npm run dev -- --customer-account-push
```

### Issue: Still Getting redirect_uri Error

**Check**:
1. Are you using the **tunnel URL** (not localhost)?
2. Is the tunnel URL shown in terminal?
3. Try clearing browser cache/cookies
4. Try incognito mode

**Fix**:
```bash
# Clear cache and restart
rm -rf .cache dist
npm run dev -- --customer-account-push
```

### Issue: Tunnel URL Changes Every Time

**This is normal**. The tunnel URL is temporary and changes on each restart.

**For persistent URL**, configure localhost in Shopify admin (Option 2).

### Issue: Can't Access Shopify Admin

**You need admin access** to configure OAuth redirect URIs.

**Solution**: Ask the store owner to:
1. Add you as staff with "Apps and channels" permission
2. Or ask them to add the redirect URIs for you

---

## 🔐 Security Considerations

### Development
- ✅ Tunnel URLs are temporary and secure
- ✅ HTTPS is automatically provided
- ✅ OAuth tokens are encrypted
- ⚠️ Don't share tunnel URLs publicly (they're for testing)

### Production
- ✅ Your live site already has proper OAuth configuration
- ✅ Production domain is registered in Shopify
- ✅ HTTPS is enforced

---

## 📊 Comparison: Tunnel vs Localhost

| Feature | Tunnel (tryhydrogen.dev) | Localhost |
|---------|-------------------------|-----------|
| OAuth Setup | Automatic ✅ | Manual configuration needed |
| HTTPS | Automatic ✅ | Requires setup |
| Mobile Testing | Works ✅ | Requires network config |
| Team Sharing | Easy ✅ | Not possible |
| Speed | Slightly slower | Faster |
| Persistence | URL changes | Stable |
| Best For | OAuth testing | UI development |

---

## 💡 Pro Tips

### 1. Use Tunnel for Customer Features
```bash
# When working on account/login features
npm run dev -- --customer-account-push
```

### 2. Use Localhost for UI Work
```bash
# When working on styling/components
npm run dev
```

### 3. Save Tunnel URL
When tunnel starts, save the URL:
```
https://abc123.tryhydrogen.dev
```
Use this URL for the entire session.

### 4. Test on Mobile
The tunnel URL works on mobile devices:
1. Start tunnel on computer
2. Open tunnel URL on phone
3. Test login flow on mobile

### 5. Share with Team
Send tunnel URL to team members for testing:
```
Hey team, test login here: https://abc123.tryhydrogen.dev
```

---

## 🎓 Understanding the Issue

### Why Does This Happen?

**OAuth Security**: Shopify requires pre-registered redirect URIs to prevent:
- Phishing attacks
- Token theft
- Unauthorized access

**The Flow**:
```
1. Your app → Shopify OAuth (with redirect_uri)
2. Shopify checks: Is this redirect_uri registered? ✅/❌
3. If ✅: Allow login
4. If ❌: Show "redirect_uri mismatch" error
```

### Why Live Site Works

Your production domain is registered in Shopify:
```
✅ https://yourdomain.com/account/authorize
```

### Why Localhost Fails

Localhost is NOT registered:
```
❌ https://localhost:3000/account/authorize
```

### Why Tunnel Works

Shopify CLI automatically registers tunnel URLs:
```
✅ https://abc123.tryhydrogen.dev/account/authorize
```

---

## 📝 Quick Reference Commands

```bash
# Start with customer account push (recommended for OAuth)
npm run dev -- --customer-account-push

# Start normal dev server
npm run dev
npm run dev

# Link to Shopify store
npx shopify hydrogen link

# Pull environment variables
npx shopify hydrogen env pull

# Update Shopify CLI
npm install -g @shopify/cli@latest

# Clear cache
rm -rf .cache dist
```

---

## ✅ Final Checklist

Before you start development:

- [ ] Shopify CLI is installed and updated
- [ ] You're in the `hydrogen-storefront` directory
- [ ] `.env` file exists with correct variables
- [ ] You know which mode to use:
  - [ ] Tunnel for OAuth testing
  - [ ] Localhost for UI development

To test customer login:

- [ ] Start dev server with tunnel
- [ ] Use the tryhydrogen.dev URL
- [ ] Test login flow
- [ ] Verify account pages work
- [ ] Test logout

---

## 🆘 Still Having Issues?

### Check Environment Variables

```bash
cat .env
```

Should have:
```env
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=bd4faebd-c7c3-49ff-b118-cf9491029541
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://shopify.com/86233186590
PUBLIC_STORE_DOMAIN=blacmelo.myshopify.com
SESSION_SECRET=2ce895c54c6a7bb1997dbf1a46a747b371fd562a
```

### Check Shopify CLI Version

```bash
npx shopify version
```

Should be 3.85.4 or higher.

### Enable Debug Mode

Add to `.env`:
```env
DEBUG=hydrogen:*
SHOPIFY_CLI_VERBOSE=1
```

Then check console output for detailed errors.

---

## 📚 Additional Resources

- [Shopify Hydrogen Dev Command](https://shopify.dev/docs/api/shopify-cli/hydrogen/hydrogen-dev)
- [Customer Account API Setup](https://shopify.dev/docs/custom-storefronts/hydrogen/customer-accounts)
- [OAuth Redirect URIs](https://www.oauth.com/oauth2-servers/redirect-uris/)
- [Shopify CLI Tunnels](https://shopify.dev/docs/api/shopify-cli/tunnels)

---

## Summary

**The Problem**: Localhost is not configured for OAuth in Shopify

**The Solution**: Use tunnel for local development
```bash
npm run dev -- --tunnel
```

**Why It Works**: Tunnel URLs are automatically registered with Shopify

**Result**: Login works exactly like production ✅
