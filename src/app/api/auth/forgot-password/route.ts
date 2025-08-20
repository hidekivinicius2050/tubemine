import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Funcionalidade temporariamente desabilitada' },
    { status: 503 }
  )
}
