# 📤 GitHub Upload Guide

Your project is now **100% ready for GitHub**! Follow these step-by-step instructions to upload your project.

---

## 📋 Pre-Upload Checklist ✅

- [x] `.gitignore` configured (excludes node_modules, dist, etc.)
- [x] `package.json` updated with proper metadata
- [x] `README.md` optimized for GitHub
- [x] `LICENSE` file added (MIT)
- [x] `CODE_OF_CONDUCT.md` included
- [x] `CONTRIBUTING.md` included
- [x] GitHub issue templates added
- [x] Pull request template added
- [x] GitHub Actions CI/CD workflow added
- [x] All documentation files included
- [x] No sensitive files or secrets

---

## 🚀 STEP-BY-STEP UPLOAD INSTRUCTIONS

### **STEP 1: Create a GitHub Repository**

1. Go to [GitHub.com](https://github.com)
2. Click **"+" icon** → **"New repository"**
3. Fill in:
   - **Repository name**: `earth-live-events`
   - **Description**: `A production-ready Earth event monitoring dashboard powered by NASA EONET API v3`
   - **Visibility**: Choose **Public** (or Private if you prefer)
   - **Initialize repository**: **DO NOT** check any boxes (we have files already)
4. Click **"Create repository"**

### **STEP 2: Open Command Prompt in Your Project**

```bash
# Navigate to your project folder
cd "C:\Users\Abdul\Github Issues\Nasa"
```

### **STEP 3: Initialize Git Repository Locally**

```bash
# Initialize git
git init

# Add all files to staging
git add .

# Create first commit
git commit -m "Initial commit: Add Earth Live Events Dashboard"
```

**What you'll see:**
```
[main (root-commit) abc1234] Initial commit: Add Earth Live Events Dashboard
 25 files changed, 8500+ insertions(+)
 ...
```

### **STEP 4: Add Remote Repository**

Replace `YOUR-USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR-USERNAME/earth-live-events.git
```

**Verify it worked:**
```bash
git remote -v
# Should show:
# origin  https://github.com/YOUR-USERNAME/earth-live-events.git (fetch)
# origin  https://github.com/YOUR-USERNAME/earth-live-events.git (push)
```

### **STEP 5: Rename Branch to Main (if needed)**

```bash
# Check current branch
git branch

# If it's "master", rename to "main"
git branch -M main
```

### **STEP 6: Push to GitHub**

```bash
# Push your code to GitHub
git push -u origin main
```

**First time?** You may be prompted to authenticate:
- **Option A**: Login with browser (recommended)
- **Option B**: Use Personal Access Token (see below)

---

## 🔐 If Prompted for Authentication

### Using Personal Access Token (Recommended)

1. Go to GitHub Settings → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Set permissions:
   - ✅ `repo` (full control of private repositories)
   - ✅ `workflow` (for GitHub Actions)
4. Click **"Generate token"**
5. **Copy the token** (you'll only see it once!)
6. When Git asks for password, paste the token

**Or use Git Credential Manager** (easier):
- Git will prompt you to login with your browser
- Click the link and authorize
- Done!

---

## ✅ Verify Upload was Successful

1. Go to **GitHub.com** → Your repository
2. You should see:
   - ✅ All your files uploaded
   - ✅ `README.md` displayed on main page
   - ✅ Green checkmark next to commit (if GitHub Actions ran)
   - ✅ Proper file structure visible

**Check GitHub Actions:**
1. Click **"Actions"** tab
2. Look for your commit
3. Should show **"Build & Lint"** workflow with ✅ status

---

## 📝 Post-Upload: Update package.json

After uploading, update the GitHub URLs in your repository. Edit `package.json`:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR-USERNAME/earth-live-events.git"
},
"bugs": {
  "url": "https://github.com/YOUR-USERNAME/earth-live-events/issues"
},
"homepage": "https://github.com/YOUR-USERNAME/earth-live-events#readme"
```

**Then commit the change:**
```bash
git add package.json
git commit -m "Update GitHub URLs in package.json"
git push
```

---

## 🚀 Optional: Setup for Deployment

### Deploy to Vercel (Automatic)

1. Go to [Vercel.com](https://vercel.com)
2. Click **"New Project"**
3. **Import Git Repository** → Select your GitHub repo
4. Click **"Import"**
5. Vercel will auto-build and deploy!
6. Your app will be live at: `https://earth-live-events.vercel.app`

### Deploy to Netlify (Automatic)

1. Go to [Netlify.com](https://netlify.com)
2. Click **"New site from Git"**
3. Select GitHub → Authorize → Choose your repo
4. Netlify will auto-build and deploy!
5. Your app will be live at: `https://earth-live-events.netlify.app`

---

## 🔄 Workflow: Making Changes Later

After initial upload, use this workflow for any updates:

```bash
# Make changes to files
# (edit code in your editor)

# Stage changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
```

**That's it!** GitHub, GitHub Actions, and (if configured) your deployment platform will all update automatically.

---

## 📚 Important Files & What They Do

| File | Purpose |
|------|---------|
| `.gitignore` | Excludes node_modules, dist from upload |
| `package.json` | Project metadata & dependencies |
| `README.md` | Main GitHub page content |
| `LICENSE` | MIT License terms |
| `CODE_OF_CONDUCT.md` | Community guidelines |
| `CONTRIBUTING.md` | Contribution guidelines |
| `.github/workflows/build.yml` | Automated CI/CD checks |
| `.github/ISSUE_TEMPLATE/` | GitHub issue templates |
| `.github/pull_request_template.md` | PR template |

---

## 🎯 Common Git Commands for Later

```bash
# Check status
git status

# See recent commits
git log --oneline

# Create new branch for feature
git checkout -b feature/new-feature

# Switch between branches
git checkout main
git checkout feature/new-feature

# Merge feature into main
git checkout main
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature

# See all branches
git branch -a

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## 🆘 Troubleshooting

### "fatal: not a git repository"
```bash
cd /correct/path/to/earth-live-events
git init
```

### "Permission denied (publickey)"
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR-USERNAME/earth-live-events.git
git push
```

### "Everything up-to-date" but changes aren't showing
```bash
# Make sure you staged and committed
git add .
git commit -m "Your message"
git push
```

### Want to start over?
```bash
# Remove git history
rm -rf .git

# Start fresh
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/earth-live-events.git
git branch -M main
git push -u origin main
```

---

## ✨ After Upload: Next Steps

1. **Share Your Repo**: Send the link to friends/portfolio
2. **Add Topics**: Go to repo → About → Add topics (nasa, earth, react, etc.)
3. **Star it**: Click Star on your own repo 😄
4. **Enable Discussions**: Settings → Discussions (optional)
5. **Add Shields**: Add status badges to README from [shields.io](https://shields.io)
6. **Create Releases**: Add version releases for users to download

---

## 📌 Important Notes

- **node_modules** is NOT uploaded (`.gitignore` excludes it)
- Users installing from GitHub will run `npm install` to get dependencies
- **dist/** is NOT uploaded (production builds are created on demand)
- All your documentation files ARE uploaded
- Source code files ARE uploaded
- Your GitHub Actions workflow will auto-run on each push

---

## 🎉 You're Done!

Your project is now on GitHub! 

**Your repository URL**: `https://github.com/YOUR-USERNAME/earth-live-events`

---

## 📞 Need Help?

- **Git Issues**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com
- **GitHub Help**: https://docs.github.com

---

**Last Updated**: April 2026  
**Status**: Ready for Upload ✅
