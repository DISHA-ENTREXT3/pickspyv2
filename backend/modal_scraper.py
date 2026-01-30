import modal
import os
import sys
import subprocess

# Define the Modal App
app = modal.App("pickspy-scrapers")

# Define the image with necessary dependencies
# We copy the local backend directory to the remote container so it has access to the spiders
image = (
    modal.Image.debian_slim()
    .pip_install(
        "scrapy",
        "supabase",
        "fake-useragent",
        "requests",
        "python-dotenv",
        "pandas",
        "beautifulsoup4",
        "pytrends",
        "lxml",
        "itemadapter",
        "scrapy-user-agents",
        "instagrapi",
        "pillow",
        "fastapi"
    )
    .add_local_dir("d:/PickSpy-main/backend", remote_path="/root/backend", ignore=["venv", "__pycache__", ".git", ".env"])
)

@app.function(
    image=image,
    secrets=[modal.Secret.from_name("pickspy-secrets")],
    timeout=3600
)
def run_spider_on_modal(spider_name: str):
    import os
    import subprocess
    print(f"🕷️ Starting spider: {spider_name} on Modal...", flush=True)
    try:
        os.chdir("/root/backend")
        
        # Verify DB connection inside Modal
        sys.path.append("/root/backend")
        from supabase_utils import get_db
        db = get_db()
        if db.is_connected():
            print("✅ Supabase connected from Modal remote.", flush=True)
            print(f"URL: {db.url[:25]}... Key set: {bool(db.key)}", flush=True)
        else:
            print("❌ Supabase NOT connected from Modal remote!", flush=True)
            print(f"ENV URL: {os.environ.get('SUPABASE_URL')}", flush=True)
        
        cmd = ["scrapy", "crawl", spider_name]
        print(f"Running command: {' '.join(cmd)}", flush=True)
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Spider {spider_name} finished successfully.", flush=True)
            return {"success": True, "log": result.stdout}
        else:
            print(f"❌ Spider {spider_name} failed.", flush=True)
            return {"success": False, "error": result.stderr}
    except Exception as e:
        print(f"Error running spider: {e}", flush=True)
        return {"success": False, "error": str(e)}

@app.function(
    image=image,
    secrets=[modal.Secret.from_name("pickspy-secrets")],
    timeout=3600
)
def run_product_analysis_on_modal(product_query: str):
    """Runs the GoogleProductInsightsAnalyzer on Modal"""
    import os
    import sys
    sys.path.append("/root/backend")
    from scrapers.spiders.product_insights_analyzer import get_product_insights_analyzer
    
    print(f"📊 Starting analysis for: {product_query}", flush=True)
    try:
        analyzer = get_product_insights_analyzer()
        result = analyzer.get_comprehensive_product_analysis(product_query)
        if result:
            print(f"✅ Analysis for {product_query} completed.", flush=True)
            return {"success": True, "data": result}
        else:
            print(f"❌ Analysis for {product_query} failed.", flush=True)
            return {"success": False, "error": "Analyzer returned no results"}
    except Exception as e:
        print(f"💥 Error in analysis: {e}", flush=True)
        return {"success": False, "error": str(e)}

@app.function(
    image=image,
    secrets=[modal.Secret.from_name("pickspy-secrets")],
    timeout=3600
)
def enrich_new_products():
    """Finds products without analysis and enriches them with AI intelligence"""
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    from scrapers.spiders.product_insights_analyzer import get_product_insights_analyzer
    
    db = get_db()
    print("🧠 Starting product enrichment task...", flush=True)
    
    # Get products without detailed analysis, priority to newest
    try:
        response = db.client.table("products").select("*").is_("detailed_analysis", "null").order("created_at", desc=True).limit(50).execute()
        products = response.data
        if not products:
            print("✨ No new products to enrich.", flush=True)
            return
        
        print(f"🔬 Enrching {len(products)} products...", flush=True)
        analyzer = get_product_insights_analyzer()
        
        for p in products:
            try:
                print(f"🤖 Analyzing: {p['name']}", flush=True)
                analysis = analyzer.get_comprehensive_product_analysis(p['name'])
                if analysis:
                    # Update record with pre-generated analysis
                    db.client.table("products").update({
                        "detailed_analysis": analysis,
                        "sentiment_score": analysis.get("viability_score", 70) # Map to existing column
                    }).eq("record_id", p["record_id"]).execute()
                else:
                    print(f"⚠️ No analysis results for {p['name']}", flush=True)
            except Exception as e:
                print(f"❌ Failed to enrich {p['name']}: {e}", flush=True)
                
        print("✅ Enrichment task completed.", flush=True)
    except Exception as e:
        print(f"💥 Enrichment Failed: {e}", flush=True)

