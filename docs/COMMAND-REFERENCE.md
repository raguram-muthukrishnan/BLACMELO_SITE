# Hydrogen Dev Server Commands - Quick Reference

## 🎯 The Commands You Need

### For Customer Login Testing (OAuth)
```bash
npm run dev -- --customer-account-push
```
✅ Creates tunnel  
✅ Configures OAuth automatically  
✅ Use the tryhydrogen.dev URL  

---

### For Regular Development (No Login)
```bash
npm run dev
```
✅ Fast local development  
✅ Use localhost:3000  
❌ OAuth won't work  

---

## 📊 Command Comparison

| Command | Tunnel | OAuth | Speed | Use For |
|---------|--------|-------|-------|---------|
| `npm run dev` | ❌ No | ❌ No | Fast | UI development |
| `npm run dev -- --customer-account-push` | ✅ Yes | ✅ Yes | Medium | Login testing |
| `npm run dev -- --host` | ❌ No | ❌ No | Fast | Network access |
| `npm run dev -- --port 3001` | ❌ No | ❌ No | Fast | Different port |

---

## 🚫 Common Mistakes

### ❌ WRONG Commands

```bash
# This flag doesn't exist
npm run dev -- --tunnel

# This won't enable OAuth
npm run dev --customer-account-push

# Missing the double dash
npm run dev -customer-account-push
```

### ✅ CORRECT Command

```bash
# This is the right way
npm run dev -- --customer-account-push
```

**Note the double dash `--`** before the flag!

---

## 🔍 Available Flags

From `npx shopify hydrogen dev --help`:

### OAuth & Customer Accounts
- `--customer-account-push` - Enable tunneling and push domain to admin (for OAuth)

### Code Generation
- `--codegen` - Auto-generate GraphQL types
- `--codegen-config-path <path>` - Custom codegen config

### Development
- `--debug` - Enable debugger connections
- `--inspector-port <port>` - Set inspector port (default: 9229)
- `--port <port>` - Set server port (default: 3000)
- `--host` - Expose server to local network

### Environment
- `--env <handle>` - Use specific environment
- `--env-branch <branch>` - Use environment by branch name
- `--env-file <path>` - Custom .env file path

### Advanced
- `--disable-deps-optimizer` - Disable Vite dependency optimization
- `--disable-version-check` - Skip version check
- `--disable-virtual-routes` - Disable fallback routes
- `--entry <file>` - Custom entry file
- `--path <path>` - Custom project path
- `--verbose` - More detailed output

---

## 💡 Common Combinations

### Development with GraphQL Codegen
```bash
npm run dev -- --codegen
```

### OAuth Testing with Codegen
```bash
npm run dev -- --customer-account-push --codegen
```

### Debug Mode
```bash
npm run dev -- --debug --inspector-port 9229
```

### Custom Port
```bash
npm run dev -- --port 3001
```

### Network Access (for mobile testing without tunnel)
```bash
npm run dev -- --host
```

### Verbose Output (for troubleshooting)
```bash
npm run dev -- --verbose
```

---

## 🎓 Understanding the Double Dash

### Why `--` is Required

```bash
npm run dev -- --customer-account-push
           ↑
           This double dash separates npm flags from script flags
```

**Without `--`**:
- npm tries to interpret the flag
- Flag is not passed to the script
- Command fails

**With `--`**:
- npm passes everything after `--` to the script
- Script receives the flag correctly
- Command works

---

## 📋 Quick Decision Tree

```
Do you need to test customer login?
├─ YES → npm run dev -- --customer-account-push
│        Use tryhydrogen.dev URL
│
└─ NO → npm run dev
         Use localhost:3000
```

---

## 🚀 Recommended Workflow

### Morning Setup
```bash
# Start with OAuth enabled
npm run dev -- --customer-account-push --codegen
```

### Quick UI Changes
```bash
# Use regular dev server (faster)
npm run dev
```

### Testing Login Flow
```bash
# Switch back to OAuth mode
npm run dev -- --customer-account-push
```

---

## 🐛 Troubleshooting Commands

### Check Shopify CLI Version
```bash
npx shopify version
```

### Update Shopify CLI
```bash
npm install -g @shopify/cli@latest
```

### Link to Shopify Store
```bash
npx shopify hydrogen link
```

### Pull Environment Variables
```bash
npx shopify hydrogen env pull
```

### Clear Cache and Restart
```bash
rm -rf .cache dist
npm run dev -- --customer-account-push
```

---

## 📚 More Help

- [CORRECT-LOGIN-FIX.md](./CORRECT-LOGIN-FIX.md) - Fix login issues
- [LOCAL-DEVELOPMENT-OAUTH-SETUP.md](./LOCAL-DEVELOPMENT-OAUTH-SETUP.md) - Complete OAuth setup
- [CUSTOMER-ACCOUNTS-README.md](./CUSTOMER-ACCOUNTS-README.md) - Full documentation index

---

## Summary

**For Login Testing**: `npm run dev -- --customer-account-push`  
**For UI Development**: `npm run dev`  
**Remember**: Use the tunnel URL (tryhydrogen.dev) for OAuth testing
