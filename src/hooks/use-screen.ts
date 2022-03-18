import type { GameScreen } from '../types';

import { useState } from './use-state';

export function useScreen(initialValue: GameScreen = 'startGame') {
  const [screen, setScreen] = useState('screen', initialValue);

  return {
    screen,
    setScreen,
  };
}
