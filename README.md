# 🚀 PickSpy - AI-Powered Trending Product Discovery

**A platform to discover trending products on Amazon using AI analysis, Reddit sentiment tracking, and real-time market signals.**

---

## 🎯 Quick Links

- **🛡️ [PROD-GUARD READINESS](prod-guard/README.md)** - Security & Deployment Gate
- **🚀 [QUICK DEPLOY GUIDE](QUICK_DEPLOY.md)** - Deploy in 30 minutes
- **📚 [DEPLOYMENT GUIDE](DEPLOYMENT_GUIDE.md)** - Detailed deployment instructions
- **🗄️ [DATABASE SETUP](SUPABASE_SETUP_FINAL.sql)** - Supabase configuration

---

## ✨ Features

- 🔍 **Smart Product Discovery**: Find trending products before they become mainstream.
- 🤖 **AI-Enhanced Analysis**: Powered by Google Gemini & OpenRouter for deep market insights.
- 📊 **Real-time Market Signals**: Velocity scores, saturation analysis, and growth tracking.
- 💬 **Reddit Sentiment Tracking**: Native integration to monitor community discussions and hype.
- 🎥 **Social Proof Integration**: Viral Instagram reels and social signals directly on product pages.
- 🛡️ **Production-Ready**: Built-in "Prod-Guard" security gates to prevent unsafe deployments.

---

## 🛠 Tech Stack

**Frontend**: React 18, TypeScript, Vite, TailwindCSS, Shadcn UI
**Backend**: Python 3, FastAPI, Modal (Serverless Scrapers)
**Database**: PostgreSQL (via Supabase)
**AI**: Google Gemini, OpenRouter (Llama 3.1 Sonar)

---

## 🔐 Security & Environment Variables

To ensure your API keys and secrets are never leaked, PickSpy uses environment variables exclusively. **Never commit your `.env` file.**

### Required Variables

| Variable                    | Source                                           | Purpose                               |
| --------------------------- | ------------------------------------------------ | ------------------------------------- |
| `VITE_SUPABASE_URL`         | Supabase Settings                                | Frontend database connection          |
| `VITE_SUPABASE_ANON_KEY`    | Supabase Settings                                | Frontend public access                |
| `VITE_BACKEND_API_URL`      | Render/Modal                                     | URL of your deployed backend          |
| `SUPABASE_URL`              | Supabase Settings                                | Backend database connection           |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings                                | **SECRET** Admin access for crawler   |
| `OPENROUTER_API_KEY`        | [OpenRouter](https://openrouter.ai/)             | **SECRET** AI analysis credits        |
| `GEMINI_API_KEY`            | [Google AI Studio](https://aistudio.google.com/) | **SECRET** Fallback AI analysis       |
| `FORM_SECRET`               | Custom String                                    | **SECRET** Security for support forms |

---

## 🚀 How to Make Everything Working Fine (Production)

Follow these steps to ensure a flawless production environment:

### 1. Configure GitHub Secrets (For CI/CD Gate)

The "Prod-Guard" gate in your CI/CD pipeline needs these variables to run readiness tests.

1. Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret** for each of the following:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENROUTER_API_KEY`
   - `FORM_SECRET`

### 2. Configure Vercel (Frontend)

1. Go to your Vercel Project -> **Settings** -> **Environment Variables**.
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_BACKEND_API_URL` (Set this to your Render or Modal URL)

### 3. Configure Modal (Scrapers)

If you are using Modal for serverless scraping:

1. Run `modal secret create pickspy-secrets` in your terminal.
2. Add all secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, `INSTAGRAM_USERNAME`, `INSTAGRAM_PASSWORD`, `FORM_SECRET`.

### 4. Configure Render (Backend API)

1. Go to your Render Dashboard -> **Environment**.
2. Add all backend secrets listed in the table above.

---

## 📁 Project Structure

```text
pickspyv2/
├── src/                    # React Frontend
├── backend/               # Python FastAPI & Scrapers
├── prod-guard/            # Production Readiness CLI
├── tests/                 # End-to-end readiness tests
├── .github/workflows/     # CI/CD (GitHub Actions)
└── prod-guard.yml         # Readiness Policy
```

---

**Made with ❤️ by PickSpy Team**

- [Enterprise Extraction](https://www.entrext.in)
- [Linktree](https://linktr.ee/entrext.pro)
