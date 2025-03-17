import re
from urllib.parse import urlparse
import tld
import numpy as np
from typing import Dict, Any

def extract_advanced_features(url: str) -> Dict[str, Any]:
    """
    Extract comprehensive features from a URL for safety analysis.
    
    Parameters:
    -----------
    url : str
        The URL to analyze
        
    Returns:
    --------
    Dict[str, Any]
        Dictionary containing extracted features
    """
    try:
        parsed = urlparse(url)
        domain = parsed.netloc
        path = parsed.path
        query = parsed.query
        
        # Basic features
        features = {
            'url_length': len(url),
            'domain_length': len(domain),
            'path_length': len(path),
            'query_length': len(query),
            'has_https': int(parsed.scheme == 'https'),
            'num_dots': domain.count('.'),
            'num_digits': sum(c.isdigit() for c in url),
            'num_params': len(query.split('&')) if query else 0,
            'path_depth': len([x for x in path.split('/') if x]),
            'num_fragments': len(parsed.fragment.split('&')) if parsed.fragment else 0,
        }
        
        # Advanced pattern analysis
        features.update({
            'has_suspicious_chars': int(bool(re.search(r'[<>{}|\[\]~`]', url))),
            'has_ip_pattern': int(bool(re.match(r'\d+\.\d+\.\d+\.\d+', domain))),
            'has_suspicious_keywords': int(bool(re.search(
                r'(login|account|update|security|verify|support|service|signin|payment)',
                url.lower()
            ))),
            'digit_ratio': sum(c.isdigit() for c in url) / len(url),
            'special_char_ratio': len(re.findall(r'[^a-zA-Z0-9]', url)) / len(url),
        })
        
        # Domain specific features
        try:
            res = tld.get_tld(url, as_object=True)
            features['domain_suffix_length'] = len(res.suffix) if res.suffix else 0
            features['is_free_domain'] = int(res.suffix in ['tk', 'ml', 'ga', 'cf', 'gq'])
        except:
            features['domain_suffix_length'] = 0
            features['is_free_domain'] = 0
            
        # URL entropy as a measure of randomness
        features['url_entropy'] = calculate_entropy(url)
        
        return features
    except Exception as e:
        # Fallback with safe default values
        return {
            'url_length': 0, 'domain_length': 0, 'path_length': 0,
            'query_length': 0, 'has_https': 0, 'num_dots': 0,
            'num_digits': 0, 'num_params': 0, 'path_depth': 0,
            'num_fragments': 0, 'has_suspicious_chars': 1,
            'has_ip_pattern': 0, 'has_suspicious_keywords': 1,
            'digit_ratio': 0, 'special_char_ratio': 0,
            'domain_suffix_length': 0, 'is_free_domain': 1,
            'url_entropy': 0
        }

def calculate_entropy(text: str) -> float:
    """Calculate Shannon entropy of a string."""
    prob = [float(text.count(c)) / len(text) for c in set(text)]
    return -sum(p * np.log2(p) for p in prob)

def get_feature_names() -> list:
    """Return list of feature names in the order they are extracted."""
    return [
        'url_length', 'domain_length', 'path_length', 'query_length',
        'has_https', 'num_dots', 'num_digits', 'num_params', 'path_depth',
        'num_fragments', 'has_suspicious_chars', 'has_ip_pattern',
        'has_suspicious_keywords', 'digit_ratio', 'special_char_ratio',
        'domain_suffix_length', 'is_free_domain', 'url_entropy'
    ] 