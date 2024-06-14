import {Rectangle} from "./rectangle-class.js";
import { Hitbox } from "./hitbox-class.js";

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
            this.demageBoxes = []
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
        this.level.objects.forEach(obj => {
            this.collide(obj).fromAbove();
            this.collide(obj).fromBottom();
            this.collide(obj).fromLeft();
            this.collide(obj).fromRight();
        })
        this.updateHitboxs();
    }



    collide(obj){
        return {
            fromAbove: () =>{
                if (this.getPrevPosBottom() <= obj.posTop && obj.type != "Entity" && this.collideWith(obj)){
                    this.setBottom(obj.posTop);
                    this.vel[1] = 0;
                    this.onGround = true;
                    if (obj.type == "Player"){
                        obj.jump.currentPressingKey = false;
                        obj.jump.alreadyInJump = false
                    }
                    return this.onGround;
            }
            },
            fromBottom: () =>{
                if (this.getPrevPosTop() >= obj.posBottom && obj.type != "Entity"){
                    let isCollide = false;
                    isCollide = this.collideWith(obj, [this.vel[0] * 3 * -2.5 ,0])
                    if(isCollide){
                        this.setTop(obj.posBottom);
                        this.vel[1] = 0;
                    }
            }
            },

            fromRight: () =>{
                if ( this.getPrevPosRight() <= obj.posLeft && obj.type != "Entity" && this.collideWith(obj)){
                    if (this.pushObject(obj, this.level.objects).toRight()) {
                        return
                    }
                    this.setRight(obj.posLeft - 1.5);
                    this.vel[0] = 0;
                    if(this.type == "Enemy"){
                        this.changeDirection();
                    }
            }
            },
            fromLeft: () =>{
                if ( this.getPrevPosLeft() >= obj.posRight && obj.type != "Entity" && this.collideWith(obj)){
                    if (this.pushObject(obj, this.level.objects).toLeft()){
                        return
                    }
                    this.setLeft(obj.posRight + 1.5);
                    this.vel[0] = 0;
                    if(this.type == "Enemy"){
                        this.changeDirection();
                    }
                }
            }
        }
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
            if (this.type == "Enemy"){
                this.changeDirection();
            }
        } else if (this.posRight >= this.level.size[0]){
            this.vel[0] = 0;
            this.setRight(this.level.size[0]);
            if (this.type == "Enemy"){
                this.changeDirection();
            }
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

    changeDirection(){
        //
    }

    createHitBox(pos, size, manualOffset, options, obj){
        let newBox = new Hitbox({
          pos: [pos[0], pos[1]],
          size: [size[0], size[1]],
          offset: [manualOffset[0], manualOffset[1]],
          forceToLeft: options.forceToLeft || true,
          demage: options.demage || 10,
          demageFlag: options.demageFlag || "Player",
          isAktiv: options.isAktiv || false,
          lifespan: options.lifespan || 6,
          color: options.color || "rgba(255,125,0,0.55)",
          object : obj,
        })
        this.demageBoxes.push(newBox);
      }
    
      activateHitbox(HitboxNumber = 0){
        this.demageBoxes[HitboxNumber].isAktiv = true;
      }
    
      disableHitbox(HitboxNumber = 0, disableAll = false){
       switch(disableAll){
        case true: this.demageBoxes.forEach((box) => { box.isAktiv = false;}); break;
        case false: this.demageBoxes[HitboxNumber].isAktiv = false; break;
       }
      }
    
      updateHitboxs(){
        if (this.updateHitboxs){
          this.demageBoxes.forEach((box) => {
            box.pos[0] = this.pos[0] + box.setOffset[0];
            box.pos[1] = this.pos[1] + box.setOffset[1];
            if(box.isAktiv){
              box.draw();
            }
          });
        }
      }
}