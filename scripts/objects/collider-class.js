import { ctx } from "../canvas.js";
export class Collider {
    constructor(entity, toggle = true,){
        this.entity = entity;
        this.isAvailable = toggle || true;
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
                ctx.lineWidth = "1";
                ctx.strokeStyle = "rgba(150, 255, 240, 0.45)";
                ctx.rect(this.entity.pos[0] - this.entity.level.cameraPos[0], this.entity.pos[1] - this.entity.level.cameraPos[1], this.entity.size[0] + 1, this.entity.size[1]);
                ctx.stroke();
            }
        }


    update(deltaTime){
        let validType = ["Player", "Enemy"]
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
           if (this.entity.type != "Hitbox"){
            this.entity.setTop(obj.posBottom);
            this.entity.vel[1] =  0;
           }
        }
    }

    checkFromBelow(obj) {
        if(this.entity.getPrevPosBottom() >= obj.posTop && this.entity.getPrevPosTop() <= obj.posTop && this.entity.collideWith(obj, [0, 0]) && this.checkSpecialHandle(obj ,"below")){
            if (this.entity.type != "Hitbox"){
                this.entity.setBottom(obj.posTop);
                this.entity.vel[1] = 0;
                this.entity.onGround = true;
            }
        }  else if(this.entity.type == "Player"){
            this.entity.jump.currentPressingKey = false;
            this.entity.jump.alreadyInJump = false
        }
    }
 
    checkFromLeft(obj) {
        if(this.entity.getPrevPosRight() <= obj.posLeft && this.entity.getPrevPosLeft() <= obj.posLeft && this.entity.collideWith(obj, [8, -2]) && this.checkSpecialHandle(obj ,"left")){
            if (this.entity.type != "Hitbox"){
                this.entity.setRight(obj.posLeft - 9);
                this.entity.vel[0] = 0;
            }
        }
    }

    checkFromRight(obj) {
        if(this.entity.getPrevPosLeft() >= obj.posRight && this.entity.getPrevPosLeft() >= obj.posLeft && this.entity.collideWith(obj, [-8, -2]) && this.checkSpecialHandle(obj ,"right")){
            if (this.entity.type != "Hitbox"){
                this.entity.setLeft(obj.posRight + 9);
                this.entity.vel[0] = 0;
            }
        }
    }

    checkSemiSolid(obj) {
        if(this.entity.getPrevPosBottom() <= obj.posTop && !this.entity.crouch && this.checkSpecialHandle(obj ,"below")) {
            if (this.entity.type != "Hitbox"){
                if(this.entity.vel[1] >= -0.001 && obj.collideWith(this.entity, [0, (-this.entity.size[1] / 2 * this.entity.vel[1])])){
                    this.entity.setBottom(obj.posTop - 2);
                    this.entity.vel[1] = 0;
                    this.entity.onGround = true;
                }  else if(this.entity.type == "Player"){
                    this.entity.jump.currentPressingKey = false;
                    this.entity.jump.alreadyInJump = false
                }
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
            && !this.checkJumpPad(obj)
            && !this.checkHitbox(obj)
            && !this.checkforDeath(obj)
            && !this.checkforItem(obj)
            && !this.checkforGetHit(obj)
            && !this.checkNoCollsionSubType(obj)
            && !this.checkEnemyinEnemey(obj)
            && !this.checkProjectile(obj, direction)
            && !this.checkDeadlySolidBlock(obj, direction)
            && !this.checkBoss(obj, direction)
        );
    }

    checkNoCollsionSubType(obj){
        return (obj.subType == "noCollider" && this.entity.type != "Rectangle" || this.entity.type == "noCollider" && obj.type != "Rectangle");
    }

    checkEnemyinEnemey(obj){
        return (obj.Type == "Enemy" && this.entity.type == "Enemy");
    }

    checkforItem(obj){
        if (obj.subType == "Item" && this.entity.type == "Player") {
                obj.activateItem();
            return true
        } else if(obj.subType == "Item" && this.entity.type == "Enemy"){
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

    checkProjectile(obj, direction){
        let validType = ["Player", "Enemy", "Rectangle"]
        if (obj.subType == "Projectile" && validType.includes(this.entity.type)){
            obj.aktivInCollision(this.entity, direction);
            return true
        }
        return false
    }

    checkJumpPad(obj, direction){
        let valideTyps = ["Enemy", "Player"];
        if(obj.subType == "JumpPad"){
            if(this.entity.index != obj.entity.index && valideTyps.includes(this.entity.type) && this.entity.posBottom < obj.posBottom && this.entity.vel[1] >= 0){
                obj.aktivInCollision(this.entity)
            }
            return true
        }
    }

    checkHitbox(obj){
        let gethitfrom = false;
        if(obj.type == "Hitbox"){
            if(obj.isAktiv && obj.demageFlag == this.entity.type && this.entity.isOnScreen){
                gethitfrom = obj.forceToLeft == true ? "left" : "right";
                obj.aktivInCollision(this.entity, gethitfrom);
            }
            return true
        }
    }

    checkBoss(obj){
        return (obj.subType == "Boss" && this.entity.type != "Rectangle" || this.entity.subType == "Boss" && obj.type != "Rectangle");
    }




}