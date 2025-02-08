import Queue from 'bull';
import { CrawlEngine } from './crawl-engine';

// Create a Bull queue for crawl jobs
const crawlQueue = new Queue('crawlQueue', {
  redis: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) },
});

// Process the crawl jobs from the queue
crawlQueue.process(async (job) => {
  const { url, userId } = job.data;
  console.log(`Processing crawl job for URL: ${url}`);

  // Start the crawl using the CrawlEngine
  const crawlEngine = new CrawlEngine();

  // Listen for final completion then update database, etc.
  crawlEngine.once('crawl_completed', (statusUpdate) => {
    // Here you can update your database with the WhisperBlock details.
    // For example (pseudo code):
    // await db.query('UPDATE whisper_blocks SET status = $1, progress = $2, ... WHERE id = $3', [...] );
    console.log(`Crawl completed for URL: ${url} with status: ${statusUpdate.status}`);
  });

  // Start the crawl job for the given URL (this is asynchronous)
  crawlEngine.startCrawl(url);

  return Promise.resolve();
});

// Optional: Add error handling and event listeners for more robust processing
crawlQueue.on('failed', (job, err) => {
  console.error(`Job failed for URL ${job.data.url}:`, err);
});

export { crawlQueue }; 