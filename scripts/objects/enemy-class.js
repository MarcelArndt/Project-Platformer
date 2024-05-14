import { Box} from "./box-class.js";
import { Hitbox } from "./hitbox-class.js";


export class Enemy extends Box {
    constructor(options, type, HitPoints){
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
        this.jumpseed = options.jumpseed || -1.025;
        this.walkspeed = options.walkspeed || 0.00125;
        this.aggroRange = options.aggroRange || 325;

        this.coyoteTime = 75;
        this.isCoyoteTimeReady = true;
        this.latestOnGround = 0;
        this.currentCoyoteTime = null;

        this.PlayerLocation = [];
        this.distanceToPlayer = [];

        this.gethit = false;
        this.HitPoints = options.HitPoints || 10;

        this.activeInvincibility = 0;
        this.invincibilityTimer = 500;

        this.status = "null";
        this.onChasing = false;
        this.start = false;

        this.backupOption = {grav: this.grav, walkspeed: this.walkspeed, jumpseed: this.jumpseed}
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


    checkInvincibilityTimer(){
        let currentTimer = new Date();
        if (this.gethit && currentTimer - this.invincibilityTimer > this.activeInvincibility){
            this.color = "red"
            this.gethit = false;
        }
    }


    startCoyoteTime(){
        this.latestOnGround = new Date();
        this.currentCoyoteTime = setTimeout(() => {this.isCoyoteTimeOver()}, this.coyoteTime);
    }


    isCoyoteTimeOver(){
        let currentTime = new Date();
        if (currentTime - this.coyoteTime >= this.currentCoyoteTime){
            this.isCoyoteTimeReady = false;
        }
    }


    checkPlayerPosition(){
        let currentPosRight = this.level.obectsOfType.Player[0].posRight
        let currentPosLeft = this.level.obectsOfType.Player[0].posLeft
        let currentPosTop = this.level.obectsOfType.Player[0].posTop
        let currentPosBottom = this.level.obectsOfType.Player[0].posBottom
        this.PlayerLocation = [currentPosTop,currentPosLeft,currentPosBottom,currentPosRight]
    } 


    updateEnemy(){
        if (this.onGround && !this.isCoyoteTimeReady){
            this.isCoyoteTimeReady = true;
        } else if(!this.onGround && this.isCoyoteTimeReady){
          this.startCoyoteTime();
        }
        this.checkPlayerPosition();
        this.checkCurrentStatus();
        this.checkInvincibilityTimer();
        this.checkMaxSpeed();
        this.checkAggro();
    }


    /**
     *  __________________________ STATE MACHINE ____________________________
     * Status -> walking, chasing, jump, fall, pushBack, die
     *  die = Enemy has zero HP left -> Anaimation
     *  fall = Enemy vertical Speed is above 0 and there is no ground beneath -> Anaimation
     *  jump = enable if Player is in Aggrorange and an Objects is between Enemey and Player
     *  pushBack = Enemy gets hit by Hitbox with "Enemy" as flag
     *  chasing = enable if Player is in Aggrorange
     *  walking = default modus if nothing is in condition
     */

    
    checkCurrentStatus(){
        let isInFall = this.isInFall();
        let inAggro = this.checkIsPlayerinAggro();
        let HitPointsLeft = this.HitPointsLeft();
    
        this.level.objects.forEach(obj => {
            if (obj.subType == "Hitbox"){
                this.checkIsHit(obj)
            }
        });

        //console.log( this.vel[1], isInFall)
        if (!HitPointsLeft){
            this.status = "dead";
            //play dieAnimation and delete Enemey in Array of Objects

        } else if (HitPointsLeft && isInFall){
            this.status = "fall";
            this.stopMoving();
            //play fallingAnimation

        } else if (HitPointsLeft && !isInFall && this.vel[1] < 0){
            this.status = "jump";
            //play jumpAnimation

        } else if (this.gethit && HitPointsLeft){
            this.status = "getHit";
            //set Status to pushBack

        } else if (inAggro[0] && HitPointsLeft){
            if(!this.onChasing){
                this.onChasing = true;
                this.jump(-0.50)
            }
            this.status = "chasing";
            //set Status to chasing Player
            this.chasing();

        } else if(HitPointsLeft && !inAggro[0]){
            this.status = "walking";
            if(this.onChasing){
                this.onChasing = false;
                this.jump(-0.25)
            }
            //set Status to walking around
            this.walking();
        }

    }


    chasing(){
        let willCollide = this.checkisObjectNear();
        let distance = this.checkDistanceToPlayer();
        let aggro = this.checkIsPlayerinAggro();
        if (distance[0] >= 0 && !aggro[1]){
            if (this.walkspeed >= 0 ){
                this.acc = this.walkspeed;
            } else {
                this.walkspeed = this.walkspeed * -1
                this.acc = this.walkspeed;
            } 

        } else if(distance[0] <= 0 && !aggro[1]){
            if (this.walkspeed <= 0 ){
                this.acc = this.walkspeed;
            } else {
                this.walkspeed = this.walkspeed * -1
                this.acc = -this.walkspeed;
            }
        }
        if(willCollide[0]){
            this.jump(); 
        }
        

    }

    stopMoving(){
        this.acc = 0;
    }


    HitPointsLeft(){
        let isHPLeft = true;
        if(this.HitPoints <= 0){
            isHPLeft = false;
        }
        return isHPLeft;
    }


    isInFall(){
        let isInFall = false;
        if(this.vel[1] > 0 && !this.onGround){
            isInFall = true;
        }
        return isInFall;
    }


    checkIsHit(obj){
        if(this.collideWith(obj)){
            if(obj.forceToLeft && !this.gethit){
                this.getHitLeft = true;
            } else if(!obj.forceToLeft && !this.gethit){
                this.getHitLeft = false;
            }
            this.color = "grey";
            this.gethit = true;
            this.activeInvincibility = new Date();
        }
    }


   old_checkIsHit(){
        if (this.gethit){
            let currenttime = new Date();
            let holdingtime = this.invincibilityTimer / 14;
            if (this.getHitLeft){
                this.walkspeed = 0.02;
            } else if (!this.getHitLeft) {
                this.walkspeed = -0.02 * 2;
            }

            this.grav = -0.008;

            if (currenttime - holdingtime  >= this.activeInvincibility){
                this.walkspeed = this.backupOption.walkspeed
                this.grav = this.backupOption.grav
            }
        }
    }


    checkIsPlayerinAggro(){
        let playerdistance = this.checkDistanceToPlayer();
        let inBigAggro = false;
        let inSmallAggro = false;
        if( playerdistance[0] > this.aggroRange * -1 && playerdistance[0] < this.aggroRange && playerdistance[1] > this.aggroRange * -1 / 1.5 && playerdistance[1] < this.aggroRange / 1.5){
            if( playerdistance[0] > this.aggroRange / 4  * -1 && playerdistance[0] < this.aggroRange / 4  && playerdistance[1] > this.aggroRange / 4 * -1 && playerdistance[1] < this.aggroRange / 4){
                inSmallAggro = true
            }
            inBigAggro = true
        }
        return [inBigAggro, inSmallAggro];
    }


    /**
     * posArray[0] & posArray[1] = Player Position X und Player Position Y
     * posArray[2] & posArray[3] = Enemy Position X und Enemy Position Y
     */
    checkDistanceToPlayer(){
        let posArray = [this.PlayerLocation[1] + this.PlayerLocation[3], this.PlayerLocation[0] + this.PlayerLocation[2], this.posLeft + this.posRight, this.posTop + this.posBottom];
        let distanceX = 0;
        let distanceY = 0;

        for (let i = 0; i < posArray; i++){
            posArray[i] = posArray[i] / 2;
        }

        distanceX = posArray[2] - posArray[0];
        distanceX = distanceX * -1;
        distanceY = posArray[3] - posArray[1];
        distanceY = distanceY * -1;

        return [distanceX, distanceY]
    }


    jump(jumpspeed = this.jumpseed){
        this.vel[1] = jumpspeed;
        this.vel[0] = this.walkspeed;
    }


    walking(){
        let willCollide = this.checkisObjectNear();
        if (!this.start && this.status != "chasing" && !willCollide[0]){
            this.acc = this.walkspeed;
        } else if(willCollide[0]){
            this.walkspeed = this.walkspeed * -1;
        }
    }

/**
 * 
 * @returns - Value 1 = will it collide at all | Value 2 = will it collide from left = true or Right = false;
 */
    checkisObjectNear(){
        let offset = [1,0];
        let willCollide = [false, false];
        if (this.walkspeed < 0){
            offset = [offset[0] *-1,0];
        }

        this.level.objects.forEach( obj => {
            if (this.collideWith(obj, offset) && obj.type != "Entity" && obj.type != "Player"){
                 if (this.posLeft - 1 < obj.posRight && this.posRight > obj.posRight) {
                    willCollide[1] = true;
                 } else if(this.posRight + 1 > obj.posLeft && this.posLeft < obj.posLeft){
                    willCollide[1] = false;
                 }
                willCollide[0] = true;
            }
        });

        if(this.posRight == this.level.size[0]){
            willCollide[0] = true
            this.setRight(this.posRight - 3)
        }

        if ( this.posLeft == 0){
            willCollide[0] = true
            this.setLeft(this.posLeft + 3)
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