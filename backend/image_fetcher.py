"""
Pexels Image Fetcher for Product Thumbnails
Fetches high-quality, relevant images from Pexels API
"""

import os
import requests
from typing import Optional
from urllib.parse import quote

PEXELS_API_KEY = os.environ.get("PEXELS_API_KEY", "")

def get_pexels_image(product_name: str, category: str = "product") -> Optional[str]:
    """
    Fetch a high-quality image from Pexels based on product name
    
    Args:
        product_name: Name of the product to search for
        category: Category hint for better results
        
    Returns:
        URL of the image or None if not found
    """
    
    if not PEXELS_API_KEY:
        # Fallback to Unsplash if no Pexels key
        return f"https://source.unsplash.com/featured/800x800?{quote(product_name)},product"
    
    try:
        # Clean product name for better search results
        search_query = product_name.replace("-", " ").strip()
        
        # Pexels API endpoint
        url = "https://api.pexels.com/v1/search"
        headers = {
            "Authorization": PEXELS_API_KEY
        }
        params = {
            "query": search_query,
            "per_page": 5,
            "orientation": "square"
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            photos = data.get("photos", [])
            
            if photos:
                # Return the medium-sized image URL from the first result
                return photos[0]["src"]["medium"]
        
        # Fallback to category-based search if product name yields no results
        if category:
            params["query"] = category
            response = requests.get(url, headers=headers, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                photos = data.get("photos", [])
                if photos:
                    return photos[0]["src"]["medium"]
    
    except Exception as e:
        print(f"⚠️ Pexels API error for '{product_name}': {e}")
    
    # Final fallback to Unsplash
    return f"https://source.unsplash.com/featured/800x800?{quote(product_name)},product"


def get_product_image_with_fallback(product_name: str, scraped_image_url: Optional[str], category: str = "product") -> str:
    """
    Smart image selection with multiple fallbacks
    
    Priority:
    1. Scraped image URL (if valid and accessible)
    2. Pexels API image
    3. Unsplash fallback
    
    Args:
        product_name: Name of the product
        scraped_image_url: Image URL from the scraper (may be broken/invalid)
        category: Product category for better Pexels results
        
    Returns:
        Valid image URL
    """
    
    # 1. Try scraped image if it exists and looks valid
    if scraped_image_url and scraped_image_url.startswith("http"):
        # Quick validation - check if it's not a placeholder
        if "placeholder" not in scraped_image_url.lower() and "no-image" not in scraped_image_url.lower():
            try:
                # Quick HEAD request to verify image exists
                head_response = requests.head(scraped_image_url, timeout=3, allow_redirects=True)
                if head_response.status_code == 200 and "image" in head_response.headers.get("Content-Type", ""):
                    return scraped_image_url
            except:
                pass
    
    # 2. Fallback to Pexels
    pexels_image = get_pexels_image(product_name, category)
    if pexels_image:
        return pexels_image
    
    # 3. Final fallback to Unsplash
    return f"https://source.unsplash.com/featured/800x800?{quote(product_name)},product"
