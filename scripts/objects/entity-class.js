import { Rectangle } from "./rectangle-class.js";
import { soundIsloadet } from "../assets.js";
export class Entity extends Rectangle{
    constructor(options, type){
        const {pos, size, color} = options
        super({pos, size, color}, type || "Entity");
        this.index = this.genEntityIndex();  
    }

    get posLeft(){
        return this.pos[0];
    }

    get posRight(){
        return this.pos[0] + this.size[0];
    }

    get posTop(){
        return this.pos[1];
    }

    get posBottom(){
        return this.pos[1] + this.size[1];
    }

    get posX(){
        return (this.posLeft + this.posRight) / 2
    }

    get posY(){
        return (this.posTop + this.posBottom) / 2
    }

    setLeft(value){
        this.pos[0] = value;
    }

    setRight(value){
        this.pos[0] = value - this.size[0] ;
    }

    setTop(value){
        this.pos[1] = value;
    }

    setBottom(value){
        this.pos[1] = value- this.size[1] ;
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

    chooseRandomSound(soundArray = [], toInterrupt = true , setVolume = 1){
        let randomNumber = Math.floor(Math.random() * soundArray.length);
        if(!soundIsloadet[soundArray[randomNumber]].paused && toInterrupt){
            soundIsloadet[soundArray[randomNumber]].pause();
            soundIsloadet[soundArray[randomNumber]].currentTime = 0;
        } else {
            soundIsloadet[soundArray[randomNumber]].volume = setVolume * this.level.globalVolume;
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

