import { ctx } from "./canvas.js";

export class Tileset{
    constructor(option){
        this.image = new Image();
        this.image.src = option.src;
        this.tilesize = option.size;
        this.tileArray = [];
        this.amountOfElementsInRow = this.image.width / this.tilesize
    }

    /*
    createTile(tilePosX, tilePosY, inGamePosX, inGamePosY){
        let newTile = {
            tilePos: [tilePosX * this.tilesize, tilePosY * this.tilesize],
            inGamePos: [inGamePosX * this.tilesize, inGamePosY * this.tilesize]
        }
        this.tileArray.push(newTile);
    }
*/

    createTile(inGamePosX, inGamePosY, tileNumber){
        let yValue = Math.floor(tileNumber / this.amountOfElementsInRow);
        let xValue = (tileNumber - 1) % this.amountOfElementsInRow
        let newTile = {
            tilePos: [xValue * this.tilesize, yValue * this.tilesize],
            inGamePos: [inGamePosX * this.tilesize, inGamePosY * this.tilesize]
        }
        this.tileArray.push(newTile);  
    }

    draw(cameraPos){
        //ctx.drawImage(this.image, this.tileArray[0].tilePos[0], this.tileArray[0].tilePos[1],this.tilesize, this.tilesize, this.tileArray[0].inGamePos[0] - cameraPos[0], this.tileArray[0].inGamePos[1] - cameraPos[1], 36, 36)
        this.tileArray.forEach(tile => {
          ctx.drawImage(this.image, tile.tilePos[0], tile.tilePos[1],this.tilesize, this.tilesize, tile.inGamePos[0] - cameraPos[0], tile.inGamePos[1] - cameraPos[1], this.tilesize, this.tilesize)
        });
    }
}