# 🚀 Installation Guide - Let's Get This Party Started!

> **Ready to run your own AI playground? This guide will get you up and running faster than you can say "artificial intelligence"!**

![Nexiloop Banner](../public/banner_cloud.jpg)

## 🎯 What You'll Need (The Essentials)

**Don't worry, it's easier than it looks:**

- 📦 **Node.js 18+** (the engine that powers everything)
- 📱 **npm or yarn** (your package manager bestie)  
- 🌐 **Git** (for cloning this beauty)
- � **Firebase project** (free tier works great!)
- 🔑 **AI API keys** (or run local models with Ollama)

## ⚡ Quick Start (5 Minutes to Success)

**Copy, paste, and you're done:**

```bash
# 1. Get the code
git clone https://github.com/mohameodo/agentai
cd agentai

# 2. Install the magic
npm install
# or if you're team yarn: yarn install

# 3. Set up your environment  
cp .env.example .env.local
# Edit .env.local with your API keys (see below)

# 4. Set up the database
# Set up Firebase (see FIREBASE_MIGRATION_GUIDE.md for details)
firebase deploy

# 5. Start the party!
npm run dev
```

**Boom! 💥** Open http://localhost:3000 and start chatting with AI!

## 🔑 Environment Setup (The Important Stuff)

**Create `.env.local` and add your keys:**

```bash
# � Firebase (Required - Get these from console.firebase.google.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key

# 🔐 Security (Required - Make this random and long)
CSRF_SECRET=your_super_secret_random_string_make_it_long

# 🤖 AI Models (Pick your favorites)
OPENAI_API_KEY=sk-your_openai_key                    # GPT-4, GPT-3.5
ANTHROPIC_API_KEY=your_anthropic_key                 # Claude 3.5 Sonnet  
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key         # Gemini Pro
MISTRAL_API_KEY=your_mistral_key                     # Mistral models
XAI_API_KEY=your_xai_key                            # Grok models
OPENROUTER_API_KEY=your_openrouter_key               # Access to many models

# 🎨 Image Generation (Optional but fun)
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account
CLOUDFLARE_API_TOKEN=your_cloudflare_token

# 🎬 Movie Search (Optional)
TMDB_API_KEY=your_tmdb_key

# 🔍 Search (Optional)
EXA_API_KEY=your_exa_key

# 🤖 Local Models (Optional - for privacy)
OLLAMA_BASE_URL=http://localhost:11434

# 🔧 Development (Optional)
GITHUB_TOKEN=your_github_token
ANALYZE=false
```

**Don't have all these keys?** No worries! Start with just Supabase and one AI provider.

## 🗄️ Database Setup (Super Important!)

**You need a database to store chats and users:**

