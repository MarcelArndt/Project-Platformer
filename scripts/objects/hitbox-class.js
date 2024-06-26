import { Entity } from "./entity-class.js"
import { ctx } from "../canvas.js";

export class Hitbox extends Entity{
    constructor(options, type){
        const {pos, size, color, lifespan, forceToLeft, demage, demageFlag, isAktiv, isAllawysAktiv , offset, object} = options
        super({pos, size, color}, type || "Hitbox");
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
        this.lifespan = lifespan || 10;
    }

    update(deltaTime){
        this.checkIsAllawysAktiv();
        this.drawbox()
        this.updatePosition(this.stickToObject);
        //this.updateCounter(deltaTime);
    }

    updatePosition(obj){
        this.pos[0] = obj.pos[0] + this.setOffset[0];
        this.pos[1] = obj.pos[1] + this.setOffset[1];
    }

    drawbox(){
        this.clearCanvas;
        ctx.fillStyle =  this.color;
        ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
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

    updateCounter(deltaTime){
        let secDeltaTime = 0;
       if(this.isAktiv && Math.floor(this.frameCounter) >= this.lifespan){
            this.deactivateCounter();
        } else if (this.isAktiv){
            secDeltaTime = deltaTime / 100;
            this.frameCounter += secDeltaTime;
        }
    }  
}