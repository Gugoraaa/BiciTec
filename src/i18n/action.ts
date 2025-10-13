'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function setLocale(formData: FormData) {
  const locale = formData.get('locale');
  if (locale !== 'es' && locale !== 'en') return;

  const store = await cookies(); 
  store.set('locale', String(locale), {
    path: '/',
    maxAge: 60 * 60 * 24 * 365
  });

  revalidatePath('/', 'layout');
}
