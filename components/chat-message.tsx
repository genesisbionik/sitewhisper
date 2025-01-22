import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface ChatMessageProps {
  role: "assistant" | "user"
  content: string
  isLoading?: boolean
}

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  return (
    <div className={cn("flex w-full gap-4 p-4", role === "assistant" ? "bg-muted/50" : "bg-background")}>
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow">
        {role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm text-muted-foreground">{role === "assistant" ? "SiteWhisper" : "You"}</p>
        {isLoading ? (
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.2s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.4s]"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">{content}</p>
          </div>
        )}
      </div>
    </div>
  )
}

