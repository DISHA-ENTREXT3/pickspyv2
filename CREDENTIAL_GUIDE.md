# PickSpy Scraper Credential Guide

To ensure all scrapers work at 100% capacity, you need to configure the following environment variables in your **Backend Environment** (e.g., Render Dashboard or your local `.env` file).

## 1. Instagram Discovery (Required for Social Feed)

We use `instagrapi` for high-quality Instagram data. This requires a real Instagram account because Instagram blocks public requests.

- **INSTAGRAM_USERNAME**: Your Instagram handle.
- **INSTAGRAM_PASSWORD**: Your Instagram password.
  _Recommendation: Use a secondary "burner" account to avoid any risk to your primary account._

## 2. Advanced AI Analysis (Required for Live Intel)

- **OPENROUTER_API_KEY**: Get this from [OpenRouter](https://openrouter.ai/). This allows the system to use powerful models like Perplexity for live browsing.
- **GEMINI_API_KEY**: Get this from [Google AI Studio](https://aistudio.google.com/). This is used as a highly efficient secondary layer for analysis.

## 3. Google Search & Trends

These use native web scraping. No credentials are required, but the system is much more robust if the backend has a stable IP. The Google Trends scraper will automatically fall back to AI-simulated trends if Google blocks the request.

---

## How to Apply:

1. **Locally**: Add these to your `d:\PickSpy-main\backend\.env` file.
2. **Production**: Go to your Render or Vercel dashboard, navigate to **Environment Variables**, and add them there.
3. **Restart**: Restart your backend service after adding keys.

Once added, the system will automatically switch from "Scraping Fallbacks" to "Direct Live Feeds."
