import { ctx, clearCanvas, canvasScalingFactor } from "./canvas.js";
import { imageIsToLoading, soundsIsToLoading,} from "./datasetForLoading.js";
import { soundIsloadet, imageIsloadet } from "./assets.js";
export let percentageLoadet =  0;

export function checkCurrentStatus(){
    checkPercentageLoadet();
    checkForLoadingFinish();
}

/**
 * compare the list of already loading object with the complete list and will calculate the current percentage of it
 */
function checkPercentageLoadet() {
    let MaxValue = (Object.keys(imageIsToLoading).length) + (Object.keys(soundsIsToLoading).length);
    let currentValue = (Object.keys(imageIsloadet).length) + (Object.keys(soundIsloadet).length);
    if (currentValue > 0) {
      percentageLoadet = Math.floor((currentValue / MaxValue) * 100);
    }
}

/**
 * draw the bar inside the canvas
 */
  function fillLoadingBar() {
    clearCanvas();
    let screenWidth = (canvas.width / 180) * 100;
    let screenHeight = (canvas.height / 180) * 100 ;
    let maxlenght = (canvas.width / (canvasScalingFactor * 100)) * 100 * 0.8;
    let maxheight = (canvas.height / (canvasScalingFactor * 100)) * 100 * 0.01;
    drawInLoadingBar(screenWidth,screenHeight,maxlenght,maxheight);
  }

/**
 * animate and draw the current state of the loading-bar
 */
  function drawInLoadingBar(screenWidth,screenHeight,maxlenght,maxheight){
    ctx.fillStyle = "#562637";
    ctx.fillRect( (screenWidth - maxlenght) / 2, (screenHeight - maxheight) / 2, maxlenght, maxheight); 
    ctx.fillStyle = "#fff";
    ctx.font = "14px PixelifySans"
    ctx.fillText(`Game is loading - ${percentageLoadet}%`, (screenWidth - maxlenght) / 2, ((screenHeight - maxheight) / 2) - 8)
  
    ctx.fillStyle = "#FAC08A"; 
    ctx.fillRect( (screenWidth - maxlenght) / 2, (screenHeight - maxheight) / 2, (maxlenght / 100) * percentageLoadet, maxheight);
  }

/**
 * checks for finishing loading and draw the book_menu 
 */
  function checkForLoadingFinish() {
    let menuImage = null;
    fillLoadingBar();
    if (percentageLoadet == 100) {
      menuImage = imageIsloadet.menuBackgroundBook;
      ctx.drawImage(menuImage, 0, 0, menuImage.width, menuImage.height, 0 , 0, menuImage.width / 180 * 100 * 1.45, menuImage.height / 180 * 100 * 1.45);
    }
  }