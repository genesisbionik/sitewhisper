export interface MemoryBlockData {
  id: string;
  title: string;
  content: string;
  type: string;
  // Optionally, add an embedding: number[] property
}

export function getRelevantContext(query: string, blocks: MemoryBlockData[]): string {
  // For now, perform a simple keyword search (case-insensitive)
  const matchingBlocks = blocks.filter((block) =>
    block.content.toLowerCase().includes(query.toLowerCase())
  );
  // Limit to a maximum of 3 blocks for context
  const topBlocks = matchingBlocks.slice(0, 3);
  return topBlocks.map((block) => block.content).join("\n\n");
} 