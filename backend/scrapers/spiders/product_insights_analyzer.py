"""
Google Immersive Product Analyzer - Fetches detailed product insights and analysis
"""
import requests
import os
from typing import Optional, Dict, Any, List
from datetime import datetime


class GoogleProductInsightsAnalyzer:
    """Fetches and analyzes product insights using ScrapingDog Google Immersive Product API"""
    
    name = 'google_product_insights_analyzer'
    
    def __init__(self):
        self.api_key = os.environ.get("SCRAPINGDOG_API_KEY", "6971f563189cdc880fccb6cc")
        self.base_url = "https://api.scrapingdog.com/google_immersive_product"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def fetch_product_insights(
        self,
        product_query: str = "",
        country: str = "us",
        language: str = "en"
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch immersive product insights from Google
        
        Args:
            product_query: Product name or query
            country: Country code (us, in, uk, etc.)
            language: Language code (en, hi, etc.)
            
        Returns:
            Dict with product insights or None if failed
        """
        try:
            params = {
                "api_key": self.api_key,
                "country": country,
                "language": language
            }
            
            if product_query:
                params["q"] = product_query
            
            print(f"🔍 Fetching Google Immersive product insights for: {product_query or 'trending'}")
            response = self.session.get(self.base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Retrieved product insights")
                return data
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                print(f"Response: {response.text[:200]}")
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout while fetching product insights")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error fetching product insights: {e}")
            return None
    
    def parse_product_details(self, product: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Parse raw product data into structured format
        
        Args:
            product: Raw product data from API
            
        Returns:
            Parsed product details
        """
        try:
            if not product or not isinstance(product, dict):
                print("⚠️  Invalid product data provided")
                return None
            
            parsed = {
                "title": (product.get("title") or product.get("name") or "") if product else "",
                "description": (product.get("description") or "") if product else "",
                "price": float(product.get("price") or product.get("min_price") or 0) if product else 0,
                "price_currency": (product.get("currency") or "USD") if product else "USD",
                "rating": float(product.get("rating") or product.get("avg_rating") or 0) if product else 0,
                "reviews_count": int(product.get("review_count") or product.get("num_reviews") or 0) if product else 0,
                "url": (product.get("url") or product.get("link") or "") if product else "",
                "image": (product.get("image") or product.get("thumbnail") or "") if product else "",
                "seller": (product.get("seller") or product.get("brand") or "") if product else "",
                "availability": (product.get("availability") or "unknown") if product else "unknown",
                "category": (product.get("category") or "") if product else "",
                "product_id": (product.get("product_id") or product.get("id") or "") if product else ""
            }
            return parsed
        except Exception as e:
            print(f"⚠️  Error parsing product: {e}")
            return None
    
    def extract_product_features(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract key features and specifications from product data
        
        Args:
            product: Product data
            
        Returns:
            Dict with key features
        """
        try:
            features = {
                "key_specs": product.get("specs") or product.get("specifications") or [],
                "highlights": product.get("highlights") or [],
                "attributes": product.get("attributes") or {},
                "variants": product.get("variants") or [],
                "related_products": product.get("related") or []
            }
            return features
        except Exception as e:
            print(f"⚠️  Error extracting features: {e}")
            return {}
    
    def analyze_product_competitiveness(
        self,
        product: Dict[str, Any],
        competitor_products: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Analyze product competitiveness against competitors
        
        Args:
            product: Product data to analyze
            competitor_products: List of competitor products
            
        Returns:
            Competitiveness analysis
        """
        try:
            analysis = {
                "product_name": product.get("title") or product.get("name") or "",
                "price_competitiveness": "competitive",
                "rating_competitiveness": "strong",
                "market_position": "mid-range",
                "advantages": [],
                "disadvantages": []
            }
            
            product_price = float(product.get("price") or 0)
            product_rating = float(product.get("rating") or 0)
            
            if competitor_products:
                avg_competitor_price = sum([float(p.get("price") or 0) for p in competitor_products]) / len(competitor_products)
                avg_competitor_rating = sum([float(p.get("rating") or 0) for p in competitor_products]) / len(competitor_products)
                
                # Price analysis
                if product_price < avg_competitor_price * 0.9:
                    analysis["price_competitiveness"] = "competitive (cheaper)"
                    analysis["advantages"].append("Lower price than competitors")
                elif product_price > avg_competitor_price * 1.1:
                    analysis["price_competitiveness"] = "premium priced"
                    analysis["disadvantages"].append("Higher price than competitors")
                
                # Rating analysis
                if product_rating > avg_competitor_rating:
                    analysis["rating_competitiveness"] = "strong (better rated)"
                    analysis["advantages"].append("Better reviews than competitors")
                elif product_rating < avg_competitor_rating:
                    analysis["rating_competitiveness"] = "weak (lower rated)"
                    analysis["disadvantages"].append("Lower reviews than competitors")
                
                # Market position
                if product_price < avg_competitor_price and product_rating >= avg_competitor_rating:
                    analysis["market_position"] = "value leader"
                elif product_price > avg_competitor_price and product_rating > avg_competitor_rating:
                    analysis["market_position"] = "premium leader"
                elif product_price < avg_competitor_price * 0.7:
                    analysis["market_position"] = "budget option"
            
            return analysis
        except Exception as e:
            print(f"⚠️  Error analyzing competitiveness: {e}")
            return {}
    
    def get_comprehensive_product_analysis(
        self,
        product_query: str,
        country: str = "us",
        language: str = "en"
    ) -> Optional[Dict[str, Any]]:
        """
        Get comprehensive product analysis from Google Immersive Products
        
        Args:
            product_query: Product to search for
            country: Country code
            language: Language code
            
        Returns:
            Comprehensive product analysis
        """
        try:
            print(f"📊 Getting comprehensive analysis for: {product_query}")
            
            # Fetch product insights
            insights = self.fetch_product_insights(product_query, country, language)
            
            if not insights:
                print(f"⚠️  No product data found for {product_query}")
                return None
            
            # Parse main product
            products_list = insights if isinstance(insights, list) else insights.get('products', [])
            
            if not products_list:
                return None
            
            main_product = self.parse_product_details(products_list[0])
            if not main_product:
                return None
            
            # Extract features
            features = self.extract_product_features(products_list[0])
            
            # Analyze competitiveness
            competitors = []
            competitiveness = {"product_name": main_product.get("title")}
            
            if len(products_list) > 1:
                competitors = [self.parse_product_details(p) for p in products_list[1:4]]
                competitors = [c for c in competitors if c]
                competitiveness = self.analyze_product_competitiveness(products_list[0], products_list[1:4])
            
            # Calculate market metrics
            avg_rating = main_product.get("rating", 0)
            reviews_count = main_product.get("reviews_count", 0)
            
            quality_score = (avg_rating / 5 * 100) if avg_rating > 0 else 0
            popularity_score = min((reviews_count / 1000 * 100), 100) if reviews_count > 0 else 0
            
            comprehensive_analysis = {
                "product_query": product_query,
                "country": country,
                "language": language,
                "main_product": main_product,
                "product_features": features,
                "competitors": competitors,
                "competitiveness_analysis": competitiveness,
                "market_metrics": {
                    "quality_score": round(quality_score, 2),
                    "popularity_score": round(popularity_score, 2),
                    "avg_rating": avg_rating,
                    "total_reviews": reviews_count
                },
                "insights_summary": {
                    "availability": main_product.get("availability"),
                    "category": main_product.get("category"),
                    "seller": main_product.get("seller"),
                    "price": main_product.get("price"),
                    "currency": main_product.get("price_currency")
                },
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Completed comprehensive analysis for {product_query}")
            return comprehensive_analysis
            
        except Exception as e:
            print(f"❌ Error in comprehensive analysis: {e}")
            return None
    
    def analyze_product_category(
        self,
        category: str,
        country: str = "us",
        language: str = "en"
    ) -> Optional[Dict[str, Any]]:
        """
        Analyze products in a category
        
        Args:
            category: Product category
            country: Country code
            language: Language code
            
        Returns:
            Category analysis with top products
        """
        try:
            print(f"📂 Analyzing category: {category}")
            
            # Fetch category products
            insights = self.fetch_product_insights(category, country, language)
            
            if not insights:
                print(f"⚠️  No products found in category {category}")
                return None
            
            products_list = insights if isinstance(insights, list) else insights.get('products', [])
            
            if not products_list:
                return None
            
            # Parse all products
            parsed_products = []
            price_range = {"min": float('inf'), "max": 0}
            rating_range = {"min": 5, "max": 0}
            
            for product in products_list[:10]:  # Top 10 products
                parsed = self.parse_product_details(product)
                if parsed:
                    parsed_products.append(parsed)
                    
                    # Update ranges
                    price = float(parsed.get("price", 0))
                    rating = float(parsed.get("rating", 0))
                    
                    if price > 0:
                        price_range["min"] = min(price_range["min"], price)
                        price_range["max"] = max(price_range["max"], price)
                    
                    if rating > 0:
                        rating_range["min"] = min(rating_range["min"], rating)
                        rating_range["max"] = max(rating_range["max"], rating)
            
            # Calculate category metrics
            avg_price = sum([float(p.get("price", 0)) for p in parsed_products if p.get("price")]) / len(parsed_products) if parsed_products else 0
            avg_rating = sum([float(p.get("rating", 0)) for p in parsed_products if p.get("rating")]) / len(parsed_products) if parsed_products else 0
            
            category_analysis = {
                "category": category,
                "country": country,
                "language": language,
                "total_products_analyzed": len(parsed_products),
                "top_products": parsed_products[:5],
                "all_products": parsed_products,
                "market_metrics": {
                    "average_price": round(avg_price, 2),
                    "average_rating": round(avg_rating, 2),
                    "price_range": {
                        "min": round(price_range["min"], 2),
                        "max": round(price_range["max"], 2)
                    },
                    "rating_range": {
                        "min": rating_range["min"],
                        "max": rating_range["max"]
                    }
                },
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
