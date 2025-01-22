interface CrawlResult {
  url: string
  pages_crawled: number
  summary: string
}

export async function crawlWebsite(url: string): Promise<CrawlResult> {
  try {
    const response = await fetch('https://crawl4ai-production.up.railway.app/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls: url, priority: 10 }),
    })

    if (!response.ok) {
      throw new Error('Crawl request failed')
    }

    const data: CrawlResult = await response.json()
    return data
  } catch (error) {
    console.error('Error during crawl:', error)
    throw error
  }
}

