# Quick Fix: Customer Login Not Working Locally

## 🔴 Problem
Login works on live site but fails locally with "redirect_uri mismatch" error.

## ✅ Solution (2 minutes)

### Step 1: Stop Your Current Server
Press `Ctrl+C` in your terminal

### Step 2: Start with Customer Account Push
```bash
npm run dev -- --customer-account-push
```

### Step 3: Use the Tunnel URL
Wait for output like:
```
┃ Tunneling URL: https://abc123.tryhydrogen.dev
┃ Local:         http://localhost:3000
```

### Step 4: Open Tunnel URL in Browser
Use `https://abc123.tryhydrogen.dev` (NOT localhost)

### Step 5: Test Login
Click login → Should work! ✅

---

## Why This Works

- **Live site**: Domain is configured in Shopify ✅
- **Localhost**: NOT configured in Shopify ❌
- **Tunnel URL**: Automatically configured by Shopify CLI ✅

---

## For More Details

See [LOCAL-DEVELOPMENT-OAUTH-SETUP.md](./LOCAL-DEVELOPMENT-OAUTH-SETUP.md) for:
- Alternative solutions
- Detailed explanations
- Troubleshooting steps
- Configuration options

---

## Daily Workflow

**For OAuth/Login Testing**:
```bash
npm run dev -- --customer-account-push
# Use the tryhydrogen.dev URL
```

**For UI Development**:
```bash
npm run dev
# Use localhost:3000
```

---

## That's It!

Your customer account system is fully functional - it just needs the tunnel URL for local OAuth to work.
