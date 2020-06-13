import { T, O, L, J, I, S, Z } from "./pieces.js";

const pieces = "TOLJISZ";

/** Clase que representa una pieza (tetrominó). */
class Piece {

  /**
   * Crea una instancia de la clase "Piece".
   */
  constructor() {
    this.type = pieces[pieces.length * Math.random() | 0]
    this.piece = this.create_piece();
  }

  /**
   * Devuelve una matriz dependiendo del tipo de la pieza.
   * @returns {Array<Array<number>>} - Matriz con forma del tipo de pieza elegida.
   */
  create_piece() {
    switch (this.type) {
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

  /**
   * Dibuja la pieza en la pocición indicada del canvas asignado.
   * @param {CanvasRenderingContext2D} context - Canvas a dibujar.
   * @param {number} pos_x - Pocición en x del canvas a empezar el dibujo.
   * @param {number} pos_y - Pocición en y del canvas a empezar el dibujo.
   */
  draw(context, pos_x, pos_y) {
    this.piece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = "red";
          context.fillRect(pos_x + (x * 30), pos_y + (y * 30), 30, 30);
        }
      });
    });
  }

  /**
   * Rota la matriz (pieza) en la dirección asignada.
   * @param {number} dir - Dirección a rotar la pieza.
   */
  rotate(dir) {
    for (let y = 0; y < this.piece.length; y++) {
      for (let x = 0; x < y; x++) {
        let temp = this.piece[x][y];
        this.piece[x][y] = this.piece[y][x];
        this.piece[y][x] = temp;
      }
    }
    if (dir > 0) {
      this.piece.forEach(row => row.reverse());
    } else {
      this.piece.reverse();
    }
  }

}

export default Piece;
