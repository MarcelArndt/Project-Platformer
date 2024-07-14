import { ctx } from "../canvas.js";

export class StatusBar{
    constructor(maxValue, currentValue, posOnCanvas, fullBarImage, emptyBarImage, offset, minDistanceToRender, scalingFactor){
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
        this.scalingFactor = scalingFactor || 0.8

    }

    update(currentValue, distance = false){
        this.refreshValue(currentValue, distance);
        this.calcCurrentValues();
    }

    drawBar(){
        if(this.distanceValue <= this.minDistanceToRender || !this.minDistanceToRender){
            ctx.drawImage(this.emptyBarImage, 0, 0, this.emptyBarImage.width, this.emptyBarImage.height, this.posOnCanvas[0], this.posOnCanvas[1], this.emptyBarImage.width * this.scalingFactor, this.emptyBarImage.height * this.scalingFactor)
            ctx.drawImage(this.fullBarImage, 0, 0, this.imageWidth * this.currentWidthPercentage, this.imageHeight, this.posOnCanvas[0] + this.offset[0], this.posOnCanvas[1] + this.offset[1], (this.imageWidth * this.scalingFactor) * this.currentWidthPercentage, (this.imageHeight * this.scalingFactor))
        }
    }

    refreshValue(currentValue, distance){
        this.currentValue = currentValue;
        this.distanceValue = distance
    }

    calcCurrentValues(){
        this.currentWidthPercentage = this.currentValue / this.maxValue;
    }
}