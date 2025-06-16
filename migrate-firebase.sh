#!/bin/bash

# Firebase Migration Script
# This script helps migrate from Supabase to Firebase

echo "🔥 Firebase Migration Script"
echo "============================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "   npm install -g firebase-tools"
    echo "   Or follow: https://firebase.google.com/docs/cli"
    exit 1
fi

# Check if we're in a Firebase project
if [ ! -f "firebase.json" ]; then
    echo "❌ This doesn't appear to be a Firebase project directory."
    echo "   Make sure you're in the project root and have run 'firebase init'"
    exit 1
fi

echo "✅ Firebase CLI found!"
echo ""

# Login to Firebase
echo "🔐 Logging into Firebase..."
firebase login

# Deploy Firestore rules and indexes
echo "📋 Deploying Firestore rules and indexes..."
firebase deploy --only firestore

# Deploy Storage rules  
echo "📦 Deploying Storage rules..."
firebase deploy --only storage

echo ""
echo "✅ Firebase migration completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env.local with Firebase configuration"
echo "2. Install dependencies: npm install firebase"
echo "3. Start the development server: npm run dev"
echo "4. Test authentication and database operations"
echo ""
echo "🔧 Configuration needed in .env.local:"
echo "NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key"
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com"
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id"
echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com"
echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id"
echo "NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id"
echo ""
echo "💡 You can find these values in your Firebase project settings."
echo "   https://console.firebase.google.com → Project Settings → General"
