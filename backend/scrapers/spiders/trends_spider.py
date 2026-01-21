"""
Trends Spider - Scrapes Google Trends and Instagram Signals
"""
import scrapy
import re

class GoogleTrendsSpider(scrapy.Spider):
    """Scrapes Google Trends RSS"""
    name = 'google_trends'
    
    def start_requests(self):
        urls = [
            'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US',
            'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN', # Added India for Flipkart context
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)
    
    def parse(self, response):
        for item in response.xpath('//item'):
            title = item.xpath('title/text()').get()
            traffic = item.xpath('ht:approx_traffic/text()').get()
            if title:
                yield {
                    'keyword': title.strip(),
                    'traffic': traffic,
                    'source': 'google_trends',
                    'region': 'IN' if 'geo=IN' in response.url else 'US'
                }

class InstagramSpider(scrapy.Spider):
    """
    Scrapes Instagram Hashtags/Reels context.
    Note: Direct Instagram scraping is heavily rate-limited. 
    This spider targets public tag aggregators or acts as a placeholder for the API integration.
    """
    name = 'instagram_trends'
    allowed_domains = ['instagram.com'] # Logic would go here
    
    def start_requests(self):
        # Placeholder for viral tags
        tags = ['viral', 'trending', 'gadgets', 'amazonfinds']
        for tag in tags:
            yield {
                'keyword': tag,
                'source': 'instagram',
                'type': 'hashtag'
            }
