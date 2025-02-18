import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    // For simplicity, get the user id from query parameters. In a real app,
    // you should extract the user ID from the session (or use proper authentication middleware).
    const { userId } = req.query;

    const { data, error } = await supabase
      .from('memory_blocks')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error });
    }
    return res.status(200).json({ memoryBlocks: data });
  } else if (method === 'POST') {
    /* Expected body:
         {
           user_id: string;
           session_id: string;
           crawlResults: any; // data from the crawl session
         }
    */
    const { user_id, session_id, crawlResults } = req.body;

    const { data, error } = await supabase
      .from('memory_blocks')
      .insert([{ user_id, session_id, results: crawlResults }]);

    if (error) {
      return res.status(500).json({ error });
    }
    return res.status(200).json({ memoryBlock: data });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
} 