

import { loadAllImages } from "./images.js";
let myGame = null;
const Game = null;
const level_One = null;
window.onload = () => {

  loadAllImages().then(() => {
    console.log("All Images are loaded");
    Promise.all([
      import("./levels/level_one.js"),
      import("./game-class.js")
  ]).then(([levelModule, gameModule]) => {
      const levelOne = levelModule.levelOne;
      const Game = gameModule.Game;
      console.log("After all Images are loaded -> Loading modules was also successfull.");
      let myGame = new Game([levelOne]);
      myGame.checkForLoadings();


  }).catch(err => {
      console.error('Failed to load modules:', err);
  });
}).catch(err => {
  console.error('Image preloading failed:', err);
});
}





