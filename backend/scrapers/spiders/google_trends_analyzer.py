"""
Google Trends Analyzer - Market trends analysis using ScrapingDog Google Trends API
"""
import requests
import os
from typing import Optional, Dict, Any, Generator, List
from datetime import datetime


class GoogleTrendsAnalyzer:
    """Analyzes market trends using ScrapingDog Google Trends API"""
    
    name = 'google_trends_analyzer'
    
    def __init__(self):
        self.api_key = os.environ.get("SCRAPINGDOG_API_KEY", "6971f563189cdc880fccb6cc")
        self.base_url = "https://api.scrapingdog.com/google_trends"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def fetch_timeseries_trends(
        self,
        keyword: str,
        time_range: str = "now_1_d",
        geo: str = "US"
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch timeseries trend data for a keyword
        
        Args:
            keyword: Search keyword
            time_range: Time range (now_1_d, now_7_d, now_30_d, now_90_d, now_1_m, now_3_m, now_12_m, all)
            geo: Geographic location (e.g., US, IN, UK)
            
        Returns:
            Dict with trend data or None if failed
        """
        try:
            params = {
                "api_key": self.api_key,
                "keyword": keyword,
                "data_type": "TIMESERIES",
                "time_range": time_range,
                "geo": geo
            }
            
            print(f"📈 Fetching Google Trends timeseries for: {keyword}")
            response = self.session.get(self.base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Retrieved trend data for {keyword}")
                return data
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                print(f"Response: {response.text[:200]}")
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout while fetching trends for {keyword}")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error fetching trends: {e}")
            return None
    
    def fetch_related_queries(
        self,
        keyword: str,
        time_range: str = "now_1_d",
        geo: str = "US"
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch related queries and topics for a keyword
        
        Args:
            keyword: Search keyword
            time_range: Time range
            geo: Geographic location
            
        Returns:
            Dict with related queries data
        """
        try:
            params = {
                "api_key": self.api_key,
                "keyword": keyword,
                "data_type": "RELATED_QUERIES",
                "time_range": time_range,
                "geo": geo
            }
            
            print(f"🔍 Fetching related queries for: {keyword}")
            response = self.session.get(self.base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Retrieved related queries for {keyword}")
                return data
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error fetching related queries: {e}")
            return None
    
    def fetch_trending_searches(
        self,
        geo: str = "US"
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch current trending searches
        
        Args:
            geo: Geographic location
            
        Returns:
            Dict with trending searches data
        """
        try:
            params = {
                "api_key": self.api_key,
                "data_type": "TRENDING_SEARCHES",
                "geo": geo
            }
            
            print(f"🔥 Fetching trending searches for {geo}")
            response = self.session.get(self.base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Retrieved trending searches")
                return data
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error fetching trending searches: {e}")
            return None
    
    def analyze_product_trends(
        self,
        product_name: str,
        time_range: str = "now_30_d",
        geo: str = "US"
    ) -> Optional[Dict[str, Any]]:
        """
        Comprehensive trend analysis for a product
        
        Args:
            product_name: Name of the product
            time_range: Time range for analysis
            geo: Geographic location
            
        Returns:
            Dict with comprehensive trend analysis
        """
        try:
            print(f"🎯 Analyzing trends for product: {product_name}")
            
            # Get timeseries data
            timeseries = self.fetch_timeseries_trends(product_name, time_range, geo)
            
            # Get related queries
            related = self.fetch_related_queries(product_name, time_range, geo)
            
            if not timeseries and not related:
                print(f"⚠️  No trend data found for {product_name}")
                return None
            
            # Parse timeseries data
            timeseries_points = []
            if timeseries:
                ts_data = timeseries if isinstance(timeseries, list) else timeseries.get('data', [])
                for point in ts_data:
                    try:
                        timeseries_points.append({
                            "timestamp": point.get("date") or point.get("time"),
                            "value": point.get("value") or 0,
                            "is_partial": point.get("isPartial", False)
                        })
                    except:
                        continue
            
            # Parse related queries
            top_queries = []
            rising_queries = []
            if related:
                rel_data = related if isinstance(related, dict) else related.get('data', {})
                top_queries = rel_data.get('top', []) if isinstance(rel_data.get('top'), list) else []
                rising_queries = rel_data.get('rising', []) if isinstance(rel_data.get('rising'), list) else []
            
            # Calculate trend metrics
            trend_direction = "stable"
            trend_velocity = 0
            if len(timeseries_points) >= 2:
                recent = sum([p.get("value", 0) for p in timeseries_points[-5:]])
                older = sum([p.get("value", 0) for p in timeseries_points[:5]])
                if older > 0:
                    trend_velocity = ((recent - older) / older) * 100
                
                if trend_velocity > 10:
                    trend_direction = "rising"
                elif trend_velocity < -10:
                    trend_direction = "falling"
            
            analysis = {
                "product_name": product_name,
                "time_range": time_range,
                "geo": geo,
                "trend_direction": trend_direction,
                "trend_velocity_percent": round(trend_velocity, 2),
                "timeseries_data": timeseries_points,
                "top_related_queries": top_queries[:10],
                "rising_related_queries": rising_queries[:10],
                "total_data_points": len(timeseries_points),
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Completed trend analysis for {product_name}")
            return analysis
            
        except Exception as e:
            print(f"❌ Error analyzing product trends: {e}")
            return None
    
    def compare_product_trends(
        self,
        products: List[str],
        time_range: str = "now_30_d",
        geo: str = "US"
    ) -> Optional[Dict[str, Any]]:
        """
        Compare trends across multiple products
        
        Args:
            products: List of product names to compare
            time_range: Time range for analysis
            geo: Geographic location
            
        Returns:
            Dict with comparative trend analysis
        """
        try:
            print(f"📊 Comparing trends for {len(products)} products")
            
            comparison_data = {}
            for product in products:
                trend_data = self.analyze_product_trends(product, time_range, geo)
                if trend_data:
                    comparison_data[product] = {
                        "trend_direction": trend_data.get("trend_direction"),
                        "trend_velocity": trend_data.get("trend_velocity_percent"),
                        "timeseries": trend_data.get("timeseries_data"),
                        "top_queries": trend_data.get("top_related_queries")
                    }
            
            if not comparison_data:
                return None
            
            # Determine winner (most rising trend)
            winner = max(comparison_data.items(), key=lambda x: x[1].get("trend_velocity", 0))[0]
            
            result = {
                "comparison": comparison_data,
                "most_trending_product": winner,
                "total_products_compared": len(comparison_data),
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Completed trend comparison")
            return result
            
        except Exception as e:
            print(f"❌ Error comparing product trends: {e}")
            return None
    
    def find_market_opportunities(
        self,
        category: str,
        keywords: List[str],
        time_range: str = "now_30_d",
        geo: str = "US"
    ) -> Optional[Dict[str, Any]]:
        """
        Find market opportunities based on trending keywords
        
        Args:
            category: Product category
            keywords: List of keywords to analyze
            time_range: Time range for analysis
            geo: Geographic location
            
        Returns:
            Dict with market opportunity analysis
        """
        try:
            print(f"🎯 Analyzing market opportunities in {category}")
            
            opportunities = []
            for keyword in keywords:
                trend_data = self.analyze_product_trends(keyword, time_range, geo)
                if trend_data:
                    velocity = trend_data.get("trend_velocity_percent", 0)
                    direction = trend_data.get("trend_direction", "stable")
                    
                    opportunity_score = 0
                    if direction == "rising" and velocity > 0:
                        opportunity_score = min(velocity, 100)
                    
                    opportunities.append({
                        "keyword": keyword,
                        "direction": direction,
                        "velocity": velocity,
                        "opportunity_score": opportunity_score,
                        "top_queries": trend_data.get("top_related_queries", [])[:5]
                    })
            
            # Sort by opportunity score
            opportunities.sort(key=lambda x: x["opportunity_score"], reverse=True)
            
            result = {
                "category": category,
                "time_range": time_range,
                "geo": geo,
                "opportunities": opportunities,
                "top_opportunity": opportunities[0] if opportunities else None,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Completed market opportunity analysis")
            return result
            
        except Exception as e:
            print(f"❌ Error analyzing market opportunities: {e}")
            return None


def get_trends_analyzer() -> GoogleTrendsAnalyzer:
    """Get or create Google Trends analyzer instance"""
    return GoogleTrendsAnalyzer()
