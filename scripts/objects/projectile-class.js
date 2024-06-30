import { Entity} from "./entity-class.js";
import { imageIsloadet } from "../assets.js";
import { Collider } from "./collider-class.js";
export class Projectile extends Entity{
    constructor(options, type){
        const {pos, size, color, value, subType} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Projectile";
        this.value =  value || 0;
        this.acc = options.acc || -0.01;
        this.vel = [0,0];
        this.prevPos = options.pos || [0,0];
        this.grav = options.grav || 0;
        this.direction = options.direction || "left";
        this.alive = options.alive || true;
        this.lifespan = options.lifespan || 1;
        this.currentlifeTimer = 0;
        this.demageFlag = options.demageFlag || "Player";
        this.demage = options.demage || 10;
        this.animationFrames = {
            starting: [[{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0}], false],
            idle: [[{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0}], true],
            ending: [[{x:0, y:0}], false],
        }
        this.animationStatus = "starting";
        this.frameWidth = 15;
        this.frameHight = 15;
        this.frameHightOffset = 0;
        this.frameWidthOffset = 8;
        this.animationImage = imageIsloadet.coin;
        this.scaling = 0.625;
        this.animationTimer = 0;
        this.collider = new Collider(this);
    }

    update(deltaTime){
        this.prevPos = [...this.pos];
        super.update(deltaTime);
        this.checkAnimationStatus();
        this.applyPhsics(deltaTime);
        this.updateFrameAnimation(deltaTime);
        this.updateLifeSpan(deltaTime);
        this.moveProjectile();
    }

    moveProjectile(){
        if(this.direction == "left" && this.acc > 0){
            this.acc *= -1;;
        } else if(this.direction == "right" && this.acc < 0) {
            this.acc *= -1;
        } else {
            this.vel[0] = this.acc;
        }
    }

    applyPhsics(deltaTime){
        this.vel[0] += this.acc * deltaTime;
        this.pos[0] += this.vel[0] * deltaTime;
        this.vel[1] += this.grav * deltaTime;
        this.pos[1] += this.vel[1] * deltaTime;
    }

    updateLifeSpan(deltaTime){
        let secDeltaTime = deltaTime / 1000;
        if(this.alive){
            this.currentlifeTimer += secDeltaTime;
            if(Math.floor(this.currentlifeTimer) >= this.lifespan){
                this.alive = false;
            }
        }
    }

    checkAnimationStatus(){
     if (!this.animationIsRunning && this.animationStatus == "starting"){
        this.animationStatus = "idle";
     } else if(!this.alive && !this.animationIsRunning){
        this.acc = 0;
        this.vel[0] = 0;
        this.deleteObject();
     } else if(!this.alive) {
        this.animationStatus = "ending";
     }
    }
}