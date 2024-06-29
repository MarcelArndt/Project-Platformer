import { ctx } from "../canvas.js";

export class ScoreBar{
    constructor(posOnCanvas, initStartValue, color, shadowColor){
        this.posX = posOnCanvas[0];
        this.posY = posOnCanvas[1];
        this.currentValue = initStartValue || 0;
        this.stingyfyValue = 0;
        this.posOnCanvas = posOnCanvas;
        this.color = color || "rgba(255,255,255,1)";
        this.shadowColor = shadowColor || "rgba(0,0,0,0.6)";
    }

    update(currentValue){
        this.refreshValue(currentValue);
        this.drawScore();  
    }

    drawScore(){
        ctx.font = "11px PixelifySans";
        ctx.fillStyle = this.shadowColor;
        ctx.fillText(`SCORE: ${this.stingyfyValue}`, this.posX + 1, this.posY + 2);
        ctx.fillStyle = this.color;
        ctx.fillText(`SCORE: ${this.stingyfyValue}`, this.posX, this.posY);
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
        if(value.length <= 5){
            for( let i = value.length; i < 6; i++){
                value = "0" + value;
            }
        } else if (value == null || value == undefined){
            value = "_ERROR:004_PLAYER_NOT_FOUND";
        }
        return value;
    }
}