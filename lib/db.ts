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