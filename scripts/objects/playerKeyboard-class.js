export class PlayerKeyboard {
    constructor(PlayerEnitiy){
        this.Player = PlayerEnitiy;
        this.alreadyGetControll = false;
        this.KeyMap = [];
        this.keyfunctionPressRef = (e) => this.keyPressedFunction(e);
        this.keyfunctionUpRef = (e) => this.keyUpFunction(e);
        this.mouseDownFuncRef = (e) => this.keyPressedFunction(e);
        this.mouseUpFuncRef = (e) => this.keyUpFunction(e);
        this.touchDownFuncRef = (e) => this.keyPressedFunction(e);
        this.touchUpFuncRef = (e) => this.keyUpFunction(e);
    }

    /**
     * add the current pressing key at the first position of an Array. 
     * The First Position ins this Array (this.KeyMap) will activate matching move.
     */
    keyPressedFunction(event){
        const clickedDiv = event.target;
        const atribute = clickedDiv.getAttribute("value");
        const eventValue = event.key || atribute;
        if(eventValue == " " || eventValue == "w" || eventValue == "ArrowUp"){
            event.preventDefault();
            event.stopPropagation();
        }
        if(!this.Player.gethit && !this.Player.crouch && !this.Player.level.levelIsWon && this.KeyMap.indexOf(eventValue) == -1 ){
            this.KeyMap.unshift(eventValue);
        }
    }

    /**
     * checks for a key is going up and prevent any move from it. Delete this Key out of the Array of all current pressing Keys
     */
    keyUpFunction(event){
        const clickedDiv = event.target;
        const atribute = clickedDiv.getAttribute("value");
        const eventValue = event.key || atribute;
        let index = 0;
        if(this.KeyMap.indexOf(eventValue) > -1 ){
            index = this.KeyMap.indexOf(eventValue);
            switch (eventValue) {
                case "a": case "ArrowLeft": case "playerLeft":  this.Player.stopMove(); break;
                case "d": case "ArrowRight": case "playerRight": this.Player.stopMove(); break;
                case "s": case "ArrowDown": case "playerBottom":  this.Player.outCrouch(); break;
            }
            this.KeyMap.splice(index,1)
        }
    }
  
    /**
     * Update Main Loop
     * keep Player move until current key is going up.
     * it checks for the frist position of the Array (this.KeyMap) to decide which move has to start.
     */
    update(){
        switch(this.KeyMap[0]){
            case "a": case "ArrowLeft": case "playerLeft":  this.Player.move("left"); break;
              case "d": case "ArrowRight": case "playerRight": this.Player.move("right");break;
              case "w": case "ArrowUp": case " ": case "playerUp": case "playerJump": this.Player.playerJump(); break;
              case "s": case "ArrowDown": case "playerBottom":  if(this.Player.onGround){this.Player.inCrouch()};break;
              case "f": case "Enter": case "playerFight": this.Player.playerAttack(); break;
          }
    }

    /**
     * will add all Event-Listener to the document.
     */
    addControll() {
        if(!this.alreadyGetControll){
            document.addEventListener("keydown", this.keyfunctionPressRef);
            document.addEventListener("keyup", this.keyfunctionUpRef);
            document.addEventListener("touchstart", this.touchDownFuncRef);
            document.addEventListener("touchend", this.touchUpFuncRef);
            document.addEventListener("mousedown", this.mouseDownFuncRef);
            document.addEventListener("mouseup", this.mouseUpFuncRef);
            this.alreadyGetControll = true;
        }
    }
    
    /**
     * will delete all Event-Listener to the document.
     */
    removeControll() {
    if(this.alreadyGetControll){
        this.KeyMap = [];
        document.removeEventListener("keydown", this.keyfunctionPressRef);
        document.removeEventListener("keyup", this.keyfunctionUpRef);
        document.addEventListener("touchstart", this.touchDownFuncRef);
        document.addEventListener("touchend", this.touchUpFuncRef);
        document.addEventListener("mousedown", this.mouseDownFuncRef);
        document.addEventListener("mouseup", this.mouseUpFuncRef);
        this.alreadyGetControll = false;
    }
    }
}