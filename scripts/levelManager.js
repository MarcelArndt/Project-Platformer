import { pullIngameGui, globalVolume, pullPauseMenu, checkForVolume, endMenuScreen, drawMenuBookBackground} from "./menuScript.js";
import { ctx, canvas} from "./canvas.js";
import { imageIsloadet, canvasOverlayContent, soundIsloadet} from "./assets.js";
import { Background } from "./background-class.js";

let status = {
    ready: 1,
    pause: 2,
    running: 3,
    freeze: 4,
  };
export class LevelManager{
    constructor (level){
        this.level = level;
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
          if (this.level.status == status.ready) {
            this.start();
          } else if (this.level.status == status.running) {
            this.pause();
          } else if (this.level.status == status.pause) {
            this.resume();
          }
        } else if (e.key == "r" && this.level.status == status.running) {
          this.resetLevel();
        }
        else if (e.key == "?") { 
          this.showDebug = this.level.showDebug == false ? true:false;
        }
      }

      pause(modus = 0) {
        soundIsloadet.tone07.volume = 1 * this.level.globalVolume;
        soundIsloadet.tone07.play();
        this.level.currentAmbient.pause();
        this.level.currentLevelMusic.pause();
        this.level.currentBossMusic.pause();
        ctx.fillStyle = "rgba(28, 13, 8, 0.8)";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        drawMenuBookBackground();
        pullPauseMenu(modus);
        this.level.status = status.pause;
        this.level.timer.getInPause();
        this.level.savedGlobalVolume = this.level.globalVolume;
        this.level.globalVolume = 0;
      }

      resume(){
        soundIsloadet.tone09.volume = 1 * this.level.globalVolume;
        soundIsloadet.tone09.play();
        this.level.globalVolume = this.level.savedGlobalVolume;
        this.level.playBackgroundMusic();
        canvasOverlayContent.innerHTML = "";
        this.level.status = status.running;
        this.level.timer.pause = false;
        this.level.timer.start();
        pullIngameGui();
        checkForVolume();
      }
    
      start() {
        this.level.currentBossMusic.volume = 0;
        canvasOverlayContent.innerHTML = "";
        this.level.background = new Background({ color: "#453d4f" }, [
          imageIsloadet.backgroundOne,
          imageIsloadet.backgroundTwo,
          imageIsloadet.backgroundThree,
        ], this.level);
        this.level.status = status.running;
        this.level.timer.pause = false;
        this.level.timer.start();
        this.level.tileset.generateLevel(this.level);
        this.level.createDemageboxes();
        this.level.player = this.level.objectsOfType.Player[0];
        this.level.originPlayerSize = [... this.level.player.size];
        pullIngameGui();
        this.level.playBackgroundMusic();
        this.level.game.committedValueToGame();
      }

      resetLevel() {  
        this.level.status = status.pause;
        this.level.timer.getInPause();
        this.cleanUpLevel();
        this.rebuildLevel();
      }
    
      cleanUpLevel(){
        this.level.playerLives = this.level.player.lives;
        this.level.bossAlreadySeen = false;
        this.level.savedGlobalVolume = this.level.globalVolume;
        this.level.demageBoxes = null;
        this.level.screenshakeToggle = false;
        this.level.objectsOfType = null;
        this.level.player = null;
        this.level.objects =  null;
        this.level.minionCounter = 0;
      }
    
      rebuildLevel(){
        this.level.background = null;
        this.level.background = new Background({ color: "#453d4f" }, [
          imageIsloadet.backgroundOne,
          imageIsloadet.backgroundTwo,
          imageIsloadet.backgroundThree,
        ], this.level);
        this.level.currentBossMusic.volume = 0;
        this.level.currentBossMusic.currentTime = 0;
        this.level.globalVolume = this.level.savedGlobalVolume;
        canvasOverlayContent.innerHTML = "";
        this.level.tileset.generateLevel(this.level);
        this.level.createDemageboxes();
        this.level.player = this.level.objectsOfType.Player[0];
        this.level.player.lives = this.level.playerLives -1;
        this.level.status = status.running;
        this.level.bossAlreadySeen = false;
        this.level.timer.pause = false;
        this.level.timer.start();
        this.level.playBackgroundMusic();
        pullIngameGui();
        checkForVolume();
      }
}