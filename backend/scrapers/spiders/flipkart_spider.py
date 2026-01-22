"""
Flipkart Spider - Scrapes product data from Flipkart using ScrapingDog API
"""
import requests
import os
from typing import Optional, Dict, Any, Generator
from datetime import datetime


class FlipkartScrapingDogSpider:
    """Scrapes Flipkart products using ScrapingDog API"""
    
    name = 'flipkart_scrapingdog'
    
    def __init__(self):
        self.api_key = os.environ.get("SCRAPINGDOG_API_KEY", "6971f563189cdc880fccb6cc")
        self.search_base_url = "https://api.scrapingdog.com/flipkart/search"
        self.product_base_url = "https://api.scrapingdog.com/flipkart/product"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def search_products(
        self,
        query: str,
        page: int = 1,
        sort: str = "relevance",
        limit: int = 50
    ) -> Optional[Dict[str, Any]]:
        """
        Search for products on Flipkart
        
        Args:
            query: Search query string
            page: Page number for pagination
            sort: Sort option (relevance, price_low, price_high, newest, rating)
            limit: Number of results to return
            
        Returns:
            Dict with product data or None if failed
        """
        try:
            params = {
                "api_key": self.api_key,
                "query": query,
                "page": page,
                "sort": sort,
                "limit": limit
            }
            
            print(f"🔄 Searching Flipkart for: {query}")
            response = self.session.get(self.search_base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Retrieved {len(data.get('products', []))} products from Flipkart")
                return data
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout while searching Flipkart for: {query}")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error searching Flipkart: {e}")
            return None
    
    def get_product_details(self, product_url: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed product information from Flipkart product page
        
        Args:
            product_url: URL of the Flipkart product page or product ID
            
        Returns:
            Dict with product details or None if failed
        """
        try:
            params = {
                "api_key": self.api_key,
                "product_url": product_url
            }
            
            print(f"📦 Fetching Flipkart product details from: {product_url}")
            response = self.session.get(self.product_base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Successfully retrieved product details")
                return data
            else:
                print(f"❌ Failed to get product details. Status: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error: {error_data.get('error', 'Unknown error')}")
                except:
                    print(f"Response: {response.text[:100]}")
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout while fetching product details")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error fetching product details: {e}")
            return None
        except Exception as e:
            print(f"❌ Error getting product details: {e}")
            return None
    
    def parse_search_results(self, data: Dict[str, Any]) -> Generator[Dict[str, Any], None, None]:
        """
        Parse search results and yield individual products
        
        Args:
            data: Response data from search_products()
            
        Yields:
            Individual product data dictionaries
        """
        if not data:
            print("⚠️  No products found in response")
            return
        
        products_list = data if isinstance(data, list) else data.get("products") or []
        if not products_list:
            print("⚠️  No products found in response")
            return
        
        for product in products_list:
            try:
                parsed_product = {
                    "source": "flipkart",
                    "title": product.get("title", ""),
                    "price": product.get("price", 0),
                    "original_price": product.get("original_price"),
                    "rating": product.get("rating"),
                    "reviews_count": product.get("reviews_count", 0),
                    "url": product.get("url", ""),
                    "image": product.get("image", ""),
                    "discount_percent": product.get("discount_percent"),
                    "seller": product.get("seller"),
                    "delivery": product.get("delivery"),
                    "product_id": product.get("product_id"),
                    "scraped_at": datetime.now().isoformat()
                }
                yield parsed_product
            except Exception as e:
                print(f"⚠️  Error parsing product: {e}")
                continue
    
    def scrape_category(
        self,
        category: str,
        pages: int = 1,
        sort: str = "relevance"
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Scrape products from a specific category
        
        Args:
            category: Product category to scrape
            pages: Number of pages to scrape
            sort: Sort option
            
        Yields:
            Individual product data dictionaries
        """
        for page in range(1, pages + 1):
            print(f"📄 Scraping Flipkart category '{category}' - Page {page}/{pages}")
            
            data = self.search_products(
                query=category,
                page=page,
                sort=sort
            )
            
            if data:
                yield from self.parse_search_results(data)
            else:
                print(f"⚠️  Failed to scrape page {page}")
                break


def get_flipkart_spider() -> FlipkartScrapingDogSpider:
    """Get or create Flipkart spider instance"""
    return FlipkartScrapingDogSpider()
