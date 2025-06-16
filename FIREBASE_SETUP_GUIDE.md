# Firebase Setup and Troubleshooting Guide

## Fix "Missing or insufficient permissions" Error for Curated Agents

### Quick Fix

1. **Set up your environment variables** (if not already done):
   ```bash
   # Add these to your .env.local file
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

2. **Seed the curated agents**:
   ```bash
   npm run seed:agents
   ```

3. **Deploy the updated Firestore rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### What This Fixes

- ✅ Creates the missing "blog-draft" curated agent
- ✅ Updates Firestore rules to allow reading curated agents
- ✅ Improves error handling for missing agents
- ✅ Ensures chat history loads properly on all pages
- ✅ Fixes agent and model persistence across sessions

### Verification

After running the setup:

1. Visit your app and check the agents page
2. You should see the "Blog Draft Writer" agent
3. No more "Missing or insufficient permissions" errors
4. Chat history should load properly
5. Selected agents and models should persist across page reloads

### Troubleshooting

If you still see errors:

1. **Check Firebase Authentication**: Make sure you're signed in
2. **Verify Firestore Rules**: Ensure rules are deployed properly
3. **Check Console**: Look for specific error messages in browser console
4. **Firebase Emulator**: If using emulator, make sure it's running with the right data

### Database Structure

The curated agents are stored in Firestore with this structure:

```
/agents/{agentId}
├── id: "blog-draft"
├── slug: "blog-draft"
├── name: "Blog Draft Writer"
├── is_public: true
├── is_curated: true
├── creator_id: "system"
└── ... other fields
```

### Chat History Structure

Chats are stored with complete history:

```
/chats/{chatId}
├── user_id: "user123"
├── model: "gpt-4o-mini"
├── agent_id: "blog-draft" (optional)
├── title: "Chat Title"
├── created_at: timestamp
└── updated_at: timestamp

/messages/{messageId}
├── chat_id: "chatId"
├── role: "user" | "assistant"
├── content: "message content"
├── user_id: "user123"
└── created_at: timestamp
```

## Additional Features Fixed

1. **Real-time Model Sync**: Model preferences sync across devices
2. **Agent Persistence**: Selected agents are saved with chat sessions
3. **Better Error Handling**: Graceful fallbacks for missing data
4. **Cross-page Loading**: Chat history loads on all pages (including CodeHat, public shares, etc.)
5. **Improved Firestore Rules**: Better permissions for public and curated agents
