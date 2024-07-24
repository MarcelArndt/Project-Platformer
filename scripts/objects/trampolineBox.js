import { Hitbox } from "./hitbox-class.js";
import { soundIsloadet } from "../assets.js";
export class Trampoline extends Hitbox{
    constructor(options, entity){
        const {pos, size, color, lifespan, forceToLeft, demage, demageFlag, isAktiv, isAllawysAktiv , offset} = options
        super(pos, size, color, lifespan, forceToLeft, demage, demageFlag, isAktiv, isAllawysAktiv , offset, entity, "Hitbox")
        this.isAllawysAktiv = isAllawysAktiv || false;
        this.entity = entity;
        this.subType = "Trampoline";
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
            obj.vel[1] = -1.45;
            this.chooseRandomSound(["bounce02"]);
    }
}