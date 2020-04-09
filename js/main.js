game = document.getElementById("game");
menu = document.getElementById("menu");
tutorial = document.getElementById("tutorial");

back_game_btn = document.getElementById("back_game_btn");
back_tuto_btn = document.getElementById("back_tuto_btn");
game_btn = document.getElementById("game_btn");
tutorial_btn = document.getElementById("tutorial_btn");

function change_display(element, display) {
  element.style.display = display;
}

back_game_btn.onclick = () => {
  change_display(back_game_btn, "none");
  change_display(game, "none");
  change_display(menu, "block");
}

back_tuto_btn.onclick = () => {
  change_display(back_tuto_btn, "none");
  change_display(menu, "block");
  change_display(tutorial, "none");
}

game_btn.onclick = () => {
  change_display(back_game_btn, "block");
  change_display(game, "block");
  change_display(menu, "none");
}

tutorial_btn.onclick = () => {
  change_display(back_tuto_btn, "block");
  change_display(menu, "none");
  change_display(tutorial, "block");
}
