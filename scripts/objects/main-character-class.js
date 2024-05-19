import { Player} from "./player-class.js";
import {canvas, ctx} from "../canvas.js";
import { Hitbox } from "./hitbox-class.js";

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
        this.animationFrames = {
            idle: [{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}, {x:4, y:0}, {x:5, y:0}],
            walking: [{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, {x:6, y:1}, {x:7, y:1}],
            attack: [{x:0, y:2}, {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:4, y:2}, {x:5, y:2}, {x:6, y:2}, {x:7, y:2}, {x:8, y:2}, {x:9, y:2}, {x:10, y:2}, {x:11, y:2}],
            death: [{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}, {x:4, y:3}, {x:5, y:3}, {x:6, y:3}, {x:7, y:3}, {x:8, y:3}, {x:9, y:3}, {x:10, y:3}],
            jump: [{x:0, y:5}, {x:1, y:5}, {x:2, y:5}],
            fall: [{x:0, y:4}, {x:1, y:4}, {x:2, y:4}],
            crouch: [{x:0, y:6}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}],
        }
        this.frame = {x:0, y:0};
        this.animationTimer = 0;
    }

    updateAnimationTimer(deltaTime = this.level.timer.deltaTime, speed = 1){
        const secDeltaTime = deltaTime / 100 * speed;
        if (this.prevStatus != this.status || this.animationTimer >= (this.animationFrames[this.status].length -1)){
            this.animationTimer = 0;
        } else{
            this.animationTimer += secDeltaTime;
        }
    }

    updateFrameAnimation(deltaTime = this.level.timer.deltaTime, speed = 1){
        let FrameIndex = 0;
        this.updateAnimationTimer(deltaTime, speed)
        FrameIndex = Math.floor(this.animationTimer);
        this.frame = this.animationFrames[this.status][FrameIndex];
    }

    createHitbox(){
        this.mainCurrentFiringSetTimer =  setTimeout(() => {
                let newPos = [this.checkfacingForPos(), this.posBottom - 67]
                let level = this.level;
                let newObject = {
                    level: level,
                    pos: newPos,
                    size: [90, 55],
                    color: "",
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

    draw(){
        let posX = this.pos[0] - this.level.cameraPos[0] - this.size[0];
        let posY = this.pos[1] - this.level.cameraPos[1] - (this.size[1] / 3.5);
        ctx.save();
        if (!this.facingLeft){
            ctx.translate(canvas.width, 0)
            ctx.scale(-1, 1);
            posX = canvas.width - (this.pos[0] - this.level.cameraPos[0]) - (this.size[0] *2);
        }
        if(this.crouch){
            posY -= 44;
        }
        ctx.drawImage(image, this.frame.x * 64, this.frame.y * 44, 64, 44, posX, posY, 64 * 2, 44 * 2) 
        ctx.restore();
    }

  
}