import {Rectangle} from "./rectangle-class.js";
import { Hitbox } from "./hitbox-class.js";
import { Jump, GetHit  } from "./stateMashine-player-class.js";
import { soundIsloadet } from "../assets.js";
import { Collider } from "./collider-class.js";

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
    }
    
    genEntityIndex(){
        let newIndex = "";
        let subIndex = "";
        for (let i = 0; i < 24;i++){
            subIndex = Math.floor(Math.random()* 9).toString();
            newIndex += subIndex;
        }
        return newIndex;
    }

    checkCollideWithObjects(){
        return false;
    }

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

    getPrevPosLeft(){
        return this.prevPos[0];
    }

    getPrevPosRight(){
        return this.prevPos[0] + this.size[0];
    }

    getPrevPosTop(){
        return this.prevPos[1];
    }

    getPrevPosBottom(){
        return this.prevPos[1] + this.size[1];
    }

    applyPhsics(deltaTime){
        this.vel[0] += this.acc * deltaTime;
        this.vel[0] *= 1 - this.fraction;
        this.pos[0] += this.vel[0] * deltaTime;

        this.vel[1] += this.grav * deltaTime;
        this.pos[1] += this.vel[1] * deltaTime;
        
        this.onGround = false
    }

    update(deltaTime){
        this.prevPos = [...this.pos];
        this.applyPhsics(deltaTime);
        this.boundToLevel();
        this.collider.update(deltaTime)
        this.updateHitboxs(deltaTime);
    }


    checkCollideWithSemiSolidBlock(obj, direction){
        return (obj.subType == "SemiSolidBlock" && this.crouch && direction == "above" || obj.subType == "SemiSolidBlock" && direction != "above" );
    }


    checkCollideWithMushroom(obj, direction){
        if(obj.subType == "Mushroom" && this.type == "Player" && direction == "above"){
            this.stateMachine.changeState(new Jump());
            this.chooseRandomSound([soundIsloadet.bounce02]), false;
            this.vel[1] = -1.5;
            return true;
        }
        return false;
    }


    checkCollideWithEnemy(obj){
        if(obj.type == "Enemy" && obj.subType != "Mushroom" && this.type == "Player" && !this.gethit){
            this.getHitLeft = -this.facingLeft;
            this.gethit = true;
            this.reduceHealth(10)
            this.stateMachine.changeState(new GetHit());
            return true;
        }
        return false;
    }


    checkCollideWithDeadlySolidBlock(obj, direction){
        if(obj.subType == "deadlySolidBlock" && this.type == "Player" && direction == "above" || obj.subType == "deadlySolidBlock" && this.type == "Enemy" && direction == "above"){
            this.health = 0;
            return true;
        }
        return false
    }


    checkCollideWithDeath(obj){
        if(obj.type == "Death"){
            return  true;
        }
        return false
    }


    checkIsEntity(obj){
        if(obj.type == "Entity" && obj.subType == "Bird"){
            return  true;
        } else if(obj.type == "Entity" && obj.subType == "Item"){
            obj.activateItem();
            return  true;
        }
        return false
    }

    
    checkAll(obj, direction){
        return (
            !this.checkCollideWithSemiSolidBlock(obj, direction)
            && !this.checkCollideWithEnemy(obj) 
            && !this.checkCollideWithMushroom(obj, direction)
            && !this.checkCollideWithDeadlySolidBlock(obj, direction)
            && !this.checkCollideWithDeath(obj)
            && !this.checkIsEntity(obj)
        );
    }

    pushObject(){
        return{
            toRight:() => false,
            toLeft: () => false
        }
    }
 
    boundToLevel(){
        if (this.posBottom >= this.level.size[1]){
            this.vel[1] = 0;
            this.setBottom(this.level.size[1]);
            this.onGround = true;
        }
        
        if (this.posLeft <= 0){
            this.setLeft(0);
            this.vel[0] = 0;
        } else if (this.posRight >= this.level.size[0]){
            this.vel[0] = 0;
            this.setRight(this.level.size[0]);
        }
    }

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

    createHitBox(pos, size, manualOffset, options, obj){
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
          object : obj,
        })
        this.demageBoxes.push(newBox);
      }
    
      activateHitbox(ObjId, id = 0){
        this.level.demageBoxes[ObjId][id].isAktiv = true;
      }
    
      disableHitbox(ObjId, id = 0, disableAll = false){
       switch(disableAll){
        case true: this.level.demageBoxes[ObjId].forEach((box) => { box.isAktiv = false;}); break;
        case false: this.level.demageBoxes[ObjId][id].isAktiv = false; break;
       }
      }
    
      updateHitboxs(deltaTime){
        if (this.demageBoxes.length > 0){
          this.level.demageBoxes[this.index].forEach((box) => {
           box.update(deltaTime)
           if(box.isAktiv || box.isAlwaysAktiv){
            box.draw();
          }
          });
        }
      }

      screenShakeEnable(frameValue = 10){
        this.level.screenAnimationTime = 0;
        this.level.screenAnimationMaxTimer = frameValue
        this.level.screenshakeToggle = true;
        this.screenshakeAnimationRunning = true;
    }

    chooseRandomSound(soundArray = [], toInterrupt = true){
        let randomNumber = Math.floor(Math.random() * soundArray.length);
        if(!soundArray[randomNumber].paused && toInterrupt){
            soundArray[randomNumber].pause();
            soundArray[randomNumber].currentTime = 0;
        } else if(this.checkThisOnScreen()){
            soundArray[randomNumber].volume = 1 * this.level.globalVolume;
            soundArray[randomNumber].play();
        }
      }

    stopPlayingSound(soundArray){
        soundArray.forEach((sound => {
            if(!soundIsloadet[sound].paused){
                soundIsloadet[sound].pause();
                soundIsloadet[sound].currentTime = 0;
            }
        }));
    }

    checkThisOnScreen(){
        return (this.pos[0] > this.level.cameraPos[0] - (canvas.width / 10) && this.pos[0] < this.level.cameraPos[0] + canvas.width);
    }
}