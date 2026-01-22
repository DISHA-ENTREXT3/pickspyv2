# PickSpy - DEPLOYMENT & GO-LIVE GUIDE

## ✅ PROJECT STATUS

### GitHub
- ✅ Latest code pushed
- ✅ All features implemented
- ✅ Tests written
- Repository: `https://github.com/DISHA-ENTREXT3/pickspyv2`

### Supabase Database
- ✅ Database configured
- ✅ All tables created (products, user_activity, saved_products, comparisons)
- ✅ RLS policies configured
- ✅ Indexes optimized

---

## 🚀 DEPLOYMENT STEPS

### STEP 1: Configure Environment Variables

#### For Vercel (Frontend)
1. Go to: `https://vercel.com/dashboard`
2. Click your PickSpy project
3. Go to Settings → Environment Variables
4. Add these variables:

```
VITE_SUPABASE_URL=https://fogfnvewxeqxqtsrclbd.supabase.co
VITE_SUPABASE_ANON_KEY=[Get from Supabase → Settings → API Keys → anon public key]
VITE_BACKEND_API_URL=https://pickspy-backend.onrender.com
```

#### For Render (Backend)
1. Go to: `https://render.com/dashboard`
2. Create NEW Service → GitHub repo → pickspyv2
3. Configure:
   - Name: `pickspy-backend`
   - Runtime: `Python 3`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn backend.main:app --host 0.0.0.0 --port 8000`
4. Add Environment Variables:
   ```
   SUPABASE_URL=https://fogfnvewxeqxqtsrclbd.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=[Your service role key]
   SCRAPINGDOG_API_KEY=[Your ScrapingDog API key]
   ENVIRONMENT=production
   ```

---

### STEP 2: Deploy Frontend to Vercel

1. Go to Vercel Dashboard
2. Click "Import Project"
3. Select GitHub repo: `pickspyv2`
4. Framework: `Vite`
5. Root Directory: `./`
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Add all environment variables (see Step 1)
9. Click "Deploy"

**Expected URL**: `https://pickspyv2.vercel.app`

---

### STEP 3: Deploy Backend to Render

1. Create account on `https://render.com`
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: `pickspy-backend`
   - Region: `Frankfurt` (closest to your users)
   - Branch: `main`
   - Runtime: `Python 3`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn backend.main:app --host 0.0.0.0 --port 8000`
5. Add Environment Variables (see Step 1)
6. Click "Create Web Service"

**Expected URL**: `https://pickspy-backend.onrender.com`

---

### STEP 4: Verify Supabase Connection

Run these queries in Supabase SQL Editor to verify:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should return:
-- comparisons
-- products
-- saved_products
-- user_activity

-- Check RLS is enabled
SELECT tablename FROM pg_tables 
WHERE tablename IN ('products', 'user_activity', 'saved_products', 'comparisons')
AND schemaname = 'public';
```

---

### STEP 5: Test API Endpoints

After deployment, test these endpoints:

```bash
# Test backend is running
curl https://pickspy-backend.onrender.com/docs

# Test health check
curl https://pickspy-backend.onrender.com/health

# Test Supabase connection
curl -X GET https://pickspy-backend.onrender.com/api/products

# Test scraping
curl -X POST https://pickspy-backend.onrender.com/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

---

### STEP 6: Verify Frontend

1. Visit: `https://pickspyv2.vercel.app`
2. Check these features:
   - ✅ Homepage loads
   - ✅ Navigation works
   - ✅ Signup page functional
   - ✅ Dashboard accessible after login
   - ✅ Product cards display
   - ✅ Filters work
   - ✅ Compare functionality works

---

## 🔐 SECURITY CHECKLIST

- [ ] Supabase service role key is NOT exposed in frontend
- [ ] All environment variables are set in Vercel & Render
- [ ] RLS policies are enabled on all Supabase tables
- [ ] CORS is properly configured (backend allows Vercel domain)
- [ ] ScrapingDog API key is kept secret
- [ ] Database backups are enabled

---

## 📊 PRODUCTION MONITORING

After going live, monitor:

1. **Vercel**: Dashboard → Analytics
2. **Render**: Dashboard → Logs & Metrics
3. **Supabase**: Dashboard → Logs & Database Usage

---

## 🆘 TROUBLESHOOTING

### Frontend not connecting to backend?
- Check VITE_BACKEND_API_URL in Vercel env vars
- Check backend health: `https://pickspy-backend.onrender.com/docs`
- Check CORS headers

### Supabase connection error?
- Verify SUPABASE_URL and keys are correct
- Check RLS policies aren't blocking access
- Check database is in "Production" mode

### ScrapingDog not working?
- Verify API key is correct
- Check API usage at: `https://www.scrapingdog.com/dashboard`
- May have hit rate limit

---

## 📝 FINAL CHECKLIST

- [ ] GitHub repo is public and up-to-date
- [ ] Supabase database has all tables and policies
- [ ] Vercel project created and connected
- [ ] Render backend deployed and running
- [ ] Environment variables configured on both platforms
- [ ] Frontend loads and connects to backend
- [ ] API endpoints responding
- [ ] Database queries working
- [ ] Tests passing locally
- [ ] Documentation complete

---

## 🎉 YOU'RE LIVE!

Once all checks pass, your PickSpy application is ready for production!

**Frontend**: https://pickspyv2.vercel.app
**Backend API**: https://pickspy-backend.onrender.com
**Database**: Supabase (fogfnvewxeqxqtsrclbd)

