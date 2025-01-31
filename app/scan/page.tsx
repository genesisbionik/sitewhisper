"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "@/components/chat-message"
import { MemoryBlock } from "@/components/memory-block"
import { UrlForm } from "@/components/url-form"
import { TokenStatus } from "@/components/token-status"
import { Download } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface Message {
  role: "assistant" | "user"
  content: string
}

interface MemoryBlockData {
  id: string
  title: string
  content: string
  confidence: number
  url?: string
  isSelected?: boolean
}

// Mock user data - replace with actual authentication in a real app
const user = {
  name: "John Doe",
  email: "john@example.com",
  image: "/placeholder.svg?height=32&width=32",
  availableTokens: 75,
  maxTokens: 100,
}

export default function ScanPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome to SiteWhisper! Enter any website URL above to analyze and transform web content into AI-ready knowledge. I'll help you extract valuable information and create structured data that AI systems can understand.\n\nLet's begin! Just paste a URL to get started. ✨",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlockData[]>([])
  const [availableTokens, setAvailableTokens] = useState(user.availableTokens)
  const { toast } = useToast()

  useEffect(() => {
    console.log("Environment check:", {
      hasDeepSeekKey: !!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
      keyLength: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY?.length,
      nodeEnv: process.env.NODE_ENV
    });
  }, []);

  const handleUrlSubmit = async (url: string) => {
    if (availableTokens < 10) {
      toast({
        title: "Not enough tokens",
        description: "Please purchase more tokens to continue scanning.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setMessages((prev) => [...prev, { role: "user", content: `Analyzing ${url}` }])

    // Simulate crawling and processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate receiving memory blocks
    const newMemoryBlocks: MemoryBlockData[] = [
      {
        id: "1",
        title: "Main Content",
        content: "Primary content extracted from the homepage discussing key features and benefits.",
        confidence: 95,
      },
      {
        id: "2",
        title: "Navigation Structure",
        content: "Site navigation pattern identified with main sections and hierarchical organization.",
        confidence: 88,
      },
      {
        id: "3",
        title: "Contact Information",
        content: "Contact details and communication channels extracted from footer and contact pages.",
        confidence: 92,
      },
    ]

    setMemoryBlocks(newMemoryBlocks)
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `I've analyzed ${url} and created ${newMemoryBlocks.length} memory blocks. Each block contains structured information about different aspects of the website. You can now interact with this data or export it for further use.`,
      },
    ])
    setIsLoading(false)
    setAvailableTokens((prev) => prev - 10)
  }

  const handleExport = () => {
    if (availableTokens < 5) {
      toast({
        title: "Not enough tokens",
        description: "Please purchase more tokens to export data.",
        variant: "destructive",
      })
      return
    }

    // Implement export functionality here
    console.log("Exporting data...")
    setAvailableTokens((prev) => prev - 5)
    toast({
      title: "Export successful",
      description: "Your data has been exported successfully.",
    })
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr,280px]">
        <div className="flex flex-col rounded-lg border bg-background shadow-sm">
          <div className="flex items-center gap-2 border-b p-4">
            <UrlForm onSubmit={handleUrlSubmit} isLoading={isLoading} />
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
        </div>
        <div className="flex flex-col gap-4">
          <TokenStatus availableTokens={availableTokens} maxTokens={user.maxTokens} />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Memory Blocks</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={memoryBlocks.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            {memoryBlocks.map((block) => (
              <MemoryBlock 
                key={block.id} 
                {...block} 
                isSelected={false}
                onClick={() => {}}
                url=""
              />
            ))}
            {memoryBlocks.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No memory blocks yet. Start by analyzing a website.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

