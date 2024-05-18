import { Box} from "./box-class.js";
import { Hitbox } from "./hitbox-class.js";


export class Player extends Box {
    constructor(options, type){
        super({
            pos: options.pos,
            size: options.size,
            color: options.color || "blue",
            grav: 0.005,
            friction: 0.2
        },
            type || "Player"
        );
        this.facingLeft = true;
        this.crouch = false;
        this.jumpseed = -1.1;
        this.walkspeed = 0.005;
        this.coyoteTime = 75;
        this.isCoyoteTimeReady = true;
        this.latestOnGround = 0;
        this.currentCoyoteTime = null;
        this.status = "";
        this.cooldown = {dash: false,
                         dashCooldown : "",
                         mainAttack: false,
                         mainCooldown: "",
                         mainCooldownValue: 350,
        };
        this.jump = {
                        alreadyInJump: false,
                        currentPressingKey: false,
                        jumpseed: -1.025,
                        latestJump: "",
                        latestKeyUp: "",
                        maxWalljump: 2,
                        isOnWall: false,
        }
        this.addControll();
    }

    addControll(){ 
        document.addEventListener("keydown", (event) => {     
            switch (event.key) {     
                case "ArrowRight": case "d": if(this.crouch == false){this.acc = this.walkspeed; this.facingLeft = true;};  break;
                case "ArrowLeft":  case "a": if(this.crouch == false){this.acc = -this.walkspeed;this.facingLeft = false;};  break ; 
                case " ": case "w": this.playerJump(); break;

               
                case "f": this.playerAttack(); break;s
                case "r": console.log("do a roll"); break;
                case "s": case "ArrowDown": if (this.crouch == false){this.setBottom(this.posBottom + this.size[1]/2); this.crouch = true; this.size[1] = this.size[1] / 2; this.acc = 0} break;
            }
        });

        document.addEventListener("keypress", (event) => {
            switch (event.key) { 

            }
        });

        document.addEventListener("keyup", (event) => { 
            switch (event.key) {   
                
                case "ArrowRight": case "d": case "ArrowLeft": case "a": this.acc = 0; break;
                case "s": case "ArrowDown": if(this.crouch == true){this.crouch = false; this.size[1] = this.size[1] * 2}; this.setTop(this.posTop - this.size[1]/2); break;
                case " ": case "w" : this.stopHoldingJump();
            }
        });

    }

    stopHoldingJump(){
        this.jump.currentPressingKey = false; 
        this.jump. latestKeyUp = new Date();
    }

    playerJump(){
        if(this.onGround && !this.crouch || this.isCoyoteTimeReady && !this.crouch || this.jump.isOnWall && !this.crouch){
            this.vel[1] += this.jumpseed;
            this.onGround = false;
            this.jump.alreadyInJump = false;
            this.isCoyoteTimeReady = false;
            clearTimeout(this.currentCoyoteTime);
        }
    }
 
    checkKeyPressedTime(keyIsPressedTime){
        if(keyIsPressedTime - 1000 >= this.jump.latestJump ){
            return false
        }
        return true
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

    updatePlayerExtras(){
        this.checkCoyoteTime();
        this.checkStatus();
        this.ceckCooldown();
    }

    ceckCooldown(){
        let currentTime = new Date();
        this.checkMainAttackCooldown(currentTime);
    }

    checkMainAttackCooldown(currentTime){
        if(currentTime - this.cooldown.mainCooldownValue > this.cooldown.mainCooldown){
            this.cooldown.mainAttack = false;
        }
    }

    checkStatus(){
        //
    }

    checkCoyoteTime(){
        if (this.onGround && !this.isCoyoteTimeReady){
            this.isCoyoteTimeReady = true;
        } else if(!this.onGround && this.isCoyoteTimeReady){
          this.startCoyoteTime();
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

    playerAttack(){
        if (!this.cooldown.mainAttack){
            this.cooldown.mainAttack = true
            this.createHitbox();
            this.cooldown.mainCooldown = new Date();
        }
    }

    checkfacingForPos(){
        let vector = "";
        if (this.facingLeft) {
            vector = this.posLeft 
        } else {
            vector = this.posRight - 80;
        }
        return vector;
    }

    createHitbox(){
        let newPos = [this.checkfacingForPos(), this.posBottom - 41]
        let level = this.level;
        let newObject = {
            level: level,
            pos: newPos,
            size: [80, 40],
            color: "#FF3A3A",
            lifespan : 75,
            demage : 10,
            forceToLeft: this.facingLeft
        }
        if (this.onGround){
            this.vel[0] = 0;
        }
        this.level.objects.push(
            new Hitbox (newObject)
        );
    }
}