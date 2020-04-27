game = document.getElementById("game");
menu = document.getElementById("menu");
tutorial = document.getElementById("tutorial");

back_game_btn = document.getElementById("back_game_btn");
back_tuto_btn = document.getElementById("back_tuto_btn");
game_btn = document.getElementById("game_btn");
tutorial_btn = document.getElementById("tutorial_btn");
music_img = document.getElementById("music_img");
music_player = document.getElementById("music_player");

music_btn.onclick = () =>{
  if(music_player.muted == false){
    music_player.muted = true;
    music_img.src = "/assets/mute.png"
  }
  else{
    music_player.muted = false;
    music_img.src = "/assets/no_mute.png"
  }
}

function change_display(element, display) {
  element.style.display = display;
}

back_game_btn.onclick = () => {
  change_display(back_game_btn, "none");
  change_display(game, "none");
  change_display(menu, "flex");

  music_player.pause();
  music_player.src = "/assets/halo_theme.mp3";
  music_player.load();
  music_player.play();
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

  music_player.pause();
  music_player.src = "/assets/tetris_theme.mp3";
  music_player.load();
  music_player.play();
}

tutorial_btn.onclick = () => {
  change_display(back_tuto_btn, "block");
  change_display(menu, "none");
  change_display(tutorial, "flex");
}
