import { useEffect } from 'react';

import { env } from '@/lib/env';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ?? env.appName;
    return () => {
      document.title = env.appName;
    };
  }, [title]);
}
