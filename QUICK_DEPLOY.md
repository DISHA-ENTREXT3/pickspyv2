# 🚀 QUICK START - DEPLOY PICKSPY IN 3 STEPS

## ⏱️ Estimated Time: 30 minutes

---

## STEP 1: Get Required API Keys (5 minutes)

### A. Supabase Anon Key
1. Go to: https://supabase.com/dashboard
2. Select your PickSpy project
3. Go to: Settings → API
4. Copy the "anon" public key (the long string starting with `eyJ...`)
5. Save it - you'll need it for Vercel

### B. ScrapingDog API Key (Optional but recommended)
1. Go to: https://www.scrapingdog.com
2. Sign up (free plan available)
3. Copy your API key from dashboard
4. Save it - you'll need it for Render backend

**Keys to collect:**
```
VITE_SUPABASE_ANON_KEY = ___________________
SCRAPINGDOG_API_KEY = ___________________
```

---

## STEP 2: Deploy Frontend to Vercel (10 minutes)

1. **Go to Vercel**:
   - Visit: https://vercel.com
   - Sign in with GitHub (use your GitHub account)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select "GitHub"
   - Find and select: `DISHA-ENTREXT3/pickspyv2`
   - Click "Import"

3. **Configure Project**:
   - Project Name: `pickspy` (or whatever you like)
   - Framework: `Vite`
   - Root Directory: `./`
   - Leave build settings as default
   - Click "Environment Variables"

4. **Add Environment Variables**:
   ```
   VITE_SUPABASE_URL = https://fogfnvewxeqxqtsrclbd.supabase.co
   VITE_SUPABASE_ANON_KEY = [paste your anon key from Step 1A]
   VITE_BACKEND_API_URL = https://pickspy-backend.onrender.com
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - You'll get a URL like: `https://pickspy-xxx.vercel.app`

✅ **Frontend is now live!**

---

## STEP 3: Deploy Backend to Render (15 minutes)

1. **Go to Render**:
   - Visit: https://render.com
   - Sign in with GitHub (use your GitHub account)

2. **Create Web Service**:
   - Click "New +" 
   - Select "Web Service"
   - Select GitHub
   - Search for: `pickspyv2`
   - Connect it

3. **Configure Service**:
   - Name: `pickspy-backend`
   - Region: `Frankfurt` (or closest to you)
   - Branch: `main`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port 8000`

4. **Add Environment Variables**:
   ```
   SUPABASE_URL = https://fogfnvewxeqxqtsrclbd.supabase.co
   SUPABASE_SERVICE_ROLE_KEY = [you already have this]
   SCRAPINGDOG_API_KEY = [paste your key from Step 1B]
   ENVIRONMENT = production
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete (5 minutes)
   - You'll get a URL like: `https://pickspy-backend.onrender.com`

✅ **Backend is now live!**

---

## 🎉 YOU'RE LIVE!

### Access Your App:
- **Frontend**: Visit the Vercel URL (e.g., `https://pickspy-xxx.vercel.app`)
- **Backend API Docs**: Visit `https://pickspy-backend.onrender.com/docs`

### Test It:
1. Open frontend URL in browser
2. See if homepage loads
3. Try signup
4. Try browsing products
5. Try comparing products

---

## ❌ Troubleshooting

### Frontend shows blank page?
- Check browser console (F12) for errors
- Check Vercel deployment logs
- Verify VITE_BACKEND_API_URL is correct

### Backend returns 502 error?
- Wait 2 minutes (Render takes time to start)
- Check Render logs for errors
- Verify SUPABASE_URL and keys are correct

### Can't connect to database?
- Verify Supabase tables were created
- Check RLS policies in Supabase
- Run the SUPABASE_SETUP_FINAL.sql if not done

### Scraping not working?
- Check if ScrapingDog API key is set
- Visit scrapingdog.com to verify account status
- Check API usage limits

---

## 📞 Quick Links

| What | Where |
|------|-------|
| Frontend | Vercel Dashboard → Your Project |
| Backend | Render Dashboard → Your Service |
| Database | https://supabase.com → PickSpy Project |
| GitHub | https://github.com/DISHA-ENTREXT3/pickspyv2 |

---

## 🎯 Next (Optional)

- [ ] Add custom domain to Vercel
- [ ] Set up error monitoring (Sentry)
- [ ] Configure email notifications
- [ ] Set up analytics
- [ ] Monitor database usage

---

## ✨ DONE!

Your PickSpy app is now deployed and live for the world to see! 🚀

Questions? Check DEPLOYMENT_GUIDE.md for detailed instructions.

