import { Entity} from "./entity-class.js";
import { imageIsloadet } from "../assets.js";
import { Collider } from "./collider-class.js";
export class Coin extends Entity{
    constructor(options, type){
        const {pos, size, color, value, subType} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Item";
        this.value =  value || 5;
        this.animationFrames = {
            idle: [[{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0}], true],
        }
        this.animationStatus = "idle";
        this.frameWidth = 15;
        this.frameHight = 15;
        this.frameHightOffset = 0;
        this.frameWidthOffset = 8;
        this.animationImage = imageIsloadet.coin;
        this.scaling = 0.625;
        this.animationTimer = 0;
        this.collider = new Collider(this);
    }

     /**
     * will actived by collision and add points to the player's score
     */
    activateItem(){
        this.chooseRandomSound(["coin01","coin02","coin03"]);
        this.level.player.score += this.value;
        this.deleteObject();
    }

    /**
     * Main Update-Loop
     */
    update(deltaTime){
        super.update(deltaTime);
        this.updateFrameAnimation(deltaTime);
    }

}