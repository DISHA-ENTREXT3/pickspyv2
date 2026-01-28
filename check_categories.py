import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.join(os.getcwd(), 'backend'))
from supabase_utils import get_db
load_dotenv()

def check_categories():
    db = get_db()
    if not db.is_connected():
        print("❌ Supabase not connected")
        return

    categories = [
        "electronics", "home-garden", "beauty", "fashion", 
        "sports", "toys", "automotive", "pet-supplies", "general"
    ]
    for cat in categories:
        try:
            res = db.client.table("products").select("id", count="exact").eq("category", cat).execute()
            count = res.count if hasattr(res, 'count') else 0
            print(f"Category {cat}: {count} products")
        except Exception as e:
            print(f"Error checking {cat}: {e}")

if __name__ == "__main__":
    check_categories()
