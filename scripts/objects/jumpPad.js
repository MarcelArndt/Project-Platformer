import { Hitbox } from "./hitbox-class.js";
import { soundIsloadet } from "../assets.js";
export class JumpPad extends Hitbox{
    constructor(options, entity){
        const {pos, size, color, lifespan, forceToLeft, demage, demageFlag, isAktiv, isAllawysAktiv , offset} = options
        super(pos, size, color, lifespan, forceToLeft, demage, demageFlag, isAktiv, isAllawysAktiv , offset, entity, "Hitbox")
        this.isAllawysAktiv = isAllawysAktiv || false;
        this.entity = entity;
        this.subType = "JumpPad";
        this.pos = pos;
        this.size = size;
        this.color = color;
        this.valideTyps = ["Enemy", "Player"]
        this.setOffset = offset || [0,0];
    }

    update(deltaTime){
        this.checkIsAllawysAktiv();
        this.draw();
        this.updatePosition(this.stickToObject);
        this.updateCounter(deltaTime / 1000);
        this.collider.update(deltaTime);
    }

    aktivInCollision(obj){
        if(this.entity.index != obj.index && this.valideTyps.includes(obj.type)){
            obj.vel[1] = -1.45;
            this.chooseRandomSound(["bounce02"]);
        }
    }
}