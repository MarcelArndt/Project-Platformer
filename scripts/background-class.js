import { canvas, ctx} from "./canvas.js";

export class Background {
  constructor(option, ImagesArray, level, type) {
    this.level = level;
    this.backgroundImageLayerOne = ImagesArray[0];
    this.backgroundImageLayerTwo = ImagesArray[1];
    this.backgroundImageLayerThree = ImagesArray[2];
    this.imageObject = [
      {
        image: this.backgroundImageLayerOne,
        offset: [1.3, 0.32],
        offsetValues: [0.2, 0.05],
        heightOffset: 140,
        widthOffset: 0,
      },
      {
        image: this.backgroundImageLayerTwo,
        offset: [1.5, 0.64],
        offsetValues: [0.3, 0.2],
        heightOffset: 130,
        widthOffset: 0,
      },
      {
        image: this.backgroundImageLayerThree,
        offset: [2.5, 1.4],
        offsetValues: [0.7, 0.4],
        heightOffset: -30,
        widthOffset: 0,
      },
    ];
    this.color = option.color || "skyblue";
    this.animationSpeed = option.speed || 1;
    this.image = this.imageObject;
    this.type = type || "backgroundElements";
    this.width = this.imageObject[0].image.width;
    this.height = this.imageObject[0].image.height;
    this.playerVel = [0, 0];
    this.playerPos = [0, 0];
    this.latestSpeed = 0;
    this.playerSpeed = 0;
    this.ValueIsToSlow = false;
  }

  /**
   * update loop from level.
   */
  updateBackground(playerArray) {
    this.calcOffset();
    this.draw();
  }


  /**
   * calculation the scrolling effekt for each Background-Element.
   */
  calcOffset() {
    this.image.forEach((backgroundImg) => {
      backgroundImg.widthOffset = this.level.cameraPos[0] * backgroundImg.offsetValues[0];
      backgroundImg.offset[1] = this.level.cameraPos[1] * backgroundImg.offsetValues[1] + backgroundImg.heightOffset;
    });
  }


  /**
   * caluclate all necessary values to draw it correctly inside the game.
   * @param {number} upscaling set a Value to upscale and make size of the backgound smaller or bigger.
   * @param {number} offsetForWidth set a Value to set the backgound futher left or right.
   * @param {number} offsetForHeight set a Value to set the backgound futher top or bottom.
   * drawImage(image, selfx, selfy, selfWidth, selfHeight, dx, dy, dWidth, dHeight)
   */
  draw(upscaling = 2.3, offsetForWidth = 0, offsetForHeight = 0) {
    let calcOffsetWidth = 0;
    let moduloValue = 0;
    let calcDoppelWidth = 0;
    this.image.forEach((backgroundImg) => {
      calcOffsetWidth = 0 - offsetForWidth - backgroundImg.widthOffset;
      calcDoppelWidth = backgroundImg.image.width * upscaling - 1;
      moduloValue = backgroundImg.image.width * upscaling;
      ctx.drawImage(backgroundImg.image, 0, 0, backgroundImg.image.width, backgroundImg.image.height, (calcOffsetWidth % moduloValue) + 0, 0 - offsetForHeight - backgroundImg.offset[1], backgroundImg.image.width * upscaling, backgroundImg.image.height * upscaling);
      ctx.drawImage(backgroundImg.image, 0, 0, backgroundImg.image.width, backgroundImg.image.height, (calcOffsetWidth % moduloValue) + calcDoppelWidth, 0 - offsetForHeight - backgroundImg.offset[1], backgroundImg.image.width * upscaling, backgroundImg.image.height * upscaling);
    });
  }
}
