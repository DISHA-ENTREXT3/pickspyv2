# Deployment Configuration Guide

## 1. Environment Variables

### Frontend (Vercel)

Add these to your Vercel Project Settings -> Environment Variables:

```
VITE_SUPABASE_URL=https://fogfnvewxeqxqtsrclbd.supabase.co
VITE_SUPABASE_ANON_KEY=<your_anon_key>
VITE_BACKEND_API_URL=https://pickspy-backend.onrender.com
VITE_OPENROUTER_API_KEY=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
VITE_AI_MODEL=openai/gpt-4o-mini
```

### Backend (Render)

Add these to your Render Service Settings -> Environment:

```
SUPABASE_URL=https://fogfnvewxeqxqtsrclbd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
OPENROUTER_API_KEY=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
AI_MODEL=openai/gpt-4o-mini
INSTAGRAM_USERNAME=disha_entrext
INSTAGRAM_PASSWORD=Entrext@1234
```

### Modal (Already Configured)

You have already configured the secrets using `modal secret create`.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 2. Deployment Settings

### Vercel (Frontend)

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Render (Backend)

- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port 10000`
- **Python Version**: 3.11.0 (recommended)
