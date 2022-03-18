import type { Key } from '../types';

import { useState } from './use-state';

export function useFood(initialValue?: Key) {
  const [foodKey, setFoodKey] = useState('foodKey', initialValue);

  return {
    foodKey,
    setFoodKey,
  };
}
