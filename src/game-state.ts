import { useState } from './state';
import { drawCanvas } from './rendering';
import { COLS, ROWS } from './constants';
import type { Coordinates, Key, MoveDirection, SetKeys, Snake } from './types';
import {
  move,
  toKey,
  areOpposite,
  checkValidHead,
  partitionCells,
  makeInitialSnake,
} from './utilities';
import {
  canvas,
  moveSound,
  eatSound,
  startSound,
  gameOverSound,
  gameOverScore,
  scoreInGame,
  gameOverScreen,
  gameOverBestScore,
} from './html-elements';

export let ms = 100;
export let score = 0;
export let gameOver = false;

export let currentSnake: Snake;
export let currentVacantKeys: SetKeys;
export let gameInterval: NodeJS.Timeout | null = null;

export function step(): void {
  const [currentDirection, setCurrentDirection] = useState<MoveDirection>('currentDirection');

  let nextDirection = currentDirection;

  const [directionQueue] = useState<MoveDirection[]>('directionQueue');

  while (directionQueue.length > 0) {
    const candidateDirection = directionQueue.shift();

    if (candidateDirection && !areOpposite(candidateDirection, currentDirection)) {
      nextDirection = candidateDirection;

      break;
    }
  }

  setCurrentDirection(nextDirection);

  const head = currentSnake[currentSnake.length - 1];
  const nextHead = currentDirection(head);

  const [currentSnakeKeys] = useState<SetKeys>('currentSnakeKeys');

  if (!checkValidHead(currentSnakeKeys, nextHead)) {
    stopGame(false);

    return;
  }

  pushHead(nextHead);

  const [currentFoodKey, setCurrentFoodKey] = useState<Key>('currentFoodKey');

  if (toKey(nextHead) === currentFoodKey) {
    moveSound.pause();
    moveSound.currentTime = 0;
    eatSound.play();

    score += 1;

    updateTimeout();
    saveScore();

    const nextFoodKey = spawnFood() as Key;

    if (nextFoodKey === null) {
      stopGame(true);

      return;
    }

    setCurrentFoodKey(nextFoodKey);
  } else {
    popTail();
  }

  drawCanvas();
}

export function pushHead(nextHead: Coordinates): void {
  currentSnake.push(nextHead);

  const key = toKey(nextHead);

  currentVacantKeys.delete(key);

  const [currentSnakeKeys] = useState<SetKeys>('currentSnakeKeys');

  currentSnakeKeys.add(key);
}

export function popTail() {
  const tail = currentSnake.shift();

  if (tail) {
    const key = toKey(tail);

    currentVacantKeys.add(key);

    const [currentSnakeKeys] = useState<SetKeys>('currentSnakeKeys');

    currentSnakeKeys.delete(key);
  }
}

export function spawnFood(): null | Key | void {
  if (currentVacantKeys.size === 0) {
    return null;
  }

  const choice = Math.floor(Math.random() * currentVacantKeys.size);

  let i = 0;

  for (let key of currentVacantKeys) {
    if (i === choice) {
      return key;
    }

    i += 1;
  }

  throw Error('should never get here');
}

export function saveScore(): void {
  gameOverScore.innerHTML = score.toString();
  scoreInGame.innerHTML = score.toString();

  if (window.localStorage.hasOwnProperty('score')) {
    if (score > Number(window.localStorage.getItem('score'))) {
      gameOverBestScore.innerHTML = score.toString();

      window.localStorage.setItem('score', JSON.stringify(score));
    } else {
      gameOverBestScore.innerHTML = window.localStorage.getItem('score') as string;
    }
  } else {
    gameOverBestScore.innerHTML = score.toString();

    window.localStorage.setItem('score', JSON.stringify(score));
  }
}

export function updateTimeout(): number {
  if (ms <= 35) {
    return ms;
  }

  ms -= 5;

  return ms;
}

export function stopGame(isSuccessfully: boolean): void {
  gameOver = true;
  gameOverSound.play();

  scoreInGame.style.visibility = 'hidden';
  gameOverScreen.style.visibility = 'visible';
  canvas.style.borderColor = isSuccessfully ? 'darkgreen' : '#FFD829';

  saveScore();
  clearInterval(gameInterval as NodeJS.Timeout);
}

export function startGame(): void {
  ms = 80;
  score = 0;
  gameOver = false;

  startSound.play();

  const [, setDirectionQueue] = useState<MoveDirection[]>('directionQueue');
  const [, setCurrentDirection] = useState<MoveDirection>('currentDirection');

  setDirectionQueue([]);
  setCurrentDirection(move.right);
  currentSnake = makeInitialSnake(5);

  const [currentSnakeKeys, setCurrentSnakeKeys] = useState<SetKeys>('currentSnakeKeys');

  setCurrentSnakeKeys(new Set());
  currentVacantKeys = new Set();

  scoreInGame.style.visibility = 'visible';
  gameOverScreen.style.visibility = 'hidden';

  for (let top = 0; top < ROWS; top += 1) {
    for (let left = 0; left < COLS; left += 1) {
      currentVacantKeys.add(toKey([top, left]));
    }
  }

  for (let cell of currentSnake) {
    const key = toKey(cell);

    currentVacantKeys.delete(key);
    currentSnakeKeys.add(key);
  }

  const [, setCurrentFoodKey] = useState<Key>('currentFoodKey');

  setCurrentFoodKey(spawnFood() as Key);

  const [snakeKeys, vacantKeys] = partitionCells(currentSnake);

  setCurrentSnakeKeys(snakeKeys);
  currentVacantKeys = vacantKeys;

  canvas.style.borderColor = '';
  gameOverScore.innerHTML = score.toString();
  scoreInGame.innerHTML = score.toString();

  gameInterval = setInterval(step, updateTimeout());

  drawCanvas();
}
