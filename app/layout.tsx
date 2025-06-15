import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { PWAInstaller } from "@/app/components/pwa-installer"
import { ThemeBackground } from "@/app/components/theme-background"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AgentProvider } from "@/lib/agent-store/provider"
import { ChatsProvider } from "@/lib/chat-store/chats/provider"
import { ChatSessionProvider } from "@/lib/chat-store/session/provider"
import { APP_DESCRIPTION, APP_NAME } from "@/lib/config"
import { UserPreferencesProvider } from "@/lib/user-preference-store/provider"
import { UserProvider } from "@/lib/user-store/provider"
import { getUserProfile } from "@/lib/user/api"
import { ThemeProvider } from "next-themes"
import Script from "next/script"
import { LayoutClient } from "./layout-client"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: APP_NAME,
  description: "nexiloop AI is an advanced AI chat app developed by Nexiloop with multi-model support",
  manifest: '/manifest.json',
  metadataBase: new URL('https://ai.nexiloop.com'),
  keywords: [
    'AI chat',
    'artificial intelligence',
    'multi-model AI',
    'OpenAI',
    'Claude',
    'Gemini',
    'Mistral',
    'Ollama',
    'local AI',
    'chat assistant',
    'AI conversation',
    'machine learning',
    'natural language processing',
    'AI tools',
    'productivity',
    'open source AI',
    'Nexiloop',
    'CodeHat',
    'image generation',
    'background removal',
    'AI agents'
  ],
  authors: [{ name: 'Nexiloop', url: 'https://nexiloop.com' }],
  creator: 'Nexiloop',
  publisher: 'Nexiloop',
  category: 'Technology',
  classification: 'AI Software',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#151515' }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
    shortcut: '/favicon.ico',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai.nexiloop.com',
    siteName: 'nexiloop',
    title: 'nexiloop - Advanced AI Chat App with Multi-Model Support',
    description: 'nexiloop AI is an advanced AI chat app developed by Nexiloop with multi-model support. Chat with OpenAI, Claude, Gemini, Mistral, Ollama and more. Features include image generation, background removal, and AI agents.',
    images: [
      {
        url: '/nl.png',
        width: 1200,
        height: 630,
        alt: 'nexiloop - Advanced AI Chat App',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nexiloop',
    creator: '@nexiloop',
    title: 'nexiloop - Advanced AI Chat App with Multi-Model Support',
    description: 'nexiloop AI is an advanced AI chat app developed by Nexiloop with multi-model support. Chat with OpenAI, Claude, Gemini, Mistral, Ollama and more.',
    images: ['/nl.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://ai.nexiloop.com',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDev = process.env.NODE_ENV === "development"
  const userProfile = await getUserProfile()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Basic Meta Tags */}
        <meta name="application-name" content={APP_NAME} />
        <meta name="generator" content="Next.js" />
        <meta name="referrer" content="origin-when-cross-origin" />
        
        {/* SEO Meta Tags */}
        <meta name="google-site-verification" content="your-google-site-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        
        {/* Language and Locale */}
        <meta httpEquiv="content-language" content="en-US" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        
        {/* Cache Control */}
        <meta httpEquiv="cache-control" content="public, max-age=31536000, immutable" />
        <meta httpEquiv="expires" content="Thu, 31 Dec 2025 23:59:59 GMT" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Additional SEO Tags */}
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="revisit-after" content="1 days" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="resource-type" content="document" />
        <meta name="classification" content="AI Software" />
        <meta name="category" content="AI, Technology, Productivity, Software" />
        <meta name="subject" content="AI Chat Application, Artificial Intelligence, Multi-Model AI Support" />
        <meta name="abstract" content="Advanced AI chat application with support for multiple AI models including OpenAI, Claude, Gemini, Mistral, and Ollama. Features include image generation, background removal, AI agents, and development tools." />
        <meta name="topic" content="Artificial Intelligence, Chat Applications, AI Tools, Productivity Software" />
        <meta name="summary" content="nexiloop AI is an advanced, open-source AI chat app with multi-model support, image generation, and powerful development tools." />
        <meta name="designer" content="Nexiloop" />
        <meta name="copyright" content="© 2025 Nexiloop. All rights reserved." />
        <meta name="reply-to" content="hello@nexiloop.com" />
        <meta name="owner" content="Nexiloop" />
        <meta name="url" content="https://ai.nexiloop.com" />
        <meta name="identifier-URL" content="https://ai.nexiloop.com" />
        <meta name="directory" content="submission" />
        <meta name="pagename" content="nexiloop AI - Advanced AI Chat App" />
        <meta name="subtitle" content="Multi-Model AI Support with Image Generation and Background Removal" />
        
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://api.anthropic.com" />
        <link rel="dns-prefetch" href="https://api.gemini.com" />
        <link rel="dns-prefetch" href="https://api.mistral.ai" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "nexiloop",
              "description": "nexiloop AI is an advanced AI chat app developed by Nexiloop with multi-model support. Chat with OpenAI, Claude, Gemini, Mistral, Ollama and more. Features include image generation, background removal, and AI agents.",
              "url": "https://ai.nexiloop.com",
              "applicationCategory": "AI Chat Application",
              "operatingSystem": "Web Browser",
              "publisher": {
                "@type": "Organization",
                "name": "Nexiloop",
                "url": "https://nexiloop.com"
              },
              "author": {
                "@type": "Organization",
                "name": "Nexiloop",
                "url": "https://nexiloop.com"
              },
              "image": "https://ai.nexiloop.com/nl.png",
              "screenshot": "https://ai.nexiloop.com/nl.png",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1000"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                "Multi-model AI support (OpenAI, Claude, Gemini, Mistral, Ollama)",
                "Image generation with Cloudflare Workers AI",
                "AI-powered background removal",
                "Local AI with Ollama integration",
                "AI agents and tool integration",
                "CodeHat workspace for development",
                "File uploads and context-aware answers",
                "Responsive design with light/dark themes",
                "Progressive Web App (PWA)",
                "Open source and self-hostable"
              ],
              "keywords": "AI chat, artificial intelligence, multi-model AI, OpenAI, Claude, Gemini, Mistral, Ollama, local AI, chat assistant, machine learning, natural language processing, AI tools, productivity, open source AI, Nexiloop, CodeHat, image generation, background removal, AI agents"
            })
          }}
        />
      </head>
      {!isDev ? (
        <Script
          async
          src="https://cloud.umami.is/script.js"
          data-website-id="c53ba79c-39f3-406e-a57e-5c732df61710"
        />
      ) : null}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWAInstaller />
        <LayoutClient />
        <UserProvider initialUser={userProfile}>
          <ChatsProvider userId={userProfile?.id}>
            <ChatSessionProvider>
              <AgentProvider userId={userProfile?.id}>
                <UserPreferencesProvider userId={userProfile?.id}>
                  <TooltipProvider delayDuration={200} skipDelayDuration={500}>
                    <ThemeProvider
                      attribute="class"
                      defaultTheme="light"
                      enableSystem
                      disableTransitionOnChange
                    >
                      <ThemeBackground />
                      <SidebarProvider defaultOpen>
                        <Toaster position="top-center" />
                        {children}
                      </SidebarProvider>
                    </ThemeProvider>
                  </TooltipProvider>
                </UserPreferencesProvider>
              </AgentProvider>
            </ChatSessionProvider>
          </ChatsProvider>
        </UserProvider>
      </body>
    </html>
  )
}
