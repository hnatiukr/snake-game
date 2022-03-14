window.addEventListener("keydown", (event) => {
  if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  event.preventDefault();

  switch (event.key) {
    case "ArrowLeft":
    case "A":
    case "a": {
      directionQueue.push(moveLeft);

      break;
    }

    case "ArrowRight":
    case "D":
    case "d": {
      directionQueue.push(moveRight);

      break;
    }

    case "ArrowUp":
    case "W":
    case "w": {
      directionQueue.push(moveUp);

      break;
    }

    case "ArrowDown":
    case "S":
    case "s": {
      directionQueue.push(moveDown);

      break;
    }

    case "R":
    case "r": {
      stopGame(false);
      startGame();

      break;
    }

    case "Enter": {
      if (startScreen.dataset.open === "true") {
        startScreen.dataset.open = "false";
        startScreen.style.visibility = "hidden";

        initializeCanvas();
        startGame();
      }

      break;
    }

    case " ": {
      step();

      break;
    }
  }
});

function stopGame(isSuccessfully) {
  gameOverScreen.style.visibility = "visible";
  canvas.style.borderColor = isSuccessfully ? "darkgreen" : "#FFD829";

  saveScore();
  clearInterval(gameInterval);
}

function startGame() {
  score = 0;
  timeout = 80;
  directionQueue = [];
  currentDirection = moveRight;
  currentSnake = makeInitialSnake();
  currentSnakeKeys = new Set();
  currentVacantKeys = new Set();

  gameOverScreen.style.visibility = "hidden";

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

  currentFoodKey = spawnFood();

  const [snakeKeys, vacantKeys] = partitionCells(currentSnake);

  currentSnakeKeys = snakeKeys;
  currentVacantKeys = vacantKeys;

  canvas.style.borderColor = "";
  currentScore.innerHTML = score.toString();

  gameInterval = setInterval(step, updateTimeout());

  drawCanvas();
}

start.addEventListener("click", (event) => {
  event.preventDefault();

  startScreen.style.visibility = "hidden";

  initializeCanvas();
  startGame();
});

restart.addEventListener("click", (event) => {
  event.preventDefault();

  stopGame(false);
  startGame();
});
