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

    /**
     * Update Main Loop
     * @param {*} currentValue of Points from Player
     */
    update(currentValue){
        this.refreshValue(currentValue);
        this.drawScore();  
    }

    /**
     * draw Ponits as Text to the canvas
     */
    drawScore(){
        ctx.font = `${this.fontSize}px PixelifySans`;
        ctx.fillStyle = this.shadowColor;
        ctx.fillText(`${this.addPrefix}${this.stingyfyValue}${this.addSuffix}`, this.posX + 1, this.posY + 2);
        ctx.fillStyle = this.color;
        ctx.fillText(`${this.addPrefix}${this.stingyfyValue}${this.addSuffix}`, this.posX, this.posY);
    }

    /**
     * generate a String out of the Amount of Points from Player 
     */
    refreshValue(currentValue){
        this.stingyfyValue = this.valueToString(currentValue);
    }


    /**
     * will add 0 before the current Score depending on this.decimalAmount.
     */
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