import { T, O, L, J, I, S, Z } from "./pieces.js";

const pieces = "TOLJISZ";

export default class Piece {
  constructor() {
    this.type = pieces[pieces.length * Math.random() | 0]
    this.piece = this.create_piece();
  }

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
}
