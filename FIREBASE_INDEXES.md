# Firebase Firestore Indexes

This document lists all the required Firestore indexes for the AI Assistant application to function properly.

> **✅ Already Configured**: These indexes are already configured in the `firestore.indexes.json` file in this project. Simply run `firebase deploy --only firestore:indexes` to deploy them to your Firebase project.

## Required Indexes

### 1. Agents Collection

#### Index 1: Public Agents Query
```
Collection: agents
Fields:
  - is_public (Ascending)
  - created_at (Descending)
```
**Purpose**: For browsing public agents sorted by creation date

#### Index 2: User Agents Query
```
Collection: agents
Fields:
  - creator_id (Ascending)
  - created_at (Descending)
```
**Purpose**: For fetching user's own agents sorted by creation date

#### Index 3: Curated Agents Query
```
Collection: agents
Fields:
  - slug (Ascending)
```
**Purpose**: For fetching specific curated agents by slug

#### Index 4: Public Agents Search
```
Collection: agents
Fields:
  - is_public (Ascending)
  - name (Ascending)
```
**Purpose**: For searching public agents by name

### 2. Chats Collection

#### Index 1: User Chats Query
```
Collection: chats
Fields:
  - user_id (Ascending)
  - updated_at (Descending)
```
**Purpose**: For fetching user's chats sorted by last update

#### Index 2: User Chats with Agent Filter
```
Collection: chats
Fields:
  - user_id (Ascending)
  - agent_id (Ascending)
  - updated_at (Descending)
```
**Purpose**: For fetching user's chats with specific agent

### 3. Messages Collection

#### Index 1: Chat Messages Query
```
Collection: messages
Fields:
  - chat_id (Ascending)
  - created_at (Ascending)
```
**Purpose**: For fetching messages in a chat sorted by creation time

#### Index 2: User Messages Query
```
Collection: messages
Fields:
  - user_id (Ascending)
  - created_at (Descending)
```
**Purpose**: For fetching user's message history

### 4. User Keys Collection

#### Index 1: User API Keys Query
```
Collection: user_keys
Fields:
  - user_id (Ascending)
  - provider (Ascending)
```
**Purpose**: For fetching user's API keys by provider

### 5. Users Collection

#### Index 1: User Lookup
```
Collection: users
Fields:
  - email (Ascending)
```
**Purpose**: For user authentication and lookup by email

#### Index 2: Anonymous Users
```
Collection: users
Fields:
  - anonymous (Ascending)
  - created_at (Descending)
```
**Purpose**: For managing anonymous/guest users

## How to Deploy These Indexes

### Option 1: Firebase CLI (Recommended)

The indexes are already configured in your `firestore.indexes.json` file. To deploy them:

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done already)
firebase init firestore

# Deploy the indexes
firebase deploy --only firestore:indexes
```

### Option 2: Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Click on "Indexes" tab
5. Click "Create Index"
6. Add each index according to the specifications above

### Option 3: Manual Configuration

You can also create these indexes using the Firebase CLI by updating your `firestore.indexes.json` file (already done in this project):

```json
{
  "indexes": [
    {
      "collectionGroup": "agents",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "is_public",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "created_at",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "agents",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "creator_id",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "created_at",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "chats",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "user_id",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updated_at",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "chats",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "user_id",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "agent_id",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updated_at",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "chat_id",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "created_at",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "user_id",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "created_at",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "user_keys",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "user_id",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "provider",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Then deploy with:
```bash
firebase deploy --only firestore:indexes
```

## Performance Notes

1. **Single Field Indexes**: Firestore automatically creates single-field indexes, so you don't need to manually create them.

2. **Composite Indexes**: The indexes listed above are composite indexes that combine multiple fields.

3. **Index Exemptions**: Some simple queries may work without custom indexes if they only use single fields or automatic indexes.

4. **Monitoring**: Use the Firebase Console to monitor index usage and performance.

## Troubleshooting

If you see errors like "The query requires an index", check the error message for the specific index requirements and create the missing index in the Firebase Console.

## Cost Considerations

- Indexes consume storage space
- Each write operation updates relevant indexes
- More indexes = higher costs but better query performance
- Remove unused indexes to optimize costs

## Security Rules

Ensure your Firestore security rules complement these indexes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Agents rules
    match /agents/{agentId} {
      allow read: if resource.data.is_public == true || request.auth.uid == resource.data.creator_id;
      allow create, update, delete: if request.auth.uid == resource.data.creator_id;
    }
    
    // Chats rules
    match /chats/{chatId} {
      allow read, write: if request.auth.uid == resource.data.user_id;
    }
    
    // Messages rules
    match /messages/{messageId} {
      allow read, write: if request.auth.uid == resource.data.user_id;
    }
    
    // User keys rules
    match /user_keys/{keyId} {
      allow read, write: if request.auth.uid == resource.data.user_id;
    }
    
    // Users rules
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

This security rules setup ensures that:
- Public agents are readable by anyone
- Users can only access their own data
- Agents can only be modified by their creators
- API keys are private to each user