# --- SCHEDULING ---
# Automatically run every day at midnight (UTC)
@app.function(
    image=image, 
    secrets=[modal.Secret.from_name("pickspy-secrets")],
    schedule=modal.Cron("0 0 * * *"), 
    timeout=7200
) 
def scheduled_scrapers():
    """Daily job to refresh all product data"""
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    
    spiders = ["amazon_bestsellers", "flipkart_trending", "ebay_search", "google_shopping"]
    print(f"⏰ Starting scheduled maintenance run for {len(spiders)} spiders...", flush=True)
    
    # 1. Run Spiders
    results = {}
    for spider in spiders:
        try:
            print(f"🔄 Running scheduled spider: {spider}", flush=True)
            results[spider] = run_spider_on_modal.remote(spider)
        except Exception as e:
            print(f"❌ Scheduled spider {spider} failed: {e}", flush=True)
            results[spider] = {"success": False, "error": str(e)}
            
    # 2. Enrich products with AI (spawn background task)
    print("🚀 Triggering AI Enrichment for new products...", flush=True)
    enrich_new_products.spawn()
    
    # 3. Cleanup data older than 7 days
    try:
        print("🗑️ Running 7-day data retention cleanup...", flush=True)
        db = get_db()
        cleanup = db.delete_old_data(days=7)
        print(f"✅ Cleanup finished: {cleanup}", flush=True)
    except Exception as e:
         print(f"❌ Cleanup failed: {e}", flush=True)
         
    print("✅ Scheduled maintenance run fully completed.", flush=True)
    return results

# --- WEB API (REPLACING RENDER) ---
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

web_app = FastAPI()
web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class SaveProductRequest(BaseModel):
    user_id: str
    product_id: str

class ProductComparisonRequest(BaseModel):
    user_id: str
    product_ids: List[str]
    notes: Optional[str] = None

class ActivityTrackingRequest(BaseModel):
    user_id: str
    activity_type: str  # 'view', 'analyze', 'compare', 'search'
    product_id: Optional[str] = None
    metadata: Optional[dict] = None

class AnalyzeRequest(BaseModel):
    productName: str
    price: str = "0"
    region: str = "Global"

class SupportRequest(BaseModel):
    product: str
    category: str
    message: str
    user_email: str
    metadata: Optional[dict] = None

@web_app.get("/")
async def root():
    return {"message": "PickSpy Serverless API is running on Modal!", "status": "online"}

@web_app.post("/refresh")
@web_app.post("/deep-scan")
async def trigger_refresh():
    """Trigger daily scrapers on demand and return current data"""
    scheduled_scrapers.spawn()
    
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    
    try:
        db = get_db()
        response = db.client.table("products").select("*").order("created_at", desc=True).limit(50).execute()
        return {
            "status": "success", 
            "message": "Update started in cloud. Showing existing products...",
            "products": response.data
        }
    except:
        return {"status": "success", "message": "Scrapers started."}

@web_app.get("/api/product-analysis/{product_name}")
async def get_analysis(product_name: str):
    """Deep product analysis endpoint"""
    result = run_product_analysis_on_modal.remote(product_name)
    return result

@web_app.post("/api/ai/analyze")
async def analyze_ai(request: AnalyzeRequest):
    """AI Analysis endpoint"""
    result = run_product_analysis_on_modal.remote(request.productName)
    return result

