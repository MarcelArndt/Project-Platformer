import {Box} from "./box.js";
import {canvas} from "../canvas.js";

export class Player extends Box {
    constructor(options, type){
        super({
            pos: options.pos,
            size: options.size,
            color: "blue",
            grav: 0.005,
            friction: 0.2
        },
            type || "Player"
        );
        this.crouch = false;
        this.jumpseed = -1.025;
        this.walkspeed = 0.005;

        this.addControll();

        
    }

    addControll(){ 
        document.addEventListener("keydown", (event) => {     
            switch (event.key) {     
                case "ArrowRight": case "d": if(this.crouch == false){this.acc = this.walkspeed;} break;
                case "ArrowLeft":  case "a": if(this.crouch == false){this.acc = -this.walkspeed;} break ;

                case " ": case "w": if(this.onGround && this.crouch == false){
                        this.onGround = false;
                        this.vel[1] = this.jumpseed; break;  
                        };

                case "f": console.log("attack"); break;s
                case "r": console.log("do a roll"); break;
                case "s": case "ArrowDown": if (this.crouch == false){this.setBottom(this.posBottom + this.size[1]/2); this.crouch = true; this.size[1] = this.size[1] / 2; this.acc = 0} break;
            }
        });

        document.addEventListener("keydown", (event) => {
            switch (event.key) { 
            
            }
        });

        document.addEventListener("keyup", (event) => { 
            switch (event.key) {   
                case "ArrowRight": case "d": case "ArrowLeft": case "a": this.acc = 0; break;
                case "s": case "ArrowDown": if(this.crouch == true){this.crouch = false; this.size[1] = this.size[1] * 2}; this.setTop(this.posTop - this.size[1]/2); break;
            }
        });

    }

    pushObject(box){
        return{
            toLeft:() => {
                if(box.type !== "Box") return false;
                const distance = box.posRight - this.posLeft;
                if(box.canBeMoved([-distance, 0])){  
                    box.setRight(this.posLeft);
                    return true; 
                }
                const smallGap = box.getRemainingDistanceLeft();
                if(box.canBeMoved([-smallGap, 0])){
                    box.setLeft(box.posLeft - smallGap);
                    this.setLeft(box.posRight);
                    return true;
                }
                return false;
            },
            toRight: () => {
                if(box.type !== "Box") return false;
                const distance = this.posRight - box.posLeft;
                if(box.canBeMoved([distance, 0])){  
                    box.setLeft(this.posRight);
                    return true; 
                }
                const smallGap = box.getRemainingDistanceRight();
                if(box.canBeMoved([-smallGap, 0])){
                    box.setRight(box.posRight + smallGap);
                    this.setRight(box.posLeft);
                    return true;
                }
                return false;
            }
        }
    }
}