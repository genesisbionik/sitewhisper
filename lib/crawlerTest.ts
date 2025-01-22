import { crawlWebsite } from '@/hooks/useCrawler'

export async function testCrawler() {
  const testUrl = 'https://example.com'

  try {
    console.log(`Starting crawler test for ${testUrl}`)
    const result = await crawlWebsite(testUrl)
    console.log('Crawler test result:', result)
    return { success: true, result }
  } catch (error) {
    console.error('Crawler test failed:', error)
    return { success: false, error }
  }
}

