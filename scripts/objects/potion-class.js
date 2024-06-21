import { Entity} from "./entity-class.js";
import { imageIsloadet } from "../assets.js";
export class Potion extends Entity{
    constructor(options, type){
        const {pos, size, color, value, subType} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Item";
        this.Value =  value || 15;
        this.animationFrames = {
            idle: [[{x:0, y:0}], true],
        }
        this.animationStatus = "idle";
        this.frameWidth = 24;
        this.frameHight = 24;
        this.frameHightOffset = 19;
        this.frameWidthOffset = 0;
        this.animationImage = imageIsloadet.lifePotion;
        this.scaling = 0.80;
    }

    update(){
        //
    }
}