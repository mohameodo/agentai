#!/usr/bin/env node

/**
 * Script to seed curated agents in Firebase Firestore
 * This solves the "Missing or insufficient permissions" error for curated agents
 */

// Try to load environment variables from .env file
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, that's fine
  console.log('Note: dotenv not found, using environment variables directly');
}

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Load environment variables from .env.local if available
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const curatedAgents = [
  {
    id: "blog-draft",
    slug: "blog-draft",
    name: "Blog Draft Writer",
    description: "Expert AI assistant for creating engaging blog drafts and content outlines",
    system_prompt: `You are a professional blog writer and content strategist. You specialize in creating compelling blog drafts, content outlines, and engaging articles.

Your expertise includes:
- Writing engaging headlines and introductions
- Creating well-structured content outlines
- Developing clear, readable prose
- Optimizing for readability and engagement
- Understanding SEO best practices
- Adapting tone and style for different audiences

When helping users:
1. Ask clarifying questions about their target audience, goals, and topic
2. Provide structured, actionable content
3. Offer multiple options when appropriate
4. Include practical tips and examples
5. Focus on creating value for readers

Always aim to create content that is informative, engaging, and well-organized.`,
    creator_id: "system",
    creator_name: "Nexiloop",
    avatar_url: null,
    is_public: true,
    is_curated: true,
    remixable: true,
    tools_enabled: false,
    example_inputs: [
      "Write a blog about AI trends in 2024",
      "Create a content outline for productivity tips",
      "Draft an article about sustainable living",
      "Help me write an engaging introduction for my blog post"
    ],
    tags: ["writing", "blogging", "content", "marketing"],
    category: "Writing",
    model_preference: null,
    max_steps: 5,
    mcp_config: null,
    tools: []
  }
];

async function seedCuratedAgents() {
  console.log('Starting to seed curated agents...');
  
  try {
    for (const agent of curatedAgents) {
      const agentRef = doc(db, 'agents', agent.id);
      await setDoc(agentRef, {
        ...agent,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      console.log(`✅ Created curated agent: ${agent.name} (${agent.slug})`);
    }
    
    console.log('🎉 Successfully seeded all curated agents!');
    console.log('');
    console.log('You can now:');
    console.log('1. Restart your development server');
    console.log('2. Check that curated agents appear on the agents page');
    console.log('3. Verify the "Missing or insufficient permissions" error is resolved');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding curated agents:', error);
    console.log('');
    console.log('If you see a permissions error, make sure:');
    console.log('1. Your Firebase project has Firestore enabled');
    console.log('2. Your Firestore security rules allow writing to the agents collection');
    console.log('3. You have proper authentication set up');
    process.exit(1);
  }
}

// Check if Firebase config is available
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Firebase configuration is missing. Please set your environment variables.');
  console.log('');
  console.log('Create a .env.local file in your project root with:');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
  console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket');
  console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id');
  console.log('NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id');
  console.log('');
  console.log('You can find these values in your Firebase project settings.');
  process.exit(1);
}

seedCuratedAgents();
