"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, ArrowLeft, Loader } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Simple helper to safely escape HTML and convert minimal markdown-like formatting
function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function formatMessageToHtml(raw: string) {
  if (!raw) return ""
  const escaped = escapeHtml(raw)

  // Bold **text**
  let s = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  // Italic *text*
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>")

  // Split into lines and build paragraphs / lists
  const lines = s.split(/\r?\n/)
  const out: string[] = []
  let inList = false
  let listItems: string[] = []
  let paraAcc: string[] = []

  const flushParagraph = () => {
    if (paraAcc.length) {
      out.push(`<p>${paraAcc.join("<br />")}</p>`)
      paraAcc = []
    }
  }

  const flushList = () => {
    if (inList && listItems.length) {
      out.push(`<ol class="list-decimal list-inside">${listItems.map((li) => `<li>${li}</li>`).join("")}</ol>`)
      listItems = []
      inList = false
    }
  }

  for (const line of lines) {
    const m = line.match(/^\s*\d+\.\s+(.*)$/)
    if (m) {
      flushParagraph()
      if (!inList) inList = true
      listItems.push(m[1])
    } else if (line.trim() === "") {
      flushList()
      flushParagraph()
    } else {
      if (inList) {
        flushList()
      }
      paraAcc.push(line.trim())
    }
  }

  flushList()
  flushParagraph()

  return out.join("")
}

interface ExpertChatProps {
  diagnosis: any
  onBack: () => void
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
}

export function ExpertChat({ diagnosis, onBack }: ExpertChatProps) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: formatMessageToHtml(`${t.expertChat.welcomePre}${diagnosis.issue}${t.expertChat.welcomePost}`),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: escapeHtml(input),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          diagnosis,
        }),
      })

      if (!response.ok) throw new Error("Chat failed")

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: formatMessageToHtml(data.response),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 border-0 shadow-lg flex flex-col h-[600px]">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.expertChat.back}
      </button>

      <h2 className="text-xl font-bold text-gray-900 mb-4">{t.expertChat.title}</h2>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${message.type === "user"
                ? "bg-green-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
            >
              {/* <p className="text-sm">{message.content}</p> */}
              <div dangerouslySetInnerHTML={{ __html: message.content }}></div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">{t.expertChat.thinking}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.expertChat.placeholder}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100"
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  )
}
