import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, CheckCircle, Circle } from "lucide-react";

interface MemoryBlockProps {
  url: string;
  content: string;
  isSelected: boolean; 
  onClick: () => void; // New prop for click handler
}

export function MemoryBlock({ url, content, isSelected, onClick }: MemoryBlockProps) {
  return (
    <Card
      onClick={onClick}
      className={`transition-all hover:shadow-md max-h-[400px] overflow-auto cursor-pointer ${
        isSelected ? "border-primary bg-primary/10" : "border"
      }`}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-col flex-1">
          <CardTitle className="text-sm">Whisper Memory</CardTitle>
          <p className="text-xs text-muted-foreground">{url}</p>
        </div>
        <div>
          {isSelected ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{content}</p>
      </CardContent>
    </Card>
  );
}
