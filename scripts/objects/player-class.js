import { Box} from "./box-class.js";



export class Player extends Box {
    constructor(options, type){
        super({
            pos: options.pos,
            size: options.size,
            color: options.color || "blue",
            grav: 0.005,
            friction: 0.2,
            playerHealth: options.playerHealth || 3
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
        this.status = "idle";
        this.prevStatus = "";
        this.prevKeyInput = ""
        this.playerHealth = options.playerHealth || 3;
        this.cooldown = {dash: false,
                         dashCooldown : "",
                         mainAttack: false,
                         mainCooldown: "",
                         mainKeyIsPressed: false,
                         mainCooldownValue: 1050, 
                         mainCurrentFiringSetTimer: "", 
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
                case "f": this.playerAttack(); this.cooldown.mainKeyIsPressed = true; break;
                case "ArrowRight": case "d":this.moving("ArrowRight", event); break;
                case "ArrowLeft":  case "a":this.moving("ArrowLeft", event);  break ; 
                case " ": case "w": this.playerJump(); this.prevKeyInput = "jump"; break;
                case "s": case "ArrowDown": if (this.crouch == false){this.setBottom(this.posBottom + this.size[1]/2); this.crouch = true; this.size[1] = this.size[1] / 2; this.acc = 0} break;
            }
        });

        document.addEventListener("keyup", (event) => { 
            switch (event.key) {   
                case "ArrowRight": case "d": case "ArrowLeft": case "a": this.reducemoving(); break;
                case "s": case "ArrowDown": if(this.crouch == true){this.crouch = false; this.size[1] = this.size[1] * 2}; this.setTop(this.posTop - this.size[1]/2); break;
                case " ": case "w" : this.stopHoldingJump(); break;
                case "f": this.cooldown.mainKeyIsPressed = false;  break;
            }
        });

    }

    reducemoving(){
            this.acc = 0;
    }


    moving(pressedKey, event){
        if (event.key == "f") {
            this.acc == 0;
            return;
        }
        if(this.crouch == false && this.status != "attack"){
            this.prevKeyInput = pressedKey
            if (pressedKey == "ArrowRight"){
                this.acc = this.walkspeed; 
                this.facingLeft = true; 
            } else if(pressedKey == "ArrowLeft"){
                this.acc = -this.walkspeed; 
                this.facingLeft = false; 
            }
        }
    }

    stopHoldingJump(){
        this.jump.currentPressingKey = false; 
        this.jump. latestKeyUp = new Date();
    }

    playerJump(){
        if(this.onGround && !this.crouch || this.isCoyoteTimeReady && !this.crouch){
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

    updatePlayerExtras(deltaTime){
        this.checkCoyoteTime();
        this.checkStatus();
        this.ceckCooldown();
    }

    playerAttack(){
        if (!this.cooldown.mainAttack && this.status != "jump" && this.status != "crouch"){
            this.vel[0] = 0;
            this.acc = 0;
            this.cooldown.mainAttack = true
            this.createHitbox();
            this.cooldown.mainCooldown = new Date();
        }
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
        this.prevStatus = this.status
        if (this.playerHealth <= 0){
            this.status = "death";
            this.animationStatus = "death";
        } else if(this.playerHealth > 0 && this.crouch){
            this.status = "crouch";
            this.animationStatus = "crouch";
        } else if (this.playerHealth > 0 && this.vel[1] > 0){
            this.status = "fall";
            this.animationStatus = "fall";
        }  else if (this.playerHealth > 0 && this.vel[1] < 0){
            this.status = "jump";
            this.animationStatus = "jump";
        } else if (this.playerHealth > 0 && this.vel[1] == 0 && this.acc> 0  && !this.cooldown.mainAttack && !this.cooldown.mainKeyIsPressed){
            this.status = "walking";
            this.animationStatus = "walking";
        } else if (this.playerHealth > 0 && this.vel[1] == 0 && this.acc < -0 && !this.cooldown.mainAttack && !this.cooldown.mainKeyIsPressed){
            this.status = "walking";
            this.animationStatus = "walking";
        } else if (this.playerHealth > 0 && this.vel[1] == 0 && this.cooldown.mainAttack){
            this.status = "attack";
            this.animationStatus = "attack";
        } else if (this.playerHealth > 0 && this.vel[1] == 0 && this.vel[0] < 3 && this.vel[0] > -3 && this.acc == 0 && !this.cooldown.mainAttack){
            this.status = "idle";
            this.animationStatus = "idle";
        }
    }

    checkCoyoteTime(){
        if (this.onGround && !this.isCoyoteTimeReady){
            this.isCoyoteTimeReady = true;
        } else if(!this.onGround && this.isCoyoteTimeReady){
          this.startCoyoteTime();
        }
        if(this.status != "Jump" && this.isCoyoteTimeReady && !this.onGround){
            this.grav = 0;
        } else {
            this.grav = 0.005;
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
            //
    }
}