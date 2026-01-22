# ScrapingDog Integration Guide

**ScrapingDog enables reliable web scraping with anti-bot detection, JavaScript rendering, and proxy support.**

---

## What is ScrapingDog?

ScrapingDog is a web scraping API service that:
- ✅ Handles JavaScript rendering (dynamic content)
- ✅ Bypasses anti-bot detection
- ✅ Supports residential proxies
- ✅ Manages rate limits automatically
- ✅ Provides a simple REST API
- ✅ Tracks API usage and quotas

**Website:** https://www.scrapingdog.com  
**API Docs:** https://api.scrapingdog.com/

---

## Setup

### 1. Get API Key

1. Go to https://www.scrapingdog.com/register
2. Sign up for free account (100 free requests/month)
3. Copy your **API Key** from dashboard
4. (Optional) Upgrade plan for more requests

### 2. Configure Backend

Add to `.env` file:
```bash
SCRAPINGDOG_API_KEY=your_api_key_here
```

Or set environment variable:
```bash
export SCRAPINGDOG_API_KEY=your_api_key_here
```

### 3. Verify Configuration

```bash
curl http://localhost:8000/api/scrapingdog-quota
```

Expected response:
```json
{
  "success": true,
  "api_calls_used": 5,
  "api_calls_remaining": 95,
  "configured": true
}
```

---

## How It Works

### Architecture

```
Frontend (React)
    ↓
ProductContext (refreshProducts)
    ↓
Backend API (POST /refresh)
    ↓
ScrapingDog Service
    ↓
    ├─ scrape_amazon_listing()
    ├─ scrape_flipkart_listing()
    └─ scrape_alibaba_listing()
    ↓
ScrapingDog API (https://api.scrapingdog.com)
    ↓
Target Website (Amazon, Flipkart, etc.)
    ↓
HTML Response → Parse → Products → Supabase
```

### Request Flow

1. **Frontend** clicks "Refresh Products" button
2. **ProductContext** calls `apiService.refreshProducts()`
3. **Backend** receives `POST /refresh`
4. **ScrapingDog Service** makes request to ScrapingDog API
5. **ScrapingDog API** scrapes target website
6. **Response** returns rendered HTML
7. **Backend** parses HTML with BeautifulSoup
8. **Database** upserts products to Supabase
9. **Frontend** fetches and displays products

---

## API Methods

### ScrapingDogService Class

#### `scrape(url, render=True, timeout=30, proxy="None")`
Main scraping method

```python
from scrapingdog_service import get_scrapingdog

scrapingdog = get_scrapingdog()
html = scrapingdog.scrape("https://amazon.com/s?k=laptop")
```

**Parameters:**
- `url` (str) - Website to scrape
- `render` (bool) - Enable JavaScript rendering (default: True)
- `timeout` (int) - Request timeout in seconds (default: 30)
- `proxy` (str) - Proxy type: "None", "Residential", "ISP" (default: "None")

**Returns:**
- HTML content (str) if successful
- None if failed

---

#### `scrape_with_javascript(url)`
Scrape with JavaScript rendering enabled

```python
html = scrapingdog.scrape_with_javascript("https://flipkart.com/search?q=phone")
```

Use for **dynamic websites** (React, Vue, Angular apps)

---

#### `scrape_simple(url)`
Scrape without JavaScript rendering (faster, cheaper)

```python
html = scrapingdog.scrape_simple("https://example.com")
```

Use for **static websites**

---

#### `scrape_residential(url)`
Scrape using residential proxies (more reliable)

```python
html = scrapingdog.scrape_residential("https://amazon.com")
```

Use when **frequently blocked**

---

#### `check_api_quota()`
Check remaining API credits

```python
quota = scrapingdog.check_api_quota()
# Returns: {
#   "success": True,
#   "api_calls_used": 150,
#   "api_calls_remaining": 350,
#   "configured": True
# }
```

---

#### `is_configured()`
Check if API key is set

```python
if scrapingdog.is_configured():
    html = scrapingdog.scrape(url)
else:
    print("API key not set")
```

---

## Fallback Behavior

If `SCRAPINGDOG_API_KEY` is **not configured**:

✅ System falls back to **direct scraping** (faster, free)  
⚠️ May get **blocked** by anti-bot systems  
✅ Better to have ScrapingDog configured

### Current Scrapers Using ScrapingDog

1. **Amazon Scraper** (`scrape_amazon_listing`)
   - Uses ScrapingDog with JavaScript rendering
   - Falls back to direct scraping

2. **Flipkart Scraper** (`scrape_flipkart_listing`)
   - Uses ScrapingDog with JavaScript rendering
   - Falls back to direct scraping

3. **Alibaba/Taobao** (ready for integration)
   - Can use residential proxies
   - Recommended for heavily-protected sites

---

