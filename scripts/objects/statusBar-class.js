import { ctx } from "../canvas.js";

export class StatusBar{
    constructor(maxValue, currentValue, posOnCanvas, fullBarImage, emptyBarImage, offset, minDistanceToRender){
        this.maxValue = maxValue;
        this.currentValue = currentValue;
        this.posOnCanvas = posOnCanvas;
        this.fullBarImage = fullBarImage;
        this.emptyBarImage = emptyBarImage;
        this.imageWidth = this.fullBarImage.width;
        this.imageHeight = this.fullBarImage.height;
        this.currentWidthPercentage = 0;
        this.minDistanceToRender = minDistanceToRender || false;
        this.distanceValue = 0;
        this.offset = offset || [0,0];

    }

    update(currentValue, distance = false){
        this.refreshValue(currentValue, distance);
        this.calcCurrentValues();
    }

    drawBar(){
        if(this.distanceValue <= this.minDistanceToRender || !this.minDistanceToRender){
            ctx.drawImage(this.emptyBarImage, 0, 0, this.emptyBarImage.width, this.emptyBarImage.height, this.posOnCanvas[0], this.posOnCanvas[1], this.emptyBarImage.width * 0.8, this.emptyBarImage.height * 0.8)
            ctx.drawImage(this.fullBarImage, 0, 0, this.imageWidth * this.currentWidthPercentage, this.imageHeight, this.posOnCanvas[0] + this.offset[0], this.posOnCanvas[1] + this.offset[1], (this.imageWidth * 0.8) * this.currentWidthPercentage, (this.imageHeight * 0.8))
        }
    }

    refreshValue(currentValue, distance){
        this.currentValue = currentValue;
        this.distanceValue = distance
        console.log(this.currentValue)
    }

    calcCurrentValues(){
        this.currentWidthPercentage = this.currentValue / this.maxValue;
    }
}