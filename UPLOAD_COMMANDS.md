# 🚀 GITHUB UPLOAD - QUICK COMMANDS

Copy and paste these commands in order. Replace `YOUR-USERNAME` with your actual GitHub username.

---

## 📌 STEP-BY-STEP COMMANDS

### 1️⃣ Navigate to Project Folder
```bash
cd "C:\Users\Abdul\Github Issues\Nasa"
```

### 2️⃣ Initialize Git & Create First Commit
```bash
git init
git add .
git commit -m "Initial commit: Add Earth Live Events Dashboard"
```

### 3️⃣ Add GitHub Repository URL
```bash
git remote add origin https://github.com/YOUR-USERNAME/earth-live-events.git
```

### 4️⃣ Rename Branch to Main (if needed)
```bash
git branch -M main
```

### 5️⃣ Push to GitHub
```bash
git push -u origin main
```

---

## ✅ AFTER FIRST PUSH: Making Updates

For any future changes:

```bash
git add .
git commit -m "Description of your changes"
git push
```

---

## 📋 WHAT YOU NEED TO DO FIRST

**BEFORE running the commands above:**

1. Go to **GitHub.com**
2. Click **"+" icon** → **"New repository"**
3. Name it: `earth-live-events`
4. Click **"Create repository"**
5. **DO NOT** click "Add a README" or any other options
6. Click the **Code** button → Copy the **HTTPS URL**
7. It will look like: `https://github.com/YOUR-USERNAME/earth-live-events.git`

---

## 🔐 AUTHENTICATION

When you run `git push`, you may see a login prompt:

**Option A: Browser Login (Easiest)**
- Click the link provided
- Login with your GitHub account
- Grant permission
- Done!

**Option B: Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Check: `repo` and `workflow`
4. Generate and copy the token
5. When asked for password, paste the token

---

## ✨ VERIFICATION

After `git push` completes, verify on GitHub:

1. Go to **GitHub.com → Your Repository**
2. You should see ✅:
   - All your files
   - README.md displayed
   - Green checkmark (build passed)
   - Recent commit shown

---

## 🎯 THAT'S IT!

Your project is now on GitHub! 

**Share your repo:** `https://github.com/YOUR-USERNAME/earth-live-events`

---

## 📚 DETAILED GUIDE

For more detailed instructions, see: **GITHUB_UPLOAD.md**

---

**You've got this! 🚀**
