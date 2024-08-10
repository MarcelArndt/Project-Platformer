import { pullGameReady, playSound, pullEndMenuScreen, drawMenuBookBackground} from "./menuScript.js";

export class Game {
  constructor(levelList) {
    this.levelList = [];
    this.getAllLevel(levelList);
    this.currentLevelIndex = 0;
    this.levelAlreadySwitched = false;
    this.playerLives = 5;
    this.playerHealth = 55;
    this.playerMaxHealth = this.playerHealth;
    this.playerScore = 0;
  }

/**
* get the current number for the current level. 
*/
  get currentLevel() {
    return this.levelList[this.currentLevelIndex];
  }

/**
* push all level into the Game
*/
  getAllLevel(levelList) {
    for (const level of levelList) {
      this.levelList.push(level);
      level.game = this;
      level.index = this.levelList.length;
    }
  }

/**
* checks for the lengh of the list of all levels and will start with level one.
*/
  startLevel(){
    if (this.levelList.length === 0) return "No Level in levelList";
    playSound("success16");
    pullGameReady();
    this.currentLevel.levelManager.addControll();
  }

/**
* will start the resetGame() function of the current Level.
*/
  restartGame(){
    playSound("success16");
    this.currentLevel.levelManager.resetGame();
  }

/**
* will send current Values about the Player to the current level.
*/
  committedValueToGame(){
    this.playerHealth = this.currentLevel.player.health;
    this.playerLives = this.currentLevel.player.lives;
    this.playerScore = this.currentLevel.player.score;
    this.playerMaxHealth = this.currentLevel.player.maxHealth;
  }

/**
* will send current Values about the Player from current level to the GlobalGame.
*/
  committedValueToLevel(){
    this.currentLevel.player.health = this.playerHealth;
    this.currentLevel.player.lives = this.playerLives;
    this.currentLevel.player.score = this.playerScore;
    this.currentLevel.player.maxHealth = this.playerMaxHealth;
  }

/**
* to switch between any level. Level 1 to Level 2 for example
*/
  switchToNextLevel() {
    if(!this.levelAlreadySwitched){
      this.levelAlreadySwitched = true;
      this.currentLevelIndex ++;
      this.currentLevel.levelManager.start();
      this.currentLevel.levelManager.addControll();
      this.committedValueToLevel();
    }
  }

/**
* to start the unpause funtion insite the level and restart the Timer().
*/
  resume(){
    this.currentLevel.levelManager.resume();
  }
}
