# 🚀 ScrapingDog Activation Instructions

**Your API key is configured. Follow these 3 steps to activate:**

---

## Step 1: Stop Current Backend (30 seconds)

Go to the terminal where your backend is running:

```
Press: Ctrl + C
```

You should see:
```
Shutdown complete
```

---

## Step 2: Restart Backend (30 seconds)

In the same terminal, run:

```bash
uvicorn main:app --reload
```

You should see:
```
Uvicorn running on http://127.0.0.1:8000
```

Wait for "Application startup complete"

---

## Step 3: Verify It Works (1 minute)

### Test 1: Check Health Status

```bash
# Open new terminal and run:
curl http://localhost:8000/health
```

**Expected output:**
```json
{
  "status": "online",
  "mode": "deep-scraper-v2",
  "database": "connected",
  "scrapingdog": "configured"
}
```

✅ If you see `"scrapingdog": "configured"` → SUCCESS!

### Test 2: Check API Quota

```bash
curl http://localhost:8000/api/scrapingdog-quota
```

**Expected output:**
```json
{
  "success": true,
  "api_calls_used": 0,
  "api_calls_remaining": 100,
  "configured": true
}
```

✅ If you see remaining quota → SUCCESS!

---

## Step 4: Test in App (1 minute)

1. Open app in browser: http://localhost:5173 (or your port)
2. Go to home page
3. Click **"Refresh Products"** button
4. Wait for products to load
5. Check backend logs for:
   ```
   ✓ Saved 45 products to Supabase
   Scraping completed successfully
   ```

✅ Products load without errors → SUCCESS!

---

## What Happens After Activation

### ✅ Automatic
- ScrapingDog renders JavaScript
- Anti-bot detection bypassed
- Products scraped reliably
- Data saved to Supabase
- Frontend displays results

### ✅ No Manual Action Needed
- System uses ScrapingDog automatically
- Falls back gracefully if needed
- Tracks API usage
- Resets quota monthly

### ✅ You Can
- Monitor quota: `/api/scrapingdog-quota`
- Refresh products anytime
- Track API usage
- Upgrade plan when needed

---

## Troubleshooting Quick Fixes

### Backend Won't Start
```
Error: Address already in use
```
→ Port 8000 is busy. Either:
  - Kill other process: `lsof -ti:8000 | xargs kill -9`
  - Or use different port: `uvicorn main:app --port 8001`

### Still Shows "not configured"
```
"scrapingdog": "not configured"
```
→ Try these:
  1. Kill backend completely (wait 5 seconds)
  2. Check `.env` file has: `SCRAPINGDOG_API_KEY=6971f563189cdc880fccb6cc`
  3. Restart backend
  4. If still fails, check Python version: `python --version` (needs 3.8+)

### Quota Shows 0
```
"api_calls_remaining": 0
```
→ You've used your 100 free requests
→ Either:
  1. Wait for monthly reset
  2. Upgrade plan at https://www.scrapingdog.com/pricing

---

## Success Indicators

When working correctly, you'll see:

**In App:**
- ✅ Products load on home page
- ✅ No "blocked" or "forbidden" messages
- ✅ Product images display
- ✅ Prices and descriptions visible

**In Backend Logs:**
- ✅ `ScrapingDog` mentioned in startup
- ✅ After refresh: `Saved X products to Supabase`
- ✅ No `ScrapingDog API Error` messages

**In curl Tests:**
- ✅ Health shows `"scrapingdog": "configured"`
- ✅ Quota shows `"api_calls_used": > 0`
- ✅ `"configured": true`

---

## File Reference

**Configuration Files:**
- `.env` ← Your API key here ✅
- `backend/scrapingdog_service.py` ← ScrapingDog module
- `backend/main.py` ← Integration code

**Endpoint Locations:**
- Health: `http://localhost:8000/health`
- Quota: `http://localhost:8000/api/scrapingdog-quota`
- Refresh: `POST http://localhost:8000/refresh`

---

## Speed Guide

| Task | Time | Command |
|------|------|---------|
| Stop backend | 30 sec | `Ctrl+C` |
| Restart backend | 30 sec | `uvicorn main:app --reload` |
| Verify health | 10 sec | `curl http://localhost:8000/health` |
| Check quota | 10 sec | `curl http://localhost:8000/api/scrapingdog-quota` |
| Test in app | 1 min | Click refresh + wait |
| **Total** | **~3 min** | **Complete!** |

---

## After Success ✅

You're done! Your PickSpy app now:

- 🚀 Uses ScrapingDog for reliable scraping
- ✅ Bypasses anti-bot detection
- ✅ Renders JavaScript properly
- ✅ Loads real product data
- 📊 Tracks API usage
- 💾 Stores everything in Supabase
- 🎨 Displays beautifully in frontend

**No more fallback data or failures!**

---

## Monitoring

### Daily
```bash
# Check quota usage
curl http://localhost:8000/api/scrapingdog-quota
```

### Weekly
Review your usage pattern:
- If > 100/month → Upgrade plan
- If < 10/month → Perfect (you're good)

### Monthly
- Quota auto-resets
- Check if you need to upgrade

---

## Questions?

**Need help?**
- Check: `SCRAPINGDOG_INTEGRATION.md`
- Check: `SCRAPINGDOG_QUICKSTART.md`
- Email: support@scrapingdog.com

**Everything working?**
- 🎉 Congratulations! Enjoy your upgraded scraper!

---

## Final Checklist

- [ ] Terminal running backend
- [ ] Pressed Ctrl+C to stop
- [ ] Ran `uvicorn main:app --reload`
- [ ] Saw "Application startup complete"
- [ ] Ran `curl /health` → shows "configured"
- [ ] Ran `curl /api/scrapingdog-quota` → shows quota
- [ ] Clicked refresh in app
- [ ] Products loaded successfully
- [ ] ✅ DONE!

---

**Status: READY TO ACTIVATE** 🚀

Restart your backend now and enjoy reliable product scraping!
