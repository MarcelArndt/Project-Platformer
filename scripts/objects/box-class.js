import { Rectangle} from "./rectangle-class.js";
import { Hitbox } from "./hitbox-class.js";
import { soundIsloadet } from "../assets.js";
import { Collider } from "./collider-class.js";
import { JumpPad } from "./jumpPad.js";


export class Box extends Rectangle{
    constructor(options, type){
        const {pos, size, color, grav, friction, vel} = options
        super({pos, size, color}, type || "Box");
        this.grav = grav || 0.005;
        this.fraction = friction || 0;
        this.vel = vel || [0,0];
        this.acc = 0;
        this.onGround = false;
        this.prevPos = [...this.pos];
        this.type = type || "Box";
        this.enableUpdateBox = false;
        this.index = 0;
        this.demageBoxes = [];
        this.index = this.genEntityIndex(); 
        this.collider = new Collider(this);
        this.gethitJumpAlready = false;
        this.getHit = false;
        this.getHitAndLoseControllTimer = 0;
        this.maxGetHitAndLoseControllTimer = 0.5;
        this.invincibility = false;
        this.invincibilityTimer = 0;
        this.maxInvincibilityTimer = 1.15;
        this.allowToFickeringAnimation = true
        this.health = 100;
        this.maxHealth = 100;
        this.alreadyLostHealth = false;
        this.hitboxIsBoundToLevel = false;
        this.receiveHitCounter = 0;
        this.hitSound = soundIsloadet.hit09;
    }
    
    /**
     * generates a Index or Id for this Entity
     */ 
    genEntityIndex(){
        let newIndex = "";
        let subIndex = "";
        for (let i = 0; i < 24;i++){
            subIndex = Math.floor(Math.random()* 9).toString();
            newIndex += subIndex;
        }
        return newIndex;
    }

     /**
     * checks is Entity moveable in each direction
     * @param {Array} VectorOffest to add a offset to check in width and heigh
     */ 
    canBeMoved(VectorOffest){
        let fildertObjects = [...this.level.objectsOfType.Rectangle, ...this.level.objectsOfType.Box];
        if( this.posLeft + VectorOffest[0] < 0 || 
            this.posRight + VectorOffest[0] > this.level.size[0] || 
            this.posTop + VectorOffest[1] < 0 || 
            this.PosBottom + VectorOffest[1] > this.level.size[1])
            {
                return false;
            }
       
        return fildertObjects.every(obj => !this.collideWith(obj, VectorOffest));
    }

    /**
     * enable any Physic to this Entity
     */ 
    applyPhsics(deltaTime){
        this.vel[0] += this.acc * deltaTime;
        this.vel[0] *= 1 - this.fraction;
        this.pos[0] += this.vel[0] * deltaTime;

        this.vel[1] += this.grav * deltaTime;
        this.pos[1] += this.vel[1] * deltaTime;
        
        this.onGround = false
    }

     /**
     * Main Update loop for this Entity
     */ 
    update(deltaTime){
        this.prevPos = [...this.pos];
        this.applyPhsics(deltaTime);
        this.boundToLevel();
        this.collider.update(deltaTime);
        this.checkInvincibilityTimer(deltaTime / 1000);
    }

 
     /**
     * don't allow this entity to leave the level. 
     */ 
    boundToLevel(){
        if (this.posBottom >= this.level.size[1]){
            if(this.type == "Enemy"){
                this.health = 0;
            } else {
                this.vel[1] = 0;
                this.setBottom(this.level.size[1]);
                this.onGround = true;
            }
        }
        if (this.posLeft <= 0){
            this.setLeft(0);
            this.vel[0] = 0;
        } else if (this.posRight >= this.level.size[0]){
            this.vel[0] = 0;
            this.setRight(this.level.size[0]);
        }
    }

     /**
     * checks the distance between a Object in level and this entity to his right side
     */ 
    getRemainingDistanceRight(){
        let distance = this.level.size[0] - this.posRight;
        let filterdArray = [...this.level.objectsOfType.Rectangle, ...this.level.objectsOfType.Box];
        filterdArray.forEach(obj => {
            if (this.posRight <= obj.posLeft && 
                this.posBottom > obj.posTop &&
                this.posTop < obj.posBottom){
                    distance =  Math.min(distance, obj.posLeft - this.posRight);
                }
        })
        return distance 
    }

