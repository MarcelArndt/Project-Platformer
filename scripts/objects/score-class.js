import { ctx } from "../canvas.js";

export class ScoreBar{
    constructor(posOnCanvas, options, initStartValue){ 
        const {color, shadowColor, addSuffix, addPrefix, decimalAmount, fontSize} = options
        this.posX = posOnCanvas[0];
        this.posY = posOnCanvas[1];
        this.currentValue = initStartValue || 0;
        this.stingyfyValue = 0;
        this.posOnCanvas = posOnCanvas;
        this.color = color || "rgba(255,255,255,1)";
        this.shadowColor = shadowColor || "rgba(0,0,0,0.6)";
        this.addSuffix = addSuffix || "";
        this.addPrefix = addPrefix || "SCORE: ";
        this.decimalAmount =  decimalAmount || 6;
        this.fontSize = fontSize || 11;
    }

    update(currentValue){
        this.refreshValue(currentValue);
        this.drawScore();  
    }

    drawScore(){
        ctx.font = `${this.fontSize}px PixelifySans`;
        ctx.fillStyle = this.shadowColor;
        ctx.fillText(`${this.addPrefix}${this.stingyfyValue}${this.addSuffix}`, this.posX + 1, this.posY + 2);
        ctx.fillStyle = this.color;
        ctx.fillText(`${this.addPrefix}${this.stingyfyValue}${this.addSuffix}`, this.posX, this.posY);
    }


    refreshValue(currentValue){
        this.stingyfyValue = this.valueToString(currentValue);
    }


    valueToString(stingValue){
        let value = 0;
        if(typeof stingValue != "sting"){
            value = stingValue.toString();
        } else {
            value = stingValue;
        }
        if(value.length <= this.decimalAmount){
            for( let i = value.length; i < this.decimalAmount; i++){
                value = "0" + value;
            }
        } else if (value == null || value == undefined){
            value = "_ERROR:004_PLAYER_NOT_FOUND";
        }
        return value;
    }
}