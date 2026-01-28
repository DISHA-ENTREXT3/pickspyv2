import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.join(os.getcwd(), 'backend'))
from supabase_utils import get_db
load_dotenv()

def check_sources():
    db = get_db()
    if not db.is_connected():
        print("❌ Supabase not connected")
        return

    sources = ["amazon", "flipkart", "ebay", "google_shopping", "ai_insight"]
    for source in sources:
        try:
            res = db.client.table("products").select("id", count="exact").eq("source", source).execute()
            count = res.count if hasattr(res, 'count') else 0
            print(f"Source {source}: {count} products")
        except Exception as e:
            print(f"Error checking {source}: {e}")

if __name__ == "__main__":
    check_sources()
