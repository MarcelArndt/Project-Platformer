import {canvas, clearCanvas} from "./canvas.js";
import {Timer} from "./timer.js";


export const camera = {
    pos: [0,0],
};

let status = {
    ready : 1,
    pause : 2,
    running : 3,
    freeze: 4,
};

export class Level {
    constructor(option){
        this.size = option.size || [canvas.width, canvas.height];
        this.cameraPos = option.cameraPos || [0,this.size[1] - canvas.height];
        this.originalCameraPos = [... this.cameraPos];
        this.objects = [];
        this.player = null;
        this.game = null;
        this.index = 0;
        this.timer = new Timer();
        this.status = status.ready;
        this.levelIsWon = false;
        this.timer.update = (thisDeltaTime) => this.update(thisDeltaTime);
        this.obectsOfType = {
            Rectangle: [],
            Box: [],
            Player: [],
            Goal: [],
            Entity: [],
            Enemy: [],
        }
        this.deleteObjects = []
        this.screenshakeValue = 0;
        this.screenshake = false;
        this.screenshakeMaxRange = 24;
        this.addObjects(option.objects || []);
        
        this.keyFuncRef = (e) => this.keyFunction(e);
        //this.timer.getInPause();
    }


    addControll(){
        window.addEventListener("keydown", this.keyFuncRef);
    }

    removeControll(){
        window.removeEventListener("keydown",this.keyFuncRef);
    }
    
    keyFunction(e){
        if (e.key == "p" || e.key == "enter"){
            if(this.status === status.ready){
                this.start();
            } else if(this.status === status.running){
                this.pause();
            } else if(this.status === status.pause){
                this.resume();
            }
        } else if(e.key == "r" && this.status === status.running){
            this.resetLevel();
        }
    }

    addObjects(obj){
        for (let i = 0; i < obj.length; i++){
            const type = obj[i].type
            obj[i].level = this;
            this.objects.push(obj[i]);
            this.obectsOfType[type].push(obj[i]);
        }
    }

    update(deltaTime){
        clearCanvas();
        this.updateCamera();
        this.checkWin();
        this.doScreenshake();
        for(let i = 0; i < this.objects.length; i++){
            if(this.objects[i].animationFrames && this.objects[i].type == "Player" || this.objects[i].animationFrames && this.objects[i].type == "Enemy"){
                if(Object.keys(this.objects[i].animationFrames).length > 0){
                    this.objects[i].updateFrameAnimation(deltaTime);
                }
            }

            try{ this.objects[i].update(deltaTime);
                if (this.objects[i].type == "Player"){
                    this.objects[i].updatePlayerExtras(deltaTime);
                }
                if (this.objects[i].type == "Enemy"){
                    this.objects[i].updateEnemy();
                 }
                this.objects[i].draw();
               
            } catch{}
        }
    }

    doScreenshake(){
        let timeValue;
        let value = this.screenshakeMaxRange;
        if (this.screenshake){
            console.log("screenshake")
            for (let x = 0; x < 8; x++){
                for (let i = -value; i < this.screenshakeMaxRange; i++){
                    if( i % 2 == 0){
                        this.screenshakeValue = i;
                    } else {
                        setTimeout(() => {
                            this.screenshakeValue = i;
                        }, 250);
                    }
                }
            }
        }
        this.screenshake = false;
        this.screenshakeValue = 0;
    }

    drawObjects(){
        for(let i = 0; i < this.objects.length; i++){
            this.objects[i].draw();
        }
    }

    updateCamera(){  
        this.cameraPos[0] = Math.max(0, Math.min(this.size[0] -( canvas.width + (this.screenshakeValue * 2)) * 0.69, this.player.posRight - canvas.width * 0.65 /2) );
        this.cameraPos[1] = Math.max(0, Math.min(this.size[1] - (canvas.height + (this.screenshakeValue / 2)) * 0.69, this.player.posTop - canvas.height * 0.5 /2));
    }

    checkWin(){
        if(!this.levelIsWon) return;
        this.status =  status.pause;
        this.timer.pause;
        this.removeControll();
        this.game.switchToNextLevel();
    }

    start(){
        this.player = this.obectsOfType.Player[0];
        this.status = status.running;
        this.timer.pause = false;
        this.timer.start();
    }

    pause(){
       this.status = status.pause
       this.timer.getInPause();
    }

    resume(){
        this.status = status.running;
        this.timer.pause = false;
        this.timer.start();
    }

    resetLevel(){
        this.status = status.ready;
        this.objects.forEach(obj => obj.reset());
        this.cameraPos =[... this.originalCameraPos];
        this.addObjects(this.deleteObjects || []);
        this.deleteObjects = [];
    }

}