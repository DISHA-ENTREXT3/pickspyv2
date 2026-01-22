# 🔐 Google OAuth Setup & Configuration Guide

## ✅ Issue Fixed

**Problem:** Google OAuth wasn't working because:
1. Missing `supabase` client import in SignupPage.tsx
2. Using `(window as any).supabase` which doesn't exist
3. Should use the imported `supabase` client from `@/lib/supabase`

**Solution:** Fixed SignupPage.tsx to properly import and use Supabase client

---

## 🚀 Setup Instructions

### Step 1: Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**:
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "Credentials" in sidebar
   - Click "Create Credentials" → "OAuth Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     http://localhost:3000/auth/callback
     http://localhost:5173/auth/callback
     https://your-domain.com/auth/callback
     ```
   - Save and copy your **Client ID** and **Client Secret**

### Step 2: Configure Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your PickSpy project
3. Navigate to: **Authentication** → **Providers**
4. Click on **Google** provider
5. Enable it
6. Paste your Google OAuth credentials:
   - **Google Client ID:** Your Client ID from Step 1
   - **Google Client Secret:** Your Client Secret from Step 1
7. Click "Save"

### Step 3: Set Redirect URL in Google Console

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. In your OAuth app, add Supabase redirect URIs:
   - `https://[your-project].supabase.co/auth/v1/callback`
   - Example: `https://fogfnvewxeqxqtsrclbd.supabase.co/auth/v1/callback`

### Step 4: Verify Environment Variables

**Frontend (.env or .env.local):**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_BACKEND_API_URL=https://pickspy-backend.onrender.com
```

**Backend (.env):**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 🔧 Code Changes Made

### SignupPage.tsx

**BEFORE:**
```tsx
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

// ... inside component
const handleGoogleAuth = async () => {
  const { error } = await (window as any).supabase?.auth?.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
};
```

**AFTER:**
```tsx
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';  // ← Added
import { useState } from 'react';

// ... inside component
const handleGoogleAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({  // ← Fixed
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      skipBrowserRedirect: false,
    },
  });
  
  if (error) {
    console.error('Google OAuth error:', error);
    toast.error(`Authentication error: ${error.message}`);
  }
};
```

---

## 🧪 Testing Google OAuth

### Local Testing

```bash
# 1. Start frontend
npm run dev

# 2. Navigate to signup page
# Visit: http://localhost:5173/signup

# 3. Click "Sign up with Google"
# Should redirect to Google login

# 4. After authentication
# Should redirect back to /dashboard
# User profile should be created
```

### Production Testing

```bash
# 1. Ensure production URL is added to Google OAuth
# https://your-domain.com/auth/callback

# 2. Test on deployed site
# Click "Sign in with Google"

# 3. Verify user creation in Supabase
# Go to: Authentication → Users
# New user should appear with Google provider
```

---

## 🐛 Troubleshooting

### Issue: "Invalid redirect URI"

**Solution:**
1. Go to Google Cloud Console
2. Click on your OAuth app
3. Add the exact URI from error message
4. Wait 5 minutes for changes to propagate

### Issue: "OAuth not working locally"

**Solution:**
1. Check if `localhost:3000` or `localhost:5173` is in Google OAuth URIs
2. Verify Supabase environment variables are set
3. Check browser console for detailed errors

### Issue: "User not created in database"

**Solution:**
1. Check Supabase `profiles` table exists
2. Verify RLS policies allow user profile creation
3. Check if `onAuthStateChange` is properly subscribed in AuthContext

### Issue: "Button doesn't trigger OAuth"

**Solution:**
1. Verify supabase client is imported in SignupPage.tsx
2. Check if environment variables are loaded: `console.log(import.meta.env.VITE_SUPABASE_URL)`
3. Ensure browser allows third-party auth redirects

---

## 📋 Google OAuth Configuration Checklist

- [ ] Google Cloud Project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Client ID and Client Secret obtained
- [ ] Supabase Google provider enabled
- [ ] Google credentials added to Supabase
- [ ] Redirect URIs added to Google Console
- [ ] Frontend environment variables set
- [ ] Backend environment variables set
- [ ] SignupPage.tsx imports supabase client
- [ ] Test on localhost
- [ ] Test on production domain
- [ ] User can sign up with Google
- [ ] User can sign in with Google
- [ ] User profile created automatically
- [ ] Session persists after OAuth login

---

## 🔐 Security Best Practices

✅ **Do:**
- Keep Client Secret private (never commit to repo)
- Use environment variables for all credentials
- Enable HTTPS on production
- Regularly rotate OAuth credentials
- Verify redirect URIs are correct

❌ **Don't:**
- Commit `.env` files with credentials
- Use same OAuth app for multiple domains
- Leave `skipBrowserRedirect: true` (causes issues)
- Share Client Secret publicly

---

## 📚 Additional Resources

- [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OAuth 2.0 Flow Diagram](https://auth0.com/docs/authorization/flows/authorization-code-flow)

---

## ✨ OAuth Flow Diagram

```
1. User clicks "Sign in with Google"
   ↓
2. Frontend calls: supabase.auth.signInWithOAuth({ provider: 'google' })
   ↓
3. Supabase redirects to Google login
   ↓
4. User authenticates with Google
   ↓
5. Google redirects back to Supabase callback URL
   ↓
6. Supabase creates/updates user in auth.users table
   ↓
7. Frontend redirected to /dashboard
   ↓
8. AuthContext detects session and fetches user profile
   ↓
9. Profile auto-created if new user
   ↓
10. User fully authenticated and ready to use app
```

---

## 🎉 Success Indicators

When Google OAuth is properly configured, you should see:

✅ "Sign in with Google" button visible on signup/login page  
✅ Clicking redirects to Google login  
✅ After auth, redirects back to dashboard  
✅ User created in Supabase auth.users  
✅ User profile auto-created in profiles table  
✅ Session persists on page refresh  
✅ User name displayed in dashboard greeting  

---

**Last Updated:** January 22, 2026  
**Status:** ✅ FIXED & READY
