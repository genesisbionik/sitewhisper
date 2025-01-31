import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  role: "assistant" | "user"
  content: string
  isLoading?: boolean
  isStreaming?: boolean
}

export function ChatMessage({ role, content, isLoading, isStreaming }: ChatMessageProps) {
  // Format the content to ensure proper markdown
  const formattedContent = content.replace(/\n/g, '\n\n') // Ensure paragraphs are properly separated

  return (
    <div className={cn(
      "flex w-full gap-4 p-4",
      role === "assistant" ? "bg-muted/50" : "bg-background"
    )}>
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow">
        {role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm text-muted-foreground">
          {role === "assistant" ? "SiteWhisper" : "You"}
        </p>
        {isLoading ? (
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.2s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.4s]"></div>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-2">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
                ul: ({ children }) => <ul className="my-4 ml-4 list-disc space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="my-4 ml-4 list-decimal space-y-2">{children}</ol>,
                li: ({ children }) => <li className="leading-7">{children}</li>,
                h3: ({ children }) => <h3 className="text-lg font-semibold mt-6 mb-4">{children}</h3>,
                h4: ({ children }) => <h4 className="text-base font-semibold mt-4 mb-2">{children}</h4>,
                code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 rounded-sm text-sm">{children}</code>,
              }}
            >
              {formattedContent}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-1 h-4 ml-1 align-middle bg-current animate-pulse">|</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

