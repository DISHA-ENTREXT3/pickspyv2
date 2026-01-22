# ScrapingDog Configuration Checklist

**Complete this checklist to activate ScrapingDog integration**

---

## ✅ Integration Status: COMPLETE

All backend code is ready. Just need your API key!

---

## Phase 1: Get Your API Key (5 minutes)

### Step 1: Sign Up
- [ ] Go to https://www.scrapingdog.com
- [ ] Click "Get Started" or "Register"
- [ ] Fill in email and password
- [ ] Verify email (check inbox)

### Step 2: Get API Key
- [ ] Log in to ScrapingDog dashboard
- [ ] Go to Settings → API Key
- [ ] Copy your API Key (looks like: `abc123def456...`)
- [ ] Save it somewhere safe

### Step 3: Understand Free Plan
- [ ] Free tier: 100 requests/month
- [ ] Monthly reset: 1st of each month
- [ ] Perfect for testing/development
- [ ] Can upgrade anytime

---

## Phase 2: Configure Backend (2 minutes)

### Step 1: Add to .env File
```bash
# Edit: d:\PickSpy-main\.env

SCRAPINGDOG_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with actual key from Step 1

### Step 2: Verify .env Format
- [ ] No quotes around API key
- [ ] No extra spaces
- [ ] Save file

### Example:
```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
VITE_BACKEND_API_URL=...
SCRAPINGDOG_API_KEY=abc123def456xyz789
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Phase 3: Restart Backend (1 minute)

### Step 1: Stop Current Process
- [ ] Go to terminal where backend is running
- [ ] Press `Ctrl+C` to stop

### Step 2: Restart Backend
```bash
cd backend
uvicorn main:app --reload
```

Should see:
```
Uvicorn running on http://127.0.0.1:8000
```

### Step 3: Check Logs
- [ ] No errors about API key
- [ ] No connection refused
- [ ] Backend is running

---

## Phase 4: Verify Configuration (2 minutes)

### Test 1: Health Check
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "online",
  "mode": "deep-scraper-v2",
  "database": "connected",
  "scrapingdog": "configured"
}
```

If you see `"scrapingdog": "not configured"`:
- [ ] Check API key in .env
- [ ] Restart backend
- [ ] Try again

### Test 2: Check Quota
```bash
curl http://localhost:8000/api/scrapingdog-quota
```

Expected response:
```json
{
  "success": true,
  "api_calls_used": 0,
  "api_calls_remaining": 100,
  "configured": true
}
```

### Test 3: Trigger Scraping
In your app:
1. [ ] Go to home page
2. [ ] Click "Refresh Products" button
3. [ ] Check backend logs for "ScrapingDog"
4. [ ] Products should load

---

## Phase 5: Monitor & Optimize (Optional)

### Daily Monitoring
```bash
# Check how many credits you've used
curl http://localhost:8000/api/scrapingdog-quota

# Should show increasing api_calls_used
# Should show decreasing api_calls_remaining
```

### Weekly Review
- [ ] Check quota endpoint
- [ ] Review ScrapingDog dashboard
- [ ] Monitor scraping success rate
- [ ] Adjust refresh frequency if needed

### Cost Optimization (Optional)
In `backend/main.py`, to save credits:
```python
# Use simple scraping for static sites (faster, cheaper)
html = scrapingdog.scrape_simple(url)

# Instead of:
html = scrapingdog.scrape_with_javascript(url)
```

---

## Troubleshooting

### Problem: "scrapingdog": "not configured"

**Checklist:**
- [ ] API key in .env file?
- [ ] No typos in key?
- [ ] No quotes around key?
- [ ] Backend restarted?
- [ ] Correct .env file (root dir)?

**Solution:**
```bash
# Verify in terminal:
cat .env | grep SCRAPINGDOG

