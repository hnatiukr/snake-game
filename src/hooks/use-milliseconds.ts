import { useState } from './use-state';

export function useMilliseconds(initialValue = 100) {
  const [milliseconds, setMilliseconds] = useState('milliseconds', initialValue);

  return {
    milliseconds,
    setMilliseconds,
  };
}
