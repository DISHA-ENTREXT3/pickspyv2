"""
Products Spider - Scrapes product data from Amazon and Flipkart
"""
import scrapy
import hashlib
import random
import re

class AmazonBestsellersSpider(scrapy.Spider):
    """Scrapes Amazon Best Sellers"""
    name = 'amazon_bestsellers'
    allowed_domains = ['amazon.com']
    
    custom_settings = {
        'DOWNLOAD_DELAY': 2,
        'CONCURRENT_REQUESTS_PER_DOMAIN': 2,
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    def start_requests(self):
        # Targeting specific best seller nodes
        urls = [
            'https://www.amazon.com/Best-Sellers-Electronics/zgbs/electronics',
            'https://www.amazon.com/Best-Sellers-Home-Kitchen/zgbs/home-garden',
            'https://www.amazon.com/Best-Sellers-Beauty/zgbs/beauty',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)
    
    def parse(self, response):
        category = response.url.split('/')[-2] if 'zgbs' in response.url else 'general'
        
        for item in response.css('div.zg-item-immersion, div[data-asin]'):
            name = item.css('span.zg-text-center-align::text, span.a-size-small::text, div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1::text').get()
            
            # Price extraction (resilient)
            price_whole = item.css('span.a-price-whole::text, span._cDEzb_p13n-sc-price::text').get()
            price_fraction = item.css('span.a-price-fraction::text').get()
            price = 0
            if price_whole:
                # Cleanup price string
                clean_price = price_whole.replace('$', '').replace(',', '')
                if price_fraction:
                    clean_price += '.' + price_fraction
                try:
                    price = float(clean_price)
                except ValueError:
                    price = 0
            
            img = item.css('img::attr(src)').get()
            rating_text = item.css('span.a-icon-alt::text').get()
            rating = 4.5
            if rating_text:
                match = re.search(r'(\d+\.?\d*)', rating_text)
                if match:
                    rating = float(match.group(1))
            
            if name and len(name) > 3:
                product_id = hashlib.md5(name.encode()).hexdigest()[:12]
                yield {
                    'id': f'amz-{product_id}',
                    'name': name.strip()[:100],
                    'category': category,
                    'price': price,
                    'imageUrl': img or '',
                    'rating': rating,
                    'source': 'amazon',
                    'scraper': 'scrapy'
                }

class FlipkartSpider(scrapy.Spider):
    """Scrapes Flipkart for trending products"""
    name = 'flipkart_trending'
    allowed_domains = ['flipkart.com']
    
    custom_settings = {
        'DOWNLOAD_DELAY': 3,
        'CONCURRENT_REQUESTS_PER_DOMAIN': 2,
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    def start_requests(self):
        urls = [
            'https://www.flipkart.com/search?q=best+selling+electronics&otracker=search',
            'https://www.flipkart.com/search?q=trending+home+decor&otracker=search',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)
            
    def parse(self, response):
        # Flipkart product selector strategy (Updated for 2025/2026)
        # Using multiple potential selectors to handle different layout styles (grid/list)
        items = response.css('div[data-id], ._1AtVbE, .cPHDOP, ._75_9zl, ._13oc-S')
        
        for item in items:
            # Resilient Name Extraction
            name = item.css('a.IRpwTa::text, div._4rR01T::text, a.s1Q9rs::text, a[title]::attr(title), .w6nN96::text').get()
            
            # Resilient Price Extraction
            price_text = item.css('._30jeq3::text, .Nx9W0j::text, ._25b18c::text, span[class*="price"]::text').get()
            
            # Resilient Image Extraction
            img = item.css('img._396cs4::attr(src), img._2r_T1_::attr(src), img::attr(src), img._53u_M-::attr(src)').get()
            
            # Resilient Link Extraction
            link = item.css('a._1fQY7K::attr(href), a.IRpwTa::attr(href), a::attr(href)').get()
            
            price = 0
            if price_text:
                # Remove currency symbol and commas
                clean_price = re.sub(r'[^\d]', '', price_text)
                if clean_price:
                    try:
                        price = float(clean_price)
                    except:
                        price = 0
            
            if name and len(name.strip()) > 3:
                product_id = hashlib.md5(name.encode()).hexdigest()[:12]
                yield {
                    'id': f'fk-{product_id}',
                    'name': name.strip()[:100],
                    'category': 'electronics' if 'electronics' in response.url else 'general',
                    'price': price,
                    'imageUrl': img or '',
                    'rating': 4.2,
                    'source': 'flipkart',
                    'scraper': 'scrapy'
                }
