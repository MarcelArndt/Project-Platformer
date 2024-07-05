import { ctx } from "../canvas.js";
export class Collider {
    constructor(entity, toggle = true,){
        this.entity = entity;
        this.isAvailable = toggle;
    }

    /**
     * Only for Debug-Purpose. 
     * @param {*} debugObj -> Send and draw Variable to Debug-Purpose:
     * @param {*} posX  -> position on Canvas.witdh
     * @param {*} poxY  -> position on Canvas.height
     */
    print(debugObj, posX = 350, poxY = 50){
        ctx.font = "14px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText(`${debugObj}`, posX, poxY);
        ctx.fillStyle = "f000";
        ctx.fillText(`${debugObj}`, posX + 0.5, poxY + 0.5);
    }

    /**
     * Only for Debug-Purpose
     * Draw Hitbox.
     */
    showCollider(){
        if(this.entity.level.showDebug){
                ctx.beginPath();
                ctx.lineWidth = "3";
                ctx.strokeStyle = "rgba(50, 175, 200, 0.45)";
                ctx.rect(this.entity.pos[0] - this.entity.level.cameraPos[0], this.entity.pos[1] - this.entity.level.cameraPos[1], this.entity.size[0] + 1, this.entity.size[1]);
                ctx.stroke();
            }
        }

    update(deltaTime){
        this.showCollider();
        this.entity.prevPos = [...this.entity.pos];
        this.entity.level.objects.forEach((obj) => {
            if(this.isAvailable == true && obj.subType != "SemiSolidBlock"){
                this.checkFromBelow(obj);
                this.checkFromAbove(obj);
                this.checkFromLeft(obj);
                this.checkFromRight(obj);
            } else {
                this.checkSemiSolid(obj);
            }
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
        if(this.entity.getPrevPosRight() <= obj.posLeft && this.entity.getPrevPosLeft() <= obj.posLeft && this.entity.collideWith(obj, [8, -2]) && this.checkSpecialHandle(obj ,"left")){
            this.entity.setRight(obj.posLeft - 9);
            this.entity.vel[0] = 0;
        }
    }

    checkFromRight(obj) {
        if(this.entity.getPrevPosLeft() >= obj.posRight && this.entity.getPrevPosLeft() >= obj.posLeft && this.entity.collideWith(obj, [-8, -2]) && this.checkSpecialHandle(obj ,"right")){
            this.entity.setLeft(obj.posRight + 9);
            this.entity.vel[0] = 0;
        }
    }

    checkSemiSolid(obj) {
        if(this.entity.getPrevPosBottom() <= obj.posTop && !this.entity.crouch ) {
            if(this.entity.vel[1] >= -0.001 && obj.collideWith(this.entity, [0, (-this.entity.size[1] / 2 * this.entity.vel[1])])){
                this.entity.setBottom(obj.posTop - 3);
                this.entity.vel[1] = 0;
                this.entity.onGround = true;
            }  else {
                this.entity.jump.currentPressingKey = false;
                this.entity.jump.alreadyInJump = false
            }
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
            && !this.checkforDeath(obj)
            && !this.checkforItem(obj)
            && !this.checkforGetHit(obj)
            && !this.checkDeadlySolidBlock(obj, direction)
            && !this.checkMushroom(obj, direction)
            && !this.checkProjectile(obj)
            && !this.checkBoss(obj, direction)
        );
    }

    checkforItem(obj){
        if (obj.subType == "Item") {
            if(this.entity.type == "Player"){
                obj.activateItem();
            }
            return true
        }
    } 

    checkforBird(obj){
        return (obj.subType == "Bird" && this.entity.type != "Rectangle" || this.entity.subType == "Bird" && obj.type != "Rectangle");
    }

    checkforDeath(obj){
        return (obj.type == "Death" && this.entity.type != "Rectangle" || this.entity.type == "Death" && obj.type != "Rectangle");
    }

    checkforGetHit(obj){
        return (obj.type == "GetHit" && this.entity.type != "Rectangle" || this.entity.type == "GetHit" && obj.type != "Rectangle");
    }

    checkDeadlySolidBlock(obj, direction){
        if (direction == "below" && obj.subType == "deadlySolidBlock"){
            obj.activateTrap(this.entity);
            return true
        }
    }

    checkMushroom(obj, direction){
        if (direction == "below" && obj.subType == "Mushroom"){
            obj.activateTrap(this.entity);
            return true
        }
    }

    checkProjectile(obj){
        if (obj.subType == "Projectile"){
            return true
        }
    }

    checkBoss(obj, direction){
        return (obj.subType == "Boss" && this.entity.type != "Rectangle" || this.entity.subType == "Boss" && obj.type != "Rectangle");
    }
}