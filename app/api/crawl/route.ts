import { NextResponse } from 'next/server'

const CRAWLER_API = 'https://crawl4ai-production.up.railway.app/crawl'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    // Format request for Crawl4ai
    const crawlerPayload = {
      urls: [url],
      priority: 10
    }

    // Call Crawl4ai API
    const response = await fetch(CRAWLER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(crawlerPayload),
    })

    const data = await response.json()
    
    // Transform crawler response into memory blocks
    const memoryBlocks = [
      {
        id: 'primary-content',
        title: 'Primary Content',
        content: data.summary || 'Content extracted from homepage',
        type: 'content'
      },
      {
        id: 'navigation',
        title: 'Site Navigation',
        content: 'Navigation structure extracted from the website',
        type: 'navigation'
      },
      {
        id: 'contact',
        title: 'Contact Information',
        content: 'Contact details extracted from the website',
        type: 'contact'
      }
    ]

    return NextResponse.json({ 
      taskId: data.task_id,
      url: data.url,
      pagesCrawled: data.pages_crawled,
      memoryBlocks 
    })

  } catch (error) {
    console.error('Crawler error:', error)
    return NextResponse.json(
      { error: 'Failed to crawl website' },
      { status: 500 }
    )
  }
}

