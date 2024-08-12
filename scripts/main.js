import { loadAllAssests } from "./assets.js";
import { InitMainMenu, loadFromLocalStorage} from "./menuScript.js";
let myGame = null;
const Game = null;
const level_One = null;

/**
 * will load all necessity Images and Sounds before starting any scripts to prevent any issues of missing Textuers or similary Bugs
 * after loading any Source the Game gets injected, the latest Save gets loadet and the menu will be rendert.
 */
window.onload = () => {
  loadAllAssests().then(() => {
    Promise.all([
      import("./levels/level_one.js"),
      import("./game-class.js"),
  ]).then(([levelModule, gameModule]) => {
      const levelOne = levelModule.levelOne;
      const Game = gameModule.Game;
      let myGame = new Game([levelOne]);
      loadFromLocalStorage();
      InitMainMenu(myGame, levelOne);
  }).catch((e) => {
      console.error('Failed to load modules:', e);
  });
}).catch((e) => {
  console.error('Image preloading failed:', e);
});
}