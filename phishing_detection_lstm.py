#!/usr/bin/env python3
"""
Phishing Detection LSTM Model
Hackathon-ready script for feature-based phishing URL detection
"""

import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

def load_and_preprocess_data(file_path):
    """Load and preprocess the phishing dataset"""
    print("🔍 Loading and preprocessing dataset...")
    
    # Load the dataset
    df = pd.read_csv(file_path)
    
    print(f"📊 Dataset Shape: {df.shape}")
    print(f"📋 Columns: {list(df.columns)}")
    
    # Extract features (all columns except id and CLASS_LABEL)
    feature_columns = [col for col in df.columns if col not in ['id', 'CLASS_LABEL']]
    X = df[feature_columns].values
    y = df['CLASS_LABEL'].values
    
    print(f"🎯 Target Distribution: {np.bincount(y)}")
    print(f"📈 Features: {len(feature_columns)}")
    
    return X, y, feature_columns

def build_model(input_dim):
    """Build a neural network model for phishing detection"""
    print(f"\n🏗️ Building neural network model...")
    
    model = Sequential([
        Dense(128, activation='relu', input_shape=(input_dim,)),
        BatchNormalization(),
        Dropout(0.3),
        
        Dense(64, activation='relu'),
        BatchNormalization(),
        Dropout(0.3),
        
        Dense(32, activation='relu'),
        Dropout(0.2),
        
        Dense(1, activation='sigmoid')
    ])
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    print(f"📊 Model Summary:")
    model.summary()
    
    return model

def train_and_evaluate_model(X, y, feature_columns, test_size=0.2, epochs=50):
    """Train and evaluate the model"""
    print(f"\n🚀 Training model...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Build model
    model = build_model(X_train_scaled.shape[1])
    
    # Callbacks
    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5)
    ]
    
    # Train model
    history = model.fit(
        X_train_scaled, y_train,
        validation_split=0.2,
        epochs=epochs,
        batch_size=32,
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate model
    y_pred_proba = model.predict(X_test_scaled)
    y_pred = (y_pred_proba > 0.5).astype(int).flatten()
    
    accuracy = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_pred_proba)
    
    print(f"\n📊 Model Performance:")
    print(f"🎯 Accuracy: {accuracy:.4f}")
    print(f"📈 AUC Score: {auc:.4f}")
    
    # Save model and scaler
    model.save('phishing_model.h5')
    joblib.dump(scaler, 'feature_scaler.pkl')
    joblib.dump(feature_columns, 'feature_columns.pkl')
    
    print(f"\n💾 Model saved as 'phishing_model.h5'")
    print(f"💾 Scaler saved as 'feature_scaler.pkl'")
    print(f"💾 Feature columns saved as 'feature_columns.pkl'")
    
    return model, scaler, feature_columns, accuracy, auc, X_test_scaled, y_test, y_pred

def predict_url(model, scaler, feature_columns, url_features):
    """Predict if a URL is phishing based on features"""
    try:
        # Ensure we have the right number of features
        if len(url_features) != len(feature_columns):
            raise ValueError(f"Expected {len(feature_columns)} features, got {len(url_features)}")
        
        # Scale features
        features_scaled = scaler.transform([url_features])
        
        # Predict
        prediction_proba = model.predict(features_scaled, verbose=0)[0][0]
        prediction = 1 if prediction_proba > 0.5 else 0
        confidence = max(prediction_proba, 1 - prediction_proba)
        
        return {
            'is_phishing': bool(prediction),
            'confidence': float(confidence),
            'probability': float(prediction_proba)
        }
    except Exception as e:
        return {
            'error': str(e),
            'is_phishing': False,
            'confidence': 0.0,
            'probability': 0.0
        }

def main():
    """Main execution function"""
    print("🚀 Phishing Detection Neural Network - Hackathon Ready!")
    print("=" * 60)
    
    try:
        # Load and preprocess data
        X, y, feature_columns = load_and_preprocess_data('Phishing_Legitimate_full.csv')
        
        # Train and evaluate model
        model, scaler, feature_columns, accuracy, auc, X_test, y_test, y_pred = train_and_evaluate_model(X, y, feature_columns)
        
        # Test prediction function
        print(f"\n🔮 Testing prediction function...")
        sample_features = X_test[0]
        prediction = predict_url(model, scaler, feature_columns, sample_features)
        print(f"Sample prediction: {prediction}")
        
        print(f"\n🎉 Training Complete!")
        print(f"   Accuracy: {accuracy:.4f}")
        print(f"   AUC Score: {auc:.4f}")
        print(f"   Model files saved successfully")
        
        return model, scaler, feature_columns, accuracy, auc
        
    except FileNotFoundError:
        print(f"❌ Error: Phishing_Legitimate_full.csv not found!")
        print("Please ensure the CSV file is in the same directory as this script.")
        return None, None, None, 0, 0
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None, None, None, 0, 0

if __name__ == "__main__":
    main()