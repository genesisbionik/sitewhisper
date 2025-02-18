import { useEffect, useState } from 'react';

interface MemoryBlock {
  id: string;
  user_id: string;
  session_id: string;
  results: any;
  created_at: string;
}

export default function MemoryBlockList() {
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Replace this with your actual user ID retrieval from session/authentication context.
  const userId = 'current-user-id';

  useEffect(() => {
    async function fetchMemoryBlocks() {
      const res = await fetch(`/api/memory-blocks?userId=${userId}`);
      const data = await res.json();
      setMemoryBlocks(data.memoryBlocks);
      setLoading(false);
    }
    fetchMemoryBlocks();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  if (!memoryBlocks || memoryBlocks.length === 0) {
    return <div>No memory blocks have been saved yet.</div>;
  }

  return (
    <div>
      <h2>Your Memory Blocks</h2>
      {memoryBlocks.map((block) => (
        <div key={block.id} className="memory-block">
          <h3>Session: {block.session_id}</h3>
          <pre>{JSON.stringify(block.results, null, 2)}</pre>
          <small>Saved at: {new Date(block.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
} 