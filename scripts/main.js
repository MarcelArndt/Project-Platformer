import { levelOne } from "./levels/level_one.js";
import { levelTwo } from "./levels/level_two.js";
import { Game} from "./game-class.js";

let myGame = new Game([levelOne, levelTwo]);
myGame.startLevel();