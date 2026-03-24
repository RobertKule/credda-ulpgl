import { db } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test Prisma DB
    await db.$queryRaw`SELECT 1`

    // Test Supabase Storage
    const { data: buckets } = await supabase.storage.listBuckets()

    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      storage: buckets ? 'connected' : 'not configured',
      provider: 'supabase',
      timestamp: new Date().toISOString(),
    })
  } catch (e: any) {
    return NextResponse.json({
      status: 'error',
      message: e.message,
    }, { status: 500 })
  }
}
