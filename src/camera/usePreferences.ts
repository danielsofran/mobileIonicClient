import {GetResult, Preferences} from '@capacitor/preferences';
import { useCallback } from 'react';

export function usePreferences() {
  const get = useCallback<(key: string) => Promise<string | null>>(
    key => Preferences.get({ key }).then((result: GetResult) => result.value as string),
    []
  );

  const set = useCallback<(key: string, value: string) => Promise<void>>(
    (key, value) => Preferences.set({ key, value }),
    []
  );

  return { get, set };
}
