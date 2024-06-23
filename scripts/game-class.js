import { pullGameReady, playSound} from "./menuScript.js";

export class Game {
  constructor(levelList) {
    this.levelList = [];
    this.getAllLevel(levelList);
    this.currentLevelIndex = 0;
    this.levelAlreadySwitched = false;
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

  switchToNextLevel() {
    if(!this.levelAlreadySwitched){
      this.levelAlreadySwitched = true;
      this.currentLevelIndex ++;
      console.log(this.currentLevelIndex)
      this.currentLevel.start();
      this.currentLevel.addControll();
    }
  }

  resume(){
    this.currentLevel.resume();
  }

}
