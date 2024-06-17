

import { loadAllAssests } from "./assets.js";
let myGame = null;
const Game = null;
const level_One = null;
window.onload = () => {

  loadAllAssests().then(() => {
    Promise.all([
      import("./levels/level_one.js"),
      import("./game-class.js")
  ]).then(([levelModule, gameModule]) => {
      const levelOne = levelModule.levelOne;
      const Game = gameModule.Game;
      let myGame = new Game([levelOne]);
      myGame.startLevel();;


  }).catch(err => {
      console.error('Failed to load modules:', err);
  });
}).catch(err => {
  console.error('Image preloading failed:', err);
});
}





