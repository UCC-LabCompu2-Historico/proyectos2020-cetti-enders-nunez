export default class Game {
  constructor() {
    this.board = document.getElementById("board");
    this.ctx = this.board.getContext("2d");
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.board.width, this.board.height);
    this.y = 35;
  }

  render() {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.board.width, this.board.height);
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(10, 35, 300, 630);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(10, this.y, 30, 30);
    this.y += 30;
  }

  run() {
    this.render();
  }
}
