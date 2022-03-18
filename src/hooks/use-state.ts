import { store } from '../store';

export function useState<T>(key: string, initialState?: T): [T, (value: T) => void] {
  if (!store.hooks.has(key)) {
    store.hooks.set(key, initialState);
  }

  return [store.hooks.get(key), (value) => store.hooks.set(key, value)];
}
