import { canvas } from './html-elements';
import { useFood, useSnake } from './hooks';
import { COLS, ROWS, PIXEL } from './constants';
import { toKey, isOdd, isEven } from './utilities';

const pixels = new Map();

export function initializeCanvas(): void {
  for (let top = 0; top < ROWS; top += 1) {
    for (let left = 0; left < COLS; left += 1) {
      const pixel = document.createElement('div');

      pixel.style.position = 'absolute';
      pixel.style.left = left * PIXEL + 'px';
      pixel.style.top = top * PIXEL + 'px';
      pixel.style.width = PIXEL + 'px';
      pixel.style.height = PIXEL + 'px';
      pixel.style.border = '0.5px solid #ffd829';

      const key = toKey([top, left]);

      if (canvas) {
        canvas.appendChild(pixel);
      }

      pixels.set(key, pixel);
    }
  }
}

export function drawCanvas(): void {
  const { foodKey } = useFood();
  const { snakeKeys } = useSnake();

  for (let top = 0; top < ROWS; top += 1) {
    for (let left = 0; left < COLS; left += 1) {
      const key = toKey([top, left]);
      const pixel = pixels.get(key);

      let background = '#FFD829';

      if ((isOdd(top) && isEven(left)) || (isEven(top) && isOdd(left))) {
        background = '#fde33f';
      }

      if (key === foodKey) {
        background = 'orangered';
      } else if (snakeKeys.has(key)) {
        const snakeKeysArray = [...snakeKeys];
        const head = snakeKeysArray[snakeKeysArray.length - 1];

        if (key === head) {
          background = 'white';
        } else {
          background = 'black';
        }
      }

      pixel.style.background = background;
    }
  }
}
