import { Box} from "./box-class.js";
import {StateMachine, Idle} from "./stateMashine-bird-class.js";

export class Bird extends Box {
    constructor(options, type){
        const {walkspeed, jumpspeed, subType} = options
        super({
            pos: options.pos,
            size: options.size,
            color: options.color || "green",
            grav: options.grav || 0.005,
            friction: options.friction || 0.2
        },
        );
        this.type =  options.type || "Entity",
        this.walkspeed = options.walkspeed || -0.00075;
        this.jumpspeed = options.jumpspeed || 0.005;
        this.stateMachine = new StateMachine(new Idle(), this);
        this.facingLeft = false;
        this.isFlying =true;
        this.flyGrav = 0.0003,
        this.originGrav =  this.grav;
        this.originPos = [... this.pos];
        this.isReturning = false;   
    }




    update(deltaTime){
        super.update(deltaTime);
        this.stateMachine.updateState();
        this.checkDistanceToPlayer(this.level.objectsOfType.Player);
        this.moving();
        this.fly()
        this.checkFacingLeft();
        this.applyPhsics(deltaTime)
    }   

    moving(){
        let randomNumber = this.randomNumber(50);
        let distance = this.checkDistanceToOriginPos();
        if (distance > 100 && !this.isReturning && randomNumber == 1){
            this.walkspeed = this.walkspeed * -1
            this.acc = this.walkspeed;
            this.isReturning = true
        } else if (distance < 80 && this.isReturning){
            this.isReturning = false
        } else if(randomNumber == 1){
            this.walkspeed = this.walkspeed * -1
            this.acc = this.walkspeed;
        } else {
            this.acc = this.walkspeed;
        } 
    }

    checkFacingLeft(){
        if (this.walkspeed > 0){
            this.facingLeft = false;
        } else if(this.walkspeed < 0) {
            this.facingLeft = true;
        }
    }

    applyPhsics(deltaTime){
        if(this.isFlying){
            this.grav = this.flyGrav;
        } else if (!this.isFlying){
            this.grav = this.originGrav;
        }
        super.applyPhsics(deltaTime);
    }

    fly(){
        let flyAgain = this.randomNumber(3);
       if(this.pos[1] <= 800) {
        console.log(this.pos[1])
        this.setTop = 800;
        this.vel[1] = 0.15
       } else if (this.pos[1] > 900 && flyAgain == 1){
        this.vel[1] = -0.15
        flyAgain = this.randomNumber(5);
       }
    }

    randomNumber(value){
        return Math.floor(Math.random() * value);
    }

    checkDistanceToPlayer(playerObj){
        let distanceX = (this.pos[0] - playerObj[0].pos[0]) * -1;
        let distanceY = (this.pos[1] - playerObj[0].pos[1]) * -1;
        let distance = Math.hypot(distanceX, distanceY); 
        return distance;
    }

    checkDistanceToOriginPos(){
        let distanceX = (this.pos[0] - this.originPos[0]) * -1;
        let distanceY = (this.pos[1] - this.originPos[1]) * -1;
        let distance = Math.hypot(distanceX, distanceY); 
        return distance;
    }


}