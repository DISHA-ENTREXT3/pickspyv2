---
description: Guide to running the PickSpy application locally with live data support
---

# Local Development Guide

This guide explains how to run the full PickSpy stack locally, including the React frontend and the FastAPI/Scrapy backend.

## Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- Google Chrome (for Selenium scraping)

## Setup Steps

### 1. Backend Setup

The backend handles data scraping (Amazon, Google Trends) and API requests.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create/Activate Python virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend will be available at `http://localhost:8000`.

### 2. Frontend Setup

The frontend is a Vite + React application.

1. Navigate to the project root:
   ```bash
   cd ..
   ```
2. Create a `.env` file (if not exists) based on `.env.example`:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   VITE_BACKEND_API_URL=http://localhost:8000
   ```

   _Note: If you don't have Supabase credentials, the app will fallback to the backend API._

3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:8080` (or similar).

## Verifying Live Data

1. Open the frontend in your browser.
2. If Supabase is empty/unreachable, the app will automatically trigger a call to the backend `/refresh` endpoint.
3. Check the browser console or backend terminal. You should see "Scraper raw data received" (frontend) or "Starting refresh..." (backend).
4. New product data (scraped from Amazon via simulated engine) should appear on the dashboard.

## Dynamic Data Generation

The application now uses client-side dynamic generation for detailed metrics (Edit `src/lib/dataGenerators.ts`) to ensure the UI is always populated with rich data, even if the backend returns basic info.
