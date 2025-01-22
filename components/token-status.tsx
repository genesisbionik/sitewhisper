import { Progress } from "@/components/ui/progress"

interface TokenStatusProps {
  availableTokens: number
  maxTokens: number
}

export function TokenStatus({ availableTokens, maxTokens }: TokenStatusProps) {
  const percentage = (availableTokens / maxTokens) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Available Tokens</span>
        <span className="font-medium">
          {availableTokens} / {maxTokens}
        </span>
      </div>
      <Progress value={percentage} className="h-2 w-full" />
    </div>
  )
}

