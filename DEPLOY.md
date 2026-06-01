# 🚀 Deploying ShopIndia to Vercel

This guide walks you through deploying this React (Create React App) project to [Vercel](https://vercel.com).

---

## ✅ Prerequisites

- A [GitHub](https://github.com) account (you already have one — repo: `SubhamBhowmik/eccomerce_frontent`)
- A [Vercel](https://vercel.com) account (free tier is fine — sign up with GitHub)
- Node.js 14+ and npm 6+ (only needed if you want to test locally)

---

## 📋 What's Already Configured

This repo is **already deployment-ready**:

- ✅ `vercel.json` — Vercel build config + SPA rewrites + security/cache headers
- ✅ `package.json` — Standard CRA scripts (`build`, `start`, `test`)
- ✅ `.gitignore` — Excludes `node_modules`, `build`, `.env`, archives, etc.
- ✅ Git remote is set to `https://github.com/SubhamBhowmik/eccomerce_frontent.git`

---

## 🌐 Deployment Steps (Web UI — Recommended)

### 1. Push the latest code to GitHub
From the project root:
```bash
git add .
git commit -m "chore: vercel deployment config"
git push origin master
```

### 2. Import the project on Vercel
1. Go to <https://vercel.com/new>
2. Click **"Import Git Repository"**
3. Select **`SubhamBhowmik/eccomerce_frontent`**
4. Click **Import**

### 3. Configure the project
Vercel auto-detects **Create React App**, so most settings are correct out-of-the-box:

| Setting | Value |
|---|---|
| **Framework Preset** | Create React App *(auto-detected)* |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |
| **Install Command** | `npm install --legacy-peer-deps` |
| **Root Directory** | `./` |

> ⚠️ If Vercel doesn't auto-pick the `installCommand`, copy it from `vercel.json`. Vercel reads that file and uses those defaults.

### 4. (Optional) Add Environment Variables
Your app currently has **no environment variables** — all API URLs are hardcoded in `src/constants/api.constants.js`. If you want to externalize them later:

1. In the Vercel project settings → **Environment Variables**
2. Add e.g. `REACT_APP_API_BASE_URL` = `https://eccomerce-spring-2.onrender.com`
3. Update the code to read from `process.env.REACT_APP_API_BASE_URL`
4. Redeploy

> 💡 CRA only exposes env vars prefixed with `REACT_APP_` to the browser bundle.

### 5. Click **Deploy** 🎉
- Build takes ~1–2 minutes
- You'll get a live URL like `https://eccomerce-frontent.vercel.app`
- Every push to `master` triggers an automatic redeploy

---

## 🛠️ Alternative: Deploy from the CLI

If you prefer the command line:

```bash
# 1. Install the Vercel CLI
npm i -g vercel

# 2. Login to your Vercel account
vercel login

# 3. From the project root, run:
vercel

# Follow the prompts:
#   ? Set up and deploy? → Y
#   ? Which scope? → Select your account
#   ? Link to existing project? → N
#   ? What's your project's name? → shopindia
#   ? In which directory is your code located? → ./
#   ? Want to override the settings? → N

# 4. For production deployment:
vercel --prod
```

---

## 🔁 Continuous Deployment

Once connected, Vercel automatically:
- Deploys every push to `master` to **production**
- Creates a unique preview URL for every **pull request**
- Runs the build in an isolated environment
- Provides HTTPS, CDN, and edge caching for free

---

## 🧯 Troubleshooting

### "Build failed" — dependency errors
Make sure `package-lock.json` is committed. The `--legacy-peer-deps` flag in `vercel.json` resolves React 18 / older peer-dep conflicts.

### "404" on routes like `/cart` or `/product/123`
The `rewrites` block in `vercel.json` handles this — it routes any non-asset path to `/index.html` so React Router can take over.

### "API calls fail in production"
Your backend is on `*.onrender.com` (free tier). It may be **asleep** — first request can take 30+ seconds to wake up. Subsequent requests are fast.

### "CORS errors" in the browser console
**This is already solved!** The `vercel.json` rewrites proxy all `/api/*` calls through Vercel (server-to-server), so the browser only ever talks to `https://your-app.vercel.app` — no cross-origin requests, no CORS errors. The proxy then forwards to the appropriate Render backend.

If you ever switch to a different deployment target and lose the proxy, you'll need to add the Vercel URL (e.g. `https://shopindia.vercel.app`) to each backend's CORS allowed-origins list.

### "Want a custom domain?"
Project Settings → **Domains** → Add your domain. Vercel handles DNS + SSL automatically.

---

## 📊 Useful Vercel URLs

- **Dashboard:** <https://vercel.com/dashboard>
- **Docs:** <https://vercel.com/docs>
- **CLI Docs:** <https://vercel.com/docs/cli>
- **Support:** <https://vercel.com/support>

---

## 🎯 Quick Recap

```bash
# 1. Push to GitHub
git add . && git commit -m "deploy: vercel config" && git push origin master

# 2. Go to https://vercel.com/new and import the repo
# 3. Click Deploy
# 4. Done — your site is live 🚀
```

**Built with ❤️ for Indian e-commerce excellence.**
