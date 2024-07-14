import { Entity } from "./entity-class.js"
import { ctx } from "../canvas.js";
import { Collider } from "./collider-class.js";

export class Hitbox extends Entity{
    constructor(options, type){
        const {pos, size, color, lifespan, forceToLeft, demage, demageFlag, isAktiv, isAllawysAktiv , offset, object} = options
        super({pos, size, color}, type || "Hitbox");
        this.subType = "Hitbox";
        this.lifespan = lifespan || 3;
        this.forceToLeft = forceToLeft || false;
        this.demage = demage ||0;
        this.demageFlag = demageFlag || "Enemy";
        this.isAktiv = isAktiv || false;
        this.isAllawysAktiv = isAllawysAktiv || false;
        this.color = color || "rgba(255,125,0,0.5)";
        this.setOffset = offset || [0,0];
        this.stickToObject = object || null
        this.frameCounter = 0;
        this.collider = new Collider(this);
        this.lifespan = lifespan || 1;
    }

    update(deltaTime){
        this.checkIsAllawysAktiv();
        this.draw();
        this.updatePosition(this.stickToObject);
        this.updateCounter(deltaTime / 1000);
    }

    updatePosition(obj){
        this.pos[0] = obj.pos[0] + this.setOffset[0];
        this.pos[1] = obj.pos[1] + this.setOffset[1];
    }

    draw(){
        if(this.level.showDebug){
            ctx.fillStyle = this.isAktiv ? "rgba(255,50,0,0.1)":"rgba(125,125,125,0.4)";
            ctx.fillRect(this.pos[0] - this.level.cameraPos[0], this.pos[1] - this.level.cameraPos[1], this.size[0], this.size[1]);
        }
    }

    aktivateCounter(){
        this.console("hell")
        this.isAktiv = true;
    }

    deactivateCounter(){
        this.isAktiv = false;
        this.frameCounter = 0;
    }

    checkIsAllawysAktiv(){
        if(this.isAllawysAktiv){
            this.isAktiv = true;
        }
    }

    updateCounter(secDeltaTime){
       if(this.isAktiv && Math.floor(this.frameCounter) >= this.lifespan){
            this.deactivateCounter();
        } else if (this.isAktiv){
            this.frameCounter += secDeltaTime;
        }
    }  

    aktivInCollision(obj, direction){
        if(obj.type == this.demageFlag && this.isAktiv){
            obj.reciveHitFromObj(direction, this.demage);
        }
    }
}