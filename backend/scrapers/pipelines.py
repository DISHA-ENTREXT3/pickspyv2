from itemadapter import ItemAdapter
import sys
import os

# Add parent directory to path to allow importing backend modules if running from scrapy
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

try:
    # If running from backend directory
    from supabase_utils import get_db
except ImportError:
    # If running from parent directory or installed as package
    try:
        from backend.supabase_utils import get_db
    except ImportError:
        # Fallback if needed
        import supabase_utils
        get_db = supabase_utils.get_db

class SupabasePipeline:
    def __init__(self):
        self.db = get_db()
        self.items_buffer = []

    def process_item(self, item, spider):
        # Buffer items to batch insert if needed, 
        # but supabase_utils.upsert_products already handles batching logic if passed a list.
        # However, Scrapy pipelines process one item at a time.
        
        # We can either insert one by one or buffer.
        # Given supabase_utils.upsert_products takes a list, let's buffer a bit or just wrap locally.
        # But wait, supabase_utils.upsert_products chunks internally by 50. 
        # So we should probably accumulate items and flush on close, 
        # OR just call upsert for single items.
        
        # Upserting one by one is slow. Let's buffer.
        self.items_buffer.append(item)
        
        if len(self.items_buffer) >= 50:
            self._flush()
            
        return item

    def close_spider(self, spider):
        if self.items_buffer:
            self._flush()

    def _flush(self):
        if not self.items_buffer:
            return
            
        print(f"🚀 Pipeline: Attempting to save {len(self.items_buffer)} items to Supabase...")
        try:
            result = self.db.upsert_products(self.items_buffer)
            if result.get('success'):
                print(f"✅ Pipeline: Saved {result.get('count', 0)} items.")
            else:
                print(f"❌ Pipeline: Failed to save items. Error: {result.get('error')}")
            self.items_buffer = []
        except Exception as e:
            print(f"💥 Pipeline Error: {e}")
