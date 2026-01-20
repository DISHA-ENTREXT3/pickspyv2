"""
Trends Spider - Scrapes trending keywords from multiple sources
Uses Scrapy for efficient parallel scraping of trend data
"""
import scrapy
from scrapy.crawler import CrawlerRunner
from scrapy.utils.project import get_project_settings
import hashlib
import re


class GoogleTrendsSpider(scrapy.Spider):
    """Scrapes Google Trends RSS for daily trending searches"""
    name = 'google_trends'
    
    def start_requests(self):
        urls = [
            'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US',
            'https://trends.google.com/trends/trendingsearches/daily/rss?geo=GB',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)
    
    def parse(self, response):
        # Parse RSS feed
        for item in response.xpath('//item'):
            title = item.xpath('title/text()').get()
            traffic = item.xpath('ht:approx_traffic/text()').get()
            if title:
                yield {
                    'keyword': title.strip(),
                    'traffic': traffic,
                    'source': 'google_trends',
                    'region': 'US' if 'geo=US' in response.url else 'GB'
                }


class TrendHunterSpider(scrapy.Spider):
    """Scrapes TrendHunter for emerging product trends"""
    name = 'trendhunter'
    allowed_domains = ['trendhunter.com']
    
    def start_requests(self):
        urls = [
            'https://www.trendhunter.com/slideshow/ecommerce-trends',
            'https://www.trendhunter.com/slideshow/tech-trends',
            'https://www.trendhunter.com/slideshow/design-trends',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)
    
    def parse(self, response):
        # Extract trend items from TrendHunter
        for item in response.css('div.slide-item, article.trend-item'):
            title = item.css('h2::text, h3::text').get()
            description = item.css('p::text').get()
            if title:
                yield {
                    'keyword': title.strip(),
                    'description': description.strip() if description else '',
                    'source': 'trendhunter',
                    'category': 'emerging'
                }


class PinterestTrendsSpider(scrapy.Spider):
    """Scrapes Pinterest Trends for visual product trends"""
    name = 'pinterest_trends'
    allowed_domains = ['pinterest.com']
    
    def start_requests(self):
        # Pinterest trends API endpoints
        urls = [
            'https://www.pinterest.com/ideas/',
        ]
        for url in urls:
            yield scrapy.Request(
                url=url, 
                callback=self.parse,
                headers={'Accept': 'text/html'}
            )
    
    def parse(self, response):
        # Extract trending ideas from Pinterest
        for item in response.css('div[data-test-id="pinWrapper"]'):
            title = item.css('span::text').get()
            if title and len(title) > 3:
                yield {
                    'keyword': title.strip(),
                    'source': 'pinterest',
                    'category': 'visual_trend'
                }


class ExplodingTopicsSpider(scrapy.Spider):
    """Scrapes Exploding Topics for viral product categories"""
    name = 'exploding_topics'
    
    def start_requests(self):
        # Exploding Topics main page
        yield scrapy.Request(
            url='https://explodingtopics.com/',
            callback=self.parse
        )
    
    def parse(self, response):
        # Extract trending topics
        for item in response.css('div.topic-card, tr.topic-row'):
            topic = item.css('span.topic-name::text, td.topic-name::text').get()
            growth = item.css('span.growth-badge::text').get()
            if topic:
                yield {
                    'keyword': topic.strip(),
                    'growth': growth.strip() if growth else 'unknown',
                    'source': 'exploding_topics',
                    'category': 'viral'
                }


class EcomhuntSpider(scrapy.Spider):
    """Scrapes Ecomhunt for winning products"""
    name = 'ecomhunt'
    allowed_domains = ['ecomhunt.com']
    
    def start_requests(self):
        yield scrapy.Request(
            url='https://ecomhunt.com/products',
            callback=self.parse
        )
    
    def parse(self, response):
        # Extract product trends from Ecomhunt
        for product in response.css('div.product-card'):
            name = product.css('h3::text, .product-title::text').get()
            category = product.css('.product-category::text').get()
            if name:
                yield {
                    'keyword': name.strip(),
                    'category': category.strip() if category else 'general',
                    'source': 'ecomhunt',
                    'type': 'winning_product'
                }
