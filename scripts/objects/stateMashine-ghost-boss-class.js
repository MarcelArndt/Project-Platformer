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
////////// Init STATUS ////////////
//////////////////////////////////////
export class Init{

    start(entity){
        entity.acc = 0;
        entity.vel[0] = 0;
        this.timer = 0;
        entity.allowToFickeringAnimation = false;
    }

    behave(entity){
        entity.invincibility = true;
        if(entity.distanceToPlayer < 650){
            this.timer += 60 / 1000
        }
    }

    checkConditions(entity){
        if(entity.distanceToPlayer < 650 && !entity.isAbove && this.timer > 4){
            entity.stateMachine.changeState(new Teleporting());     
        } else if (entity.isAbove && this.timer > 4){
            entity.stateMachine.changeState(new Idle());    
        }
    }
    
    leaveState(entity){ 
        entity.level.bossAlreadySeen = true;
        entity.allowToFickeringAnimation = true;
    }
}


//////////////////////////////////////
////////// IDLE STATUS ////////////
//////////////////////////////////////
export class Idle{

    start(entity){
        entity.animationStatus = "idle"
        entity.acc = 0;
        entity.level.playerInBossRange = false;
    }

    behave(entity){

    }

    checkConditions(entity){
        let distanceX = entity.distanceToOrigin();
        let randomNumbTeleportUp = Math.floor(Math.random() * 200);
        let randomNumbTeleportDown = Math.floor(Math.random() * 200);
        let randomNumbChoice = Math.floor(Math.random() * 100);

        if (randomNumbTeleportUp == 1 && !entity.isAbove || randomNumbTeleportDown == 1 && entity.isAbove ){
            entity.stateMachine.changeState(new Teleporting());
        }

        if(entity.getHit){
            entity.stateMachine.changeState(new GetHit());     
        }

        if(entity.health <= 0){
            entity.stateMachine.changeState(new Death());     
        }

        if(entity.isAbove && entity.level.minionCounter <= 5 && entity.distanceToPlayer < 400 && randomNumbChoice >= 0 && randomNumbChoice <= 14){
            entity.stateMachine.changeState(new AttackThrow());
        }

        if(entity.isAbove && randomNumbChoice >= 15 && randomNumbChoice <= 20 && entity.level.minionCounter < 3){
            entity.stateMachine.changeState(new AttackSpawnMinion());
        }

        if(randomNumbChoice > 20 && randomNumbChoice <= 30 && entity.isAbove){
            entity.stateMachine.changeState(new Wandering());
        }

        if(randomNumbChoice > 30 && randomNumbChoice <= 33 && entity.isAbove){
            entity.stateMachine.changeState(new Teleporting());
        }

        if(entity.distanceToPlayer > 650){
            entity.stateMachine.changeState(new Init());     
        }

        if(!entity.isAbove && distanceX > 300 || !entity.isAbove && distanceX < -300){
            entity.stateMachine.changeState(new Wandering());
        } else if(!entity.isAbove && distanceX < 300 && distanceX > -300 && entity.animationStatus == "walking") {
            entity.stateMachine.changeState(new Idle());  
        }
    }
    
    leaveState(entity){
        entity.level.playerInBossRange = true;
    }
}


//////////////////////////////////////
////////// TELEPORTING STATUS ////////////
//////////////////////////////////////
class Teleporting{

    start(entity){
        entity.chooseRandomSound([soundIsloadet.teleport1], 0.25);
        entity.animationStatus = "teleport";
        entity.acc = 0;
        entity.vel[0] = 0;
        entity.animationIsRunning = true;
        entity.alreadyTeleport = false;
        entity.animationTimer = 0;
    }

    behave(entity){
        entity.invincibility = true;
        if(entity.animationStatus == "teleport" && !entity.animationIsRunning){
            entity.teleporting();
            entity.stateMachine.changeState(new Idle());
        }
    }

    checkConditions(entity){
        if(entity.health <= 0){
            entity.stateMachine.changeState(new Death());     
        }
    }
    
    leaveState(entity){ 
        entity.invincibility = false;
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
        if (randomChoice == 1){
            entity.stateMachine.changeState(new Teleporting());
        }
        if(entity.distanceToPlayer > 550){
            entity.stateMachine.changeState(new Init());     
        }
        if(entity.getHit){
            entity.stateMachine.changeState(new GetHit());     
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
    entity.chooseRandomSound([soundIsloadet.loadingAttack1], 1);
    }

    behave(entity){
        let aimX = 0;
        let aimY = 0;
        let distance = entity.distancePlayerToOrigin();
        if(Math.floor(entity.animationTimer) > 5 && !this.fired && distance < 600){
            aimX = entity.distanceXToPlayer / entity.distanceToPlayer;
            aimY = entity.distanceYToPlayer / entity.distanceToPlayer;
            this.fired = true;
            entity.level.pushNewObject(new Projectile({pos:[entity.pos[0] + (entity.size[0] / 2) - 8 , entity.pos[1] + (entity.size[1] / 2) - 8], size: [16,16], color : "#000", speedX: -aimX, speedY: -aimY, speedMultiplyer: 0.45, lifespan: 2, demage: 5,
            }));
            if(entity.health <= 75){
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
    entity.chooseRandomSound([soundIsloadet.loadingAttack2], 1);
    }

    behave(entity){
    }

    checkConditions(entity){
      if(!entity.animationIsRunning){
        entity.stateMachine.changeState(new Idle());
      }
    }
    
    leaveState(entity){ 
        entity.chooseRandomSound([soundIsloadet.blast2], 1);
            entity.spawnNewMinion(1);

    }
}

//////////////////////////////////////
///////// GET HIT STATUS /////////////
//////////////////////////////////////
class GetHit{

    start(entity){
            entity.level.player.score += Math.floor(entity.scoreValue / 3);
            entity.animationStatus = "getHit";
            entity.invincibility = true;
    }

    behave(entity){
        entity.invincibility = true;
        this.invincibilityTimer = 0;
        entity.getHit = true;
    }

    checkConditions(entity){
        if(entity.animationTimer >= 5){
            entity.stateMachine.changeState(new Teleporting());     
        }
        if(entity.health <= 0){
            entity.stateMachine.changeState(new Death());     
        }
    }

    leaveState(entity){
        entity.invincibility = false;
    }
}


//////////////////////////////////////
/////////// DEATH STATUS /////////////
//////////////////////////////////////
class Death{

    start(entity){
        entity.animationStatus = "death";
        entity.animationIsRunning = true;
        entity.acc = 0;
        entity.vel[0] = 0;
    }

    behave(entity){

    }

    checkConditions(entity){ 
        if(!entity.animationIsRunning){
            entity.isAlive = false;
            entity.level.musicManager.stop();
            entity.level.playerIsStillAlive = true;
            entity.level.levelIsWon = true;
            entity.delete();
        }
    }

    leaveState(entity){

    }
}