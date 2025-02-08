import express from 'express';
import http from 'http';
import { setupWebSocketServer } from '@/lib/crawl-engine';

const app = express();
const server = http.createServer(app);

// Set up your routes and middleware as needed
app.get('/', (req, res) => {
  res.send('SiteWhisper is running!');
});

// Initialize the WebSocket server
const { wss } = setupWebSocketServer(server);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening on port ${process.env.PORT || 3000}`);
}); 