     /**
     * checks the distance between a Object in level and this entity to his left side
     */ 
    getRemainingDistanceLeft(){
        let distance = this.posLeft;
        let filterdArray = [...this.level.objectsOfType.Rectangle, ...this.level.objectsOfType.Box];
        filterdArray.forEach(obj => {
            if (this.posLeft >= obj.posRight && 
                this.posBottom > obj.posTop &&
                this.posTop < obj.posBottom){
                    distance =  Math.min(distance, this.posLeft - obj.posRight);
                }
        })
        return distance 
    }

     /**
     * @param {Array} pos set a start value of his position
     * @param {Array} size set a size in width and height
     * @param {Array} manualOffset set a offset for position in width and height
     * @param {object} options to set all params for this object
     */ 
    createHitBox(pos, size, manualOffset, options){
        let newBox = new Hitbox({
          pos: [pos[0], pos[1]],
          size: [size[0], size[1]],
          offset: [manualOffset[0], manualOffset[1]],
          forceToLeft: options.forceToLeft || false,
          demage: options.demage || 10,
          demageFlag: options.demageFlag || "Player",
          isAktiv: options.isAktiv || false,
          isAllawysAktiv: options.isAllawysAktiv || false,
          lifespan: options.lifespan || 6,
          color: options.color || "rgba(255,125,0,0.25)",
        }, this);
        this.demageBoxes.push(newBox);
      }

    /**
     * @param {Array} pos set a start value of his position
     * @param {Array} size set a size in width and height
     * @param {Array} manualOffset set a offset for position in width and height
     * @param {object} options to set all params for this object
     */ 
    createJumpPad(pos, size, manualOffset, options){
        let newBox = new JumpPad ({
          pos: [pos[0], pos[1]],
          size: [size[0], size[1]],
          offset: [manualOffset[0], manualOffset[1]],
          forceToLeft: options.forceToLeft || false,
          demage: options.demage || 10,
          demageFlag: options.demageFlag || null,
          isAktiv: options.isAktiv || true,
          isAllawysAktiv: options.isAllawysAktiv || true,
          lifespan: options.lifespan || 0,
          color: options.color || "rgba(0,200,200,0.25)",
        }, this);
        this.demageBoxes.push(newBox);
      }
    
    /**
     * @param {number} velX adjust and finetune the amount of pusback to left and right
     * @param {number} velY adjust and finetune the amount of pushback in hight
     */ 
    pushBack(velX = 0.85, velY = 0.75){
        let willCollide;
        let varifyArrayType = ["Entity", "Hitbox", "Enemy"]
        if (this.getHit && !this.gethitJumpAlready) {
            this.gethitJump(velY);
            this.onGround = false;
        }
        willCollide = this.level.objects.some(obj => 
            !this.getHitLeft && (this.collideWith(obj, [-15, -5]) && !varifyArrayType.includes(obj.type)  || this.getHitLeft && this.collideWith(obj, [15, -5]) && !varifyArrayType.includes(obj.type))
        );
        if (this.getHit && !willCollide && !this.onGround) {
            this.vel[0] = this.getHitLeft ? velX : -velX;
        }
        if (!this.getHit) {
            this.gethitJumpAlready = false;
        }
        if (this.onGround || willCollide) {
            this.vel[0] = 0;
        }
    }

     /**
     * jump in the air after getting hit/demage from something
     */
    gethitJump(velY){
        if (!this.gethitJumpAlready){
            this.vel[1] = -velY
            this.gethitJumpAlready = true;
        }
        if(this.onGround){
            this.vel[0] = 0
        }
      }

     /**
     * to switch a Hitbox to on. for Example enable/init a Attack
     */
    activateHitbox(ObjId, id = 0){
        this.level.objectsOfType.Hitbox.forEach(box => {
            if(box.index == this.demageBoxes[id].index ){
                box.isAktiv = true;
            }
        });
      }

     /**
     * to get the id of a hitbox
     */
    getAllHitboxIds(){
        let allHitboxIds = [];
        this.demageBoxes.forEach(box => {
            allHitboxIds.push(box.index)
        });
        return allHitboxIds;
      }

     /**
     * if enity gets hit or is dead it will disable onetime active hitbox
     */
    disableHitbox(ObjId, id = 0, disableAll = false){
        let validIds = [this.demageBoxes[id]]
        if(disableAll){
            validIds = this.getAllHitboxIds();
        }
        this.level.objectsOfType.Hitbox.forEach(box => {
            if(validIds.includes(box.index)){
                box.isAktiv = false;
            }
        });
      }

