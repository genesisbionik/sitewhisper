import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from 'lucide-react'

interface MemoryBlockProps {
  url: string
  content: string
}

export function MemoryBlock({ url, content }: MemoryBlockProps) {
  return (
    <Card className="transition-all hover:shadow-md max-h-[400px] overflow-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <CardTitle className="text-sm">Whisper Memory</CardTitle>
          <p className="text-xs text-muted-foreground">{url}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{content}</p>
      </CardContent>
    </Card>
  )
}

