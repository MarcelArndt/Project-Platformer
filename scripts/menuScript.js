

import { renderMainMenu, renderControllPanel, renderImpressum , renderIngameGui, renderPauseMenu} from "./template.js";
import { canvasOverlay, canvasOverlayContent} from "./assets.js";
export let currentGame = null;
export let currentLevelOne = null;
export let globalVolume = 0.6;
export let savedGlobalVolume = globalVolume
let sidePanel = ""


export function InitMainMenu(myGame, levelOne){
    currentGame = myGame;
    currentLevelOne = levelOne;
    canvasOverlayContent.innerHTML = renderMainMenu();
    menuInit();
}

export function menuInit(){
    document.addEventListener("click", (e) => {
        const clickedDiv = e.target;
        const atribute = clickedDiv.getAttribute("value");
        switch(atribute){
            case "start": currentGame.startLevel(); break;
            case "controls": pullControllPanel(); break;
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

export function pullPauseMenu(){
    canvasOverlayContent.innerHTML = renderPauseMenu();
}


function pullControllPanel(){
    sidePanel = document.getElementById("renderSidePanel");
    sidePanel.innerHTML = renderControllPanel();
}
function pullControllImpressum(){
    sidePanel = document.getElementById("renderSidePanel");
    sidePanel.innerHTML = renderImpressum();
}

export function pullIngameGui(){
    canvasOverlayContent.innerHTML = renderIngameGui();
}

export function checkForVolume(methode = ""){
    if( methode == "plus" && globalVolume < 0.8){
        console.log("here");
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
}
//  toggelAttributeValue (current, SwitchTo, setclass, removeClass, src)
function checkVolumeButtons(){
    if( globalVolume >= 0.9){
        globalVolume = 1;
        toggelAttributeValue("volumnePlus", "volumnePlusDisable", ["opacity"], ["hover"])
        toggelAttributeValue("volumneMinusDisable", "volumneMinus", ["hover"], ["opacity"])
    } else if(globalVolume <= 0.20){
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
    })
}
