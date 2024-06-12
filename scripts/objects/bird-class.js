import { Box} from "./box-class.js";
import { StateMachine, Idle } from "./stateMashine-bird-class.js";
import { imageIsloadet } from "../images.js";

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
        this.subType =  options.subType || "Bird",
        this.walkspeed = options.walkspeed || -0.001;
        this.jumpspeed = options.jumpspeed || 0.005;
        this.stateMachine = new StateMachine(new Idle(), this);
        this.facingLeft = false;
        this.isFlying = false;
        this.flyGrav = 0.0003,
        this.flyspeed = this.walkspeed * 2,
        this.originWalkspeed = options.walkspeed || -0.00075;
        this.originGrav = this.grav;
        this.originPos = [... this.pos];
        this.isReturning = false;  
        this.isJump = false;
        this.animationFrames = {
            idle: [[{x:0, y:4}], false],
            jump: [[{x:0, y:4}, {x:0, y:4}, {x:1, y:4}, {x:1, y:4},{x:2, y:4}, {x:2, y:4}], true],
            flying: [[{x:0, y:0}, {x:0, y:0}, {x:1, y:0}, {x:1, y:0},{x:2, y:0}, {x:2, y:0}], true],
        }
        this.scaling = 0.7
        this.frameWidth = 32;
        this.frameHight = 32;
        this.frameHightOffset = 1;
        this.frameWidthOffset = 0;
        this.imageArray = [imageIsloadet.whiteBird, imageIsloadet.bluejayBird, imageIsloadet.robinBird]

        this.animationImage = new Image();
        this.animationImage = this.imageArray[this.randomNumber(3)];
        this.animationTimer = 0;
       
    }

    moving(){
        this.checkFacingLeft();
        this.vel[0] =  this.walkspeed * 300;
    }

    stopMoving(){
        this.acc = 0;
    }

    flee(){
        let distance = this.checkDistanceToPlayer(this.level.objectsOfType.Player[0]);
        if(distance[1] >= 0 && distance[2] < 35){
            this.walkspeed = -0.0035;
        } else if(distance[1] < 0 && distance[2] < 35){
            this.walkspeed = 0.0035;
        }
        this.acc = this.walkspeed;
    }
    
    update(deltaTime){
        this.prevPos = [...this.pos];
        this.applyPhsics(deltaTime);
        this.boundToLevel();
        this.level.objects.forEach(obj => {
            this.collide(obj).fromAbove();
            this.collide(obj).fromLeft();
            this.collide(obj).fromRight();
        })
        this.updateFrameAnimation(deltaTime);
        this.applyFlyingPhsics();
        this.stateMachine.updateState(deltaTime);
    }

    checkFacingLeft(){
        if (this.walkspeed > 0){
            this.facingLeft = false;
        } else if(this.walkspeed < 0) {
            this.facingLeft = true;
        }
    }

    applyFlyingPhsics(){
        if(this.isFlying){
            this.grav = this.flyGrav;
        } else if (!this.isFlying){
            this.grav = this.originGrav;
        }
    }

    fly(){
        let flyAgain = this.randomNumber(3);
       if(this.pos[1] <= 0) {
        this.setTop = 0;
        this.vel[1] = 0.05
       } else if (this.pos[1] > 200 && flyAgain == 1){
        this.vel[1] = -0.375
        flyAgain = this.randomNumber(5);
       }
    }

    init(){
        this.acc = this.walkspeed
    }

    randomNumber(value){
        return Math.floor(Math.random() * value);
    }

    checkDistanceToPlayer(playerObj){
        let distanceX = (this.pos[0] - playerObj.pos[0]) * -1;
        let distanceY = (this.pos[1] - playerObj.pos[1]) * -1;
        let distance =[Math.hypot(distanceX, distanceY), distanceX, distanceY]; 
        return distance;
    }
    setTop(){
    }

    jump(){
        if (this.onGround){
                this.vel[1] = -0.4
            }
        }
        

    checkDistanceToOriginPos(){
        let distanceX = (this.pos[0] - this.originPos[0]) * -1;
        let distanceY = (this.pos[1] - this.originPos[1]) * -1;
        let distance = Math.hypot(distanceX, distanceY); 
        return distance;
    }

    despawn(){
        this.grav = 0;
        this.vel = [0, 0];
        this.acc = 0;
        this.pos = [ -200, 900]
        this.animationStatus = "idle";
    }

    spawn(){
        this.grav = this.originGrav;
        this.pos = [...this.originPos];
        this.walkspeed =  this.originWalkspeed
        this.stateMachine = new StateMachine(new Idle(), this);
    }

}