import { Hitbox } from "./hitbox-class.js";
export class JumpPad extends Hitbox{
    constructor(options, entity){
        const {pos, size, color, lifespan, forceToLeft, demage, demageFlag, isAktiv, isAllawysAktiv , offset} = options
        super(pos, size, color, lifespan, forceToLeft, demage, demageFlag, isAktiv, isAllawysAktiv , offset, entity, "Hitbox")
        this.isAllawysAktiv = isAllawysAktiv || false;
        this.entity = entity;
        this.type = "Hitbox";
        this.subType = "JumpPad";
        this.pos = pos;
        this.size = size;
        this.color = color;
        this.valideTyps = ["Enemy", "Player"]
        this.setOffset = offset || [0,0];
    }

     /**
     * will actived by collision and will let the hitting Entity jump.
     */
    activeInCollision(obj){
        if(this.entity.index != obj.index && this.valideTyps.includes(obj.type)){
            obj.vel[1] = -1.45;
            this.chooseRandomSound(["bounce02"]);
        }
    }
}