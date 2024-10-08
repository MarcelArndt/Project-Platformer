import { Box} from "./box-class.js";
import { StateMachine, Idle } from "./stateMashine-skelett-class.js";

export class Enemy extends Box {
    constructor(options, type){
        const {walkspeed, jumpspeed, aggroRange, health, smallAggroRange} = options
        super({
            pos: options.pos,
            size: options.size,
            color: options.color || "red",
            grav: options.grav || 0.005,
            friction: options.friction || 0.2
        },
            type || "Enemy"
        );
        this.facingLeft = true;
        this.jumpspeed = options.jumpspeed || -1.025;
        this.walkspeed = options.walkspeed || 0.00125;
        this.aggroRange = options.aggroRange || 725;
        this.smallAggroRange = options.smallAggroRange || 30;
        this.playerLocation = [];
        this.distanceToPlayer = [];
        this.getHit = false;
        this.getPushBack = false;
        this.getHitLeft = "";
        this.health = options.health || 50;
        this.onChasing = false;
        this.PlayerInAggro = [false,false];
        this.fall = false;
        this.start = false;
        this.backupOption = {grav: this.grav, walkspeed: options.walkspeed || 0.00125, jumpspeed:  options.jumpspeed || -1.025, color: this.color, health: options.health || 30};
        this.originalStats = {pos: options.pos, facingLeft: this.facingLeft, vel: this.vel,acc: this.acc, health: this.health, isCoyoteTimeReady: this.isCoyoteTimeReady, walkspeed: options.walkspeed || 0.00125,}
        this.status = "idle";
        this.animationStatus = "idle";
        this.prevStatus = "idle";
        this.demageBoxes = [];
        this.maxInvincibilityTimer = 0.55;
        this.stateMachine = new StateMachine(new Idle(), this);
        this.scoreValue = options.scoreValue || 15;
    }

    /**
     * will look inisde level Objects for his id and delete it.
     */
    delete(){
            let index = null;
            this.level.objects.forEach((obj) => {
                if (obj.index == this.index){
                    index = this.level.objects.indexOf(obj);
                    this.level.objects.splice(index, 1);
            }  
        });
    }   
    
   /**
   * Push Object aside if possible to the left
   */
    pushObjectToLeft(box){
        if (box.type != "Box") return false;
            const distance = box.posRight - this.posLeft;
        if (box.canBeMoved([-distance, 0])) {
            box.setRight(this.posLeft);
            return true;
        }
            const smallGap = box.getRemainingDistanceLeft();
        if (box.canBeMoved([-smallGap, 0])) {
            box.setLeft(box.posLeft - smallGap);
            this.setLeft(box.posRight);
            return true;
        }
        return false;
    }


   /**
   * Push Object aside if possible to the right
   */
    pushObjectToRight(box){
        if (box.type != "Box") return false;
            const distance = this.posRight - box.posLeft;
        if (box.canBeMoved([distance, 0])) {
            box.setLeft(this.posRight);
            return true;
        }
            const smallGap = box.getRemainingDistanceRight();
        if (box.canBeMoved([-smallGap, 0])) {
            box.setRight(box.posRight + smallGap);
            this.setRight(box.posLeft);
            return true;
        }
        return false;
    }
    
    /**
     * Push Object aside if possible
     * @param {Object} box is a Object, that is possible to push aside
     */
    pushObject(box) {
        return {
        toLeft: () => pushObjectToLeft(box),
        toRight: () => pushObjectToRight(box),
        };
    }

    /**
     * save the current location of Player
     */
    checkPlayerPosition(){
        let currentPosRight = this.level.objectsOfType.Player[0].posRight
        let currentPosLeft = this.level.objectsOfType.Player[0].posLeft
        let currentPosTop = this.level.objectsOfType.Player[0].posTop
        let currentPosBottom = this.level.objectsOfType.Player[0].posBottom
        this.playerLocation = [currentPosTop,currentPosLeft,currentPosBottom,currentPosRight]
    } 


     /**
     * Main-Update-Loop
     */
    update(deltaTime){
        super.update(deltaTime);
        this.updateFrameAnimation(deltaTime);
        this.checkPlayerPosition();
        this.checkMaxSpeed();
        this.stateMachine.updateState();
    }

    /**
    * check is this Enemy is looking right or left
    */
    checkIsFacingLeft(){
        if(this.acc < 0.00020 && !this.getHit && this.acc != 0){
            this.facingLeft = false
        } else if (this.acc > -0.00020 && !this.getHit && this.acc != 0) {
            this.facingLeft = true;
        }
    }

