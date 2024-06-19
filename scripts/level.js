import { canvas, clearCanvas } from "./canvas.js";
import { Timer } from "./timer.js";
import { Bird } from "./objects/bird-class.js";
import { Skelett } from "./objects/skelett-class.js";
import { Character } from "./objects/main-character-class.js";
import { imageIsloadet, canvasOverlay, canvasOverlayContent, soundIsloadet} from "./assets.js";
import { Tileset } from "./tileset.js";
import { Background } from "./background-class.js";
import { Rectangle } from "./objects/rectangle-class.js";
import { SemiSolidBlock } from "./objects/semiSolidBlock-class.js";
import { pullIngameGui, globalVolume, pullPauseMenu, checkForVolume,} from "./menuScript.js";
import { ctx } from "./canvas.js";


export let camera = {
  pos: [0, 0],
};

let status = {
  ready: 1,
  pause: 2,
  running: 3,
  freeze: 4,
};

export class Level {
  constructor(option) {
    this.size = option.size || [canvas.width, canvas.height];
    this.cameraPos = [0, this.size[1] - canvas.height];
    this.originalCameraPos = [0, this.size[1] - canvas.height];
    this.objects = [];

    this.entityArrayData = option.entityArrayData;
    this.entityArray = [];

    this.tilesArrayData = option.tilesArrayData;
    this.tilesArray = [];

    this.tileSize = option.tileSize;
    this.levelSizeInTiles = option.levelSizeInTiles;

    this.tileset = null;

    this.receivingObjects = [
      option.objects,
      option.background,
      option.tileset,
      option.collisionTiles,
      option.cameraPos,
    ];

    this.currentLevelMusic = option.currentLevelMusic;
    this.currentAmbient = option.currentAmbient;

    this.currentLevelMusic.loop = true;
    this.currentAmbient.loop = true;

    this.player = null;
    this.game = null;
    this.index = 0;
    this.timer = new Timer();
    this.status = status.ready;
    this.levelIsWon = false;
    this.timer.update = (thisDeltaTime) => this.update(thisDeltaTime);
    this.objectsOfType = {
      Rectangle: [],
      Box: [],
      Player: [],
      Goal: [],
      Entity: [],
      Enemy: [],
    };
    this.originPlayerSize = 0;
    this.demageBoxes = {};
    this.deleteObjects = [];
    this.screenshakeValue = 0;
    this.screenshakeMaxValue = 35;
    this.screenshakeToggle = false;
    this.screenshakeAnimationRunning = false;
    this.screenAnimationTimer = 0;
    this.screenAnimationMaxTimer = 5;
    this.screenEffektTimer = 0;
    this.globalVolume = globalVolume || 0;
    this.savedGlobalVolume = this.globalVolume;

    this.keyFuncRef = (e) => this.keyFunction(e);
  }

  addControll() {
    window.addEventListener("keydown", this.keyFuncRef);
  }

  removeControll() {
    window.removeEventListener("keydown", this.keyFuncRef);
  }

  keyFunction(e) {
    if (e.key == "p" || e.key == "enter") {
      if (this.status === status.ready) {
        this.start();
      } else if (this.status === status.running) {
        this.pause();
      } else if (this.status === status.pause) {
        this.resume();
      }
    } else if (e.key == "r" && this.status === status.running) {
      this.resetLevel();
    }
  }

  addObjects(obj) {
    for (let i = 0; i < obj.length; i++) {
      const type = obj[i].type;
      obj[i].level = this;
      this.objects.push(obj[i]);
      this.objectsOfType[type].push(obj[i]);
    }
  }

  update(deltaTime) {
      clearCanvas();
      this.checkForVolume();
      this.updateCamera();
      this.checkWin();
      this.checkScreenshakeTime(deltaTime, 1);
      this.calculateScreenshakeValue(deltaTime);
      this.background.updateBackground(this.objectsOfType.Player);
      this.tileset.draw(this.cameraPos);
      for (let i = 0; i < this.objects.length; i++) {
        this.objects[i].update(deltaTime);
        this.objects[i].draw();
      }
  }

