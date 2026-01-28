import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.join(os.getcwd(), 'backend'))
from supabase_utils import get_db
load_dotenv()

def fix_categories():
    db = get_db()
    if not db.is_connected():
        print("❌ Supabase not connected")
        return

    # Fetch all 'zgbs' products
    res = db.client.table("products").select("*").eq("category", "zgbs").execute()
    products = res.data
    print(f"Found {len(products)} products with 'zgbs' category.")

    updates = 0
    for p in products:
        new_cat = "electronics"
        name = p.get("name", "").lower()
        
        # Simple mapping heuristics
        if any(w in name for w in ["hair", "skin", "serum", "cream", "makeup", "beauty"]):
            new_cat = "beauty"
        elif any(w in name for w in ["home", "kitchen", "garden", "decor", "curtain", "towel"]):
            new_cat = "home-garden"
        elif any(w in name for w in ["shoes", "clothing", "fashion", "jewelry", "bag", "watch"]):
            new_cat = "fashion"
        elif any(w in name for w in ["toy", "game", "lego", "doll"]):
            new_cat = "toys"
        elif any(w in name for w in ["car", "auto", "dash", "tire"]):
            new_cat = "automotive"
        elif any(w in name for w in ["pet", "dog", "cat", "leash", "food"]):
            new_cat = "pet-supplies"
        elif any(w in name for w in ["sport", "outdoor", "fitness", "yoga", "gym"]):
            new_cat = "sports"
        
        # Update in DB
        try:
            db.client.table("products").update({"category": new_cat}).eq("id", p["id"]).execute()
            updates += 1
        except Exception as e:
            print(f"Error updating {p['id']}: {e}")

    print(f"✅ Updated {updates} products.")

if __name__ == "__main__":
    fix_categories()
