import { canvas, clearCanvas } from "./canvas.js";
import { Timer } from "./timer.js";


export let camera = {
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
        this.background = option.background;
        this.tileset = option.tileset;
        this.collisionTiles = option.collisionTiles;
        this.receivingObjects = option.objects
        this.player = null;
        this.game = null;
        this.index = 0;
        this.timer = new Timer();
        this.status = status.ready;
        this.levelIsWon = false;
        this.timer.update = (thisDeltaTime) => this.update(thisDeltaTime);
        this.objectsOfType = null;
        this.deleteObjects = []
        this.screenshakeValue = 0;
        this.screenshake = false;
        this.screenshakeMaxRange = 24;
        this.screenAnimationTimer = 0;
        this.screenEffektTimer = 0;
        this.keyFuncRef = (e) => this.keyFunction(e);
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

    addCollisionTiles(){
        this.collisionTiles.forEach((tile) => {
            tile.level = this;
            this.objects.push(tile);
            this.objectsOfType[tile.type].push(tile);
        });
    }

    addObjects(obj){
        for (let i = 0; i < obj.length; i++){
            const type = obj[i].type
            obj[i].level = this;
            this.objects.push(obj[i]);
            this.objectsOfType[type].push(obj[i]);
        }
    }

    update(deltaTime){
        clearCanvas();
        this.background.updateBackground(this.objectsOfType.Player);
        this.tileset.draw(this.cameraPos);
        this.updateCamera();
        this.checkWin();
        this.animateScreenshake(deltaTime, 1);
        for(let i = 0; i < this.objects.length; i++){

            if(this.objects[i].animationFrames && this.objects[i].type == "Player" || this.objects[i].animationFrames && this.objects[i].type == "Enemy"){
                if(Object.keys(this.objects[i].animationFrames).length > 0){
                    this.objects[i].updateFrameAnimation(deltaTime);
                }
            }
            this.objects[i].update(deltaTime);

            if (this.objects[i].type == "Player"){
                this.objects[i].updatePlayerExtras(deltaTime);
            }

            if (this.objects[i].type == "Enemy"){
                this.objects[i].updateEnemy(deltaTime);
            }

             this.objects[i].draw();
        }
    }

    animateScreenshake(deltaTime, speed = 1){
        const secDeltaTime = deltaTime / 100 * speed;
        this.screenAnimationTimer += secDeltaTime;
        let randomDivider = Math.floor(Math.random() * 10);
        if (this.screenshake && this.screenAnimationTimer >= 1.5 && this.screenAnimationTimer < 3){
            this.screenshakeValue = randomDivider  
        } else if (this.screenshake && this.screenAnimationTimer >= 3){
            this.screenshakeValue = -randomDivider
            this.screenAnimationTimer = 0;
        }
}
    

    drawObjects(){
        for(let i = 0; i < this.objects.length; i++){
            this.objects[i].draw();
        }
    }

    updateCamera(){
        let randomNumber = Math.random();
        if (randomNumber == 0){
            randomNumber = -1;
        }
        this.cameraPos[0] = Math.max(0, Math.min(this.size[0] -( canvas.width) * 0.69, this.player.posRight - canvas.width * 0.65 /2) + ((this.screenshakeValue / 1) * randomNumber));
        this.cameraPos[1] = Math.max(0, Math.min(this.size[1] - (canvas.height) * 0.69, this.player.posTop - canvas.height * 0.5 /2) + this.screenshakeValue);
    }

    checkWin(){
        if(!this.levelIsWon) return;
        this.status =  status.pause;
        this.timer.pause;
        this.removeControll();
        this.game.switchToNextLevel();
    }

    start(){
        this.objectsOfType = {
            Rectangle: [],
            Box: [],
            Player: [],
            Goal: [],
            Entity: [],
            Enemy: [],
        }
        this.addCollisionTiles();
        this.addObjects(this.receivingObjects || []);
        this.player = this.objectsOfType.Player[0];
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