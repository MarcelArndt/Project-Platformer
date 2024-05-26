import { levelOne } from "./levels/level_one.js";
import { levelTwo } from "./levels/level_two.js";

export class Game {
    constructor(levelList){
        this.levelList = [];
        this.getAllLevel(levelList);
        this.currentLevelIndex = 0;
        this.levelAlreadySwitched = false;
    }
    get currentLevel(){
        return this.levelList[this.currentLevelIndex];
    }

    getAllLevel(levelList){
        for (const level of levelList){
            this.levelList.push(level);
            level.game = this;
            level.index = this.levelList.length;
        }
    }

    startLevel(){
       if (this.levelList.length === 0) return "No Level in levelList";
       this.currentLevel.drawObjects();
       this.currentLevel.addControll();
    }

    switchToNextLevel(){
        this.currentLevelIndex++;
        if( this.currentLevelIndex > this.levelList.length){
            console.log("won game")
        }
        this.currentLevel.drawObjects();
        this.currentLevel.start();
        this.startLevel();
    }
}