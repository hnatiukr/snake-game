window.addEventListener('keydown', (event) => {
  if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  event.preventDefault();

  switch (event.key) {
    case 'ArrowLeft':
    case 'A':
    case 'a': {
      useMoveSound(moveLeft);

      directionQueue.push(moveLeft);

      break;
    }

    case 'ArrowRight':
    case 'D':
    case 'd': {
      useMoveSound(moveRight);

      directionQueue.push(moveRight);

      break;
    }

    case 'ArrowUp':
    case 'W':
    case 'w': {
      useMoveSound(moveUp);

      directionQueue.push(moveUp);

      break;
    }

    case 'ArrowDown':
    case 'S':
    case 's': {
      useMoveSound(moveDown);

      directionQueue.push(moveDown);

      break;
    }

    case 'R':
    case 'r': {
      stopGame(false);
      startGame();

      break;
    }

    case 'Enter': {
      if (startScreen.dataset.open === 'true') {
        startScreen.dataset.open = 'false';
        startScreen.style.visibility = 'hidden';

        initializeCanvas();
        startGame();
      }

      break;
    }

    case ' ': {
      step();

      break;
    }
  }
});

start.addEventListener('click', (event) => {
  event.preventDefault();

  startScreen.style.visibility = 'hidden';

  initializeCanvas();
  startGame();
});

restart.addEventListener('click', (event) => {
  event.preventDefault();

  stopGame(false);
  startGame();
});
