# Nexiloop AI Template - Complete Setup Guide

This template provides everything you need to build a modern AI chat application. Follow this guide to get up and running quickly!

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [AI Provider Setup](#ai-provider-setup)
5. [Authentication Setup](#authentication-setup)
6. [Deployment](#deployment)
7. [Customization](#customization)
8. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Git installed
- A Supabase account (free)
- At least one AI provider API key

### 1. Create from Template

```bash
# Using GitHub CLI
gh repo create my-ai-app --template mohameodo/nexiloop-ai-template
cd my-ai-app

# Or clone directly
git clone https://github.com/mohameodo/nexiloop-ai-template.git my-ai-app
cd my-ai-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see below for details).

### 4. Database Setup

```bash
# This will create all necessary tables
npm run db:setup
```

### 5. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 🔧 Environment Setup

### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# At least one AI provider is required
OPENAI_API_KEY=sk-your-openai-key
```

### Optional Variables

```env
# Additional AI Providers
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-key
MISTRAL_API_KEY=your-mistral-key
XAI_API_KEY=your-xai-key
OPENROUTER_API_KEY=your-openrouter-key

# Features
NEXT_PUBLIC_ENABLE_IMAGE_GENERATION=true
NEXT_PUBLIC_ENABLE_CODE_EXECUTION=true

# Optional Security
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## 🗄️ Database Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your URL and keys
3. Run the database setup:

```bash
# Option 1: Use the setup script (recommended)
npm run db:setup

# Option 2: Manual setup via Supabase dashboard
# Copy and run the SQL from sql/COMPLETE_AGENTS_SCHEMA.sql
```

### Database Schema

The template includes a complete schema with:
- User management and preferences
- AI agents and conversations
- Chat history and sessions  
- Model configurations
- Authentication integration

## 🤖 AI Provider Setup

### OpenAI
1. Get API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Add to `.env.local`: `OPENAI_API_KEY=sk-...`

### Anthropic (Claude)
1. Get API key from [console.anthropic.com](https://console.anthropic.com/)
2. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`

### Google AI (Gemini)
1. Get API key from [makersuite.google.com](https://makersuite.google.com/app/apikey)
2. Add to `.env.local`: `GOOGLE_GENERATIVE_AI_API_KEY=...`

### OpenRouter (200+ Models)
1. Get API key from [openrouter.ai](https://openrouter.ai/keys)
2. Add to `.env.local`: `OPENROUTER_API_KEY=sk-or-...`

## 🔐 Authentication Setup

Authentication is handled by Supabase and works out of the box with:

### Supported Providers
- ✅ **Email/Password** - Built-in
- ✅ **Google OAuth** - No extra setup needed
- ✅ **GitHub OAuth** - No extra setup needed

### Custom OAuth Setup (Optional)

If you want to customize OAuth providers:

1. Go to Supabase Dashboard → Authentication → Providers
2. Configure your preferred providers
3. Add redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Don't forget to add your environment variables in the Vercel dashboard!

### Docker

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run
```

### Manual Deployment

The app works with any Node.js hosting:
- Railway
- Render  
- DigitalOcean App Platform
- AWS/GCP/Azure

## 🎨 Customization

### Branding

1. Update `app/layout.tsx` - App name and metadata
2. Replace logos in `public/` folder
3. Customize colors in `app/globals.css`
4. Update `components.json` for theme configuration

### Features

Enable/disable features in your `.env.local`:

```env
NEXT_PUBLIC_ENABLE_IMAGE_GENERATION=true
NEXT_PUBLIC_ENABLE_CODE_EXECUTION=true
NEXT_PUBLIC_ENABLE_THINK_MODE=true
```

### AI Models

Add new models in `lib/models/models.ts`:

```typescript
export const customModels = [
  {
    id: 'my-custom-model',
    name: 'My Custom Model',
    provider: 'custom',
    // ... configuration
  }
]
```

## 🔧 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear Next.js cache
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Database Connection Issues**
- Check your Supabase URL and keys
- Ensure database schema is set up correctly
- Check network connectivity

**AI API Errors**
- Verify API keys are correct
- Check API rate limits
- Ensure models are available in your region

**Authentication Issues**
- Check Supabase auth configuration
- Verify redirect URLs
- Clear browser cache/cookies

### Getting Help

- 📚 [Documentation](README.md)
- 🐛 [Report Issues](https://github.com/mohameodo/nexiloop-ai-template/issues)
- 💬 [Discussions](https://github.com/mohameodo/nexiloop-ai-template/discussions)
- 📧 Email: support@nexiloop.ai (if available)

### Debug Mode

Enable detailed logging:

```env
NODE_ENV=development
DEBUG=true
```

## 📱 Mobile Development

The app is fully responsive, but for native mobile:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize
npx cap init

# Add platforms
npx cap add ios
npx cap add android
```

---

**You're all set!** 🎉 Start building your AI application and make it your own!

Need help? Check out our [Contributing Guide](CONTRIBUTING.md) or open an issue.
