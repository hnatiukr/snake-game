import type { SetKeys } from '../types';
import { makeInitialSnake } from '../utilities';

import { useState } from './use-state';

export function useSnake() {
  const [snake, setSnake] = useState('snake', makeInitialSnake(5));
  const [snakeKeys, setSnakeKeys] = useState<SetKeys>('snakeKeys', new Set());
  const [snakeVacantKeys, setSnakeVacantKeys] = useState<SetKeys>('snakeVacantKeys', new Set());

  return {
    snake,
    setSnake,

    snakeKeys,
    setSnakeKeys,

    snakeVacantKeys,
    setSnakeVacantKeys,
  };
}
