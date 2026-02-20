# ✅ CORRECT Solution: Customer Login Fix

## 🎯 The Right Command

```bash
npm run dev -- --customer-account-push
```

**NOT** `--tunnel` (that flag doesn't exist)

---

## 📋 Step-by-Step Fix

### 1. Stop Current Server
Press `Ctrl+C` in your terminal

### 2. Start with Customer Account Push
```bash
cd hydrogen-storefront
npm run dev -- --customer-account-push
```

### 3. Wait for Tunnel URL
You'll see output like:
```
┃ Tunneling URL: https://abc123-def456.tryhydrogen.dev
┃ Local:         http://localhost:3000
┃ 
┃ Customer Account API: Configured ✓
┃ Pushing tunnel URL to Shopify admin...
```

### 4. Use the Tunnel URL
**Important**: Use the `tryhydrogen.dev` URL, NOT `localhost:3000`

Example:
- ✅ `https://abc123-def456.tryhydrogen.dev/account/login`
- ❌ `http://localhost:3000/account/login`

### 5. Test Login
1. Open the tunnel URL in your browser
2. Click login or go to `/account/login`
3. Should redirect to Shopify OAuth
4. Login with your credentials
5. Should redirect back successfully
6. You're logged in! ✅

---

## 🔍 What This Flag Does

The `--customer-account-push` flag:

1. **Creates a tunnel**: Generates a public HTTPS URL
2. **Pushes to Shopify**: Automatically registers the URL in Shopify admin
3. **Configures OAuth**: Sets up redirect URIs for Customer Account API
4. **Enables login**: Makes OAuth work locally

---

## 💡 Why You Need This

**The Problem**:
- OAuth requires pre-registered redirect URIs
- Your live site domain is registered ✅
- Localhost is NOT registered ❌

**The Solution**:
- `--customer-account-push` creates a tunnel
- Automatically registers it with Shopify
- OAuth works immediately

---

## 🚀 Daily Workflow

### For OAuth/Login Testing
```bash
npm run dev -- --customer-account-push
```
Use the **tryhydrogen.dev URL**

### For UI Development (No Login Needed)
```bash
npm run dev
```
Use **localhost:3000**

---

## 🐛 Troubleshooting

### Issue: "Nonexistent flag: --tunnel"
**Solution**: Use `--customer-account-push` instead

### Issue: Tunnel URL not showing
**Check**: 
- Is Shopify CLI up to date?
- Do you have internet connection?
- Are you in the correct directory?

**Fix**:
```bash
npm install -g @shopify/cli@latest
cd hydrogen-storefront
npm run dev -- --customer-account-push
```

### Issue: Still getting redirect_uri error
**Check**: Are you using the tunnel URL (not localhost)?

**Verify**:
1. Look at the URL in your browser
2. Should be: `https://something.tryhydrogen.dev`
3. Should NOT be: `http://localhost:3000`

### Issue: Tunnel is slow
**This is normal**: Tunnel adds slight latency

**Alternative**: Configure localhost manually in Shopify admin (see full docs)

---

## 📊 Command Comparison

| Command | Purpose | OAuth Works? |
|---------|---------|--------------|
| `npm run dev` | Local development | ❌ No |
| `npm run dev -- --customer-account-push` | OAuth testing | ✅ Yes |
| `npm run dev -- --host` | Network access | ❌ No |
| `npm run dev -- --port 3001` | Different port | ❌ No |

---

## ✅ Success Checklist

After running the command, verify:

- [ ] Terminal shows "Tunneling URL"
- [ ] Terminal shows "Customer Account API: Configured ✓"
- [ ] Can access site via tryhydrogen.dev URL
- [ ] Login redirects to Shopify
- [ ] After login, redirects back to your site
- [ ] Can see account dashboard
- [ ] Can view orders
- [ ] Can update profile
- [ ] Can manage addresses
- [ ] Logout works

---

## 📚 More Information

- [Full Setup Guide](./LOCAL-DEVELOPMENT-OAUTH-SETUP.md)
- [Problem Explanation](./LOGIN-PROBLEM-SOLUTION.md)
- [System Overview](./CUSTOMER-ACCOUNT-SYSTEM.md)
- [Implementation Status](./CUSTOMER-ACCOUNT-STATUS.md)

---

## 🎓 Understanding the Flag

### What `--customer-account-push` Does

```
1. Creates tunnel:
   https://abc123.tryhydrogen.dev

2. Pushes to Shopify:
   POST /admin/api/customer-account-api/redirect-uris
   Body: { uri: "https://abc123.tryhydrogen.dev/account/authorize" }

3. Shopify registers it:
   ✅ Redirect URI added to allowed list

4. OAuth works:
   Login → Shopify → Redirect back → Success!
```

### Why It's Better Than Manual Configuration

**Manual Configuration**:
- Go to Shopify admin
- Find your app
- Add redirect URI
- Save
- Restart server
- Test

**With `--customer-account-push`**:
- Run one command
- Everything configured automatically
- Ready to test immediately

---

## 💡 Pro Tips

1. **Bookmark the tunnel URL** during your session
   - It stays the same until you restart
   - Changes on next restart

2. **Use for mobile testing**
   - Tunnel URL works on any device
   - Great for responsive testing

3. **Share with team**
   - Send tunnel URL to teammates
   - They can test login too

4. **Keep terminal open**
   - Don't close the terminal
   - Tunnel stays active while server runs

5. **Check the output**
   - Look for "Customer Account API: Configured ✓"
   - This confirms OAuth is ready

---

## 🆘 Still Having Issues?

### Check Your Setup

1. **Verify you're in the right directory**:
   ```bash
   pwd
   # Should show: .../hydrogen-storefront
   ```

2. **Check Shopify CLI version**:
   ```bash
   npx shopify version
   # Should be 3.85.4 or higher
   ```

3. **Verify environment variables**:
   ```bash
   cat .env
   # Should have PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
   ```

4. **Try linking first**:
   ```bash
   npx shopify hydrogen link
   npx shopify hydrogen env pull
   npm run dev -- --customer-account-push
   ```

---

## Summary

**Correct Command**: `npm run dev -- --customer-account-push`

**What It Does**: Creates tunnel + configures OAuth automatically

**Use The**: Tunnel URL (tryhydrogen.dev), NOT localhost

**Result**: Login works! ✅
