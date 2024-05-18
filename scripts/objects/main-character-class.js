import { Player} from "./player-class.js";
import {ctx} from "../canvas.js";

const image = new Image();
image.src = "./assets/character-animation-atlas.png";

export class Character extends Player {
    constructor(options){
        super({
            pos: options.pos,
            size: options.size,
            color: options.color || "blue",
            type: "Player"
        },);  
    }

  
    draw(){
        ctx.drawImage(image, 0, 0, 64, 44, this.pos[0] - this.level.cameraPos[0] - this.size[0] , this.pos[1] - this.level.cameraPos[1] - (this.size[1] / 3.5) , 64 * 2, 44 * 2) 
    }
}