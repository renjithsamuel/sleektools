# GitHub Workflows Setup Guide

This guide explains how each GitHub workflow works and what setup is required for a new repository.

## 🟢 Ready to Use (No Setup Required)

### 1. `ci.yml` - Continuous Integration
**✅ Works immediately** when you push to GitHub.

**What it does:**
- Runs on every push/PR to `main` or `develop` branches
- Tests on Node.js 18.x and 20.x
- Validates TypeScript types (`yarn type-check`)
- Checks ESLint rules (`yarn lint:check`)
- Verifies Prettier formatting (`yarn format:check`)
- Builds the application (`yarn build`)
- Runs security audit (`yarn audit`)
- Analyzes bundle size

**No secrets or configuration needed!**

### 2. `code-quality.yml` - Extended Quality Checks
**✅ Works immediately** with basic functionality.

**What it does:**
- Additional code quality validation
- Dependency analysis (gracefully handles missing tools)
- Basic code complexity metrics

## 🟡 Optional Setup Required

### 3. `deploy.yml` - Production Deployment
**⚠️ Requires Vercel setup** for deployment (but runs without it).

**What it does:**
- Runs on pushes to `main` branch
- Validates and builds the application
- Deploys to Vercel (if configured)
- Shows alternative deployment options (if Vercel not configured)

## 🔧 Setting Up Vercel Deployment (Optional)

If you want automatic deployment to Vercel, follow these steps:

### Step 1: Get Vercel Information

1. **Create a Vercel account** at [vercel.com](https://vercel.com)
2. **Import your GitHub repository** to Vercel
3. **Get your Vercel token:**
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Create a new token
   - Copy the token value

4. **Get your Organization and Project IDs:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and link project
   vercel login
   vercel link
   
   # Get IDs (run in your project folder)
   vercel env ls
   ```
   
   Or find them in your Vercel project settings URL:
   - `https://vercel.com/[ORG_ID]/[PROJECT_NAME]`

### Step 2: Add GitHub Secrets

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:

| Secret Name | Description | Where to Find |
|-------------|-------------|---------------|
| `VERCEL_TOKEN` | Your Vercel API token | Vercel Account Settings → Tokens |
| `VERCEL_ORG_ID` | Your Vercel organization ID | Vercel project settings or CLI |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Vercel project settings or CLI |

### Step 3: Test the Deployment

1. Push to the `main` branch
2. Check the **Actions** tab in GitHub
3. The deployment workflow should run and deploy to Vercel

## 🌐 Alternative Deployment Options

If you don't want to use Vercel, you can deploy to other platforms:

### Netlify
1. Connect your GitHub repo to Netlify
2. Set build command: `yarn build`
3. Set publish directory: `.next`

### GitHub Pages (Static Export)
1. Add to `package.json`:
   ```json
   "scripts": {
     "export": "next build && next export"
   }
   ```
2. Use GitHub Pages action with the exported files

### Railway
1. Connect your GitHub repo to Railway
2. Railway auto-detects Next.js projects

### Self-Hosted
1. Run `yarn build` to create production build
2. Use `yarn start` or serve the `.next` folder

## 🔍 Workflow Status Badges

Add these badges to your README.md:

```markdown
[![CI](https://github.com/yourusername/sleektools/workflows/CI/badge.svg)](https://github.com/yourusername/sleektools/actions)
[![Deploy](https://github.com/yourusername/sleektools/workflows/Deploy%20to%20Production/badge.svg)](https://github.com/yourusername/sleektools/actions)
```

## 🐛 Troubleshooting

### Workflow Fails on First Run
- **Solution:** Make sure your `package.json` scripts exist
- Check that `yarn install` works locally
- Verify `yarn build` succeeds locally

### Vercel Deployment Fails
- **Check secrets:** Ensure all three Vercel secrets are correctly set
- **Verify permissions:** Make sure the Vercel token has the right permissions
- **Check project linking:** Ensure the project is properly linked in Vercel

### Security Audit Fails
- **Solution:** Run `yarn audit --fix` locally to fix known vulnerabilities
- Update dependencies with `yarn upgrade`

## 📝 Customizing Workflows

### Change Branch Names
Edit the `on` section in workflows:
```yaml
on:
  push:
    branches: [ main, develop, your-branch ]
```

### Skip Workflows
Add to commit message:
```bash
git commit -m "your message [skip ci]"
```

### Add More Node Versions
Edit the matrix in `ci.yml`:
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]
```

## 🎯 What Runs When

| Trigger | ci.yml | code-quality.yml | deploy.yml |
|---------|--------|------------------|------------|
| Push to main | ✅ | ✅ | ✅ |
| Push to develop | ✅ | ❌ | ❌ |
| Pull Request | ✅ | ✅ | ❌ |
| Manual trigger | ❌ | ❌ | ✅ |

Your repository is ready to use with professional CI/CD pipelines! 🚀
