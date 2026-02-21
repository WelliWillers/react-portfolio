'use server'

import { revalidatePath } from 'next/cache'
import { createCertificate, deleteCertificate } from '@/application/use-cases'

export async function createCertificateAction(data: any) {
  await createCertificate(data)
  revalidatePath('/admin/settings/certificates')
  revalidatePath('/')
}

export async function deleteCertificateAction(id: string) {
  await deleteCertificate(id)
  revalidatePath('/admin/settings/certificates')
  revalidatePath('/')
}
