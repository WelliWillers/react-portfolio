'use server'

import { revalidatePath } from 'next/cache'
import { createContact, updateContact, deleteContact } from '@/application/use-cases'

export async function createContactAction(data: any) {
  await createContact(data)
  revalidatePath('/admin/settings/contacts')
  revalidatePath('/')
}

export async function updateContactAction(id: string, data: any) {
  await updateContact(id, data)
  revalidatePath('/admin/settings/contacts')
  revalidatePath('/')
}

export async function deleteContactAction(id: string) {
  await deleteContact(id)
  revalidatePath('/admin/settings/contacts')
  revalidatePath('/')
}
