import {T, O, L, J, I, S, Z} from "./pieces.js";

const canvas = document.getElementById("board");
const context = canvas.getContext("2d");
const cell_size = 30;

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

const board = create_matrix(10, 21);

const pieces = "TOLJISZ";

const player = {
  matrix: create_piece(pieces[pieces.length * Math.random() | 0]),
  pos: { x: 70, y: 45 }
};

function create_matrix(w, h){
  const matrix = []
  while(h !== 0){
    matrix.push(new Array(w).fill(0));
    h--;
  }
  return matrix;
}

function create_piece(piece){
  switch (piece) {
    case 'T':
      return T;
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

function collide(board, player){
  const matrix = player.matrix;
  const offset_x = (player.pos.x-10)/cell_size;
  const offset_y = (player.pos.y-45)/cell_size;
  for (let y = 0; y < matrix.length; y++){
    for(let x = 0; x < matrix[y].length; x++){
      if(matrix[y][x] !== 0 && (board [y+offset_y] && board [y+offset_y][x+offset_x]) !== 0){
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

function merge(board, player){
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value !==0){
        board[y+(player.pos.y-45)/cell_size][x+(player.pos.x-10)/cell_size] = value;
      }
    });
  });
}

function rotate(matrix, dir){
  console.log("hola");
  for (let y = 0; y<matrix.length;y++){
    for(let x = 0; x<y; x++){
      let temp = matrix[x][y];
      matrix[x][y] = matrix [y][x];
      matrix[y][x] = temp;
    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function p_move(offset) {
  player.pos.x += offset;
  if (collide(board, player)) {
      player.pos.x -= offset;
  }
}

function p_drop(){
  player.pos.y+= cell_size;
  if (collide(board, player)) {
    player.pos.y-=cell_size;
    merge(board, player);
    p_reset();
  }
  dropCounter = 0;
}

function p_reset(){
  player.matrix = create_piece(pieces[pieces.length * Math.random() | 0]);
  player.pos.x = 70;
  player.pos.y = 45;
}

function p_rotate() {
  const pos = player.pos.x;
  let offset = cell_size;
  rotate(player.matrix, 1);
  while (collide(board, player)) {
      if((player.pos.x-10)/cell_size < 0){
        player.pos.x += cell_size;
      }
      else{
        player.pos.x -= cell_size;
      }
  }
}

function render() {
  context.fillStyle = "green";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "black";
  context.fillRect(10, 45, 300, 630);
  draw_matrix(board, {x: 10, y:45});
  draw_matrix(player.matrix, player.pos);

  let username = document.getElementById("username").value;
  context.font = "30px serif";
  context.fillText(username, 0, 20);
}

function update(time = 0) {
  const deltaTime = time - lastTime;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    p_drop();
    dropCounter = 0;
  }

  lastTime = time;

  render();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case 37:
      p_move(-cell_size);
      break;
    case 38:
      p_rotate(player.matrix);
      break;
    case 39:
      p_move(cell_size);
      break;
    case 40:
      p_drop();
    default:
      break;
  }
});

export default update;
