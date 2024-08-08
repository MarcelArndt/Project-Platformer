import { Player} from "./player-class.js";
import {imageIsloadet, soundIsloadet} from "../assets.js";

export class Character extends Player {
    constructor(options){
        super({
            pos: options.pos,
            size: options.size,
            color: options.color || "blue",
            type: "Player",
            health : options.health
        },);  
        this.animationFrames = {
            idle: [[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}, {x:4, y:0}, {x:5, y:0}], true],
            walking: [[{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, {x:6, y:1}, {x:7, y:1}], true],
            attack: [[{x:0, y:2}, {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:4, y:2}, {x:5, y:2}, {x:6, y:2}, {x:6, y:2}], false],
            attackTwo: [[ {x:7, y:2}, {x:8, y:2}, {x:9, y:2}, {x:10, y:2}, {x:11, y:2},{x:11, y:2}], false],
            death: [[{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}, {x:4, y:3}, {x:5, y:3}, {x:6, y:3}, {x:7, y:3}, {x:8, y:3}, {x:9, y:3}, {x:10, y:3}], false],
            jump: [[{x:0, y:5}, {x:1, y:5}, {x:2, y:5}], true],
            fall: [[{x:0, y:4}, {x:1, y:4}, {x:2, y:4}], true],
            crouch: [[{x:0, y:6}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}], true],
            getHit: [[{x:0, y:7}, {x:1, y:7}, {x:2, y:7}, {x:3, y:7}], true],
        }
        this.scaling = 0.85;
        this.frameWidth = 64;
        this.frameHight = 44;
        this.frameHightOffset = 31;
        this.frameWidthOffset = 3;
        this.animationImage = imageIsloadet.character;
        this.walkspeed = 0.012;
        this.hitSound = soundIsloadet.hitPlayer;
      
    }

  /**
     * Just enable for debug purposes only
     * 

    update(deltaTime){
        super.update(deltaTime);
        this.draw();
    }
   
    draw(){
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.pos[0] - this.level.cameraPos[0], this.pos[1] - this.level.cameraPos[1], this.size[0], this.size[1]);
    }
  */
}