// <script src="src/scripts/utilities.js"></script>
// <script src="src/scripts/debugging.js"></script>

// refs, vars and constants

const canvas = document.getElementById("canvas");

const start = document.getElementById("start_button");
const restart = document.getElementById("restart_button");

const eatSound = document.getElementById("eat-sound");
const moveSound = document.getElementById("move-sound");
const startSound = document.getElementById("start-sound");
const gameOverSound = document.getElementById("game-over-sound");

const startScreen = document.getElementById("start_screen");
const gameOverScreen = document.getElementById("game_over_screen");

const scoreInGame = document.getElementById("score_in_game");
const gameOverScore = document.getElementById("game_over_score");
const gameOverBestScore = document.getElementById("game_over_best_score");

const ROWS = 30;
const COLS = 50;
const PIXEL = 20;

let timeout;
let score = 0;
let gameOver = false;
let gameInterval = null;
const pixels = new Map();

const moveUp = ([top, left]) => [top - 1, left];
const moveDown = ([top, left]) => [top + 1, left];
const moveLeft = ([top, left]) => [top, left - 1];
const moveRight = ([top, left]) => [top, left + 1];

let currentSnake;
let currentSnakeKeys;
let currentVacantKeys;
let currentFoodKey;
let currentDirection;
let directionQueue;

// canvas & rendering

function initializeCanvas() {
  for (let top = 0; top < ROWS; top += 1) {
    for (let left = 0; left < COLS; left += 1) {
      const pixel = document.createElement("div");

      pixel.style.position = "absolute";
      pixel.style.left = left * PIXEL + "px";
      pixel.style.top = top * PIXEL + "px";
      pixel.style.width = PIXEL + "px";
      pixel.style.height = PIXEL + "px";
      // pixel.style.border = "0.5px solid #ffd829";

      const key = toKey([top, left]);

      canvas.appendChild(pixel);
      pixels.set(key, pixel);
    }
  }
}

function drawCanvas() {
  for (let top = 0; top < ROWS; top += 1) {
    for (let left = 0; left < COLS; left += 1) {
      const key = toKey([top, left]);
      const pixel = pixels.get(key);

      let background = "#CFB997";

      if (key === currentFoodKey) {
        background = "orangered";
      } else if (currentSnakeKeys.has(key)) {
        const snakeKeysArray = [...currentSnakeKeys];
        const head = snakeKeysArray[snakeKeysArray.length - 1];

        if (key === head) {
          background = "#3C2317";
        } else {
          background = "#4E6C50";
        }
      }

      pixel.style.background = background;
    }
  }
}

// game management and instructions

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

function stopGame(isSuccessfully) {
  gameOver = true;
  gameOverSound.play();

  scoreInGame.style.visibility = "hidden";
  gameOverScreen.style.visibility = "visible";
  canvas.style.borderColor = isSuccessfully ? "darkgreen" : "#FFD829";

  saveScore();
  clearInterval(gameInterval);
}

function startGame() {
  gameOver = false;
  startSound.play();

  score = 0;
  timeout = 80;
  directionQueue = [];
  currentDirection = moveRight;
  currentSnake = makeInitialSnake(5);

  currentSnakeKeys = new Set();
  currentVacantKeys = new Set();

  scoreInGame.style.visibility = "visible";
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
  gameOverScore.innerHTML = score;
  scoreInGame.innerHTML = score;

  gameInterval = setInterval(step, updateTimeout());

  drawCanvas();
}

// user control

window.addEventListener("keydown", (event) => {
  if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  event.preventDefault();

  switch (event.key) {
    case "ArrowLeft":
    case "A":
    case "a": {
      useMoveSound(moveLeft);

      directionQueue.push(moveLeft);

      break;
    }

    case "ArrowRight":
    case "D":
    case "d": {
      useMoveSound(moveRight);

      directionQueue.push(moveRight);

      break;
    }

    case "ArrowUp":
    case "W":
    case "w": {
      useMoveSound(moveUp);

      directionQueue.push(moveUp);

      break;
    }

    case "ArrowDown":
    case "S":
    case "s": {
      useMoveSound(moveDown);

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

// helpers

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

// helpers

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
