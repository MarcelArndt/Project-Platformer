import { canvas, ctx } from "./canvas.js";


let backgroundImageLayerOne = new Image();
backgroundImageLayerOne.src = "./assets/background/background_layer_1.png";

let backgroundImageLayerTwo = new Image();
backgroundImageLayerTwo.src = "./assets/background/background_layer_2.png";

let backgroundImageLayerThree = new Image();
backgroundImageLayerThree.src = "./assets/background/background_layer_3.png";

let imageObject = [
    { image: backgroundImageLayerOne, offset: [0.32, 0.32], offsetValues:[6, 0], heightOffset: -120 },
    { image: backgroundImageLayerTwo, offset: [0.64, 0.64], offsetValues:[12, 3], heightOffset: -120 },
    { image: backgroundImageLayerThree, offset: [1.28, 1.28], offsetValues:[24, 7], heightOffset: 60 }
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

            if(backgroundImg.offset[0] > 10) {
                backgroundImg.offset[0] = 0;

            } else if(this.playerVel[0] == 0){
                backgroundImg.offset[0] = 0;
            }
            backgroundImg.offset[0] = this.multiplyerX * backgroundImg.offsetValues[0];
            backgroundImg.offset[1] = (this.playerPos[1] / 25) * backgroundImg.offsetValues[1];
        });
    }

    draw(){
       
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.image.forEach(backgroundImg => {
            ctx.drawImage(backgroundImg.image, backgroundImg.offset[0], 0, canvas.width, canvas.height, -50, 80 + backgroundImg.heightOffset -backgroundImg.offset[1], canvas.width * 3, canvas.height * 3);
        });
       
    }
}