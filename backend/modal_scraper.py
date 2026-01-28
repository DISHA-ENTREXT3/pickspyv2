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

# --- SCHEDULING ---
# Automatically run every day at midnight (UTC)
@app.function(schedule=modal.Cron("0 0 * * *"), timeout=7200) 
def scheduled_scrapers():
    """Daily job to refresh all product data"""
    spiders = ["amazon_bestsellers", "flipkart_trending", "ebay_search", "google_shopping"]
    print(f"⏰ Starting scheduled maintenance run for {len(spiders)} spiders...", flush=True)
    
    results = {}
    for spider in spiders:
        try:
            print(f"🔄 Running scheduled spider: {spider}", flush=True)
            results[spider] = run_spider_on_modal.remote(spider)
        except Exception as e:
            print(f"❌ Scheduled spider {spider} failed: {e}", flush=True)
            results[spider] = {"success": False, "error": str(e)}
    print("✅ Scheduled maintenance run completed.", flush=True)
    return results

# --- WEB API (REPLACING RENDER) ---
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

web_app = FastAPI()
web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@web_app.get("/")
async def root():
    return {"message": "PickSpy Serverless API is running on Modal!", "status": "online"}

@web_app.post("/refresh")
async def refresh():
    """Trigger daily scrapers on demand and return current data"""
    import sys
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    
    # 1. Trigger crawlers in background
    # Note: spawn() initiates the function without waiting for it
    print("🚀 Manual refresh triggered. Spawning scheduled_scrapers handle...")
    scheduled_scrapers.spawn()
    
    # 2. Get current data to keep UI active
    try:
        db = get_db()
        # Query existing products so the frontend doesn't blank out
        response = db.client.table("products").select("*").order("created_at", desc=True).limit(50).execute()
        products = response.data
        print(f"✅ Refresh responding with {len(products)} cached products.")
        return {
            "status": "success", 
            "message": "Update started in cloud. Showing existing products...",
            "products": products
        }
    except Exception as e:
        print(f"⚠️ Refresh data fetch error: {e}")
        return {"status": "success", "message": "Scrapers started."}

@web_app.get("/api/product-analysis/{product_name}")
async def get_analysis(product_name: str):
    """Deep product analysis endpoint (matches Render)"""
    result = run_product_analysis_on_modal.remote(product_name)
    if result.get("success"):
        return {"success": True, "data": result.get("data")}
    return result

@web_app.post("/api/ai/analyze")
async def analyze_ai(request: dict):
    """AI Analysis endpoint (matches Render)"""
    # Simply route to the product analysis for now or implement direct AI logic
    product_name = request.get("productName", "")
    result = run_product_analysis_on_modal.remote(product_name)
    return {"success": True, "data": result.get("data")}

@web_app.get("/health")
async def health():
    return {"status": "online", "provider": "Modal Serverless"}

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
