function initializeCanvas() {
  for (let top = 0; top < ROWS; top += 1) {
    for (let left = 0; left < COLS; left += 1) {
      const pixel = document.createElement("div");

      pixel.style.position = "absolute";
      pixel.style.border = "1px solid #FFD829";
      pixel.style.left = left * PIXEL + "px";
      pixel.style.top = top * PIXEL + "px";
      pixel.style.width = PIXEL + "px";
      pixel.style.height = PIXEL + "px";

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
      let background = "#FFD829";

      if (key === currentFoodKey) {
        background = "orangered";
      } else if (currentSnakeKeys.has(key)) {
        const transformSet = [...currentSnakeKeys];
        const head = transformSet[transformSet.length - 1];


        if (key === head) {
          background = "white";
        } else {
          background = "black";
        }
      } else {
      }

      pixel.style.background = background;
    }
  }
}
