import { Box} from "./box-class.js";

export class Enemy extends Box {
    constructor(options, type){
        const {walkspeed, jumpseed, aggroRange, HitPoints, invincibilityTimer} = options
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
        this.jumpseed = jumpseed || -1.025;
        this.walkspeed = walkspeed || 0.00125;
        this.aggroRange = aggroRange || 525;
        this.coyoteTime = 75;
        this.isCoyoteTimeReady = true;
        this.latestOnGround = 0;
        this.currentCoyoteTime = null;
        this.PlayerLocation = [];
        this.distanceToPlayer = [];
        this.gethit = false;
        this.getPushBack = false;
        this.HitPoints = HitPoints || 30;
        this.activeInvincibility = 0;
        this.invincibilityTimer = invincibilityTimer || 500;
        this.status = "idle";
        this.onChasing = false;
        this.start = false;
        this.backupOption = {grav: this.grav, walkspeed: this.walkspeed, jumpseed: this.jumpseed, color: this.color, hitPoints: this.HitPoints};
        this.Id = this.genIndex();
        this.originalPos = [... options.pos];
    }

    genIndex(){
        let newIndex = "";
        let subIndex = "";
        for (let i = 0; i < 24;i++){
            subIndex = Math.floor(Math.random()* 9).toString();
            newIndex += subIndex;
        }
        return newIndex;
    }

    delete(type = this.type){
        for (let i = 0; i < this.level.objects.length; i++){
            if (this.level.objects[i].type == type && this.level.objects[i].index == this.index){
                if(this.subType != "Hitbox"){
                    this.HitPoints = this.backupOption.hitPoints;
                    this.level.deleteObjects.push(this);
                }
                this.level.objects.splice([i],1)
            } 
        }
        for (let i = 0; i < this.level.obectsOfType.Entity.length; i++){
            if (this.level.obectsOfType.Entity[i].type == type && this.level.obectsOfType.Entity[i].index == this.index){
                this.level.obectsOfType.Entity.splice([i],1)
            } 
        }
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
        this.checkMaxSpeed();
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
        let getHit = this.gethit
        this.checkIsHit();

        if (!HitPointsLeft){
            this.status = "dead";
            this.stopMoving();
            this.delete();
            //play dieAnimation and delete Enemey in Array of Objects

        } else if (HitPointsLeft && isInFall){
            this.status = "fall";
            //play fallingAnimation

        } else if (HitPointsLeft && !isInFall && this.vel[1] < 0){
            this.status = "jump";
            //play jumpAnimation

        } else if (getHit && HitPointsLeft){
            this.checkInvincibilityTimer();
            this.status = "getHit";
            this.pushBack();
            //set Status to pushBack

        } else if (inAggro[0] && HitPointsLeft && !getHit){
            if(!this.onChasing){
                this.onChasing = true;
                this.jump(-0.50)
            }
            this.status = "chasing";
            //set Status to chasing Player
            this.chasing();

        } else if(HitPointsLeft && !inAggro[0] && !getHit){
            this.status = "walking";
            if(this.onChasing){
                this.onChasing = false;
                this.jump(-0.25)
            }
            //set Status to walking aroundd
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

    checkInvincibilityTimer(){
        let timer = new Date();
        if (this.gethit && timer - this.invincibilityTimer > this.activeInvincibility){
            this.color = this.backupOption.color;
            this.gethit = false;
            this.getPushBack  = false;
        }
    }

    checkIsHit(){
        let leftForce = false;
        this.level.objects.forEach(obj => {
            if (obj.subType == "Hitbox"){
                leftForce = obj.forceToLeft;
                if(this.collideWith(obj) && !this.gethit){
                    if(leftForce){
                        this.getHitLeft = true;
                    } else if(!leftForce){
                        this.getHitLeft = false;
                    }
                    this.color = "grey";
                    this.gethit = true;
                    this.activeInvincibility = new Date();
                    this.reduceHealth(obj);
                    
                }
            }
        });
    }

    makeScreenShake(){
        this.level.screenshake = true;
    }

    reduceHealth(obj){
        this.HitPoints -= obj.demage;
    }

    pushBack(){
        let currenttime = new Date();
        let holdingtime = this.invincibilityTimer / 14;
        let pushBackStrengh = 0.007;

        
        if (!this.getHitLeft) {
            pushBackStrengh = pushBackStrengh * -1;
        }

        if(this.gethit && !this.getPushBack){
            this.jump(-0.75);
            this.acc = pushBackStrengh;
            this.getPushBack  = true;
        }

        if (currenttime - holdingtime  >= this.activeInvincibility){
            this.acc = 0;
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

    reset(){
        this.pos = [... this.originalPos]
    }
}