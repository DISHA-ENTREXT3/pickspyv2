# 🚀 PickSpy - AI-Powered Trending Product Discovery

**A platform to discover trending products on Amazon using AI analysis, Reddit sentiment tracking, and real-time market signals.**

---

## ✨ Features

- 🔍 **Smart Product Discovery**: Find trending products before they become mainstream.
- 🤖 **AI-Enhanced Analysis**: Powered by Google Gemini 2.5 Flash Lite via Pollinations.ai.
- 📊 **Real-time Market Signals**: Velocity scores, saturation analysis, and growth tracking.
- 💬 **Reddit Sentiment Tracking**: Native integration to monitor community discussions.
- 🎥 **Social Proof Integration**: Viral Instagram reels and social signals.
- 🛡️ **Multi-Cloud Architecture**: Optimized for performance and security using industry-leading platforms.

---

## 🛠 Tech Stack & Platforms

| Component          | Platform                                | Description                               |
| :----------------- | :-------------------------------------- | :---------------------------------------- |
| **Frontend**       | [Vercel](https://vercel.com)            | React 18, TypeScript, Vite                |
| **Backend**        | [Modal](https://modal.com)              | Python FastAPI, Serverless Scrapers       |
| **Main Database**  | [Supabase (A)](https://supabase.com)    | PostgreSQL, Auth, Real-time Data          |
| **Support System** | [Supabase (B)](https://supabase.com)    | Dedicated account for Concierge & Tickets |
| **AI Engine**      | [Pollinations](https://pollinations.ai) | Google Gemini 2.5 Flash Lite              |

---

## 🔐 Environment Variables

PickSpy uses environment variables to manage connections across different accounts. **Never commit your `.env` file.**

### Required Variables

| Variable                    | Platform | Purpose                                                          |
| :-------------------------- | :------- | :--------------------------------------------------------------- |
| `VITE_SUPABASE_URL`         | Vercel   | Main DB (Account A) URL                                          |
| `VITE_SUPABASE_ANON_KEY`    | Vercel   | Main DB (Account A) Public Key                                   |
| `VITE_BACKEND_API_URL`      | Vercel   | Your [Modal](https://modal.com/apps/disha-entrext3/main) API URL |
| `SUPABASE_URL`              | Modal    | Main DB (Account A) connection                                   |
| `SUPABASE_SERVICE_ROLE_KEY` | Modal    | Main DB (Account A) Admin access                                 |
| `SUPPORT_WEBHOOK_URL`       | Modal    | **Support DB (Account B)** Edge Function URL                     |
| `FORM_SECRET`               | Modal    | **Support DB (Account B)** Function Secret                       |
| `POLLINATIONS_API_KEY`      | Modal    | AI Analysis credits                                              |

---

## 🚀 Setup Guides

### ⚙️ 1. Main Database (Supabase Account A)

1. Create a project on your primary Supabase account.
2. Execute `SUPABASE_SETUP_FINAL.sql` in the SQL Editor.
3. Note the Project URL and `service_role` key.

### ⚙️ 2. Support System (Supabase Account B)

1. Use your **second Supabase account** for support ticket handling.
2. Deploy the support edge function and note its `submit-support` URL.
3. This adds a layer of isolation and security to your support data.

### 🐍 3. Backend (Modal)

1. Run `modal secret create pickspy-secrets` and add all secrets (Main DB, Support DB, and AI).
2. Deploy the backend: `modal deploy backend/modal_scraper.py`.

### ⚛️ 4. Frontend (Vercel)

1. Add `VITE_SUPABASE_URL` (Account A), `VITE_SUPABASE_ANON_KEY` (Account A), and `VITE_BACKEND_API_URL` (Modal URL) to Vercel environment variables.

---

## 📁 Project Structure

```text
pickspyv2/
├── src/                    # React Frontend (Vercel)
├── backend/               # Python FastAPI & Scrapers (Modal)
├── prod-guard/            # Production Readiness CLI
└── .github/workflows/     # CI/CD Gates
```

---

**Made with ❤️ by PickSpy Team**
