import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Return mock responses until Supabase is set up
export async function POST(req: NextRequest) {
  // Use supabase client here
  return NextResponse.json({ message: "Website saved" })
}

export async function GET(req: NextRequest) {
  return NextResponse.json([])
}

