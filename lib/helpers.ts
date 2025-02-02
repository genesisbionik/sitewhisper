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

export function getSummaryContext(): string {
  // TODO: Replace with your actual logic.
  return "Summary context placeholder";
}

export function getDetailedMemoryBlock(): string {
  // TODO: Replace with your actual logic.
  return "Detailed memory block placeholder";
} 