### Option 1: Quick Setup (Recommended)
1. Go to [Supabase](https://supabase.com) and create a project
2. Copy your project URL and keys to `.env.local`
3. Go to SQL Editor in Supabase dashboard
4. Copy and paste the entire `sql/COMPLETE_DATABASE_SETUP.sql` file
5. Click "Run" and watch the magic happen! ✨

### Option 2: Step by Step
Check out our detailed [Database Setup Guide](DATABASE_SETUP_INSTRUCTIONS.md)

## 🔐 Authentication Setup (Get Users Signing In)

**Want people to create accounts?** 

1. **Enable providers** in Supabase Dashboard → Authentication → Providers
2. **Follow our guide:** [Auth Setup Guide](AUTH_SETUP_GUIDE.md)
3. **Supported methods:**
   - 📧 Email/Password
   - 🔴 Google OAuth  
   - ⚫ GitHub OAuth
   - 👤 Guest mode (no signup needed)

## 🐳 Docker Setup (For the Container Lovers)

**Prefer containers?** We got you covered!

```bash
# Development with hot reload
docker-compose -f docker/docker-compose.yml up -d

# With local AI models (Ollama)
docker-compose -f docker/docker-compose.ollama.yml up -d
```

Check out our [Docker Guide](../docker/README.md) for more options!

## 🤖 Local AI Models (Privacy First)

**Want to run AI models locally?** Set up Ollama:

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull some models
ollama pull llama3
ollama pull codellama
ollama pull mistral

# Set in .env.local
OLLAMA_BASE_URL=http://localhost:11434
```

Now you can use AI completely offline! 🔒

## 🚀 Deployment Options

### ☁️ Easy Cloud Deployment

**One-click deploy to:**

- **Vercel** (Recommended)
  ```bash
  npx vercel --prod
  ```

- **Railway**
  ```bash
  npx @railway/cli deploy
  ```

- **Netlify**
  ```bash
  npx netlify deploy --prod
  ```

### 🏠 Self-Hosted

**Run on your own server:**

```bash
# Build for production
npm run build

# Start the server
npm start

# Or use PM2 for process management
pm2 start ecosystem.config.js
```

## 🎨 Customization (Make It Yours)

**Want to customize the app?**

- 🎨 **Themes:** Edit `app/globals.css`
- 🤖 **Default agents:** Modify `sql/COMPLETE_DATABASE_SETUP.sql`
- 🔧 **Features:** Toggle features in `lib/config.ts`
- 🎭 **Branding:** Update logos in `public/`

## 🐛 Troubleshooting (When Things Go Wrong)

### Common Issues:

**🔴 "Supabase connection failed"**
```bash
# Check your .env.local file
# Make sure NEXT_PUBLIC_SUPABASE_URL and keys are correct
```

**🔴 "Database table doesn't exist"**
```bash
# Run the database setup SQL in Supabase dashboard
# Check sql/README.md for help
```

**🔴 "AI model not responding"**
```bash
# Check your API keys in .env.local
# Verify you have credits in your AI provider account
```

**🔴 "Port 3000 already in use"**
```bash
# Use a different port
npm run dev -- -p 3001
```

### Still Stuck?

- 📖 **Check the docs:** All guides in `docs/` folder
- 🐛 **Report a bug:** [GitHub Issues](https://github.com/mohameodo/agentai/issues)
- 💬 **Ask for help:** [GitHub Discussions](https://github.com/mohameodo/agentai/discussions)
- 📧 **Contact us:** hello@nexiloop.com

## 🎯 What's Next?

**Now that you're up and running:**

1. 🤖 **Create your first agent** in the Agents tab
2. 💬 **Start a conversation** with different AI models
3. 🎨 **Generate some images** in the image generation section
4. 🔧 **Explore CodeHat** for coding assistance
5. 🌟 **Share feedback** and help us improve!

---

**Made with 💜 by developers who actually use this stuff**

*Now go build something amazing! 🚀*

# Cloudflare Workers AI (for image generation)
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token

# Optional: Set the URL for production
# NEXT_PUBLIC_VERCEL_URL=your_production_url
```

A `.env.example` file is included in the repository for reference. Copy this file to `.env.local` and update the values with your credentials.

### Generating a CSRF Secret

The `CSRF_SECRET` is used to protect your application against Cross-Site Request Forgery attacks. You need to generate a secure random string for this value. Here are a few ways to generate one:

#### Using Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Using OpenSSL

```bash
openssl rand -hex 32
```

#### Using Python

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy the generated value and add it to your `.env.local` file as the `CSRF_SECRET` value.

### Setting Up Optional Features

#### Image Generation with Cloudflare Workers AI

Nexiloop supports AI image generation using Cloudflare Workers AI models. To enable this feature:

1. **Get Cloudflare Credentials**:
   - Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up)
   - Go to "My Profile" → "API Tokens"
   - Create a custom token with the following permissions:
     - Account: `Cloudflare Workers:Edit`
     - Zone Resources: `Include All zones`
   - Copy your Account ID from the right sidebar

2. **Add to Environment Variables**:
   ```bash
   CLOUDFLARE_ACCOUNT_ID=your_account_id_here
   CLOUDFLARE_API_TOKEN=your_api_token_here
   ```

3. **Run the Image Generation Schema** (see Database Schema section above)

#### Background Removal (Beta)

The background removal feature uses client-side AI processing and requires:

1. **Run the Background Removal Schema** (see Database Schema section above)
2. **Enable in Settings**: Users can toggle this feature in Settings → General → Model Preferences
3. **No additional API keys required** - processing happens locally in the browser

#### Google OAuth Authentication

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Find the "Google" provider
4. Enable it by toggling the switch
5. Configure the Google OAuth credentials:
   - You'll need to set up OAuth 2.0 credentials in the Google Cloud Console
   - Add your application's redirect URL: https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
   - Get the Client ID and Client Secret from Google Cloud Console
   - Add these credentials to the Google provider settings in Supabase

