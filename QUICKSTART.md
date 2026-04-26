# 🚀 QUICK START GUIDE

## You're All Set! ✅

Your **NASA EONET Earth Live Dashboard** is:
- ✅ Built and compiled
- ✅ Running on http://localhost:5173
- ✅ Ready for production
- ✅ Fully documented

---

## 🎮 What You Can Do Right Now

### 1. View Live Earth Events
- Go to http://localhost:5173 in your browser
- See real-time Earth events from NASA
- Events update automatically every 5 minutes

### 2. Filter by Event Type
- Click the dropdown menu
- Select: All, Landslides, Wildfires, or Severe Storms
- Events reload instantly with new filter

### 3. Explore Event Details
- Click any event card
- See expanded details: coordinates, date, links
- Click again to collapse

### 4. Manual Refresh
- Click the "⟳ Refresh" button
- Get latest data immediately
- See "Last updated" timestamp

---

## 📝 Common Tasks

### Edit the Code
```bash
# Any file change in src/ auto-reloads in browser
# Edit, save, and see changes instantly
```

### Build for Production
```bash
npm run build
# Creates optimized dist/ folder
```

### Stop the Server
```
Press Ctrl+C in terminal
```

### Restart the Server
```bash
npm run dev
```

---

## 📂 File Guide

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main dashboard component |
| `src/App.css` | Dashboard styling |
| `src/components/EventCard.jsx` | Event card component |
| `src/services/eosnetApi.js` | API integration |
| `README.md` | Full documentation |
| `DEVELOPMENT.md` | Development guide |
| `API_REFERENCE.md` | API documentation |

---

## 🔧 Make Changes

### Add a New Event Category
1. Open `src/services/eosnetApi.js`
2. Add to `CATEGORIES` object:
```javascript
volcanoes: 'volcanoes',
```
3. Save - browser reloads automatically

### Change Refresh Interval
1. Open `src/App.jsx`
2. Find line ~49
3. Change `5 * 60 * 1000` to your desired milliseconds
4. Save - browser reloads

### Change Colors
1. Open `src/index.css`
2. Edit `:root` variables
3. Save - browser reloads

---

## 🌐 Browser Console Tips

### View API Response
```javascript
// Open F12 (Developer Tools)
// Go to Console tab
// Events load, check console for data
```

### Debug Loading State
```javascript
// Go to Console tab
// Component state shown when expanded
```

### Check Network Calls
```javascript
// Open F12 → Network tab
// Filter by XHR
// See NASA API requests
```

---

## 📱 Test on Mobile

### Option 1: Real Device
1. Find your computer's IP: `ipconfig getifaddr en0` (Mac) or check Settings (Windows)
2. On phone, visit: `http://YOUR_IP:5173`
3. See dashboard on mobile

### Option 2: Browser DevTools
1. Press F12
2. Click device icon (top-left)
3. Select iPhone/Android preset

---

## 🚀 Deploy to Live Server

### Quick Deploy to Vercel
```bash
npm install -g vercel
vercel
# Follow prompts - app goes live in seconds
```

### Deploy to Netlify
```bash
npm run build
# Go to netlify.com → Drag dist/ folder
# App is live immediately
```

### Deploy to Any Hosting
```bash
npm run build
# Upload dist/ folder to server
# Configure to serve index.html for all routes
```

---

## 🆘 If Something's Wrong

### Events not showing?
1. Check internet connection
2. Press F12 → Console → look for errors
3. Click Refresh button
4. Hard refresh page: Ctrl+Shift+R

### Styling looks broken?
1. Hard refresh: Ctrl+Shift+R
2. Clear browser cache
3. Close and reopen browser

### Server won't start?
```bash
# Port already in use? Kill it and restart
npm run dev
```

### Build fails?
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Read More

- **README.md** - Complete feature overview
- **DEVELOPMENT.md** - Technical guide
- **API_REFERENCE.md** - NASA API details
- **PROJECT_SUMMARY.md** - Project overview

---

## 🎉 You're Ready!

Everything is set up and working. Start building!

**Need help?** Check the documentation files - they have all the answers.

---

**Happy exploring! 🌍✨**
