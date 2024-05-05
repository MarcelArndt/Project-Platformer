import  {Rectangle} from "./rectangle.js";
import  {levelSize} from "../level.js";

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

    canBeMoved(objects, VectorOffest){
        let fildertObjects = []

        if( this.posLeft + VectorOffest[0] < 0 || 
            this.posRight + VectorOffest[0] > levelSize[0] || 
            this.posTop + VectorOffest[1] < 0 || 
            this.PosBottom + VectorOffest[1] > levelSize[1])
            {
                return false;
            }
    
        for (let i = 0; i < objects.length; i++){
            if(objects[i].type !== "Player"){
            fildertObjects.push(objects[i]);
            }
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

    update(deltaTime, levelObj){
        this.prevPos = [...this.pos];
        this.applyPhsics(deltaTime);
        this.boundToLevel();
        levelObj.forEach(obj => {
            this.collide(obj, levelObj).fromAbove();
            this.collide(obj, levelObj).fromBottom();
            this.collide(obj, levelObj).fromLeft();
            this.collide(obj, levelObj).fromRight();
        })
        this.updatePlayer();
    }

    updatePlayer(){
        // find in PlayerClass
    }

    collide(obj, objects){
        return {
            fromAbove: () =>{
                if ( this.getPrevPosBottom() <= obj.posTop && this.collideWith(obj)){
                    this.setBottom(obj.posTop);
                    this.vel[1] = 0;
                    this.onGround = true;
            }
            },
            fromBottom: () =>{
                if ( this.getPrevPosTop() >= obj.posBottom && this.collideWith(obj)){
                    this.setTop(obj.posBottom);
                    this.vel[1] = 0;
            }
            },
            fromRight: () =>{
                if ( this.getPrevPosRight() <= obj.posLeft && this.collideWith(obj)){
                    if (this.pushObject(obj, objects).toRight()) {
                        return
                    }
                    this.setRight(obj.posLeft);
                    this.vel[0] = 0;
            }
            },
            fromLeft: () =>{
                if ( this.getPrevPosLeft() >= obj.posRight && this.collideWith(obj)){
                    if (this.pushObject(obj, objects).toLeft()){
                        return
                    }
                    this.setLeft(obj.posRight);
                    this.vel[0] = 0;
                }
            }
        }
    }

    /**
     *   pushObject() is only accessible with Objects/Classes which can push (Only "Player" can push something).
     */
    pushObject(){
        return{
            toRight:() => false,
            toLeft: () => false
        }
    }
 
    boundToLevel(){
        if (this.posBottom >= levelSize[1]){
            this.vel[1] = 0;
            this.setBottom(levelSize[1]);
            this.onGround = true;
        }
        
        if (this.posLeft <= 0){
            this.setLeft(0);
            this.vel[0] = 0;
        } else if (this.posRight >= levelSize[0]){
            this.vel[0] = 0;
            this.setRight(levelSize[0]);
        }
    }

    getRemainingDistanceRight(objects){
        let distance = levelSize[0] - this.posRight;
        let filterdArray = [];
        for (let i = 0; i < objects.length; i++){
            if(objects[i].type !== "Player"){
                filterdArray.push(objects[i]);
            }
        }
        filterdArray.forEach(obj => {
            if (this.posRight <= obj.posLeft && 
                this.posBottom > obj.posTop &&
                this.posTop < obj.posBottom){
                    distance =  Math.min(distance, obj.posLeft - this.posRight);
                }
        })
        return distance 
    }

    getRemainingDistanceLeft(objects){
        let distance = this.posLeft;
        let filterdArray = [];
        for (let i = 0; i < objects.length; i++){
            if(objects[i].type !== "Player"){
                filterdArray.push(objects[i]);
            }
        }
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