import Piece from "./piece.js";

export default class Player {
  constructor() {
    this.piece = new Piece();
    this.next_piece = new Piece();
    this.x = 100;
    this.y = 45;
    this.score = 0;
  }

  static get best() {
    let player_json = localStorage.getItem("player");
    try {
      let p = JSON.parse(player_json);
      return p;
    } catch (error) {
      return null;
    };
  }

  draw(context) {
    this.piece.draw(context, this.x, this.y);
    this.next_piece.draw(context, 360, 320);
  }

  drop() {
    this.y += 30;
  }

  move(offset) {
    this.x += offset;
  }

  reset() {
    this.piece = this.next_piece;
    this.next_piece = new Piece();
    this.x = 100;
    this.y = 45;
  }

  rotate(dir) {
    for (let y = 0; y < this.piece.piece.length; y++) {
      for (let x = 0; x < y; x++) {
        let temp = this.piece.piece[x][y];
        this.piece.piece[x][y] = this.piece.piece[y][x];
        this.piece.piece[y][x] = temp;
      }
    }
    if (dir > 0) {
      this.piece.piece.forEach(row => row.reverse());
    } else {
      this.piece.piece.reverse();
    }
  }

  store(username, best) {
    const p = {
      score: this.score,
      username: username,
    }
    let player_json = JSON.stringify(p);
    if (best !== null) {
      if (this.score > best.score) {
        localStorage.setItem("player", player_json);
      }
    } else {
      localStorage.setItem("player", player_json);
    }
  }
}
