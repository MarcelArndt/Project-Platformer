

import { renderMainMenu, renderHighScorePanel, renderControllPanel, renderImpressum , renderIngameGui, renderPauseMenu, renderGameReady, renderQuickTip, renderEndMenu} from "./template.js";
import { canvasOverlay, canvasOverlayContent} from "./assets.js";
import { soundIsloadet, imageIsloadet} from "./assets.js";
import { ctx } from "./canvas.js";
export let currentGame = null;
export let currentLevelOne = null;
export let globalVolume = 0.6;
export let savedGlobalVolume = globalVolume
export let sidePanel = ""

let objectInLocalStorage = {
    globalVolume: globalVolume,
    firstTimePlaying: true,
    score: [0,0,0,0,0,0,0,0,0,0],
};


export function InitMainMenu(myGame, levelOne){
    currentGame = myGame;
    currentLevelOne = levelOne;
    canvasOverlayContent.innerHTML = renderMainMenu();
    menuInit();
}

export function menuInit(){
    document.addEventListener("click", (e) => {
        const clickedDiv = e.target;
        const attribute = clickedDiv.getAttribute("value");
        switch(attribute){
            case "restartGame": currentGame.restartGame(); checkForVolume(""); break;
            case "start": currentGame.startLevel(); break;
            case "controls": pullControllPanel(); break;
            case "highscore": pullHighscorePanel(); break;
            case "impressum": pullControllImpressum(); break;
            case "resume" : currentGame.resume(); break;
            case "volumnePlus": checkForVolume("plus"); break;
            case "volumneMinus": checkForVolume("minus"); break;
            case "volumneSelf": savedGlobalVolume = globalVolume; globalVolume = 0; toggelAttributeValue("volumneSelf", "volumneSelfDisable",  [], [], "./img/volumne-mute.png"); checkForVolume(""); break;
            case "volumneSelfDisable": if(globalVolume <= 0.2){globalVolume = 0.6;} else {globalVolume = savedGlobalVolume;} toggelAttributeValue("volumneSelfDisable", "volumneSelf",  [], [], "./img/volumne-full.png"); checkForVolume(""); break;
        }
    });
    sidePanel = document.getElementById("renderSidePanel");
}

export function pullPauseMenu(modus = 0){
    canvasOverlayContent.innerHTML = renderPauseMenu();
    if(modus == 1){
        sidePanel = document.getElementById("renderSidePanel");
        sidePanel.innerHTML = renderControllPanel();
    }
}

export function pullGameReady(){
    let quciktipPanel = null
    let randomNumber = Math.floor(Math.random()* 3) 
    playSound("success09");
    canvasOverlayContent.innerHTML =  renderGameReady();
    quciktipPanel = document.getElementById("quciktip");
    quciktipPanel.innerHTML = renderQuickTip(randomNumber);

}

function pullControllPanel(){
    playSound("success09");
    sidePanel = document.getElementById("renderSidePanel");
    sidePanel.innerHTML = renderControllPanel();
}

function pullHighscorePanel(){
    playSound("success09");
    sidePanel = document.getElementById("renderSidePanel");
    sidePanel.innerHTML = renderHighScorePanel(objectInLocalStorage);
}

function pullControllImpressum(){
    playSound("success09");
    sidePanel = document.getElementById("renderSidePanel");
    sidePanel.innerHTML = renderImpressum();
}

export function pullIngameGui(){
    playSound("success09");
    canvasOverlayContent.innerHTML = renderIngameGui();
}

export function pullEndMenuScreen(score, isWon = true){
    let isWonText = isWon == true? "You Won": "You Lose";
    canvasOverlayContent.innerHTML = renderEndMenu(score, isWonText);
}

export function checkForVolume(methode = ""){
    if( methode == "plus" && globalVolume < 0.8){
        globalVolume += 0.20;
    } else if(methode == "plus" && globalVolume >= 0.8){
        globalVolume = 0.99; 
    } else if(methode == "minus" && globalVolume > 0.2){
        globalVolume -= 0.20;
    }

    if(methode == "plus" && globalVolume <= 0.2){
        globalVolume = 0.3;
    } 
     checkVolumeButtons();
     saveInLocalStorage({globalVolume: globalVolume,})
}

