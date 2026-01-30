"""
Supabase utilities for database operations.
Handles all Supabase interactions with proper error handling.
"""

import os
from typing import List, Dict, Any, Optional
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

try:
    from supabase import create_client, Client
except ImportError:
    Client = object
    def create_client(*args): return None


class SupabaseDB:
    """Supabase database operations manager"""
    
    def __init__(self):
        self.url = os.environ.get("SUPABASE_URL")
        self.key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        self.client: Optional[Client] = None
        
        if self.url and self.key:
            try:
                self.client = create_client(self.url, self.key)
            except Exception as e:
                print(f"Failed to initialize Supabase: {e}")
    
    def is_connected(self) -> bool:
        """Check if Supabase is properly connected"""
        return self.client is not None
    
    def upsert_products(self, products: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Upsert products into Supabase
        
        Args:
            products: List of product dictionaries
            
        Returns:
            Status dict with success/error info
        """
        if not self.is_connected() or not products:
            return {"success": False, "error": "Supabase not connected or no products provided"}
        
        try:
            # Prepare product data for insertion
            data = []
            for p in products:
                data.append({
                    "id": p.get("id"),
                    "name": p.get("name"),
                    "category": p.get("category"),
                    "price": p.get("price"),
                    "image_url": p.get("imageUrl"),
                    "velocity_score": p.get("velocityScore"),
                    "saturation_score": p.get("saturationScore"),
                    "demand_signal": p.get("demandSignal"),
                    "weekly_growth": p.get("weeklyGrowth"),
                    "reddit_mentions": p.get("redditMentions"),
                    "sentiment_score": p.get("sentimentScore"),
                    "top_reddit_themes": p.get("topRedditThemes"),
                    "last_updated": p.get("lastUpdated"),
                    "source": p.get("source"),
                    "rating": p.get("rating"),
                    "review_count": p.get("reviewCount"),
                    "ad_signal": p.get("adSignal"),
                    "social_signals": p.get("social_signals"),
                    "faqs": p.get("faqs"),
                    "competitors": p.get("competitors"),
                    "reddit_threads": p.get("redditThreads"),
                    "detailed_analysis": p.get("detailed_analysis"),
                    "created_at": datetime.now().isoformat()
                })
            
            # Batch insert in chunks of 50 (changed from upsert to allow history)
            total_saved = 0
            for i in range(0, len(data), 50):
                chunk = data[i:i+50]
                
                # Null checks (no deduplication here to keep history)
                clean_chunk = [item for item in chunk if item.get("id")]
                
                if not clean_chunk: continue

                print(f"📦 Inserting snapshot chunk of {len(clean_chunk)} items...")
                try:
                    # We use insert() now to allow multiple versions of same product id
                    response = self.client.table("products").insert(clean_chunk).execute()
                    total_saved += len(clean_chunk)
                except Exception as inner_e:
                    print(f"❌ Chunk Insert Failed: {inner_e}")
                    continue
            
            return {
                "success": total_saved > 0,
                "message": f"Successfully saved {total_saved} product snapshots",
                "count": total_saved
            }
            
        except Exception as e:
            error_msg = str(e)
            print(f"💥 Fatal Error in upsert_products: {error_msg}")
            return {
                "success": False,
                "error": error_msg,
                "count": 0
            }

    def delete_old_data(self, days: int = 7) -> Dict[str, Any]:
        """Delete product data older than N days"""
        if not self.is_connected():
            return {"success": False, "error": "Not connected"}
        
        try:
            # Current date minus days
            import datetime as dt
            threshold = (dt.datetime.now() - dt.timedelta(days=days)).isoformat()
            
            print(f"🗑️ Cleaning up products older than {threshold}...")
            response = self.client.table("products").delete().lt("created_at", threshold).execute()
            return {"success": True, "count": len(response.data) if response.data else 0}
        except Exception as e:
            print(f"❌ Cleanup failed: {e}")
            return {"success": False, "error": str(e)}

    def clear_category_products(self, category: str) -> bool:
        """Clear all products in a given category"""
        if not self.is_connected():
            return False
        try:
            self.client.table("products").delete().eq("category", category).execute()
            print(f"🗑️ Cleared products for category: {category}")
            return True
        except Exception as e:
            print(f"Error clearing products: {e}")
            return False
    
    def track_user_activity(self, user_id: str, activity_type: str, product_id: str = None, metadata: Dict = None) -> bool:
        """
        Track user activity for analytics
        
        Args:
            user_id: UUID of the user
            activity_type: Type of activity (view, analyze, compare, search)
            product_id: Optional product ID if activity is product-related
            metadata: Optional metadata dict
            
        Returns:
            True if successful, False otherwise
        """
        if not self.is_connected():
            return False
        
        try:
            activity_data = {
                "user_id": user_id,
                "activity_type": activity_type,
                "product_id": product_id,
                "metadata": metadata or {}
            }
            
            self.client.table("user_activity").insert(activity_data).execute()
            return True
            
        except Exception as e:
            print(f"Error tracking activity: {e}")
            return False
    
    def save_product(self, user_id: str, product_id: str) -> Dict[str, Any]:
        """
        Save a product to user's favorites
        
        Args:
            user_id: UUID of the user
            product_id: ID of product to save
            
        Returns:
            Status dict
        """
        if not self.is_connected():
            return {"success": False, "error": "Supabase not connected"}
        
        try:
            self.client.table("saved_products").insert({
                "user_id": user_id,
                "product_id": product_id
            }).execute()
            
            # Also track the activity
            self.track_user_activity(user_id, "save", product_id)
            
            return {"success": True, "message": "Product saved"}
            
        except Exception as e:
            error_msg = str(e)
            if "unique" in error_msg.lower():
                return {"success": False, "error": "Product already saved"}
            return {"success": False, "error": error_msg}
    
    def remove_saved_product(self, user_id: str, product_id: str) -> bool:
        """Remove a saved product"""
        if not self.is_connected():
            return False
        
        try:
            self.client.table("saved_products").delete().eq("user_id", user_id).eq("product_id", product_id).execute()
            return True
        except Exception as e:
            print(f"Error removing saved product: {e}")
            return False
    
    def create_comparison(self, user_id: str, product_ids: List[str], notes: str = None) -> Dict[str, Any]:
        """
        Create a product comparison
        
        Args:
            user_id: UUID of the user
            product_ids: List of product IDs to compare
            notes: Optional notes
            
        Returns:
            Status dict with comparison ID
        """
        if not self.is_connected():
            return {"success": False, "error": "Supabase not connected"}
        
        try:
            response = self.client.table("comparisons").insert({
                "user_id": user_id,
                "product_ids": product_ids,
                "notes": notes
            }).execute()
            
            # Track activity
            self.track_user_activity(user_id, "compare", metadata={"product_ids": product_ids})
            
            comparison_id = response.data[0]["id"] if response.data else None
            return {
                "success": True,
                "message": "Comparison created",
                "comparison_id": comparison_id
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_user_saved_products(self, user_id: str) -> List[str]:
        """Get list of products saved by user"""
        if not self.is_connected():
            return []
        
        try:
            response = self.client.table("saved_products").select("product_id").eq("user_id", user_id).execute()
            return [item["product_id"] for item in response.data] if response.data else []
        except Exception as e:
            print(f"Error fetching saved products: {e}")
            return []
    
    def get_user_comparisons(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user's comparisons"""
        if not self.is_connected():
            return []
        
        try:
            response = self.client.table("comparisons").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching comparisons: {e}")
            return []
    
    def get_product_analytics(self, days: int = 7) -> Dict[str, Any]:
        """Get product analytics for last N days"""
        if not self.is_connected():
            return {}
        
        try:
            # Get total products
            total_products = self.client.table("products").select("id", count="exact").execute()
            
            # Get recent activity
            response = self.client.table("user_activity").select("*").gte("created_at", f"now() - interval '{days} days'").execute()
            
            return {
                "total_products": total_products.count if hasattr(total_products, 'count') else 0,
                "activities_last_7_days": len(response.data) if response.data else 0,
                "success": True
            }
            
        except Exception as e:
            print(f"Error fetching analytics: {e}")
            return {"success": False, "error": str(e)}


# Singleton instance
_db_instance = None

def get_db() -> SupabaseDB:
    """Get or create Supabase database instance"""
    global _db_instance
    if _db_instance is None:
        _db_instance = SupabaseDB()
    return _db_instance
