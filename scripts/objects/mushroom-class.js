import { Enemy } from "./enemy-class.js";
import { StateMachine, Idle } from "./stateMashine-mushroom-class.js";
import { imageIsloadet, soundIsloadet } from "../assets.js";

let animationImage = imageIsloadet.mushroom;

export class Mushroom extends Enemy{
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
            type: type || "Enemy"
        });
        this.subType = "Mushroom";
        this.status = "idle";
        this.animationStatus = "idle";
        this.prevStatus = "idle";
        this.stateMachine = new StateMachine(new Idle(), this);

        this.animationFrames = {
            idle: [[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}], true],
            walking: [[{x:0, y:5}, {x:1, y:5}, {x:2, y:5}, {x:3, y:5}, {x:4, y:5}, {x:5, y:5}, {x:6, y:5}, {x:7, y:5}], true],
            chasing: [[{x:0, y:5}, {x:1, y:5}, {x:2, y:5}, {x:3, y:5}, {x:4, y:5}, {x:5, y:5}, {x:6, y:5}, {x:7, y:5}], true],
            attack: [[{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, {x:6, y:1}, {x:7, y:1}], false],
            attackTwo: [[{x:0, y:2}, {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:4, y:2}, {x:5, y:2}, {x:6, y:2}, {x:7, y:2}, {x:8, y:2}, {x:9, y:2}, {x:10, y:2}], false],
            death: [[{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}], false],
            getHit: [[{x:0, y:4}, {x:1, y:4}, {x:2, y:4}, {x:3, y:4}], false],
            jump: [[{x:0, y:0}], false],
            fall: [[{x:0, y:0}], false]
        }

        this.cooldown = {
            isMainAttack: false,
            latestDateOfAttack: "",
            MainAttackCooldownValue: 1350,
        }
        this.scaling = 0.8;
        this.status = "idle";
        this.frameWidth = 150;
        this.frameHight = 64;
        this.animationImage = imageIsloadet.mushroom;
        this.frameHightOffset = -8;
        this.frameWidthOffset = 94;
        this.currentTime = 0;
        this.scoreValue = options.scoreValue || 12;
        this.health = 30;
        this.hitSound = soundIsloadet.slurp04;
        
        this.createHitBox(this.pos, [48,45], [-49,5], {lifespan: 10, demageFlag: "Player", forceToLeft: false, color: "rgba(255,125,0,0.25)"}, this);
        this.createHitBox(this.pos, [48,45], [32,5], {lifespan: 10, demageFlag: "Player", forceToLeft: true, color: "rgba(255,125,0,0.25)"}, this);
        this.createHitBox(this.pos, [10,32], [-11,20], {lifespan: 10, demageFlag: "Player", isAktiv: true, isAllawysAktiv: true, forceToLeft: false, color: "rgba(255,125,0,0.25)"}, this);
        this.createHitBox(this.pos, [10,32], [31,20], {lifespan: 10, demageFlag: "Player", isAktiv: true, isAllawysAktiv: true, forceToLeft: true, color: "rgba(255,125,0,0.25)"}, this);
        this.createJumpPad(this.pos, [52,23], [-11,-4], {color: "rgba(0,300,300,0.25)"}, this);
    }
}