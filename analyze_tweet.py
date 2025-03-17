import requests
import json
import sys
import re

def extract_urls(tweet_text):
    """Extract URLs from tweet text."""
    url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
    return re.findall(url_pattern, tweet_text)

def analyze_url(url):
    """Send URL to API for analysis."""
    try:
        response = requests.post(
            "http://localhost:8000/analyze",
            json={"url": url}
        )
        return response.json()
    except requests.exceptions.ConnectionError:
        print("ERROR: Unable to connect to the API. Make sure the server is running.")
        print("Run the server with: uvicorn api.main:app --host 0.0.0.0 --port 8000")
        sys.exit(1)

def print_analysis(result):
    """Print the analysis results in a readable format."""
    print("\n" + "="*50)
    print(f"URL: {result['url']}")
    print(f"Status: {result['status'].upper()}")
    print(f"Risk Score: {result['score']}/100")
    print(f"Analysis Details: {result['details']}")
    print("\nFeature Metrics:")
    
    for metric in result['featureMetrics']:
        print(f"  - {metric['name']}: {metric['value']} (Score: {metric['score']}/100)")
    
    print("\nAdditional Information:")
    print(f"  - SSL Status: {'Secure' if result['sslStatus'] else 'Insecure'}")
    print(f"  - Domain Reputation: {result['domainReputation']}")
    print(f"  - Is Shortened URL: {'Yes' if result['isShortened'] else 'No'}")
    print(f"  - Redirections Count: {result['redirectionsCount']}")
    print("="*50 + "\n")

def main():
    print("\n" + "="*50)
    print("URL Safety Sentinel - Tweet Analyzer")
    print("="*50)
    
    while True:
        # Get user input
        print("\nEnter a tweet to analyze (or 'q' to quit):")
        tweet = input("> ")
        
        if tweet.lower() == 'q':
            break
        
        # Extract URLs from the tweet
        urls = extract_urls(tweet)
        
        if not urls:
            print("No URLs found in the tweet. Please try again.")
            continue
        
        print(f"\nFound {len(urls)} URL(s) in the tweet.")
        
        # Analyze each URL
        for i, url in enumerate(urls, 1):
            print(f"\nAnalyzing URL {i}/{len(urls)}: {url}")
            result = analyze_url(url)
            print_analysis(result)

if __name__ == "__main__":
    main() 