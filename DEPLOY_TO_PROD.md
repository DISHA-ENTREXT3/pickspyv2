# Deployment Guide: Vercel + Modal + Supabase

This guide explains how to deploy the PickSpy application using Vercel (Frontend), Modal (Backend), and Supabase (Database).

## 1. Database Setup (Supabase)

Ensure your Supabase project is active and you have the following credentials:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Your Supabase project should also have the `submit-support` Edge Function deployed.

## 2. Backend Deployment (Modal)

We use Modal for Python serverless functions, including scrapers and the API proxy.

1.  **Install Modal CLI:**

    ```bash
    pip install modal
    modal setup
    ```

2.  **Create Secrets:**
    Create a secret named `pickspy-secrets` in Modal dashboard or via CLI:

    ```bash
    modal secret create pickspy-secrets \
    SUPABASE_URL=https://fogfnvewxeqxqtsrclbd.supabase.co \
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
    OPENROUTER_API_KEY=your_openrouter_key \
    FORM_SECRET=of4BOyqAGkV6S5pvpQnjXcuVN9VXPfPyuI9CBNALojxCRRFyDNbbEpSumZz5pdRz9HhTpS
    ```

    _(Note: `FORM_SECRET` is critical for secure support ticket submission)_

3.  **Deploy:**
    ```bash
    modal deploy backend/modal_scraper.py
    ```
4.  **Get API URL:**
    After deployment, Modal will provide a web endpoint URL (e.g., `https://your-username--pickspy-scrapers-api.modal.run`). **Copy this URL.**

## 3. Frontend Deployment (Vercel)

1.  **Push Code to GitHub:**

    ```bash
    git add .
    git commit -m "Deployment ready"
    git push origin main
    ```

2.  **Import Project in Vercel:**
    - Connect your GitHub repository.
    - Framework Preset: `Vite`

3.  **Environment Variables (Vercel Project Settings):**
    Add the following variables:

    | Variable Name | Value |
    |Str|Str|
    | `VITE_SUPABASE_URL` | `https://fogfnvewxeqxqtsrclbd.supabase.co` |
    | `VITE_SUPABASE_ANON_KEY` | `your_supabase_anon_key` |
    | `VITE_BACKEND_API_URL` | **The Modal URL you copied in Step 2** |

4.  **Deploy:**
    Click "Deploy".

## 4. Verification

- Open your Vercel app URL.
- Go to `/blog` -> All images should load.
- Click the "Support" widget (bottom right). Submit a ticket. It should succeed.
- Check Supabase `saved_products` table to ensure data is syncing.
