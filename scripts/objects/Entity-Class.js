import { Rectangle } from "./rectangle.js";

export class Entity extends Rectangle{
    constructor(options, type){
        const {pos, size, color, value} = options
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
        this.level.objects.forEach(obj => {
            if (obj.type == "Player"){
                let isCollide = this.collideWith(obj);
                if(isCollide){
                }
            }  
        })
    }
}
