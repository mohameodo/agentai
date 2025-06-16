import { APP_DOMAIN } from "@/lib/config"
// import { isFirebaseEnabled } from "@/lib/firebase/config"
// import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Article from "./article"
// import { getChat } from "@/lib/firebase/firestore-chat-service" // Added import for firebase chat service
import { getChat } from "@/lib/chat-store/chats/api" // Corrected import path
import { getMessagesFromDb } from "@/lib/chat-store/messages/api" // Corrected import for getMessagesFromDb

export const dynamic = "force-static"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ agentSlug?: string; chatId: string }>
}): Promise<Metadata> {
  // if (!isFirebaseEnabled) { // Firebase is enabled, so this check is not needed
  //   return notFound()
  // }

  const { chatId } = await params
  // const supabase = await createClient() // Remove supabase client

  // if (!supabase) { // Remove supabase client check
  //   return notFound()
  // }

  // const { data: chat } = await supabase // Remove supabase chat fetch
  //   .from("chats")
  //   .select("title, created_at")
  //   .eq("id", chatId)
  //   .single()

  const chat = await getChat(chatId) // Fetch chat from Firebase
  if (!chat) {
    return notFound() // If chat not found, return notFound
  }

  const title = chat?.title || "Chat"
  const description = `A chat conversation in nexiloop AI - Advanced AI chat app with multi-model support`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${APP_DOMAIN}/p/${chatId}`,
      siteName: 'nexiloop',
      images: [
        {
          url: '/nl.png',
          width: 1200,
          height: 630,
          alt: 'nexiloop - Advanced AI Chat App',
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ['/nl.png'],
    },
  }
}

export default async function AgentChat({
  params,
}: {
  params: Promise<{ agentSlug?: string; chatId: string }>
}) {
  // if (!isFirebaseEnabled) {
  //   return notFound()
  // }

  const { agentSlug, chatId } = await params
  // const supabase = await createClient() // Remove supabase client

  // if (!supabase) {
  //   return notFound()
  // }

  // const { data: chatData, error: chatError } = await supabase
  //   .from("chats")
  //   .select("id, title, agent_id, created_at")
  //   .eq("id", chatId)
  //   .single()

  const chatData = await getChat(chatId) // Fetch chat data from Firebase

  if (!chatData) {
    redirect("/agents")
  }

  // const { data: messagesData, error: messagesError } = await supabase
  //   .from("messages")
  //   .select("*")
  //   .eq("chat_id", chatId)
  //   .order("created_at", { ascending: true })

  // const messagesData = chatData.messages // Get messages from chat data
  const messagesData = await getMessagesFromDb(chatId) // Fetch messages from Firebase

  if (!messagesData) {
    redirect("/agents")
  }

  let agentData = null

  // if (agentSlug) { // Agent data fetching needs to be updated for Firebase
  //   const { data, error } = await supabase
  //     .from("agents")
  //     .select("*")
  //     .eq("slug", agentSlug)
  //     .single()

  //   if (!error) {
  //     agentData = data
  //   }
  // }

  return (
    <Article
      messages={messagesData}
      date={chatData.created_at || ""}
      agentSlug={agentSlug || ""}
      // agentName={agentData?.name || ""} // Commented out agentData usage
      // agentAvatar={agentData?.avatar_url || ""} // Commented out agentData usage
      // agentDescription={agentData?.description || ""} // Commented out agentData usage
      // agentWelcome={agentData?.welcome_message || ""} // Commented out agentData usage
      // agentInputs={agentData?.example_inputs || []} // Commented out agentData usage
      title={chatData.title || "Chat"}
      subtitle="A chat conversation in nexiloop AI - Advanced AI chat app with multi-model support"
      // metaTitle={ // Commented out agentData usage
      //   agentData
      //     ? `A conversation with ${agentData.name}, an AI agent built in nexiloop`
      //     : "A chat conversation in nexiloop AI - Advanced AI chat app with multi-model support"
      // }
    />
  )
}
