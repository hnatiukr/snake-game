import { useState } from './use-state';

export function useMilliseconds(initialValue = 90) {
  const [milliseconds, setMilliseconds] = useState('milliseconds', initialValue);

  return {
    milliseconds,
    setMilliseconds,
  };
}
