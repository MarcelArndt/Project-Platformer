import { canvas, ctx, canvasScalingFactor } from "./canvas.js";
import { imageIsloadet } from "./images.js";

export class Background {
  constructor(option, ImagesArray, type, speed) {
    this.backgroundImageLayerOne = ImagesArray[0];
    this.backgroundImageLayerTwo = ImagesArray[1];
    this.backgroundImageLayerThree = ImagesArray[2];
    this.imageObject = [
      {
        image: this.backgroundImageLayerOne,
        offset: [1.3, 0.32],
        offsetValues: [6, 3],
        heightOffset: 0,
        widthOffset: 0,
      },
      {
        image: this.backgroundImageLayerTwo,
        offset: [1.5, 0.64],
        offsetValues: [12, 8],
        heightOffset: 40,
        widthOffset: 0,
      },
      {
        image: this.backgroundImageLayerThree,
        offset: [2.5, 1.4],
        offsetValues: [24, 14],
        heightOffset: -80,
        widthOffset: 0,
      },
    ];
    this.color = option.color || "skyblue";
    this.animationSpeed = option.speed || 1;
    this.image = this.imageObject;
    this.type = type || "backgroundElements";
    this.width = this.imageObject[0].image.width;
    this.height = this.imageObject[0].image.height;
    this.multiplyerX = 8;
    this.playerVel = [0, 0];
    this.playerPos = [0, 0];
    this.latestSpeed = 0;
    this.playerSpeed = 0;
    this.ValueIsToSlow = false;
  }

  updateBackground(playerArray) {
    this.checkPlayerSpeed(playerArray);
    this.calcOffset();
    this.draw();
  }

  checkPlayerSpeed(PlayerArray) {
    this.playerVel = PlayerArray[0].vel;
    this.playerPos = PlayerArray[0].pos;
    this.playerSpeed = PlayerArray[0].walkspeed;
  }

  calcOffset() {
    this.multiplyerX = this.playerVel[0];
    this.image.forEach((backgroundImg) => {
      if (backgroundImg.offset[1] > 10) {
        backgroundImg.offset[1] = 0;
      } else if (this.playerVel[0] == 0) {
        backgroundImg.offset[1] = 0;
      }
      backgroundImg.widthOffset +=
        (this.multiplyerX / 5) * backgroundImg.offsetValues[0];
      backgroundImg.offset[1] =
        (this.playerPos[1] / 70) * backgroundImg.offsetValues[1] +
        backgroundImg.heightOffset;
    });
  }

  //drawImage(image, selfx, selfy, selfWidth, selfHeight, dx, dy, dWidth, dHeight)
  draw(upscaling = 2.675, offsetForWidth = 20, offsetForHeight = 125) {
    let calcOffsetWidth = 0;
    let moduloValue = 0;
    let calcDoppelWidth = 0;
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.image.forEach((backgroundImg) => {
      calcOffsetWidth = 0 - offsetForWidth - backgroundImg.widthOffset;
      calcDoppelWidth = backgroundImg.image.width * upscaling - 1;
      moduloValue = backgroundImg.image.width * upscaling;

      ctx.drawImage(
        backgroundImg.image,
        0,
        0,
        backgroundImg.image.width,
        backgroundImg.image.height,
        (calcOffsetWidth % moduloValue) + 0,
        0 - offsetForHeight - backgroundImg.offset[1],
        backgroundImg.image.width * upscaling,
        backgroundImg.image.height * upscaling
      );

      ctx.drawImage(
        backgroundImg.image,
        0,
        0,
        backgroundImg.image.width,
        backgroundImg.image.height,
        (calcOffsetWidth % moduloValue) + calcDoppelWidth,
        0 - offsetForHeight - backgroundImg.offset[1],
        backgroundImg.image.width * upscaling,
        backgroundImg.image.height * upscaling
      );
    });
  }
}
