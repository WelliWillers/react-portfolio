'use server'

import { revalidatePath } from 'next/cache'
import { updateProject, deleteProject, createProject } from '@/application/use-cases'

export async function updateProjectAction(id: string, data: any) {
  await updateProject(id, data)
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function deleteProjectAction(id: string) {
  await deleteProject(id)
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function createProjectAction(data: any) {
  await createProject(data)
  revalidatePath('/admin/projects')
  revalidatePath('/')
}
