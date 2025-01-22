"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe } from 'lucide-react'

interface UrlFormProps {
  onSubmit: (url: string) => void
  isLoading: boolean
}

export function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const parsedUrl = new URL(url)
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        throw new Error("URL must start with http:// or https://")
      }
      onSubmit(url)
    } catch (err) {
      setError("Please enter a valid URL (e.g., https://example.com)")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-2">
      <div className="relative flex w-full items-center">
        <div className="absolute left-3 text-muted-foreground">
          <Globe className="h-4 w-4" />
        </div>
        <Input
          type="url"
          placeholder="Enter website URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pl-9"
          required
        />
        <Button type="submit" disabled={isLoading} className="ml-2">
          {isLoading ? "Crawling..." : "Crawl"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  )
}

