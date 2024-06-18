

import { renderMainMenu, renderControllPanel } from "./template.js";
import { canvasOverlay, canvasOverlayContent} from "./assets.js";
export let currentGame = null;
export let currentLevelOne = null;


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
        }
    })
}

function pullControllPanel(){
    canvasOverlayContent.innerHTML = renderControllPanel();
}
