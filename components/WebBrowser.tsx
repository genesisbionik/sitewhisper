import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2, Globe, BookOpen, Code, Share2, Brain, Network, Database } from 'lucide-react'
import { cn } from "@/lib/utils"

interface WebBrowserProps {
  onUrlSubmit: (url: string) => void
  isLoading: boolean
  memoryBlocks: any[]
  currentUrl?: string
}

export default function WebBrowser({ 
  onUrlSubmit, 
  isLoading, 
  memoryBlocks,
  currentUrl = ''
}: WebBrowserProps) {
  const [url, setUrl] = useState(currentUrl)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url) onUrlSubmit(url)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 border-0 shadow-[0_0_15px_rgba(147,51,234,0.1)] backdrop-blur-sm">
      {/* Futuristic Browser Chrome */}
      <div className="border-b border-blue-500/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          </div>
          <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
        </div>
        
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 flex items-center bg-gray-900/50 rounded-lg border border-blue-500/20 backdrop-blur-md">
            <Globe className="w-5 h-5 text-blue-400 ml-3" />
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL for analysis..."
              className="border-0 bg-transparent text-blue-50 placeholder:text-blue-300/30 focus:ring-0 focus:outline-none"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Network className="w-5 h-5 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Content Area with Futuristic Tabs */}
      <Tabs defaultValue="preview" className="p-6">
        <TabsList className="mb-6 bg-gray-900/40 border border-blue-500/20 backdrop-blur-md">
          <TabsTrigger 
            value="preview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600"
          >
            <Globe className="w-4 h-4 mr-2" />
            Neural Preview
          </TabsTrigger>
          <TabsTrigger 
            value="analysis"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600"
          >
            <Brain className="w-4 h-4 mr-2" />
            Deep Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="memory"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600"
          >
            <Database className="w-4 h-4 mr-2" />
            Memory Core
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-purple-500/20 border-r-purple-500 animate-spin-slow" />
              </div>
              <p className="text-blue-300/70 animate-pulse">Neural Processing...</p>
            </div>
          ) : memoryBlocks.length > 0 ? (
            <div className="space-y-6">
              {memoryBlocks.map((block) => (
                <div 
                  key={block.id} 
                  className="bg-gray-900/40 border border-blue-500/20 rounded-lg p-6 backdrop-blur-md"
                >
                  <h3 className="text-xl font-semibold text-blue-300 mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    {block.title}
                  </h3>
                  <div className="text-blue-100/80 leading-relaxed">
                    {block.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-blue-300/40">
              <Network className="w-16 h-16" />
              <p>Enter a URL to initiate neural analysis</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis">
          <div className="space-y-6">
            {memoryBlocks.map((block) => (
              <Card 
                key={block.id} 
                className="bg-gray-900/40 border border-blue-500/20 backdrop-blur-md"
              >
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-purple-400" />
                    {block.title}
                  </h4>
                  <pre className="bg-gray-950/50 p-4 rounded-lg border border-blue-500/10 text-blue-100/70 overflow-x-auto">
                    {JSON.stringify(block, null, 2)}
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="memory">
          <div className="bg-gray-900/40 border border-blue-500/20 rounded-lg p-6 backdrop-blur-md">
            <div className="flex items-center space-x-4 mb-6">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-xl font-semibold text-blue-300">Neural Memory Core</h3>
                <p className="text-blue-400/60">Processed Data Patterns & Insights</p>
              </div>
            </div>
            {/* Add memory visualization or additional analysis here */}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
} 