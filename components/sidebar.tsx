"use client"

import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, Trash2, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Chat {
  id: string
  title: string
  messages: any[]
  createdAt: Date
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  chats: Chat[]
  currentChatId: string | null
  onNewChat: () => void
  onLoadChat: (id: string) => void
  onDeleteChat: (id: string) => void
}

export function Sidebar({ isOpen, onToggle, chats, currentChatId, onNewChat, onLoadChat, onDeleteChat }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h2 className="font-semibold">Chats</h2>
          <button onClick={onToggle} className="md:hidden" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button onClick={onNewChat} className="w-full bg-transparent" variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                currentChatId === chat.id ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground"
              }`}
            >
              <div onClick={() => onLoadChat(chat.id)} className="flex items-start gap-2 min-w-0">
                <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{chat.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {formatDistanceToNow(new Date(chat.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteChat(chat.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity -ml-8 mt-1"
                title="Delete chat"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
