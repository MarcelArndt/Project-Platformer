import { Entity} from "./entity-class.js";
import { imageIsloadet } from "../assets.js";
import { Collider } from "./collider-class.js";
export class Projectile extends Entity{
    constructor(options, type){
        const {pos, size, color, value, subType} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Projectile";
        this.value =  value || 0;
        this.vel = [0,0];
        this.speedX = options.speedX || 0.7;
        this.speedY = options.speedY || 0.5;
        this.speedMultiplyer = options.speedMultiplyer || 0.1;
        this.prevPos = options.pos || [0,0];
        this.grav = options.grav || 0;
        this.stateMaschine = new StateMachine(new StartAnimationDelay(), this)
        this.alive = options.alive || true;
        this.lifespan = options.lifespan|| 5;
        this.currentlifeTimer = 0;
        this.demageFlag = options.demageFlag || "Player";
        this.demage = options.demage || 10;
        this.animationFrames = {
            starting: [[{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:3, y:0}], false],
            idle: [[{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0}], true],
            ending: [[{x:0, y:0},{x:0, y:2},{x:0, y:0},{x:0, y:2},{x:0, y:0},{x:0, y:2}], false],
        }
        this.animationSpeed = 1;
        this.animationStatus = "starting";
        this.frameWidth = 15;
        this.frameHight = 15;
        this.frameHightOffset = 0;
        this.frameWidthOffset = 8;
        this.animationImage =  options.image || imageIsloadet.coin;
        this.scaling = 0.625;
        this.animationTimer = 0;
        this.collider = new Collider(this);
    }

    update(deltaTime){
        this.prevPos = [...this.pos];
        super.update(deltaTime);
        this.updateFrameAnimation(deltaTime);
        this.stateMaschine.updateState(deltaTime);
    }

    aktivInCollision(obj, direction){
        if(obj.type == this.demageFlag){
            obj.reciveHitFromObj(direction, this.demage);
        }
    }

    moveProjectile(deltaTime){
        if( this.animationStatus != "starting"){
            this.pos[0] += this.speedX * this.speedMultiplyer * deltaTime;
            this.pos[1] += this.speedY * this.speedMultiplyer * deltaTime;
            this.vel[1] += this.grav * deltaTime;
        }

    }

    updateLifeSpan(deltaTime){
        let secDeltaTime = deltaTime / 1000;
        if(this.currentlifeTimer < this.lifespan && this.alive){
            this.currentlifeTimer += secDeltaTime;
            if(this.currentlifeTimer > this.lifespan && this.alive){
                this.alive = false;
            }
        }
    }
}

class StateMachine {
    constructor(state, entity){
        this.currentState = state;
        this.entity = entity;
        this.currentState.start(this.entity);
    }

    changeState(newState){
        this.currentState.leaveState(this.entity);
        this.currentState = newState;
        this.currentState.start(this.entity);
    }

    updateState(deltaTime){
        this.currentState.behave(this.entity, deltaTime);
        this.currentState.checkConditions(this.entity, deltaTime);
    }
}

class StartAnimationDelay {
    start(entity){
        entity.animationStatus = "starting"
        entity.animationIsRunning = true;
    }
    behave(entity, deltaTime){}
    checkConditions(entity, deltaTime){
        if(!entity.animationIsRunning){
            entity.stateMaschine.changeState(new IdleAnimation());
        }
    }
    leaveState(entity){}
}

class IdleAnimation {
    start(entity){
        entity.animationStatus = "idle"
    }

    behave(entity, deltaTime){
        entity.updateLifeSpan(deltaTime);
        entity.moveProjectile(deltaTime);
    }

    checkConditions(entity, deltaTime){
        if(!entity.alive){
            entity.stateMaschine.changeState(new EndAnimation());
        }
    }

    leaveState(entity){

    }
} 

class EndAnimation{
    start(entity){
        entity.animationStatus = "ending"
        entity.animationIsRunning = true;
    }

    behave(entity, deltaTime){

    }

    checkConditions(entity, deltaTime){
        if(!entity.animationIsRunning){
            entity.deleteObject();
        }
    }

    leaveState(entity){

    } 
}