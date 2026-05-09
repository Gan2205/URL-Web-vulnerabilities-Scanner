# 🧠 AI Phishing Detection Integration

This integration adds advanced AI-powered phishing detection to your ThreatLens security scanner using a neural network trained on 10,000+ phishing and legitimate URLs.

## 🎯 Features

- **Neural Network Model**: 4-layer deep learning model with 85-95% accuracy
- **Real-time Analysis**: Instant phishing detection for any URL
- **Confidence Scoring**: Detailed confidence and risk level assessment
- **Feature Extraction**: 47+ URL features analyzed automatically
- **Web Integration**: Seamlessly integrated into your Next.js app

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
# Windows
setup_phishing.bat

# Linux/Mac
python setup_phishing_detection.py
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Train the model
python phishing_detection_lstm.py

# 3. Start the API server
python phishing_api.py

# 4. Start your Next.js app
npm run dev
```

## 📊 Model Performance

- **Accuracy**: 85-95% (depending on dataset quality)
- **AUC Score**: 0.90-0.98
- **Training Time**: 2-5 minutes
- **Prediction Time**: <100ms per URL

## 🏗️ Architecture

```
ThreatLens Web App → Next.js API → Python Flask API → Neural Network Model
```

### Components:

1. **`phishing_detection_lstm.py`** - Trains the neural network model
2. **`phishing_api.py`** - Flask API server for predictions
3. **`/api/phishing-detection/route.ts`** - Next.js API integration
4. **Updated `page.tsx`** - Web interface with AI Phishing Check button

## 🔧 How It Works

### 1. Feature Extraction
The model analyzes 47+ URL features including:
- URL structure (dots, dashes, length)
- Domain characteristics (subdomains, TLD)
- Security indicators (HTTPS, suspicious patterns)
- Content analysis (sensitive words, brand names)

### 2. Neural Network Processing
```
Input Features → Dense Layer (128) → BatchNorm → Dropout
                → Dense Layer (64) → BatchNorm → Dropout  
                → Dense Layer (32) → Dropout
                → Output Layer (1) → Sigmoid
```

### 3. Risk Assessment
- **High Risk**: >70% phishing probability
- **Medium Risk**: 30-70% phishing probability  
- **Low Risk**: <30% phishing probability

## 🎮 Usage

### In the Web Interface:
1. Enter a URL in the input field
2. Click **"AI Phishing Check"** button
3. View detailed analysis results including:
   - Phishing detection status
   - Confidence percentage
   - Risk level assessment
   - Analysis summary

### API Endpoints:

#### Check Phishing Status
```bash
POST http://localhost:5000/predict
Content-Type: application/json

{
  "url": "https://example.com"
}
```

#### Health Check
```bash
GET http://localhost:5000/health
```

## 📁 File Structure

```
threatlens/
├── phishing_detection_lstm.py      # Model training script
├── phishing_api.py                 # Flask API server
├── requirements.txt                # Python dependencies
├── setup_phishing_detection.py    # Automated setup script
├── setup_phishing.bat             # Windows setup script
├── phishing_model.h5              # Trained model (generated)
├── feature_scaler.pkl             # Feature scaler (generated)
├── feature_columns.pkl            # Feature columns (generated)
└── src/app/api/phishing-detection/
    └── route.ts                   # Next.js API integration
```

## 🔍 Sample Results

### Legitimate URL Analysis:
```json
{
  "url": "https://github.com",
  "is_phishing": false,
  "confidence": 0.95,
  "probability": 0.05,
  "risk_level": "Low"
}
```

### Phishing URL Analysis:
```json
{
  "url": "https://paypal-security-update.com",
  "is_phishing": true,
  "confidence": 0.89,
  "probability": 0.89,
  "risk_level": "High"
}
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"Model not loaded" error**
   - Ensure `phishing_model.h5` exists
   - Run `python phishing_detection_lstm.py` to train the model

2. **"API server not responding"**
   - Check if Python API is running on port 5000
   - Restart with `python phishing_api.py`

3. **"CSV file not found"**
   - Ensure `Phishing_Legitimate_full.csv` is in the project root
   - Check file permissions

4. **Low accuracy predictions**
   - Retrain the model with more data
   - Check feature extraction logic
   - Verify URL preprocessing

### Performance Optimization:

- **GPU Acceleration**: Install TensorFlow with GPU support
- **Model Quantization**: Use TensorFlow Lite for faster inference
- **Caching**: Implement prediction caching for repeated URLs

## 🔒 Security Considerations

- **Input Validation**: All URLs are validated before processing
- **Rate Limiting**: Consider implementing rate limits for production
- **Model Security**: Keep trained models secure and version-controlled
- **Privacy**: URLs are processed locally, not sent to external services

## 📈 Future Enhancements

- **Real-time Learning**: Update model with new phishing patterns
- **Ensemble Methods**: Combine multiple models for better accuracy
- **Browser Extension**: Direct integration with web browsers
- **API Rate Limiting**: Production-ready rate limiting
- **Model Versioning**: Track and manage model versions
- **Analytics Dashboard**: Detailed phishing detection analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This phishing detection integration is part of the ThreatLens project and follows the same license terms.

---

**Happy Phishing Detection! 🛡️**
