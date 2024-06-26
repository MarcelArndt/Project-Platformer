import { ctx } from "../canvas.js";
export class Collider {
    constructor(entity, toggle = true,){
        this.entity = entity;
        this.isAvailable = toggle;
    }

    /**
     * Only for Debug-Purpose beacause sometimes console.log is to to laggy. 
     * @param {*} debugObj -> Send and draw Variable to Debug-Purpose:
     * @param {*} posX  -> position on Canvas.witdh
     * @param {*} poxY  -> position on Canvas.height
     */
    print(debugObj, posX = 350, poxY = 50){
        ctx.font = "14px PixelifySans";
        ctx.fillStyle = "#fff";
        ctx.fillText(`${debugObj}`, posX, poxY);
        ctx.fillStyle = "f000";
        ctx.fillText(`${debugObj}`, posX, poxY);
    }

    /**
     * Only for Debug-Purpose
     * Draw Hitbox to Debug-Purpose:
     */
    showCollider(){
            ctx.fillStyle = "rgb(0, 75, 175)";  
            ctx.fillRect(this.entity.pos[0] - this.entity.level.cameraPos[0], this.entity.pos[1] - this.entity.level.cameraPos[1], this.entity.size[0] + 1, this.entity.size[1]);
    }

    update(deltaTime){
        this.entity.prevPos = [...this.entity.pos];
        this.entity.level.objects.forEach((obj) => {
            this.checkFromBelow(obj);
            this.checkFromAbove(obj);
            this.checkFromLeft(obj);
            this.checkFromRight(obj);
        });
    }

    checkFromAbove(obj) {
        if(this.entity.getPrevPosTop() <= obj.posBottom && this.entity.getPrevPosBottom() >= obj.posBottom && this.entity.collideWith(obj, [0, 0]) && this.checkSpecialHandle(obj ,"above")){
            this.entity.setTop(obj.posBottom);
            this.entity.vel[1] = 0;
        }
    }

    checkFromBelow(obj) {
        if(this.entity.getPrevPosBottom() >= obj.posTop && this.entity.getPrevPosTop() <= obj.posTop && this.entity.collideWith(obj, [0, 0]) && this.checkSpecialHandle(obj ,"below")){
            this.entity.setBottom(obj.posTop);
            this.entity.vel[1] = 0;
            this.entity.onGround = true;
        } else {
            this.entity.jump.currentPressingKey = false;
            this.entity.jump.alreadyInJump = false
        }
    }
 
    checkFromLeft(obj) {
        if(this.entity.posRight <= obj.posLeft && this.entity.posLeft <= obj.posLeft && this.entity.collideWith(obj, [8, -2]) && this.checkSpecialHandle(obj ,"left")){
            this.entity.setRight(obj.posLeft - 9);
            this.entity.vel[0] = 0;
        }
    }

    checkFromRight(obj) {
        if(this.entity.posLeft >= obj.posRight && this.entity.posLeft >= obj.posLeft && this.entity.collideWith(obj, [-8, -2]) && this.checkSpecialHandle(obj ,"right")){
            this.entity.setLeft(obj.posRight + 9);
            this.entity.vel[0] = 0;
        }
    }

    /**
     * @param {*} obj  -> Object
     * @param {*} direction  -> Direction form where Object hits this.entity. - "above" object hits this.entity from above
     *  For special conditions to check Collisions. if one conditions is true it will prevent to collide. 
     */
    checkSpecialHandle(obj, direction){
        return (
            !this.checkforBird(obj)
            && !this.checkforDeath(obj, direction)
        );
    }

    checkforBird(obj){
        return (obj.subType == "Bird");
    }

    checkforDeath(obj, direction){
        return(direction != "above" && obj.type == "Death" ||  direction != "above" && this.entity.Type == "Death");
    }

}