@web_app.post("/support")
async def submit_support(payload: SupportRequest):
    import os
    import requests
    
    SUPABASE_SUPPORT_URL = "https://ldewwmfkymjmokopulys.supabase.co/functions/v1/submit-support"
    FORM_SECRET = os.environ.get("FORM_SECRET")
    
    # If explicit URL is provided in env, use it
    if os.environ.get("SUPPORT_WEBHOOK_URL"):
        SUPABASE_SUPPORT_URL = os.environ.get("SUPPORT_WEBHOOK_URL")

    try:
        response = requests.post(
            SUPABASE_SUPPORT_URL,
            headers={
                "Content-Type": "application/json",
                "x-form-secret": FORM_SECRET or "" 
            },
            json=payload.dict()
        )

        if response.status_code == 429:
            raise HTTPException(
                status_code=429,
                detail="Too many submissions. Try again later."
            )

        if not response.ok:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        return response.json()
    except Exception as e:
        print(f"Support submission error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@web_app.get("/health")
async def health():
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    db = get_db()
    return {
        "status": "online", 
        "provider": "Modal", 
        "database": "connected" if db.is_connected() else "disconnected"
    }

# --- USER ROUTES ---

@web_app.post("/user/save-product")
async def save_product(request: SaveProductRequest):
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    db = get_db()
    result = db.save_product(request.user_id, request.product_id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@web_app.delete("/user/saved-product/{user_id}/{product_id}")
async def remove_saved_product(user_id: str, product_id: str):
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    db = get_db()
    success = db.remove_saved_product(user_id, product_id)
    return {"success": success}

@web_app.get("/user/saved-products/{user_id}")
async def get_saved_products(user_id: str):
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    db = get_db()
    products = db.get_user_saved_products(user_id)
    return {"user_id": user_id, "saved_products": products, "count": len(products)}

@web_app.post("/user/track-activity")
async def track_activity(request: ActivityTrackingRequest):
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    db = get_db()
    success = db.track_user_activity(request.user_id, request.activity_type, request.product_id, request.metadata)
    return {"success": success}

@web_app.get("/analytics/products")
async def get_analytics():
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    db = get_db()
    return db.get_product_analytics(days=7)

@web_app.post("/user/create-comparison")
async def create_comparison(request: ProductComparisonRequest):
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    db = get_db()
    result = db.create_comparison(request.user_id, request.product_ids, request.notes)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@web_app.get("/user/comparisons/{user_id}")
async def get_comparisons(user_id: str):
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    db = get_db()
    comparisons = db.get_user_comparisons(user_id)
    return {"user_id": user_id, "comparisons": comparisons, "count": len(comparisons)}

@web_app.get("/api/scraper-status")
async def scraper_status():
    return {
        "success": True, 
        "scrapers": ["amazon", "ebay", "flipkart", "google_shopping", "trends", "sentiment"]
    }

@app.function(
    image=image,
    secrets=[modal.Secret.from_name("pickspy-secrets")],
)
@modal.asgi_app()
def api():
    return web_app

@app.function(
    image=image,
    secrets=[modal.Secret.from_name("pickspy-secrets")],
    timeout=600
)
def test_db_func():
    """Test Supabase connection and write from Modal"""
    import os
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    db = get_db()
    
    print(f"🔗 Supabase URL: {db.url}", flush=True)
    if not db.is_connected():
        return {"success": False, "error": "Could not connect to Supabase"}
        
    test_product = {
        "id": "modal-test-conn",
        "name": "Modal Connection Test",
        "source": "modal_system",
        "category": "system",
        "price": 0
    }
    
    print("📝 Testing UPSERT...", flush=True)
    result = db.upsert_products([test_product])
    return result

@app.local_entrypoint()
def main(spider_name: str = None, analyze: str = None, test_db: bool = False):
    if test_db:
        print("🧪 Triggering DB Test on Modal...")
        ret = test_db_func.remote()
        print(f"Result: {ret}")
    elif analyze:
        print(f"🚀 Triggering Analysis for: {analyze}")
        ret = run_product_analysis_on_modal.remote(analyze)
        print(f"Result: {ret}")
    elif spider_name:
        print(f"🚀 Triggering Spider: {spider_name}")
        ret = run_spider_on_modal.remote(spider_name)
        if ret.get("success"):
            print(f"✅ Spider Run Log:\n{ret.get('log')}")
        else:
            print(f"❌ Spider failed: {ret.get('error')}")
        print(f"Result Recap: {ret}")
    else:
        print("💡 Please provide --spider-name or --analyze argument.")

# Instructions for user:
# 1. Install modal: pip install modal
# 2. Setup token: modal setup
# 3. Create secrets: modal secret create pickspy-secrets SUPABASE_URL=... SUPABASE_KEY=...
# 4. Run: modal run backend/modal_scraper.py
