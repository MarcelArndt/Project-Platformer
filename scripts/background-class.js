import { canvas, ctx } from "./canvas.js";


let backgroundImageLayerOne = new Image();
backgroundImageLayerOne.src = "./assets/background/background_layer_1.png";

let backgroundImageLayerTwo = new Image();
backgroundImageLayerTwo.src = "./assets/background/background_layer_2.png";

let backgroundImageLayerThree = new Image();
backgroundImageLayerThree.src = "./assets/background/background_layer_3.png";

let imageObject = [
    { image: backgroundImageLayerOne, offset: [1.3, 0.32], offsetValues:[6, 2], heightOffset:-410, widthOffset: 0},
    { image: backgroundImageLayerTwo, offset: [1.5, 0.64], offsetValues:[12, 8], heightOffset: -250, widthOffset: 0},
    { image: backgroundImageLayerThree, offset: [2.5, 1.3], offsetValues:[24, 12], heightOffset: 0, widthOffset: 0}
]

export class Background{
    constructor(option, type, speed){
        this.color = option.color || "skyblue";
        this.animationSpeed = option.speed || 1;
        this.image = imageObject
        this.type = type || "backgroundElements"
        this.width =  imageObject[0].image.width;
        this.height = imageObject[0].image.height;
        this.multiplyerX = 8;
        this.playerVel = [0,0];
        this.playerPos = [0,0];
        this.latestSpeed = 0;
        this.playerSpeed = 0;
        this.ValueIsToSlow = false;
    }

    updateBackground(playerArray){
        this.checkPlayerSpeed(playerArray);
        this.calcOffset();
        this.draw();
    }

    checkPlayerSpeed(PlayerArray){
        this.playerVel = PlayerArray[0].vel;
        this.playerPos = PlayerArray[0].pos;
        this.playerSpeed = PlayerArray[0].walkspeed;
    }

    calcOffset(){
        this.multiplyerX = this.playerVel[0];
        this.image.forEach(backgroundImg => {

            if(backgroundImg.offset[1] > 10) {
                backgroundImg.offset[1] = 0;

            } else if(this.playerVel[0] == 0){
                backgroundImg.offset[1] = 0;
            }
            backgroundImg.widthOffset += (this.multiplyerX / 5) * backgroundImg.offsetValues[0];
            backgroundImg.offset[1] = (this.playerPos[1] / 30) * backgroundImg.offsetValues[1];
        });
    }

    draw(scalingFactor = 1.15, offsetForWidth = 70){
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.image.forEach(backgroundImg => {
            ctx.drawImage(backgroundImg.image, 0, 0, 
                backgroundImg.image.width * scalingFactor, 
                backgroundImg.image.height * scalingFactor, 
                (-backgroundImg.widthOffset % ((-backgroundImg.image.width * 2) - (((backgroundImg.image.width / scalingFactor) - offsetForWidth) * scalingFactor) )) 
                - 120,
                160 + backgroundImg.heightOffset -backgroundImg.offset[1],
                canvas.width,
                canvas.height);
            
                ctx.drawImage(backgroundImg.image, 0, 0, 
                backgroundImg.image.width * scalingFactor, 
                backgroundImg.image.height * scalingFactor, 
                (-backgroundImg.widthOffset % ((-backgroundImg.image.width * 2) - (((backgroundImg.image.width / scalingFactor) - offsetForWidth) * scalingFactor) ))
                + (backgroundImg.image.width * 2) + ((backgroundImg.image.width * scalingFactor) - backgroundImg.image.width) + offsetForWidth,
                160 + backgroundImg.heightOffset -backgroundImg.offset[1],
                canvas.width,
                canvas.height);
        });
    }
}