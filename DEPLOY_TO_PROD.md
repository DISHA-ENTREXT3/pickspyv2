# Deployment Guide: Vercel + Modal + Supabase

This guide explains how to deploy the PickSpy application using Vercel (Frontend), Modal (Backend), and Supabase (Database).

## 1. Database Setup (Supabase)

Ensure your Supabase project is active and you have the following credentials:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Your Supabase project should also have the `submit-support` Edge Function deployed.
_No additional schema changes are required for this update._

## 2. Backend Deployment (Modal)

We use Modal for Python serverless functions, including scrapers and the API proxy.

1.  **Install Modal CLI:**

    ```bash
    pip install modal
    python -m modal setup
    ```

    _(If `modal` command is not found, use `python -m modal` instead)_

2.  **Create Secrets:**
    Create a secret named `pickspy-secrets` in Modal dashboard or via CLI:

    ```bash
    modal secret create pickspy-secrets \
    SUPABASE_URL=https://your-project.supabase.co \
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
    OPENROUTER_API_KEY=your_openrouter_key \
    FORM_SECRET=your_secure_form_secret_here \
    SUPPORT_WEBHOOK_URL=https://ldewwmfkymjmokopulys.supabase.co/functions/v1/submit-support
    ```

    _(Note: `FORM_SECRET` and `SUPPORT_WEBHOOK_URL` are for the separate support project)_

3.  **Deploy:**
    ```bash
    modal deploy backend/modal_scraper.py
    ```
4.  **Get API URL:**
    Your Backend API URL will be displayed in the terminal.

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

    | Variable Name            | Value                                  |
    | ------------------------ | -------------------------------------- |
    | `VITE_SUPABASE_URL`      | `https://your-project.supabase.co`     |
    | `VITE_SUPABASE_ANON_KEY` | `your_supabase_anon_key`               |
    | `VITE_BACKEND_API_URL`   | **The Modal URL you copied in Step 2** |

4.  **Deploy:**
    Click "Deploy".

## 4. Verification

- Open your Vercel app URL.
- Browse products.
- Click the "Support" widget (bottom right). Submit a ticket. It should succeed.
- Check Supabase to ensure data is syncing.
