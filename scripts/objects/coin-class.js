import { Entity} from "./entity-class.js";
export class Coin extends Entity{
    constructor(options, type){
        const {pos, size, color, value, subType} = options
        super({pos, size, color}, type || "Entity");
        this.subType = subType || "Coin";
        this.Value =  value || 10;
    }

    update(deltaTime){
        this.level.objects.forEach(obj => {
            if (obj.type == "Player"){
                let isCollide = this.collideWith(obj);
                if(isCollide){
                        this.searchForCoinAndDelete();
                }
            }  
        })
    }

    searchForCoinAndDelete(){
        for (let i = 0; i < this.level.objects.length; i++){
            if (this.level.objects[i].type == "Entity" && this.level.objects[i].index == this.index){
                this.level.objects.splice([i],1)
            } 
        }
        for (let i = 0; i < this.level.obectsOfType.Entity.length; i++){
            if (this.level.obectsOfType.Entity[i].subType == "Coin" && this.level.obectsOfType.Entity[i].index == this.index){
                this.level.obectsOfType.Entity.splice([i],1)
            } 
        }
    }
}