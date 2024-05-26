import { Enemy } from "./enemy-class.js";
export class Skelett extends Enemy{
    constructor(options, type){
        super({
            pos: options.pos,
            size: options.size,
            color: options.color || "grey",
            grav: options.grav || 0.005,
            friction: options.friction || 0.2,
            jumpspeed: options.jumpspeed ||  -0.85,
            walkspeed: options.walkspeed || 0.00125,
            aggroRange: options.aggroRange || 450,
            HitPoints: options.HitPoints || 50,
            invincibilityTimer: options.invincibilityTimer || 575,
            type: type || "Enemy"
        });

        this.animationFrames = {
            idle: [[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}], true],
            walking: [[{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}], true],
            chasing: [[{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}], true],
            attack: [[{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, {x:6, y:1}, {x:7, y:1}], false],
            death: [[{x:0, y:2}, {x:1, y:2}, {x:2, y:2}, {x:3, y:2}], false],
            getHit: [[{x:0, y:4}, {x:1, y:4}, {x:2, y:4}, {x:3, y:4}], false],
            jump: [[{x:0, y:0}], false],
            fall: [[{x:0, y:0}], false]
        }
        this.status = "idle"
        this.frameWidth = 150;
        this.frameHight = 65;
        this.animationImage.src = "./assets/skelet-animation-atlas.png";
        this.frameHightOffset = 78;
        this.frameWidthOffset = 90;
    }
}