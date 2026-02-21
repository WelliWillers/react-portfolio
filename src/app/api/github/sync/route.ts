import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { syncGithubRepos } from '@/application/use-cases'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const result = await syncGithubRepos()
    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
