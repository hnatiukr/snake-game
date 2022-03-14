function step() {
  let nextDirection = currentDirection;

  while (directionQueue.length > 0) {
    const candidateDirection = directionQueue.shift();

    if (!areOpposite(candidateDirection, currentDirection)) {
      nextDirection = candidateDirection;

      break;
    }
  }

  currentDirection = nextDirection;

  const head = currentSnake[currentSnake.length - 1];
  const nextHead = currentDirection(head);

  if (!checkValidHead(currentSnakeKeys, nextHead)) {
    stopGame(false);

    return;
  }

  pushHead(nextHead);

  if (toKey(nextHead) === currentFoodKey) {
    moveSound.pause();
    moveSound.currentTime = 0;
    eatSound.play();

    score += 1;

    updateTimeout();
    saveScore();

    const nextFoodKey = spawnFood();

    if (nextFoodKey === null) {
      stopGame(true);

      return;
    }

    currentFoodKey = nextFoodKey;
  } else {
    popTail();
  }

  drawCanvas();

  if (window.location.search === "?debug") {
    checkIntegrity_SLOW();
  }
}

function pushHead(nextHead) {
  currentSnake.push(nextHead);

  const key = toKey(nextHead);

  currentVacantKeys.delete(key);
  currentSnakeKeys.add(key);
}

function popTail() {
  const tail = currentSnake.shift();
  const key = toKey(tail);

  currentVacantKeys.add(key);
  currentSnakeKeys.delete(key);
}

function spawnFood() {
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

  throw Error("should never get here");
}

function saveScore() {
  gameOverScore.innerHTML = score;
  scoreInGame.innerHTML = score;

  if (window.localStorage.hasOwnProperty("score")) {
    if (score > Number(window.localStorage.getItem("score"))) {
      gameOverBestScore.innerHTML = score;

      window.localStorage.setItem("score", JSON.stringify(score));
    } else {
      gameOverBestScore.innerHTML = window.localStorage.getItem("score");
    }
  } else {
    gameOverBestScore.innerHTML = score;

    window.localStorage.setItem("score", JSON.stringify(score));
  }
}

function updateTimeout() {
  if (timeout <= 35) {
    return timeout;
  }

  timeout -= 5;

  return timeout;
}
