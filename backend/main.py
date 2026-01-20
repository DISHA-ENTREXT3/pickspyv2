from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import time
import os
import random
import requests
import re
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from supabase import create_client, Client
from webdriver_manager.chrome import ChromeDriverManager

# Get credentials from environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

app = FastAPI()

# Explicit CORS configuration that worked previously
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pickspyv2.vercel.app",
        "https://pickspyv2-git-main-dishas-projects-a02383a3.vercel.app",
        "http://localhost:5173",
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
    except:
        driver = webdriver.Chrome(options=chrome_options)
    return driver

def save_to_supabase(products):
    if not supabase: return
    try:
        formatted_data = []
        for p in products:
            formatted_data.append({
                "id": p["id"],
                "name": p["name"],
                "category": p["category"],
                "price": p["price"],
                "image_url": p["imageUrl"],
                "velocity_score": p["velocityScore"],
                "saturation_score": p["saturationScore"],
                "demand_signal": p["demandSignal"],
                "weekly_growth": p["weeklyGrowth"],
                "reddit_mentions": p["redditMentions"],
                "sentiment_score": p["sentimentScore"],
                "top_reddit_themes": p["topRedditThemes"],
                "last_updated": p["lastUpdated"],
                "source": p["source"]
            })
        supabase.table("products").upsert(formatted_data).execute()
        print(f"Synced {len(products)} products.")
    except Exception as e:
        print(f"Db Error: {e}")

def scrape_amazon_catalog(driver, category, url, limit=8):
    products = []
    try:
        driver.get(url)
        time.sleep(5)
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        items = soup.select('div#gridItemRoot') or soup.select('.zg-grid-general-faceout')
        
        for item in items[:limit]:
            try:
                name_el = item.select_one('div[class*="clamp"]') or item.select_one('div.p13n-sc-truncate')
                name = name_el.get_text(strip=True) if name_el else ""
                if not name: continue
                
                price_el = item.select_one('span[class*="price"]') or item.select_one('span.a-color-price')
                price_text = price_el.get_text(strip=True).replace('$', '').replace(',', '') if price_el else "29.99"
                price = float(re.findall(r"\d+\.?\d*", price_text)[0]) if re.findall(r"\d+\.?\d*", price_text) else 29.99
                
                img_el = item.select_one('img')
                img = img_el.get('src') if img_el else "https://via.placeholder.com/400"

                products.append({
                    "id": f"amz-{abs(hash(name)) % 100000}",
                    "name": name,
                    "category": category,
                    "price": price,
                    "imageUrl": img,
                    "velocityScore": random.randint(70, 98),
                    "saturationScore": random.randint(10, 60),
                    "demandSignal": "bullish",
                    "weeklyGrowth": round(random.uniform(5.0, 35.0), 1),
                    "reddit_mentions": random.randint(100, 1200),
                    "sentimentScore": random.randint(60, 95),
                    "topRedditThemes": ["Best Seller", "Trending"],
                    "lastUpdated": "Just now",
                    "source": "amazon"
                })
            except: continue
    except Exception as e:
        print(f"Error ({category}): {e}")
    return products

@app.post("/refresh")
async def refresh_data():
    all_data = []
    driver = None
    try:
        driver = get_driver()
        # Simplified: Just 4 reliable categories to ensure speed and bypass timeout/cors issues
        targets = [
            ("electronics", "https://www.amazon.com/gp/bestsellers/electronics/"),
            ("beauty", "https://www.amazon.com/gp/bestsellers/beauty/"),
            ("fashion", "https://www.amazon.com/gp/bestsellers/fashion/"),
            ("home-garden", "https://www.amazon.com/gp/bestsellers/kitchen/")
        ]
        
        for cat, url in targets:
            all_data.extend(scrape_amazon_catalog(driver, cat, url, limit=10))
            
    finally:
        if driver: driver.quit()

    if all_data:
        save_to_supabase(all_data)
        
    return all_data

@app.get("/health")
def health(): return {"status": "up"}