    /**
    * check is enemy falling
    */
    isInFall(){
        let isInFall = false;
        if(this.vel[1] > 0 && !this.onGround){
            isInFall = true;
        }
        return;
    }

    /**
    * checks is Player in any AggroRange 
    * first AggroRange for running towards Player
    * is Enemy close enough and Player is in the second AggroRange -> Enemy will attack
    */
    checkIsPlayerinAggro(){
        let playerdistance = this.checkDistanceToPlayer();
        let inBigAggro = false;
        let inSmallAggro = false;
        if( playerdistance[0] > this.aggroRange * -1 && playerdistance[0] < this.aggroRange && playerdistance[1] > (this.aggroRange * -1 / 2) && playerdistance[1] < (this.aggroRange / 2)){
            if( playerdistance[0] > this.smallAggroRange * -1 && playerdistance[0] < this.smallAggroRange  && playerdistance[1] > this.smallAggroRange * -1 && playerdistance[1] < this.smallAggroRange){
                inSmallAggro = true;
            }
            inBigAggro = true;
        }
        this.PlayerInAggro = [inBigAggro, inSmallAggro];
    }

    /**
     * Checks the distance between Player and Enemey
     * returns an Array 
     * posArray[0] & posArray[1] = Player Position X und Player Position Y
     * posArray[2] & posArray[3] = Enemy Position X und Enemy Position Y
     */
    checkDistanceToPlayer(){
        let posArray = [this.playerLocation[1] + this.playerLocation[3], this.playerLocation[0] + this.playerLocation[2], this.posLeft + this.posRight, this.posTop + this.posBottom];
        let distanceX = 0;
        let distanceY = 0;
        for (let i = 0; i < posArray; i++){
            posArray[i] = posArray[i] / 2;
        }
        distanceX = (posArray[2] - posArray[0]) * -1;
        distanceY = (posArray[3] - posArray[1]) * -1;
        return [distanceX, distanceY, Math.hypot(distanceX, distanceY)]
    }

    /**
    * let Enemy jump
    * @param {Number} jumpspeed -> to discribe how strong this jump is
    */
    jump(jumpspeed = this.jumpspeed){
        if(this.onGround){
            this.isAlreadyJumping = true;
            this.vel[1] = jumpspeed;
            this.vel[0] = this.walkspeed;
        }
    }

    /**
     * check for his cooldown and stop attacking if is not ready
     */
    checkForCooldown(){
        this.currentTime = new Date();
        if (this.currentTime - this.cooldown.MainAttackCooldownValue > this.cooldown.latestDateOfAttack && this.cooldown.isMainAttack){
            this.cooldown.isMainAttack = false;
        }
    }

    /**
    * checks is something in way of Enemy
    * @returns - Value 1 => will it collide at all -> true or false | Value 2 => will it collide from left = true or Right = false;
    */
    checkisObjectNear(){
        let offset = [25,0];
        let willCollide = [false, false];
        if (this.walkspeed < 0){
            offset = [offset[0] * -1, 0];
        }
        this.level.objects.forEach( obj => {
            if (this.collideWith(obj, offset) && obj.type != "Entity" && obj.type != "Player" && obj.type != "Hitbox"){
                if(this.posRight + offset[0] > obj.posLeft && this.posLeft < obj.posLeft) {
                    willCollide[1] = true
                }
                willCollide[0] = true;
            }
            return willCollide;
        });
        willCollide = this.checkIsLevelSizeNear(willCollide, offset);
        return willCollide;
    }

    /**
     * Help function for checkisObjectNear() and checks is enemy infront of the end of the level
     * @param {*} willCollide will adding infos about collsion of the end of the level
     * @param {Value} offset for checking the end of the level
     * @returns 
     */
    checkIsLevelSizeNear(willCollide, offset){
        if(this.posRight + offset[0] >= this.level.size[0]){
            willCollide[0] = true;
            willCollide[1] = true;
        }
        if (this.posLeft + offset[0] <= 0){
            willCollide[0] = true;
            willCollide[1] = false;
        }
        return willCollide;
    }

    /**
     * Set max Speed to any direction to prevent bugs
     */
    checkMaxSpeed(){
        if (this.vel[0] >= 0.2 && !this.gethit){
            this.vel[0] = 0.2;
        }
        if (this.vel[0] <= -0.2 && !this.gethit){
            this.vel[0] = -0.2;
        }
        if(this.vel[1] >= 0 && this.onGround){
            this.isAlreadyJumping = false;
        }
        if(this.vel[1] < (this.jumpseed * 1.4)){
            this.vel[1] = this.jumpseed;
          }
    }
}