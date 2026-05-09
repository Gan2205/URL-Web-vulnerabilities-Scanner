#!/usr/bin/env python3
"""
Setup script for Phishing Detection Integration
Trains the model and starts the API server
"""

import subprocess
import sys
import os
import time
import requests
from threading import Thread

def install_requirements():
    """Install required packages"""
    print("📦 Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False

def train_model():
    """Train the phishing detection model"""
    print("🤖 Training phishing detection model...")
    try:
        result = subprocess.run([sys.executable, "phishing_detection_lstm.py"], 
                              capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            print("✅ Model trained successfully!")
            print("📊 Training output:")
            print(result.stdout)
            return True
        else:
            print("❌ Model training failed:")
            print(result.stderr)
            return False
    except subprocess.TimeoutExpired:
        print("⏰ Model training timed out (5 minutes)")
        return False
    except Exception as e:
        print(f"❌ Error training model: {e}")
        return False

def start_api_server():
    """Start the Python API server"""
    print("🚀 Starting Python API server...")
    try:
        # Start the server in a separate process
        process = subprocess.Popen([sys.executable, "phishing_api.py"], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE)
        
        # Wait a bit for the server to start
        time.sleep(3)
        
        # Check if server is running
        try:
            response = requests.get("http://localhost:5000/health", timeout=5)
            if response.status_code == 200:
                print("✅ Python API server is running on http://localhost:5000")
                return process
            else:
                print("❌ API server health check failed")
                return None
        except requests.exceptions.RequestException:
            print("❌ API server is not responding")
            return None
            
    except Exception as e:
        print(f"❌ Error starting API server: {e}")
        return None

def test_integration():
    """Test the integration with Next.js"""
    print("🧪 Testing integration...")
    try:
        # Test Python API
        response = requests.post("http://localhost:5000/predict", 
                               json={"url": "https://example.com"}, 
                               timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Python API test successful:")
            print(f"   URL: {result['url']}")
            print(f"   Is Phishing: {result['is_phishing']}")
            print(f"   Confidence: {result['confidence']:.2%}")
            print(f"   Risk Level: {result['risk_level']}")
            return True
        else:
            print(f"❌ Python API test failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Integration test failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Phishing Detection Setup - ThreatLens Integration")
    print("=" * 60)
    
    # Check if CSV file exists
    if not os.path.exists("Phishing_Legitimate_full.csv"):
        print("❌ Error: Phishing_Legitimate_full.csv not found!")
        print("Please ensure the CSV file is in the same directory as this script.")
        return
    
    # Step 1: Install requirements
    if not install_requirements():
        return
    
    # Step 2: Train model
    if not train_model():
        print("⚠️ Model training failed, but continuing with setup...")
    
    # Step 3: Start API server
    api_process = start_api_server()
    if not api_process:
        print("❌ Failed to start API server")
        return
    
    # Step 4: Test integration
    if test_integration():
        print("\n🎉 Setup Complete!")
        print("✅ Phishing detection is now integrated with ThreatLens")
        print("✅ Python API server is running on http://localhost:5000")
        print("✅ You can now use the 'AI Phishing Check' button in the web interface")
        print("\n📝 Next steps:")
        print("1. Start your Next.js app: npm run dev")
        print("2. Open http://localhost:3000")
        print("3. Enter a URL and click 'AI Phishing Check'")
        print("\n⚠️ Keep this terminal open to maintain the API server")
        print("Press Ctrl+C to stop the API server")
        
        try:
            # Keep the script running
            api_process.wait()
        except KeyboardInterrupt:
            print("\n🛑 Stopping API server...")
            api_process.terminate()
            print("✅ API server stopped")
    else:
        print("❌ Integration test failed")
        if api_process:
            api_process.terminate()

if __name__ == "__main__":
    main()
