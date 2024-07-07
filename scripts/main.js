import { loadAllAssests } from "./assets.js";
import { InitMainMenu} from "./menuScript.js";
let myGame = null;
const Game = null;
const level_One = null;
window.onload = () => {
  loadAllAssests().then(() => {
    Promise.all([
      import("./levels/level_one.js"),
      import("./game-class.js"),
  ]).then(([levelModule, gameModule]) => {
      const levelOne = levelModule.levelOne;
      const Game = gameModule.Game;
      let myGame = new Game([levelOne]);
      InitMainMenu(myGame, levelOne);
  }).catch((e) => {
      console.error('Failed to load modules:', e);
  });
}).catch((e) => {
  console.error('Image preloading failed:', e);
});
}