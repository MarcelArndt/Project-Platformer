import { Enemy } from "./enemy-class.js";

let animationImage = new Image();
    animationImage.src = "./assets/skelet-animation-atlas.png";

export class Skelett extends Enemy{
    constructor(options, type){
        super({
            spriteSheet: animationImage,
            pos: options.pos,
            size: options.size,
            color: options.color || "grey",
            grav: options.grav || 0.005,
            friction: options.friction || 0.2,
            jumpspeed: options.jumpspeed ||  -0.85,
            walkspeed: options.walkspeed || 0.00125,
            aggroRange: options.aggroRange || 625,
            smallAggroRange: options.smallAggroRange || 150,
            HitPoints: options.HitPoints || 10,
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

        this.cooldown = {
            isMainAttack: false,
            latestDateOfAttack: "",
            MainAttackCooldownValue: 1350,
        }

        this.status = "idle"
        this.frameWidth = 150;
        this.frameHight = 65;
        this.animationImage = new Image();
        this.animationImage.src = "./assets/skelet-animation-atlas.png";
        this.frameHightOffset = 78;
        this.frameWidthOffset = 90;
        this.currentTime = 0;
    }


    updateSpecial(deltaTime){
      //
    }

    checkSpecialStatus(options){
       //
    }

    checkForCooldown(){
        this.currentTime = new Date();
        if (this.currentTime - this.cooldown.MainAttackCooldownValue > this.cooldown.latestDateOfAttack && this.cooldown.isMainAttack){
            this.cooldown.isMainAttack = false;
        }
    }
}