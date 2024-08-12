import { ctx } from "../canvas.js";
export class Collider {
    constructor(entity, toggle = true,){
        this.entity = entity;
        this.isAvailable = toggle || true;
        this.posLeft =  0;
        this.posRight = 0;
        this.posBottom =  0;
        this.posTop =  0;
        this.validType = [["Player", "Enemy", "Rectangle", "Death", "GetHit"], ["Item", "Bird", "Projectile"], ["Hitbox"], ["Hitbox", "JumpPad"]];
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
                ctx.lineWidth = 1;
                ctx.strokeStyle = "rgba(150, 255, 240, 0.45)";
                ctx.rect(this.entity.pos[0] - this.entity.level.cameraPos[0], this.entity.pos[1] - this.entity.level.cameraPos[1], this.entity.size[0] + 1, this.entity.size[1]);
                ctx.stroke();
            }
        }

     /**
     * Main Update-Loop and checks for collision in any direction and if something is landing on a SemiSolid Plattform
     */
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

     /**
     * Checks for Entity is colliding with something from above
     */
    checkFromAbove(obj) {
        if(this.entity.getPrevPosTop() <= obj.posBottom && this.entity.getPrevPosBottom() >= obj.posBottom && this.entity.collideWith(obj, [0, 0])){
           if (this.entity.type != "Hitbox" && this.checkSpecialHandle(obj ,"above")){
            this.entity.setTop(obj.posBottom);
            this.entity.vel[1] =  0;
           }
        }
    }

    /**
     * Checks for Entity is colliding with something from bottom
     */
    checkFromBelow(obj) {
        if(this.entity.getPrevPosBottom() >= obj.posTop && this.entity.getPrevPosTop() <= obj.posTop && this.entity.collideWith(obj, [0, 0])){
            if (this.entity.type != "Hitbox" && this.entity.subType != "JumpPad" && this.checkSpecialHandle(obj ,"below")){
                this.entity.setBottom(obj.posTop);
                this.entity.vel[1] = 0;
                this.entity.onGround = true;
            }
        }  else if(this.entity.type == "Player"){
            this.entity.jump.currentPressingKey = false;
            this.entity.jump.alreadyInJump = false
        }
    }
    
    /**
     * Checks for Entity is colliding with something from left
     */
    checkFromLeft(obj) {
        if(this.entity.getPrevPosRight() <= obj.posLeft && this.entity.getPrevPosLeft() <= obj.posLeft && this.entity.collideWith(obj, [8, -2])){
            if (this.entity.type != "Hitbox" && this.entity.subType != "JumpPad" && this.checkSpecialHandle(obj ,"left")){
                this.entity.setRight(obj.posLeft - 9);
                this.entity.vel[0] = 0;
            }
        }
    }

    /**
     * Checks for Entity is colliding with something from right
     */
    checkFromRight(obj) {
        if(this.entity.getPrevPosLeft() >= obj.posRight && this.entity.getPrevPosLeft() >= obj.posLeft && this.entity.collideWith(obj, [-8, -2])){
            if (this.entity.type != "Hitbox" && this.entity.subType != "JumpPad" && this.checkSpecialHandle(obj ,"right")){
                this.entity.setLeft(obj.posRight + 9);
                this.entity.vel[0] = 0;
            }
        }
    }

     /**
     * Checks for Entity is landing on a SemiSolid Plattform
     */
    checkSemiSolid(obj) {
        if(this.entity.getPrevPosBottom() <= obj.posTop && !this.entity.crouch) {
            if (this.entity.type != "Hitbox" && this.entity.subType != "JumpPad" && this.checkSpecialHandle(obj ,"below")){
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
     * @param {object} obj  -> Object
     * @param {string} direction  -> Direction form where Object hits this.entity. - "above" object hits this.entity from above
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
            && !this.checkProjectile(obj, direction)
            && !this.checkDeadlySolidBlock(obj, direction)
            && !this.checkBoss(obj)
        );
    }

     /**
     * prevent collsion against Entity of any Typ with Entity with subType "noCollider"
     */
    checkNoCollsionSubType(obj){
        return (obj.subType == "noCollider" && this.entity.type != "Rectangle" || this.entity.type == "noCollider" && obj.type != "Rectangle");
    }

     /**
     * checks for Player is in collision with an item and prevent Enemy can collide with items
     */
    checkforItem(obj){
        if (obj.subType == "Item" && this.entity.type == "Player") {
                obj.activateItem();
            return true
        } else if(obj.subType == "Item" && this.entity.type == "Enemy"){
            return true
        }
    } 

     /**
     * prevent collison withs Birds
     */
    checkforBird(obj){
        return (obj.subType == "Bird" && this.entity.type != "Rectangle" || this.entity.subType == "Bird" && obj.type != "Rectangle");
    }

    /**
     * prevent collison withs Objects/Entities with Type "Dead"
     */
    checkforDeath(obj){
        return (obj.type == "Death" && this.entity.type != "Rectangle" || this.entity.type == "Death" && obj.type != "Rectangle");
    }

     /**
     * prevent collison withs Objects/Entities with Type "Dead"
     */
    checkforGetHit(obj){
        return (obj.type == "GetHit" && this.entity.type != "Rectangle" || this.entity.type == "GetHit" && obj.type != "Rectangle");
    }

     /**
     * checks for collision with Spikes to kill the Entity
     */
    checkDeadlySolidBlock(obj, direction){
        if (direction == "below" && obj.subType == "deadlySolidBlock"){
            obj.activateTrap(this.entity);
            return true
        }
    }

     /**
     * checks for collision with porjectiles and give Entity some demage
     */
    checkProjectile(obj, direction){
        let validType = ["Player", "Enemy", "Rectangle"]
        if (obj.subType == "Projectile" && validType.includes(this.entity.type)){
            obj.activeInCollision(this.entity, direction);
            return true
        }
        return false
    }

     /**
     * checks if Entity is jump on a JumpPad to push back into the air
     */
    checkJumpPad(obj){
        let valideTyps = ["Enemy", "Player"];
        if(obj.subType == "JumpPad" && this.entity.type != "Hitbox" && this.entity.index != obj.index && valideTyps.includes(this.entity.type) && this.entity.vel[1] >= 0){
                obj.activeInCollision(this.entity)
            return true
        }
    }

     /**
     * checks for Enity is getting hit by a active Hitbox with the Entity's Type for his target.
     */
    checkHitbox(obj){
        let gethitfrom = false;
        if(obj.type == "Hitbox" && this.entity.subType != "JumpPad"){
            if(obj.isActive && obj.demageFlag == this.entity.type && this.entity.isOnScreen){
                gethitfrom = obj.forceToLeft == true ? "left" : "right";
                obj.activeInCollision(this.entity, gethitfrom);
            }
            return true
        }
    }

     /**
     * to allow to run though the Boss
     */
    checkBoss(obj){
        return (obj.subType == "Boss" && this.entity.type != "Rectangle" || this.entity.subType == "Boss" && obj.type != "Rectangle");
    }
}