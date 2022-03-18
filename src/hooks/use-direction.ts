import type { MoveDirection } from '../types';

import { useState } from './use-state';

export function useDirection() {
  const [direction, setDirection] = useState<MoveDirection>('direction');
  const [directionQueue, setDirectionQueue] = useState<MoveDirection[]>('directionQueue');

  return {
    directionQueue,
    setDirectionQueue,

    direction,
    setDirection,
  };
}