Here are the detailed steps to set up Google OAuth:

1. Go to the Google Cloud Console
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials > Create Credentials > OAuth Client ID
5. Configure the OAuth consent screen if you haven't already
6. Set the application type as "Web application"
7. Add these authorized redirect URIs:

- https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
- http://localhost:3000/auth/callback (for local development)

8. Copy the Client ID and Client Secret
9. Go back to your Supabase dashboard
10. Paste the Client ID and Client Secret in the Google provider settings
11. Save the changes

#### Guest user setup

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Toggle on "Allow anonymous sign-ins"

This allows users limited access to try the product before properly creating an account.

### Database Schema

Create the following tables in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY NOT NULL, -- Assuming the PK is from auth.users, typically not nullable
  email TEXT NOT NULL,
  anonymous BOOLEAN,
  daily_message_count INTEGER,
  daily_reset TIMESTAMPTZ,
  display_name TEXT,
  message_count INTEGER,
  preferred_model TEXT,
  premium BOOLEAN,
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  daily_pro_message_count INTEGER,
  daily_pro_reset TIMESTAMPTZ,
  system_prompt TEXT,
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE -- Explicit FK definition
);

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  avatar_url TEXT,
  system_prompt TEXT NOT NULL,
  model_preference TEXT,
  is_public BOOLEAN DEFAULT false NOT NULL,
  remixable BOOLEAN DEFAULT false NOT NULL,
  tools_enabled BOOLEAN DEFAULT false NOT NULL,
  example_inputs TEXT[],
  tags TEXT[],
  category TEXT,
  creator_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  tools TEXT[],
  max_steps INTEGER,
  mcp_config JSONB, -- Representing the object structure as JSONB
  CONSTRAINT agents_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL -- Changed to SET NULL based on schema, could also be CASCADE
);

-- Chats table
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT,
  model TEXT,
  system_prompt TEXT,
  agent_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  public BOOLEAN DEFAULT FALSE NOT NULL, -- Added NOT NULL based on TS type
  CONSTRAINT chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chats_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL -- Assuming SET NULL, adjust if needed
);

-- Messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY, -- Using SERIAL for auto-incrementing integer ID
  chat_id UUID NOT NULL,
  user_id UUID,
  content TEXT,
  role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant', 'data')), -- Added CHECK constraint
  experimental_attachments JSONB, -- Storing Attachment[] as JSONB
  parts JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat attachments table
CREATE TABLE chat_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL,
  user_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  file_size INTEGER, -- Assuming INTEGER for file size
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User keys table for BYOK (Bring Your Own Key) integration
CREATE TABLE user_keys (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  iv TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, provider)
);

-- RLS (Row Level Security) Reminder
-- Ensure RLS is enabled on these tables in your Supabase dashboard
-- and appropriate policies are created.
-- Example policies (adapt as needed):
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view their own data." ON users FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Users can update their own data." ON users FOR UPDATE USING (auth.uid() = id);
-- ... add policies for other tables (agents, chats, messages, etc.) ...
```

#### Optional: Image Generation Schema

For AI image generation features, run the image generation schema:

```sql
-- Image Generations tracking table
CREATE TABLE image_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  model TEXT NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT image_generations_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add RLS policies
ALTER TABLE image_generations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own image generations
CREATE POLICY "Users can view their own image generations" ON image_generations 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own image generations" ON image_generations 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for efficient daily usage queries
CREATE INDEX idx_image_generations_user_created ON image_generations(user_id, created_at);
```

#### Optional: Background Removal Schema

For AI background removal features, run the background removal schema:

```sql
-- Create user_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  background_removal_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add RLS policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only see their own preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_background_removal ON user_preferences(background_removal_enabled);
```

### Storage Setup

Create the buckets `chat-attachments` and `avatars` in your Supabase dashboard:

1. Go to Storage in your Supabase dashboard
2. Click "New bucket" and create two buckets: `chat-attachments` and `avatars`
3. Configure public access permissions for both buckets

#### Storage Policies

Add these RLS policies for the storage buckets:

```sql
-- Allow authenticated users to upload to chat-attachments
CREATE POLICY "Authenticated users can upload chat attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'chat-attachments' 
    AND auth.role() = 'authenticated'
  );

