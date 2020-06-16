import play from "./game.js";

let game = document.getElementById("game");
let menu = document.getElementById("menu");
let tutorial = document.getElementById("tutorial");
let user_input = document.getElementById("user_input");

let back_game_btn = document.getElementById("back_game_btn");
let back_tuto_btn = document.getElementById("back_tuto_btn");
let game_btn = document.getElementById("game_btn");
let start_game_btn = document.getElementById("start_game_btn");
let tutorial_btn = document.getElementById("tutorial_btn");
let music_img = document.getElementById("music_img");
let music_player = document.getElementById("music_player");
music_player.volume = 0.20;

let username = document.getElementById("username");

const ENTER_KEY = 13;

/**
 * Reproduce la canción asignada.
 * @param {string} song - Canción a reproducir.
 */
function play_music(song){
  music_player.src = "assets/" + song;
  music_player.load();
  music_player.play();
}

/**
 * Cambiar el estilo de un elemento.
 * @param {Element} element - Elemento a cambiar.
 * @param {string} display - Nuevo estilo del elemento.
 */
function change_display(element, display) {
  element.style.display = display;
}

back_game_btn.onclick = () => {
  change_display(back_game_btn, "none");
  change_display(game, "none");
  change_display(menu, "flex");
}

back_tuto_btn.onclick = () => {
  change_display(back_tuto_btn, "none");
  change_display(menu, "flex");
  change_display(tutorial, "none");
}

game_btn.onclick = () => {
  change_display(back_game_btn, "block");
  change_display(game, "flex");
  change_display(menu, "none");
}

start_game_btn.onclick = () => {
  if (username.value === "") {
    alert("Por favor ingrese un nombre válido.");
    return
  }
  change_display(user_input, "none");
  setTimeout(() => { play() }, 700);
  play_music("tetris_theme.mp3");
}

tutorial_btn.onclick = () => {
  change_display(back_tuto_btn, "block");
  change_display(menu, "none");
  change_display(tutorial, "flex");
}

music_btn.onclick = () => {
  if (music_player.muted) {
    music_player.muted = false;
    music_img.src = "assets/no_mute.png"
  } else {
    music_player.muted = true;
    music_img.src = "assets/mute.png"
  }
}

username.addEventListener("keydown", event => {
  if (event.keyCode === ENTER_KEY) {
    if (username.value === "") {
      alert("Por favor ingrese un nombre válido.");
      return;
    }
    change_display(user_input, "none");
    setTimeout(() => { play() }, 700);
    play_music("tetris_theme.mp3");
  }
})
