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

