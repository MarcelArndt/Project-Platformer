
import { loadAllImages, imageIsloadet } from "./images.js";

import { levelOne } from "./levels/level_one.js";
import { Game} from "./game-class.js";



async function init(){
        await loadAllImages();
}

await init();


let myGame = new Game([levelOne]);
myGame.startLevel();



