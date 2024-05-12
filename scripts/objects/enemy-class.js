import { Box} from "./box-class.js";
import { Hitbox } from "./hitbox-class.js";


export class Enemy extends Box {
    constructor(options, type){
        super({
            pos: options.pos,
            size: options.size,
            color: "red",
            grav: 0.005,
            friction: 0.2
        },
            type || "Enemy"
        );
        this.facingLeft = true;
        this.crouch = false;
        this.jumpseed = -1.025;
        this.walkspeed = 0.005;
        this.coyoteTime = 75;
        this.isCoyoteTimeReady = true;
        this.latestOnGround = 0;
        this.currentCoyoteTime = null;
        this.walkDirection = 0;
        this.PlayerLocation = [];
        
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

    updateEnemy(){
        if (this.onGround && !this.isCoyoteTimeReady){
            this.isCoyoteTimeReady = true;
        } else if(!this.onGround && this.isCoyoteTimeReady){
          this.startCoyoteTime();
        }
        this.level.obectsOfType.Box.forEach(obj => {
            this.isCollideWithBox(obj);
        });
        this.checkPlayerPosition();
        this.checkCurrentStatus();
        this.checkMaxSpeed();
    }

    isCollideWithBox(obj){
        if(obj.posRight >= this.posLeft && obj.posRight <= this.posRight && this.posTop <= obj.posTop && this.posBottom >= obj.posBottom){
            this.changeDirection();
        } else if(obj.posLeft <= this.posRight && obj.posLeft >= this.posLeft && this.posTop <= obj.posTop && this.posBottom >= obj.posBottom){
            this.changeDirection();
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

    checkCurrentStatus(){
        this.checkDistanceToPlayer(325);
        this.walking();
    }


    checkDistanceToPlayer(AgroRange){
        let playerPosX =  this.PlayerLocation[1] + this.PlayerLocation[3] / 2;
        let playerPosY = this.PlayerLocation[0] + this.PlayerLocation[2] / 2;
        let enemyPosX = this.posLeft + this.posRight / 2;
        let enemyPosY = this.posTop + this.posBottom / 2;
      
        if( playerPosX > enemyPosX - AgroRange && playerPosX < enemyPosX + AgroRange && playerPosY < enemyPosY + AgroRange * 1 && playerPosY > enemyPosY - AgroRange * 1){
            if (playerPosX < enemyPosX && this.walkspeed > 0){
                this.changeDirection();
            } else if (playerPosX > enemyPosX && this.walkspeed < 0){
                this.changeDirection();
            }
            if (this.vel[0] == 0 && this.onGround){
                this.jump();
            }
            
        }
    }

    jump(){
        this.vel[1] = this.jumpseed;
        this.vel[0] = this.walkspeed;
    }

    walking(){
        this.acc = this.walkspeed;
    }

    changeDirection(){
        this.vel[0] = 0;
        this.walkspeed = this.walkspeed * -1
    }

    checkMaxSpeed(){
        if (this.vel[0] >= 0.2){
            this.vel[0] = 0.2;
        }
        if (this.vel[0] <= -0.2){
            this.vel[0] = -0.2;
        }
    }
}