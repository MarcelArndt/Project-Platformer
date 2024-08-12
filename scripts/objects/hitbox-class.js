import { Entity } from "./entity-class.js"
import { ctx } from "../canvas.js";
import { Collider } from "./collider-class.js";

export class Hitbox extends Entity{
    constructor(options, entity){
        const {pos, size, color, lifespan, forceToLeft, demage, demageFlag, isActive, isAllawysActive , offset} = options
        super({pos, size, color}, "Hitbox");
        this.subType = "Hitbox";
        this.lifespan = lifespan || 3;
        this.forceToLeft = forceToLeft || false;
        this.demage = demage ||0;
        this.demageFlag = demageFlag || "Enemy";
        this.isActive = isActive || false;
        this.isAllawysActive = isAllawysActive || false;
        this.color = color || "rgba(255,125,0,0.5)";
        this.setOffset = offset || [0,0];
        this.entity = entity || null
        this.frameCounter = 0;
        this.collider = new Collider(this);
        this.lifespan = lifespan || 1;
    }

     /**
     * Main-Update-Update
     */
    update(deltaTime){
        this.checkIsAllawysActive();
        this.draw();
        this.updatePosition(this.stickToObject);
        this.updateCounter(deltaTime / 1000);
        this.collider.update(deltaTime);
    }

    /**
     * is this Hitbox attach to a Entity it will move with it
     */
    updatePosition(){
        this.pos[0] = this.entity.pos[0] + this.setOffset[0];
        this.pos[1] = this.entity.pos[1] + this.setOffset[1];
    }

    /**
     *  activate this Hitbox
     */
    draw(){
       if(this.level.showDebug && this.isActive){
            ctx.fillStyle = this.isActive ? this.color:"rgba(225,125,125,0.4)";
            ctx.fillRect(this.pos[0] - this.level.cameraPos[0], this.pos[1] - this.level.cameraPos[1], this.size[0], this.size[1]);
        }
    }

     /**
     *  activate this Hitbox
     */
    activateCounter(){
        this.isActive = true;
    }

    /**
     *  deactivate this Hitbox
     */
    deactivateCounter(){
        this.isActive = false;
        this.frameCounter = 0;
    }

    /**
     *make sure that a hitbox with isAllawysActiv is still always activ
     */
    checkIsAllawysActive(){
        if(this.isAllawysActive){
            this.isActive = true;
        }
    }

    /**
     * update the Timer-Counter for deactivate the Hitbox
     */
    updateCounter(secDeltaTime){
       if(this.isActive && Math.floor(this.frameCounter) >= this.lifespan){
            this.deactivateCounter();
        } else if (this.isActive){
            this.frameCounter += secDeltaTime;
        }
    }  
    /**
     * if a collision was successful it give a callback to this Entity to activate a hit
     * @param {object} obj Entity get hit by this hitbox
     * @param {string} direction where Entity gets hit from
     */
    activeInCollision(obj, direction){
        if(obj.type == this.demageFlag && this.isActive){
            obj.reciveHitFromObj(direction, this.demage);
        }
    }
}