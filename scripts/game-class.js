
import { percentageLoadet } from "./images.js";
import { ctx, clearCanvas, canvasScalingFactor } from "./canvas.js";
import { imageIsloadet } from "./images.js";

export let canvasOverlay = document.getElementById("canvasOverlay");
export let canvasOverlayContent = document.getElementById("canvasOverlayContent");

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

    checkForLoadings(){
        let menuImage = null
        this.fillLoadingBar();
        if (percentageLoadet == 100){
            menuImage = imageIsloadet.backgroundMenu
            ctx.drawImage(menuImage, 0, 0);
            this.startLevel();
        }
    }

    startLevel(){
       if (this.levelList.length === 0) return "No Level in levelList";
       canvasOverlayContent.innerHTML = "Press P to Start Game"
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


    fillLoadingBar(){
        clearCanvas();
        let screenWidth = (canvas.width / 145 * 100);
        let screenHeight = (canvas.height / 145 * 100)
        let maxlenght = (canvas.width / (canvasScalingFactor * 100) * 100) * 0.8;
        let maxheight = (canvas.height / (canvasScalingFactor * 100) * 100) * 0.05
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect((screenWidth - maxlenght) / 2 , (screenHeight - maxheight) / 2, maxlenght , maxheight);
        ctx.fillStyle = "skyblue";
        ctx.fillRect((screenWidth - maxlenght) / 2 , (screenHeight - maxheight) / 2, maxlenght / 100 * percentageLoadet, maxheight);
    }
}