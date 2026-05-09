#!/usr/bin/env python3
"""
Quick setup and run script for Phishing Detection LSTM
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("📦 Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    return True

def check_csv_file():
    """Check if CSV file exists"""
    csv_files = [f for f in os.listdir('.') if f.endswith('.csv')]
    
    if not csv_files:
        print("❌ No CSV files found in current directory!")
        print("Please ensure 'Phishing_Legitimate_full.csv' is in the same directory.")
        return False
    
    # Look for phishing-related CSV files
    phishing_files = [f for f in csv_files if 'phishing' in f.lower() or 'legitimate' in f.lower()]
    
    if phishing_files:
        print(f"✅ Found CSV file: {phishing_files[0]}")
        # Rename to expected name if needed
        if phishing_files[0] != "Phishing_Legitimate_full.csv":
            os.rename(phishing_files[0], "Phishing_Legitimate_full.csv")
            print("📝 Renamed to 'Phishing_Legitimate_full.csv'")
        return True
    else:
        print("❌ No phishing-related CSV files found!")
        print("Please ensure the CSV file contains 'phishing' or 'legitimate' in the filename.")
        return False

def main():
    """Main setup and run function"""
    print("🚀 Phishing Detection LSTM - Quick Setup")
    print("=" * 45)
    
    # Check CSV file
    if not check_csv_file():
        return
    
    # Install requirements
    if not install_requirements():
        return
    
    # Run the main script
    print("\n🏃 Running phishing detection model...")
    try:
        subprocess.run([sys.executable, "phishing_detection_lstm.py"])
    except KeyboardInterrupt:
        print("\n⏹️ Script interrupted by user")
    except Exception as e:
        print(f"❌ Error running script: {e}")

if __name__ == "__main__":
    main()
