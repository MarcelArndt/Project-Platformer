import { canvas, ctx } from "./canvas.js";

export class Tileset {
  constructor(option) {
    this.image = option.image;
    this.tilesize = option.size;
    this.tileArray = [];
    this.amountOfElementsInRow = this.image.width / this.tilesize;
  }

  createTile(inGamePosX, inGamePosY, tileNumber) {
    let yValue = Math.floor(tileNumber / this.amountOfElementsInRow);
    let xValue = (tileNumber - 1) % this.amountOfElementsInRow;
    let newTile = {
      tilePos: [xValue * this.tilesize, yValue * this.tilesize],
      inGamePos: [inGamePosX * this.tilesize, inGamePosY * this.tilesize],
    };
    this.tileArray.push(newTile);
  }

  draw(cameraPos) {
      this.tileArray.forEach((tile) => {
        if(tile.inGamePos[0] < cameraPos[0] + canvas.width && tile.inGamePos[0] > cameraPos[0] - (canvas.width / 10)){
        ctx.drawImage(
          this.image,
          tile.tilePos[0],
          tile.tilePos[1],
          this.tilesize,
          this.tilesize,
          tile.inGamePos[0] - cameraPos[0],
          tile.inGamePos[1] - cameraPos[1],
          this.tilesize + 0.5,
          this.tilesize + 0.5
        );
      }
      });
  }
}
