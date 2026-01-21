import os
import random
import time
import requests
import hashlib
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv

# Load env variables (Production)
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

SUPABASE_URL = "https://fogfnvewxeqxqtsrclbd.supabase.co"
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_KEY:
    # Explicit backup key from context if env missing
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ2ZudmV3eGVxeHF0c3JjbGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjI3MTksImV4cCI6MjA4NDQ5ODcxOX0.a1P7RLDzoz-v4aphUABMs5HLeIHz0j2cxYWluA15j34"

# REST API Headers
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

ENDPOINT = f"{SUPABASE_URL}/rest/v1/products"

CATEGORIES = {
    'electronics': ["wireless earbuds", "smart watch", "gaming mouse", "keyboard", "monitor", "drone", "power bank", "webcam"],
    'home-garden': ["air fryer", "robot vacuum", "coffee maker", "blender", "led lights", "chair", "desk", "blanket"],
    'beauty': ["vitamin c serum", "retinol", "moisturizer", "sunscreen", "hair dryer", "straightener", "makeup brush"],
    'fashion': ["wallet", "bag", "sunglasses", "sneakers", "hoodie", "jacket", "shoes", "watch", "shorts", "scarf"],
    'sports': ["yoga mat", "bands", "dumbbells", "protein", "foam roller", "water bottle", "gym bag", "knee brace"],
    'toys': ["lego", "rc car", "board game", "puzzle", "plush toy", "robot", "science kit", "drone kids"],
    'automotive': ["car vacuum", "phone mount", "scanner", "organizer", "cables", "dash cam", "inflator"],
    'pet-supplies': ["dog bed", "cat tree", "leash", "litter box", "dog food", "fountain", "collar", "toy"]
}

def get_creative_logo(name):
    initials = "".join([w[0] for w in name.split()[:2]]).upper()
    bg = hashlib.md5(name.encode()).hexdigest()[:6]
    return f"https://ui-avatars.com/api/?name={initials}&background={bg}&color=fff&size=512&bold=true&format=svg"

def generate_product(keyword, category, index):
    seed = int(hashlib.md5(f"{keyword}{index}".encode()).hexdigest(), 16)
    random.seed(seed)
    
    PLATFORMS = [
        "amazon", "ebay", "alibaba", "taobao", "tmall", "etsy",
        "walmart", "aliexpress", "mercadolibre", "shopee", "rakuten",
        "shopify", "bigcommerce", "woocommerce", "wix", "squarespace", "magento"
    ]
    source = random.choice(PLATFORMS)

    adjs = ["Premium", "Smart", "Ultra", "Pro", "Eco", "Luxury"]
    if source == "etsy": adjs = ["Handmade", "Vintage", "Custom", "Artisan"]
    elif source in ["alibaba", "aliexpress"]: adjs = ["Wholesale", "Factory", "Direct"]

    name = f"{random.choice(adjs)} {keyword.title()} {random.randint(2024, 2025)}"
    price = round(random.uniform(15, 200), 2)
    
    return {
        "id": f"seed-{category[:3]}-{seed % 100000}",
        "name": name,
        "category": category,
        "price": price,
        "image_url": get_creative_logo(name),
        "velocity_score": random.randint(40, 95),
        "saturation_score": random.randint(20, 80),
        "demand_signal": random.choice(["bullish", "caution"]),
        "weekly_growth": round(random.uniform(2, 50), 1),
        "reddit_mentions": random.randint(100, 5000),
        "sentiment_score": random.randint(50, 95),
        "top_reddit_themes": ["Viral", "Trending", "Hot"],
        "last_updated": "Live",
        "source": source,
        "rating": round(random.uniform(3.5, 4.9), 1),
        "review_count": random.randint(50, 5000),
        "ad_signal": random.choice(["high", "medium"]),
        "social_signals": random.sample(["Instagram Reel", "TikTok Viral", "Google Search"], 2),
        "faqs": [{"question": "Trending?", "answer": "Yes"}],
        "competitors": [],
        "reddit_threads": []
    }

def seed():
    print("Forcing Live Database Population...")
    batch = []
    total = 0
    
    for cat, keywords in CATEGORIES.items():
        # Generate 60 items per category (8 * 60 = 480 items)
        for k in keywords:
            for i in range(8): # 8 variations per keyword
                batch.append(generate_product(k, cat, i))
                
                if len(batch) >= 50:
                    try:
                        requests.post(ENDPOINT, headers=HEADERS, json=batch)
                        total += len(batch)
                        print(f"Pushed {total} items to Live DB...")
                    except Exception as e: print(e)
                    batch = []
                    
    if batch:
        requests.post(ENDPOINT, headers=HEADERS, json=batch)
        print("Final batch pushed.")
        
    print("DONE! Refresh your website.")

if __name__ == "__main__":
    seed()
