import { Entity} from "./entity-class.js";
export class Hitbox extends Entity{
    constructor(options, type){
        const {pos, size, color, subType, level, lifespan, forceToLeft} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Hitbox";
        this.level = level || "";
        this.lifespan = lifespan || 500;
        this.forceToLeft = forceToLeft || false;
        setTimeout(() => {
        this.searchAndDelete("Hitbox");
        }, this.lifespan);
    }

    update(deltaTime){
    }

}