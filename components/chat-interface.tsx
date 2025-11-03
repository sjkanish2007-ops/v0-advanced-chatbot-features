"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageList } from "@/components/message-list"
import { Sidebar } from "@/components/sidebar"
import { SettingsModal } from "@/components/settings-modal"
import { Moon, Sun, Menu, Trash2, Settings } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function ChatInterface() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    model: "kanish-mini",
    temperature: 0.7,
    maxTokens: 1024,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load theme and chats from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = savedTheme ? savedTheme === "dark" : prefersDark
    setIsDarkMode(isDark)
    if (isDark) document.documentElement.classList.add("dark")

    const savedChats = localStorage.getItem("chats")
    if (savedChats) {
      setChats(JSON.parse(savedChats))
    }

    const savedSettings = localStorage.getItem("chatSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save chats to localStorage
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats))
  }, [chats])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem("theme", newDarkMode ? "dark" : "light")
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const newChat = () => {
    const chatId = Date.now().toString()
    const newChat: Chat = {
      id: chatId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    }
    setChats([newChat, ...chats])
    setCurrentChatId(chatId)
    setMessages([])
  }

  const loadChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId)
    if (chat) {
      setCurrentChatId(chatId)
      setMessages([...chat.messages])
    }
  }

  const clearChat = () => {
    if (confirm("Clear current conversation?")) {
      setMessages([])
      if (currentChatId) {
        setChats(chats.map((c) => (c.id === currentChatId ? { ...c, messages: [] } : c)))
      }
    }
  }

  const handleSaveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings)
    localStorage.setItem("chatSettings", JSON.stringify(newSettings))
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    if (!currentChatId) {
      newChat()
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: settings.model,
          prompt: input,
          stream: true,
          options: {
            temperature: settings.temperature,
            top_p: 0.9,
            num_predict: settings.maxTokens,
          },
        }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      let assistantContent = ""
      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages([...newMessages, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split("\n")

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line)
              if (data.response) {
                assistantContent += data.response
                setMessages([
                  ...newMessages,
                  {
                    ...assistantMessage,
                    content: assistantContent,
                  },
                ])
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }

      // Update chat
      const updatedChat = chats.find((c) => c.id === currentChatId)
      if (updatedChat) {
        const messageCount = updatedChat.messages.length
        if (messageCount === 0) {
          const title = input.length > 30 ? input.substring(0, 30) + "..." : input
          updatedChat.title = title
        }
        updatedChat.messages = [
          ...newMessages,
          {
            id: assistantMessage.id,
            role: "assistant",
            content: assistantContent,
          },
        ]
        setChats([...chats])
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Unknown error"}\n\nMake sure Ollama is running and the model is available.`,
      }
      setMessages([...newMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={newChat}
        onLoadChat={loadChat}
        onDeleteChat={(id) => {
          setChats(chats.filter((c) => c.id !== id))
          if (currentChatId === id) {
            setCurrentChatId(null)
            setMessages([])
          }
        }}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="border-b border-border bg-card px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold sm:text-xl">
                {currentChatId ? chats.find((c) => c.id === currentChatId)?.title : "Kanish Mini Chat"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={clearChat} title="Clear chat" className="hidden sm:flex">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowSettings(true)} title="Settings">
                <Settings className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={toggleTheme} title="Toggle theme">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <MessageList messages={messages} isLoading={isLoading} onRetry={sendMessage} />

        {/* Input Area */}
        <div className="border-t border-border bg-card p-4 sm:p-6">
          <div className="mx-auto max-w-3xl space-y-3">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Message Kanish Mini... (Shift+Enter for new line)"
                className="min-h-[44px] resize-none"
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading || !input.trim()} className="self-end">
                Send
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Shift+Enter for new line • Press Enter to send</p>
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  )
}
