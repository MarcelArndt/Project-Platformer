import { pullIngameGui, globalVolume, saveInLocalStorage, pullPauseMenu, checkForVolume, checkVolumeButtons, pullEndMenuScreen, drawMenuBookBackground, pullGameReady} from "./menuScript.js";
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
          case "restartButton": this.resetLevel();  this.resetMusicManger(); break;
          case "startGame": this.start(); break;
        }
      }
    
      keyFunction(e) {
        switch (e.key) {
          case "p":  
          if (this.level.status == status.ready) {
            this.start();
          } else if (this.level.status == status.running) {
            this.pause();
          } else if (this.level.status == status.pause) {
            this.resume();
          }; break;
          case "r": if(this.level.status == status.running){
            this.resetLevel(); 
            this.resetMusicManger();
          }; break;
          case "?":  this.level.showDebug = this.level.showDebug == false ? true:false; break;
          case `*`:  this.level.levelIsWon = true; break;
          case " " : case "w" : case "ArrowUp" :  event.preventDefault(); event.stopPropagation(); break;
        }
      }

      pause(modus = 0) {
        soundIsloadet.tone07.volume = 1 * this.level.globalVolume;
        soundIsloadet.tone07.play();
        ctx.fillStyle = "rgba(28, 13, 8, 0.8)";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        drawMenuBookBackground();
        pullPauseMenu(modus);
        this.level.status = status.pause;
        this.level.timer.getInPause();
        this.level.savedGlobalVolume = this.level.globalVolume;
        this.level.globalVolume = 0;
        this.level.musicManager.pause();
      }

      resume(){
        soundIsloadet.tone09.volume = 1 * this.level.globalVolume;
        soundIsloadet.tone09.play();
        this.level.globalVolume = this.level.savedGlobalVolume;
        canvasOverlayContent.innerHTML = "";
        this.level.status = status.running;
        this.level.timer.pause = false;
        this.level.timer.start();
        pullIngameGui();
        checkForVolume();
        this.level.musicManager.resume();
      }
    
      start() {
        this.level.currentBossMusic.volume = 0;
        canvasOverlayContent.innerHTML = "";
        this.level.background = new Background({ color: "#453d4f" }, [
          imageIsloadet.backgroundOne,
          imageIsloadet.backgroundTwo,
          imageIsloadet.backgroundThree,
        ], this.level);

        this.level.tileset.generateLevel(this.level);
        this.level.player = this.level.objectsOfType.Player[0];
        this.level.originPlayerLives = this.level.player.maxHealth;
        this.level.originPlayerSize = [... this.level.player.size];
        
        pullIngameGui();

        this.level.game.committedValueToGame();
        this.resetMusicManger();

        this.level.status = status.running;
        this.level.timer.pause = false;
        this.level.timer.start();

        checkVolumeButtons()
      }

      resetLevel() {  
        this.level.status = status.pause;
        this.level.timer.getInPause();
        this.cleanUpLevel();
        this.rebuildLevel();
      }

      endGame(){
        soundIsloadet.win.volume = 1 * this.level.globalVolume;
        soundIsloadet.win.play();
        ctx.fillStyle = "rgba(28, 13, 8, 0.8)";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        drawMenuBookBackground();
        pullEndMenuScreen(this.level.player.score, this.level.playerIsStillAlive);
        this.level.status = status.pause;
        this.level.timer.getInPause();
        this.level.savedGlobalVolume = this.level.globalVolume;
        this.level.globalVolume = 0;
        this.level.musicManager.stopAll();
        this.level.musicManager.play(soundIsloadet.bgm_outro);
        this.saveStats();
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
        this.level.player = this.level.objectsOfType.Player[0];
        this.level.player.lives = this.level.playerLives -1;
        this.level.status = status.running;
        this.level.bossAlreadySeen = false;
        this.level.timer.pause = false;
        this.level.timer.start();
        pullIngameGui();
        checkForVolume();
      }

    resetMusicManger(){
      this.level.musicManager.stopAll();
      this.level.musicManager.currentPlaylist = [];
      this.level.musicManager.play(soundIsloadet.musicPixelDayDream, false);
      this.level.musicManager.play(this.level.currentAmbient, true);
    }

    resetGame(){
      this.level.levelIsWon = false;
      this.level.Gamelose = false;
      this.resetLife();
      this.resetScore();
      this.resetLevel();
      this.level.status = status.pause;
      this.level.timer.getInPause();
      this.level.musicManager.stop();
      pullGameReady();
      checkVolumeButtons();
    }

    resetLife() {
      this.level.player.lives = this.level.originPlayerLives + 1;
    }

    resetScore(){
      this.level.player.score = 0;
    }

    saveStats(){
      saveInLocalStorage({
        firstTimePlaying: false,
        globalVolume: this.level.savedGlobalVolume,
        newScore: this.level.player.score,
      });
    }

}