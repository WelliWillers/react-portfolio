'use server'

import { revalidatePath } from 'next/cache'
import { upsertProfile } from '@/application/use-cases'

export async function updateProfileAction(data: any) {
  await upsertProfile(data)
  revalidatePath('/admin/settings/profile')
  revalidatePath('/')
}
