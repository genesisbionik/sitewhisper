"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const tables = [
  'api_tokens',
  'archived_crawls',
  'banned_categories',
  'chat_messages',
  'crawl_logs',
  'crawl_results',
  'financial_metrics',
  'memory_blocks',
  'profiles',
  'referrals',
  'system_integrity_checks',
  'token_transactions',
  'websites',
  'whisper_mems'
]

export async function checkSupabaseHealth() {
  const supabase = createClientComponentClient()
  const results = []

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1)

      results.push({
        table,
        status: error ? 'error' : 'success',
        error: error?.message,
      })
    } catch (error) {
      results.push({
        table,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return results
} 