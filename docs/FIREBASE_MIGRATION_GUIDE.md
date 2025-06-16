# 🔥 Firebase Migration & Setup Guide

This guide will help you migrate from Supabase to Firebase and set up all the necessary services.

## 🚀 Quick Setup (15 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter your project name (e.g., "nexiloop-ai")
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Firebase Services

#### Enable Authentication
1. In your Firebase project, go to **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable the following providers:
   - **Email/Password** ✅
   - **Google** ✅ (configure OAuth 2.0)
   - **Anonymous** ✅ (for guest users)

#### Enable Firestore Database
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll deploy security rules later)
4. Select a location close to your users

#### Enable Storage
1. Go to **Storage**
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Select the same location as Firestore

### Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click **"Add app"** > **"Web"** (</> icon)
4. Register your app with a nickname
5. Copy the Firebase configuration object

### Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Other existing environment variables...
CSRF_SECRET=your_32_character_random_string
OPENAI_API_KEY=your_openai_key
# ... etc
```

### Step 5: Install Dependencies & Deploy Rules

```bash
# Install Firebase
npm install firebase

# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
firebase init

# Deploy Firestore security rules and indexes
firebase deploy --only firestore

# Deploy Storage security rules
firebase deploy --only storage
```

### Step 6: Test Your Setup

1. Start your development server: `npm run dev`
2. Go to `/auth` in your browser
3. Test Google sign-in
4. Test email/password sign-up
5. Test guest mode

## 🔧 Detailed Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth Client ID**
5. Set application type as **"Web application"**
6. Add authorized redirect URIs:
   - `https://your-project-id.firebaseapp.com/__/auth/handler`
   - `http://localhost:3000` (for development)
7. Copy Client ID and Secret
8. In Firebase Console > Authentication > Sign-in method > Google
9. Paste the Client ID and Secret

### Anonymous Authentication

1. In Firebase Console > Authentication > Sign-in method
2. Find **"Anonymous"** provider
3. Toggle it **ON**
4. Save

## 📊 Data Migration (Optional)

If you have existing data in Supabase, you'll need to migrate it:

### Export from Supabase
```sql
-- Export users
COPY (SELECT * FROM users) TO '/tmp/users.csv' WITH CSV HEADER;

-- Export agents
COPY (SELECT * FROM agents) TO '/tmp/agents.csv' WITH CSV HEADER;

-- Export chats
COPY (SELECT * FROM chats) TO '/tmp/chats.csv' WITH CSV HEADER;

-- Export messages
COPY (SELECT * FROM messages) TO '/tmp/messages.csv' WITH CSV HEADER;
```

### Import to Firestore
Use the Firebase Admin SDK or create a custom import script to import your CSV data into Firestore collections.

## 🔒 Security Rules

The project includes pre-configured security rules:

- **Firestore**: Users can only access their own data
- **Storage**: Users can only upload/access their own files
- **Authentication**: Proper user isolation

## 🧪 Testing with Emulators (Development)

```bash
# Start Firebase emulators
firebase emulators:start

# Your app will automatically connect to emulators in development
```

Emulator UI will be available at: http://localhost:4000

## 📱 Real-time Features

Firebase automatically provides real-time updates. The app includes:

- Real-time chat messages
- Live user presence
- Instant agent updates
- Real-time typing indicators

## 🚀 Production Deployment

### Update Security Rules for Production

1. Review `firestore.rules` and `storage.rules`
2. Test thoroughly with your app
3. Deploy: `firebase deploy --only firestore,storage`

### Performance Optimization

1. **Indexes**: All necessary indexes are pre-configured
2. **Caching**: Firebase automatically caches frequently accessed data
3. **Offline Support**: Firebase provides offline capabilities out of the box

## 🔍 Monitoring & Analytics

1. Enable **Firebase Analytics** for user behavior tracking
2. Use **Firebase Performance Monitoring** for performance insights
3. Set up **Firebase Crashlytics** for error tracking

## 🆘 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check environment variables are correct
   - Verify OAuth redirect URIs
   - Check Firebase project permissions

2. **Database permission denied**
   - Verify Firestore security rules are deployed
   - Check user authentication status
   - Review console errors for specific rule violations

3. **Storage upload failures**
   - Check Storage security rules
   - Verify file size limits
   - Check CORS configuration

### Debug Mode

Enable debug logging:
```javascript
// Add to your Firebase config
firebase.firestore().enableLogging(true)
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)

## 🎉 Benefits of Firebase Migration

✅ **Real-time capabilities** - Instant updates across all clients  
✅ **Offline support** - Works without internet connection  
✅ **Automatic scaling** - Handles millions of users  
✅ **Built-in security** - Row-level security with custom rules  
✅ **File storage** - Integrated file upload and management  
✅ **Analytics** - Built-in user behavior tracking  
✅ **Performance** - Globally distributed CDN  
✅ **Cost-effective** - Pay only for what you use  

---

**Need help?** Check the troubleshooting section above or open an issue on GitHub.