## API Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "online",
  "mode": "deep-scraper-v2",
  "database": "connected",
  "scrapingdog": "configured"
}
```

### Get API Quota
```bash
GET /api/scrapingdog-quota
```

Response:
```json
{
  "success": true,
  "api_calls_used": 25,
  "api_calls_remaining": 75,
  "configured": true
}
```

### Refresh Products
```bash
POST /refresh
```

**Response:**
```json
{
  "status": "refreshing",
  "message": "Background scan started",
  "preview": [...]
}
```

---

## Cost & Pricing

### ScrapingDog Plans

| Plan | Requests/Month | Price |
|------|---|---|
| **Free** | 100 | $0 |
| **Starter** | 5,000 | $29/month |
| **Pro** | 50,000 | $99/month |
| **Business** | 500,000 | $249/month |

### Cost Optimization Tips

1. **Use `scrape_simple()` when possible** (no JavaScript rendering)
   - Costs 0.01 credit per request vs 0.05 for rendering

2. **Cache results** in Supabase
   - Don't re-scrape same products hourly
   - Update only when needed

3. **Batch requests efficiently**
   - Scrape multiple products per request
   - Avoid redundant API calls

4. **Monitor usage**
   - Check quota regularly: `GET /api/scrapingdog-quota`
   - Set alerts when quota low

---

## Common Use Cases

### 1. Get Latest Amazon Listings
```python
from scrapingdog_service import get_scrapingdog

scrapingdog = get_scrapingdog()
url = "https://www.amazon.com/s?k=laptop&sort=date-desc-rank"
html = scrapingdog.scrape_with_javascript(url)
# Parse and store in database
```

### 2. Monitor Price Changes
```python
# Get product page with latest price
html = scrapingdog.scrape("https://amazon.com/dp/B0123456")
# Extract price, compare with stored price
# Update if changed
```

### 3. Scrape Competitor Sites
```python
# Use residential proxy for heavily-protected sites
html = scrapingdog.scrape_residential("https://competitor.com/products")
```

### 4. Track Inventory
```python
# Regular inventory checks
html = scrapingdog.scrape_simple("https://shop.example.com/inventory")
# Parse stock levels
```

---

## Error Handling

### API Not Configured
```python
if not scrapingdog.is_configured():
    print("ScrapingDog API key not set")
    # Falls back to direct scraping
    html = requests.get(url).text
```

### Timeout Error
```python
html = scrapingdog.scrape(url, timeout=60)
# If None returned, request timed out
if html is None:
    print("Request timed out")
```

### Quota Exceeded
```python
quota = scrapingdog.check_api_quota()
if quota.get("api_calls_remaining", 0) < 10:
    print("Low on credits")
    # Stop scraping or upgrade plan
```

---

## Troubleshooting

### Problem: "ScrapingDog not configured"
**Solution:** Add API key to `.env`:
```bash
SCRAPINGDOG_API_KEY=your_key_here
```

### Problem: Still getting blocked
**Solution:** Try residential proxy:
```python
html = scrapingdog.scrape_residential(url)
```

### Problem: Quota exceeded
**Solution:** 
1. Upgrade plan on scrapingdog.com
2. Implement caching to reduce requests
3. Use `scrape_simple()` instead of rendering

### Problem: HTML parsing fails
**Solution:**
1. Check if website structure changed
2. Use browser DevTools to inspect selectors
3. Log raw HTML: `print(html)`

---

## Integration with Current System

### Files Modified

1. **`backend/scrapingdog_service.py`** (NEW)
   - ScrapingDog API wrapper
   - Singleton pattern
   - Error handling

2. **`backend/main.py`**
   - Imports ScrapingDog service
   - Uses in scrapers
   - New health endpoint
   - New quota endpoint

3. **`.env` and `.env.example`**
   - Added SCRAPINGDOG_API_KEY

### Backward Compatible

✅ Works **with OR without** API key  
✅ Gracefully falls back to direct scraping  
✅ No breaking changes to existing code  
✅ No frontend changes needed  

---

## Monitoring & Logging

### Check Status
```bash
curl http://localhost:8000/health
# Check "scrapingdog" field
```

### Monitor Quota
```bash
curl http://localhost:8000/api/scrapingdog-quota
```

### View Logs
```bash
# Backend logs show ScrapingDog API calls
# Look for: "Scraper returned X products"
# or: "⚠️  ScrapingDog API Error"
```

---

## Next Steps

1. **Get API Key**: https://www.scrapingdog.com/register
2. **Add to .env**: `SCRAPINGDOG_API_KEY=your_key`
3. **Restart Backend**: `uvicorn main:app --reload`
4. **Test**: `curl http://localhost:8000/health`
5. **Monitor**: Check quota regularly
6. **Optimize**: Use `scrape_simple()` when possible

---

## Resources

- **ScrapingDog Website**: https://www.scrapingdog.com
- **API Documentation**: https://api.scrapingdog.com/
- **Pricing**: https://www.scrapingdog.com/pricing
- **Support**: support@scrapingdog.com

---

## FAQ

**Q: Is ScrapingDog free?**  
A: Free tier includes 100 requests/month. Paid plans start at $29/month.

**Q: What sites can I scrape?**  
A: Most public websites. Check ScrapingDog terms of service.

**Q: How fast is it?**  
A: Usually <5 seconds per request. With rendering: <10 seconds.

**Q: Can I use residential proxies?**  
A: Yes, with Starter plan and above.

**Q: What happens if I run out of quota?**  
A: System falls back to direct scraping (may fail for protected sites).

**Q: Can I cache results?**  
A: Yes! Products are stored in Supabase. Only refresh when needed.

**Q: Is there a local alternative?**  
A: Bright Data, Apify, or Selenium (more setup required).

---

**Integration Complete** ✅

ScrapingDog is now integrated into PickSpy backend.  
Add your API key when ready!
