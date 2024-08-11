import { imageIsToLoading, soundsIsToLoading } from "./datasetForLoading.js";
import { checkCurrentStatus } from "./loading-screen.js";
export let canvasOverlay = document.getElementById("canvasOverlay");
export let canvasOverlayContent = document.getElementById("canvasOverlayContent");
export let imageIsloadet = {};
export let soundIsloadet = {};

/**
 * Main function to load all resources into this game
 * After loading any resources to import imageIsloadet or/and soundIsloadet is necessary to gain access to these files.
 * All already loadet Images can be found at this "imageIsloadet" Object. -> imageIsloadet.charatcer, imageIsloadet.background or imageIsloadet.tileset for example
 * All already loadet Images can be found at this "soundIsloadet" Object. -> soundIsloadet.music for example
 */
export async function loadAllAssests() {
  await loadAllImages();
  await loadAllSounds();
}

/**
 * checks the list of all necessary Images and start to load each of them
 */
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

/**
 * checks the list of all necessary Sound and start to load each of them
 */
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

/**
 * @param {string} receivingImgPath use this path to load and create a new ImageObject from it
 */
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

/**
 * @param {string} receivingImgPath use this path to load and create a new MusicObject from it
 */
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

