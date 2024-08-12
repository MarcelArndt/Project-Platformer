import { Rectangle } from "./rectangle-class.js";
import { soundIsloadet } from "../assets.js";
export class Entity extends Rectangle{
    constructor(options, type){
        const {pos, size, color} = options
        super({pos, size, color}, type || "Entity");
        this.index = this.genEntityIndex();  
    }

    /**
     * will generate a id for this Entity
     */
    genEntityIndex(){
        let newIndex = "";
        let subIndex = "";
        for (let i = 0; i < 24;i++){
            subIndex = Math.floor(Math.random()* 9).toString();
            newIndex += subIndex;
        }
        return newIndex;
    }

    /**
     * will search this Entity inside all objetc in level and will delete it.
     */
    deleteObject(){
        let index = null
        this.level.objects.forEach(obj => {
            if (obj.index == this.index){
                index = this.level.objects.indexOf(obj);
                this.level.objects.splice(index, 1);
            }  
        })
    }

     /**
     * to play a random sound from an Array of sounds
     * @param {array} soundArray - pool of soundsObjects where can choose from.
     * @param {number} setVolume - to adjust the volume of a sound 
     */  
    chooseRandomSound(soundArray = [], setVolume = 1){
        let randomNumber = Math.floor(Math.random() * soundArray.length);
            soundIsloadet[soundArray[randomNumber]].volume = setVolume * this.level.globalVolume;
            soundIsloadet[soundArray[randomNumber]].play();
      }

}