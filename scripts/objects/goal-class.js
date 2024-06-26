import { Entity} from "./entity-class.js";
import { imageIsloadet } from "../assets.js";
import { soundIsloadet } from "../assets.js";
export class Goal extends Entity{
    constructor(options, type){
        const {pos, size, color, value, subType} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Item";
        this.value =  value || 15;
        this.animationFrames = {
            idle: [[{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}], true],
        }
        this.animationStatus = "idle";
        this.frameWidth = 24;
        this.frameHight = 36;
        this.frameHightOffset = 0;
        this.frameWidthOffset = 0;
        this.animationImage = imageIsloadet.lifePotion;
        this.scaling = 0.9;
        this.animationTimer = 0;

    }

    activateItem(){
        this.chooseRandomSound(["pop01","pop02","pop03"], false);
        this.level.levelIsWon = true;
    }

    chooseRandomSound(soundArray = [], toInterrupt = true){
        let randomNumber = Math.floor(Math.random() * soundArray.length);
        if(!soundIsloadet[soundArray[randomNumber]].paused && toInterrupt){
            soundIsloadet[soundArray[randomNumber]].pause();
            soundIsloadet[soundArray[randomNumber]].currentTime = 0;
        } else {
            soundIsloadet[soundArray[randomNumber]].volume = 1 * this.level.globalVolume;
            soundIsloadet[soundArray[randomNumber]].play();
        }
      }
      
    stopPlayingSound(soundArray){
        soundArray.forEach((sound => {
            if(!soundIsloadet[sound].paused){
                soundIsloadet[sound].pause();
                soundIsloadet[sound].currentTime = 0;
            }
        }));
    }

    deleteObject(){
        let index = null
        this.level.objects.forEach(obj => {
            if (obj.index == this.index){
                index = this.level.objects.indexOf(obj);
                this.level.objects.splice(index, 1);
            }  
        })
    }


    update(deltaTime){
        super.update(deltaTime);
        this.updateFrameAnimation(deltaTime);
    }
}