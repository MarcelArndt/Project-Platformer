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
        let randomNumbTeleportUp = Math.floor(Math.random() * 250);
        let randomNumbTeleportDown = Math.floor(Math.random() * 450);
        let randomNumbChoice = Math.floor(Math.random() * 100);

        if (randomNumbTeleportUp == 1 && !entity.isAbove || randomNumbTeleportDown == 1 && entity.isAbove ){
            entity.isAbove = entity.isAbove == false ? true:false;
            entity.stateMachine.changeState(new Teleporting());
        }

        if(entity.gethit){
            entity.stateMachine.changeState(new GetHit());     
        }

        if(entity.health <= 0){
            entity.stateMachine.changeState(new Death());     
        }

        if(entity.isAbove && entity.level.minionCounter <= 5 && entity.distanceToPlayer < 400 && randomNumbChoice >= 0 && randomNumbChoice <= 14){
            entity.stateMachine.changeState(new AttackSpawnMinion());
        }

        if(entity.isAbove && randomNumbChoice >= 15 && randomNumbChoice <= 20){
            entity.stateMachine.changeState(new AttackThrow());
        }

        if(randomNumbChoice > 20 && randomNumbChoice <= 30 && entity.isAbove){
            entity.stateMachine.changeState(new Wandering());
        }

        if(randomNumbChoice > 30 && randomNumbChoice <= 33 && entity.isAbove){
            entity.isAbove = entity.isAbove == false ? true:false;
            entity.stateMachine.changeState(new Teleporting());
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
        if(entity.health <= 0){
            entity.stateMachine.changeState(new Death());     
        }
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
        entity.initMovement();
    }

    behave(entity){
     
        entity.checkHomePoint();
        entity.moveRandomly();
    }

    checkConditions(entity){
        let randomChoice = Math.floor(Math.random() * 150)
        if(entity.health <= 0){
            entity.stateMachine.changeState(new Death());     
        }
        if(randomChoice == 50){
            entity.stateMachine.changeState(new Idle());    
        }
    }
    
    leaveState(entity){ 

    }
}



//////////////////////////////////////
//////// ATTACKTHROW STATUS //////////
/////////////////////////////////////
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
            if(entity.health <= 100){
                entity.level.pushNewObject(new Projectile({pos:[entity.pos[0] + (entity.size[0] / 2) - 8 , entity.pos[1] + (entity.size[1] / 2) - 8], size: [16,16], color : "#000", speedX: -aimX + (Math.random() * 8) * 0.1, speedY: -aimY + (Math.random() * 3) * 0.1, speedMultiplyer: 0.45, lifespan: 2, demage: 5,
                }));
                entity.level.pushNewObject(new Projectile({pos:[entity.pos[0] + (entity.size[0] / 2) - 8 , entity.pos[1] + (entity.size[1] / 2) - 8], size: [16,16], color : "#000", speedX: -aimX - (Math.random() * 8) * 0.1, speedY: -aimY - (Math.random() * 3) * 0.1, speedMultiplyer: 0.45, lifespan: 2, demage: 5,
                }));
            }
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
///// ATTACKSPAWNMINION STATUS //////
/////////////////////////////////////
class AttackSpawnMinion{

    start(entity){
    entity.animationStatus = "attackTwo";
    entity.animationIsRunning = true;
    entity.acc = 0;
    }

    behave(entity){
    }

    checkConditions(entity){
      if(!entity.animationIsRunning){
        entity.stateMachine.changeState(new Idle());
      }
    }
    
    leaveState(entity){ 
        if(entity.health > entity.maxHealth / 4 * 3){
            entity.spawnNewMinion(1);
        } else if (entity.health < entity.maxHealth / 4 * 3){
            entity.spawnNewMinion(2);
        }
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
        entity.level.player.score += Math.floor(entity.scoreValue / 3);
        entity.chooseRandomSound([soundIsloadet.hit09]);
        entity.animationStatus = "getHit";
    }

    behave(entity){
       
    }

    checkConditions(entity){
        entity.checkInvincibilityTimer();
        if(!entity.gethit){
            entity.isAbove = entity.isAbove == false ? true:false;
            entity.stateMachine.changeState(new Teleporting());     
        }
        if(entity.health <= 0){
            entity.stateMachine.changeState(new Death());     
        }
    }

    leaveState(entity){

    }
}


//////////////////////////////////////
/////////// DEATH STATUS /////////////
//////////////////////////////////////
class Death{

    start(entity){
        entity.animationStatus = "death";
        entity.animationIsRunning = true;
    }

    behave(entity){

    }

    checkConditions(entity){ 

    }

    leaveState(entity){

    }
}