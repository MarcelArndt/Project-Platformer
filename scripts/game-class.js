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
    canvasOverlayContent.innerHTML = "Press P to Start Game";
    this.currentLevel.drawObjects();
    this.currentLevel.addControll();
  }

  switchToNextLevel() {
    this.currentLevelIndex++;
    if (this.currentLevelIndex > this.levelList.length) {
      console.log("won game");
    }
    this.currentLevel.drawObjects();
    this.currentLevel.start();
  }

  resume(){
    this.currentLevel.resume();
  }

}
