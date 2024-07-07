import { Enemy } from "./enemy-class.js";
import { StateMachine, SpawnNew} from "./stateMashine-skelett-class.js";
import { imageIsloadet } from "../assets.js";
import { ctx } from "../canvas.js";

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
            HitPoints: options.HitPoints || 30,
            invincibilityTimer: options.invincibilityTimer || 575,
            type: type || "Enemy"
        });
        this.subType = "Skelett";
        this.status = "idle";
        this.animationStatus = "idle";
        this.prevStatus = "idle";
        this.stateMachine = new StateMachine(new SpawnNew(), this);

        this.animationFrames = {
            idle: [[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}], true],
            walking: [[{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}], true],
            chasing: [[{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}], true],
            attack: [[{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, {x:6, y:1}, {x:7, y:1}], false],
            death: [[{x:0, y:2}, {x:1, y:2}, {x:2, y:2}, {x:3, y:2}], false],
            spawn: [[{x:3, y:2}, {x:3, y:2}, {x:3, y:2}, {x:3, y:2}, {x:2, y:2}, {x:1, y:2}, {x:0, y:2}], false],
            getHit: [[{x:0, y:4}, {x:1, y:4}, {x:2, y:4}, {x:3, y:4}], false],
            jump: [[{x:0, y:0}], false],
            fall: [[{x:0, y:0}], false]
        }

        this.cooldown = {
            isMainAttack: false,
            latestDateOfAttack: "",
            MainAttackCooldownValue: 1350,
        }
        this.scaling = 0.72;
        this.status = "idle";
        this.frameWidth = 150;
        this.frameHight = 65;
        this.animationImage = imageIsloadet.skeleton;
        this.animationImage.src = "./assets/skelet-animation-atlas.png";
        this.frameHightOffset = 41;
        this.frameWidthOffset = 86;
        this.currentTime = 0;
        this.health = 10;
        this.scoreValue = options.scoreValue || 8;
    }

    checkForCooldown(){
        this.currentTime = new Date();
        if (this.currentTime - this.cooldown.MainAttackCooldownValue > this.cooldown.latestDateOfAttack && this.cooldown.isMainAttack){
            this.cooldown.isMainAttack = false;
        }
    }

    update(deltaTime){
        super.update(deltaTime)
        this.drawConnectionLine()
    }

    drawConnectionLine(){
        if(this.level.showDebug){
            ctx.beginPath();
            ctx.strokeStyle = 'grey';
            ctx.lineWidth = 1;
            ctx.moveTo((this.pos[0] + (this.size[0] / 2 )) - this.level.cameraPos[0] , (this.pos[1] + (this.size[1] / 2 )) - this.level.cameraPos[1]);
            ctx.lineTo((this.level.player.pos[0] + (this.level.player.size[0] / 2)) - this.level.cameraPos[0] ,(this.level.player.pos[1] + (this.level.player.size[1] / 2)) - this.level.cameraPos[1])
            ctx.stroke();
        }
    }
}