import { Entity } from "./entity-class.js"

export class Goal extends Entity{
    constructor(option, type, subType){
        super(option, type || "Entity", subType || "Goal")
        this.subType = subType || "Goal" 
    }

    update(){
        this.level.objects.forEach(obj => {
            if (obj.type == "Player"){
                if(this.collideWith(obj)){
                    this.level.levelIsWon = true;
                }
            }  
        })
    }
    
}