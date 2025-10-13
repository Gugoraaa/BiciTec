// src/i18n/request.ts
import {cookies} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  const store = await cookies(); // Next 14.3+/15: cookies() es async
  const locale = store.get('locale')?.value || 'es';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
