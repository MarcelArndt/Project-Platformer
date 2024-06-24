import { Box} from "./box-class.js";
import { StateMachine, Idle } from "./stateMashine-skelett-class.js";

export class Enemy extends Box {
    constructor(options, type){
        const {walkspeed, jumpspeed, aggroRange, health, invincibilityTimer, smallAggroRange} = options
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
        this.gethit = false;
        this.getPushBack = false;
        this.getHitLeft = "";
        this.health = options.health || 30;
        this.activeInvincibility = 0;
        this.invincibilityTimer = options.invincibilityTimer || 500;
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
        this.stateMachine = new StateMachine(new Idle(), this);
        this.scoreValue = options.scoreValue || 15;

    }


    delete(){
            let index = null;
            this.level.objects.forEach((obj) => {
                if (obj.index == this.index){
                    index = this.level.objects.indexOf(obj);
                    this.level.objects.splice(index, 1);
            }  
        });
    }   
    

    pushObject(box){
        return{
            toLeft:() => {
                if(box.type !== "Box") return false;
                const distance = box.posRight - this.posLeft;
                if(box.canBeMoved([-distance, 0])){  
                    box.setRight(this.posLeft);
                    return true; 
                }
                const smallGap = box.getRemainingDistanceLeft();
                if(box.canBeMoved([-smallGap, 0])){
                    box.setLeft(box.posLeft - smallGap);
                    this.setLeft(box.posRight);
                    return true;
                }
                return false;
            },
            toRight: () => {
                if(box.type !== "Box") return false;
                const distance = this.posRight - box.posLeft;
                if(box.canBeMoved([distance, 0])){  
                    box.setLeft(this.posRight);
                    return true; 
                }
                const smallGap = box.getRemainingDistanceRight();
                if(box.canBeMoved([-smallGap, 0])){
                    box.setRight(box.posRight + smallGap);
                    this.setRight(box.posLeft);
                    return true;
                }
                return false;
            }
        }
    }

    checkPlayerPosition(){
        let currentPosRight = this.level.objectsOfType.Player[0].posRight
        let currentPosLeft = this.level.objectsOfType.Player[0].posLeft
        let currentPosTop = this.level.objectsOfType.Player[0].posTop
        let currentPosBottom = this.level.objectsOfType.Player[0].posBottom
        this.playerLocation = [currentPosTop,currentPosLeft,currentPosBottom,currentPosRight]
    } 


    update(deltaTime){
        super.update(deltaTime);
        this.updateFrameAnimation(deltaTime);
        this.checkIsHit();
        this.checkPlayerPosition();
        this.checkMaxSpeed();
        this.stateMachine.updateState();
    }


    checkIsFacingLeft(){
        if(this.acc < 0.00020 && !this.gethit && this.acc != 0){
            this.facingLeft = false
        } else if (this.acc > -0.00020 && !this.gethit && this.acc != 0) {
            this.facingLeft = true;
        }
    }


    isInFall(){
        let isInFall = false;
        if(this.vel[1] > 0 && !this.onGround){
            isInFall = true;
        }
        return;
    }


    checkInvincibilityTimer(){
        let timer = new Date();
        if (this.gethit && timer - this.invincibilityTimer > this.activeInvincibility){
            this.color = this.backupOption.color;
            this.gethit = false;
            this.getPushBack  = false;
        }
    }


    checkIsHit(){
        for (let i = 0; i < Object.keys(this.level.demageBoxes).length; i++){
            this.level.demageBoxes[Object.keys(this.level.demageBoxes)[i]].forEach((Hitbox) => {
                if(this.collideWith(Hitbox) && !this.gethit && Hitbox.isAktiv && Hitbox.demageFlag == "Enemy"){
                    switch (Hitbox.forceToLeft){
                        case true: this.getHitLeft = true; break;
                        case false: this.getHitLeft = false; break;
                    }
                    this.gethit = true;
                    this.activeInvincibility = new Date();
                    this.reduceHealth(Hitbox.demage);
                }
            })
        }
    }

    reduceHealth(value){
        this.health -= value;
    }


    checkIsPlayerinAggro(){
        let playerdistance = this.checkDistanceToPlayer();
        let inBigAggro = false;
        let inSmallAggro = false;
        if( playerdistance[0] > this.aggroRange * -1 && playerdistance[0] < this.aggroRange && playerdistance[1] > (this.aggroRange * -1 / 2) && playerdistance[1] < (this.aggroRange / 2)){
            if( playerdistance[0] > this.smallAggroRange * -1 && playerdistance[0] < this.smallAggroRange  && playerdistance[1] > this.smallAggroRange * -1 && playerdistance[1] < this.smallAggroRange){
                inSmallAggro = true
            }
            inBigAggro = true
        }
        this.PlayerInAggro = [inBigAggro, inSmallAggro]
    }

    /**
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

    jump(jumpspeed = this.jumpspeed){
        if(this.onGround){
            this.vel[1] = jumpspeed;
            this.vel[0] = this.walkspeed;
        }
    }

/**
 * 
 * @returns - Value 1 = will it collide at all | Value 2 = will it collide from left = true or Right = false;
 */
    checkisObjectNear(){
        let offset = [2,0];
        let willCollide = [false, false];
        if (this.walkspeed < 0){
            offset = [offset[0] *-1,0];
        }
        this.level.objects.forEach( obj => {
            if (this.collideWith(obj, offset) && obj.type != "Entity" && obj.type != "Player"){
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


    checkMaxSpeed(){
        if (this.vel[0] >= 0.2 && !this.gethit){
            this.vel[0] = 0.2;
        }
        if (this.vel[0] <= -0.2 && !this.gethit){
            this.vel[0] = -0.2;
        }
    }
}