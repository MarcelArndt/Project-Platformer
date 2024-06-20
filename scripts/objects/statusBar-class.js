import { ctx } from "../canvas.js";

export class StatusBar{
    constructor(maxValue, currentValue, posOnCanvas, fullBarImage, emptyBarImage,){
        this.maxValue = maxValue;
        this.currentValue = currentValue;
        this.posOnCanvas = posOnCanvas;
        this.fullBarImage = fullBarImage;
        this.emptyBarImage = emptyBarImage;
        this.imageWidth = this.fullBarImage.width;
        this.imageHeight = this.fullBarImage.height;
        this.currentWidthPercentage = 0;
    }

    update(currentValue){
        this.refreshValue(currentValue);
        this.calcCurrentValues();
        this.draw();  
    }

    draw(){
        ctx.drawImage(this.emptyBarImage, this.posOnCanvas[0], this.posOnCanvas[1])
        ctx.drawImage(this.fullBarImage, 0, 0, this.imageWidth * this.currentWidthPercentage, this.imageHeight, this.posOnCanvas[0], this.posOnCanvas[1], this.imageWidth * this.currentWidthPercentage, this.imageHeight)
    }

    refreshValue(currentValue){
        this.currentValue = currentValue;
    }

    calcCurrentValues(){
        this.currentWidthPercentage = this.currentValue / this.maxValue;
    }
}