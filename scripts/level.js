import { canvas, clearCanvas } from "./canvas.js";
import { Timer } from "./timer.js";
import { imageIsloadet, canvasOverlayContent, soundIsloadet} from "./assets.js";
import { Background } from "./background-class.js";
import { pullIngameGui, globalVolume, pullPauseMenu, checkForVolume, endMenuScreen, drawMenuBookBackground} from "./menuScript.js";
import { ctx } from "./canvas.js";
import { renderdebugCode } from "./template.js";
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
    this.currentLevelMusic.loop = true;
    this.currentAmbient.loop = true;
    this.player = null;
    this.game = null;
    this.index = 0;
    this.timer = new Timer();
    this.status = status.ready;
    this.levelIsWon = false;
    this.Gamelose = false;
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
    this.savedGlobalVolume = this.globalVolume;
    this.keyFuncRef = (e) => this.keyFunction(e);
    this.mouseFuncRef = (e) => this.mouseFunction(e);
  }

  addControll() {
    window.addEventListener("keydown", this.keyFuncRef);
    window.addEventListener("click", this.mouseFuncRef);
  }

  removeControll() {
    window.removeEventListener("keydown", this.keyFuncRef);
    window.removeEventListener("click", this.mouseFuncRef);
  }

  mouseFunction(e){
    const clickedDiv = e.target;
    const atribute = clickedDiv.getAttribute("value");
    switch(atribute){
      case "openKeyboard": this.pause(1); break;
      case "restartButton": this.resetLevel(); break;
      case "startGame": this.start(); break;
    }
  }

  keyFunction(e) {
    if (e.key == "p" || e.key == "enter") {
      if (this.status == status.ready) {
        this.start();
      } else if (this.status == status.running) {
        this.pause();
      } else if (this.status == status.pause) {
        this.resume();
      }
    } else if (e.key == "r" && this.status == status.running) {
      this.resetLevel();
    }
    else if (e.key == "?") { 
      this.showDebug = this.showDebug == false ? true:false;
    }
  }

    /**
   * @param obj -> adds Obj to current level level
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

  update(deltaTime) {
      clearCanvas();
      this.checkForVolume();
      this.updateCamera();
      this.checkGameWin();
      this.checkScreenshakeTime(deltaTime, 1);
      this.calculateScreenshakeValue(deltaTime);
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

  checkForVolume(){
    this.globalVolume = globalVolume;
    this.currentLevelMusic.volume = this.globalVolume * this.bossVolume;
    if(this.bossAlreadySeen){
      this.currentBossMusic.play();
      this.currentBossMusic.volume = this.globalVolume * this.calculateBossVolume() * 0.5;
    }
    this.currentAmbient.volume = this.globalVolume * this.bossVolume;
  }


  drawDebug(deltatime){
    if( this.showDebug){
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
        } else if(!this.screenshakeToggle){
          this.screenshakeValue = 0;
        }
        this.screenEffektTimer = 0;
      }
    }
  

  updateCamera() {
    this.cameraPos[0] = Math.max( 0,Math.min( this.size[0] - canvas.width * 0.5 , this.player.posRight - (canvas.width / 2) / 2 ) + this.screenshakeValue );
    this.cameraPos[1] = Math.max(0,Math.min(this.size[1] - canvas.height * 0.5 , this.player.posTop - (canvas.height / 2.5 ) / 2 ) + this.screenshakeValue - this.originPlayerSize[1] - this.cameraHeightOffset);
  }

  drawObjects() {
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].draw();
    }
  }

  checkWin() {
    if (!this.levelIsWon) return;
    this.status = status.pause;
    this.timer.pause;
    this.removeControll();
    this.game.playerLives = this.player.lives;
    this.game.playerHealth = this.player.health;
    this.game.playerScore = this.player.score;
    this.game.switchToNextLevel();
  }

  checkGameWin() {
    if (!this.levelIsWon) return;
    endMenuScreen();
    drawMenuBookBackground();
    this.status = status.pause;
    this.timer.pause;
    this.removeControll();
    this.currentAmbient.pause();
    this.currentLevelMusic.pause();
    ctx.fillStyle = "rgba(28, 13, 8, 0.8)";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    this.status = status.pause;
    this.timer.getInPause();
    this.game.endGame();
    this.game.committedValueToGame();
    this.currentAmbient.pause();
    this.currentLevelMusic.pause();
    this.currentBossMusic.pause();
  }

  createDemageboxes(){
  this.demageBoxes = {};
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

  playBackgroundMusic(){
    this.currentLevelMusic.play();
    this.currentAmbient.play();
  }

  calculateBossVolume(){
    let volume = 1 - this.bossVolume;
    volume = volume >= 1 ? 1:volume;
    volume = volume <= 0 ? 0:volume;
    this.currentLevelMusic.volume = volume >= 0.8 ? 0:this.currentLevelMusic.volume;
    return volume
  }

  start() {
    this.currentBossMusic.volume = 0;
    canvasOverlayContent.innerHTML = "";
    this.background = new Background({ color: "#453d4f" }, [
      imageIsloadet.backgroundOne,
      imageIsloadet.backgroundTwo,
      imageIsloadet.backgroundThree,
    ], this);
    this.status = status.running;
    this.timer.pause = false;
    this.timer.start();
    this.tileset.generateLevel(this);
    this.createDemageboxes();
    this.player = this.objectsOfType.Player[0];
    this.originPlayerSize = [... this.player.size];
    pullIngameGui();
    this.playBackgroundMusic();
    this.game.committedValueToGame();
  }

  pause(modus = 0) {
    soundIsloadet.tone07.volume = 1 * this.globalVolume;
    soundIsloadet.tone07.play();
    this.currentAmbient.pause();
    this.currentLevelMusic.pause();
    this.currentBossMusic.pause();
    ctx.fillStyle = "rgba(28, 13, 8, 0.8)";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    drawMenuBookBackground();
    pullPauseMenu(modus);
    this.status = status.pause;
    this.timer.getInPause();
    this.savedGlobalVolume = this.globalVolume;
    this.globalVolume = 0;
  }

  gameOver() {
    this.savedGlobalVolume = this.globalVolume;
    this.timer.getInPause();
    this.currentAmbient.pause();
    this.currentLevelMusic.pause();
    ctx.fillStyle = "rgba(28, 13, 8, 0.8)";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    drawMenuBookBackground();
    pullPauseMenu();
  }

  resume() {
    soundIsloadet.tone09.volume = 1 * this.globalVolume;
    soundIsloadet.tone09.play();
    this.globalVolume = this.savedGlobalVolume;
    this.playBackgroundMusic();
    canvasOverlayContent.innerHTML = "";
    this.status = status.running;
    this.timer.pause = false;
    this.timer.start();
    pullIngameGui();
    checkForVolume();
  }

  resetLevel() {  
    this.status = status.pause;
    this.timer.getInPause();
    this.cleanUpLevel();
    this.rebuildLevel();
  }

  resetGame() {  
    this.status = status.pause;
    this.timer.getInPause();
    this.cleanUpLevel();
    this.rebuildLevel();
  }

  cleanUpLevel(){
    this.playerLives = this.player.lives;
    this.bossAlreadySeen = false;
    this.savedGlobalVolume = this.globalVolume;
    this.demageBoxes = null;
    this.screenshakeToggle = false;
    this.objectsOfType = null;
    this.player = null;
    this.objects =  null;
    this.minionCounter = 0;
  }

  rebuildLevel(){
    this.background = null;
    this.background = new Background({ color: "#453d4f" }, [
      imageIsloadet.backgroundOne,
      imageIsloadet.backgroundTwo,
      imageIsloadet.backgroundThree,
    ], this);
    this.currentBossMusic.volume = 0;
    this.currentBossMusic.currentTime = 0;
    this.globalVolume = this.savedGlobalVolume;
    canvasOverlayContent.innerHTML = "";
    this.tileset.generateLevel(this);
    this.createDemageboxes();
    this.player = this.objectsOfType.Player[0];
    this.player.lives = this.playerLives -1;
    this.status = status.running;
    this.bossAlreadySeen = false;
    this.timer.pause = false;
    this.timer.start();
    this.playBackgroundMusic();
    pullIngameGui();
    checkForVolume();
  }
}
