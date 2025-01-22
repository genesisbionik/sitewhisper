"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { MemoryBlock } from "@/components/memory-block"
import { UrlForm } from "@/components/url-form"
import { TokenStatus } from "@/components/token-status"
import { UpgradeButton } from "@/components/upgrade-button"
import { Download } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { generateChatCompletion } from "@/lib/openrouter"
import { CrawlStatus } from "@/components/crawl-status"

interface Message {
  role: "assistant" | "user"
  content: string
}

interface MemoryBlockData {
  id: string
  title: string
  content: string
  type: string
}

const INITIAL_TOKENS = 100;

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome to SiteWhisper! Enter any website URL above to analyze and transform web content into AI-ready knowledge. I'll help you extract valuable information and create structured Whisper memory blocks that AI systems can understand.\n\nLet's begin! Just paste a URL to get started. ✨",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlockData[]>([])
  const [availableTokens, setAvailableTokens] = useState(INITIAL_TOKENS)
  const [isUrlSubmitting, setIsUrlSubmitting] = useState(false)
  const { toast } = useToast()

  const handleUrlSubmit = async (url: string) => {
    console.log('Submitting URL:', url)

    if (availableTokens < 10) {
      toast({
        title: "Not enough tokens",
        description: "Please purchase more tokens to continue scanning.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUrlSubmitting(true)
      setIsLoading(true)
      setMessages((prev) => [
        ...prev,
        { role: "user", content: `Analyzing ${url}` },
        { role: "assistant", content: "Starting the crawl process. This may take a few moments..." }
      ])

      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })

      const data = await response.json()

      if (response.ok) {
        setMemoryBlocks(data.memoryBlocks)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I've analyzed ${data.url} and created ${data.memoryBlocks.length} Whisper memory blocks. ${data.pagesCrawled} pages were crawled. You can now interact with this data or ask me questions about it.`,
          },
        ])
        setAvailableTokens((prev) => prev - 10)
      } else {
        throw new Error(data.error || 'Failed to crawl website')
      }
    } catch (error) {
      console.error('Error submitting URL:', error)
      toast({
        title: "Submission Error",
        description: "Failed to start website analysis. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsUrlSubmitting(false)
    }
  }

  const handleExport = async () => {
    if (availableTokens < 5) {
      toast({
        title: "Not enough tokens",
        description: "Please purchase more tokens to export data.",
        variant: "destructive",
      })
      return
    }

    if (memoryBlocks.length > 0) {
      const blob = new Blob([JSON.stringify(memoryBlocks, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `whisper_memory_blocks.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setAvailableTokens((prev) => prev - 5)
      toast({
        title: "Export successful",
        description: "Your Whisper memory blocks have been exported successfully.",
      })
    }
  }

  const handleChat = async (message: string) => {
    if (availableTokens < 2) {
      toast({
        title: "Not enough tokens",
        description: "Please purchase more tokens to continue chatting.",
        variant: "destructive",
      })
      return
    }

    setMessages((prev) => [...prev, { role: "user", content: message }])
    setIsLoading(true)

    try {
      const chatHistory = messages.slice(-5)
      const response = await generateChatCompletion([
        ...chatHistory,
        { role: "user", content: message },
      ])

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ])

      setAvailableTokens((prev) => prev - 2)
    } catch (error) {
      console.error('Error in chat:', error)
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "I apologize, but I encountered an error. Please try again or contact support if the issue persists." 
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const hasTokens = availableTokens > 0
  const showUpgrade = !hasTokens || availableTokens < 5

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col gap-4 p-4 max-w-7xl">
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="flex flex-col rounded-lg border bg-background shadow-sm">
          <div className="flex flex-col gap-4 border-b p-4">
            <UrlForm onSubmit={handleUrlSubmit} isLoading={isUrlSubmitting} />
            <CrawlStatus 
              isActive={isUrlSubmitting} 
              message={isUrlSubmitting ? "Analyzing website content..." : undefined} 
            />
          </div>
          <div className="flex-1 overflow-auto">
            <div className="divide-y">
              {messages.map((message, index) => (
                <ChatMessage key={index} {...message} />
              ))}
              {isLoading && (
                <ChatMessage
                  role="assistant"
                  content=""
                  isLoading={true}
                />
              )}
            </div>
          </div>
          <ChatInput onSend={handleChat} disabled={!hasTokens || isLoading} />
        </div>
        <div className="flex flex-col gap-4">
          <TokenStatus availableTokens={availableTokens} maxTokens={INITIAL_TOKENS} />
          {showUpgrade && <UpgradeButton />}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Whisper Memory</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={memoryBlocks.length === 0 || !hasTokens}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            {memoryBlocks.length > 0 ? (
              memoryBlocks.map((block) => (
                <MemoryBlock key={block.id} url={block.title} content={block.content} />
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No Whisper memory blocks yet. Start by analyzing a website.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

