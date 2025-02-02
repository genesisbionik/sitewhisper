export interface MemoryBlockData {
  id: string;
  title: string;
  content: string;
  type: string;
  // Optionally, add an embedding: number[] property
}

export function getRelevantContext(query: string, blocks: MemoryBlockData[]): string {
  // Perform a simple keyword search (case-insensitive)
  const matchingBlocks = blocks.filter((block) =>
    block.content.toLowerCase().includes(query.toLowerCase())
  );
  // Limit to a maximum of 3 blocks for context
  const topBlocks = matchingBlocks.slice(0, 3);

  // Summarize each block's content by truncating if too long
  const summaryLength = 250; // Adjust as needed
  const summaries = topBlocks.map(block => {
    let summary = block.content;
    if (summary.length > summaryLength) {
      summary = summary.slice(0, summaryLength) + '...';
    }
    return `${block.title}:\n${summary}`;
  });

  return summaries.join("\n\n");
}

export function getSummaryContext(blocks: MemoryBlockData[]): string {
  // Find the consolidated memory block and parse its content
  const consolidated = blocks.find(b => b.id === "consolidated-block");
  if (consolidated) {
    try {
      const items = JSON.parse(consolidated.content);
      // For summary, simply state the count of pages (or other high-level info)
      return `Analyzed ${items.length} pages from genibot.ai.`;
    } catch (e) {
      console.error("Error parsing summary context:", e);
      return "";
    }
  }
  return "";
}

export function getDetailedMemoryBlock(blocks: MemoryBlockData[]): string {
  // Find the consolidated memory block and extract detailed data
  const consolidated = blocks.find(b => b.id === "consolidated-block");
  if (consolidated) {
    try {
      const items = JSON.parse(consolidated.content);
      // Combine details from each item (using a snippet of cleaned_html)
      return items.map((item: any) => {
        const snippet = item.cleaned_html ? item.cleaned_html.slice(0, 300) + "..." : "";
        return `${item.url}:\n${snippet}`;
      }).join("\n\n");
    } catch (e) {
      console.error("Error parsing detailed memory block:", e);
      return "";
    }
  }
  return "";
} 