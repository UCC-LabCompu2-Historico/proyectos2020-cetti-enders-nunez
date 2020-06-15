import colors from "./colors.js";
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
const SPACEBAR = 32;

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

/**
 * Borra las lineas del tablero de juego que esten llenas
 * y asigna los debidos puntos al jugador.
 */
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

/**
 * Crea el tablero de juego.
 * @param {number} w - Ancho del tablero.
 * @param {number} h - Alto del tablero.
 * @returns {Array<Array<number>>} matrix - Tablero de juego
 */
function create_matrix(w, h) {
  const matrix = []
  while (h !== 0) {
    matrix.push(new Array(w).fill(0));
    h--;
  }
  return matrix;
}

/**
 * Verifica si la pieza del jugador colisiono
 * con los limites del tablero o no.
 * @returns {boolean} - True si colisiono, False si no colisiono
 */
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

/**
 * Dibuja el tablero en el canvas.
 * @param {JSON} pos - Posicion en X y en Y a empezar a dibujar. 
 */
function draw_board(pos) {
  context.fillStyle = "black";
  context.fillRect(pos.x, pos.y, board[0].length * cell_size, board.length * cell_size);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(pos.x + (cell_size * x), pos.y + (cell_size * y), cell_size, cell_size);
      }
    });
  });
}

/**
 * Dibuja un menú de ayuda para el jugador cuando el mismo ha perdido.
 */
function draw_game_over() {
  context.font = "25px bodyFont";
  context.fillStyle = "white";
  context.fillText("Game Over", 95, 200);
  context.font = "18px bodyFont";
  context.fillText(`Puntaje: ${player.score}`, 60, 235);
  context.fillText("Presiona R para reiniciar", 60, 265);
}

/**
 * Dibuja el ícono de pausa.
 */
function draw_pause() {
  context.fillStyle = "white";
  context.fillRect(260, 60, 8, 30);
  context.fillRect(275, 60, 8, 30);
}

/**
 * Guarda los datos del jugador en caso de que este supere
 * el record anterior de puntaje.
 */
function game_over() {
  let username = document.getElementById("username").value;
  player.store(username, best_player);
  best_player = Player.best();

  gameOver = !gameOver;
}
/**
 * Deja caer inmediatamente la pieza.
 *
 */
function hard_drop(){
  while(player.y != player.start_y || player.x != player.start_x){
    p_drop();
  }
}

/**
 * Sube de nivel y aumenta la dificultad del juego.
 * @param {number} interval - Cantidad de líneas adicionales para subir otro nivel.
 */
function level_up(interval) {
  level++;
  dropInterval -= level * 5;
  lineInterval += interval;
}

/**
 * "Inserta" la pieza del jugador al tablero de juego.
 */
function merge() {
  player.piece.piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        board[y + (player.y - 45) / cell_size][x + (player.x - 10) / cell_size] = value;
      }
    });
  });
}

/**
 * Limpia el tablero de juego.
 */
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

/**
 * Mueve al jugador horizontalmente. Si el jugador
 * excede los límites del tablero, lo mueve
 * de nuevo en sentido contrario.
 * @param {number} offset - Cantidad a desplazar.
 */
function p_move(offset) {
  player.move(offset);
  if (collide()) {
    player.move(-offset);
  }
}

/**
 * Algoritmo que se encarga de bajar al jugador 1
 * posición en el eje Y y luego verificar el estado de la pieza
 * para finalizar el juego u otra lógica.
 */
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

/**
 * Rota la pieza del jugador y se encarga de que
 * ésta no exceda los límites del tablero.
 */
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

/**
 * Dibuja todos los elementos del canvas.
 */
function render() {
  context.clearRect(0,0, canvas.width, canvas.height)
  draw_board({ x: 10, y: 45 });
  player.draw(context);

  context.fillStyle = "white";
  context.font = "30px bodyFont";
  context.fillText(`${document.getElementById("username").value} | Puntaje: ${player.score}`, 10, 30);
  context.fillText(`Siguiente:`, 320, 100);
  context.fillText(`Nivel: ${level}`, 320, 300);
  context.fillText(`Lineas: ${lineCounter}`, 320, 350);
  context.fillText("Top player", 320, 575);
  if (best_player !== null) {
    context.fillText(`${best_player.username}`, 320, 625);
    context.font = "25px bodyFont";
    context.fillText(`Score: ${best_player.score}`, 320, 675);
  }
}

/**
 * Actualiza todos los elementos del canvas.
 * @param {number} [time=0] - Tiempo inicial.
 */
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
  } else if (pause && !gameOver) {
    draw_pause();
  } else {
    draw_game_over();
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
      if(!gameOver) {
        p_drop();
      }
      break;
    case P_KEY:
      pause = !pause;
      break;
    case R_KEY:
      restart();
      break;
      case SPACEBAR:
        if(!gameOver && !pause){
          hard_drop();
        }
    default:
      break;
  }
});

export default update;
