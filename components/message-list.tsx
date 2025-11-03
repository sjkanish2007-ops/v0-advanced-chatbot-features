"use client"

import { useRef, useEffect } from "react"
import type { Message } from "@/types/chat"
import { MessageItem } from "@/components/message-item"
import { WelcomeScreen } from "@/components/welcome-screen"
import { TypingIndicator } from "@/components/typing-indicator"

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  onRetry: () => void
}

export function MessageList({ messages, isLoading, onRetry }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 ? (
        <WelcomeScreen onPromptClick={() => {}} />
      ) : (
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
