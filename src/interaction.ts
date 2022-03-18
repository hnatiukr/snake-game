import { useDirection } from './hooks';
import { initializeCanvas } from './rendering';
import { move, useMoveSound } from './utilities';
import { startGame, stopGame, step } from './game-state';
import { startScreen, startButton, restartButton } from './html-elements';

window.addEventListener('keydown', (event) => {
  if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  event.preventDefault();

  switch (event.key) {
    case 'ArrowLeft':
    case 'A':
    case 'a': {
      useMoveSound(move.left);
      const { directionQueue, setDirectionQueue } = useDirection();

      setDirectionQueue([...directionQueue, move.left]);

      break;
    }

    case 'ArrowRight':
    case 'D':
    case 'd': {
      useMoveSound(move.right);
      const { directionQueue, setDirectionQueue } = useDirection();

      setDirectionQueue([...directionQueue, move.right]);

      break;
    }

    case 'ArrowUp':
    case 'W':
    case 'w': {
      useMoveSound(move.up);
      const { directionQueue, setDirectionQueue } = useDirection();

      setDirectionQueue([...directionQueue, move.up]);

      break;
    }

    case 'ArrowDown':
    case 'S':
    case 's': {
      useMoveSound(move.down);
      const { directionQueue, setDirectionQueue } = useDirection();

      setDirectionQueue([...directionQueue, move.down]);

      console.log('down');
      console.log('directionQueue after push down', directionQueue);

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

startButton.addEventListener('click', (event) => {
  event.preventDefault();

  startScreen.style.visibility = 'hidden';

  initializeCanvas();
  startGame();
});

restartButton.addEventListener('click', (event) => {
  event.preventDefault();

  stopGame(false);
  startGame();
});
