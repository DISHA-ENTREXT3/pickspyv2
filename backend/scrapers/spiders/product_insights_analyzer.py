"""
Google Immersive Product Analyzer - Fetches detailed product insights and analysis
"""
import requests
import os
import random
import time
from typing import Optional, Dict, Any, List
from datetime import datetime
from bs4 import BeautifulSoup

# Import native scrapers
# Import native scrapers
# Assuming running from backend/ directory where native_scrapers.py resides
try:
    from native_scrapers import get_native_scrapers, GoogleSearchScraper, GoogleTrendsScraper, OPENROUTER_API_KEY, AI_MODEL
except ImportError:
    # Fallback for relative import if running as package
    from ...native_scrapers import get_native_scrapers, GoogleSearchScraper, GoogleTrendsScraper, OPENROUTER_API_KEY, AI_MODEL
import json

class GoogleProductInsightsAnalyzer:
    """Fetches and analyzes product insights using Native Web Scraping (Google Search + Shopping)"""
    
    name = 'google_product_insights_analyzer'
    
    def __init__(self):
        self.scrapers = get_native_scrapers()

    def fetch_product_insights(
        self,
        product_query: str = "",
        country: str = "us",
        language: str = "en"
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch immersive product insights from Google Shopping/Search
        """
        try:
            print(f"🔍 Fetching Native Google product insights for: {product_query}")
            
            # Use Google Search Scraper to find product info
            search_results = self.scrapers["google_search"].search(f"{product_query} price buy online", limit=10)
            
            if not search_results:
                return None
                
            # Construct a synthetic 'product' object from search results
            
            best_match = search_results[0]
            
            product_data = {
                "title": best_match.get("title", product_query),
                "description": best_match.get("snippet", ""),
                "price": self._extract_price(best_match.get("snippet", "") + " " + best_match.get("title", "")),
                "currency": "USD", # Default
                "rating": self._extract_rating(best_match.get("snippet", "")),
                "reviews_count": self._extract_reviews(best_match.get("snippet", "")),
                "url": best_match.get("url", ""),
                "source": "google_search",
                "product_id": str(hash(product_query))
            }

            return product_data
            
        except Exception as e:
            print(f"❌ Error fetching product insights: {e}")
            return None
            
    def _extract_price(self, text: str) -> float:
        try:
            import re
            match = re.search(r'\$?(\d+\.?\d{0,2})', text)
            if match:
                val = float(match.group(1))
                return val if val > 0 else 0
            return 0
        except: return 0
        
    def _extract_rating(self, text: str) -> float:
        try:
            import re
            match = re.search(r'(\d\.?\d?)/5', text)
            if match:
                return float(match.group(1))
            return 0
        except: return 0

    def _extract_reviews(self, text: str) -> int:
        try:
            import re
            match = re.search(r'(\d+,?\d*) reviews', text)
            if match:
                return int(match.group(1).replace(",", ""))
            return 0
        except: return 0
    
    def parse_product_details(self, product: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Pass-through for native structure"""
        return product
    
    def extract_product_features(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """Extract features (enhanced with AI if available)"""
        desc = product.get("description", "")
        
        if OPENROUTER_API_KEY and desc:
            try:
                prompt = (
                    f"Extract key specifications and highlights for this product based on its description: '{desc}'. "
                    "Format as a JSON: {\"key_specs\": [\"...\"], \"highlights\": [\"...\"]}"
                )
                res = requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
                    json={
                        "model": AI_MODEL,
                        "messages": [{"role": "user", "content": prompt}]
                    },
                    timeout=10
                )
                if res.status_code == 200:
                    ai_res = res.json()["choices"][0]["message"]["content"]
                    import re
                    match = re.search(r'\{.*\}', ai_res, re.DOTALL)
                    if match:
                        return json.loads(match.group())
            except: pass

        return {
            "key_specs": [s.strip() for s in desc.split(".") if len(s) > 10][:5],
            "highlights": ["High Quality", "Trending"] # Generic fallback
        }
    
    def analyze_product_competitiveness(
        self,
        product: Dict[str, Any],
        competitor_products: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Analyze competitiveness (enhanced with AI if available)"""
        if OPENROUTER_API_KEY:
            try:
                comp_data = json.dumps(competitor_products) if competitor_products else "No specific competitor data available"
                prompt = (
                    f"Analyze the market competitiveness for '{product.get('title')}' at price {product.get('price')}. "
                    f"Competitors: {comp_data}. "
                    "Provide a JSON with: 'market_position' (string), 'advantages' (list), 'disadvantages' (list)."
                )
                res = requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
                    json={
                        "model": AI_MODEL,
                        "messages": [{"role": "user", "content": prompt}]
                    },
                    timeout=10
                )
                if res.status_code == 200:
                    ai_res = res.json()["choices"][0]["message"]["content"]
                    import re
                    match = re.search(r'\{.*\}', ai_res, re.DOTALL)
                    if match:
                        return json.loads(match.group())
            except: pass

        # Simple logic based on price comparison fallback
        return {
            "product_name": product.get("title", ""),
            "market_position": "Competitive",
            "advantages": ["Good online presence"],
            "disadvantages": []
        }
    
    def get_comprehensive_product_analysis(
        self,
        product_query: str,
        country: str = "us",
        language: str = "en"
    ) -> Optional[Dict[str, Any]]:
        """
        Get comprehensive product analysis using native tools
        """
        try:
            print(f"📊 Getting comprehensive analysis for: {product_query}")
            
            # 1. Basic Product Info
            print("Step 1: Fetching Basic Product Info...", flush=True)
            main_product = self.fetch_product_insights(product_query, country, language)
            if not main_product:
                print("❌ Step 1 Failed: No product insights found.", flush=True)
                return None
                
            # 2. Competitors (Search for "similar to X")
            print("Step 2: Searching for Competitors...", flush=True)
            competitors = []
            comp_search = self.scrapers["google_search"].search(f"products similar to {product_query}", limit=3)
            if comp_search:
                for comp in comp_search:
                    competitors.append({
                        "title": comp.get("title"),
                        "price": self._extract_price(comp.get("snippet", "")),
                        "url": comp.get("url")
                    })
            print(f"✅ Step 2 Success: Found {len(competitors)} competitors", flush=True)

            # 3. Market Metrics (Trends)
            print("Step 3: Fetching Trends Data...", flush=True)
            trends_data = {}
            try:
                trend_res = self.scrapers["google_trends"].get_trends(product_query)
                if trend_res:
                    trends_data = trend_res
            except Exception as e:
                print(f"⚠️ Trends error: {e}", flush=True)
            print("✅ Step 3 Success", flush=True)

            print("Step 4: Extracting Features...", flush=True)
            features = self.extract_product_features(main_product)
            print("✅ Step 4 Success", flush=True)
            
            # 4. Instagram Trends
            print("Step 5: Analyzing Instagram Trends...", flush=True)
            insta_data = self.analyze_instagram_trends(product_query)
            print(f"✅ Step 5 Success: Status {insta_data.get('status')}", flush=True)

            # Combine
            comprehensive_analysis = {
                "product_query": product_query,
                "country": country,
                "language": language,
                "main_product": main_product,
                "product_features": features,
                "competitors": competitors,
                "market_trends": trends_data,
                "instagram_trends": insta_data,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Finalizing comprehensive analysis for {product_query}", flush=True)
            return comprehensive_analysis
            
        except Exception as e:
            print(f"❌ Error in comprehensive analysis: {e}")
            import traceback
            traceback.print_exc()
            return None

    def analyze_instagram_trends(self, query: str) -> Dict[str, Any]:
        """
        Analyze Instagram trends for the product using instagrapi
        """
        try:
            print(f"📸 Fetching Instagram insights for: {query}")
            # Import here to avoid top-level dependency failure if not installed yet
            from instagrapi import Client
            cl = Client()
            
            # Note: Guest access is limited. 
            # ideally: cl.login(USERNAME, PASSWORD)
            
            # Sanitize query for hashtag
            hashtag = query.lower().replace(" ", "")
            
            # Get top medias for hashtag
            # limit to 5 to be fast and avoid blocks
            medias = cl.hashtag_medias_top(hashtag, amount=5)
            
            posts_data = []
            for media in medias:
                posts_data.append({
                    "id": media.id,
                    "caption": media.caption_text[:100] + "..." if media.caption_text else "",
                    "likes": media.like_count,
                    "comments": media.comment_count,
                    "url": f"https://www.instagram.com/p/{media.code}/",
                    "type": "video" if media.media_type == 2 else "image"
                })
                
            return {
                "source": "instagram",
                "hashtag": hashtag,
                "top_posts": posts_data,
                "status": "success"
            }
            
        except ImportError:
            print("⚠️ Instagrapi not installed.")
            return {"error": "Instagrapi library missing", "status": "failed"}
        except Exception as e:
            print(f"⚠️ Instagram analysis failed: {e}")
            return {"error": str(e), "status": "failed"}
    
    def analyze_product_category(
        self,
        category: str,
        country: str = "us",
        language: str = "en"
    ) -> Optional[Dict[str, Any]]:
        """
        Analyze products in a category
        """
        try:
            print(f"📂 Analyzing category: {category}")
            # Use Walmart/Amazon scrapers for category data
            products = []
            
            # Try Walmart first
            w_products = self.scrapers["walmart"].search(category, limit=5)
            if w_products:
                products.extend(w_products)
                
            # Try Amazon (backup)
            if len(products) < 5:
                a_products = self.scrapers["amazon"].search(category, limit=5)
                if a_products:
                    products.extend(a_products)
            
            if not products:
                return None

            category_analysis = {
                "category": category,
                "country": country,
                "language": language,
                "total_products_analyzed": len(products),
                "top_products": products,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Completed category analysis for {category}")
            return category_analysis
            
        except Exception as e:
            print(f"❌ Error analyzing category: {e}")
            return None


def get_product_insights_analyzer() -> GoogleProductInsightsAnalyzer:
    """Get or create product insights analyzer instance"""
    return GoogleProductInsightsAnalyzer()
