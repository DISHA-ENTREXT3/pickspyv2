import os
import sys

# This script will be uploaded to Modal and run there
def test_db_remote():
    sys.path.append("/root/backend")
    from supabase_utils import get_db
    db = get_db()
    
    print(f"Connecting to: {db.url}")
    if not db.is_connected():
        print("❌ DB Not connected")
        return
        
    test_product = {
        "id": "remote-test-1",
        "name": "Remote Modal Test Product",
        "source": "modal_test",
        "category": "general",
        "price": 99.99
    }
    
    print("Testing upsert...")
    res = db.upsert_products([test_product])
    print(f"Result: {res}")

if __name__ == "__main__":
    test_db_remote()
