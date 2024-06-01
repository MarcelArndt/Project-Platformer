import { Player} from "./player-class.js";
import { Hitbox } from "./hitbox-class.js";


export class Character extends Player {
    constructor(options){
        super({
            pos: options.pos,
            size: options.size,
            color: options.color || "blue",
            type: "Player"
        },);  
        this.animationFrames = {
            idle: [[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}, {x:4, y:0}, {x:5, y:0}], true],
            walking: [[{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, {x:6, y:1}, {x:7, y:1}], true],
            attack: [[{x:0, y:2}, {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:4, y:2}, {x:5, y:2}, {x:6, y:2}, {x:7, y:2}, {x:8, y:2}, {x:9, y:2}, {x:10, y:2}, {x:11, y:2}], false],
            death: [[{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}, {x:4, y:3}, {x:5, y:3}, {x:6, y:3}, {x:7, y:3}, {x:8, y:3}, {x:9, y:3}, {x:10, y:3}], false],
            jump: [[{x:0, y:5}, {x:1, y:5}, {x:2, y:5}], true],
            fall: [[{x:0, y:4}, {x:1, y:4}, {x:2, y:4}], true],
            crouch: [[{x:0, y:6}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}], true],
        }
        this.frameWidth = 64;
        this.frameHight = 44;
        this.frameHightOffset = 48;
        this.frameWidthOffset = 0;
        this.animationImage = new Image();
        this.animationImage.src = "./assets/character-animation-atlas.png";
    }

    createHitbox(){
        this.mainCurrentFiringSetTimer = setTimeout(() => {
                let newPos = [this.checkfacingForPos(), this.posBottom - 67]
                let level = this.level;
                let newObject = {
                    level: level,
                    pos: newPos,
                    size: [90, 55],
                    color: "grey",
                    lifespan : 600,
                    demage : 10,
                    forceToLeft: this.facingLeft
                }
                if (this.onGround){
                    this.vel[0] = 0;
                }
                
                this.level.objects.push(
                    new Hitbox (newObject)
                );
        }, 500);
        this.animationTimer = 0;
    }  
}