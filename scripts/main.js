import { loadAllImages } from "./images.js";
import { levelOne } from "./levels/level_one.js";
import { Game } from "./game-class.js";

let myGame = null;

async function init() {
  await loadAllImages();
  myGame = new Game([levelOne]);
  myGame.checkForLoadings();
}

await init();