//  toggelAttributeValue (current, SwitchTo, setclass, removeClass, src)
export function checkVolumeButtons(){
    if( globalVolume >= 0.9){
        globalVolume = 1;
        toggelAttributeValue("volumnePlus", "volumnePlusDisable", ["opacity"], ["hover"])
        toggelAttributeValue("volumneMinusDisable", "volumneMinus", ["hover"], ["opacity"])
    } else if(globalVolume <= 0.20 || globalVolume == 0){
        globalVolume = 0;
        toggelAttributeValue("volumneMinus", "volumneMinusDisable",  ["opacity"], ["hover"])
        toggelAttributeValue("volumneSelf", "volumneSelfDisable",  [], [], "./img/volumne-mute.png")
        toggelAttributeValue("volumnePlusDisable", "volumnePlus", ["hover"], ["opacity"])
    }
    if( globalVolume <= 0.9 && globalVolume >= 0.20){
        toggelAttributeValue("volumneSelfDisable", "volumneSelf",  [], [], "./img/volumne-full.png")
        toggelAttributeValue("volumneMinusDisable", "volumneMinus", ["hover"], ["opacity"]);
        toggelAttributeValue("volumnePlusDisable", "volumnePlus", ["hover"], ["opacity"]);
    }
   
}

export function playSound(sound){
        soundIsloadet[sound].volume = 1 * globalVolume;
        soundIsloadet[sound].play();
}


export function drawMenuBookBackground(){
    ctx.drawImage(imageIsloadet.menuBackgroundBook, 0, 0, imageIsloadet.menuBackgroundBook.width, imageIsloadet.menuBackgroundBook.height, 0 , 0, imageIsloadet.menuBackgroundBook.width / 180 * 100 * 1.45, imageIsloadet.menuBackgroundBook.height / 180 * 100 * 1.45)
}

function toggelAttributeValue(attribute, switchTo, setClass = [], removeClass = [], newSrc = ""){
    let element = document.querySelectorAll([`[value="${attribute}"]`]);
    element.forEach((obj) => {
        obj.setAttribute("value", switchTo);
        if(setClass.length > 0){
            setClass.forEach((className) => {
                obj.classList.add(className);
            });
        }
        if(removeClass.length > 0){
            removeClass.forEach((classNameRemove) => {
                obj.classList.remove(classNameRemove);
            });
        }
        if(newSrc.length > 0){
            obj.src = newSrc;
        }
    });
}

function generateDataObject(ValueDataSet = {}){
    let object = {
        firstTimePlaying: ValueDataSet.firstTimePlaying ?? objectInLocalStorage.firstTimePlaying,
        globalVolume: ValueDataSet.globalVolume ?? objectInLocalStorage.globalVolume,
        score: ValueDataSet.score ?? generateHighstore(ValueDataSet),
    }
    return object;
}


function generateHighstore(ValueDataSet){
    let currentHighScore = objectInLocalStorage.score;
    if( ValueDataSet.newScore > 0 && ValueDataSet.newScore != undefined && ValueDataSet.newScore != null){
        for (let i = 0; i < currentHighScore.length; i++){
          if( ValueDataSet.newScore > currentHighScore[i]){
            currentHighScore.splice([i], 0, ValueDataSet.newScore);
            currentHighScore.pop();
            break;
          }
        }
    }
    return currentHighScore;
 }

export function saveInLocalStorage(ValueDataSet){
    let objectForSaving = generateDataObject(ValueDataSet);
    objectForSaving = JSON.stringify(objectForSaving);
    localStorage.setItem("GameSave", objectForSaving);
}

export function loadFromLocalStorage(){
    let object  = localStorage.getItem("GameSave");
    if( object != undefined && object != null){
        object = JSON.parse(object);
        objectInLocalStorage = {
            globalVolume: object.globalVolume,
            firstTimePlaying: object.firstTimePlaying,
            score: object.score,
        };
        globalVolume = objectInLocalStorage.globalVolume;
        checkVolumeButtons();
    } else {
        setNewSaveState();
    }
}

function setNewSaveState(){
    saveInLocalStorage({
        firstTimePlaying: true,
        globalVolume: 0.6,
        score: [839,771,692,0,0,0,0,0,0,0],
      });
      loadFromLocalStorage();
}


