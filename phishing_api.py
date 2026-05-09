#!/usr/bin/env python3
"""
Phishing Detection API for Next.js integration
"""

import json
import sys
import os
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
import joblib
import tensorflow as tf
from urllib.parse import urlparse
import re

app = Flask(__name__)

# Global variables for model
model = None
scaler = None
feature_columns = None

def extract_url_features(url):
    """Extract features from URL for phishing detection"""
    try:
        parsed = urlparse(url)
        
        # Initialize feature vector with zeros
        features = [0.0] * 47  # Based on the CSV structure
        
        # Basic URL features
        features[0] = url.count('.')  # NumDots
        features[1] = len(parsed.hostname.split('.')) - 2 if parsed.hostname else 0  # SubdomainLevel
        features[2] = len(parsed.path.split('/')) - 1 if parsed.path else 0  # PathLevel
        features[3] = len(url)  # UrlLength
        features[4] = url.count('-')  # NumDash
        features[5] = parsed.hostname.count('-') if parsed.hostname else 0  # NumDashInHostname
        features[6] = 1 if '@' in url else 0  # AtSymbol
        features[7] = 1 if '~' in url else 0  # TildeSymbol
        features[8] = url.count('_')  # NumUnderscore
        features[9] = url.count('%')  # NumPercent
        features[10] = len(parsed.query.split('&')) if parsed.query else 0  # NumQueryComponents
        features[11] = url.count('&')  # NumAmpersand
        features[12] = url.count('#')  # NumHash
        features[13] = sum(c.isdigit() for c in url)  # NumNumericChars
        features[14] = 1 if not url.startswith('https://') else 0  # NoHttps
        features[15] = 1 if re.search(r'[a-zA-Z]{10,}', url) else 0  # RandomString
        features[16] = 1 if re.match(r'^\d+\.\d+\.\d+\.\d+', parsed.hostname or '') else 0  # IpAddress
        
        # Hostname features
        if parsed.hostname:
            features[20] = len(parsed.hostname)  # HostnameLength
            features[21] = len(parsed.path) if parsed.path else 0  # PathLength
            features[22] = len(parsed.query) if parsed.query else 0  # QueryLength
            features[23] = 1 if '//' in parsed.path else 0  # DoubleSlashInPath
        
        # Additional features (simplified)
        features[25] = 1 if any(word in url.lower() for word in ['secure', 'account', 'login', 'bank', 'paypal']) else 0  # NumSensitiveWords
        features[26] = 1 if any(brand in url.lower() for brand in ['google', 'microsoft', 'apple', 'amazon']) else 0  # EmbeddedBrandName
        
        # Security features
        features[29] = 1 if 'favicon' in url.lower() else 0  # ExtFavicon
        features[30] = 1 if 'http://' in url else 0  # InsecureForms
        features[31] = 1 if parsed.path and not parsed.path.startswith('/') else 0  # RelativeFormAction
        features[32] = 1 if parsed.netloc and parsed.netloc != parsed.hostname else 0  # ExtFormAction
        features[33] = 1 if 'javascript:' in url.lower() else 0  # AbnormalFormAction
        
        # Additional security indicators
        features[35] = 1 if 'status' in url.lower() else 0  # FakeLinkInStatusBar
        features[36] = 1 if 'rightclick' in url.lower() or 'contextmenu' in url.lower() else 0  # RightClickDisabled
        features[37] = 1 if 'popup' in url.lower() or 'window.open' in url.lower() else 0  # PopUpWindow
        features[38] = 1 if 'mailto:' in url else 0  # SubmitInfoToEmail
        features[39] = 1 if 'iframe' in url.lower() or 'frame' in url.lower() else 0  # IframeOrFrame
        features[40] = 1 if 'title' not in url.lower() else 0  # MissingTitle
        features[41] = 1 if 'image' in url.lower() and 'form' in url.lower() else 0  # ImagesOnlyInForm
        
        return features
        
    except Exception as e:
        print(f"Error extracting features: {e}")
        return [0.0] * 47

def load_model():
    """Load the trained model and scaler"""
    global model, scaler, feature_columns
    
    try:
        if os.path.exists('phishing_model.h5'):
            model = tf.keras.models.load_model('phishing_model.h5')
            scaler = joblib.load('feature_scaler.pkl')
            feature_columns = joblib.load('feature_columns.pkl')
            print("✅ Model loaded successfully")
            return True
        else:
            print("❌ Model files not found. Please train the model first.")
            return False
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

@app.route('/predict', methods=['POST'])
def predict_phishing():
    """Predict if a URL is phishing"""
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        data = request.get_json()
        url = data.get('url', '')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Extract features
        features = extract_url_features(url)
        
        # Ensure we have the right number of features
        if len(features) != len(feature_columns):
            features = features[:len(feature_columns)] if len(features) > len(feature_columns) else features + [0.0] * (len(feature_columns) - len(features))
        
        # Scale features
        features_scaled = scaler.transform([features])
        
        # Predict
        prediction_proba = model.predict(features_scaled, verbose=0)[0][0]
        prediction = 1 if prediction_proba > 0.5 else 0
        confidence = max(prediction_proba, 1 - prediction_proba)
        
        return jsonify({
            'url': url,
            'is_phishing': bool(prediction),
            'confidence': float(confidence),
            'probability': float(prediction_proba),
            'risk_level': 'High' if prediction_proba > 0.7 else 'Medium' if prediction_proba > 0.3 else 'Low'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'features_count': len(feature_columns) if feature_columns else 0
    })

@app.route('/model_info', methods=['GET'])
def model_info():
    """Get model information"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    return jsonify({
        'model_loaded': True,
        'features_count': len(feature_columns),
        'feature_columns': feature_columns[:10] if feature_columns else [],  # First 10 features
        'model_summary': 'Neural Network with 4 hidden layers'
    })

if __name__ == '__main__':
    print("🚀 Starting Phishing Detection API...")
    
    # Load model
    if load_model():
        print("✅ Model loaded successfully")
        app.run(host='0.0.0.0', port=5000, debug=False)
    else:
        print("❌ Failed to load model. Please train the model first.")
        print("Run: python phishing_detection_lstm.py")
