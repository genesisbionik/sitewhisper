import { EventEmitter } from 'node:events';
import { WebSocketServer, WebSocket } from 'ws';

/**
 * WebSocket events for the Crawl Engine.
 */
export const WS_EVENTS = {
  CRAWL_STARTED: 'crawl_started',
  CRAWL_PROGRESS: 'crawl_progress',
  WHISPER_BLOCK_CREATED: 'whisper_block_created',
  CRAWL_COMPLETED: 'crawl_completed',
  CRAWL_ERROR: 'crawl_error',
} as const;

/**
 * Interface for crawl status updates.
 */
export interface CrawlStatusUpdate {
  status: string;          // Current crawl status
  progress: number;        // Progress percentage
  url: string;             // Current URL being processed
  whisperBlockId?: string; // Associated WhisperBlock ID (if available)
  timestamp: number;       // Update timestamp
}

/**
 * CrawlEngine class simulates background crawl jobs with status updates.
 */
export class CrawlEngine extends EventEmitter {
  constructor() {
    super();
  }

  /**
   * Starts a crawl job for the given URL. 
   * This simulates background processing with periodic progress updates.
   */
  startCrawl(url: string) {
    // Generate a unique job ID (could be used for tracking in a real queue)
    const jobId = `job-${Date.now()}`;

    // Emit that the crawl has started
    const startStatus: CrawlStatusUpdate = {
      status: 'Crawl started',
      progress: 0,
      url,
      timestamp: Date.now(),
    };
    this.emit(WS_EVENTS.CRAWL_STARTED, startStatus);

    // Simulate progress updates every 1 second
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      const statusUpdate: CrawlStatusUpdate = {
        status: 'Crawling in progress',
        progress,
        url,
        timestamp: Date.now(),
      };
      this.emit(WS_EVENTS.CRAWL_PROGRESS, statusUpdate);

      // When we reach 100%, simulate WhisperBlock creation and completion
      if (progress >= 100) {
        clearInterval(interval);

        // Simulate WhisperBlock creation
        const whisperBlockId = `whisper-${Date.now()}`;
        this.emit(WS_EVENTS.WHISPER_BLOCK_CREATED, {
          ...statusUpdate,
          whisperBlockId,
          status: 'WhisperBlock created',
        });

        // Finalize the crawl process
        const completedStatus: CrawlStatusUpdate = {
          ...statusUpdate,
          progress: 100,
          whisperBlockId,
          status: 'Crawl completed',
          timestamp: Date.now(),
        };
        this.emit(WS_EVENTS.CRAWL_COMPLETED, completedStatus);
      }
    }, 1000);
  }
}

/**
 * Sets up a WebSocket server and connects it to the CrawlEngine.
 * This function should be called with your HTTP/HTTPS server.
 */
export const setupWebSocketServer = (server: any) => {
  const wss = new WebSocketServer({ server });
  const crawlEngine = new CrawlEngine();

  wss.on('connection', (wsConnection: WebSocket) => {
    console.log("WebSocket client connected");

    // Helper function to broadcast an event to the connected client.
    const broadcastUpdate = (eventType: string, data: any) => {
      const message = JSON.stringify({ event: eventType, data });
      wsConnection.send(message);
    };

    // Subscribe to CrawlEngine events and broadcast them
    crawlEngine.on(WS_EVENTS.CRAWL_STARTED, (data) => {
      broadcastUpdate(WS_EVENTS.CRAWL_STARTED, data);
    });
    crawlEngine.on(WS_EVENTS.CRAWL_PROGRESS, (data) => {
      broadcastUpdate(WS_EVENTS.CRAWL_PROGRESS, data);
    });
    crawlEngine.on(WS_EVENTS.WHISPER_BLOCK_CREATED, (data) => {
      broadcastUpdate(WS_EVENTS.WHISPER_BLOCK_CREATED, data);
    });
    crawlEngine.on(WS_EVENTS.CRAWL_COMPLETED, async (data) => {
      broadcastUpdate(WS_EVENTS.CRAWL_COMPLETED, data);
      
      console.log('Crawl completed, saving memory block', data);
      
      // Assume you have a way to get the current logged in user and session id.
      const loggedInUser = /* your logic to get the user */;
      const currentSessionId = /* your session id logic */;
      
      if (loggedInUser) {
        try {
          const res = await fetch('/api/memory-blocks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: loggedInUser.id,
              session_id: currentSessionId,
              crawlResults: data
            })
          });
          const json = await res.json();
          console.log('Memory block saved:', json);
        } catch (error) {
          console.error('Error saving memory block:', error);
        }
      }
    });
    crawlEngine.on(WS_EVENTS.CRAWL_ERROR, (data) => {
      broadcastUpdate(WS_EVENTS.CRAWL_ERROR, data);
    });

    // Listen for a crawl request from the client. Expected format: { action: "start_crawl", url: "https://example.com" }
    wsConnection.on('message', (message) => {
      try {
        const parsed = JSON.parse(message.toString());
        if (parsed.action === "start_crawl" && parsed.url) {
          crawlEngine.startCrawl(parsed.url);
        }
      } catch (error) {
        console.error("Invalid message received:", message);
      }
    });
  });

  return { wss, crawlEngine };
}; 