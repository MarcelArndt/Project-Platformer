export class PlayerKeyboard {
    constructor(PlayerEnitiy){
        this.Player = PlayerEnitiy;
        this.alreadyGetControll = false;
        this.KeyMap = [];
        this.keyfunctionPressRef = (e) => this.keyPressedFunction(e);
        this.keyfunctionUpRef = (e) => this.keyUpFunction(e);
    }

    keyPressedFunction(event){
        if(!this.Player.gethit && !this.Player.crouch && !this.Player.level.levelIsWon && this.KeyMap.indexOf(event.key) == -1 ){
            this.KeyMap.unshift(event.key);
        }

    }

    keyUpFunction(event){
        let index = 0;
        if(this.KeyMap.indexOf(event.key) > -1 ){
            index = this.KeyMap.indexOf(event.key);
            switch (event.key) {
                case "a": case "ArrowLeft":  this.Player.stopMove(); break;
                case "d": case "ArrowRight": this.Player.stopMove(); break;
                case "s": case "ArrowDown":  this.Player.outCrouch(); break;
            }
            this.KeyMap.splice(index,1)
        }
    }
  
    update(){
        switch(this.KeyMap[0]){
            case "a": case "ArrowLeft":  this.Player.move("left"); break;
              case "d": case "ArrowRight": this.Player.move("right");break;
              case "w": case "ArrowUp": case " ": this.Player.playerJump(); break;
              case "s": case "ArrowDown": if(this.Player.onGround){this.Player.inCrouch()};break;
              case "f": case "Enter": this.Player.playerAttack(); break;
          }
    }

    
    addControll() {
        if(!this.alreadyGetControll){
            document.addEventListener("keydown", this.keyfunctionPressRef);
            document.addEventListener("keyup", this.keyfunctionUpRef);
            this.alreadyGetControll = true;
        }
    }
    
      removeControll() {
        if(this.alreadyGetControll){
            this.KeyMap = [];
            document.removeEventListener("keydown", this.keyfunctionPressRef);
            document.removeEventListener("keyup", this.keyfunctionUpRef);
            this.alreadyGetControll = false;
        }
      }

}