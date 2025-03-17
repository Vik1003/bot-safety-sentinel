import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

def generate_sample_data(n_samples=1000):
    np.random.seed(42)
    
    # Generate features that might be indicative of bot behavior
    followers = np.random.exponential(1000, n_samples)
    following = np.random.exponential(800, n_samples)
    account_age = np.random.uniform(1, 3650, n_samples)  # in days
    tweet_frequency = np.random.exponential(50, n_samples)
    hashtag_ratio = np.random.beta(2, 5, n_samples)
    url_ratio = np.random.beta(1.5, 5, n_samples)
    
    # Create some relationships between features
    bot_probability = (
        0.3 * (following > followers) +
        0.3 * (tweet_frequency > 100) +
        0.2 * (hashtag_ratio > 0.7) +
        0.2 * (url_ratio > 0.6)
    )
    
    # Generate labels with some noise
    labels = (bot_probability + np.random.normal(0, 0.1, n_samples) > 0.7).astype(int)
    
    # Create DataFrame
    data = pd.DataFrame({
        'followers_count': followers,
        'following_count': following,
        'account_age_days': account_age,
        'tweet_frequency': tweet_frequency,
        'hashtag_ratio': hashtag_ratio,
        'url_ratio': url_ratio,
        'is_bot': labels
    })
    
    return data

def get_train_test_data():
    data = generate_sample_data()
    X = data.drop('is_bot', axis=1)
    y = data['is_bot']
    
    return train_test_split(X, y, test_size=0.2, random_state=42)

if __name__ == "__main__":
    data = generate_sample_data()
    print("Sample data shape:", data.shape)
    print("\nSample rows:")
    print(data.head())
    print("\nClass distribution:")
    print(data['is_bot'].value_counts(normalize=True)) 