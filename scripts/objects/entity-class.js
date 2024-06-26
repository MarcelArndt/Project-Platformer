import { Rectangle } from "./rectangle-class.js";
import { soundIsloadet } from "../assets.js";
export class Entity extends Rectangle{
    constructor(options, type){
        const {pos, size, color} = options
        super({pos, size, color}, type || "Entity");
        this.index = this.genEntityIndex();  
    }

    genEntityIndex(){
        let newIndex = "";
        let subIndex = "";
        for (let i = 0; i < 24;i++){
            subIndex = Math.floor(Math.random()* 9).toString();
            newIndex += subIndex;
        }
        return newIndex;
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

    update(deltaTime){
        super.update(deltaTime);
    }
}

