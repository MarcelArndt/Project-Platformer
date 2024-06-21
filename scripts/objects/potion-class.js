import { Entity} from "./entity-class.js";
import { imageIsloadet } from "../assets.js";
import { soundIsloadet } from "../assets.js";
export class Potion extends Entity{
    constructor(options, type){
        const {pos, size, color, value, subType} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Item";
        this.value =  value || 15;
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

    activateItem(){
        let newValue = null;
        this.chooseRandomSound(["pop01","pop02","pop03"], false);
        if(this.level.player.maxHealth - this.level.player.health >= this.value){
            this.level.player.health += this.value;
            this.level.player.statusbar.refreshValue(this.level.player.health);
        } else {
            newValue = this.level.player.maxHealth - this.level.player.health;
            this.level.player.health += newValue;
            this.level.player.statusbar.refreshValue(this.level.player.health);
        }
        this.deleteObject();
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


    update(){
        //
    }
}