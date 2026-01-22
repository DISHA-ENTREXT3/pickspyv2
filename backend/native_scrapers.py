"""
Native web scrapers using Selenium, BeautifulSoup, and Scrapy
Replaces ScrapingDog API with direct web scraping
"""

import os
import requests
from bs4 import BeautifulSoup
from typing import Optional, Dict, Any, List
from datetime import datetime
from urllib.parse import quote, urlencode
import json
import time

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.webdriver.chrome.service import Service
except ImportError:
    print("⚠️  Selenium not available, will use requests fallback")

try:
    from pytrends.request import TrendReq
except ImportError:
    print("⚠️  pytrends not available, will use fallback")


class WalmartScraper:
    """Scrape products from Walmart.com using BeautifulSoup"""
    
    BASE_URL = "https://www.walmart.com/search/api/preso"
    
    def search(self, query: str, limit: int = 50) -> Optional[List[Dict[str, Any]]]:
        """Search products on Walmart"""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            
            params = {
                "query": query,
                "page": 1,
                "prg": "json",
                "cat_id": "0"
            }
            
            print(f"🔄 Scraping Walmart for: {query}")
            response = requests.get(
                self.BASE_URL,
                params=params,
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    items = data.get("items", [])[:limit]
                    
                    products = []
                    for item in items:
                        product = {
                            "name": item.get("title", ""),
                            "price": item.get("priceInfo", {}).get("currentPrice", ""),
                            "url": f"https://www.walmart.com/ip/{item.get('itemId', '')}",
                            "rating": item.get("customerRating", ""),
                            "reviews": item.get("numReviews", 0),
                            "image": item.get("imageInfo", {}).get("thumbnailUrl", "")
                        }
                        if product["name"]:
                            products.append(product)
                    
                    print(f"✅ Found {len(products)} products on Walmart")
                    return products
                except:
                    return None
            
        except Exception as e:
            print(f"❌ Walmart scraping error: {e}")
        
        return None


class EbayScraper:
    """Scrape products from eBay.com using BeautifulSoup"""
    
    BASE_URL = "https://www.ebay.com/sch/i.html"
    
    def search(self, query: str, limit: int = 50) -> Optional[List[Dict[str, Any]]]:
        """Search products on eBay"""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            
            params = {
                "_nkw": query,
                "_ipg": min(limit, 200)
            }
            
            print(f"🔄 Scraping eBay for: {query}")
            response = requests.get(
                self.BASE_URL,
                params=params,
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")
                products = []
                
                for item in soup.find_all("div", class_="s-item")[:limit]:
                    try:
                        name = item.find("h2", class_="s-size-mini").text.strip() if item.find("h2") else ""
                        price = item.find("span", class_="s-item__price").text.strip() if item.find("span", class_="s-item__price") else ""
                        link = item.find("a", class_="s-item__link")
                        url = link.get("href") if link else ""
                        
                        if name and price:
                            products.append({
                                "name": name,
                                "price": price,
                                "url": url,
                                "source": "ebay"
                            })
                    except:
                        continue
                
                print(f"✅ Found {len(products)} products on eBay")
                return products
            
        except Exception as e:
            print(f"❌ eBay scraping error: {e}")
        
        return None


class FlipkartScraper:
    """Scrape products from Flipkart.com using BeautifulSoup"""
    
    BASE_URL = "https://www.flipkart.com/search"
    
    def search(self, query: str, limit: int = 50) -> Optional[List[Dict[str, Any]]]:
        """Search products on Flipkart"""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept-Language": "en-US,en;q=0.9"
            }
            
            params = {"q": query}
            
            print(f"🔄 Scraping Flipkart for: {query}")
            response = requests.get(
                self.BASE_URL,
                params=params,
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")
                products = []
                
                for item in soup.find_all("div", {"class": "_1AtVbE"})[:limit]:
                    try:
                        name_elem = item.find("a", {"class": "IRpwTa"})
                        price_elem = item.find("div", {"class": "_30jeq3"})
                        
                        name = name_elem.text.strip() if name_elem else ""
                        price = price_elem.text.strip() if price_elem else ""
                        url = name_elem.get("href") if name_elem else ""
                        
                        if name and price:
                            products.append({
                                "name": name,
                                "price": price,
                                "url": f"https://flipkart.com{url}" if url else "",
                                "source": "flipkart"
                            })
                    except:
                        continue
                
                print(f"✅ Found {len(products)} products on Flipkart")
                return products
            
        except Exception as e:
            print(f"❌ Flipkart scraping error: {e}")
        
        return None


class GoogleTrendsScraper:
    """Scrape market trends from Google Trends"""
    
    def get_trends(self, keyword: str, timeframe: str = "now 1-m") -> Optional[Dict[str, Any]]:
        """Get market trends for a keyword"""
        try:
            print(f"🔄 Fetching Google Trends for: {keyword}")
            
            pytrends = TrendReq(hl='en-US', tz=360)
            pytrends.build_payload([keyword], cat=0, timeframe=timeframe)
            
            # Get trend data
            trend_data = pytrends.interest_over_time()
            related_queries = pytrends.related_queries()
            
            # Calculate trend direction
            if len(trend_data) > 1:
                recent = trend_data.iloc[-1][keyword]
                prev = trend_data.iloc[0][keyword]
                direction = "rising" if recent > prev else "falling" if recent < prev else "stable"
                velocity = ((recent - prev) / prev * 100) if prev > 0 else 0
            else:
                direction = "stable"
                velocity = 0
            
            result = {
                "keyword": keyword,
                "direction": direction,
                "velocity_percent": round(velocity, 2),
                "timestamp": datetime.now().isoformat(),
                "related_queries": related_queries.get(keyword, {}).get("top", []).values.tolist() if keyword in related_queries else [],
                "timeseries": trend_data[keyword].tolist() if len(trend_data) > 0 else []
            }
            
            print(f"✅ Retrieved Google Trends for {keyword}")
            return result
            
        except Exception as e:
            print(f"❌ Google Trends error: {e}")
            return None


class GoogleSearchScraper:
    """Scrape Google Search results"""
    
    BASE_URL = "https://www.google.com/search"
    
    def search(self, query: str, limit: int = 50) -> Optional[List[Dict[str, Any]]]:
        """Search Google and get results"""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            
            params = {
                "q": query,
                "num": min(limit, 100)
            }
            
            print(f"🔄 Searching Google for: {query}")
            response = requests.get(
                self.BASE_URL,
                params=params,
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")
                results = []
                
                for g in soup.find_all("div", class_="g")[:limit]:
                    try:
                        link = g.find("a", href=True)
                        title = g.find("h3")
                        snippet = g.find("span", class_="VwiC3b")
                        
                        if link and title:
                            results.append({
                                "title": title.text.strip(),
                                "url": link.get("href", ""),
                                "snippet": snippet.text.strip() if snippet else ""
                            })
                    except:
                        continue
                
                print(f"✅ Found {len(results)} Google search results")
                return results
            
        except Exception as e:
            print(f"❌ Google search error: {e}")
        
        return None


class AmazonScraper:
    """Scrape products from Amazon.com"""
    
    BASE_URL = "https://www.amazon.com/s"
    
    def search(self, query: str, limit: int = 50) -> Optional[List[Dict[str, Any]]]:
        """Search products on Amazon"""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            
            params = {
                "k": query,
                "i": "all-caps"
            }
            
            print(f"🔄 Scraping Amazon for: {query}")
            response = requests.get(
                self.BASE_URL,
                params=params,
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")
                products = []
                
                for item in soup.find_all("div", {"class": "s-result-item"})[:limit]:
                    try:
                        title = item.find("h2")
                        price = item.find("span", class_="a-price-whole")
                        
                        title_text = title.text.strip() if title else ""
                        price_text = price.text.strip() if price else ""
                        
                        if title_text and price_text:
                            products.append({
                                "name": title_text,
                                "price": price_text,
                                "source": "amazon"
                            })
                    except:
                        continue
                
                print(f"✅ Found {len(products)} products on Amazon")
                return products
            
        except Exception as e:
            print(f"❌ Amazon scraping error: {e}")
        
        return None


class SocialMediaScraper:
    """Scrape comments and sentiment from social media"""
    
    def get_product_sentiment(self, product_name: str) -> Optional[Dict[str, Any]]:
        """Get social media sentiment for a product"""
        try:
            print(f"🔄 Analyzing social sentiment for: {product_name}")
            
            # Use Google Search to find social mentions
            search_scraper = GoogleSearchScraper()
            query = f"{product_name} reviews -site:amazon.com -site:ebay.com"
            results = search_scraper.search(query, limit=30)
            
            if not results:
                return None
            
            # Count mentions
            total_mentions = len(results)
            
            # Estimate sentiment (simple keyword matching)
            positive_keywords = ["great", "excellent", "good", "amazing", "love", "best", "perfect"]
            negative_keywords = ["bad", "poor", "worst", "terrible", "hate", "broken", "useless"]
            
            positive_count = 0
            negative_count = 0
            neutral_count = 0
            
            for result in results:
                text = (result.get("title", "") + " " + result.get("snippet", "")).lower()
                
                if any(word in text for word in positive_keywords):
                    positive_count += 1
                elif any(word in text for word in negative_keywords):
                    negative_count += 1
                else:
                    neutral_count += 1
            
            total = max(positive_count + negative_count + neutral_count, 1)
            
            sentiment = {
                "product": product_name,
                "total_mentions": total_mentions,
                "positive_percent": round((positive_count / total) * 100, 2),
                "negative_percent": round((negative_count / total) * 100, 2),
                "neutral_percent": round((neutral_count / total) * 100, 2),
                "sources": results[:10],
                "timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Sentiment analysis complete for {product_name}")
            return sentiment
            
        except Exception as e:
            print(f"❌ Sentiment analysis error: {e}")
            return None


class FAQScraper:
    """Scrape FAQs and product information"""
    
    def get_faqs(self, product_name: str) -> Optional[List[Dict[str, str]]]:
        """Search for FAQs about a product"""
        try:
            print(f"🔄 Searching FAQs for: {product_name}")
            
            search_scraper = GoogleSearchScraper()
            query = f"{product_name} FAQ frequently asked questions"
            results = search_scraper.search(query, limit=20)
            
            if not results:
                return None
            
            # Extract FAQ-like content from search results
            faqs = []
            for result in results:
                if "faq" in result.get("title", "").lower() or "faq" in result.get("snippet", "").lower():
                    faqs.append({
                        "question": result.get("title", ""),
                        "source": result.get("url", ""),
                        "snippet": result.get("snippet", "")
                    })
            
            print(f"✅ Found {len(faqs)} FAQ sources for {product_name}")
            return faqs[:10]  # Return top 10
            
        except Exception as e:
            print(f"❌ FAQ scraping error: {e}")
            return None


def get_native_scrapers():
    """Factory function to get all scrapers"""
    return {
        "walmart": WalmartScraper(),
        "ebay": EbayScraper(),
        "flipkart": FlipkartScraper(),
        "amazon": AmazonScraper(),
        "google_trends": GoogleTrendsScraper(),
        "google_search": GoogleSearchScraper(),
        "sentiment": SocialMediaScraper(),
        "faqs": FAQScraper()
    }
