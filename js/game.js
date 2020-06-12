import Player from "./player.js";

const canvas = document.getElementById("board");
const context = canvas.getContext("2d");
const cell_size = 30;

const LEFT_ARROW_KEY = 37;
const UP_ARROW_KEY = 38;
const RIGHT_ARROW_KEY = 39;
const DOWN_ARROW_KEY = 40;
const P_KEY = 80;
const R_KEY = 82;

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

const board = create_matrix(10, 21);

let lineCounter = 0;
let lineInterval = 10;
let level = 1;
const LAST_LEVEL = 18;

let pause = false;
let gameOver = false;

let player = new Player(100, 45);
let best_player = Player.best();

function line_clear() {
  let rowCount = 1;
  outer: for (let y = board.length - 1; y > 0; --y) {
    for (let x = 0; x < board[y].length; ++x) {
      if (board[y][x] === 0) {
        continue outer;
      }
    }

    const row = board.splice(y, 1)[0].fill(0);
    board.unshift(row);
    ++y;
    player.score += rowCount * 10 * level;
    rowCount *= 2;
    lineCounter++;
  }

  if (level < LAST_LEVEL) {
    if (lineCounter >= lineInterval) {
      if (level < 3) {
        level_up(10);
      } else {
        level_up(5);
      }
    }
  }
}

function create_matrix(w, h) {
  const matrix = []
  while (h !== 0) {
    matrix.push(new Array(w).fill(0));
    h--;
  }
  return matrix;
}

function collide() {
  const matrix = player.piece.piece;
  const offset_x = (player.x - 10) / cell_size;
  const offset_y = (player.y - 45) / cell_size;
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] !== 0 && (board[y + offset_y] && board[y + offset_y][x + offset_x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function draw_board(pos) {
  context.fillStyle = "black";
  context.fillRect(pos.x, pos.y, board[0].length * cell_size, board.length * cell_size);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = "red";
        context.fillRect(pos.x + (cell_size * x), pos.y + (cell_size * y), cell_size, cell_size);
      }
    });
  });
}

function game_over() {
  let username = document.getElementById("username").value;
  player.store(username, best_player);
  best_player = Player.best();

  gameOver = !gameOver;
}

function level_up(interval) {
  level++;
  dropInterval -= level * 5;
  lineInterval += interval;
}

function merge() {
  player.piece.piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        board[y + (player.y - 45) / cell_size][x + (player.x - 10) / cell_size] = value;
      }
    });
  });
}

function restart(){
  for (let y = 0; y < board.length; y++) {
    board[y].fill(0);
  }

  player.reset();
  player.score = 0;
  dropInterval = 1000;
  lineInterval = 10;
  lineCounter = 0;
  level = 1;
  gameOver = false;
}

function p_move(offset) {
  player.move(offset);
  if (collide()) {
    player.move(-offset);
  }
}

function p_drop() {
  player.drop(cell_size);
  if (collide()) {
    if (player.y === 75) {
      game_over();
    }
    else {
      player.y -= cell_size;
      merge(board, player);
      player.reset();
      line_clear();
    }
  }
  dropCounter = 0;
}

function p_rotate() {
  const pos = player.x;
  let offset = cell_size;
  player.rotate(1);
  while (collide()) {
    player.move(offset);
    offset = -(offset + (offset > 0 ? 30 : -30));
    if (offset / cell_size > player.piece.piece[0].length) {
      player.rotate(-1);
      player.move(pos);
      player.x = pos;
      return;
    }
  }
}

function render() {
  context.fillStyle = "green";
  context.fillRect(0, 0, canvas.width, canvas.height);

  draw_board({ x: 10, y: 45 });
  player.draw(context);

  context.font = "30px serif";
  context.fillText(document.getElementById("username").value, 0, 20);
  context.fillText(player.score, canvas.width - 100, 50);
  context.fillText(`Nivel: ${level}`, 320, 200);
  context.fillText(`Lineas: ${lineCounter}`, 320, 150);
  context.fillText("Top player", 320, 460);
  if (best_player !== null) {
    context.fillText(`${best_player.username} ${best_player.score}`, 320, 500);
  }
}

function update(time = 0) {
  if (!pause && !gameOver) {
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      p_drop();
      dropCounter = 0;
    }

    lastTime = time;

    render();
  } else if (pause && !gameOver){
    context.fillStyle = "white";
    context.fillRect(260, 60, 8, 30);
    context.fillRect(275, 60, 8, 30);
  }else{
    context.font = "25px serif";
    context.fillStyle = "white";
    context.fillText(`Game Over`, 95, 200);
    context.fillText(`Puntaje: ${player.score}`, 95, 235);
    context.font = "20px serif";
    context.fillText(`Preciona R para reiniciar`, 65, 265);
  }
  requestAnimationFrame(update);
}

document.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case LEFT_ARROW_KEY:
      p_move(-cell_size);
      break;
    case UP_ARROW_KEY:
      p_rotate();
      break;
    case RIGHT_ARROW_KEY:
      p_move(cell_size);
      break;
    case DOWN_ARROW_KEY:
      if(!gameOver){
        p_drop();
      }
      break;
    case P_KEY:
      pause = !pause;
      break;
    case R_KEY:
      restart();
      break;
    default:
      break;
  }
});

export default update;
