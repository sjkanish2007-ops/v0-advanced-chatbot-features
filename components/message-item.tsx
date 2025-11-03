"use client"

import type { Message } from "@/types/chat"
import { MarkdownContent } from "@/components/markdown-content"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface MessageItemProps {
  message: Message
}

export function MessageItem({ message }: MessageItemProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex gap-3 py-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
          message.role === "user" ? "bg-primary" : "bg-indigo-600"
        }`}
      >
        {message.role === "user" ? "U" : "K"}
      </div>

      {/* Content */}
      <div className={`flex-1 space-y-2 ${message.role === "user" ? "text-right" : ""}`}>
        <div
          className={`inline-block max-w-full rounded-lg px-4 py-3 ${
            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {message.role === "assistant" ? (
            <MarkdownContent content={message.content} />
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>

        {/* Copy Button */}
        {message.role === "assistant" && (
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
