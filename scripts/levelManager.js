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

    /**
    * adding controlls to boundet variable
    */
    addControll() {
        window.addEventListener("keydown", this.keyFuncRef);
        window.addEventListener("click", this.mouseFuncRef);
      }
    
    /**
    * remove controlls from boundet variable
    */
    removeControll() {
      window.removeEventListener("keydown", this.keyFuncRef);
      window.removeEventListener("click", this.mouseFuncRef);
     }

    /**
    * checks if Player is clicking at the button at the top or
    */
    mouseFunction(e){
      const clickedDiv = e.target;
      const atribute = clickedDiv.getAttribute("value");
      switch(atribute){
        case "openKeyboard": this.pause(1); break;
        case "restartButton": this.resetLevel();  this.resetMusicManger(); break;
        case "startGame": this.start(); break;
      }
    }
    
    /**
    * checks and switch the state of a Game/level, prevent some propagation and enable the debug menu as well.
    */
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
        case " " : case "w" : case "ArrowUp" :  e.preventDefault(); e.stopPropagation(); break;
      }
    }

      /**
      * for enter the pause function and switch off all necessary data inside this level.
      */
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

      /**
      * for leaving the pause function and switch back all necessary data inside this level.
      */
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
    
      /**
      * loads all necessary data inside this level and start this level for the frist time. 
      */
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

      /**
      * Core function for reset a level.
      */
      resetLevel() {  
        this.level.status = status.pause;
        this.level.timer.getInPause();
        this.cleanUpLevel();
        this.rebuildLevel();
      }

      /**
      * if game is over it will enable the endscreen Screen
      */
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

      /**
      * empty all necessary Data and switch it back to default to enable a restart.
      */
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
    
      /**
      * after cleaning up the level. load and rebuild the level from scratch.
      */
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

    /**
    * stop all music and reset the music at this current level.
    */
    resetMusicManger(){
      this.level.musicManager.stopAll();
      this.level.musicManager.currentPlaylist = [];
      this.level.musicManager.play(soundIsloadet.musicPixelDayDream, false);
      this.level.musicManager.play(this.level.currentAmbient, true);
    }

    /**
    * to reset a level
    */
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

    /**
    * to reset a game with reseting all lives 
    */
    resetLife() {
      this.level.player.lives = this.level.originPlayerLives + 1;
    }

    /**
    * to reset a game with reseting the player score value
    */
    resetScore(){
      this.level.player.score = 0;
    }

 /**
 * save the all current Values into the LocalStorage. !Import function from menuScript.js!
 */
    saveStats(){
      saveInLocalStorage({
        firstTimePlaying: false,
        globalVolume: this.level.savedGlobalVolume,
        newScore: this.level.player.score,
      });
    }

}