import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  try {
    const blob = await put(file.name, file, { access: 'public' })
    return NextResponse.json({ url: blob.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
