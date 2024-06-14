import { Entity} from "./entity-class.js";
import { ctx, clearCanvas } from "../canvas.js";
import { imageIsloadet } from "../images.js";
export class Hitbox extends Entity{
    constructor(options, type){
        const {pos, size, color, subType, level, lifespan, forceToLeft, demage, demageFlag, isAktiv, offset, object} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Hitbox";
        this.lifespan = lifespan || 3;
        this.forceToLeft = forceToLeft || false;
        this.demage = demage ||0;
        this.demageFlag = demageFlag || "Enemy";
        this.isAktiv = isAktiv || false;
        this.color = color || "rgba(255,125,0,0.5)";
        this.setOffset = offset || [0,0];
        this.stickToObject = object || null
        this.frameCounter = 0;
        this.lifespan = lifespan || 10
    }

    update(deltaTime){
        this.drawbox()
        this.updatePosition(this.stickToObject)
        this.updateCounter(deltaTime);
    }

    updatePosition(obj){
        this.pos[0] = obj.pos[0] + this.setOffset[0];
        this.pos[1] = obj.pos[1] + this.setOffset[1];
    }

    drawbox(){
        this.clearCanvas;
        ctx.fillStyle = "red";
        ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
    }

    aktivateCounter(){
        this.isAktiv = true;
    }

    deactivateCounter(){
        this.isAktiv = false;
        this.frameCounter = 0;
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