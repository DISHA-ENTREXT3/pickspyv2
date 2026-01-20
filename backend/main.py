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

# Explicit CORS handling
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pickspyv2.vercel.app", 
        "https://pickspyv2-git-main-dishas-projects-a02383a3.vercel.app",
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

def get_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
    except:
        driver = webdriver.Chrome(options=chrome_options)
    return driver

def save_to_supabase(products):
    if not supabase:
        print("CRITICAL: Supabase keys missing!")
        return
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
        print(f"Synced {len(products)} products to Supabase.")
    except Exception as e:
        print(f"Db Error: {e}")

def scrape_ebay_fast(query, category):
    products = []
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
    # Using more robust searches
    url = f"https://www.ebay.com/sch/i.html?_nkw={query.replace(' ', '+')}&_sop=12"
    try:
        res = requests.get(url, headers=headers, timeout=12)
        soup = BeautifulSoup(res.text, 'html.parser')
        items = soup.select('.s-item__wrapper')
        for item in items[1:8]:
            name_el = item.select_one('.s-item__title')
            name = name_el.get_text() if name_el else ""
            if "shop on ebay" in name.lower() or not name: continue
            
            price_el = item.select_one('.s-item__price')
            price_text = price_el.get_text().replace('$', '').replace(',', '').split(' ')[0] if price_el else "0"
            
            img_el = item.select_one('.s-item__image-img')
            img = img_el['src'] if img_el else ""
            
            products.append({
                "id": f"ebay-{abs(hash(name)) % 100000}",
                "name": name,
                "category": category,
                "price": float(re.findall(r"\d+\.?\d*", price_text)[0]) if re.findall(r"\d+\.?\d*", price_text) else 0.0,
                "imageUrl": img,
                "velocityScore": random.randint(75, 95),
                "saturationScore": random.randint(15, 45),
                "demandSignal": "bullish",
                "weeklyGrowth": 14.8,
                "redditMentions": random.randint(100, 500),
                "sentimentScore": 85,
                "topRedditThemes": ["Productive", "Quality", "Value"],
                "lastUpdated": "Just now",
                "source": "ebay"
            })
    except Exception as e:
        print(f"eBay error: {e}")
    return products

def scrape_amazon_mini(driver, category, url):
    products = []
    try:
        driver.get(url)
        time.sleep(7) 
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        items = soup.select('div#gridItemRoot') or soup.select('.zg-grid-general-faceout')
        for item in items[:6]:
            name_el = item.select_one('div[class*="clamp"]') or item.select_one('div.p13n-sc-truncate')
            name = name_el.get_text(strip=True) if name_el else ""
            if not name: continue
            
            price_el = item.select_one('span[class*="p13n-sc-price"]') or item.select_one('span.a-color-price')
            price_text = price_el.get_text(strip=True).replace('$', '').replace(',', '') if price_el else "0"
            
            img = item.select_one('img')['src'] if item.select_one('img') else ""
            
            products.append({
                "id": f"amz-{abs(hash(name)) % 100000}",
                "name": name,
                "category": category,
                "price": float(re.findall(r"\d+\.?\d*", price_text)[0]) if re.findall(r"\d+\.?\d*", price_text) else random.randint(15, 99),
                "imageUrl": img,
                "velocityScore": 98,
                "saturationScore": 12,
                "demandSignal": "bullish",
                "weeklyGrowth": 32.4,
                "redditMentions": random.randint(400, 1500),
                "sentimentScore": 92,
                "topRedditThemes": ["Trending", "Must Have", "Social Media Viral"],
                "lastUpdated": "Trending now",
                "source": "amazon"
            })
    except Exception as e:
        print(f"Amazon error: {e}")
    return products

@app.post("/refresh")
async def refresh_data():
    all_data = []
    driver = None
    try:
        # 1. Faster eBay items (Broad searches to ensure results)
        all_data.extend(scrape_ebay_fast("wireless earbuds", "electronics"))
        all_data.extend(scrape_ebay_fast("yoga mat", "sports"))
        all_data.extend(scrape_ebay_fast("summer dress", "fashion"))
        
        # 2. Amazon Multiple Categories
        driver = get_driver()
        # Beauty
        all_data.extend(scrape_amazon_mini(driver, "beauty", "https://www.amazon.com/gp/bestsellers/beauty/"))
        # Pet Supplies
        all_data.extend(scrape_amazon_mini(driver, "pet-supplies", "https://www.amazon.com/gp/bestsellers/pet-supplies/"))
        # Home Decor
        all_data.extend(scrape_amazon_mini(driver, "home-garden", "https://www.amazon.com/gp/bestsellers/kitchen/"))
        
    finally:
        if driver: driver.quit()
    
    if all_data:
        # Filter duplicates or empty names
        unique_data = {p['name']: p for p in all_data if p['name']}.values()
        all_data = list(unique_data)
        save_to_supabase(all_data)
        
    return all_data

@app.get("/health")
def health(): return {"status": "up"}
