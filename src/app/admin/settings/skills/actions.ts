'use server'

import { revalidatePath } from 'next/cache'
import { createSkill, updateSkill, deleteSkill } from '@/application/use-cases'

export async function createSkillAction(data: any) {
  await createSkill(data)
  revalidatePath('/admin/settings/skills')
  revalidatePath('/')
}

export async function updateSkillAction(id: string, data: any) {
  await updateSkill(id, data)
  revalidatePath('/admin/settings/skills')
  revalidatePath('/')
}

export async function deleteSkillAction(id: string) {
  await deleteSkill(id)
  revalidatePath('/admin/settings/skills')
  revalidatePath('/')
}
