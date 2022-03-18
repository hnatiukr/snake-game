import type { Snake, SetKeys } from '../types';

import { useState } from './use-state';

export function useSnake() {
  const [snake, setSnake] = useState<Snake>('snake');
  const [snakeKeys, setSnakeKeys] = useState<SetKeys>('snakeKeys');
  const [snakeVacantKeys, setSnakeVacantKeys] = useState<SetKeys>('snakeVacantKeys');

  return {
    snake,
    setSnake,

    snakeKeys,
    setSnakeKeys,

    snakeVacantKeys,
    setSnakeVacantKeys,
  };
}
