import { canvas, ctx } from "./canvas.js";
import { Bird } from "./objects/bird-class.js";
import { Skelett } from "./objects/skelett-class.js";
import { Mushroom } from "./objects/mushroom-class.js";
import { Character } from "./objects/main-character-class.js";
import { Rectangle } from "./objects/rectangle-class.js";
import { SemiSolidBlock } from "./objects/semiSolidBlock-class.js";
import { Box } from "./objects/box-class.js";

export class Tileset {
  constructor(option) {
    this.image = option.image;
    this.tileSize = option.size;
    this.tileArray = [];
    this.amountOfElementsInRow = this.image.width / this.tileSize;
    this.entityArray = [];
    this.levelSizeInTiles = option.levelSizeInTiles;
    this.entityArrayData = option.entityArrayData;
    this.level = null;
    this.tilesArrayData = option.tilesArrayData;
    this.tilesArray = [];
    this.collisionArray = option.collisionArray;
    this.slicedCollisonBlock = [];
  }

  translateTileMap(inGamePosX, inGamePosY, tileNumber) {
    let yValue = Math.floor(tileNumber / this.amountOfElementsInRow);
    let xValue = (tileNumber - 1) % this.amountOfElementsInRow;
    let newTile = {
      tilePos: [xValue * this.tileSize, yValue * this.tileSize],
      inGamePos: [inGamePosX * this.tileSize, inGamePosY * this.tileSize],
    };
    this.tileArray.push(newTile);
  }

  draw(cameraPos) {
      this.tileArray.forEach((tile) => {
        if(tile.inGamePos[0] < cameraPos[0] + canvas.width && tile.inGamePos[0] > cameraPos[0] - (canvas.width / 10)){
        ctx.drawImage(
          this.image, tile.tilePos[0], tile.tilePos[1], this.tileSize, this.tileSize, tile.inGamePos[0] - cameraPos[0], tile.inGamePos[1] - cameraPos[1], this.tileSize + 0.5, this.tileSize + 0.5
        );
      }
      });
  }

  createEntity() {
    let newEntity = null;
    for ( let i = 0; i < this.entityArrayData.length; i += this.levelSizeInTiles) {
      this.entityArray.push( this.entityArrayData.slice(i, i + this.levelSizeInTiles));
    }
    this.entityArray.forEach((row, y) => {
      row.forEach((tileNumber, x) => {
        switch (tileNumber) {
          case 0: break;
          case 636: newEntity = new Coin({ pos: [x * this.tileSize, y * this.tileSize], size: [24, 24], color: "#FFD53D", }); this.level.pushNewObject(newEntity); break;
          case 637: newEntity = new Skelett({ pos: [x * this.tileSize, y * this.tileSize], size: [44, 100], color: "#FFD53D",}); this.level.pushNewObject(newEntity); break;
          case 640: newEntity = new Mushroom({ pos: [x * this.tileSize, y * this.tileSize], size: [34, 71], color: "#FFD53D",jumpspeed: -1.07 }); this.level.pushNewObject(newEntity); break;
          case 635: newEntity = new Character({ pos: [x * this.tileSize, y * this.tileSize], size: [36, 67], color: "edff2b", type: "Player", });  this.level.pushNewObject(newEntity); break;;
          case 639: newEntity = new Bird({ pos: [x * this.tileSize, y * this.tileSize], size: [22, 22],}); this.level.pushNewObject(newEntity);break;
          //case 640: newEntity = new Box({ pos: [x * this.tileSize, y * this.tileSize], size: [36, 36], color: "brown",}); this.level.pushNewObject(newEntity); break;
        }
      });
    });
  }

  createTiles() {
    for ( let i = 0; i < this.tilesArrayData.length; i += this.levelSizeInTiles) {
      this.tilesArray.push( this.tilesArrayData.slice(i, i + this.levelSizeInTiles));
    }
    this.tilesArray.forEach((row, y) => {row.forEach((tileNumber, x) => {
        switch (tileNumber) {
          case 0: break; default: this.translateTileMap(x, y, tileNumber); break;
        }
      });
    });
  }

  createCollision() {
    let slicedCollisonBlock = [];
    for (let i = 0; i < this.collisionArray.length; i += this.levelSizeInTiles) {
      slicedCollisonBlock.push( this.collisionArray.slice(i, i + this.levelSizeInTiles));
    }
    slicedCollisonBlock.forEach((row, x) => {
      row.forEach((tile, y) => {
        let newCollisionBlock = null;
        switch (tile) {
          case 0: break;
          case 631: newCollisionBlock  = new Rectangle({ pos: [y * this.tileSize, x * this.tileSize], size: [this.tileSize + 0.5, this.tileSize + 0.5], color: "rgba(255,255,255,0.0)", type: "Rectangle",}); this.level.pushNewObject(newCollisionBlock); break;
          case 638: newCollisionBlock = new SemiSolidBlock({ pos: [y * this.tileSize, x * this.tileSize], size: [this.tileSize + 0.5, this.tileSize + 0.5], color: "rgba(255,255,255,0.0)"}, "Rectangle"); this.level.pushNewObject(newCollisionBlock);
          default: break;
        }
      });
    });
  }

  generateLevel(level){
    this.level = level;
    this.createCollision();
    this.createTiles();
    this.createEntity();
  }
}
