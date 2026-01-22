"""
Instagram Spider - Scrapes Instagram posts, comments, and product analysis data
"""
import requests
import os
from typing import Optional, Dict, Any, Generator, List
from datetime import datetime


class InstagramScrapingDogSpider:
    """Scrapes Instagram posts and product analysis data using ScrapingDog API"""
    
    name = 'instagram_scrapingdog'
    
    def __init__(self):
        self.api_key = os.environ.get("SCRAPINGDOG_API_KEY", "6971f563189cdc880fccb6cc")
        self.posts_base_url = "https://api.scrapingdog.com/instagram/posts"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def fetch_posts(self, instagram_id: str = "") -> Optional[Dict[str, Any]]:
        """
        Fetch Instagram posts for product analysis
        
        Args:
            instagram_id: Instagram user ID or hashtag ID to fetch posts from
            
        Returns:
            Dict with post data or None if failed
        """
        try:
            params = {
                "api_key": self.api_key,
                "id": instagram_id
            }
            
            print(f"🔄 Fetching Instagram posts for ID: {instagram_id}")
            response = self.session.get(self.posts_base_url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                posts_count = len(data) if isinstance(data, list) else len(data.get('posts', []))
                print(f"✅ Retrieved {posts_count} Instagram posts")
                return data
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                print(f"Response: {response.text[:200]}")
                return None
                
        except requests.Timeout:
            print(f"⏱️  Timeout while fetching Instagram posts")
            return None
        except requests.RequestException as e:
            print(f"❌ Request error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error fetching Instagram posts: {e}")
            return None
    
    def fetch_product_reviews_from_instagram(
        self,
        product_name: str,
        hashtag: str = ""
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch Instagram posts related to a product for reviews and analysis
        
        Args:
            product_name: Name of the product to search reviews for
            hashtag: Optional specific hashtag to search
            
        Returns:
            Dict with product-related posts or None if failed
        """
        try:
            search_hashtag = hashtag if hashtag else product_name.replace(" ", "")
            
            print(f"📱 Searching Instagram for product reviews: #{search_hashtag}")
            response = self.fetch_posts(instagram_id=search_hashtag)
            
            if response:
                return response
            return None
                
        except Exception as e:
            print(f"❌ Error fetching product reviews: {e}")
            return None
    
    def parse_post_data(self, post: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Parse Instagram post data and extract relevant information
        
        Args:
            post: Raw post data from Instagram API
            
        Returns:
            Parsed post data dict or None
        """
        try:
            parsed_data = {
                "post_id": post.get("id") or post.get("pk"),
                "caption": post.get("caption") or post.get("text") or "",
                "likes": post.get("likes_count") or post.get("like_count") or 0,
                "comments_count": post.get("comments_count") or post.get("comment_count") or 0,
                "shares_count": post.get("shares_count") or 0,
                "author": post.get("username") or post.get("author") or "",
                "author_followers": post.get("author_followers") or 0,
                "posted_at": post.get("timestamp") or post.get("taken_at") or datetime.now().isoformat(),
                "image_url": post.get("image_url") or post.get("display_url") or "",
                "video_url": post.get("video_url") or "",
                "post_url": post.get("url") or "",
                "engagement_rate": (post.get("likes_count", 0) + post.get("comments_count", 0)) / max(post.get("author_followers", 1), 1) * 100
            }
            return parsed_data
        except Exception as e:
            print(f"⚠️  Error parsing post data: {e}")
            return None
    
    def extract_product_sentiment(self, caption: str, comments: List[str] = None) -> Dict[str, Any]:
        """
        Analyze sentiment and extract product information from Instagram content
        
        Args:
            caption: Post caption text
            comments: List of comment texts
            
        Returns:
            Dict with sentiment analysis and product info
        """
        try:
            text_to_analyze = caption or ""
            if comments:
                text_to_analyze += " " + " ".join(comments)
            
            # Keywords for positive and negative sentiment
            positive_keywords = ['love', 'amazing', 'best', 'awesome', 'excellent', 'great', 'perfect', 'recommend', 'worth', 'quality']
            negative_keywords = ['hate', 'bad', 'worst', 'terrible', 'poor', 'waste', 'regret', 'avoid', 'broken', 'cheap']
            mention_keywords = ['price', 'cost', 'delivery', 'quality', 'service', 'value', 'money', 'worth']
            
            text_lower = text_to_analyze.lower()
            
            positive_count = sum(1 for keyword in positive_keywords if keyword in text_lower)
            negative_count = sum(1 for keyword in negative_keywords if keyword in text_lower)
            mentions = [keyword for keyword in mention_keywords if keyword in text_lower]
            
            total_sentiment = positive_count - negative_count
            if total_sentiment > 0:
                sentiment = "positive"
            elif total_sentiment < 0:
                sentiment = "negative"
            else:
                sentiment = "neutral"
            
            return {
                "sentiment": sentiment,
                "sentiment_score": total_sentiment,
                "positive_mentions": positive_count,
                "negative_mentions": negative_count,
                "key_topics": mentions,
                "raw_text": text_to_analyze[:500]  # First 500 chars
            }
        except Exception as e:
            print(f"⚠️  Error analyzing sentiment: {e}")
            return {"sentiment": "unknown", "error": str(e)}
    
    def get_product_social_analysis(
        self,
        product_name: str,
        hashtag: str = ""
    ) -> Optional[Dict[str, Any]]:
        """
        Get comprehensive social analysis for a product from Instagram
        
        Args:
            product_name: Name of the product
            hashtag: Optional specific hashtag
            
        Returns:
            Dict with social analysis data or None
        """
        try:
            posts_data = self.fetch_product_reviews_from_instagram(product_name, hashtag)
            
            if not posts_data:
                print(f"❌ No posts found for {product_name}")
                return None
            
            posts = posts_data if isinstance(posts_data, list) else posts_data.get('posts', [])
            
            if not posts:
                return None
            
            parsed_posts = []
            total_likes = 0
            total_comments = 0
            sentiments = {"positive": 0, "negative": 0, "neutral": 0}
            
            for post in posts[:50]:  # Analyze top 50 posts
                parsed_post = self.parse_post_data(post)
                if parsed_post:
                    sentiment_analysis = self.extract_product_sentiment(
                        parsed_post.get("caption", ""),
                        [parsed_post.get("caption", "")]
                    )
                    parsed_post["sentiment_analysis"] = sentiment_analysis
                    parsed_posts.append(parsed_post)
                    
                    total_likes += parsed_post.get("likes", 0)
                    total_comments += parsed_post.get("comments_count", 0)
                    sentiments[sentiment_analysis.get("sentiment", "neutral")] += 1
            
            avg_engagement = (total_likes + total_comments) / len(parsed_posts) if parsed_posts else 0
            
            analysis_result = {
                "product_name": product_name,
                "total_posts_analyzed": len(parsed_posts),
                "total_likes": total_likes,
                "total_comments": total_comments,
                "average_engagement": avg_engagement,
                "sentiment_breakdown": sentiments,
                "sentiment_percentage": {
                    "positive": (sentiments["positive"] / len(parsed_posts) * 100) if parsed_posts else 0,
                    "negative": (sentiments["negative"] / len(parsed_posts) * 100) if parsed_posts else 0,
                    "neutral": (sentiments["neutral"] / len(parsed_posts) * 100) if parsed_posts else 0
                },
                "top_posts": parsed_posts[:5],
                "all_posts": parsed_posts,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Completed social analysis for {product_name}")
            return analysis_result
            
        except Exception as e:
            print(f"❌ Error in product social analysis: {e}")
            return None
    
    def parse_posts_generator(self, posts_data: Dict[str, Any]) -> Generator[Dict[str, Any], None, None]:
        """
        Parse posts and yield parsed data
        
        Args:
            posts_data: Raw posts data from API
            
        Yields:
            Parsed post data dictionaries
        """
        if not posts_data:
            print("⚠️  No posts data provided")
            return
        
        posts = posts_data if isinstance(posts_data, list) else (posts_data.get('posts') or [])
        
        for post in posts:
            if post:  # Ensure post is not None
                parsed_post = self.parse_post_data(post)
                if parsed_post:
                    yield parsed_post


def get_instagram_spider() -> InstagramScrapingDogSpider:
    """Get or create Instagram spider instance"""
    return InstagramScrapingDogSpider()
