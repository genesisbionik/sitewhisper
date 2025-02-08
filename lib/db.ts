import { supabase } from '@/lib/supabase';

export interface MemoryBlockInsertData {
  website_id?: string;    // if applicable
  user_id: string;
  name: string;
  type: string;
  status: string;
  content: string;
  metadata?: object;
}

export async function saveMemoryBlock(data: MemoryBlockInsertData) {
  const { error, data: result } = await supabase
    .from('memory_blocks')
    .insert([data])
    .select()
  
  if (error) {
    throw new Error(error.message);
  }

  return result;
}

async function saveWhisperMemory(userId: string, websiteId: string | undefined, analysisContent: string) {
  try {
    // Construct the memory block payload
    const memoryBlock = {
      user_id: userId,
      website_id: websiteId, // Pass undefined if not applicable
      name: `Whisper Memory Block (${new Date().toLocaleString()})`,
      type: "whisper",
      status: "complete",
      content: analysisContent,
      metadata: { createdBy: "SiteWhisper", note: "Saved after website crawl" },
    };

    // Save the memory block in the database
    const savedBlock = await saveMemoryBlock(memoryBlock);
    console.log("Memory block saved successfully:", savedBlock);
  } catch (error) {
    console.error("Error saving Whisper memory block:", error);
  }
} 