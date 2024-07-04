import { soundIsloadet } from "../assets.js";
import { Projectile } from "./projectile-class.js";

export class StateMachine {
    constructor(state, entity){
        this.currentState = state;
        this.entity = entity;
        this.currentState.start(this.entity);
    }

    changeState(newState){
        this.currentState.leaveState(this.entity);
        this.currentState = newState;
        this.currentState.start(this.entity);
    }

    updateState(){
        this.currentState.behave(this.entity);
        this.currentState.checkConditions(this.entity);
    }
}


/**
 * Strukture of a new State:
 */
export class State{
    start(entity){}
    behave(entity){}
    checkConditions(entity){}
    leaveState(entity){}
}


//////////////////////////////////////
////////// IDLE STATUS ////////////
//////////////////////////////////////
export class Idle{

    start(entity){
        entity.animationStatus = "idle"
        entity.acc = 0;
    }

    behave(entity){
    }

    checkConditions(entity){
        let randomNumbTeleportUp = Math.floor(Math.random() * 150);
        let randomNumbTeleportDown = Math.floor(Math.random() * 450);
        let randomNumbMove = Math.floor(Math.random() * 100);

        if (randomNumbTeleportUp == 1 && !entity.isAbove || randomNumbTeleportDown == 1 && entity.isAbove ){
            entity.isAbove = entity.isAbove == false ? true:false;
            entity.stateMachine.changeState(new Teleporting());
        }

        if(randomNumbMove == 1 && entity.isAbove){
            entity.stateMachine.changeState(new Wandering());
        }


    }
    
    leaveState(entity){
        
    }
}


//////////////////////////////////////
////////// TELEPORTING STATUS ////////////
//////////////////////////////////////
class Teleporting{

    start(entity){
        entity.animationStatus = "teleport";
    }

    behave(entity){

        if(entity.animationStatus == "teleport" && !entity.animationIsRunning){
            if(entity.isAbove){
                entity.teleportingUpwards();
            } else{
                entity.teleportingDownwards();
            }
            entity.stateMachine.changeState(new Idle());
        }

    }

    checkConditions(entity){
    }
    
    leaveState(entity){ 
    }
}


//////////////////////////////////////
////////// WALKING STATUS ////////////
//////////////////////////////////////
class Wandering{

    start(entity){
        entity.animationStatus = "walking"
    }

    behave(entity){
        let randomNumbMove = Math.floor(Math.random() * 60);
        entity.flyAround()
        if (randomNumbMove == 1) {
            entity.stateMachine.changeState(new Idle());
        }
        if (randomNumbMove == 2) {
            entity.stateMachine.changeState(new AttackThrow());
        }
    }

    checkConditions(entity){
    }
    
    leaveState(entity){ 

    }
}


//////////////////////////////////////
////////// CHASING STATUS ////////////
//////////////////////////////////////
class Chasing{

    start(entity){
   
    }

    behave(entity){
     
    }

    checkConditions(entity){
        
    }
    
    leaveState(entity){
    
    }
}


//////////////////////////////////////
////////// ATTACK STATUS /////////////
//////////////////////////////////////
class AttackThrow{

    start(entity){
    entity.animationStatus = "attackTwo";
    entity.animationIsRunning = true;
    entity.acc = 0;
    this.fired = false;
    }

    behave(entity){
        let aimX = 0;
        let aimY = 0;
        if(Math.floor(entity.animationTimer) > 5 && !this.fired){
            aimX = entity.distanceXToPlayer / entity.distanceToPlayer;
            aimY = entity.distanceYToPlayer / entity.distanceToPlayer;
            this.fired = true;
            entity.level.pushNewObject(new Projectile({pos:[entity.pos[0] + (entity.size[0] / 2) - 8 , entity.pos[1] + (entity.size[1] / 2) - 8], size: [16,16], color : "#000", speedX: -aimX, speedY: -aimY, speedMultiplyer: 0.45, lifespan: 2, demage: 5,
            }));
           }
    }

    checkConditions(entity){
      if(!entity.animationIsRunning){
        entity.stateMachine.changeState(new Idle());
      }
    }
    
    leaveState(entity){ 
        
    }
}


//////////////////////////////////////
////////// ATTACK STATUS /////////////
//////////////////////////////////////
class Attack{

    start(entity){
 
    }

    behave(entity){
     
    }

    checkConditions(entity){
      
    }
    
    leaveState(entity){ 
        
    }
}


//////////////////////////////////////
///////// GET HIT STATUS /////////////
//////////////////////////////////////
class GetHit{

    start(entity){
      
    }

    behave(entity){
       
    }

    checkConditions(entity){
       
    }

    leaveState(entity){

    }
}


//////////////////////////////////////
/////////// DEATH STATUS /////////////
//////////////////////////////////////
class Death{

    start(entity){
    
    }

    behave(entity){
       
    }

    checkConditions(entity){ 

    }

    leaveState(entity){

    }
}