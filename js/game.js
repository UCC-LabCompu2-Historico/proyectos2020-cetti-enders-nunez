import { T, O, L, J, I, S, Z } from "./pieces.js";

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

const pieces = "TOLJISZ";

let lineCounter = 0;
let lineInterval = 10;
let level = 1;
const LAST_LEVEL = 18;

let pause = false;

const player = {
  matrix: create_piece(pieces[pieces.length * Math.random() | 0]),
  next_matrix: create_piece(pieces[pieces.length * Math.random() | 0]),
  pos: { x: 70, y: 45 },
  score: 0
};

let best_player = get_score();

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

function create_piece(piece) {
  switch (piece) {
    case 'T':
      return Array.from(T);
    case 'O':
      return O;
    case 'L':
      return L;
    case 'J':
      return J;
    case 'I':
      return I;
    case 'S':
      return S;
    case 'Z':
      return Z;
  }
}

function collide(board, player) {
  const matrix = player.matrix;
  const offset_x = (player.pos.x - 10) / cell_size;
  const offset_y = (player.pos.y - 45) / cell_size;
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] !== 0 && (board[y + offset_y] && board[y + offset_y][x + offset_x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function draw_matrix(matrix, pos) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = "red";
        context.fillRect(pos.x + (cell_size * x), pos.y + (cell_size * y), cell_size, cell_size);
      }
    });
  });
}

function game_over() {
  set_top_player();
  restart();
}

function get_score() {
  let player_json = localStorage.getItem("player");
  try {
    let p = JSON.parse(player_json);
    return p;
  } catch (error) {
    return null;
  };
}

function level_up(interval) {
  level++;
  dropInterval -= level * 5;
  lineInterval += interval;
}

function merge(board, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        board[y + (player.pos.y - 45) / cell_size][x + (player.pos.x - 10) / cell_size] = value;
      }
    });
  });
}

function restart(){
  for (let y = 0; y < board.length; y++) {
    board[y].fill(0);
  }

  p_reset();
  player.score = 0;
  dropInterval = 1000;
  lineInterval = 10;
  lineCounter = 0;
  level = 1;
}

function rotate(matrix, dir) {
  let a = Array.from(matrix);
  for (let y = 0; y < a.length; y++) {
    for (let x = 0; x < y; x++) {
      let temp = a[x][y];
      a[x][y] = a[y][x];
      a[y][x] = temp;
    }
  }
  if (dir > 0) {
    a.forEach(row => row.reverse());
  } else {
    a.reverse();
  }
}

function p_move(offset) {
  player.pos.x += offset;
  if (collide(board, player)) {
    player.pos.x -= offset;
  }
}

function p_drop() {
  player.pos.y += cell_size;
  if (collide(board, player)) {
    if (player.pos.y === 75) {
      game_over();
    }
    else {
      player.pos.y -= cell_size;
      merge(board, player);
      p_reset();
      line_clear();
    }
  }
  dropCounter = 0;
}

function p_reset() {
  let a = Array.from(player.next_matrix);
  player.matrix = a;
  player.next_matrix = create_piece(pieces[pieces.length * Math.random() | 0]);
  player.pos.x = 70;
  player.pos.y = 45;
}

function p_rotate() {
  const pos = player.pos.x;
  let offset = cell_size;
  rotate(player.matrix, 1);
  while (collide(board, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 30 : -30));
    if (offset / cell_size > player.matrix[0].length) {
      rotate(player.matrix, -1);
      player.pos.x = pos;
      return;
    }
  }
}

function render() {
  context.fillStyle = "green";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "black";
  context.fillRect(10, 45, 300, 630);
  draw_matrix(board, { x: 10, y: 45 });
  draw_matrix(player.matrix, player.pos);

  player.username = document.getElementById("username").value;
  context.font = "30px serif";
  context.fillText(player.username, 0, 20);

  draw_matrix(player.next_matrix, { x: 360, y: 320 });

  context.fillText(`Nivel: ${level}`, 320, 200);
  context.fillText(`Lineas: ${lineCounter}`, 320, 150);

  context.fillText("Top player", 320, 460);
  if (best_player !== null) {
    context.fillText(`${best_player.username} ${best_player.score}`, 320, 500);
  }

  context.fillText(player.score, canvas.width - 100, 50);
}

function set_top_player() {
  if (best_player !== null) {
    if (player.score > best_player.score) {
      store_score();
      best_player = get_score();
    }
  } else {
    store_score();
    best_player = get_score();
  }
}

function store_score() {
  let player_json = JSON.stringify(player);
  localStorage.setItem("player", player_json);
}

function update(time = 0) {
  if (!pause) {
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      p_drop();
      dropCounter = 0;
    }

    lastTime = time;

    render();
  } else {
    context.fillStyle = "white";
    context.fillRect(260, 60, 8, 30);
    context.fillRect(275, 60, 8, 30);
  }
  requestAnimationFrame(update);
}

document.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case LEFT_ARROW_KEY:
      p_move(-cell_size);
      break;
    case UP_ARROW_KEY:
      p_rotate(player.matrix);
      break;
    case RIGHT_ARROW_KEY:
      p_move(cell_size);
      break;
    case DOWN_ARROW_KEY:
      p_drop();
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
