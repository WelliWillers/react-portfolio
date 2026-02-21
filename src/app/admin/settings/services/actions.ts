'use server'

import { revalidatePath } from 'next/cache'
import { createService, updateService, deleteService } from '@/application/use-cases'

export async function createServiceAction(data: any) {
  await createService(data)
  revalidatePath('/admin/settings/services')
  revalidatePath('/')
}

export async function updateServiceAction(id: string, data: any) {
  await updateService(id, data)
  revalidatePath('/admin/settings/services')
  revalidatePath('/')
}

export async function deleteServiceAction(id: string) {
  await deleteService(id)
  revalidatePath('/admin/settings/services')
  revalidatePath('/')
}
