# Nexiloop AI - Documentation

[ai.nexiloop.com](https://ai.nexiloop.com)

**Nexiloop AI** is the open-source interface for AI chat with agents, custom models, and advanced features.

[![Chat with this repo](https://ai.nexiloop.com/button/github.svg)](https://ai.nexiloop.com/?agent=github/mohameodo/agentai)

![Nexiloop AI screenshot](../public/nl.png)

## Features

- **Multi-model support**: OpenAI, Mistral, Claude, Gemini, **Ollama (local models)**, **Cloudflare Workers AI**
- **🧠 Think Mode**: Enhanced reasoning with AI thinking animation for supported models
- **🎨 Integrated Image Generation**: 
  - Natural language image generation directly in chat
  - Simply type "generate image of a sunset" or "create a picture of a cat"
  - 9 Cloudflare Workers AI image models (FLUX.1 Schnell, SDXL Lightning, Ideogram v2 Turbo, etc.)
  - Completely free with daily usage limits (5 images/day)
  - Configurable preferred image model in settings
- **✂️ AI Background Removal** (Beta):
  - Remove backgrounds from uploaded images instantly
  - AI-powered background removal using @imgly/background-removal
  - One-click processing with smooth animations
  - Auto-download processed images as PNG
  - Enable/disable in Settings → Model Preferences
- **Smart Chat Integration**: Auto-detects image generation requests in natural conversation
- File uploads with context-aware answers
- Clean, responsive UI with light/dark themes
- Built with Tailwind, shadcn/ui, and prompt-kit
- Fully open-source and self-hostable
- Customizable: user system prompt, multiple layout options, preferred image models
- **Local AI with Ollama**: Run models locally with automatic model detection

## Agent Features (WIP)

- `@agent` mentions
- Early tool and MCP integration for agent workflows
- Foundation for more powerful, customizable agents (more coming soon)

## Quick Start

### Option 1: With OpenAI (Cloud)

```bash
git clone https://github.com/mohameodo/agentai.git
cd agentai
npm install
echo "OPENAI_API_KEY=your-key" > .env.local
npm run dev
```

### Option 2: With Ollama (Local)

```bash
# Install and start Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2  # or any model you prefer

# Clone and run Nexiloop AI
git clone https://github.com/mohameodo/agentai.git
cd agentai
npm install
npm run dev
```

Nexiloop AI will automatically detect your local Ollama models!

### Option 3: Docker with Ollama

```bash
git clone https://github.com/mohameodo/agentai.git
cd agentai
docker-compose -f docker/docker-compose.ollama.yml up
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mohameodo/agentai)

To unlock features like auth, file uploads, agents, and background removal, see [INSTALL.md](./INSTALL.md).

## CodeHat Workspace

CodeHat generates files and runs commands inside a local workspace.
By default the workspace root is the project directory, but you can
override it with the `WORKSPACE_ROOT` environment variable:

```bash
WORKSPACE_ROOT=/path/to/workspace npm run dev
```

All projects are saved under `codehat-projects` inside this workspace
and the interactive terminal operates from that directory.

## Image Generation

nexiloop includes integrated AI image generation powered by Cloudflare Workers AI:

### Features
- **Natural Language**: Simply type "generate image of a sunset" or "create a picture of a cat" in any chat
- **Multiple Models**: Choose from 9+ high-quality image models (FLUX.1 Schnell, SDXL Lightning, Ideogram v2, etc.)
- **Daily Limits**: 5 free image generations per day for all users
- **Inline Results**: Generated images appear directly in your chat conversation
- **Model Selection**: Configure your preferred image model in Settings → General → Model Preferences

### Supported Models
- **FLUX.1 Schnell** - Ultra-fast, exceptional quality (default)
- **SDXL Lightning** - Lightning-fast 1024px images  
- **Ideogram v2 Turbo** - Excellent text rendering
- **Stable Diffusion XL** - High-quality, versatile generation
- **DreamShaper 8** - Artistic and creative styles
- **OpenJourney v4** - Midjourney-style artistic generation
- **Hunyuan DiT** - High-quality transformer-based generation

### Setup
Add your Cloudflare credentials to `.env.local`:
```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

### Usage Examples
- "generate image of a futuristic city"
- "create a picture of a golden retriever in a park"  
- "make an illustration of a space station"
- "draw a painting of mountains at sunset"
- "show me a visualization of neural networks"
- "remove the background from this image" (when uploading images)

### Setup
Add your Cloudflare credentials to enable image generation:
```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

## Think Mode

nexiloop includes an enhanced **Think Mode** that triggers deeper reasoning for compatible AI models with visual thinking animations.

### Features
- **Enhanced Reasoning**: Prompts AI models to think step by step through complex problems
- **Visual Feedback**: Beautiful animated thinking indicators while the AI processes
- **Model Detection**: Automatically works with reasoning-capable models (o1, o3, DeepSeek R1, etc.)
- **One-Click Toggle**: Simply click the "Think" button in the chat input
- **Reasoning Display**: Shows collapsible AI reasoning steps when available

### Supported Models
- **OpenAI o1** - Advanced reasoning model for complex problems
- **OpenAI o3-mini** - Efficient reasoning model
- **OpenAI o1-mini** - Compact reasoning model
- **DeepSeek R1** - Open-source reasoning model
- **DeepSeek V3** - Advanced reasoning capabilities
- Any model with "reasoning" in its description

### How to Use Think Mode

#### Enable Think Mode
1. Start typing your message in the chat input
2. Click the **"Think"** button (🧠 icon) next to the send button
3. The button will turn pink/highlighted when active
4. Send your message - the AI will engage enhanced reasoning mode

#### What Happens in Think Mode
- AI receives enhanced system prompt encouraging step-by-step thinking
- Visual thinking animation appears while processing (for reasoning models)
- AI provides more thorough, well-reasoned responses
- Reasoning steps may be displayed in a collapsible section

#### Best Use Cases
- **Complex Problem Solving**: Math problems, logic puzzles, multi-step analysis
- **Research Questions**: Thorough investigation of topics requiring deep thinking
- **Code Analysis**: Detailed code review and optimization suggestions
- **Decision Making**: Weighing pros and cons of different options
- **Creative Writing**: Thoughtful plot development and character analysis

### Example Usage
```
User: [Clicks Think button] How should I approach learning machine learning as a beginner?

AI: [Thinking animation appears] 
Let me think through this step by step...

[Reasoning steps shown in collapsible section]
1. First, I should consider the user's background...
2. Then evaluate different learning paths...
3. Consider practical vs theoretical approaches...

[Final comprehensive response with structured learning plan]
```

## Background Removal (Beta)

nexiloop includes AI-powered background removal for uploaded images using advanced machine learning models.

### Features
- **Instant Processing**: Remove backgrounds from images with one click
- **AI-Powered**: Uses state-of-the-art neural networks for precise background detection
- **High Quality**: Preserves fine details like hair, fur, and complex edges
- **Batch Support**: Process multiple images in your file uploads
- **Auto-Download**: Processed images automatically download as PNG with transparency
- **Smart Integration**: Appears automatically when you upload images (if enabled)

### How to Use

#### Enable Background Removal
1. Go to **Settings** → **General** → **Model Preferences**
2. Toggle **Background Removal** to **ON** (marked as Beta)
3. The feature will now appear when you upload images

#### Process Images
1. **Upload an Image**: Click the **+** button or drag and drop images into chat
2. **Remove Background**: Click the **"Remove BG"** button that appears below image uploads
3. **Download**: The processed image will automatically download to your device

#### Supported Formats
- **Input**: JPEG, PNG, WEBP, GIF, HEIC, HEIF
- **Output**: PNG with transparent background

### Technical Details
- **Model**: Uses ISNET FP16 for optimal balance of speed and quality
- **Processing**: Client-side processing (no data sent to external servers)
- **Performance**: Optimized for CPU processing with optional GPU acceleration
- **Privacy**: All processing happens locally in your browser

### Usage Examples
- Remove backgrounds from profile photos
- Create transparent product images for websites
- Prepare images for presentations or design work
- Extract subjects from complex backgrounds
- Create cutout effects for creative projects

### Database Setup
If you're self-hosting, run the background removal schema:

```sql
-- Run this in your Supabase SQL editor or database
-- See BACKGROUND_REMOVAL_SCHEMA.sql for the complete setup
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  background_removal_enabled BOOLEAN DEFAULT false,
  -- ... other columns
);
```

### Troubleshooting
- **Slow Processing**: Try smaller images (< 2MB) for faster results
- **Poor Quality**: Works best with clear subject-background separation
- **Browser Issues**: Requires modern browser with WebAssembly support
- **Memory Errors**: Close other tabs if processing fails on large images

## Movie Search & Streaming with vlop.fun

nexiloop includes intelligent movie and TV show search powered by TMDB (The Movie Database) with direct streaming links to vlop.fun.

### Features
- **Smart Detection**: Automatically detects movie-related queries in your conversations
- **TMDB Integration**: Access comprehensive movie and TV show database
- **vlop.fun Streaming**: One-click streaming for found content
- **User Control**: Toggle streaming features on/off in settings
- **Rich Results**: Movie posters, ratings, descriptions, cast, and more

### How to Use

#### Enable Movie Search
1. Go to **Settings** → **General** → **Features**
2. Toggle **Video Streaming & Movie Search** to **ON**
3. The feature is now enabled for movie-related queries

#### Search for Movies/Shows
Simply ask natural questions in chat:
- "What are some good sci-fi movies?"
- "Find information about Inception"
- "Show me popular thriller series"
- "Recommend movies like The Matrix"
- "What movies are trending this week?"

#### Stream Content
1. **Ask for movies**: Use any of the example queries above
2. **Browse results**: nexiloop will show movie cards with details
3. **Click "Watch on vlop.fun"**: Direct streaming link opens in new tab
4. **Enjoy**: Stream content directly through vlop.fun

### Supported Queries
- **Movie recommendations**: "What are good action movies?"
- **Specific searches**: "Tell me about Avatar 2"
- **Genre searches**: "Best horror movies 2023"
- **Actor/director searches**: "Movies with Tom Hanks"
- **TV shows**: "Popular Netflix series"
- **Trending content**: "What's trending on Netflix?"

### Setup TMDB Integration

#### Get TMDB API Key
1. Visit [TMDB API](https://www.themoviedb.org/settings/api)
2. Create a free account and request an API key
3. Add to your `.env.local`:

```bash
TMDB_API_KEY=your_tmdb_api_key_here
```

#### Database Setup
Run the TMDB schema in your Supabase database:

```sql
-- Run this in your Supabase SQL editor
-- See MOVIE_TMDB_SCHEMA.pgsql for the complete setup

-- Movie search history
CREATE TABLE IF NOT EXISTS movie_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    search_query TEXT NOT NULL,
    search_type VARCHAR(20) DEFAULT 'movie' CHECK (search_type IN ('movie', 'tv', 'multi')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User movie preferences
CREATE TABLE IF NOT EXISTS user_movie_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    preferred_genres TEXT[] DEFAULT '{}',
    streaming_enabled BOOLEAN DEFAULT true,
    vlop_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tmdb_id INTEGER NOT NULL,
    media_type VARCHAR(10) DEFAULT 'movie' CHECK (media_type IN ('movie', 'tv')),
    title TEXT NOT NULL,
    poster_path TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Privacy & Settings
- **Toggle Control**: Enable/disable movie search in Settings
- **vlop.fun Links**: Only appear when streaming is enabled and movies are mentioned
- **Search History**: Optionally stored for better recommendations (can be disabled)
- **No Tracking**: Movie searches are not shared with third parties

### Troubleshooting
- **No movie results**: Check that TMDB_API_KEY is set correctly
- **vlop.fun not showing**: Ensure "Video Streaming" is enabled in Settings
- **API limits**: TMDB free tier has rate limits (check your usage)
- **Search not working**: Try more specific movie/show names

### Technical Details
- **TMDB API**: Uses TMDB v3 API for movie data
- **vlop.fun Integration**: Generates streaming URLs automatically
- **Smart Detection**: Uses keyword matching to detect movie queries
- **Rate Limiting**: Respects TMDB API rate limits
- **Caching**: Search results cached to improve performance

## 🗄️ Database Setup

nexiloop uses Supabase for authentication, user management, and agent storage. All SQL files are organized in the `/sql` folder.

### Quick Database Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Go to SQL Editor** in your Supabase dashboard
3. **Choose your setup method:**

#### ✅ **Recommended: Complete Fresh Setup**
```sql
-- Copy and paste sql/FIXED_COMPLETE_DATABASE_SETUP.sql
-- This creates all tables, indexes, policies, and curated agents
-- Works with all PostgreSQL versions (no extension issues)
```

#### ⚡ **Quick Fix: For Existing Databases**
```sql
-- Copy and paste sql/IMMEDIATE_FIX_NO_EXTENSIONS.sql  
-- Adds missing columns to existing tables safely
-- Includes the required "blog-draft" agent
```

4. **Click "Run"** and your database is ready! 🎉

### What's Included
- **Complete user system** with authentication support
- **Agent management** with all required fields
- **Chat and message storage** with proper relationships
- **Row Level Security** policies for data protection
- **Performance indexes** and constraints
- **4 curated agents**: General Assistant, Code Helper, Writing Assistant, Blog Draft Writer

### Authentication Setup
The database supports multiple authentication methods:
- **Google OAuth** - Sign in with Google
- **GitHub OAuth** - Sign in with GitHub  
- **Email/Password** - Traditional authentication
- **Guest mode** - Limited functionality without signup

For detailed OAuth setup instructions, see `AUTH_SETUP_GUIDE.md`.

### Environment Variables
Add these to your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
```

📂 **All SQL files and detailed instructions are in the `/sql` folder**

## Built with

- [prompt-kit](https://prompt-kit.com/) — AI components
- [shadcn/ui](https://ui.shadcn.com) — core components
- [motion-primitives](https://motion-primitives.com) — animated components
- [vercel ai sdk](https://vercel.com/blog/introducing-the-vercel-ai-sdk) — model integration, AI features
- [supabase](https://supabase.com) — auth and storage

## Project Structure

Nexiloop AI is now organized into clear, focused directories:

- **`/app`** - Next.js 13+ app directory with pages and API routes
- **`/components`** - Reusable React components and UI elements
- **`/lib`** - Core libraries, utilities, and business logic
- **`/docs`** - All documentation (README, guides, setup instructions)
- **`/sql`** - Database schemas, migrations, and setup scripts
- **`/docker`** - Docker configuration and container setup
- **`/scripts`** - Shell scripts for testing and automation
- **`/.github`** - GitHub templates and workflows

Each folder includes its own README with specific setup instructions and usage details.

## Sponsors

<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>

## License

Apache License 2.0

## Notes

This is a beta release. The codebase is evolving and may change.
