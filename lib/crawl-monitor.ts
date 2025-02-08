import { CrawlEngine, WS_EVENTS } from './crawl-engine';

// Instantiate CrawlEngine for monitoring sample crawl performance
const crawlEngine = new CrawlEngine();

crawlEngine.on(WS_EVENTS.CRAWL_STARTED, (data) => {
  console.log(`[Monitoring] Crawl started for ${data.url} at ${data.timestamp}`);
});

crawlEngine.on(WS_EVENTS.CRAWL_PROGRESS, (data) => {
  console.log(`[Monitoring] Progress for ${data.url}: ${data.progress}%`);
});

crawlEngine.on(WS_EVENTS.CRAWL_COMPLETED, (data) => {
  console.log(`[Monitoring] Crawl completed for ${data.url}`);
});

// This file can be imported in your main server file to start logging crawl metrics. 