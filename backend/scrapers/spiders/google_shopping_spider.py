import scrapy
from urllib.parse import urlparse, parse_qs

class GoogleShoppingSpider(scrapy.Spider):
    name = "google_shopping"
    allowed_domains = ["google.com"]
    
    custom_settings = {
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 5,
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    def start_requests(self):
        queries = getattr(self, 'queries', 'shoes').split(',')
        for q in queries:
            url = f"https://www.google.com/search?q={q.replace(' ', '+')}&tbm=shop&hl=en"
            yield scrapy.Request(url, callback=self.parse, meta={'query': q})

    def parse(self, response):
        query = response.meta['query']
        # Google Shopping classes are obfuscated and change frequently.
        # We target common container structures.
        
        # Strategy: Look for common repeating elements in the grid
        items = response.css('.sh-dgr__content, .i0X6df, .sh-np__click-target')
        
        if not items:
            self.logger.warning(f"No items found for {query}. Classes might have changed or bot detection active.")
        
        for item in items:
            try:
                title = item.css('h3::text, .tAxDx::text').get()
                price = item.css('.a8Pemb::text, .aSection::text, span.HRLxBb::text').get()
                link = item.css('a::attr(href)').get()
                img = item.css('img::attr(src)').get()
                
                # Clean Google redirect links
                if link and "/url?" in link:
                    parsed = parse_qs(urlparse(link).query)
                    link = parsed.get('url', [link])[0]
                
                if title and price:
                    import hashlib
                    product_id = hashlib.md5(f"{title}{query}".encode()).hexdigest()[:12]
                    yield {
                        'id': f'gs-{product_id}',
                        'name': title.strip(),
                        'price': price.strip(),
                        'url': link if link.startswith('http') else f"https://google.com{link}",
                        'imageUrl': img,
                        'source': 'google_shopping',
                        'category': 'electronics' if any(kw in query.lower() for kw in ['phone', 'watch', 'earbuds', 'laptop', 'tablet']) else 'general',
                        'query': query
                    }
            except Exception as e:
                self.logger.error(f"Error parsing item: {e}")
                continue
