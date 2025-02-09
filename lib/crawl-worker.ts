import { Queue, Job } from 'bull';
import { CrawlEngine } from './crawl-engine';

// Define the job data interface
interface CrawlJobData {
  url: string;
  userId: string;
}

// Create a Bull queue for crawl jobs
const crawlQueue = new Queue<CrawlJobData>('crawlQueue', {
  redis: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) },
});

// Process the crawl jobs from the queue
crawlQueue.process(async (job: Job<CrawlJobData>) => {
  const { url, userId } = job.data;
  console.log(`Processing crawl job for URL: ${url}`);

  const crawlEngine = new CrawlEngine();
  crawlEngine.startCrawl(url);

  return Promise.resolve();
});

// Error handling
crawlQueue.on('failed', (job: Job<CrawlJobData>, err: Error) => {
  console.error(`Job failed for URL ${job.data.url}:`, err);
});

export { crawlQueue }; 