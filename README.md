# 🇳🇬 Feranmite Tweet AI
> Unlimited AI-powered tweet generator for Nigerian tech lifestyle · Powered by FeranmiteTech

---

## 🚀 Deploy to Vercel in 5 Steps

### Step 1 — Get your Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`) — save it somewhere safe

---

### Step 2 — Set up the project locally
Make sure you have **Node.js 18+** installed. Then:

```bash
# 1. Unzip the project folder
# 2. Open terminal inside the folder, then run:

npm install
```

---

### Step 3 — Add your API key locally (for testing)
```bash
# Copy the example env file
cp .env.example .env.local

# Open .env.local and replace the placeholder:
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
```

Test it locally:
```bash
npm run dev
# Open http://localhost:3000
```

---

### Step 4 — Push to GitHub
```bash
git init
git add .
git commit -m "Feranmite Tweet AI - initial deploy"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/feranmite-app.git
git push -u origin main
```

---

### Step 5 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Select your `feranmite-app` repo
4. Click **"Environment Variables"** and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-real-key-here`
5. Click **Deploy** ✅

Your app will be live at:
```
https://feranmite-app.vercel.app
```
You can also add a custom domain (e.g. `feranmitetech.com`) in Vercel settings.

---

## 🔒 Security
- Your API key is stored only in Vercel's environment variables
- It **never** touches the browser — all Claude API calls go through `/api/generate`
- The `.gitignore` ensures `.env.local` is never committed to GitHub

---

## 📁 Project Structure
```
feranmite-app/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.js       ← Secure backend (API key lives here)
│   ├── components/
│   │   └── TweetApp.js        ← Full frontend UI
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── .env.example               ← Copy this to .env.local
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

---

## ✨ Features
- ⚡ Unlimited AI tweet generation (never repeats)
- 🎯 10 categories (Freedom, Wealth, Grind, Remote Work, Freelancing + more)
- ✍️ Custom angle input for specific tweet ideas
- 📅 Weekly scheduling calendar (3 slots/day)
- 🔖 Save favourite tweets
- 📚 Full history of generated tweets
- 📋 One-click copy & post directly to X/Twitter

---

Built with Next.js 14 · Anthropic Claude · Powered by FeranmiteTech 🇳🇬
