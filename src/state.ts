import type { Key, MoveDirection, SetKeys } from './types';

export let currentFoodKey: Key;
export let currentSnakeKeys: SetKeys;
export let directionQueue: MoveDirection[];
export let currentDirection: MoveDirection;

export function setCurrentSnakeKeys(snakeKeys: SetKeys): void {
  currentSnakeKeys = snakeKeys;
}

export function setCurrentFoodKey(foodKey: Key): void {
  currentFoodKey = foodKey;
}

export function setCurrentDirection(direction: MoveDirection): void {
  currentDirection = direction;
}

export function setDirectionQueue(queue: MoveDirection[]): void {
  directionQueue = queue;
}

const hooks = new Map();

export function useState<T>(key: string, initialState?: T): [T, (value: T) => void] {
  if (!hooks.has(key)) {
    hooks.set(key, initialState);
  }

  return [hooks.get(key), (value) => hooks.set(key, value)];
}
