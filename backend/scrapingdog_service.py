"""
ScrapingDog integration service for web scraping.
Handles all requests to the ScrapingDog API.
"""

import os
import requests
from typing import Optional, Dict, Any, List
from urllib.parse import urlencode
from datetime import datetime
import json


class ScrapingDogService:
    """Service for ScrapingDog API integration"""
    
    BASE_URL = "https://api.scrapingdog.com/scrape"
    
    def __init__(self):
        self.api_key = os.environ.get("SCRAPINGDOG_API_KEY")
        if not self.api_key:
            print("⚠️  Warning: SCRAPINGDOG_API_KEY not set. Scraping will use fallback.")
    
    def is_configured(self) -> bool:
        """Check if ScrapingDog API key is configured"""
        return self.api_key is not None
    
    def scrape(
        self,
        url: str,
        render: bool = True,
        timeout: int = 30,
        proxy: str = "None",
        headers: Optional[Dict[str, str]] = None,
    ) -> Optional[str]:
        """
        Scrape a URL using ScrapingDog API
        
        Args:
            url: URL to scrape
            render: Whether to render JavaScript (True for dynamic sites)
            timeout: Request timeout in seconds
            proxy: Proxy type ('None', 'Residential', 'ISP')
            headers: Optional custom headers
            
        Returns:
            HTML content or None if failed
        """
        if not self.is_configured():
            print(f"ScrapingDog not configured. Would scrape: {url}")
            return None
        
        try:
            params = {
                "api_key": self.api_key,
                "url": url,
                "render": "true" if render else "false",
                "timeout": timeout,
                "proxy": proxy,
            }
            
            # Add custom headers if provided
            if headers:
                params["headers"] = json.dumps(headers)
            
            response = requests.get(
                self.BASE_URL,
                params=params,
                timeout=timeout + 10  # Add buffer for API processing
            )
            
            if response.status_code == 200:
                return response.text
            else:
                error_msg = f"ScrapingDog API Error {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg += f": {error_data.get('error', 'Unknown error')}"
                except:
                    error_msg += f": {response.text}"
                
                print(f"⚠️  {error_msg}")
                return None
                
        except requests.Timeout:
            print(f"⚠️  ScrapingDog timeout for {url}")
            return None
        except requests.RequestException as e:
            print(f"⚠️  ScrapingDog request error: {e}")
            return None
        except Exception as e:
            print(f"⚠️  ScrapingDog error: {e}")
            return None
    
    def scrape_with_javascript(self, url: str) -> Optional[str]:
        """Scrape URL with JavaScript rendering enabled"""
        return self.scrape(url, render=True)
    
    def scrape_simple(self, url: str) -> Optional[str]:
        """Scrape URL without JavaScript rendering (faster)"""
        return self.scrape(url, render=False)
    
    def scrape_residential(self, url: str) -> Optional[str]:
        """Scrape URL using residential proxy"""
        return self.scrape(url, proxy="Residential", render=True)
    
    def search_walmart(
        self,
        query: str,
        page: int = 1,
        sort: str = "best_match",
        limit: int = 50
    ) -> Optional[Dict[str, Any]]:
        """
        Search for products on Walmart using ScrapingDog Walmart API
        
        Args:
            query: Search query string
            page: Page number for pagination
            sort: Sort option (best_match, price_low, price_high, rating)
            limit: Number of results to return
            
        Returns:
            Dict with product data or None if failed
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            walmart_url = "https://api.scrapingdog.com/walmart/search"
            params = {
                "api_key": self.api_key,
                "query": query,
                "page": page,
                "sort": sort,
                "limit": limit
            }
            
            print(f"🔄 Searching Walmart for: {query}")
            response = requests.get(walmart_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                product_count = len(data.get('products', []))
                print(f"✅ Retrieved {product_count} products from Walmart")
                return data
            else:
                error_msg = f"❌ Walmart search failed with status code: {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg += f" - {error_data.get('error', 'Unknown error')}"
                except:
                    error_msg += f" - {response.text[:100]}"
                print(error_msg)
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout while searching Walmart for: {query}")
            return None
        except requests.RequestException as e:
            print(f"❌ Walmart search request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Walmart search error: {e}")
            return None
    
    def get_walmart_product(self, product_url: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed product information from Walmart product page
        
        Args:
            product_url: URL of the Walmart product page or product ID
            
        Returns:
            Dict with product details or None if failed
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            walmart_product_url = "https://api.scrapingdog.com/walmart/product"
            params = {
                "api_key": self.api_key,
                "product_url": product_url
            }
            
            print(f"📦 Fetching Walmart product details: {product_url}")
            response = requests.get(walmart_product_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Successfully retrieved product details")
                return data
            else:
                error_msg = f"❌ Failed to get product details. Status: {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg += f" - {error_data.get('error', 'Unknown error')}"
                except:
                    error_msg += f" - {response.text[:100]}"
                print(error_msg)
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout fetching product details")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error fetching product details: {e}")
            return None
    
    def search_ebay(
        self,
        query: str,
        page: int = 1,
        sort: str = "best_match",
        limit: int = 50,
        condition: str = "all"
    ) -> Optional[Dict[str, Any]]:
        """
        Search for products on eBay using ScrapingDog eBay API
        
        Args:
            query: Search query string
            page: Page number for pagination
            sort: Sort option (best_match, price_low, price_high, newest, ending_soon)
            limit: Number of results to return
            condition: Item condition (all, new, used, refurbished)
            
        Returns:
            Dict with product data or None if failed
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            ebay_url = "https://api.scrapingdog.com/ebay/search"
            params = {
                "api_key": self.api_key,
                "query": query,
                "page": page,
                "sort": sort,
                "limit": limit,
                "condition": condition
            }
            
            print(f"🔄 Searching eBay for: {query}")
            response = requests.get(ebay_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                product_count = len(data.get('products', []))
                print(f"✅ Retrieved {product_count} products from eBay")
                return data
            else:
                error_msg = f"❌ eBay search failed with status code: {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg += f" - {error_data.get('error', 'Unknown error')}"
                except:
                    error_msg += f" - {response.text[:100]}"
                print(error_msg)
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout while searching eBay for: {query}")
            return None
        except requests.RequestException as e:
            print(f"❌ eBay search request error: {e}")
            return None
        except Exception as e:
            print(f"❌ eBay search error: {e}")
            return None
    
    def get_ebay_product(self, product_url: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed product information from eBay product page
        
        Args:
            product_url: URL of the eBay product page or item ID
            
        Returns:
            Dict with product details or None if failed
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            ebay_product_url = "https://api.scrapingdog.com/ebay/product"
            params = {
                "api_key": self.api_key,
                "product_url": product_url
            }
            
            print(f"📦 Fetching eBay product details: {product_url}")
            response = requests.get(ebay_product_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Successfully retrieved product details")
                return data
            else:
                error_msg = f"❌ Failed to get product details. Status: {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg += f" - {error_data.get('error', 'Unknown error')}"
                except:
                    error_msg += f" - {response.text[:100]}"
                print(error_msg)
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout fetching product details")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error fetching product details: {e}")
            return None
    
    def search_flipkart(
        self,
        query: str,
        page: int = 1,
        sort: str = "relevance",
        limit: int = 50
    ) -> Optional[Dict[str, Any]]:
        """
        Search for products on Flipkart using ScrapingDog Flipkart API
        
        Args:
            query: Search query string
            page: Page number for pagination
            sort: Sort option (relevance, price_low, price_high, newest, rating)
            limit: Number of results to return
            
        Returns:
            Dict with product data or None if failed
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            flipkart_url = "https://api.scrapingdog.com/flipkart/search"
            params = {
                "api_key": self.api_key,
                "query": query,
                "page": page,
                "sort": sort,
                "limit": limit
            }
            
            print(f"🔄 Searching Flipkart for: {query}")
            response = requests.get(flipkart_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                product_count = len(data.get('products', []))
                print(f"✅ Retrieved {product_count} products from Flipkart")
                return data
            else:
                error_msg = f"❌ Flipkart search failed with status code: {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg += f" - {error_data.get('error', 'Unknown error')}"
                except:
                    error_msg += f" - {response.text[:100]}"
                print(error_msg)
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout while searching Flipkart for: {query}")
            return None
        except requests.RequestException as e:
            print(f"❌ Flipkart search request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Flipkart search error: {e}")
            return None
    
    def get_flipkart_product(self, product_url: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed product information from Flipkart product page
        
        Args:
            product_url: URL of the Flipkart product page or product ID
            
        Returns:
            Dict with product details or None if failed
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            flipkart_product_url = "https://api.scrapingdog.com/flipkart/product"
            params = {
                "api_key": self.api_key,
                "product_url": product_url
            }
            
            print(f"📦 Fetching Flipkart product details: {product_url}")
            response = requests.get(flipkart_product_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Successfully retrieved product details")
                return data
            else:
                error_msg = f"❌ Failed to get product details. Status: {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg += f" - {error_data.get('error', 'Unknown error')}"
                except:
                    error_msg += f" - {response.text[:100]}"
                print(error_msg)
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout fetching product details")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error fetching product details: {e}")
            return None
    
    def fetch_instagram_posts(self, instagram_id: str = "") -> Optional[Dict[str, Any]]:
        """
        Fetch Instagram posts for product analysis
        
        Args:
            instagram_id: Instagram user ID or hashtag ID
            
        Returns:
            Dict with post data or None if failed
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            instagram_url = "https://api.scrapingdog.com/instagram/posts"
            params = {
                "api_key": self.api_key,
                "id": instagram_id
            }
            
            print(f"📱 Fetching Instagram posts for ID: {instagram_id}")
            response = requests.get(instagram_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                posts_count = len(data) if isinstance(data, list) else len(data.get('posts', []))
                print(f"✅ Retrieved {posts_count} Instagram posts")
                return data
            else:
                error_msg = f"❌ Failed to fetch Instagram posts. Status: {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg += f" - {error_data.get('error', 'Unknown error')}"
                except:
                    error_msg += f" - {response.text[:100]}"
                print(error_msg)
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout fetching Instagram posts")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error fetching Instagram posts: {e}")
            return None
    
    def get_product_instagram_analysis(self, product_name: str, hashtag: str = "") -> Optional[Dict[str, Any]]:
        """
        Get comprehensive social analysis for a product from Instagram
        Includes sentiment analysis, engagement metrics, and comments
        
        Args:
            product_name: Name of the product
            hashtag: Optional specific hashtag to search
            
        Returns:
            Dict with social analysis data or None
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            search_hashtag = hashtag if hashtag else product_name.replace(" ", "")
            
            print(f"🔍 Analyzing Instagram data for product: {product_name}")
            posts_data = self.fetch_instagram_posts(instagram_id=search_hashtag)
            
            if not posts_data:
                print(f"⚠️  No Instagram posts found for {product_name}")
                return None
            
            posts = posts_data if isinstance(posts_data, list) else posts_data.get('posts', [])
            
            if not posts:
                return None
            
            # Sentiment keywords
            positive_keywords = ['love', 'amazing', 'best', 'awesome', 'excellent', 'great', 'perfect', 'recommend', 'worth', 'quality']
            negative_keywords = ['hate', 'bad', 'worst', 'terrible', 'poor', 'waste', 'regret', 'avoid', 'broken', 'cheap']
            mention_keywords = ['price', 'cost', 'delivery', 'quality', 'service', 'value', 'money', 'worth']
            
            parsed_posts = []
            total_likes = 0
            total_comments = 0
            sentiments = {"positive": 0, "negative": 0, "neutral": 0}
            all_topics = []
            
            for post in posts[:50]:  # Analyze top 50 posts
                try:
                    caption = post.get("caption") or post.get("text") or ""
                    
                    # Parse post data
                    parsed_post = {
                        "post_id": post.get("id") or post.get("pk"),
                        "caption": caption,
                        "likes": post.get("likes_count") or post.get("like_count") or 0,
                        "comments_count": post.get("comments_count") or post.get("comment_count") or 0,
                        "author": post.get("username") or post.get("author") or "",
                        "posted_at": post.get("timestamp") or post.get("taken_at") or datetime.now().isoformat(),
                        "image_url": post.get("image_url") or post.get("display_url") or ""
                    }
                    
                    # Sentiment analysis
                    caption_lower = caption.lower()
                    positive_count = sum(1 for keyword in positive_keywords if keyword in caption_lower)
                    negative_count = sum(1 for keyword in negative_keywords if keyword in caption_lower)
                    topics = [keyword for keyword in mention_keywords if keyword in caption_lower]
                    
                    sentiment_score = positive_count - negative_count
                    if sentiment_score > 0:
                        sentiment = "positive"
                    elif sentiment_score < 0:
                        sentiment = "negative"
                    else:
                        sentiment = "neutral"
                    
                    parsed_post["sentiment"] = sentiment
                    parsed_post["sentiment_score"] = sentiment_score
                    parsed_post["topics"] = topics
                    
                    parsed_posts.append(parsed_post)
                    total_likes += parsed_post["likes"]
                    total_comments += parsed_post["comments_count"]
                    sentiments[sentiment] += 1
                    all_topics.extend(topics)
                    
                except Exception as e:
                    print(f"⚠️  Error parsing post: {e}")
                    continue
            
            avg_engagement = (total_likes + total_comments) / len(parsed_posts) if parsed_posts else 0
            
            analysis_result = {
                "product_name": product_name,
                "hashtag_searched": search_hashtag,
                "total_posts_analyzed": len(parsed_posts),
                "total_likes": total_likes,
                "total_comments": total_comments,
                "average_engagement": round(avg_engagement, 2),
                "sentiment_breakdown": sentiments,
                "sentiment_percentage": {
                    "positive": round((sentiments["positive"] / len(parsed_posts) * 100), 2) if parsed_posts else 0,
                    "negative": round((sentiments["negative"] / len(parsed_posts) * 100), 2) if parsed_posts else 0,
                    "neutral": round((sentiments["neutral"] / len(parsed_posts) * 100), 2) if parsed_posts else 0
                },
                "common_topics": list(set(all_topics)),
                "top_posts": parsed_posts[:5],
                "all_posts": parsed_posts,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Completed Instagram analysis for {product_name}")
            return analysis_result
            
        except Exception as e:
            print(f"❌ Error analyzing Instagram data: {e}")
            return None
    
    def get_product_market_trends(
        self,
        product_name: str,
        time_range: str = "now_30_d",
        geo: str = "US"
    ) -> Optional[Dict[str, Any]]:
        """
        Get market trends for a product using Google Trends
        
        Args:
            product_name: Name of the product
            time_range: Time range for trend analysis
            geo: Geographic location
            
        Returns:
            Dict with market trend analysis
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            print(f"📈 Fetching market trends for: {product_name}")
            
            params = {
                "api_key": self.api_key,
                "keyword": product_name,
                "data_type": "TIMESERIES",
                "time_range": time_range,
                "geo": geo
            }
            
            response = requests.get("https://api.scrapingdog.com/google_trends", params=params, timeout=30)
            
            if response.status_code != 200:
                print(f"❌ Failed to get trends. Status: {response.status_code}")
                return None
            
            timeseries_data = response.json()
            
            # Get related queries
            params["data_type"] = "RELATED_QUERIES"
            response = requests.get("https://api.scrapingdog.com/google_trends", params=params, timeout=30)
            
            related_queries = response.json() if response.status_code == 200 else {}
            
            # Parse timeseries
            timeseries_points = []
            ts_data = timeseries_data if isinstance(timeseries_data, list) else timeseries_data.get('data', [])
            for point in ts_data:
                try:
                    timeseries_points.append({
                        "timestamp": point.get("date") or point.get("time"),
                        "value": point.get("value") or 0
                    })
                except:
                    continue
            
            # Parse related queries
            top_queries = []
            rising_queries = []
            if related_queries:
                rel_data = related_queries if isinstance(related_queries, dict) else related_queries.get('data', {})
                top_queries = rel_data.get('top', []) if isinstance(rel_data.get('top'), list) else []
                rising_queries = rel_data.get('rising', []) if isinstance(rel_data.get('rising'), list) else []
            
            # Calculate trend velocity
            trend_velocity = 0
            trend_direction = "stable"
            if len(timeseries_points) >= 2:
                recent = sum([p.get("value", 0) for p in timeseries_points[-5:]])
                older = sum([p.get("value", 0) for p in timeseries_points[:5]])
                if older > 0:
                    trend_velocity = ((recent - older) / older) * 100
                
                if trend_velocity > 10:
                    trend_direction = "rising"
                elif trend_velocity < -10:
                    trend_direction = "falling"
            
            result = {
                "product_name": product_name,
                "time_range": time_range,
                "geo": geo,
                "trend_direction": trend_direction,
                "trend_velocity_percent": round(trend_velocity, 2),
                "timeseries_data": timeseries_points,
                "top_related_queries": top_queries[:10],
                "rising_related_queries": rising_queries[:10],
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Retrieved market trends for {product_name}")
            return result
            
        except requests.Timeout:
            print(f"⏱️  Timeout fetching trends")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error fetching market trends: {e}")
            return None
    
    def compare_product_market_trends(
        self,
        products: List[str],
        time_range: str = "now_30_d",
        geo: str = "US"
    ) -> Optional[Dict[str, Any]]:
        """
        Compare market trends across multiple products
        
        Args:
            products: List of product names to compare
            time_range: Time range for analysis
            geo: Geographic location
            
        Returns:
            Dict with comparative trend analysis
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            print(f"📊 Comparing market trends for {len(products)} products")
            
            comparison = {}
            for product in products:
                trend_data = self.get_product_market_trends(product, time_range, geo)
                if trend_data:
                    comparison[product] = {
                        "trend_direction": trend_data.get("trend_direction"),
                        "trend_velocity": trend_data.get("trend_velocity_percent"),
                        "top_queries": trend_data.get("top_related_queries")[:5]
                    }
            
            if not comparison:
                return None
            
            # Find most trending product
            most_trending = max(comparison.items(), key=lambda x: x[1].get("trend_velocity", 0))[0]
            
            result = {
                "comparison": comparison,
                "most_trending_product": most_trending,
                "total_products_compared": len(comparison),
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Completed trend comparison")
            return result
            
        except Exception as e:
            print(f"❌ Error comparing trends: {e}")
            return None
    
    def get_product_insights(
        self,
        product_query: str,
        country: str = "us",
        language: str = "en"
    ) -> Optional[Dict[str, Any]]:
        """
        Get comprehensive product insights from Google Immersive Product API
        
        Args:
            product_query: Product name or query
            country: Country code (us, in, uk, etc.)
            language: Language code (en, hi, etc.)
            
        Returns:
            Comprehensive product insights and analysis
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            print(f"🔍 Fetching product insights for: {product_query}")
            
            params = {
                "api_key": self.api_key,
                "country": country,
                "language": language
            }
            
            if product_query:
                params["q"] = product_query
            
            response = requests.get("https://api.scrapingdog.com/google_immersive_product", params=params, timeout=30)
            
            if response.status_code != 200:
                print(f"❌ Failed to get product insights. Status: {response.status_code}")
                return None
            
            insights_data = response.json()
            products_list = insights_data if isinstance(insights_data, list) else insights_data.get('products', [])
            
            if not products_list:
                print(f"⚠️  No products found for {product_query}")
                return None
            
            # Parse main product
            main_product = products_list[0]
            parsed_main = {
                "title": main_product.get("title") or main_product.get("name") or "",
                "description": main_product.get("description") or "",
                "price": main_product.get("price") or main_product.get("min_price") or 0,
                "currency": main_product.get("currency") or "USD",
                "rating": main_product.get("rating") or main_product.get("avg_rating") or 0,
                "reviews_count": main_product.get("review_count") or main_product.get("num_reviews") or 0,
                "url": main_product.get("url") or main_product.get("link") or "",
                "image": main_product.get("image") or main_product.get("thumbnail") or "",
                "seller": main_product.get("seller") or main_product.get("brand") or "",
                "availability": main_product.get("availability") or "unknown",
                "category": main_product.get("category") or ""
            }
            
            # Parse features
            features = {
                "specs": main_product.get("specs") or main_product.get("specifications") or [],
                "highlights": main_product.get("highlights") or [],
                "variants": main_product.get("variants") or []
            }
            
            # Parse competitors
            competitors = []
            if len(products_list) > 1:
                for comp in products_list[1:4]:
                    comp_parsed = {
                        "title": comp.get("title") or comp.get("name") or "",
                        "price": comp.get("price") or 0,
                        "rating": comp.get("rating") or 0,
                        "seller": comp.get("seller") or comp.get("brand") or ""
                    }
                    competitors.append(comp_parsed)
            
            # Analyze competitiveness
            competitiveness = {
                "product_name": parsed_main.get("title"),
                "market_position": "mid-range"
            }
            
            if competitors:
                avg_comp_price = sum([c.get("price", 0) for c in competitors]) / len(competitors)
                avg_comp_rating = sum([c.get("rating", 0) for c in competitors]) / len(competitors)
                
                main_price = float(parsed_main.get("price", 0))
                main_rating = float(parsed_main.get("rating", 0))
                
                price_advantage = "competitive"
                rating_advantage = "average"
                
                if main_price < avg_comp_price * 0.9:
                    price_advantage = "cheaper"
                    competitiveness["market_position"] = "value leader"
                elif main_price > avg_comp_price * 1.1:
                    price_advantage = "expensive"
                
                if main_rating > avg_comp_rating:
                    rating_advantage = "better rated"
                    if competitiveness["market_position"] == "mid-range":
                        competitiveness["market_position"] = "quality leader"
                elif main_rating < avg_comp_rating:
                    rating_advantage = "lower rated"
                
                competitiveness["price_vs_competitors"] = price_advantage
                competitiveness["rating_vs_competitors"] = rating_advantage
            
            # Calculate scores
            quality_score = (parsed_main.get("rating", 0) / 5 * 100) if parsed_main.get("rating", 0) > 0 else 0
            popularity_score = min((parsed_main.get("reviews_count", 0) / 1000 * 100), 100)
            
            result = {
                "product_query": product_query,
                "country": country,
                "language": language,
                "main_product": parsed_main,
                "product_features": features,
                "competitors": competitors,
                "competitiveness": competitiveness,
                "market_scores": {
                    "quality_score": round(quality_score, 2),
                    "popularity_score": round(popularity_score, 2),
                    "overall_rating": parsed_main.get("rating", 0),
                    "total_reviews": parsed_main.get("reviews_count", 0)
                },
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Retrieved product insights for {product_query}")
            return result
            
        except requests.Timeout:
            print(f"⏱️  Timeout fetching product insights")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error fetching product insights: {e}")
            return None
    
    def analyze_product_category(
        self,
        category: str,
        country: str = "us",
        language: str = "en"
    ) -> Optional[Dict[str, Any]]:
        """
        Analyze products in a category with market metrics
        
        Args:
            category: Product category to analyze
            country: Country code
            language: Language code
            
        Returns:
            Category analysis with top products and market metrics
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            print(f"📂 Analyzing product category: {category}")
            
            params = {
                "api_key": self.api_key,
                "country": country,
                "language": language,
                "q": category
            }
            
            response = requests.get("https://api.scrapingdog.com/google_immersive_product", params=params, timeout=30)
            
            if response.status_code != 200:
                print(f"❌ Failed to analyze category. Status: {response.status_code}")
                return None
            
            category_data = response.json()
            products_list = category_data if isinstance(category_data, list) else category_data.get('products', [])
            
            if not products_list:
                return None
            
            # Parse products and calculate metrics
            parsed_products = []
            prices = []
            ratings = []
            
            for product in products_list[:10]:
                parsed = {
                    "title": product.get("title") or product.get("name") or "",
                    "price": product.get("price") or 0,
                    "rating": product.get("rating") or 0,
                    "reviews": product.get("review_count") or 0,
                    "seller": product.get("seller") or "",
                    "availability": product.get("availability") or "unknown"
                }
                parsed_products.append(parsed)
                
                if parsed.get("price"):
                    prices.append(float(parsed["price"]))
                if parsed.get("rating"):
                    ratings.append(float(parsed["rating"]))
            
            # Calculate category metrics
            avg_price = sum(prices) / len(prices) if prices else 0
            avg_rating = sum(ratings) / len(ratings) if ratings else 0
            min_price = min(prices) if prices else 0
            max_price = max(prices) if prices else 0
            
            category_analysis = {
                "category": category,
                "country": country,
                "language": language,
                "products_analyzed": len(parsed_products),
                "top_products": parsed_products[:5],
                "all_products": parsed_products,
                "market_metrics": {
                    "average_price": round(avg_price, 2),
                    "average_rating": round(avg_rating, 2),
                    "price_range": {
                        "minimum": round(min_price, 2),
                        "maximum": round(max_price, 2)
                    },
                    "price_variance": round(max_price - min_price, 2) if prices else 0
                },
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Completed category analysis for {category}")
            return category_analysis
            
        except Exception as e:
            print(f"❌ Error analyzing category: {e}")
            return None
    
    def search_google(
        self,
        query: str,
        country: str = "us",
        domain: str = "google.com",
        num_results: int = 10
    ) -> Optional[Dict[str, Any]]:
        """
        Search Google for products, trends, and recent searches
        
        Args:
            query: Search query
            country: Country code
            domain: Google domain
            num_results: Number of results to return
            
        Returns:
            Dict with search results
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            print(f"🔎 Searching Google for: {query}")
            
            params = {
                "api_key": self.api_key,
                "query": query,
                "country": country,
                "domain": domain,
                "num": num_results
            }
            
            response = requests.get("https://api.scrapingdog.com/google", params=params, timeout=30)
            
            if response.status_code != 200:
                print(f"❌ Request failed with status code: {response.status_code}")
                return None
            
            search_data = response.json()
            results = search_data.get('organic_results', [])
            
            # Parse results
            parsed_results = []
            for result in results:
                try:
                    parsed = {
                        "title": result.get("title") or "",
                        "url": result.get("url") or result.get("link") or "",
                        "description": result.get("description") or result.get("snippet") or "",
                        "position": result.get("position") or 0,
                        "domain": self._extract_domain(result.get("url", "")),
                        "rating": result.get("rating"),
                        "reviews": result.get("reviews"),
                        "price": result.get("price")
                    }
                    parsed_results.append(parsed)
                except Exception as e:
                    print(f"⚠️  Error parsing result: {e}")
                    continue
            
            result_analysis = {
                "query": query,
                "country": country,
                "total_results": len(parsed_results),
                "results": parsed_results,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Retrieved {len(parsed_results)} search results")
            return result_analysis
            
        except requests.Timeout:
            print(f"⏱️  Timeout searching for {query}")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error searching: {e}")
            return None
    
    def search_trending_products(
        self,
        category: str,
        country: str = "us"
    ) -> Optional[Dict[str, Any]]:
        """
        Search for trending products in a category
        
        Args:
            category: Product category
            country: Country code
            
        Returns:
            Dict with trending product results
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            print(f"📈 Searching for trending products in {category}")
            
            trending_query = f"trending {category} 2025 2026"
            
            params = {
                "api_key": self.api_key,
                "query": trending_query,
                "country": country,
                "domain": "google.com",
                "num": 20
            }
            
            response = requests.get("https://api.scrapingdog.com/google", params=params, timeout=30)
            
            if response.status_code != 200:
                print(f"❌ Request failed with status code: {response.status_code}")
                return None
            
            search_data = response.json()
            results = search_data.get('organic_results', [])
            
            # Parse results
            parsed_results = []
            for result in results:
                try:
                    parsed = {
                        "title": result.get("title") or "",
                        "url": result.get("url") or "",
                        "description": result.get("description") or result.get("snippet") or "",
                        "domain": self._extract_domain(result.get("url", ""))
                    }
                    parsed_results.append(parsed)
                except:
                    continue
            
            result = {
                "category": category,
                "country": country,
                "search_query": trending_query,
                "trending_products": parsed_results,
                "total_found": len(parsed_results),
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Found {len(parsed_results)} trending products")
            return result
            
        except Exception as e:
            print(f"❌ Error searching trends: {e}")
            return None
    
    def search_recent_products(
        self,
        query: str,
        country: str = "us"
    ) -> Optional[Dict[str, Any]]:
        """
        Search for recent product listings and news
        
        Args:
            query: Product name to search
            country: Country code
            
        Returns:
            Dict with recent product results
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            print(f"📰 Searching for recent products: {query}")
            
            recent_query = f"{query} new latest 2025 2026"
            
            params = {
                "api_key": self.api_key,
                "query": recent_query,
                "country": country,
                "domain": "google.com",
                "num": 20
            }
            
            response = requests.get("https://api.scrapingdog.com/google", params=params, timeout=30)
            
            if response.status_code != 200:
                print(f"❌ Request failed with status code: {response.status_code}")
                return None
            
            search_data = response.json()
            results = search_data.get('organic_results', [])
            
            # Parse results
            parsed_results = []
            for result in results:
                try:
                    parsed = {
                        "title": result.get("title") or "",
                        "url": result.get("url") or "",
                        "description": result.get("description") or result.get("snippet") or "",
                        "domain": self._extract_domain(result.get("url", ""))
                    }
                    parsed_results.append(parsed)
                except:
                    continue
            
            result = {
                "product": query,
                "country": country,
                "search_query": recent_query,
                "recent_products": parsed_results,
                "total_found": len(parsed_results),
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Found {len(parsed_results)} recent products")
            return result
            
        except Exception as e:
            print(f"❌ Error searching recent products: {e}")
            return None
    
    def track_product_mentions(
        self,
        product_name: str,
        sites: List[str] = None,
        country: str = "us"
    ) -> Optional[Dict[str, Any]]:
        """
        Track mentions of a product across websites
        
        Args:
            product_name: Product to track
            sites: List of websites to search (default: major ecommerce/review sites)
            country: Country code
            
        Returns:
            Dict with mention tracking results
        """
        if not self.is_configured():
            print("❌ ScrapingDog API key not configured")
            return None
        
        try:
            if sites is None:
                sites = ['amazon.com', 'ebay.com', 'walmart.com', 'flipkart.com', 'reviews.cnet.com']
            
            print(f"📍 Tracking {product_name} mentions across {len(sites)} sites")
            
            mention_results = {}
            for site in sites:
                search_query = f'"{product_name}" site:{site}'
                
                params = {
                    "api_key": self.api_key,
                    "query": search_query,
                    "country": country,
                    "num": 10
                }
                
                response = requests.get("https://api.scrapingdog.com/google", params=params, timeout=30)
                
                if response.status_code == 200:
                    data = response.json()
                    results = data.get('organic_results', [])
                    
                    parsed = []
                    for result in results[:3]:
                        try:
                            parsed.append({
                                "title": result.get("title") or "",
                                "url": result.get("url") or "",
                                "description": result.get("description") or result.get("snippet") or ""
                            })
                        except:
                            continue
                    
                    mention_results[site] = {
                        "mention_count": len(results),
                        "top_results": parsed
                    }
            
            tracking_result = {
                "product": product_name,
                "sites_tracked": len(mention_results),
                "mentions_by_site": mention_results,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Completed mention tracking for {product_name}")
            return tracking_result
            
        except Exception as e:
            print(f"❌ Error tracking product mentions: {e}")
            return None
    
    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL"""
        try:
            from urllib.parse import urlparse
            return urlparse(url).netloc
        except:
            return ""
    
    def check_api_quota(self) -> Dict[str, Any]:
        """
        Check API usage and remaining credits
        
        Returns:
            Dict with API quota information
        """
        if not self.is_configured():
            return {"error": "API key not configured", "configured": False}
        
        try:
            params = {
                "api_key": self.api_key,
                "url": "https://httpbin.org/get",
                "check_quota": "true"
            }
            
            response = requests.get(
                self.BASE_URL,
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "api_calls_used": data.get("api_calls_used", 0),
                    "api_calls_remaining": data.get("api_calls_remaining", 0),
                    "configured": True
                }
            else:
                return {"error": "Failed to check quota", "configured": True}
                
        except Exception as e:
            return {"error": str(e), "configured": True}


# Singleton instance
_scrapingdog_instance = None


def get_scrapingdog() -> ScrapingDogService:
    """Get or create ScrapingDog service instance"""
    global _scrapingdog_instance
    if _scrapingdog_instance is None:
        _scrapingdog_instance = ScrapingDogService()
    return _scrapingdog_instance
