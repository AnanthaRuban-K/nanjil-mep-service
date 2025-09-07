# 🚀 Deployment Guide

## Prerequisites
- Hostinger VPS with Coolify installed
- Neon PostgreSQL database
- Clerk authentication setup
- Domain name configured

## Environment Variables

### Production Environment (.env.production)
```
DATABASE_URL=postgresql://user:password@host:port/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

## Coolify Deployment Steps

1. **Connect Repository**: Link your GitHub repo to Coolify
2. **Configure Services**: Set up frontend (3100) and backend (3101)
3. **Set Environment Variables**: Add all required env vars
4. **Configure Domains**: Set up your custom domains
5. **Deploy**: Trigger deployment from main branch

## Health Check Endpoints
- Frontend: `https://yourdomain.com`
- Backend: `https://api.yourdomain.com/health`

For detailed deployment instructions, see the main documentation.
EOF
```

---

## 📋 Step 2: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Configure git (replace with your details)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "🎉 Initial commit: Nanjil MEP Service monorepo

- Setup Nx monorepo with frontend (Next.js) and backend (Hono)
- Configure Tamil/English bilingual support
- Add simplified booking system
- Setup Drizzle ORM with PostgreSQL
- Configure Clerk authentication
- Add Docker and Coolify deployment configs"
```

---

## 📋 Step 3: Create GitHub Repository

### Option A: Using GitHub CLI (Recommended)
```bash
# Install GitHub CLI if not already installed
# Visit: https://cli.github.com/

# Login to GitHub
gh auth login

# Create repository
gh repo create nanjil-mep-service --public --description "Tamil MEP service booking platform with Next.js and Hono"

# Push code
git remote add origin https://github.com/yourusername/nanjil-mep-service.git
git branch -M main
git push -u origin main
```

### Option B: Using GitHub Web Interface
1. Go to [GitHub.com](https://github.com)
2. Click "+" → "New repository"
3. Repository name: `nanjil-mep-service`
4. Description: `Tamil MEP service booking platform`
5. Set to **Public** (or Private if preferred)
6. **Don't** initialize with README (we already have one)
7. Click "Create repository"
8. Follow the commands shown:

```bash
git remote add origin https://github.com/yourusername/nanjil-mep-service.git
git branch -M main
git push -u origin main
```

---

## 📋 Step 4: GitHub Repository Configuration

### Set Up Branch Protection
```bash
# Using GitHub CLI
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["build","test"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

### Or via GitHub Web Interface:
1. Go to Settings → Branches
2. Add branch protection rule for `main`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date