     /**
     * if enity gets hit or is dead it will disable all his hitbox
     */
    disableHitboxAndWithAllwaysOn(){
        this.level.objectsOfType.Hitbox.forEach((box) => {
            for (let i = 0; i < this.demageBoxes.length; i++){
                if(box.index == this.demageBoxes[i].index ){
                    box.isAktiv = false;
                    box.isAllawysAktiv = false;
                }
            } 
        });
        }

     /**
     * if enity is dead it will delete his hitbox from game
     */
    removeHitboxFromLevel(){
        this.level.objects.forEach((box, dex) => {
            if(box.type == "Hitbox" &&  this.demageBoxes[0].index == box.index){
                this.level.objects.splice(dex, this.demageBoxes.length);
            }
        });
    }

     /**
     * enable screenshake effect
     * @param {number} frameValue - to set a timer in frames
     */
    screenShakeEnable(frameValue = 10){
        this.level.screenAnimationTime = 0;
        this.level.screenAnimationMaxTimer = frameValue
        this.level.screenshakeToggle = true;
        this.screenshakeAnimationRunning = true;
    }

    /**
     * to play a random sound from an arraypool of sounds
     * @param {array} soundArray - pool of soundsObjects where can choose from.
     * @param {number} setVolume - to adjust the volume of a sound 
     */  
    chooseRandomSound(soundArray = [], setVolume = 1){
        let randomNumber = Math.floor(Math.random() * soundArray.length);
        if(this.checkThisOnScreen()){
            soundArray[randomNumber].volume = setVolume * this.level.globalVolume;
            soundArray[randomNumber].play();
        }
      }

     /**
     * return true or false and checks for is Entity on Screen/Camera
     */  
    checkThisOnScreen(){
        return (this.pos[0] > this.level.cameraPos[0] - (canvas.width / 10) && this.pos[0] < this.level.cameraPos[0] + canvas.width);
    }

    /**
     * enable or disable all onhit effects and invincibility.
     * @param {number/timeValue} secDeltaTime - to add it to the current Timer and compare it with the maxValue of this Timer
     */
    checkInvincibilityTimer(secDeltaTime){
        this.animationflickring(secDeltaTime);
        if(this.getHit || this.invincibility){
            this.getHitAndLoseControllTimer += secDeltaTime;
            this.invincibilityTimer += secDeltaTime;

            if(this.invincibilityTimer >= this.maxInvincibilityTimer){
                this.getHit = false;
                this.invincibility = false;
                this.alreadyLostHealth = false;
                this.receiveHitCounter = 0;
                this.getHitAndLoseControllTimer = 0;
                this.invincibilityTimer = 0;
            }
        }
    }

     /**
     * enable a animation to show thats this enity is invincibility.
     * @param {number/timeValue} secDeltaTime - to add it to the current Timer and compare it with the maxValue of this Timer
     */
    animationflickring(secDeltaTime){
        if(this.getHit && this.health > 0 && this.allowToFickeringAnimation || this.invincibility && this.health > 0 && this.allowToFickeringAnimation ){
            this.animationflickeringTimer += secDeltaTime;
        if(Math.floor(this.animationflickeringTimer * 1000)/ 1000 >= 0.05){
            this.animationflickeringTimer = 0;
            this.drawCurrentAnimation = false;
        } else{
            this.drawCurrentAnimation = true; 
        }
        } else {
            this.animationflickeringTimer = 0;
            this.drawCurrentAnimation = true;
        }
    }

     /**
     * @param {string} directionFrom - for pushback() to decide in which way this entiy gets pushed back
     * @param {number} demage - for reduceHealt() -> reduce the current Health by a Value
     */
    reciveHitFromObj(directionFrom, demage){
      if (!this.getHit && !this.alreadyLostHealth && !this.invincibility){
        this.getHit = true;
        this.invincibility = true;
        this.getHitLeft = directionFrom == "left" ? true : false;
        this.reduceHealth(demage);
      }
    }
    
    /**
     * @param {number} Value - reduce the current Health by a Value
     */
    reduceHealth(Value){
        if(!this.alreadyLostHealth){
            this.chooseRandomSound([this.hitSound]);
            this.alreadyLostHealth = true;
            this.health += -Value;
            if(this.statusbar != undefined){
                this.statusbar.refreshValue(this.health);
            }
        }  
    }
}