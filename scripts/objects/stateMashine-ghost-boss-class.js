import { soundIsloadet } from "../assets.js";

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
        let randomNumbMove = Math.floor(Math.random() * 460);
        entity.flyAround()
        if (randomNumbMove == 1) {
            entity.stateMachine.changeState(new Idle());
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