# Should output:
# SCRAPINGDOG_API_KEY=abc123...
```

---

### Problem: "api_calls_remaining": 0

**Checklist:**
- [ ] You've made 100+ API calls
- [ ] Free plan limit reached
- [ ] Current month only

**Solution:**
1. Upgrade plan: https://www.scrapingdog.com/pricing
2. Or wait for monthly reset (next month)
3. Or reduce scraping frequency

---

### Problem: 401/403 Error

**Checklist:**
- [ ] API key is invalid/expired
- [ ] Different key in .env vs ScrapingDog account
- [ ] Key accidentally modified

**Solution:**
1. Go to ScrapingDog dashboard
2. Generate new API key
3. Update .env
4. Restart backend

---

### Problem: Still Getting Blocked

**Checklist:**
- [ ] Using `scrape_with_javascript(url)`?
- [ ] ScrapingDog actually being used (verify logs)?
- [ ] Request timeout too short?

**Solution:**
```python
# Try residential proxy (for heavily-protected sites)
html = scrapingdog.scrape_residential(url)

# Or increase timeout
html = scrapingdog.scrape(url, timeout=60)
```

---

## When It's Working

You'll see in backend logs:
```
✓ Saved 45 products to Supabase
✓ Scraper returned 45 products from ScrapingDog
```

And in app:
- ✅ Products load without errors
- ✅ Images display correctly
- ✅ Prices and descriptions visible
- ✅ No "blocked" or "forbidden" messages

---

## Fallback Information

If API key is NOT configured:
- ✅ App still works
- ⚠️ Uses direct scraping (may fail)
- 📊 Lower success rate
- 💡 Add key anytime to improve

Current fallback behavior:
```python
if scrapingdog.is_configured():
    html = scrapingdog.scrape_with_javascript(url)  # Use API
else:
    response = requests.get(url)  # Direct scraping
    html = response.text
```

---

## Success Criteria

You're done when:
- [x] API key from ScrapingDog
- [x] Added to .env file
- [x] Backend restarted
- [x] `curl /health` shows "configured"
- [x] `curl /api/scrapingdog-quota` shows quota
- [x] Products load in app
- [x] No errors in logs

---

## Files Involved

### Created
- `backend/scrapingdog_service.py` - Service module
- `SCRAPINGDOG_INTEGRATION.md` - Full documentation
- `SCRAPINGDOG_QUICKSTART.md` - Quick guide
- `SCRAPINGDOG_SUMMARY.md` - Overview

### Modified
- `backend/main.py` - Integrated ScrapingDog
- `.env` - Added API key
- `.env.example` - Added example

### No Changes Needed
- Frontend code
- Database
- ProductContext
- Any UI files

---

## Support

**If you get stuck:**

1. Check backend logs for error messages
2. Review troubleshooting section above
3. Verify API key is correct
4. Check ScrapingDog status: https://status.scrapingdog.com/
5. Contact ScrapingDog support: support@scrapingdog.com

**Questions about PickSpy integration?**
- Review `SCRAPINGDOG_INTEGRATION.md`
- Check `SCRAPINGDOG_QUICKSTART.md`
- Look at `backend/scrapingdog_service.py`

---

## Timeline

| Phase | Time | Status |
|-------|------|--------|
| Get API Key | 5 min | Pending your signup |
| Configure .env | 2 min | Pending your key |
| Restart Backend | 1 min | Ready |
| Verify | 2 min | Ready |
| **Total** | **~10 min** | **Ready!** |

---

## After Setup

Once configured, system will:
- ✅ Automatically use ScrapingDog for scraping
- ✅ Track API usage
- ✅ Fall back if needed
- ✅ Cache results in Supabase
- ✅ Load products in frontend

No manual action needed after initial setup!

---

## Status: ✅ Ready for Your API Key

All code is integrated and waiting for your API key.

**When ready:**
1. Get API key from https://www.scrapingdog.com
2. Add to `.env` file
3. Restart backend
4. Done! ✨

---

*Updated: January 22, 2026*
