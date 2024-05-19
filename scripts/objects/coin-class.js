import { Entity} from "./entity-class.js";
export class Coin extends Entity{
    constructor(options, type){
        const {pos, size, color, value, subType} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Coin";
        this.Value =  value || 10;
    }

    update(){
        this.level.objects.forEach(obj => {
            if (obj.type == "Player"){
                let isCollide = this.collideWith(obj);
                if(isCollide){
                        this.searchAndDelete("Coin");
                }
            }  
        })
    }
}