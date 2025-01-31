import { NextRequest, NextResponse } from 'next/server'
// Temporarily comment out Supabase initialization
// import { createClient } from '@supabase/supabase-js'
// 
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

export async function POST(req: NextRequest) {
  const { url, content, userId } = await req.json()

  try {
    const { data, error } = await supabase
      .from('websites')
      .insert({
        url,
        content,
        user_id: userId,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Request error', error)
    return NextResponse.json({ error: 'Error creating website' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Request error', error)
    return NextResponse.json({ error: 'Error fetching websites' }, { status: 500 })
  }
}

