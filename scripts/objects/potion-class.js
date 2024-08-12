import { Entity} from "./entity-class.js";
import { imageIsloadet } from "../assets.js";
import { soundIsloadet } from "../assets.js";
export class Potion extends Entity{
    constructor(options, type){
        const {pos, size, color, value, subType} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Item";
        this.value =  value || 15;
        this.healthValue =  value || 15;
        this.animationFrames = {
            idle: [[{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}], true],
        }
        this.animationStatus = "idle";
        this.frameWidth = 24;
        this.frameHight = 36;
        this.frameHightOffset = 0;
        this.frameWidthOffset = 0;
        this.animationImage = imageIsloadet.lifePotion;
        this.scaling = 0.65;
        this.animationTimer = 0;

    }

     /**
     * will actived by collision and add healthPoint to Player
     */
    activateItem(){
        let newValue = null;
        this.chooseRandomSound(["pop01","pop02","pop03"]);
        if(this.level.player.maxHealth - this.level.player.health >= this.value){
            this.level.player.health += this.healthValue;
            this.level.player.statusbar.refreshValue(this.level.player.health);
        } else {
            newValue = this.level.player.maxHealth - this.level.player.health;
            this.level.player.health += newValue;
            this.level.player.statusbar.refreshValue(this.level.player.health);
        }
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