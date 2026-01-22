# Spider modules for PickSpy
from .walmart_spider import WalmartScrapingDogSpider, get_walmart_spider
from .ebay_spider import EbayScrapingDogSpider, get_ebay_spider
from .flipkart_spider import FlipkartScrapingDogSpider, get_flipkart_spider
from .instagram_spider import InstagramScrapingDogSpider, get_instagram_spider
from .google_trends_analyzer import GoogleTrendsAnalyzer, get_trends_analyzer
from .product_insights_analyzer import GoogleProductInsightsAnalyzer, get_product_insights_analyzer
from .google_search_scraper import GoogleSearchScraper, get_google_search_scraper

__all__ = ['WalmartScrapingDogSpider', 'get_walmart_spider', 'EbayScrapingDogSpider', 'get_ebay_spider', 'FlipkartScrapingDogSpider', 'get_flipkart_spider', 'InstagramScrapingDogSpider', 'get_instagram_spider', 'GoogleTrendsAnalyzer', 'get_trends_analyzer', 'GoogleProductInsightsAnalyzer', 'get_product_insights_analyzer', 'GoogleSearchScraper', 'get_google_search_scraper']
