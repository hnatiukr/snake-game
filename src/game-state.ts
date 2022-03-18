import { COLS, ROWS } from './constants';
import { drawCanvas } from './rendering';
import type { Coordinates, Key } from './types';
import { useSnake, useFood, useDirection, useScore, useScreen, useMilliseconds } from './hooks';
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

export let gameInterval: NodeJS.Timeout | null = null;

export function step(): void {
  const { snake, snakeKeys } = useSnake();
  const { directionQueue, direction, setDirection } = useDirection();

  let nextDirection = direction;

  while (directionQueue.length > 0) {
    const candidateDirection = directionQueue.shift();

    if (candidateDirection && !areOpposite(candidateDirection, direction)) {
      nextDirection = candidateDirection;

      break;
    }
  }

  setDirection(nextDirection);

  const head = snake[snake.length - 1];
  const nextHead = direction(head);

  if (!checkValidHead(snakeKeys, nextHead)) {
    stopGame(false);

    return;
  }

  pushHead(nextHead);

  const { foodKey, setFoodKey } = useFood();

  if (toKey(nextHead) === foodKey) {
    const { score, setScore } = useScore();

    moveSound.pause();
    moveSound.currentTime = 0;
    eatSound.play();

    setScore(score + 1);

    updateTimeout();
    saveScore();

    const nextFoodKey = spawnFood() as Key;

    if (nextFoodKey === null) {
      stopGame(true);

      return;
    }

    setFoodKey(nextFoodKey);
  } else {
    popTail();
  }

  drawCanvas();
}

export function pushHead(nextHead: Coordinates): void {
  const { snake } = useSnake();
  const { snakeKeys, snakeVacantKeys } = useSnake();

  const key = toKey(nextHead);

  snake.push(nextHead);
  snakeVacantKeys.delete(key);
  snakeKeys.add(key);
}

export function popTail() {
  const { snake, snakeKeys, snakeVacantKeys } = useSnake();

  const tail = snake.shift();

  if (tail) {
    const key = toKey(tail);

    snakeVacantKeys.add(key);
    snakeKeys.delete(key);
  }
}

export function spawnFood(): null | Key | void {
  const { snakeVacantKeys } = useSnake();

  if (snakeVacantKeys.size === 0) {
    return null;
  }

  const choice = Math.floor(Math.random() * snakeVacantKeys.size);

  let i = 0;

  for (let key of snakeVacantKeys) {
    if (i === choice) {
      return key;
    }

    i += 1;
  }

  throw Error('should never get here');
}

export function saveScore(): void {
  // TODO: refactor

  const { score, strigifyScore } = useScore();

  scoreInGame.innerHTML = strigifyScore;
  gameOverScore.innerHTML = strigifyScore;

  if (window.localStorage.hasOwnProperty('score')) {
    if (score > Number(window.localStorage.getItem('score'))) {
      gameOverBestScore.innerHTML = strigifyScore;

      window.localStorage.setItem('score', strigifyScore);
    } else {
      gameOverBestScore.innerHTML = window.localStorage.getItem('score') as string;
    }
  } else {
    gameOverBestScore.innerHTML = strigifyScore;

    window.localStorage.setItem('score', strigifyScore);
  }
}

export function updateTimeout(): number {
  const { milliseconds, setMilliseconds } = useMilliseconds(100);

  if (milliseconds <= 35) {
    return milliseconds;
  } else {
    setMilliseconds(milliseconds - 5);
  }

  return milliseconds;
}

export function stopGame(isSuccessfully: boolean): void {
  const { setScreen } = useScreen();

  setScreen('gameOver');

  gameOverSound.play();
  scoreInGame.style.visibility = 'hidden';
  gameOverScreen.style.visibility = 'visible';
  canvas.style.borderColor = isSuccessfully ? 'darkgreen' : '#FFD829';

  saveScore();
  clearInterval(gameInterval as NodeJS.Timeout);
}

export function startGame(): void {
  const { score } = useScore(0);
  const { setFoodKey } = useFood();
  const { setScreen } = useScreen();
  const { setDirectionQueue, setDirection } = useDirection();
  const { milliseconds, setMilliseconds } = useMilliseconds();
  const { snake, setSnake, snakeKeys, setSnakeKeys, snakeVacantKeys, setSnakeVacantKeys } =
    useSnake();

  startSound.play();

  setScreen('inGame');
  setMilliseconds(100);
  setDirectionQueue([]);
  setDirection(move.right);
  setSnake(makeInitialSnake(5));
  setSnakeKeys(new Set());
  setSnakeVacantKeys(new Set());

  scoreInGame.style.visibility = 'visible';
  gameOverScreen.style.visibility = 'hidden';

  for (let top = 0; top < ROWS; top += 1) {
    for (let left = 0; left < COLS; left += 1) {
      snakeVacantKeys.add(toKey([top, left]));
    }
  }

  for (let cell of snake) {
    const key = toKey(cell);

    snakeVacantKeys.delete(key);
    snakeKeys.add(key);
  }

  setFoodKey(spawnFood() as Key);

  const [currentKeys, vacantKeys] = partitionCells(snake);

  setSnakeKeys(currentKeys);
  setSnakeVacantKeys(vacantKeys);

  canvas.style.borderColor = '';
  scoreInGame.innerHTML = score.toString();
  gameOverScore.innerHTML = score.toString();

  gameInterval = setInterval(step, milliseconds);

  drawCanvas();
}
