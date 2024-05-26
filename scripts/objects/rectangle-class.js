import {ctx} from "../canvas.js";

export class Rectangle {
    constructor(option, type){
    this.level = null;
    this.pos = option.pos;
    this.size = option.size;
    this.color = option.color; 
    this.type = type || 'Rectangle';
    this.originalPos = [... this.pos];

    this.animationImage = new Image();
    this.animationImage.src =  "";
    this.crouch = false;
    this.facingLeft = false;
    this.status = "";
    this.animationFrames = false;
    this.frame = {x:0, y:0};
    this.animationTimer = 0;
    this.frameWidth = 16;
    this.frameHight = 16;
    this.frameWidthOffset = 0;
    this.frameHightOffset = 0;
    }

    get posLeft(){
        return this.pos[0];
    }

    get posRight(){
        return this.pos[0] + this.size[0];
    }

    get posTop(){
        return this.pos[1];
    }

    get posBottom(){
        return this.pos[1] + this.size[1];
    }

    get posX(){
        return (this.posLeft + this.posRight) / 2
    }

    get posY(){
        return (this.posTop + this.posBottom) / 2
    }

    setLeft(val){
        this.pos[0] = val;
    }

    setRight(val){
        this.pos[0] = val - this.size[0] ;
    }

    setTop(val){
        this.pos[1] = val;
    }

    setBottom(val){
        this.pos[1] = val - this.size[1] ;
    }

    draw(){
        if(Object.keys(this.animationFrames).length > 0){
            this.drawAnimation();
        }  else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.pos[0] - this.level.cameraPos[0], this.pos[1] - this.level.cameraPos[1], this.size[0], this.size[1]);
        }
        
       
    }

    collideWith(objectRectangle, VectorOffest = [0,0]){
        if (this === objectRectangle) return false;
        return (
            this.posLeft + VectorOffest[0] < objectRectangle.posRight &&
            this.posRight + VectorOffest[0] > objectRectangle.posLeft &&
            this.posBottom + VectorOffest[1] > objectRectangle.posTop &&
            this.posTop + VectorOffest[1] < objectRectangle.posBottom
        );
    }

    updateAnimationTimer(deltaTime = this.level.timer.deltaTime, speed = 1){
        const secDeltaTime = deltaTime / 100 * speed;
        if (this.prevStatus != this.status && this.animationFrames[this.status][1] || this.animationTimer >= (this.animationFrames[this.status][0].length -1) && this.animationFrames[this.status][1]){
            this.animationTimer = 0;
        } else if(this.animationTimer >= (this.animationFrames[this.status][0].length -1) && !this.animationFrames[this.status][1]){
            this.animationTimer = this.animationFrames[this.status][0].length -1;
        }
        else{
            this.animationTimer += secDeltaTime;
        }
    }

    updateFrameAnimation(deltaTime, speed = 1){
            let FrameIndex = 0;
            this.updateAnimationTimer(deltaTime, speed)
            FrameIndex = Math.floor(this.animationTimer);
            this.frame = this.animationFrames[this.status][0][FrameIndex];
    }


    drawAnimation(){
        let posX = this.pos[0] - this.level.cameraPos[0] - this.size[0] - this.frameWidthOffset;
        let posY = this.pos[1] - this.level.cameraPos[1] - (this.size[1] - this.frameHightOffset);
        ctx.save();
        if (!this.facingLeft){
            ctx.translate(canvas.width, 0)
            ctx.scale(-1, 1);
            posX = canvas.width - (this.pos[0] - this.level.cameraPos[0]) - (this.size[0] *2) - this.frameWidthOffset;
        }
        if(this.crouch){
            posY -= this.frameHight * 1.5;
        }
        ctx.drawImage(this.animationImage, this.frame.x * this.frameWidth, this.frame.y * this.frameHight, this.frameWidth, this.frameHight, posX, posY, this.frameWidth* 2, this.frameHight * 2) 
        ctx.restore();
    }

    update(){
        // in Main
    }

    reset(){
       this.pos = [... this.originalPos];
    }
    
}