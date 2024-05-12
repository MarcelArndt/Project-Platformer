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
        this.timer = new Timer(1000 / 60);
        this.status = status.ready;
        this.levelIsWon = false;
        this.timer.update = (deltaTime) => this.update(deltaTime);
        this.obectsOfType = {
            Rectangle: [],
            Box: [],
            Player: [],
            Goal: [],
            Entity: [],
            Enemy: []
        }

        this.addObjects(option.objects || []);
        this.start();
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
        for(let i = 0; i < this.objects.length; i++){
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
        this.drawObjects();
        this.updateCamera();
        this.checkWin();
    }

    drawObjects(){
        for(let i = 0; i < this.objects.length; i++){
            this.objects[i].draw();
        }
    }

    updateCamera(){  
        this.cameraPos[0] = Math.max(0, Math.min(this.size[0] - canvas.width * 0.69, this.player.posRight - canvas.width * 0.65 /2 ));
        this.cameraPos[1] = Math.max(0, Math.min(this.size[1] - canvas.height * 0.69, this.player.posTop - canvas.height * 0.5 /2));
    }

    checkWin(){

    }

    start(){
        this.player = this.obectsOfType.Player[0];
        this.status = status.running;
        this.timer.pause = false;
        this.timer.start();
    }

}