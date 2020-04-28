const canvas = document.getElementById("board");
const context = canvas.getContext("2d");
const cell_size = 30;

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

const matrix = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 0, 0]
];

const player = {
  matrix: matrix,
  pos: { x: 10, y: 45 }
};

function drawMatrix(matrix, pos) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = "red";
        context.fillRect(pos.x + (cell_size * x), pos.y + (cell_size * y), cell_size, cell_size);
      }
    });
  });
}

function render() {
  context.fillStyle = "green";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "black";
  context.fillRect(10, 45, 300, 630);

  drawMatrix(player.matrix, player.pos);
}

function update(time = 0) {
  const deltaTime = time - lastTime;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    console.log("Entro");
    player.pos.y += cell_size;
    dropCounter = 0;
  }

  lastTime = time;

  render();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case 37:
      player.pos.x -= cell_size;
      break;
    case 38:
      break;
    case 39:
      player.pos.x += cell_size;
      break;
    case 40:
      player.pos.y += cell_size;
    default:
      break;
  }
});

export default update;
