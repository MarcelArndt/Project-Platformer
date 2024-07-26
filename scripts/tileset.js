import { canvas, ctx } from "./canvas.js";
import { Bird } from "./objects/bird-class.js";
import { Skelett } from "./objects/skelett-class.js";
import { Mushroom } from "./objects/mushroom-class.js";
import { Character } from "./objects/main-character-class.js";
import { Rectangle } from "./objects/rectangle-class.js";
import { SemiSolidBlock } from "./objects/semiSolidBlock-class.js";
import { Box } from "./objects/box-class.js";
import { JumpPad } from "./objects/jumpPad.js";
import { DeadlySolidBlock } from "./objects/deadlyBlock-class.js";
import { Potion } from "./objects/potion-class.js";
import { Coin } from "./objects/coin-class.js";
import { Projectile } from "./objects/projectile-class.js";
import { GhostBoss } from "./objects/ghost-boss-class.js";

export class Tileset {
  constructor(option) {
    this.image = option.image;
    this.tileSize = option.size;
    this.tileArray = [];
    this.amountOfElementsInRow = Math.ceil(this.image.width / this.tileSize);

    this.levelSizeInTiles = option.levelSizeInTiles;
    this.entityArrayData = option.entityArrayData;
    this.tilesArrayData = option.tilesArrayData;
    this.collisionArray = option.collisionArray;

    this.entityArray = [];
    this.tilesArray = [];
    this.slicedCollisonBlock = [];
    this.level = null;
  }

  translateTileMap(inGamePosX, inGamePosY, tileNumber) {
    let yValue = Math.floor(tileNumber / this.amountOfElementsInRow);
    let xValue = (tileNumber % this.amountOfElementsInRow) -1;
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
          case 686: newEntity = new Projectile  ({ pos: [x * this.tileSize, y * this.tileSize], size: [24, 24], color: "#FFD53D",}); this.level.pushNewObject(newEntity);break;
          case 315: newEntity = new Potion ({ pos: [x * this.tileSize, y * this.tileSize], size: [24, 24], color: "#FFD53D",}); this.level.pushNewObject(newEntity);break;
          case 316: newEntity = new Coin({ pos: [x * this.tileSize, y * this.tileSize], size: [15, 15], color: "#FFD53D", }); this.level.pushNewObject(newEntity); break;
          case 688: newEntity = new Skelett({ pos: [x * this.tileSize, y * this.tileSize], size: [30, 74], color: "#FFD53D",}); this.level.pushNewObject(newEntity); break;
          case 314: newEntity = new Mushroom({ pos: [x * this.tileSize, y * this.tileSize], size: [30, 50], color: "#FFD53D",jumpspeed: -1.07 }); this.level.pushNewObject(newEntity); break;
          case 309: newEntity = new Character({ pos: [x * this.tileSize, y * this.tileSize], size: [33, 56], color: "#edff2b", type: "Player", health: 60,});  this.level.pushNewObject(newEntity); break;;
          case 313: newEntity = new Bird({ pos: [x * this.tileSize, y * this.tileSize], size: [18, 23],}); this.level.pushNewObject(newEntity);break;
          case 319: newEntity = new GhostBoss({ pos: [x * this.tileSize, y * this.tileSize], size: [25, 95], color: "#FFD53D", jumpspeed: -1.07}); this.level.pushNewObject(newEntity); break;
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
          case 305: newCollisionBlock = new Rectangle({ pos: [y * this.tileSize, x * this.tileSize], size: [this.tileSize, this.tileSize], color: "rgba(255,255,255,0.0)", type: "Rectangle",}); this.level.pushNewObject(newCollisionBlock); break;
          case 318: newCollisionBlock = new DeadlySolidBlock({ pos: [y * this.tileSize, x * this.tileSize], size: [this.tileSize, this.tileSize], color: "rgba(255,255,255,0.0)", type: "Rectangle",}); this.level.pushNewObject(newCollisionBlock); break;
          case 312: newCollisionBlock = new SemiSolidBlock({ pos: [y * this.tileSize, x * this.tileSize], size: [this.tileSize, this.tileSize], color: "rgba(255,255,255,0.0)"}, "Rectangle"); this.level.pushNewObject(newCollisionBlock); break;
          //case 307: newCollisionBlock = new JumpPad({ pos: [y * this.tileSize, x * this.tileSize], size: [this.tileSize, this.tileSize], color: "rgba(255,255,255,0.0)"},this.level.player, "Hitbox"); console.log(newCollisionBlock); this.level.pushNewObject(newCollisionBlock);break;
          default: break;
        }
      });
    });
  }

  generateLevel(level){
    this.level = level;
    this.level.objectsOfType = {
      Rectangle: [],
      Box: [],
      Player: [],
      Goal: [],
      Entity: [],
      Enemy: [],
      Hitbox: [],
    };
    this.level.player = null;
    this.level.objects = [];
    this.entityArray = [];
    this.tilesArray = [];
    this.tileArray = [];
    this.slicedCollisonBlock = [];
    this.createCollision();
    this.createTiles();
    this.createEntity();
    this.level.initializeLevelToHitbox();
  }
}
