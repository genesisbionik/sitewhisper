import React from "react";

interface BrowserPreviewProps {
  url: string;
  loading: boolean;
  screenshot?: string; // Optional: URL or base64 image once the crawl provides a preview.
}

export default function BrowserPreview({ url, loading, screenshot }: BrowserPreviewProps) {
  return (
    <div className="browser-preview border rounded shadow-lg max-w-full">
      {/* Browser header */}
      <div className="browser-header bg-gray-200 p-2 flex items-center justify-between rounded-t">
        <div className="browser-url flex items-center flex-1 space-x-2">
          <span className="px-2 py-1 bg-white border rounded text-xs">https://</span>
          <input 
            type="text"
            value={url}
            readOnly
            className="w-full border rounded p-1 text-xs bg-white"
          />
        </div>
        <div className="browser-controls flex space-x-2 ml-2">
          <button className="p-1 bg-white rounded border text-xs">🔄</button>
          <button className="p-1 bg-white rounded border text-xs">✕</button>
        </div>
      </div>
      {/* Browser body */}
      <div className="browser-body bg-white p-4" style={{ minHeight: '200px' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500 animate-pulse">Crawling in progress...</span>
          </div>
        ) : screenshot ? (
          <img src={screenshot} alt="Browser Preview" className="w-full rounded" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500">No Preview Available</span>
          </div>
        )}
      </div>
    </div>
  );
} 