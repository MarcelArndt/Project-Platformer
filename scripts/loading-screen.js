import { ctx, clearCanvas, canvasScalingFactor } from "./canvas.js";
import { imageIsToLoading, soundsIsToLoading,} from "./datasetForLoading.js";
import { soundIsloadet, imageIsloadet } from "./assets.js";

export let percentageLoadet =  0;

export function checkCurrentStatus(){
    checkPercentageLoadet();
    checkForLoadingFinish();
}

function checkPercentageLoadet() {
    let MaxValue = (Object.keys(imageIsToLoading).length) + (Object.keys(soundsIsToLoading).length);
    let currentValue = (Object.keys(imageIsloadet).length) + (Object.keys(soundIsloadet).length);
    if (currentValue > 0) {
      percentageLoadet = Math.floor((currentValue / MaxValue) * 100);
    }
}

  function fillLoadingBar() {
    clearCanvas();
    let screenWidth = (canvas.width / 145) * 100;
    let screenHeight = (canvas.height / 145) * 100 ;
    let maxlenght = (canvas.width / (canvasScalingFactor * 100)) * 100 * 0.8;
    let maxheight = (canvas.height / (canvasScalingFactor * 100)) * 100 * 0.01;
    drawInLoadingBar(screenWidth,screenHeight,maxlenght,maxheight);
  }

  function drawInLoadingBar(screenWidth,screenHeight,maxlenght,maxheight){
    ctx.fillStyle = "#1B1316";
    ctx.fillRect(0, 0, screenWidth, screenHeight)
  
    ctx.fillStyle = "grey";
    ctx.fillRect( (screenWidth - maxlenght) / 2, (screenHeight - maxheight) / 2, maxlenght, maxheight); 
  
    ctx.font = "16px PixelifySans"
    ctx.fillText(`Game is loading - ${percentageLoadet}%`, (screenWidth - maxlenght) / 2, ((screenHeight - maxheight) / 2) - 8)
  
    ctx.fillStyle = "#d8ad56"; 
    ctx.fillRect( (screenWidth - maxlenght) / 2, (screenHeight - maxheight) / 2, (maxlenght / 100) * percentageLoadet, maxheight);
  }

  function checkForLoadingFinish() {
    let menuImage = null;
    fillLoadingBar();
    if (percentageLoadet == 100) {
      menuImage = imageIsloadet.menuBackgroundBook;
      ctx.drawImage(menuImage, 0, 0);
    }
  }