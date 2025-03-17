import snscrape.modules.twitter as sntwitter
import pandas as pd
import datetime
import os
import re
from urllib.parse import urlparse
import time
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def extract_urls(text):
    """Extract URLs from tweet text."""
    url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
    return re.findall(url_pattern, text)

def is_potentially_malicious(url):
    """Basic check for potentially malicious URLs."""
    suspicious_patterns = ['bit.ly', 'goo.gl', 'tinyurl', 'suspicious', 'malware', 'virus']
    return any(pattern in url.lower() for pattern in suspicious_patterns)

def scrape_tweets(query, limit=50):
    """Scrape tweets containing URLs with simplified approach."""
    tweets_list = []
    count = 0
    
    try:
        # Create a TwitterSearchScraper object
        scraper = sntwitter.TwitterSearchScraper(query)
        
        # Iterate through tweets
        for tweet in scraper.get_items():
            if count >= limit:
                break
                
            # Extract URLs from tweet
            urls = extract_urls(tweet.rawContent)
            if not urls:
                continue
                
            # Process each URL in the tweet
            for url in urls:
                try:
                    parsed_url = urlparse(url)
                    tweets_list.append({
                        'tweet_id': tweet.id,
                        'date': tweet.date,
                        'url': url,
                        'domain': parsed_url.netloc,
                        'is_https': parsed_url.scheme == 'https',
                        'tweet_text': tweet.rawContent,
                        'user_name': tweet.user.username,
                        'user_verified': tweet.user.verified,
                        'user_followers': tweet.user.followersCount,
                        'user_friends': tweet.user.friendsCount,
                        'retweet_count': tweet.retweetCount,
                        'like_count': tweet.likeCount,
                        'potentially_malicious': is_potentially_malicious(url)
                    })
                    count += 1
                    
                    if count % 5 == 0:
                        logger.info(f"Collected {count} tweets")
                        
                except Exception as e:
                    logger.warning(f"Error processing URL: {str(e)}")
                    continue
            
            # Small delay between tweets
            time.sleep(1)
            
    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}")
    
    return tweets_list

def main():
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Current timestamp for file naming
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Simplified queries
    queries = [
        'url filter:links lang:en',  # General URLs
        'malicious url OR scam url lang:en',  # Potentially malicious URLs
        'security url OR safe url lang:en'  # Security-related URLs
    ]
    
    all_tweets = []
    
    # Collect tweets for each query
    for i, query in enumerate(queries, 1):
        logger.info(f"\nProcessing query {i}/3: {query}")
        tweets = scrape_tweets(query, limit=50)  # Reduced limit to 50 tweets per query
        all_tweets.extend(tweets)
        logger.info(f"Query {i}: Collected {len(tweets)} tweets")
        
        # Delay between queries
        if i < len(queries):
            time.sleep(5)
    
    # Convert to DataFrame and remove duplicates
    df = pd.DataFrame(all_tweets)
    total_tweets = len(df)
    df = df.drop_duplicates(subset=['url'])
    
    # Save to CSV
    output_file = f'data/twitter_urls_{timestamp}.csv'
    df.to_csv(output_file, index=False)
    
    logger.info(f"\nData collection summary:")
    logger.info(f"Total tweets collected: {total_tweets}")
    logger.info(f"Unique URLs after deduplication: {len(df)}")
    logger.info(f"Data saved to: {output_file}")

if __name__ == "__main__":
    main() 