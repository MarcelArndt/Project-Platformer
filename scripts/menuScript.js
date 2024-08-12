

import { renderMainMenu, renderHighScorePanel, renderControllPanel, renderImpressum , renderIngameGui, renderPauseMenu, renderGameReady, renderQuickTip, renderEndMenu} from "./template.js";
import { canvasOverlayContent} from "./assets.js";
import { soundIsloadet, imageIsloadet} from "./assets.js";
import { ctx} from "./canvas.js";
export let currentGame = null;
export let currentLevelOne = null;
export let globalVolume = 0.6;
export let savedGlobalVolume = globalVolume
export let sidePanel = ""
export let canvasMaxSize = [1240, 720];

let objectInLocalStorage = {
    globalVolume: globalVolume,
    firstTimePlaying: true,
    score: [0,0,0,0,0,0,0,0,0,0],
};

let currentHighscoreVector = [0,0];

/**
 * render the Menu for the first time.
 */
export function InitMainMenu(myGame, levelOne){
    currentGame = myGame;
    currentLevelOne = levelOne;
    canvasOverlayContent.innerHTML = renderMainMenu();
    menuInit();
}

/**
 * checks if The Player is clicking on a Button and execute the necessity function for it.
 */
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
            case "saveScore": saveNewHighscore();  pullHighscorePanel(); break;
            case "volumneSelf": savedGlobalVolume = globalVolume; globalVolume = 0; toggelAttributeValue("volumneSelf", "volumneSelfDisable",  [], [], "./img/volumne-mute.png"); checkForVolume(""); break;
            case "volumneSelfDisable": if(globalVolume <= 0.2){globalVolume = 0.6;} else {globalVolume = savedGlobalVolume;} toggelAttributeValue("volumneSelfDisable", "volumneSelf",  [], [], "./img/volumne-full.png"); checkForVolume(""); break;
        }
    });
    sidePanel = document.getElementById("renderSidePanel");
}

/**
 * will render Pause Screen from template.js
 */
export function pullPauseMenu(modus = 0){
    canvasOverlayContent.innerHTML = renderPauseMenu();
    if(modus == 1){
        sidePanel = document.getElementById("renderSidePanel");
        sidePanel.innerHTML = renderControllPanel();
    }
}

/**
 * will render Game is ready Screen from template.js
 */
export function pullGameReady(){
    let quciktipPanel = null
    let randomNumber = Math.floor(Math.random()* 3) 
    playSound("success09");
    canvasOverlayContent.innerHTML =  renderGameReady();
    quciktipPanel = document.getElementById("quciktip");
    quciktipPanel.innerHTML = renderQuickTip(randomNumber);

}

/**
 * will render Controll-Manual from template.js
 */
function pullControllPanel(){
    playSound("success09");
    sidePanel = document.getElementById("renderSidePanel");
    sidePanel.innerHTML = renderControllPanel();
}

/**
 * will render Highscore from template.js
 */
function pullHighscorePanel(){
    playSound("success09");
    sidePanel = document.getElementById("renderSidePanel");
    sidePanel.innerHTML = renderHighScorePanel(objectInLocalStorage);
}

/**
 * will render Impressum from template.js
 */
function pullControllImpressum(){
    playSound("success09");
    sidePanel = document.getElementById("renderSidePanel");
    sidePanel.innerHTML = renderImpressum();
}

/**
 * will render the Ingame GUI into the Game from Template-File
 */
export function pullIngameGui(){
    playSound("success09");
    canvasOverlayContent.innerHTML = renderIngameGui();
}

/**
 * checks the current Value and if possible set a new Value to change the Ingame-Sound-Volume.
 * Save currentChanges into the LocalStorage.
 */
export function pullEndMenuScreen(score, isWon = true){
    let isWonText = isWon == true? "You Won": "You Lose";
    const renderPromise = new Promise((resolve, reject) => {
        canvasOverlayContent.innerHTML = renderEndMenu(score, isWonText);
        resolve();
    });
    renderPromise.then(() => {
        checkForNewHighScore(score);
    }).catch(error => {
        console.error("Error id not found", error);
    });
}

/**
 * checks the current Value and if possible set a new Value to change the Ingame-Sound-Volume.
 * Save currentChanges into the LocalStorage.
 */
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

/**
 * Checks the current globalVolume and change the Style of any Button of the Controll-Menu at the top of the Game
 * toggelAttributeValue (currentAttribute, SwitchToAttribute, setclass, removeClass, changeSrc)
 */
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

