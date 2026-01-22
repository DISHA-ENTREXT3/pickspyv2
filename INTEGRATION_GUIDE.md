# PickSpy Frontend, Backend & Database Integration Guide

## Overview

This document explains the complete integration between the frontend (React + TypeScript), backend (FastAPI + Python), and database (Supabase PostgreSQL) in the PickSpy application.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React/TypeScript)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  UI Components (ProductCard, Dashboard, etc.)            │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │  Context Layer (AuthContext, ProductContext)             │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │  API Service Layer (lib/api.ts)                          │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │  Supabase Client (lib/supabase.ts)                       │   │
│  └────────────────────┬─────────────────────────────────────┘   │
└─────────────────────┼──────────────────────────────────────────┘
                      │
     ┌────────────────┴────────────────┐
     │                                  │
┌────▼──────────────────────────────┐  │
│   BACKEND (FastAPI/Python)        │  │
│ ┌──────────────────────────────┐  │  │
│ │ REST API Endpoints           │  │  │
│ │ - /refresh                   │  │  │
│ │ - /user/save-product         │  │  │
│ │ - /user/comparisons          │  │  │
│ │ - /user/track-activity       │  │  │
│ │ - /analytics/*               │  │  │
│ └──────────────────────────────┘  │  │
│ ┌──────────────────────────────┐  │  │
│ │ Supabase Utilities           │  │  │
│ │ (supabase_utils.py)          │  │  │
│ └──────────────────────────────┘  │  │
│ ┌──────────────────────────────┐  │  │
│ │ Scrapers & Data Generation   │  │  │
│ └──────────────────────────────┘  │  │
└─────────────────────────────────────┘  │
                                         │
              ┌──────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────────────┐
│              DATABASE (Supabase PostgreSQL)                       │
│                                                                   │
│  Tables:                                                          │
│  ┌─────────────────────────┐  ┌──────────────────────────────┐  │
│  │ auth.users              │  │ public.profiles              │  │
│  ├─────────────────────────┤  ├──────────────────────────────┤  │
│  │ id (UUID)               │  │ id (UUID, FK to users)       │  │
│  │ email                   │  │ email                        │  │
│  │ user_metadata           │  │ full_name                    │  │
│  │ created_at              │  │ subscription_tier            │  │
│  └─────────────────────────┘  │ created_at                   │  │
│                                │ updated_at                   │  │
│  ┌─────────────────────────┐  └──────────────────────────────┘  │
│  │ public.products         │  ┌──────────────────────────────┐  │
│  ├─────────────────────────┤  │ public.user_activity         │  │
│  │ id (text, primary key)  │  ├──────────────────────────────┤  │
│  │ name                    │  │ id (UUID)                    │  │
│  │ category                │  │ user_id (FK)                 │  │
│  │ price                   │  │ activity_type                │  │
│  │ velocity_score          │  │ product_id (FK)              │  │
│  │ saturation_score        │  │ metadata (JSONB)             │  │
│  │ demand_signal           │  │ created_at                   │  │
│  │ sentiment_score         │  └──────────────────────────────┘  │
│  │ reddit_mentions         │                                    │
│  │ created_at              │  ┌──────────────────────────────┐  │
│  │ ... (and more fields)   │  │ public.saved_products        │  │
│  └─────────────────────────┘  ├──────────────────────────────┤  │
│                                │ id (UUID)                    │  │
│  ┌─────────────────────────┐  │ user_id (FK)                 │  │
│  │ public.comparisons      │  │ product_id (FK)              │  │
│  ├─────────────────────────┤  │ saved_at                     │  │
│  │ id (UUID)               │  └──────────────────────────────┘  │
│  │ user_id (FK)            │                                    │
│  │ product_ids (text[])    │                                    │
│  │ notes                   │                                    │
│  │ created_at              │                                    │
│  │ updated_at              │                                    │
│  └─────────────────────────┘                                    │
│                                                                   │
│  RLS Policies: User-scoped access control enabled                │
│  Indexes: On category, velocity, created_at for performance     │
└───────────────────────────────────────────────────────────────────┘
```

## Database Layer

### Tables & Schemas

#### 1. **auth.users** (Supabase Built-in)
- Managed by Supabase Authentication
- Stores user credentials and auth tokens
- Automatically created on signup

#### 2. **public.profiles**
```sql
id → FK to auth.users (auto-cascade on delete)
email → User email from auth
full_name → User's display name
subscription_tier → 'Free', 'Pro', 'Business'
created_at → Account creation timestamp
```

**Auto-populated via trigger** when user signs up through `handle_new_user()` function.

#### 3. **public.products**
```sql
id → Product unique ID (text)
name → Product name
category → Category classification
price → Product price (numeric)
image_url → Product image URL
velocity_score → Trend velocity (0-100)
saturation_score → Market saturation (0-100)
demand_signal → 'bullish', 'caution', 'bearish', 'neutral'
weekly_growth → Weekly growth percentage
reddit_mentions → Reddit mention count
sentiment_score → Sentiment analysis score
top_reddit_themes → Array of trending themes
source → Source marketplace (amazon, ebay, etc.)
rating → Product rating
review_count → Total reviews
ad_signal → Ad spend level ('high', 'medium', 'low')
created_at → Product creation timestamp
updated_at → Last update timestamp
```

**Populated by** backend scraper on `/refresh` endpoint.

#### 4. **public.user_activity**
```sql
id → UUID primary key
user_id → FK to auth.users
activity_type → 'view', 'analyze', 'compare', 'search', 'save'
product_id → FK to products (nullable)
metadata → JSONB with additional context
created_at → Activity timestamp
```

**Tracks** user interactions for analytics and personalization.

#### 5. **public.saved_products**
```sql
id → UUID primary key
user_id → FK to auth.users
product_id → FK to products
saved_at → When saved
UNIQUE(user_id, product_id) → Prevent duplicates
```

**Implements** favorites/watchlist functionality.

#### 6. **public.comparisons**
```sql
id → UUID primary key
user_id → FK to auth.users
product_ids → Array of product IDs to compare
notes → User notes about comparison
created_at → Creation timestamp
updated_at → Last modification timestamp
```

**Stores** product comparisons created by users.

### Row Level Security (RLS)

All tables have RLS enabled for data protection:

```
profiles:
  - SELECT: Users can view their own profile
  - UPDATE: Users can update their own profile

user_activity:
  - SELECT: Users can view their own activity
  - INSERT: Users can create activity for themselves

saved_products:
  - SELECT: Users can view their own saved products
  - INSERT/DELETE: Users manage their own saved products

comparisons:
  - ALL: Users manage their own comparisons only
```

### Indexes for Performance

```sql
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_created_at ON public.products(created_at);
CREATE INDEX idx_products_velocity ON public.products(velocity_score);
CREATE INDEX idx_activity_user ON public.user_activity(user_id);
CREATE INDEX idx_saved_user ON public.saved_products(user_id);
CREATE INDEX idx_comparison_user ON public.comparisons(user_id);
```

## Backend Layer (FastAPI)

### Environment Setup

```bash
# backend/.env
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Core Files

#### `backend/main.py`
Main FastAPI application with endpoints:

**Data Scraping Endpoints:**
- `POST /refresh` - Trigger product scraper in background
- `POST /deep-scan` - Full category scan
- `GET /health` - Health check

**User Action Endpoints:**
- `POST /user/save-product` - Save product to favorites
- `DELETE /user/saved-product/{user_id}/{product_id}` - Remove from favorites
- `GET /user/saved-products/{user_id}` - Get user's saved products
- `POST /user/create-comparison` - Create product comparison
- `GET /user/comparisons/{user_id}` - Get user's comparisons
- `POST /user/track-activity` - Log user activity
- `GET /analytics/products` - Get product analytics

#### `backend/supabase_utils.py`
Utility class for Supabase operations:

```python
class SupabaseDB:
    ├── is_connected() → Check connection
    ├── upsert_products() → Batch insert/update products
    ├── save_product() → Add to favorites
    ├── remove_saved_product() → Remove from favorites
    ├── create_comparison() → Create comparison
    ├── track_user_activity() → Log activity
    └── get_product_analytics() → Fetch stats
```

### API Endpoints

**Request/Response Examples:**

```bash
# Save Product
POST /user/save-product
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "product_id": "ama-123456"
}
Response: {"success": true, "message": "Product saved"}

# Create Comparison
POST /user/create-comparison
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "product_ids": ["ama-123", "ebay-456"],
  "notes": "Price comparison"
}
Response: {"success": true, "comparison_id": "UUID"}

# Track Activity
POST /user/track-activity
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "activity_type": "view",
  "product_id": "ama-123",
  "metadata": {"source": "search"}
}
Response: {"success": true, "message": "Activity tracked"}
```

## Frontend Layer (React + TypeScript)

### Context Architecture

#### `src/contexts/AuthContext.tsx`
Manages authentication state:

```typescript
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier?: 'Free' | 'Pro' | 'Business';
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp() → Promise
  signIn() → Promise
  signOut() → Promise
  createProfile() → Promise
  updateProfile() → Promise
  refreshUserSession() → Promise
}
```

**Initialization Flow:**
1. On mount, check `getSession()` from Supabase
2. Fetch user profile from `profiles` table
3. Subscribe to auth state changes
4. Auto-login if valid session exists

#### `src/contexts/ProductContext.tsx`
Manages product data and interactions:

```typescript
interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  refreshProducts() → Promise
  saveProduct(productId) → Promise
  removeSavedProduct(productId) → Promise
  getSavedProducts() → Promise<string[]>
  createComparison(productIds, notes?) → Promise
  trackProductView(productId) → Promise
}
```

**Data Flow:**
1. On mount, fetch products from Supabase
2. If empty, trigger backend `/refresh` endpoint
3. Backend scrapes data and upserts to database
4. Frontend syncs with latest products
5. Products can be saved/compared with API calls

### API Service Layer

`src/lib/api.ts` - Centralized API client:

```typescript
class APIService {
  private apiCall<T>(endpoint, method, body?, useAuth?) → Promise<T>
  
  // Product operations
  saveProduct(userId, productId) → Promise
  removeSavedProduct(userId, productId) → Promise
  getSavedProducts(userId) → Promise
  
  // Comparisons
  createComparison(userId, productIds, notes?) → Promise
  getComparisons(userId) → Promise
  
  // Activity tracking
  trackActivity(userId, type, productId?, metadata?) → Promise
  
  // Data refresh
  refreshProducts() → Promise
  getAnalytics() → Promise
}
```

### Supabase Client

`src/lib/supabase.ts`:

```typescript
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

**Usage in components:**
```typescript
// Direct database access
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'electronics');

// Authentication
const { user, session } = await supabase.auth.getUser();
```

## Data Flow Examples

### Authentication & User Creation

```
1. User clicks "Sign Up"
   ↓
2. Frontend: SignupPage.tsx
   - Validates email/password
   - Calls AuthContext.signUp()
   ↓
3. AuthContext.tsx
   - supabase.auth.signUp(email, password)
   - JWT token created in auth.users
   ↓
4. Supabase Trigger
   - handle_new_user() executes
   - Creates row in profiles table
   ↓
5. Frontend: Auto-redirect to /dashboard
   - Dashboard fetches profile via useAuth()
   - User sees personalized dashboard
```

### Product Viewing & Analytics

```
1. User views product page
   ↓
2. Frontend: ProductDetail.tsx
   - Calls useProducts().trackProductView(productId)
   ↓
3. ProductContext.tsx
   - Calls apiService.trackActivity(userId, 'view', productId)
   ↓
4. Backend: POST /user/track-activity
   - Inserts activity row
   ↓
5. Database: user_activity table
   - Records view timestamp
   - Can later aggregate for analytics
```

### Saving Products

```
1. User clicks "Save" button
   ↓
2. Frontend: ProductCard.tsx
   - Checks if user authenticated (useAuth)
   - Calls useProducts().saveProduct(productId)
   ↓
3. ProductContext.tsx
   - Calls apiService.saveProduct(userId, productId)
   ↓
4. Backend: POST /user/save-product
   - Validates user & product
   - Inserts into saved_products table
   - Tracks activity
   ↓
5. Database: saved_products table
   - (user_id, product_id) unique constraint
   - Prevents duplicates
```

### Creating Comparisons

```
1. User selects 2+ products
   - Clicks "Compare"
   ↓
2. Frontend: Compare page
   - Calls useProducts().createComparison(productIds, notes)
   ↓
3. ProductContext.tsx
   - Calls apiService.createComparison(userId, productIds)
   ↓
4. Backend: POST /user/create-comparison
   - Validates ≥2 products
   - Creates comparison record
   - Tracks 'compare' activity
   ↓
5. Database: comparisons table
   - Stores product IDs as array
   - Records timestamp
   - Links to user via RLS
```

## Environment Variables

### Frontend (.env)
```bash
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_BACKEND_API_URL=https://pickspy-backend.onrender.com
```

### Backend (.env)
```bash
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## Integration Checklist

- [x] Authentication system with Supabase
- [x] User profiles with subscription tiers
- [x] Product table with all required fields
- [x] Activity tracking for analytics
- [x] Saved products (favorites) functionality
- [x] Product comparison feature
- [x] Backend API endpoints for all features
- [x] Supabase utilities for database operations
- [x] Row-level security policies
- [x] Database indexes for performance
- [x] API service layer on frontend
- [x] Error handling & validation
- [x] Activity tracking in frontend contexts
- [x] Auto-login on page refresh
- [x] Protected routes requiring authentication

## Testing the Integration

### 1. Backend Health Check
```bash
curl https://pickspy-backend.onrender.com/health
# Response: {"status": "online", "database": "connected"}
```

### 2. Product Refresh
```bash
curl -X POST https://pickspy-backend.onrender.com/refresh
# Triggers scraper, returns preview + background task
```

### 3. User Activity
```bash
curl -X POST https://pickspy-backend.onrender.com/user/track-activity \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "activity_type": "view",
    "product_id": "prod-123"
  }'
```

### 4. Frontend Test
```typescript
// In Dashboard or any component
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';

const { profile } = useAuth();
const { products, saveProduct } = useProducts();

// Check user is logged in
console.log('User:', profile?.email);

// Check products loaded
console.log('Products:', products.length);

// Save a product
await saveProduct('ama-123');
```

## Troubleshooting

### Database Connection Issues
- Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in backend
- Verify database is running (Supabase dashboard)
- Check RLS policies allow operations

### Authentication Fails
- Clear browser storage and try again
- Check `VITE_SUPABASE_ANON_KEY` is correct
- Verify auth settings in Supabase dashboard

### Products Not Loading
- Check backend `/health` endpoint
- Verify products table exists in database
- Check browser console for API errors
- Trigger `/refresh` to populate data

### Activity Not Recording
- Verify user is authenticated (`useAuth().isAuthenticated`)
- Check `SUPABASE_SERVICE_ROLE_KEY` permissions
- Inspect network tab for POST requests

## Performance Optimization

1. **Pagination** - Add limit/offset to product queries
2. **Caching** - Use React Query for automatic caching
3. **Lazy Loading** - Load products on scroll
4. **Database Indexes** - Already created on key columns
5. **API Rate Limiting** - Consider adding on backend
6. **Batch Operations** - Upsert in chunks of 50

## Security Considerations

1. ✅ RLS policies restrict data access
2. ✅ Service role key only used server-side
3. ✅ Anon key limited to public reads
4. ✅ User activity tied to authenticated users
5. ✅ Input validation on backend
6. ⚠️ TODO: Add CORS restrictions
7. ⚠️ TODO: Add API rate limiting
8. ⚠️ TODO: Encrypt sensitive user data

## Future Enhancements

1. **Real-time Updates** - Use Supabase Realtime subscriptions
2. **Advanced Analytics** - Dashboard with user engagement metrics
3. **Recommendations** - ML-based product suggestions
4. **Notifications** - Alert users when saved products have deals
5. **Export Functionality** - CSV/PDF comparison reports
6. **Multi-language Support** - i18n integration
7. **Mobile App** - React Native or Flutter
