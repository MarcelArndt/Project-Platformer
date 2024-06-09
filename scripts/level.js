import { canvas, clearCanvas } from "./canvas.js";
import { Timer } from "./timer.js";
import { Bird } from "./objects/bird-class.js";
import { Skelett } from "./objects/skelett-class.js";
import { Character } from "./objects/main-character-class.js";
import { imageIsloadet } from "./images.js";
import { Tileset } from "./tileset.js";
import { Background } from "./background-class.js";
import { canvasOverlay, canvasOverlayContent } from "./game-class.js";

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
    this.player = null;
    this.game = null;
    this.index = 0;
    this.timer = new Timer();
    this.status = status.ready;
    this.levelIsWon = false;
    this.timer.update = (thisDeltaTime) => this.update(thisDeltaTime);
    this.objectsOfType = null;
    this.deleteObjects = [];
    this.screenshakeValue = 0;
    this.screenshake = false;
    this.screenshakeMaxRange = 24;
    this.screenAnimationTimer = 0;
    this.screenEffektTimer = 0;
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

  addCollisionTiles() {
    this.collisionTiles.forEach((tile) => {
      tile.level = this;
      this.objects.push(tile);
      this.objectsOfType[tile.type].push(tile);
    });
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
    this.updateCamera();
    this.checkWin();
    this.animateScreenshake(deltaTime, 1);
    this.background.updateBackground(this.objectsOfType.Player);
    this.tileset.draw(this.cameraPos);
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].update(deltaTime);
      this.objects[i].draw();
    }
  }

  animateScreenshake(deltaTime, speed = 1) {
    const secDeltaTime = (deltaTime / 100) * speed;
    this.screenAnimationTimer += secDeltaTime;
    let randomDivider = Math.floor(Math.random() * 10);
    if (
      this.screenshake &&
      this.screenAnimationTimer >= 1.5 &&
      this.screenAnimationTimer < 3
    ) {
      this.screenshakeValue = randomDivider;
    } else if (this.screenshake && this.screenAnimationTimer >= 3) {
      this.screenshakeValue = -randomDivider;
      this.screenAnimationTimer = 0;
    }
  }

  drawObjects() {
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].draw();
    }
  }

  updateCamera() {
    let randomNumber = Math.random();
    if (randomNumber == 0) {
      randomNumber = -1;
    }
    //debugger;
    this.cameraPos[0] = Math.max(
      0,
      Math.min(
        this.size[0] - canvas.width * 0.69,
        this.player.posRight - (canvas.width * 0.65) / 2
      ) +
        (this.screenshakeValue / 1) * randomNumber
    );
    this.cameraPos[1] = Math.max(
      0,
      Math.min(
        this.size[1] - canvas.height * 0.69,
        this.player.posTop - (canvas.height * 0.5) / 2
      ) + this.screenshakeValue
    );
  }

  createTileset() {
    let newTilesetImage = imageIsloadet.tileset;
    //newTilesetImage.src = "./assets/oak_woods_tileset-36x36_acd_tx_village_props.png";
    this.tileset = new Tileset({
      image: newTilesetImage,
      size: this.tileSize,
    });
  }

  createTiles() {
    for (
      let i = 0;
      i < this.tilesArrayData.length;
      i += this.levelSizeInTiles
    ) {
      this.tilesArray.push(
        this.tilesArrayData.slice(i, i + this.levelSizeInTiles)
      );
    }
    this.tilesArray.forEach((row, y) => {
      row.forEach((tileNumber, x) => {
        switch (tileNumber) {
          case 0:
            break;
          default:
            this.tileset.createTile(x, y, tileNumber);
            break;
        }
      });
    });
  }

  createEntity() {
    let newEntity = null;
    for (
      let i = 0;
      i < this.entityArrayData.length;
      i += this.levelSizeInTiles
    ) {
      this.entityArray.push(
        this.entityArrayData.slice(i, i + this.levelSizeInTiles)
      );
    }
    this.entityArray.forEach((row, y) => {
      row.forEach((tileNumber, x) => {
        switch (tileNumber) {
          case 0:
            break;
          case 635:
            newEntity = new Character({
              pos: [x * this.tileSize + 35, y * this.tileSize],
              size: [36, 67],
              color: "edff2b",
              type: "Player",
            });
            break;
          case 636:
            newEntity = new Coin({
              pos: [x * this.tileSize, y * this.tileSize],
              size: [24, 24],
              color: "#FFD53D",
            });
            this.pushNewObject(newEntity);
            break;
          case 637:
            newEntity = new Skelett({
              pos: [x * this.tileSize, y * this.tileSize],
              size: [44, 100],
              color: "#FFD53D",
            });
            this.pushNewObject(newEntity);
            break;
          case 639:
            newEntity = new Bird({
              pos: [x * this.tileSize, y * this.tileSize],
              size: [22, 22],
            });
            this.pushNewObject(newEntity);
            break;
          case 640:
            newEntity = new Box({
              pos: [x * this.tileSize, y * this.tileSize],
              size: [36, 36],
              color: "brown",
            });
            this.pushNewObject(newEntity);
            break;
        }
      });
    });
  }

  pushNewObject(obj) {
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

  start() {
    this.objectsOfType = {
      Rectangle: [],
      Box: [],
      Player: [],
      Goal: [],
      Entity: [],
      Enemy: [],
    };
    canvasOverlayContent.innerHTML = "";
    this.background = new Background({ color: "#453d4f" }, [
      imageIsloadet.backgroundOne,
      imageIsloadet.backgroundTwo,
      imageIsloadet.backgroundThree,
    ]);
    this.tileset = this.receivingObjects[2];
    this.collisionTiles = this.receivingObjects[3];
    this.addCollisionTiles();
    this.addObjects(this.receivingObjects[0] || []);
    this.player = this.objectsOfType.Player[0];
    this.status = status.running;
    this.timer.pause = false;
    this.timer.start();
    this.createTileset();
    this.createTiles();
    this.createEntity();
  }

  pause() {
    canvasOverlayContent.innerHTML = "Press P to Resume";
    canvasOverlay.classList.add("blackscreen");
    this.status = status.pause;
    this.timer.getInPause();
  }

  resume() {
    canvasOverlayContent.innerHTML = "";
    canvasOverlay.classList.remove("blackscreen");
    this.status = status.running;
    this.timer.pause = false;
    this.timer.start();
  }

  resetLevel() {
    this.status = status.ready;
    this.objects.forEach((obj) => obj.reset());
    this.cameraPos = [...this.originalCameraPos];
    this.addObjects(this.deleteObjects || []);
    this.deleteObjects = [];
  }
}
