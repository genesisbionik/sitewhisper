import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface CrawlStatusProps {
  isActive: boolean
  message?: string
}

export function CrawlStatus({ isActive, message }: CrawlStatusProps) {
  return (
    <div className={cn(
      "transition-opacity duration-300",
      isActive ? "opacity-100" : "opacity-0"
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Crawling in progress...</span>
        <span className="text-sm text-muted-foreground animate-pulse">
          {message || "Analyzing website content"}
        </span>
      </div>
      <div className="relative">
        <Progress 
          value={100} 
          className="h-2 animate-progress"
        />
        <style jsx global>{`
          @keyframes progress {
            0% {
              --tw-translate-x: -100%;
              transform: translate(var(--tw-translate-x), 0);
            }
            100% {
              --tw-translate-x: 100%;
              transform: translate(var(--tw-translate-x), 0);
            }
          }
          .animate-progress::-moz-progress-bar {
            animation: progress 2s infinite linear;
            background: linear-gradient(
              90deg,
              transparent 0%,
              hsl(var(--primary)) 50%,
              transparent 100%
            );
          }
          .animate-progress::-webkit-progress-value {
            animation: progress 2s infinite linear;
            background: linear-gradient(
              90deg,
              transparent 0%,
              hsl(var(--primary)) 50%,
              transparent 100%
            );
          }
        `}</style>
      </div>
    </div>
  )
}

