"use client";

import React, { useEffect, useState } from "react";

interface WebSocketMessage {
  event: string;
  data: {
    status: string;
    progress: number;
    url: string;
    whisperBlockId?: string;
    timestamp: number;
  };
}

export default function CrawlStatusDisplay() {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Replace with your WebSocket endpoint (e.g., ws://localhost:3000)
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("Connected to crawl WebSocket server");
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setConnectionError("WebSocket connection error.");
    };

    ws.onclose = () => {
      console.warn("WebSocket connection closed, attempting to reconnect...");
      // Reconnection logic can be implemented here if needed
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-4 bg-gray-50 border rounded">
      {connectionError && (
        <div className="text-red-600 mb-2">{connectionError}</div>
      )}
      <h2 className="text-xl font-bold mb-4">Crawl Status Updates</h2>
      <ul className="space-y-2">
        {messages.map((msg, index) => (
          <li key={index} className="p-2 border rounded">
            <strong>{msg.event}</strong> at {new Date(msg.data.timestamp).toLocaleTimeString()}
            <br />
            Status: {msg.data.status} — Progress: {msg.data.progress}%
            {msg.data.whisperBlockId && (
              <>
                <br />
                WhisperBlock ID: {msg.data.whisperBlockId}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 