-- Allow users to read their own uploaded files
CREATE POLICY "Users can read their own chat attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'chat-attachments' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to chat attachments (optional, for sharing)
CREATE POLICY "Public read access to chat attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'chat-attachments');

-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

-- Allow public read access to avatars
CREATE POLICY "Public read access to avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
```

#### Agent Avatar Configuration

For agent profile pictures to work properly:

1. Create an `agents` folder inside your `avatars` bucket:

   - Navigate to the `avatars` bucket
   - Click "Create folder" and name it `agents`

2. Upload agent avatar images

3. Set up public access for the avatars bucket:
   - Go to "Configuration" tab for the `avatars` bucket
   - Under "Row Level Security (RLS)" ensure it's disabled or create a policy:
   ```sql
   CREATE POLICY "Public Read Access" ON storage.objects
   FOR SELECT USING (bucket_id = 'avatars');
   ```

## Ollama Setup (Local AI Models)

Ollama allows you to run AI models locally on your machine. Nexiloop has built-in support for Ollama with automatic model detection.

### Installing Ollama

#### macOS and Linux

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### Windows

Download and install from [ollama.ai](https://ollama.ai/download)

#### Docker

```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

### Setting up Models

After installing Ollama, you can download and run models:

```bash
# Popular models to get started
ollama pull llama3.2          # Meta's Llama 3.2 (3B)
ollama pull llama3.2:1b       # Smaller, faster version
ollama pull gemma2:2b         # Google's Gemma 2 (2B)
ollama pull qwen2.5:3b        # Alibaba's Qwen 2.5 (3B)
ollama pull phi3.5:3.8b       # Microsoft's Phi 3.5 (3.8B)

# Coding-focused models
ollama pull codellama:7b      # Meta's Code Llama
ollama pull deepseek-coder:6.7b # DeepSeek Coder

# List available models
ollama list

# Start the Ollama service (if not running)
ollama serve
```

### Nexiloop + Ollama Integration

Nexiloop automatically detects all models available in your Ollama installation. No additional configuration is needed!

**Features:**
- **Automatic Model Detection**: Nexiloop scans your Ollama instance and makes all models available
- **Intelligent Categorization**: Models are automatically categorized by family (Llama, Gemma, Qwen, etc.)
- **Smart Tagging**: Models get appropriate tags (local, open-source, coding, size-based)
- **No Pro Restrictions**: All Ollama models are free to use
- **Custom Endpoints**: Support for remote Ollama instances

### Configuration Options

#### Default Configuration
By default, Nexiloop connects to Ollama at `http://localhost:11434`. This works for local installations.

#### Custom Ollama URL
To use a remote Ollama instance or custom port:

```bash
# In your .env.local file
OLLAMA_BASE_URL=http://192.168.1.100:11434
```

#### Runtime Configuration
You can also set the Ollama URL at runtime:

```bash
OLLAMA_BASE_URL=http://your-ollama-server:11434 npm run dev
```

#### Settings UI
Nexiloop includes a settings interface where you can:
- Enable/disable Ollama integration
- Configure custom Ollama base URLs
- Add multiple Ollama instances
- Manage other AI providers

Access settings through the gear icon in the interface.

### Docker with Ollama

For a complete Docker setup with both Nexiloop and Ollama:

```bash
# Use the provided Docker Compose file
docker-compose -f docker-compose.ollama.yml up

# Or manually with separate containers
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
docker run -p 3000:3000 -e OLLAMA_BASE_URL=http://ollama:11434 nexiloop
```

The `docker-compose.ollama.yml` file includes:
- Ollama service with GPU support (if available)
- Automatic model pulling
- Health checks
- Proper networking between services

### Troubleshooting Ollama

#### Ollama not detected
1. Ensure Ollama is running: `ollama serve`
2. Check the URL: `curl http://localhost:11434/api/tags`
3. Verify firewall settings if using remote Ollama

#### Models not appearing
1. Refresh the models list in Nexiloop settings
2. Check Ollama has models: `ollama list`
3. Restart Nexiloop if models were added after startup

#### Performance optimization
1. Use smaller models for faster responses (1B-3B parameters)
2. Enable GPU acceleration if available
3. Adjust Ollama's `OLLAMA_NUM_PARALLEL` environment variable

### Recommended Models by Use Case

#### General Chat
- `llama3.2:3b` - Good balance of quality and speed
- `gemma2:2b` - Fast and efficient
- `qwen2.5:3b` - Excellent multilingual support

