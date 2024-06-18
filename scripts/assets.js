import { ctx, clearCanvas, canvasScalingFactor } from "./canvas.js";
import { imageIsToLoading, soundsIsToLoading } from "./datasetForLoading.js";
import { checkCurrentStatus } from "./loading-screen.js";
export let canvasOverlay = document.getElementById("canvasOverlay");
export let canvasOverlayContent = document.getElementById("canvasOverlayContent");


/**
 *  Key = Key of imageIsToLoading
 *  Value = current Image
 */
export let imageIsloadet = {};
export let soundIsloadet = {};

// Object.keys(imageIsToLoading)[i] == Name from Key
// imageIsToLoading[Object.keys(imageIsToLoading)[i]] => zurgriff auf die Keys
export async function loadAllAssests() {
  await loadAllImages();
  await loadAllSounds();
}

async function loadAllImages(){
  for (let i = 0; i < Object.keys(imageIsToLoading).length; i++) {
    let imagePath = imageIsToLoading[Object.keys(imageIsToLoading)[i]];
    try {
      let currentImage = await loadingNewImage(imagePath);
      imageIsloadet[Object.keys(imageIsToLoading)[i]] = currentImage;
      checkCurrentStatus();
    } catch (e) {
    }
  }
}

async function loadAllSounds(){
  for (let i = 0; i < Object.keys(soundsIsToLoading).length; i++) {
    let soundPath = soundsIsToLoading[Object.keys(soundsIsToLoading)[i]];
    try {
      let currentSound = await loadingNewSound(soundPath);
      soundIsloadet[Object.keys(soundsIsToLoading)[i]] = currentSound;
      checkCurrentStatus();
    } catch (e) {
    }
  }
}

let loadingNewImage = (receivingImgPath) => {
  return new Promise((resolve, reject) => {
    let newImg = new Image();
    newImg.src = receivingImgPath;
    newImg.onload = () => {
      resolve(newImg);
    };
    newImg.onerror = (e) => {
      reject(e);
    };
  });
};

let loadingNewSound = (receivingSoundPath) => {
  return new Promise((resolve, reject) => {
    let newSound = new Audio();
    newSound.src = receivingSoundPath;
    newSound.addEventListener("canplaythrough", () => {
      resolve(newSound);
    }, true);
    newSound.onerror = (e) => {
      reject(e);
    };
  });
};

function checkForReady() {
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

  ctx.font = "18px PixelifySans"
  ctx.fillText(`Game is loading - ${percentageLoadet}%`, (screenWidth - maxlenght) / 2, ((screenHeight - maxheight) / 2) - 8)

  ctx.fillStyle = "#d8ad56"; 
  ctx.fillRect( (screenWidth - maxlenght) / 2, (screenHeight - maxheight) / 2, (maxlenght / 100) * percentageLoadet, maxheight);
}


function checkForLoadings() {
  let menuImage = null;
  fillLoadingBar();
  if (percentageLoadet == 100) {
    menuImage = imageIsloadet.backgroundMenuTwo;
    ctx.drawImage(menuImage, 0, 0);
  }
}

