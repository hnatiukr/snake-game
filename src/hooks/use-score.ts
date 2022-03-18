import { useState } from './use-state';

export function useScore(initialValue = 0) {
  const [score, setScore] = useState('score', initialValue);

  return {
    score,
    setScore,
    strigifyScore: score.toString(),
  };
}