#### Coding
- `codellama:7b` - Specialized for code generation
- `deepseek-coder:6.7b` - Strong coding capabilities
- `phi3.5:3.8b` - Good for code explanation

#### Creative Writing
- `llama3.2:8b` - Better for creative tasks
- `mistral:7b` - Good instruction following

#### Fast Responses
- `llama3.2:1b` - Ultra-fast, basic capabilities
- `gemma2:2b` - Quick and capable

## Local Installation

### macOS / Linux

```bash
# Clone the repository
git clone https://github.com/ibelick/nexiloop.git
cd nexiloop

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Windows

```bash
# Clone the repository
git clone https://github.com/ibelick/nexiloop.git
cd nexiloop

# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Supabase Setup

Nexiloop requires Supabase for authentication and storage. Follow these steps to set up your Supabase project:

1. Create a new project at [Supabase](https://supabase.com)
2. Set up the database schema using the SQL script below
3. Create storage buckets for chat attachments
4. Configure authentication providers (Google OAuth)
5. Get your API keys and add them to your `.env.local` file

## Docker Installation

### Option 1: Single Container with Docker

Create a `Dockerfile` in the root of your project if that doesnt exist:

```dockerfile
# Base Node.js image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with clean slate
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy all project files
COPY . .

# Set Next.js telemetry to disabled
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache

# Copy necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Set environment variable for port
ENV PORT 3000
ENV HOSTNAME 0.0.0.0

# Health check to verify container is running properly
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "server.js"]
```

Build and run the Docker container:

```bash
# Build the Docker image
docker build -t nexiloop .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_supabase_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key \
  -e SUPABASE_SERVICE_ROLE=your_supabase_service_role_key \
  -e OPENAI_API_KEY=your_openai_api_key \
  -e MISTRAL_API_KEY=your_mistral_api_key \
  nexiloop
```

### Option 2: Docker Compose

Create a `docker-compose.yml` file in the root of your project:

```yaml
version: "3"

services:
  nexiloop:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE=${SUPABASE_SERVICE_ROLE}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - MISTRAL_API_KEY=${MISTRAL_API_KEY}
    restart: unless-stopped
```

Run with Docker Compose:

```bash
# Start the services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the services
docker-compose down
```

### Option 3: Docker Compose with Ollama (Recommended for Local AI)

For a complete setup with both Nexiloop and Ollama running locally, use the provided `docker-compose.ollama.yml`:

```bash
# Start both Nexiloop and Ollama services
docker-compose -f docker-compose.ollama.yml up -d

# View logs
docker-compose -f docker-compose.ollama.yml logs -f

# Stop the services
docker-compose -f docker-compose.ollama.yml down
```

This setup includes:
- **Ollama service** with GPU support (if available)
- **Automatic model pulling** (llama3.2:3b by default)
- **Health checks** for both services
- **Proper networking** between Nexiloop and Ollama
- **Volume persistence** for Ollama models

The Ollama service will be available at `http://localhost:11434` and Nexiloop will automatically detect all available models.

To customize which models are pulled, edit the `docker-compose.ollama.yml` file and modify the `OLLAMA_MODELS` environment variable:

```yaml
environment:
  - OLLAMA_MODELS=llama3.2:3b,gemma2:2b,qwen2.5:3b
```

## Production Deployment

### Deploy to Vercel

The easiest way to deploy Nexiloop is using Vercel:

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Import the project into Vercel
3. Configure your environment variables
4. Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Self-Hosted Production

For a self-hosted production environment, you'll need to build the application and run it:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Configuration Options

You can customize various aspects of Nexiloop by modifying the configuration files:

- `app/lib/config.ts`: Configure AI models, daily message limits, etc.
- `.env.local`: Set environment variables and API keys

## Troubleshooting

### Common Issues

1. **Connection to Supabase fails**

   - Check your Supabase URL and API keys
   - Ensure your IP address is allowed in Supabase

2. **AI models not responding**

   - Verify your API keys for OpenAI/Mistral
   - Check that the models specified in config are available

3. **Docker container exits immediately**
   - Check logs using `docker logs <container_id>`
   - Ensure all required environment variables are set

## Community and Support

- GitHub Issues: Report bugs or request features
- GitHub Discussions: Ask questions and share ideas

## License

Apache License 2.0
