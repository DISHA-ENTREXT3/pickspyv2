import scrapy
import json
import re

class EbaySpider(scrapy.Spider):
    name = "ebay_search"
    allowed_domains = ["ebay.com"]
    
    custom_settings = {
        'DOWNLOAD_DELAY': 2,
        'CONCURRENT_REQUESTS': 2,
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    def start_requests(self):
        queries = getattr(self, 'queries', 'laptop,phone').split(',')
        for q in queries:
            url = f"https://www.ebay.com/sch/i.html?_nkw={q.replace(' ', '+')}&_ipg=200"
            yield scrapy.Request(url, callback=self.parse, meta={'query': q})

    def parse(self, response):
        query = response.meta['query']
        products = response.css('.s-item__wrapper')
        
        for p in products:
            try:
                title = p.css('.s-item__title::text').get()
                price = p.css('.s-item__price::text').get()
                link = p.css('.s-item__link::attr(href)').get()
                img = p.css('.s-item__image-img::attr(src)').get()
                
                if title and "Shop on eBay" not in title:
                    yield {
                        'name': title,
                        'price': price,
                        'url': link,
                        'imageUrl': img,
                        'source': 'ebay',
                        'query': query
                    }
            except: continue
            
        next_page = response.css('a.pagination__next::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse, meta=response.meta)
