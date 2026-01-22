# PickSpy Integration Quick Start

**Get the fully integrated application running in 5 minutes.**

## Prerequisites

- Node.js 18+
- Python 3.10+
- Git
- Supabase account (free tier works)
- Render account (for backend hosting, optional for local dev)

---

## 1. Database Setup (Supabase)

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → Create new project
2. Copy your **Project URL** and **Anon Public Key**
3. Get **Service Role Secret Key** from Settings → API

### Run Database Schema
1. Go to Supabase Dashboard → SQL Editor
2. Copy entire content from [supabase_schema.sql](supabase_schema.sql)
3. Paste into SQL Editor and execute

**This creates:**
- products table
- user_activity table
- saved_products table
- comparisons table
- profiles table (with auto-trigger)
- All RLS policies
- All performance indexes

---

## 2. Backend Setup

### Installation
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration
Create `.env` file:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Run Backend
```bash
# Local development
uvicorn main:app --reload --port 8000

# Production (with Gunicorn)
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Verify Backend
```bash
curl http://localhost:8000/health
# Response: {"status": "online", "mode": "deep-scraper-v2", "database": "connected"}
```

---

## 3. Frontend Setup

### Installation
```bash
# Root directory
npm install
```

### Configuration
Create `.env` file:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BACKEND_API_URL=http://localhost:8000  # For local dev
# VITE_BACKEND_API_URL=https://your-render-url.onrender.com  # For production
```

### Run Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

---

## 4. Test the Integration

### Test 1: Authentication
```bash
# In app, go to /signup
1. Enter email: test@example.com
2. Enter password: password123
3. Enter name: Test User
4. Click "Sign Up"
5. Should redirect to /dashboard
6. Should see profile displayed
```

### Test 2: View Products
```bash
# In app, go to /
1. Products should load from database
2. If empty, they'll auto-refresh from backend scraper
3. Check browser console for data logs
```

### Test 3: Save Product
```bash
# In app, on product card
1. Click heart icon to save product
2. Check backend logs - should see activity tracked
3. Product ID added to saved_products table
```

### Test 4: Create Comparison
```bash
# In app, go to /compare
1. Select 2+ products
2. Click "Create Comparison"
3. Should get comparison ID back
4. Data saved to comparisons table
```

### Test 5: Backend API Direct Call
```bash
# Terminal/Postman
curl -X POST http://localhost:8000/refresh \
  -H "Content-Type: application/json"

# Response: {"status": "refreshing", "message": "...", "preview": [...]}
# Backend will scrape and populate products table in background
```

---

## 5. Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → Create new service
3. Connect GitHub repository
4. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy (auto-redeploy on push)
6. Copy service URL for frontend

### Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) → Import project
2. Select GitHub repository
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_BACKEND_API_URL=your-render-url`
4. Deploy
5. Domain assigned automatically

---

## 6. Architecture Check

Verify all integrations are working:

```typescript
// In browser console (when logged in)

// Check 1: Auth Context
import { useAuth } from '@/contexts/AuthContext'
const { user, profile, isAuthenticated } = useAuth()
console.log('User:', user?.email)
console.log('Authenticated:', isAuthenticated)

// Check 2: Products
import { useProducts } from '@/contexts/ProductContext'
const { products, isLoading } = useProducts()
console.log('Products loaded:', products.length)
console.log('Loading:', isLoading)

// Check 3: Save Product
await useProducts().saveProduct('product-id')
// Should see success in network tab

// Check 4: API Service
import { apiService } from '@/lib/api'
await apiService.getHealth()
// Should return online status
```

---

## 7. Common Issues & Solutions

### Database Connection Error
```
Error: "Database not available"
```
**Solution:**
- Check SUPABASE_URL and key are correct
- Verify database isn't sleeping (upgrade to paid plan)
- Check VPC/firewall settings

### Products Not Loading
```
Console: "Error fetching from Supabase"
```
**Solution:**
- Run `npm run dev` to see full error
- Check products table exists (run schema SQL)
- Click "Refresh Products" button
- Check backend `/health` endpoint

### Save Product Fails
```
Error: "User not authenticated"
```
**Solution:**
- Make sure you're logged in (check /dashboard)
- Check useAuth() hook is working
- Verify VITE_SUPABASE_ANON_KEY in .env

### Backend Not Connected
```
Health check: {"database": "disconnected"}
```
**Solution:**
- Check SUPABASE_SERVICE_ROLE_KEY is correct
- Verify backend .env variables
- Restart backend server

---

## 8. File Structure

```
PickSpy/
├── src/
│   ├── contexts/
│   │   ├── AuthContext.tsx          # User auth
│   │   └── ProductContext.tsx       # Product management + API calls
│   ├── lib/
│   │   ├── api.ts                   # API service layer
│   │   ├── supabase.ts              # Supabase client
│   │   └── ... (other utilities)
│   ├── pages/
│   │   ├── SignupPage.tsx           # Auth UI
│   │   ├── Dashboard.tsx            # User dashboard
│   │   ├── Index.tsx                # Home page
│   │   └── ... (other pages)
│   ├── components/
│   │   ├── ProductCard.tsx          # Product display + save
│   │   └── ... (other components)
│   └── App.tsx                      # Root with AuthProvider
│
├── backend/
│   ├── main.py                      # FastAPI app + endpoints
│   ├── supabase_utils.py            # DB operations
│   ├── requirements.txt             # Python dependencies
│   └── Dockerfile                   # Container config
│
├── supabase_schema.sql              # Database schema (run once)
├── INTEGRATION_GUIDE.md             # Detailed integration docs
├── INTEGRATION_VERIFICATION.md      # Verification checklist
├── .env.example                     # Environment template
├── package.json                     # Node dependencies
└── ... (other config files)
```

---

## 9. Key Integrations Checklist

### Frontend ↔ Backend
- [x] API service layer (`lib/api.ts`)
- [x] Type-safe endpoints
- [x] Error handling
- [x] Auth token injection

### Backend ↔ Database
- [x] Supabase utilities (`backend/supabase_utils.py`)
- [x] Connection pooling
- [x] Batch operations
- [x] Error handling

### Database ↔ Frontend
- [x] Supabase client (`lib/supabase.ts`)
- [x] RLS policies
- [x] Direct reads
- [x] Activity tracking

### Context ↔ Components
- [x] useAuth() hook
- [x] useProducts() hook
- [x] Protected routes
- [x] Loading/error states

---

## 10. Next Steps

After getting everything running:

1. **Customize UI** - Update colors, fonts in Tailwind config
2. **Add More Features** - Notifications, recommendations, exports
3. **Scale Backend** - Add caching, rate limiting
4. **Monitor** - Set up logs, alerts in Supabase/Render
5. **Optimize** - Add pagination, lazy loading, infinite scroll

---

## Support & Troubleshooting

**Resources:**
- [Supabase Docs](https://supabase.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

**Common Commands:**
```bash
# Check Node version
node --version

# Check Python version
python --version

# Clear node_modules
rm -rf node_modules && npm install

# Reset database
# Go to Supabase → SQL Editor → Drop all tables → Run schema.sql again

# View backend logs
# Render dashboard → Logs tab

# View frontend errors
# Browser DevTools → Console tab
```

---

## Integration Complete! 🎉

Your PickSpy application now has:
- ✅ Full authentication system
- ✅ Product catalog with real-time updates
- ✅ User activity tracking
- ✅ Favorites/saved products
- ✅ Product comparisons
- ✅ Analytics ready
- ✅ Secure data access (RLS)
- ✅ Production-ready deployment

**Start building!**
