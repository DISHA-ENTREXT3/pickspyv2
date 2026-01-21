import os
import random
import time
import requests
import hashlib
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv

# Load env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase credentials not found in .env")
    exit(1)

# REST API Headers
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

ENDPOINT = f"{SUPABASE_URL}/rest/v1/products"

# --- CONFIGURATION (Same Categories) ---

CATEGORIES = {
    'electronics': [
        "wireless earbuds", "smart watch", "gaming mouse", "mechanical keyboard", "4k monitor", 
        "drone camera", "power bank 20000mah", "usb-c hub", "webcam 1080p", "bluetooth speaker",
        "ssd 1tb", "graphics card", "gaming headset", "vr headset", "smart plug",
        "projector 4k", "dash cam", "security camera", "wifi 6 router", "tablet android"
    ],
    'home-garden': [
        "air fryer", "robot vacuum", "coffee maker", "blender smoothie", "led strip lights",
        "ergonomic office chair", "standing desk", "weighted blanket", "air purifier", "humidifier",
        "kitchen knife set", "non-stick pan", "food storage containers", "memory foam pillow", "duvet cover",
        "desk lamp", "bookshelf", "plant pot ceramic", "garden hose expandable", "solar outdoor lights"
    ],
    'beauty': [
        "vitamin c serum", "retinol cream", "hyaluronic acid", "face moisturizer", "sunscreen spf 50",
        "hair dryer ionic", "hair straightener", "makeup brush set", "gel nail polish kit", "facial cleanser",
        "eye cream", "clay mask", "shampoo sulfate free", "beard oil", "electric shaver",
        "teeth whitening kit", "collagen powder", "essential oils set", "bath bombs", "lip gloss plumping"
    ],
    'fashion': [
        "men's leather wallet", "women's crossbody bag", "polarized sunglasses", "canvas sneakers", "hoodie oversized",
        "yoga pants high waist", "denim jacket", "running shoes", "backpack waterproof", "watch analog",
        "gym shorts", "winter scarf", "beanie hat", "ankle boots", "cardigan sweater",
        "belt leather", "tote bag canvas", "earrings gold hoop", "necklace pendant", "smart ring"
    ],
    'sports': [
        "yoga mat non slip", "resistance bands set", "dumbbell set", "protein powder whey", "foam roller",
        "smart water bottle", "gym bag", "running socks", "knee brace", "cycling gloves",
        "tennis racket", "basketball indoor", "camping tent 2 person", "sleeping bag", "hiking backpack",
        "fitness tracker", "jump rope speed", "ab roller", "pull up bar", "massage gun"
    ],
    'toys': [
        "lego set star wars", "rc car offroad", "board game strategy", "puzzle 1000 pieces", "plush toy giant",
        "educational robot", "science kit for kids", "art supplies set", "drone for kids", "action figure",
        "doll house", "building blocks magnetic", "kitchen set toy", "doctor kit toy", "musical instrument kids"
    ],
    'automotive': [
        "car vacuum cleaner", "car phone mount", "obd2 scanner", "car seat organizer", "jumper cables",
        "car cover waterproof", "dash cam 4k", "tire inflator portable", "car cleaning kit", "led headlight bulbs",
        "car floor mats", "trunk organizer", "windshield repair kit", "oil filter wrench", "car wash soap"
    ],
    'pet-supplies': [
        "dog bed orthopedic", "cat tree tower", "dog leash retractable", "cat litter box automatic", "dog food grain free",
        "pet water fountain", "dog training collar", "cat toys interactive", "dog chew toys durable", "pet grooming kit",
        "aquarium filter", "bird cage", "hamster wheel", "reptile heat lamp", "pet carrier airline approved"
    ]
}

# --- HELPERS ---

def get_creative_logo(name):
    initials = "".join([w[0] for w in name.split()[:2]]).upper()
    bg = hashlib.md5(name.encode()).hexdigest()[:6]
    return f"https://ui-avatars.com/api/?name={initials}&background={bg}&color=fff&size=512&bold=true&format=svg"

def generate_mock_product(keyword, category):
    seed = int(hashlib.md5(keyword.encode()).hexdigest(), 16)
    random.seed(seed)
    
    price = random.uniform(15, 200)
    adjs = ["Premium", "Ultra", "Smart", "Pro", "Eco", "Portable", "Digital", "Luxury"]
    name = f"{random.choice(adjs)} {keyword.title()} {random.randint(2024, 2025)} Edition"
    
    return {
        "id": f"gen-{seed % 100000}",
        "name": name,
        "category": category,
        "price": round(price, 2),
        "image_url": get_creative_logo(name),
        "velocity_score": random.randint(40, 95),
        "saturation_score": random.randint(20, 80),
        "demand_signal": random.choice(["bullish", "caution", "neutral"]),
        "weekly_growth": round(random.uniform(2, 50), 1),
        "reddit_mentions": random.randint(100, 5000),
        "sentiment_score": random.randint(50, 95),
        "top_reddit_themes": ["Viral", "Trending", "Best Value"],
        "last_updated": "Just now",
        "source": random.choice(["amazon", "flipkart"]),
        "rating": round(random.uniform(3.5, 4.9), 1),
        "review_count": random.randint(50, 5000),
        "ad_signal": random.choice(["high", "medium", "low"]),
        "social_signals": random.sample(["Instagram Viral", "TikTok Trend", "Google Spy", "Fb Ads"], 2),
        "faqs": [{"question": f"Is this good for {category}?", "answer": "Yes, highly rated."}],
        "competitors": [],
        "reddit_threads": []
    }

def scrape_single_keyword(args):
    keyword, category = args
    return generate_mock_product(keyword, category)

# --- MAIN ---

def seed_database():
    print("Starting massive database seed (Target: 500+ products via REST)...")
    
    tasks = []
    for cat, keywords in CATEGORIES.items():
        expanded_keywords = []
        for k in keywords:
            expanded_keywords.append(k)
            expanded_keywords.append(f"best {k}")
            expanded_keywords.append(f"budget {k}")
            expanded_keywords.append(f"luxury {k}")
        
        for k in expanded_keywords[:75]:
            tasks.append((k, cat))

    print(f"Prepared {len(tasks)} items to process.")
    
    current_batch = []
    batch_size = 50
    completed = 0
    
    with ThreadPoolExecutor(max_workers=20) as executor:
        future_to_kw = {executor.submit(scrape_single_keyword, t): t for t in tasks}
        
        for future in as_completed(future_to_kw):
            data = future.result()
            current_batch.append(data)
            completed += 1
            
            if len(current_batch) >= batch_size:
                print(f"Upserting batch of {len(current_batch)}... (Total: {completed})")
                try:
                    resp = requests.post(ENDPOINT, headers=HEADERS, json=current_batch)
                    if resp.status_code >= 400:
                        print(f"Supabase Error: {resp.text}")
                except Exception as e:
                    print(f"Req Error: {e}")
                
                current_batch = []
                time.sleep(0.2)

        if current_batch:
            print(f"Upserting final batch of {len(current_batch)}...")
            requests.post(ENDPOINT, headers=HEADERS, json=current_batch)

    print("Seeding Complete!")

if __name__ == "__main__":
    seed_database()