  checkForVolume(){
    this.globalVolume = globalVolume;
    this.currentLevelMusic.volume = 0.35 * this.globalVolume;
    this.currentAmbient.volume = 0.7 * this.globalVolume;
  }


  checkScreenshakeTime(deltaTime, speed = 1) {
    const secDeltaTime = (deltaTime / 10) * speed;
    if(this.screenshakeToggle){
      if(this.screenshakeAnimationRunning){
        this.screenshakeValue = -this.screenshakeMaxValue;
        this.screenshakeAnimationRunning = false;
      }
      this.screenAnimationTimer += secDeltaTime;

      if (Math.floor(this.screenAnimationTimer) >= this.screenAnimationMaxTimer) { 
        this.screenshakeToggle = false;

      }
    }
  }

  calculateScreenshakeValue(deltaTime){ 
    let secDeltaTime = deltaTime / 10;
    this.screenEffektTimer += secDeltaTime;
    if(Math.floor(this.screenEffektTimer) >= 2 && this.screenshakeToggle){
        if(Math.floor(this.screenshakeValue) <= this.screenshakeMaxValue && this.screenshakeToggle){
          this.screenshakeValue += (secDeltaTime * 2)
        } else if(Math.floor(this.screenshakeValue) >= this.screenshakeMaxValue && this.screenshakeToggle){
          this.screenshakeValue -= (secDeltaTime * 2)
        }
        this.screenEffektTimer = 0;
      } else if(!this.screenshakeToggle){
        this.screenEffektTimer = 0;
        this.screenAnimationTimer = 0;
        this.switchBackValueToZero(secDeltaTime);
      }
    }

    switchBackValueToZero(secDeltaTime){
      if(!this.screenshakeToggle){
        this.screenEffektTimer += secDeltaTime;
      }
      if(Math.floor(this.screenEffektTimer )>= 3 && !this.screenshakeToggle){
        if(this.screenshakeValue > 0.003 && !this.screenshakeToggle || this.screenshakeValue < 0.003){
          this.screenshakeValue *= 0.15
          console.log(this.screenshakeValue);
        } else if(!this.screenshakeToggle){
          this.screenshakeValue = 0;
        }
        this.screenEffektTimer = 0;
      }
      
    }
  

  updateCamera() {
    this.cameraPos[0] = Math.max( 0,Math.min( this.size[0] - canvas.width * 0.69, this.player.posRight - (canvas.width * 0.65) / 2 ) + this.screenshakeValue);
    this.cameraPos[1] = Math.max(0,Math.min(this.size[1] - canvas.height * 0.69, this.player.posTop - (canvas.height * 0.5) / 2 ) + this.screenshakeValue - this.originPlayerSize[1]);
  }

