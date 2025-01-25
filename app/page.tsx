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
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const { toast } = useToast()

  const handleBlockClick = (id: string) => {
    setSelectedBlocks((prev) =>
      prev.includes(id) ? prev.filter((blockId) => blockId !== id) : [...prev, id]
    );
  };

  
  const handleUrlSubmit = async (url: string) => {
    console.log("Submitting URL:", url);
  
    if (availableTokens < 10) {
      toast({
        title: "Not enough tokens",
        description: "Please purchase more tokens to continue scanning.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      setIsUrlSubmitting(true);
      setIsLoading(true);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: `Analyzing ${url}` },
        {
          role: "assistant",
          content: "Starting the crawl process. This may take a few moments...",
        },
      ]);

      // Step 1: Get URLs from local endpoint
      const localCrawlResponse = await fetch(
        `http://localhost:3008/api/crawl?url=${encodeURIComponent(url)}`
      );
      const localCrawlData = await localCrawlResponse.json();

      if (!localCrawlResponse.ok) {
        throw new Error("Failed to fetch URLs from local endpoint");
      }

      // Extract URLs from local crawl response
      const urlsToProcess = localCrawlData.urls;
  
      // Step 2: Call the Crawl4AI API with the collected URLs
      const crawlResponse = await fetch(
        "https://crawl4ai-production.up.railway.app/crawl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            urls: urlsToProcess,
            priority: 10,
            magic: true,
            config: {
                session_id: "website_content_session",
                cache_mode: "bypass",
                extraction_strategy: {
                    type: "llm",
                    config: {
                        task: "summarize",
                        max_length: 10000,
                        prompt: "Provide a concise summary of the main points and key information from this webpage. Focus on the most important details that describe what this page or site is about.",
                        model: "gpt-3.5-turbo"  // or your preferred model
                    }
                }
            },
        }),
        }
      );
  
      const crawlData = await crawlResponse.json();
  
      if (!crawlResponse.ok) {
        throw new Error(crawlData.error || "Failed to initiate crawl process");
      }
  
      // Step 3: Poll the task status with improved handling
      const { task_id } = crawlData;
      let taskResponse;
      let retries = 20; // Increased from 10
      let delay = 8000;
      
      while (retries > 0) {
        try {
          taskResponse = await fetch(
            `https://crawl4ai-production.up.railway.app/task/${task_id}`
          );
          const taskData = await taskResponse.json();
          
          console.log("Task status:", taskData.status);
          
          if (taskResponse.ok && taskData.status === "completed") {
            console.log("Task RESULT:", taskData);

            if (taskData.results && taskData.results.length > 0) {
             // Combine content from all results using any type
        const combinedContent = taskData.results.map((result: any) => 
          result.cleaned_html || result.html || ''
      ).join('\n\n');

      // Create a single memory block with combined content
    // Create a single memory block with cleaned content
const singleMemoryBlock = [{
  id: 'consolidated-block',
  title: url,
  content: (() => {
      try {
          // Parse the task data
          const parsedData = JSON.parse(JSON.stringify(taskData));
          
          // If results exist, clean and extract key information
          if (parsedData.results && parsedData.results.length > 0) {
              const cleanedResults = parsedData.results.map((result: any) => {
                  // Remove HTML tags, escape characters, and extract plain text
                  const cleanContent = result.html 
                      ? result.html.replace(/<[^>]*>/g, '')   // Remove HTML tags
                      .replace(/\\n/g, ' ')                  // Replace line breaks
                      .replace(/\s+/g, ' ')                  // Collapse whitespace
                      .trim() 
                      : '';
                  
                  return {
                      url: result.url,
                      content: cleanContent
                  };
              });
              
              return JSON.stringify(cleanedResults);
          }
          
          return 'No processable content';
      } catch (error) {
          console.error('Content parsing error:', error);
          return 'Content parsing failed';
      }
  })(),
  type: 'whisper'
}];
    setMemoryBlocks(singleMemoryBlock);
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: `I've analyzed ${url} and created Whisper memory blocks. The crawl process is complete.`,
                },
              ]);
              setAvailableTokens((prev) => prev - 10);
              return; // Exit successfully
            } else {
              throw new Error("Completed but no results found");
            }
          } else if (taskData.status === "failed") {
            throw new Error(`Crawl task failed: ${taskData.error || 'Unknown error'}`);
          } else if (taskData.status === "processing") {
            console.log(`Task in progress, attempts remaining: ${retries}`);
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `Still processing... (${retries} attempts remaining)`,
              },
            ]);
          }
        } catch (error) {
          console.error("Error polling task:", error);
        }
        
        retries -= 1;
        delay *= 1.5; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
  
      if (retries === 0) {
        throw new Error("Task polling timed out - please try again");
      }
    } catch (error) {
      console.error("Error submitting URL:", error);
      toast({
        title: "Submission Error",
        //description: error.message || "Failed to start website analysis. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsUrlSubmitting(false);
    }
};


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
  const filterMemoryBlock = (query:any) => {
    if (!memoryBlocks.length) return null;
  
    // Match user query with page content or title
    const filteredBlock = memoryBlocks.find(block =>
      block.title.toLowerCase().includes(query.toLowerCase()) ||
      block.content.toLowerCase().includes(query.toLowerCase())
    );
  
    return filteredBlock || memoryBlocks[0]; // Default to the consolidated block
  };
  
  const handleChat = async (message: string) => {
    if (availableTokens < 2) {
      toast({
        title: "Not enough tokens",
        description: "Please purchase more tokens to continue chatting.",
        variant: "destructive",
      });
      return;
    }
  
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsLoading(true);
  
    try {
      // Retrieve selected memory block content
      console.log("memory blocks",memoryBlocks)
      const selectedMemoryContent = memoryBlocks[0];
  
        console.log("selectedMemoryContent",selectedMemoryContent.content)
      // Combine user input and memory block content
      const combinedContent = selectedMemoryContent
        ? `I have given you memory block of crawl data user this and give me the result of user asked Input, User Input:\n${message}\n\nMemory Block Context:\n${JSON.stringify(selectedMemoryContent)}`
        : message;
  
      // Prepare the context for the chat API
      const contextWindow = [{ role: "user", content: combinedContent }];
  
      // Send request to chat API
      const response = await generateChatCompletion(contextWindow);
  
      // Update messages with the assistant's response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
  
      // Deduct tokens for the chat operation
      setAvailableTokens((prev) => prev - 2);
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I encountered an error. Please try again or contact support if the issue persists.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

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
              memoryBlocks.map((block, index) => (
                <MemoryBlock
                key={block.id || `block-${index}`}
  url={block.title}
  content={block.content}
  isSelected={selectedBlocks.includes(block.id)}
  onClick={() => handleBlockClick(block.id)}
/>

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

