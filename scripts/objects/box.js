import {Rectangle} from "./rectangle.js";

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
        this.type = type || "Box"
    }

    checkCollideWithObjects(){
        return false;
    }

    canBeMoved(VectorOffest){
        let fildertObjects = [...this.level.obectsOfType.Rectangle, ...this.level.obectsOfType.Box];

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
    }



    collide(obj){
        return {
            fromAbove: () =>{
                if (this.getPrevPosBottom() <= obj.posTop && obj.type != "Entity" && this.collideWith(obj)){
                    this.setBottom(obj.posTop);
                    this.vel[1] = 0;
                    this.onGround = true;
                    return this.onGround;
            }
            },
            fromBottom: () =>{
                if (this.getPrevPosTop() >= obj.posBottom && obj.type != "Entity" && this.collideWith(obj)){
                    this.setTop(obj.posBottom);
                    this.vel[1] = 0;
            }
            },
            fromRight: () =>{
                if ( this.getPrevPosRight() <= obj.posLeft && obj.type != "Entity" && this.collideWith(obj)){
                    if (this.pushObject(obj, this.level.objects).toRight()) {
                        return
                    }
                    this.setRight(obj.posLeft);
                    this.vel[0] = 0;
            }
            },
            fromLeft: () =>{
                if ( this.getPrevPosLeft() >= obj.posRight && obj.type != "Entity" && this.collideWith(obj)){
                    if (this.pushObject(obj, this.level.objects).toLeft()){
                        return
                    }
                    this.setLeft(obj.posRight);
                    this.vel[0] = 0;

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
        } else if (this.posRight >= this.level.size[0]){
            this.vel[0] = 0;
            this.setRight(this.level.size[0]);
        }
    }

    getRemainingDistanceRight(){
        let distance = this.level.size[0] - this.posRight;
        let filterdArray = [...this.level.obectsOfType.Rectangle, ...this.level.obectsOfType.Box];
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
        let filterdArray = [...this.level.obectsOfType.Rectangle, ...this.level.obectsOfType.Box];
        filterdArray.forEach(obj => {
            if (this.posLeft >= obj.posRight && 
                this.posBottom > obj.posTop &&
                this.posTop < obj.posBottom){
                    distance =  Math.min(distance, this.posLeft - obj.posRight);
                }
        })
        return distance 
    }
}