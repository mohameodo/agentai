# Nexiloop AI Template

![Nexiloop AI Banner](https://github.com/user-attachments/assets/banner-image)

**🚀 Complete AI Chat Application Template - Production Ready!**

A modern, full-stack AI chat application with multiple AI models, custom agents, built-in code editor, and beautiful UI. Perfect for developers who want to build the next generation of AI-powered applications.

## ✨ What You Get Out of the Box

- **🤖 Multiple AI Models** - GPT-4, Claude, Gemini, Mistral, and more
- **👥 Custom AI Agents** - Create specialized AI assistants 
- **💻 Built-in Code Editor** - Monaco-based editor with syntax highlighting
- **🧠 Think Mode** - Step-by-step AI reasoning visualization
- **🎨 Image Generation** - AI-powered image creation
- **🔐 Multi-Auth** - Google, GitHub, and email authentication
- **💾 Database Ready** - Supabase integration with complete schema
- **🐳 Docker Support** - Container-ready deployment
- **📱 Responsive Design** - Works perfectly on all devices
- **⚡ Fast & Modern** - Next.js 15, React 19, TypeScript, Tailwind CSS

## 🚀 Quick Start

### 1. Use This Template
Click the "Use this template" button above or:

```bash
gh repo create my-ai-app --template mohameodo/nexiloop-ai-template
cd my-ai-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 4. Set Up Database
```bash
# Run the setup script to create all tables
npm run db:setup
```

### 5. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` and start building! 🎉

## 🛠 Configuration

### Required Environment Variables

```env
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Model APIs (add the ones you want to use)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
```

### Optional APIs
- **OpenRouter** - Access to 200+ models
- **Mistral AI** - European AI models
- **xAI (Grok)** - Elon's AI models
- **Image Generation** - DALL-E, Midjourney, etc.

## 📁 Project Structure

```
nexiloop-ai/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── agents/            # AI agents management
│   └── components/        # Page components
├── components/            # Reusable UI components
├── lib/                   # Core utilities and logic
├── sql/                   # Database schema and migrations
├── docker/                # Docker configuration
├── docs/                  # Documentation
└── scripts/               # Build and deployment scripts
```

## 🎨 Customization

### Theme & Styling
- Built with **Tailwind CSS** and **shadcn/ui**
- Dark/light mode support
- Fully customizable design system
- Modern glass-morphism effects

### AI Models
- Easy to add new AI providers
- Configurable model parameters
- Custom prompt templates
- Model switching without reload

### Custom Agents
- Create specialized AI assistants
- Custom instructions and behavior
- Tool integration support
- Agent marketplace (coming soon)

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Docker
```bash
npm run docker:build
npm run docker:run
```

### Manual Deployment
Works with any Node.js hosting platform:
- Railway
- Render
- DigitalOcean
- AWS/GCP/Azure

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
npm run db:setup     # Set up database
```

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth (Google, GitHub, Email)
- **AI**: Multiple providers via AI SDK
- **Deployment**: Vercel, Docker

## 🤝 Contributing

We love contributions! Check out our [Contributing Guide](docs/CONTRIBUTING.md) to get started.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 🐛 Issues & Support

- 🐞 **Bug Reports**: Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- 💡 **Feature Requests**: Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- ❓ **Questions**: Use our [question template](.github/ISSUE_TEMPLATE/question.md)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built with love using these amazing tools:
- [Next.js](https://nextjs.org) - The React framework
- [Supabase](https://supabase.com) - Backend-as-a-Service
- [AI SDK](https://sdk.vercel.ai) - AI integration library
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS

---

**Ready to build the next generation of AI applications?** 🚀

[Use This Template](https://github.com/mohameodo/nexiloop-ai-template/generate) | [Live Demo](https://nexiloop-ai.vercel.app) | [Documentation](docs/README.md)
