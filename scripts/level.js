import { canvas, clearCanvas } from "./canvas.js";
import { Timer } from "./timer.js";
import { imageIsloadet, soundIsloadet} from "./assets.js";
import { globalVolume, pullPauseMenu, drawMenuBookBackground} from "./menuScript.js";
import { ctx } from "./canvas.js";
import { renderdebugCode } from "./template.js";
import { LevelManager } from "./levelManager.js";
import { MusikManager } from "./musikManager.js";
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
    this.tileset = option.tileset;
    this.currentLevelMusic = option.currentLevelMusic;
    this.currentAmbient = option.currentAmbient;
    this.currentBossMusic =  option.currentBossMusic;
    this.bossAlreadySeen = false;
    this.player = null;
    this.game = null;
    this.index = 0;
    this.timer = new Timer();
    this.status = status.ready;
    this.levelIsWon = false;
    this.playerIsStillAlive = true;
    this.Gamelose = false;
    this.timer.update = (thisDeltaTime) => this.update(thisDeltaTime);
    this.objectsOfType = {
      Rectangle: [],
      Box: [],
      Player: [],
      Goal: [],
      Entity: [],
      Enemy: [],
      Hitbox: [],
    };
    this.originPlayerSize = 0;
    this.demageBoxes = {};
    this.cameraHeightOffset = 0;
    this.screenshakeValue = 0;
    this.screenshakeMaxValue = 35;
    this.screenshakeToggle = false;
    this.screenshakeAnimationRunning = false;
    this.screenAnimationTimer = 0;
    this.screenAnimationMaxTimer = 5;
    this.screenEffektTimer = 0;
    this.globalVolume = globalVolume || 0;
    this.bossVolume = 0;
    this.showDebug = false;
    this.minionCounter = 0;
    this.playerLives = 0;
    this.originPlayerLives = 0;
    this.savedGlobalVolume = this.globalVolume;
    this.playerInBossRange = false;
    this.levelManager = new LevelManager(this);
    this.musicManager = new MusikManager(option.currentLevelMusic, option.currentAmbient);
  }

  /**
  * @param {object} obj -> adds Obj to current level level and bound and reference this level to this object.
  */
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

  /**
   * catch all hitboxes insise a object is inject it inside this level to "enable" them for the game. 
   */
  initializeLevelToHitbox(){
    this.objects.forEach(obj => {
      if (obj.demageBoxes != null && obj.demageBoxes != undefined && !obj.hitboxIsBoundToLevel){
        obj.demageBoxes.forEach(hitbox => {
          this.pushNewObject(hitbox);
        });
        obj.hitboxIsBoundToLevel = true;
      }
    });
  }


  /**
   * main update loop for the entirety game.
   * will update Background, Music, level-Condition and object this level
   */
  update(deltaTime) {
      clearCanvas();
      this.checkForVolume();
      this.musicManager.update(this.globalVolume, deltaTime);
      this.updateCamera();
      this.checkScreenshakeTime(deltaTime, 1);
      this.calculateScreenshakeValue(deltaTime);
      this.drawGame(deltaTime);
      this.checkGameWin();
      this.playerStillGotLives();
  }

  /**
   * update and draw any object from the main update loop
   */
  drawGame(deltaTime){
    this.background.updateBackground(this.player);
    this.tileset.draw(this.cameraPos);
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].draw()
        if (this.objects[i].statusbar && this.objects[i].type != "Player"){
          this.objects[i].statusbar.drawBar();
         } 
      this.objects[i].update(deltaTime);
    }
    this.player.scoreBar.drawScore();
    this.player.statusbar.drawBar();
    this.player.lifeCounter.drawScore();
    this.drawDebug(deltaTime);
  }

  /**
  * set from globalGame to tis level
  */
  checkForVolume(){
    this.globalVolume = globalVolume;
  }

  /**
  * is showing debug menu aktiv it will render the the current values at the top of the scree
  */
  drawDebug(){
    if(this.showDebug){
      let debugArray = [this.minionCounter, this.player.pos[0], this.player.pos[1], this.player.animationStatus, this.player.health, canvas.width, canvas.height, this.cameraPos[0], this.cameraPos[1]];
      ctx.fillStyle = "rgba(0,10,35,0.8)"
      ctx.fillRect(0,0,1240,15)
      ctx.font = "7px PixelifySans";
      ctx.fillStyle = "black";
      ctx.fillText(renderdebugCode(debugArray), 10 + 0.5, 10 + 0.5);
      ctx.fillStyle = "white";
      ctx.fillText(renderdebugCode(debugArray), 10, 10);
    }
  }

  /**
   * @param {timeValue/number} deltaTime 
   * @param {number} speed - controls the time value until the Screen-Shake-Effekt is turning off
   */
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

  /**
   * @param {timeValue/number} deltaTime 
   * simulate a screenshake effekt by scrolling up and down 
   */
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

  /**
   * @param {timeValue/number} secDeltaTime -> deltaTime / 10
   * will set the Camara-Offset back to 0
   */ 
    switchBackValueToZero(secDeltaTime){
      if(!this.screenshakeToggle){
        this.screenEffektTimer += secDeltaTime;
      }
      if(Math.floor(this.screenEffektTimer )>= 3 && !this.screenshakeToggle){
        if(this.screenshakeValue > 0.003 && !this.screenshakeToggle || this.screenshakeValue < 0.003){
          this.screenshakeValue *= 0.15
        } else if(!this.screenshakeToggle){
          this.screenshakeValue = 0;
        }
        this.screenEffektTimer = 0;
      }
    }


  /**
   * Core Camera function for this game. 
   * dependent to the player location in the current level.
   */ 
  updateCamera() {
    this.cameraPos[0] = Math.max( 0,Math.min( this.size[0] - canvas.width * 0.5 , this.player.posRight - (canvas.width / 2) / 2) + this.screenshakeValue );
    this.cameraPos[1] = Math.max(0,Math.min(this.size[1] - canvas.height * 0.5 , this.player.posTop - (canvas.height / 2.5 ) / 2 ) + this.screenshakeValue - (this.originPlayerSize[1]) - this.cameraHeightOffset + 15);
  }


  /**
   * update and checks is game already over
   */
  checkGameWin() {
    if(this.levelIsWon){
      this.levelManager.endGame()
    }
  }

  /**
   * update and checks for Player Live Counter
   */
  playerStillGotLives(){
    if(this.player.lives <= 0){
      this.levelIsWon = true;
      this.playerIsStillAlive = false;
    }
  }
}
