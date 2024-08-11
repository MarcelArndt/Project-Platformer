export class PlayerKeyboard {
    constructor(PlayerEnitiy){
        this.Player = PlayerEnitiy;
        this.alreadyGetControll = false;
        this.KeyMap = [];
        this.keyfunctionPressRef = (e) => this.keyPressedFunction(e);
        this.keyfunctionUpRef = (e) => this.keyUpFunction(e);
        this.mouseDownFuncRef = (e) => this.keyPressedFunction(e);
        this.mouseUpFuncRef = (e) => this.keyUpFunction(e);
    }

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
  
    update(){
        switch(this.KeyMap[0]){
            case "a": case "ArrowLeft": case "playerLeft":  this.Player.move("left"); break;
              case "d": case "ArrowRight": case "playerRight": this.Player.move("right");break;
              case "w": case "ArrowUp": case " ": case "playerUp": case "playerJump": this.Player.playerJump(); break;
              case "s": case "ArrowDown": case "playerBottom":  if(this.Player.onGround){this.Player.inCrouch()};break;
              case "f": case "Enter": case "playerFight": this.Player.playerAttack(); break;
          }
    }

    
    addControll() {
        if(!this.alreadyGetControll){
            document.addEventListener("keydown", this.keyfunctionPressRef);
            document.addEventListener("keyup", this.keyfunctionUpRef);
            document.addEventListener("touchstart", this.mouseDownFuncRef);
            document.addEventListener("touchend", this.mouseUpFuncRef);
            this.alreadyGetControll = true;
        }
    }
    
      removeControll() {
        if(this.alreadyGetControll){
            this.KeyMap = [];
            document.removeEventListener("keydown", this.keyfunctionPressRef);
            document.removeEventListener("keyup", this.keyfunctionUpRef);
            document.addEventListener("touchstart", this.mouseDownFuncRef);
            document.addEventListener("touchend", this.mouseUpFuncRef);
            this.alreadyGetControll = false;
        }
      }
}