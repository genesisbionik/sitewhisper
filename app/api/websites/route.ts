import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Return mock responses until Supabase is set up
export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Website saved" })
}

export async function GET(req: NextRequest) {
  return NextResponse.json([])
}

