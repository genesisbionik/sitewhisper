"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { MemoryBlock } from "@/components/memory-block"

interface MemoryBlockData {
  id: string
  name: string
  content: string
  type: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<MemoryBlockData[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsFetching(true);
        try {
          const { data, error } = await supabase
            .from('memory_blocks')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            toast({
              title: "Error loading memory blocks",
              description: error.message,
              variant: "destructive",
            });
          } else if (data) {
            setBlocks(data as MemoryBlockData[]);
          }
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchData();
  }, [user, toast]);

  if (loading || isFetching) {
    return <div className="container mx-auto py-12"><p>Loading Dashboard...</p></div>;
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Your Memory Blocks</h1>
      {blocks.length > 0 ? (
        blocks.map((block) => (
          <MemoryBlock 
            key={block.id}
            url={block.name} 
            content={block.content} 
            isSelected={false} 
            onClick={() => {}}
          />
        ))
      ) : (
        <div className="text-muted-foreground">
          No memory blocks have been saved yet.
        </div>
      )}
    </div>
  )
} 