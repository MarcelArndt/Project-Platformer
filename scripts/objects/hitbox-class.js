import { Entity} from "./entity-class.js";
export class Hitbox extends Entity{
    constructor(options, type){
        const {pos, size, color, subType, level, lifespan, forceToLeft, demage} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Hitbox";
        this.level = level || "";
        this.lifespan = lifespan || 500;
        this.forceToLeft = forceToLeft || false;
        this.demage = demage ||10;
        setTimeout(() => {
        this.searchAndDelete("Hitbox");
        }, this.lifespan);
    }

    update(deltaTime){
        //
    }

    //draw(){}
    
}