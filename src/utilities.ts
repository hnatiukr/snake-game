import { ROWS, COLS } from './constants';
import { moveSound } from './html-elements';
import { useDirection, useScreen } from './hooks';
import type { Key, Direction, MoveDirection, Snake, SetKeys, Coordinates } from './types';

export const move: Record<Direction, MoveDirection> = {
  up: ([top, left]) => [top - 1, left],
  down: ([top, left]) => [top + 1, left],
  left: ([top, left]) => [top, left - 1],
  right: ([top, left]) => [top, left + 1],
};

export function areOpposite(dir1: MoveDirection, dir2: MoveDirection) {
  if (dir1 === move.left && dir2 === move.right) {
    return true;
  }

  if (dir1 === move.right && dir2 === move.left) {
    return true;
  }

  if (dir1 === move.up && dir2 === move.down) {
    return true;
  }

  if (dir1 === move.down && dir2 === move.up) {
    return true;
  }

  return false;
}

export function areSame(dir1: MoveDirection, dir2: MoveDirection) {
  if (dir1 === move.left && dir2 === move.left) {
    return true;
  }

  if (dir1 === move.right && dir2 === move.right) {
    return true;
  }

  if (dir1 === move.up && dir2 === move.up) {
    return true;
  }

  if (dir1 === move.down && dir2 === move.down) {
    return true;
  }

  return false;
}

export function partitionCells(snake: Snake): [SetKeys, SetKeys] {
  const snakeKeys: SetKeys = new Set();
  const vacantKeys: SetKeys = new Set();

  for (let top = 0; top < ROWS; top += 1) {
    for (let left = 0; left < COLS; left += 1) {
      vacantKeys.add(toKey([top, left]));
    }
  }

  for (let cell of snake) {
    const key = toKey(cell);

    vacantKeys.delete(key);
    snakeKeys.add(key);
  }

  return [snakeKeys, vacantKeys];
}

export function checkValidHead(keys: SetKeys, cell: Coordinates) {
  const [top, left] = cell;

  if (top < 0 || left < 0) {
    return false;
  }

  if (top >= ROWS || left >= COLS) {
    return false;
  }

  if (keys.has(toKey(cell))) {
    return false;
  }

  return true;
}

export function makeInitialSnake(length: number): Snake {
  const initialSnake: Snake = [];

  for (let index of [...Array(length).keys()]) {
    initialSnake[index] = [0, index];
  }

  return initialSnake;
}

export function toKey([top, left]: [number, number]): Key {
  return (top + '_' + left) as Key;
}

export function isEven(number: number): boolean {
  return number % 2 === 0;
}

export function isOdd(number: number): boolean {
  return Math.abs(number % 2) === 1;
}

export function useMoveSound(nextDirection: MoveDirection): void {
  const { screen } = useScreen();
  const { direction } = useDirection();

  if (!areSame(direction, nextDirection) && screen === 'inGame') {
    moveSound.pause();
    moveSound.currentTime = 0;
    moveSound.play();
  }
}
