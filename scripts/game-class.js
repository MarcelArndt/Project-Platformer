import { pullGameReady, playSound} from "./menuScript.js";

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

  
  get currentLevel() {
    return this.levelList[this.currentLevelIndex];
  }

  getAllLevel(levelList) {
    for (const level of levelList) {
      this.levelList.push(level);
      level.game = this;
      level.index = this.levelList.length;
    }
  }

  startLevel() {
    if (this.levelList.length === 0) return "No Level in levelList";
    playSound("success16");
    pullGameReady ();
    this.currentLevel.addControll();
  }

  committedValueToGame(){
    this.playerHealth = this.currentLevel.player.health;
    this.playerLives = this.currentLevel.player.lives;
    this.playerScore = this.currentLevel.player.score;
    this.playerMaxHealth = this.currentLevel.player.maxHealth;
  }

  committedValueToLevel(){
    this.currentLevel.player.health = this.playerHealth;
    this.currentLevel.player.lives = this.playerLives;
    this.currentLevel.player.score = this.playerScore;
    this.currentLevel.player.maxHealth = this.playerMaxHealth;
  }

  switchToNextLevel() {
    if(!this.levelAlreadySwitched){
      this.levelAlreadySwitched = true;
      this.currentLevelIndex ++;
      this.currentLevel.start();
      this.currentLevel.addControll();
      this.committedValueToLevel();
    }
  }

  resume(){
    this.currentLevel.resume();
  }

  endGame(){
    
  }

}
