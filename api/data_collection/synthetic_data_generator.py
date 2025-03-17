import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import uuid
import tld
from urllib.parse import urlparse
import os

class SyntheticDataGenerator:
    def __init__(self):
        # Common domains for legitimate URLs
        self.legitimate_domains = [
            'github.com', 'medium.com', 'dev.to', 'stackoverflow.com',
            'python.org', 'microsoft.com', 'google.com', 'amazon.com',
            'youtube.com', 'linkedin.com', 'twitter.com', 'facebook.com'
        ]
        
        # Common URL shorteners (potentially suspicious)
        self.shortener_domains = [
            'bit.ly', 'tinyurl.com', 'goo.gl', 't.co',
            'ow.ly', 'buff.ly', 'cutt.ly', 'tiny.cc'
        ]
        
        # Suspicious/malicious patterns
        self.suspicious_patterns = [
            'login', 'verify', 'account', 'security', 'update',
            'password', 'bank', 'paypal', 'wallet', 'crypto'
        ]
        
        # Common TLDs
        self.common_tlds = ['.com', '.org', '.net', '.edu', '.gov']
        self.suspicious_tlds = ['.xyz', '.tk', '.ml', '.ga', '.cf']
        
        # User engagement ranges
        self.engagement_ranges = {
            'followers': (100, 1000000),
            'friends': (50, 5000),
            'retweets': (0, 1000),
            'likes': (0, 2000)
        }

    def generate_legitimate_url(self):
        """Generate a legitimate-looking URL"""
        domain = random.choice(self.legitimate_domains)
        paths = [
            f'/blog/{uuid.uuid4().hex[:8]}',
            f'/article/{random.randint(1000, 9999)}',
            f'/news/{datetime.now().strftime("%Y/%m/%d")}/{uuid.uuid4().hex[:6]}',
            f'/posts/{random.randint(10000, 99999)}',
            f'/content/{uuid.uuid4().hex[:10]}'
        ]
        return f'https://{domain}{random.choice(paths)}'

    def generate_suspicious_url(self):
        """Generate a suspicious-looking URL"""
        # Different types of suspicious URLs
        patterns = [
            # Typosquatting
            lambda: f'https://{random.choice(self.legitimate_domains).replace("o", "0")}/login',
            # Shortened URL
            lambda: f'https://{random.choice(self.shortener_domains)}/{uuid.uuid4().hex[:6]}',
            # Suspicious subdomain
            lambda: f'https://login.{uuid.uuid4().hex[:8]}.{random.choice(self.suspicious_tlds[1:])}',
            # Suspicious path
            lambda: f'https://{uuid.uuid4().hex[:8]}{random.choice(self.suspicious_tlds)}/{random.choice(self.suspicious_patterns)}'
        ]
        return random.choice(patterns)()

    def generate_tweet_text(self, url, is_suspicious):
        """Generate realistic tweet text containing the URL"""
        # Common tweet patterns
        legitimate_patterns = [
            f"Check out this interesting article! {url}",
            f"Great resource for developers: {url}",
            f"Just published a new post: {url}",
            f"Useful information here: {url}",
            f"Latest update on our project: {url}"
        ]
        
        suspicious_patterns = [
            f"URGENT: Your account needs verification {url}",
            f"Limited time offer! Click here {url}",
            f"Your password needs to be updated {url}",
            f"You won't believe what I found {url}",
            f"Make money fast! {url}"
        ]
        
        patterns = suspicious_patterns if is_suspicious else legitimate_patterns
        return random.choice(patterns)

    def generate_user_data(self, is_suspicious):
        """Generate realistic user data"""
        verified = random.random() > 0.8 if not is_suspicious else random.random() > 0.95
        
        # Generate more realistic follower/friend counts
        followers = int(np.random.lognormal(mean=8, sigma=1.5))
        friends = int(min(followers * random.uniform(0.1, 0.8), 5000))
        
        # Engagement metrics
        if is_suspicious:
            retweets = random.randint(0, 20)
            likes = random.randint(0, 50)
        else:
            retweets = int(np.random.lognormal(mean=2, sigma=1))
            likes = int(np.random.lognormal(mean=3, sigma=1))
        
        return {
            'user_name': f'user_{uuid.uuid4().hex[:8]}',
            'user_verified': verified,
            'user_followers': followers,
            'user_friends': friends,
            'retweet_count': retweets,
            'like_count': likes
        }

    def generate_dataset(self, size=1000, malicious_ratio=0.3):
        """Generate a balanced dataset of URLs"""
        data = []
        current_time = datetime.now()
        
        num_malicious = int(size * malicious_ratio)
        num_legitimate = size - num_malicious
        
        # Generate legitimate URLs
        for _ in range(num_legitimate):
            url = self.generate_legitimate_url()
            is_suspicious = False
            tweet_data = {
                'tweet_id': str(uuid.uuid4().int)[:19],
                'date': (current_time - timedelta(minutes=random.randint(0, 60*24*7))).isoformat(),
                'url': url,
                'domain': urlparse(url).netloc,
                'is_https': True,
                'tweet_text': self.generate_tweet_text(url, is_suspicious),
                'potentially_malicious': is_suspicious,
                **self.generate_user_data(is_suspicious)
            }
            data.append(tweet_data)
        
        # Generate suspicious URLs
        for _ in range(num_malicious):
            url = self.generate_suspicious_url()
            is_suspicious = True
            tweet_data = {
                'tweet_id': str(uuid.uuid4().int)[:19],
                'date': (current_time - timedelta(minutes=random.randint(0, 60*24*7))).isoformat(),
                'url': url,
                'domain': urlparse(url).netloc,
                'is_https': urlparse(url).scheme == 'https',
                'tweet_text': self.generate_tweet_text(url, is_suspicious),
                'potentially_malicious': is_suspicious,
                **self.generate_user_data(is_suspicious)
            }
            data.append(tweet_data)
        
        # Convert to DataFrame and shuffle
        df = pd.DataFrame(data)
        return df.sample(frac=1).reset_index(drop=True)

def main():
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Generate synthetic dataset
    generator = SyntheticDataGenerator()
    df = generator.generate_dataset(size=1000, malicious_ratio=0.3)
    
    # Save to CSV
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file = f'data/synthetic_twitter_urls_{timestamp}.csv'
    df.to_csv(output_file, index=False)
    
    # Print summary
    print(f"\nSynthetic Dataset Generated:")
    print(f"Total URLs: {len(df)}")
    print(f"Legitimate URLs: {len(df[~df['potentially_malicious']])}")
    print(f"Potentially Malicious URLs: {len(df[df['potentially_malicious']])}")
    print(f"Data saved to: {output_file}")
    
    # Display sample of each class
    print("\nSample Legitimate URL:")
    print(df[~df['potentially_malicious']].iloc[0][['url', 'tweet_text', 'user_verified', 'user_followers']])
    print("\nSample Suspicious URL:")
    print(df[df['potentially_malicious']].iloc[0][['url', 'tweet_text', 'user_verified', 'user_followers']])

if __name__ == "__main__":
    main() 