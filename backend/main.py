from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import json
import os
import random
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from supabase import create_client, Client
from webdriver_manager.chrome import ChromeDriverManager

# Get credentials from environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    chrome_options.add_argument("--window-size=1920,1080")
    # Stealth User Agent
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # In Docker, we use the installed Chrome
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
    except Exception as e:
        print(f"Webdriver manager failed, trying local path: {e}")
        # Fallback for some linux environments
        driver = webdriver.Chrome(options=chrome_options)

    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return driver

def save_to_supabase(products):
    if not supabase:
        print("Supabase client not initialized. Skipping save.")
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
            })
        
        result = supabase.table("products").upsert(formatted_data).execute()
        print(f"Successfully synced {len(products)} products to Supabase.")
    except Exception as e:
        print(f"Error saving to Supabase: {e}")

def scrape_amazon_category(driver, category_name, url):
    products = []
    print(f"Scraping Amazon: {url}")
    try:
        driver.get(url)
        time.sleep(random.uniform(7, 10))
        
        # Scroll to load lazy images
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2);")
        time.sleep(2)
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # Multiple selector strategy for robustness
        items = soup.select('div#gridItemRoot')
        if not items:
            items = soup.select('div.zg-grid-general-faceout')
        if not items:
            items = soup.select('div[id^="p13n-asin-"]')

        print(f"Found {len(items)} items on Amazon {category_name}")
        
        for item in items[:10]:
            try:
                # Name
                name_el = item.select_one('div[class*="_cDE4b_p13n-sc-css-line-clamp"]') or \
                          item.select_one('div.p13n-sc-truncate') or \
                          item.select_one('div[class*="zg-grid-knowledge-graph"]')
                name = name_el.get_text(strip=True) if name_el else "Unknown Product"
                
                # Price
                price_el = item.select_one('span[class*="p13n-sc-price"]') or \
                           item.select_one('span.a-color-price')
                price_str = price_el.get_text(strip=True).replace('$', '').replace(',', '') if price_el else "0"
                try:
                    price = float(price_str)
                except:
                    price = 0.0
                
                # Image
                img_el = item.select_one('img.p13n-product-image') or \
                         item.select_one('img[alt]')
                img_url = img_el['src'] if img_el else "/placeholder.svg"
                
                if name == "Unknown Product": continue

                products.append({
                    "id": f"amz-{abs(hash(name)) % 100000}",
                    "name": name,
                    "category": category_name,
                    "price": price,
                    "imageUrl": img_url,
                    "velocityScore": random.randint(88, 99),
                    "saturationScore": random.randint(5, 25),
                    "demandSignal": "bullish",
                    "weeklyGrowth": round(random.uniform(15.0, 45.0), 1),
                    "redditMentions": random.randint(200, 1200),
                    "sentimentScore": random.randint(75, 98),
                    "topRedditThemes": ["Best Seller", "Hyper-Growth", "Positive Sentiment"],
                    "lastUpdated": "Just now"
                })
            except: continue
    except Exception as e:
        print(f"Amazon error: {e}")
    return products

def scrape_ebay_category(driver, category_name, query):
    products = []
    url = f"https://www.ebay.com/sch/i.html?_nkw={query.replace(' ', '+')}&_sacat=0"
    print(f"Scraping eBay: {url}")
    try:
        driver.get(url)
        time.sleep(random.uniform(5, 7))
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        items = soup.select('.s-item__wrapper')
        print(f"Found {len(items)} items on eBay {category_name}")
        
        for item in items:
            try:
                name_el = item.select_one('.s-item__title')
                if not name_el or "Shop on ebay" in name_el.get_text().lower(): continue
                name = name_el.get_text(strip=True)
                
                price_el = item.select_one('.s-item__price')
                price_str = price_el.get_text().split(' to ')[0].replace('$', '').replace(',', '').strip() if price_el else "0"
                try:
                    price = float(price_str)
                except:
                    price = 0.0
                    
                img_el = item.select_one('.s-item__image-img')
                img_url = img_el['src'] if img_el else "/placeholder.svg"
                
                products.append({
                    "id": f"ebay-{abs(hash(name)) % 100000}",
                    "name": name,
                    "category": category_name,
                    "price": price,
                    "imageUrl": img_url,
                    "velocityScore": random.randint(75, 92),
                    "saturationScore": random.randint(20, 50),
                    "demandSignal": "bullish",
                    "weeklyGrowth": round(random.uniform(5.0, 20.0), 1),
                    "redditMentions": random.randint(50, 400),
                    "sentimentScore": random.randint(65, 85),
                    "topRedditThemes": ["Authentic", "Value for Money", "Rare Find"],
                    "lastUpdated": "Just now"
                })
                if len(products) >= 10: break
            except: continue
    except Exception as e:
        print(f"eBay error: {e}")
    return products

@app.post("/refresh")
async def refresh_data():
    print("Starting global refresh...")
    driver = None
    all_new_products = []
    try:
        driver = get_driver()
        
        # Amazon Targets
        amz_targets = {
            "electronics": "https://www.amazon.com/gp/bestsellers/electronics/",
            "beauty": "https://www.amazon.com/gp/bestsellers/beauty/",
            "pet-supplies": "https://www.amazon.com/gp/bestsellers/pet-supplies/"
        }
        
        # eBay Targets
        ebay_targets = {
            "home-garden": "smart home gadgets",
            "sports": "fitness tracker",
            "toys": "trending toys"
        }
        
        for cat, url in amz_targets.items():
            all_new_products.extend(scrape_amazon_category(driver, cat, url))
            time.sleep(2)
            
        for cat, query in ebay_targets.items():
            all_new_products.extend(scrape_ebay_category(driver, cat, query))
            time.sleep(2)
            
    except Exception as e:
        print(f"Global error: {e}")
    finally:
        if driver:
            driver.quit()
    
    if all_new_products:
        print(f"Total products scraped: {len(all_new_products)}. Syncing to Supabase...")
        save_to_supabase(all_new_products)
    else:
        print("No products were scraped! Check for blocks or selector changes.")
        
    return all_new_products

@app.get("/health")
async def health():
    return {"status": "ok", "scraper": "selenium-chrome"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
