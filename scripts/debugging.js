function checkIntegrity_SLOW() {
  let failedCheck = null;
  let foodCount = 0;
  const allKeys = new Set();

  for (let top = 0; top < ROWS; top += 1) {
    for (let left = 0; left < COLS; left += 1) {
      let key = toKey([top, left]);

      allKeys.add(key);

      if (key === currentFoodKey) {
        foodCount += 1;
      }
    }
  }

  if (foodCount !== 1) {
    failedCheck = "there cannot be two foods";
  }

  let [snakeKeys, vacantKeys] = partitionCells(currentSnake);

  if (!areSameSets_SLOW(snakeKeys, currentSnakeKeys)) {
    failedCheck = "snake keys don’t match";
  }

  if (!areSameSets_SLOW(vacantKeys, currentVacantKeys)) {
    failedCheck = "vacant keys don’t match";
  }

  if (currentSnakeKeys.has(currentFoodKey)) {
    failedCheck = "there’s food in the snake";
  }

  if (currentSnake.length !== currentSnakeKeys.size) {
    failedCheck = "the snake intersects itself";
  }

  if (
    !areSameSets_SLOW(
      new Set([...currentSnakeKeys, ...currentVacantKeys]),
      allKeys
    )
  ) {
    failedCheck = "something is out of bounds";
  }

  for (let i = 1 /* intentional */; i < currentSnake.length; i += 1) {
    const cell = currentSnake[i];
    const prevCell = currentSnake[i - 1];
    const dy = cell[0] - prevCell[0];
    const dx = cell[1] - prevCell[1];
    const isOk =
      (dy === 0 && Math.abs(dx) === 1) || (dx === 0 && Math.abs(dy) === 1);

    if (!isOk) {
      failedCheck = "the snake has a break";
    }
  }

  if (failedCheck !== null) {
    stopGame(false);

    canvas.style.borderColor = "purple";

    throw Error(failedCheck);
  }
}

function areSameSets_SLOW(a, b) {
  return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
}