/**
 * play the current Sound
 */
export function playSound(sound){
    if(soundIsloadet[sound] != undefined && soundIsloadet[sound] != null){
        soundIsloadet[sound].volume = 1 * globalVolume;
        soundIsloadet[sound].play();
    }
}

/**
 * a function to draw the Book Background Object inside the Game for the Menu.
 */
export function drawMenuBookBackground(){
    ctx.drawImage(imageIsloadet.menuBackgroundBook, 0, 0, imageIsloadet.menuBackgroundBook.width, imageIsloadet.menuBackgroundBook.height, 0 , 0, imageIsloadet.menuBackgroundBook.width / 180 * 100 * 1.45, imageIsloadet.menuBackgroundBook.height / 180 * 100 * 1.45)
}

/**
* A Help-Function to toggle/switch values from a Buttons .
* @param {string, string} attribute and switchTo change some attribute for Links and other further Help-Function
* @param {string, string} setClass and removeClass change some Class-Attribute for styling purpose. For example lock and unlock a Button.
* @param {string} newSrc change the source of an image. For example change the Icon of the MuteButton.
*/
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

/**
* All necessity Values stored inside a Object for prepare it to save it into the localStorage later.
*/
function generateDataObject(ValueDataSet = {}){
    let object = {
        firstTimePlaying: ValueDataSet.firstTimePlaying ?? objectInLocalStorage.firstTimePlaying,
        globalVolume: ValueDataSet.globalVolume ?? objectInLocalStorage.globalVolume,
        score: ValueDataSet.score ?? generateHighstore(ValueDataSet),
    }
    return object;
}


  /**
  * compare any score and checks if the current Score is higher than any Value inside the Highscore.
  */
function checkForNewHighScore(currentScore){
    let currentHighScore = objectInLocalStorage.score;
    let noHighscoreContent = document.getElementById("isNoNewHighScore");
    let HighscoreContent =  document.getElementById("HighscorePanel");
    if( currentScore >= 0 && currentScore != undefined && currentScore != null){
        for (let i = 0; i < currentHighScore.length; i++){
          if( currentScore > currentHighScore[i][0]){
            noHighscoreContent.classList.add("disableNewHighscore");
            HighscoreContent.classList.remove("disableNewHighscore");
            currentHighscoreVector = [i -1, currentScore];
            break;
          }
        }
    }
}

 /**
  * replace the current Highscore with new Values from Game.
 */
function saveNewHighscore(){
        let nameValue = document.getElementById("Scorename").value.length > 0 ? document.getElementById("Scorename").value : "unnamed Hero";
        objectInLocalStorage.score[currentHighscoreVector[0]] = [currentHighscoreVector[1], nameValue];
}

 /**
  * @param {ValueDataSet} - get from level the current Value of the Score and Name and generate a new Dataset for the new Highscore.
 */
function generateHighstore(ValueDataSet){
    let currentHighScore = objectInLocalStorage.score;
    let newHighScore = [[]];
    let name = "Unnamed Hero"
    if( ValueDataSet.newScore > 0 && ValueDataSet.newScore != undefined && ValueDataSet.newScore != null){
        for (let i = 0; i < currentHighScore.length; i++){
          if( ValueDataSet.newScore > currentHighScore[i][0]){
            newHighScore = [ValueDataSet.newScore, name]
            currentHighScore.splice([i], 0, newHighScore);
            currentHighScore.pop();
            break;
          }
        }
    }
    return currentHighScore;
 }

 /**
 * save the all current Values into the LocalStorage
 */
export function saveInLocalStorage(ValueDataSet){
    let objectForSaving = generateDataObject(ValueDataSet);
    objectForSaving = JSON.stringify(objectForSaving);
    localStorage.setItem("GameSave", objectForSaving);
}

/**
 * checks and load the current SaveFile from LocalStorage
 */
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

/**
 * if there is no save in LocalStorage it will set a new Dataset and load into the Game (not saving - only create a Dataset). 
 */
function setNewSaveState(){
    saveInLocalStorage({
        firstTimePlaying: true,
        globalVolume: 0.6,
        score: [[839, "Legendary Hero"],[771, "The Brave Hero"],[692, "Young Hero"],[0, "Unnamed Hero"],[0, "Unnamed Hero"],[0, "Unnamed Hero"],[0, "Unnamed Hero"],[0, "Unnamed Hero"],[0, "Unnamed Hero"],[0, "Unnamed Hero"]],
      });
      loadFromLocalStorage();
}