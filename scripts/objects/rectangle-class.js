import { ctx } from "../canvas.js";
import { Collider } from "./collider-class.js";

export class Rectangle {
    constructor(option, type){
    this.level = null;
    this.pos = option.pos;
    this.size = option.size;
    this.color = option.color; 
    this.type = type || 'Rectangle';
    this.originalPos = this.pos;
    this.animationImage = new Image();
    this.animationImage.src =  "";
    this.crouch = false;
    this.facingLeft = false;
    this.status = "";
    this.animationStatus = "idle";
    this.drawCurrentAnimation = true;
    this.animationflickeringTimer = 0;
    this.frame = {x:0, y:0};
    this.animationFrames = {};
    this.animationTimer = 0;
    this.animationSpeed = 1;
    this.frameWidth = 16;
    this.frameHight = 16;
    this.frameWidthOffset = 0;
    this.frameHightOffset = 0;
    this.animationIsRunning = false;
    this.scaling = 1;
    this.collider = new Collider(this);
    this.isOnScreen = false;
    this.drawingOffset = 75;
    }

    /**
     * get the position of this border
     */
    get posLeft(){
        return this.pos[0];
    }

     /**
     * get the position of this border
     */
    get posRight(){
        return this.pos[0] + this.size[0];
    }

    /**
     * get the position of this border
     */
    get posTop(){
        return this.pos[1];
    }

    /**
     * get the position of this border
     */
    get posBottom(){
        return this.pos[1] + this.size[1];
    }

    /**
     * get the horizontal position of this object.
     */
    get posX(){
        return (this.posLeft + this.posRight) / 2
    }

    /**
     * get the vertical position of this object.
     */
    get posY(){
        return (this.posTop + this.posBottom) / 2
    }

    /**
    * @param {number} val -> Value to set this object'a new position depending at this border
    */
    setLeft(val){
        this.pos[0] = val;
    }

    /**
    * @param {number} val -> Value to set this object'a new position depending at this border
    */
    setRight(val){
        this.pos[0] = val - this.size[0] ;
    }

    /**
    * @param {number} val -> Value to set this object'a new position depending at this border
    */
    setTop(val){
        this.pos[1] = val;
    }

    /**
    * @param {number} val -> Value to set this object'a new position depending at this border
    */
    setBottom(val){
        this.pos[1] = val - this.size[1] ;
    }

     /**
     * if you need to know the position of this object before update the current position
     */
    getPrevPosLeft(){
        return this.prevPos[0];
    }

     /**
     * if you need to know the position of this object before update the current position
     */
    getPrevPosRight(){
        return this.prevPos[0] + this.size[0];
    }

     /**
     * if you need to know the position of this object before update the current position
     */
    getPrevPosTop(){
        return this.prevPos[1];
    }

     /**
     * if you need to know the position of this object before update the current position
     */
    getPrevPosBottom(){
        return this.prevPos[1] + this.size[1];
    }

     /**
     * checks is object is not out od screen and will render/draw this object
     */
    draw(){
        if (this.pos[0] > this.level.cameraPos[0] - this.drawingOffset && this.pos[0]  < this.level.cameraPos[0] + canvas.width
            && this.pos[1] > this.level.cameraPos[1] -  this.drawingOffset  && this.pos[1] < this.level.cameraPos[1] + canvas.height
        ){
            this.isOnScreen = true;
            if(Object.keys(this.animationFrames).length > 0){
                this.drawAnimation();
            }  else {
                ctx.fillStyle = this.color;  
                ctx.fillRect(this.pos[0] - this.level.cameraPos[0], this.pos[1] - this.level.cameraPos[1], this.size[0], this.size[1]);
            }
        } else {
            this.isOnScreen = false;
        }
    }

    /**
     * Main function to check a collision 
     * @param {Object} objectRectangle - a Entity of the current level to check collision 
     * @param {Array} VectorOffset - to check collsion with an offset
     * @returns true or false if this Entity is colliding with something
     */
    collideWith(objectRectangle, VectorOffset = [0,0]){
        if (this == objectRectangle) return false;
        return (
            this.posLeft + VectorOffset[0] < objectRectangle.posRight &&
            this.posRight + VectorOffset[0] > objectRectangle.posLeft &&
            this.posBottom + VectorOffset[1] > objectRectangle.posTop &&
            this.posTop + VectorOffset[1] < objectRectangle.posBottom
        );
    }

     /**
     * this.animationTimer will goes up if it lower than the current animation lenght.
     * is isAnimationLooping false the animation will stop at the latest image. Otherwise it the timer gets a reset
     * @param {number/TimeValue} deltaTime -> used to calculate the frame of an animation.
     */
    updateAnimationTimer(deltaTime = this.level.timer.deltaTime){
        let secDeltaTime = deltaTime / 100 * this.animationSpeed;
        let isAnimationLooping = this.animationFrames[this.animationStatus][1];
        if(this.animationTimer >= (this.animationFrames[this.animationStatus][0].length -1) && !isAnimationLooping){
            this.animationTimer = this.animationFrames[this.animationStatus][0].length -1;
            this.animationIsRunning = false;
        } else if (this.animationTimer >= (this.animationFrames[this.animationStatus][0].length -1) && isAnimationLooping){
            this.animationTimer = 0;
            this.animationIsRunning = true;
        } else if (this.animationTimer < (this.animationFrames[this.animationStatus][0].length -1)){
            this.animationTimer += secDeltaTime;
            this.animationIsRunning = true;
        }
    }

     /**
     * by calculating the current frame from updateAnimationTimer() it will decides which frame of the current animation is playing/drawing.
     * @param {number/TimeValue} deltaTime -> used to calculate the frame of an animation.
     * @param {number} speed-> used to make a animation faster
     */
    updateFrameAnimation(deltaTime, speed = 1){
            let FrameIndex = 0;
            this.updateAnimationTimer(deltaTime, speed)
            FrameIndex = Math.floor(this.animationTimer);
            this.frame = this.animationFrames[this.animationStatus][0][FrameIndex];
    }

     /**
     * draw the frame form which gets calculated by updateFrameAnimation();
     */
    drawAnimation(){
        let posX = this.pos[0] - this.level.cameraPos[0] - this.size[0]  * this.scaling - this.frameWidthOffset;
        let posY = this.pos[1] - this.level.cameraPos[1] - (this.size[1] * this.scaling - this.frameHightOffset);
        ctx.save();
        if (!this.facingLeft){ 
            ctx.translate(canvas.width, 0)
            ctx.scale(-1, 1);
            posX = canvas.width - (this.pos[0] - this.level.cameraPos[0]) - (this.size[0] * 2 * this.scaling) - this.frameWidthOffset;
        }
        if(this.crouch){
            posY -= this.frameHight * 1.5;
        }
        if(this.drawCurrentAnimation){
            ctx.drawImage(this.animationImage, this.frame.x * this.frameWidth, this.frame.y * this.frameHight, this.frameWidth, this.frameHight, posX, posY, this.frameWidth* 2 * this.scaling, this.frameHight * 2 * this.scaling) 
        }
        ctx.restore();
    }

    /**
     * Main Update-Loop for every upcoming child of this class
     */
    update(){
    }
}