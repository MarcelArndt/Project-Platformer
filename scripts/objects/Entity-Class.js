import { Rectangle } from "./rectangle.js";

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

    update(deltaTime){
    }

    searchAndDelete(type){
        for (let i = 0; i < this.level.objects.length; i++){
            if (this.level.objects[i].subType == type && this.level.objects[i].index == this.index){
                this.level.objects.splice([i],1)
            } 
        }
        for (let i = 0; i < this.level.obectsOfType.Entity.length; i++){
            if (this.level.obectsOfType.Entity[i].subType == type && this.level.obectsOfType.Entity[i].index == this.index){
                this.level.obectsOfType.Entity.splice([i],1)
            } 
        }
    }

}
