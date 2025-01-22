"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 border-t">
      <Textarea
        placeholder="Ask about the analyzed content..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[80px] max-h-[200px]"
        disabled={disabled}
      />
      <Button type="submit" size="icon" disabled={disabled || !message.trim()}>
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  )
}

