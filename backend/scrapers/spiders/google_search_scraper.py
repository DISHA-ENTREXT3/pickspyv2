"""
Google Search Scraper - Fetches recent searches, trending products, and search results
"""
import requests
import os
from typing import Optional, Dict, Any, List
from datetime import datetime


class GoogleSearchScraper:
    """Scrapes Google search results and trending data using ScrapingDog Google API"""
    
    name = 'google_search_scraper'
    
    def __init__(self):
        self.api_key = os.environ.get("SCRAPINGDOG_API_KEY", "6971f563189cdc880fccb6cc")
        self.base_url = "https://api.scrapingdog.com/google"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def search_products(
        self,
        query: str,
        country: str = "us",
        domain: str = "google.com",
        num_results: int = 10
    ) -> Optional[Dict[str, Any]]:
        """
        Search for products on Google
        
        Args:
            query: Search query
            country: Country code (us, in, uk, etc.)
            domain: Google domain
            num_results: Number of results to return
            
        Returns:
            Dict with search results or None if failed
        """
        try:
            params = {
                "api_key": self.api_key,
                "query": query,
                "country": country,
                "domain": domain,
                "num": num_results
            }
            
            print(f"🔎 Searching Google for: {query}")
            response = self.session.get(self.base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                results_count = len(data.get('organic_results', []))
                print(f"✅ Retrieved {results_count} search results for {query}")
                return data
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                print(f"Response: {response.text[:200]}")
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout while searching for {query}")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error searching: {e}")
            return None
    
    def advanced_search(
        self,
        query: str,
        country: str = "us",
        domain: str = "google.com",
        site: str = "",
        file_type: str = ""
    ) -> Optional[Dict[str, Any]]:
        """
        Advanced Google search with filters
        
        Args:
            query: Search query
            country: Country code
            domain: Google domain
            site: Restrict to specific site
            file_type: Filter by file type (pdf, doc, etc.)
            
        Returns:
            Dict with search results
        """
        try:
            # Build advanced search query
            advanced_query = query
            if site:
                advanced_query += f" site:{site}"
            if file_type:
                advanced_query += f" filetype:{file_type}"
            
            params = {
                "api_key": self.api_key,
                "query": advanced_query,
                "country": country,
                "domain": domain,
                "advance_search": "true"
            }
            
            print(f"🔎 Advanced search for: {advanced_query}")
            response = self.session.get(self.base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                results_count = len(data.get('organic_results', []))
                print(f"✅ Retrieved {results_count} advanced search results")
                return data
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error in advanced search: {e}")
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
        try:
            # Search for recent content with news
            recent_query = f"{query} -intitle:forum -intitle:review"
            
            params = {
                "api_key": self.api_key,
                "query": recent_query,
                "country": country,
                "domain": "google.com",
                "num": 20,
                "advance_search": "true"
            }
            
            print(f"📰 Searching for recent products: {query}")
            response = self.session.get(self.base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                return data
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error searching recent products: {e}")
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
        try:
            trending_query = f"trending {category} 2025 2026"
            
            params = {
                "api_key": self.api_key,
                "query": trending_query,
                "country": country,
                "domain": "google.com",
                "num": 20,
                "advance_search": "true"
            }
            
            print(f"📈 Searching for trending products in {category}")
            response = self.session.get(self.base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                return data
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error searching trending products: {e}")
            return None
    
    def parse_search_results(self, search_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Parse Google search results
        
        Args:
            search_data: Raw search data from API
            
        Returns:
            List of parsed results
        """
        try:
            if not search_data or not isinstance(search_data, dict):
                print("⚠️  No search data provided")
                return []
            
            parsed_results = []
            
            # Parse organic results
            organic_results = search_data.get('organic_results', [])
            if not organic_results or not isinstance(organic_results, list):
                print("⚠️  No organic results found in search data")
                return []
            
            for result in organic_results:
                if not result or not isinstance(result, dict):
                    continue
                    
                try:
                    parsed = {
                        "title": (result.get("title") or "") if result else "",
                        "url": (result.get("url") or result.get("link") or "") if result else "",
                        "description": (result.get("description") or result.get("snippet") or "") if result else "",
                        "position": int(result.get("position") or 0) if result else 0,
                        "domain": (result.get("domain") or self._extract_domain(result.get("url", ""))) if result else "",
                        "rating": result.get("rating") if result else None,
                        "reviews": result.get("reviews") if result else None,
                        "price": result.get("price") if result else None
                    }
                    parsed_results.append(parsed)
                except Exception as e:
                    print(f"⚠️  Error parsing result: {e}")
                    continue
            
            return parsed_results
        except Exception as e:
            print(f"❌ Error parsing search results: {e}")
            return []
    
    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL"""
        try:
            from urllib.parse import urlparse
            return urlparse(url).netloc
        except:
            return ""
    
    def get_search_analysis(
        self,
        query: str,
        country: str = "us"
    ) -> Optional[Dict[str, Any]]:
        """
        Get comprehensive analysis of search results for a product
        
        Args:
            query: Product name or search term
            country: Country code
            
        Returns:
            Comprehensive search analysis
        """
        try:
            print(f"📊 Analyzing search results for: {query}")
            
            # Get search results
            search_data = self.search_products(query, country)
            
            if not search_data:
                print(f"⚠️  No search results found for {query}")
                return None
            
            # Parse results
            parsed_results = self.parse_search_results(search_data)
            
            if not parsed_results:
                return None
            
            # Analyze results
            ecommerce_domains = ['amazon.com', 'ebay.com', 'walmart.com', 'flipkart.com', 'aliexpress.com', 'alibaba.com']
            review_domains = ['reviews.cnet.com', 'rtings.com', 'tomsguide.com', 'wirecutter.nytimes.com']
            news_domains = ['news.google.com', 'techcrunch.com', 'theverge.com', 'engadget.com']
            
            ecommerce_results = []
            review_results = []
            news_results = []
            other_results = []
            
            for result in parsed_results:
                domain = result.get("domain", "").lower()
                
                if any(ecom in domain for ecom in ecommerce_domains):
                    ecommerce_results.append(result)
                elif any(review in domain for review in review_domains):
                    review_results.append(result)
                elif any(news in domain for news in news_domains):
                    news_results.append(result)
                else:
                    other_results.append(result)
            
            # Get additional data
            recent_products = self.search_recent_products(query, country)
            trending_products = self.search_trending_products(query.split()[0] if query else "products", country)
            
            analysis = {
                "query": query,
                "country": country,
                "total_results": len(parsed_results),
                "search_results": {
                    "ecommerce": ecommerce_results[:5],
                    "reviews": review_results[:5],
                    "news": news_results[:5],
                    "other": other_results[:5]
                },
                "results_breakdown": {
                    "ecommerce_count": len(ecommerce_results),
                    "review_count": len(review_results),
                    "news_count": len(news_results),
                    "other_count": len(other_results)
                },
                "top_sources": {
                    "ecommerce": list(set([r.get("domain") for r in ecommerce_results]))[:3],
                    "reviews": list(set([r.get("domain") for r in review_results]))[:3],
                    "news": list(set([r.get("domain") for r in news_results]))[:3]
                },
                "all_results": parsed_results,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Completed search analysis for {query}")
            return analysis
            
        except Exception as e:
            print(f"❌ Error analyzing search results: {e}")
            return None
    
    def track_product_mentions(
        self,
        product_name: str,
        sites: List[str] = None,
        country: str = "us"
    ) -> Optional[Dict[str, Any]]:
        """
        Track mentions of a product across specific sites
        
        Args:
            product_name: Product to track
            sites: List of websites to search (default: major ecommerce/review sites)
            country: Country code
            
        Returns:
            Dict with mention tracking results
        """
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
                
                response = self.session.get(self.base_url, params=params, timeout=30)
                
                if response.status_code == 200:
                    data = response.json()
                    results = self.parse_search_results(data)
                    mention_results[site] = {
                        "mention_count": len(data.get('organic_results', [])),
                        "results": results[:3]
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
    
    def get_top_keywords(
        self,
        category: str,
        country: str = "us"
    ) -> Optional[Dict[str, Any]]:
        """
        Get top search keywords for a product category
        
        Args:
            category: Product category
            country: Country code
            
        Returns:
            Dict with top keywords analysis
        """
        try:
            print(f"🔑 Finding top keywords for category: {category}")
            
            search_queries = [
                f"best {category}",
                f"top {category}",
                f"buy {category}",
                f"{category} 2025",
                f"{category} comparison",
                f"{category} guide"
            ]
            
            keyword_data = {}
            for query in search_queries:
                search_result = self.search_products(query, country)
                if search_result:
                    keyword_data[query] = len(search_result.get('organic_results', []))
            
            result = {
                "category": category,
                "country": country,
                "top_keywords": keyword_data,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Found keywords for {category}")
            return result
            
        except Exception as e:
            print(f"❌ Error finding keywords: {e}")
            return None


def get_google_search_scraper() -> GoogleSearchScraper:
    """Get or create Google Search scraper instance"""
    return GoogleSearchScraper()
