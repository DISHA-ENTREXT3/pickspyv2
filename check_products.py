import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from supabase_utils import get_db

load_dotenv()

def check_products():
    db = get_db()
    if not db.is_connected():
        print("❌ Supabase not connected")
        return

    try:
        response = db.client.table("products").select("id, name, source", count="exact").limit(10).execute()
        count = response.count if hasattr(response, 'count') else len(response.data)
        print(f"✅ Total products (limited to 10 in display): {count}")
        for p in response.data:
            print(f"- [{p.get('source')}] {p.get('id')}: {p.get('name')}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_products()