  drawObjects() {
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].draw();
    }
  }

  createTileset() {
    let newTilesetImage = imageIsloadet.tileset;
    this.tileset = new Tileset({
      image: newTilesetImage,
      size: this.tileSize,
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
          case 631: newCollisionBlock  = new Rectangle({ pos: [y * this.tileSize, x * this.tileSize], size: [this.tileSize + 0.5, this.tileSize + 0.5], color: "rgba(255,255,255,0.0)", type: "Rectangle",}); this.pushNewObject(newCollisionBlock); break;
          case 638: newCollisionBlock = new SemiSolidBlock({ pos: [y * this.tileSize, x * this.tileSize], size: [this.tileSize + 0.5, this.tileSize + 0.5], color: "rgba(255,255,255,0.0)"}, "Rectangle"); this.pushNewObject(newCollisionBlock);
          default: break;
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
          case 0: break; default: this.tileset.createTile(x, y, tileNumber); break;
        }
      });
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
          case 636: newEntity = new Coin({ pos: [x * this.tileSize, y * this.tileSize], size: [24, 24], color: "#FFD53D", }); this.pushNewObject(newEntity); break;
          case 637: newEntity = new Skelett({ pos: [x * this.tileSize, y * this.tileSize], size: [44, 100], color: "#FFD53D",}); this.pushNewObject(newEntity); break;
          case 635: newEntity = new Character({ pos: [x * this.tileSize, y * this.tileSize], size: [36, 67], color: "edff2b", type: "Player", });  this.pushNewObject(newEntity); break;;
          case 639: newEntity = new Bird({ pos: [x * this.tileSize, y * this.tileSize], size: [22, 22],}); this.pushNewObject(newEntity);break;
          case 640: newEntity = new Box({ pos: [x * this.tileSize, y * this.tileSize], size: [36, 36], color: "brown",}); this.pushNewObject(newEntity); break;
        }
      });
    });
  }

  pushNewObject(obj) {
    if(obj.type == "Player"){
      obj.level = this;
      this.Player = obj;
    }
    let type = obj.type;
    obj.level = this;
    this.objects.push(obj);
    this.objectsOfType[type].push(obj);
  }

  checkWin() {
    if (!this.levelIsWon) return;
    this.status = status.pause;
    this.timer.pause;
    this.removeControll();
    this.game.switchToNextLevel();
  }

  createDemageboxes(){
    this.objects.forEach((obj) => {
      let HitboxArray = [];
      if(obj.demageBoxes != undefined && obj.demageBoxes.length > 0){
        for (let i = 0; i < obj.demageBoxes.length; i++){
          obj.demageBoxes[i].level = this;
          HitboxArray.push(obj.demageBoxes[i]);
        }
        this.demageBoxes[obj.index] = HitboxArray
      }
    });
  }

  start() {
    canvasOverlayContent.innerHTML = "";
    this.background = new Background({ color: "#453d4f" }, [
      imageIsloadet.backgroundOne,
      imageIsloadet.backgroundTwo,
      imageIsloadet.backgroundThree,
    ]);
    this.collisionArray = this.receivingObjects[3];
    this.tileset = this.receivingObjects[2];
    this.collisionTiles = this.receivingObjects[3];
    this.status = status.running;
    this.timer.pause = false;
    this.timer.start();
    this.createCollision()
    this.createTileset();
    this.createTiles();
    this.createEntity();
    this.createDemageboxes();
    this.player = this.objectsOfType.Player[0];
    this.originPlayerSize = [... this.player.size];
    this.currentLevelMusic.play()
    this.currentLevelMusic.volume = 0.35 * this.globalVolume;
    this.currentAmbient.play()
    this.currentAmbient.volume = 0.7 * this.globalVolume;
    pullIngameGui();
  }

  pause() {
    this.currentAmbient.pause();
    this.currentLevelMusic.pause();
    ctx.fillStyle = "rgba(28, 13, 8, 0.8)";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(imageIsloadet.menuBackgroundBook, 0, 0);
    pullPauseMenu();
    this.status = status.pause;
    this.timer.getInPause();
    this.savedGlobalVolume = this.globalVolume;
    this.globalVolume = 0;
    console.log(this.savedGlobalVolume)
  }

  resume() {
    console.log(this.savedGlobalVolume)
    this.globalVolume = this.savedGlobalVolume;
    this.currentLevelMusic.play();
    this.currentAmbient.play();
    canvasOverlayContent.innerHTML = "";
    this.status = status.running;
    this.timer.pause = false;
    this.timer.start();
    pullIngameGui();
    checkForVolume();
  }

  resetLevel() {
    this.status = status.ready;
    this.objects.forEach((obj) => obj.reset());
    this.cameraPos = [...this.originalCameraPos];
    this.addObjects(this.deleteObjects || []);
    this.deleteObjects = [];
  }
}
