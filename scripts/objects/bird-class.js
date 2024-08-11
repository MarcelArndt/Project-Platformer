import { Box} from "./box-class.js";
import { StateMachine, Idle } from "./stateMashine-bird-class.js";
import { imageIsloadet, soundIsloadet } from "../assets.js";
import { Collider } from "./collider-class.js";


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
            ghosting: [[{x:4, y:1}], false],
            idle: [[{x:0, y:4}], false],
            jump: [[{x:0, y:4}, {x:0, y:4}, {x:1, y:4}, {x:1, y:4},{x:2, y:4}, {x:2, y:4}], true],
            flying: [[{x:0, y:0}, {x:0, y:0}, {x:1, y:0}, {x:1, y:0},{x:2, y:0}, {x:2, y:0}], true],
        }
        this.scaling = 0.55;
        this.frameWidth = 32;
        this.frameHight = 32;
        this.frameHightOffset = 8;
        this.frameWidthOffset = 4;
        this.imageArray = [imageIsloadet.whiteBird, imageIsloadet.bluejayBird, imageIsloadet.robinBird]
        this.soundArray = [soundIsloadet.flyingOne, soundIsloadet.flyingTwo, soundIsloadet.flyingThree];
        this.soundFrameTimer = 0;
        this.SoundDelay = 35;
        this.toggleSound = false;
        this.collider = new Collider(this);
        this.animationImage = new Image();
        this.animationImage = this.imageArray[this.randomNumber(3)];
        this.animationTimer = 0;
       
    }

    /**
     * switch the current animation to the right direction and move the bird.
     */
    moving(){
        this.checkFacingLeft();
        this.vel[0] =  this.walkspeed * 300;
    }

    /**
     * stop bird from moving
     */
    stopMoving(){
        this.acc = 0;
    }

    /**
     * checks the distance to player and decides in which way the bird is flying away
     */
    flee(){
        let randomValue = Math.floor(Math.random() * 3);
        if (randomValue == 0){
            randomValue = 1;
        }
        let distance = this.checkDistanceToPlayer(this.level.objectsOfType.Player[0]);
        if(distance[1] >= 0 && distance[2] < 35){
            this.walkspeed = -0.0035 * randomValue;
        } else if(distance[1] < 0 && distance[2] < 35){
            this.walkspeed = 0.0035 * randomValue;
        }
        this.acc = this.walkspeed;
        this.enableSound();
    }
    
    enableSound(){
        if(!this.toggleSound){
            this.toggleSound = true;
        }
    }

    disableSound(){
        if(this.toggleSound){
            this.toggleSound = false;
        }
    }

    playFlappingSound(deltaTime){
        let distance = 0;
        const secDeltaTime = deltaTime / 10;
        const randomValue = Math.floor(Math.random() * 3);
        let sound = null;
        if(this.toggleSound){
            this.soundFrameTimer += secDeltaTime;
            if(Math.floor(this.soundFrameTimer) >= this.SoundDelay){
                distance = this.checkDistanceToPlayer(this.level.objectsOfType.Player[0]);
                sound = this.soundArray[randomValue];;
                sound.volume = 0.7 * this.level.globalVolume;
                sound.play();
                this.soundFrameTimer = 0;
                this.disableSound();
            }
        }
    }

    update(deltaTime){
        this.prevPos = [...this.pos];
        this.applyPhsics(deltaTime);
        this.boundToLevel();
        this.collider.update(deltaTime)
        this.updateFrameAnimation(deltaTime);
        this.applyFlyingPhsics();
        this.stateMachine.updateState(deltaTime);
        this.playFlappingSound(deltaTime)
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
       if(this.pos[1] <= 150) {
        this.despawn()
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
        this.pos = [-1000, 0]
        this.animationStatus = "ghosting";
    }

    spawn(){
        this.grav = this.originGrav;
        this.pos = [...this.originPos];
        this.walkspeed =  this.originWalkspeed
        this.stateMachine = new StateMachine(new Idle(), this);
    }

}