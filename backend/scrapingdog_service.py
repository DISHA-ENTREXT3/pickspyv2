"""
ScrapingDog integration service for web scraping.
Handles all requests to the ScrapingDog API.
"""

import os
import requests
from typing import Optional, Dict, Any
from urllib.parse import urlencode
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
