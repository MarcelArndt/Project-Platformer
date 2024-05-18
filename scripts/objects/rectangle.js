import {ctx} from "../canvas.js";


export class Rectangle {
    constructor(option, type){
    this.level = null;
    this.pos = option.pos;
    this.size = option.size;
    this.color = option.color; 
    this.type = type || 'Rectangle';
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
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos[0] - this.level.cameraPos[0], this.pos[1] - this.level.cameraPos[1], this.size[0], this.size[1]);
        this.characterDraw();
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

    update(){
        // in Main
    }

    characterDraw(){
        //
    }
}