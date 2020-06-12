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
    this.piece.rotate(dir);
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
