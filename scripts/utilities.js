function areOpposite(dir1, dir2) {
  if (dir1 === moveLeft && dir2 === moveRight) {
    return true;
  }

  if (dir1 === moveRight && dir2 === moveLeft) {
    return true;
  }

  if (dir1 === moveUp && dir2 === moveDown) {
    return true;
  }

  if (dir1 === moveDown && dir2 === moveUp) {
    return true;
  }

  return false;
}

function areSame(dir1, dir2) {
  if (dir1 === moveLeft && dir2 === moveLeft) {
    return true;
  }

  if (dir1 === moveRight && dir2 === moveRight) {
    return true;
  }

  if (dir1 === moveUp && dir2 === moveUp) {
    return true;
  }

  if (dir1 === moveDown && dir2 === moveDown) {
    return true;
  }

  return false;
}

function partitionCells(snake) {
  const snakeKeys = new Set();
  const vacantKeys = new Set();

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

function checkValidHead(keys, cell) {
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

function makeInitialSnake(length) {
  const initialSnake = [];

  for (let index of [...Array(length).keys()]) {
    initialSnake[index] = [0, index];
  }

  return initialSnake;
}

function toKey([top, left]) {
  return top + "_" + left;
}

function isEven(number) {
  return number % 2 === 0;
}

function isOdd(number) {
  return Math.abs(number % 2) === 1;
}

function useMoveSound(direction) {
  if (!areSame(currentDirection, direction) && !gameOver) {
    moveSound.pause();
    moveSound.currentTime = 0;
    moveSound.play();
  }
}
