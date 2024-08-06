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
    }

    behave(entity){
        entity.checkIsFacingLeft();
        entity.stateMachine.changeState(new Walking());
    }

    checkConditions(entity){
        if(entity.getHit){
            this.leaveState(entity);  
            entity.stateMachine.changeState(new GetHit());    
        }
        
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
class Walking{

    start(entity){
        entity.acc = entity.backupOption.walkspeed
        entity.animationStatus = "walking"
    }

    behave(entity){
        entity.checkIsFacingLeft();
        let willCollide = entity.checkisObjectNear();
        if (willCollide[0] && willCollide[1] && entity.walkspeed > 0){
            entity.walkspeed = entity.walkspeed * -1;
        } else if(willCollide[0] && !willCollide[1] && entity.walkspeed < 0){
            entity.walkspeed = entity.walkspeed * -1;
        }
        entity.acc = entity.walkspeed;
    }

    checkConditions(entity){
        entity.checkIsPlayerinAggro();
        if (entity.PlayerInAggro[0] && entity.level.player.health > 0){
            entity.stateMachine.changeState(new Chasing());
            this.leaveState(entity);
        }

        if(entity.getHit){
            this.leaveState(entity);  
            entity.stateMachine.changeState(new GetHit());    
        }

        if(Math.floor(entity.animationTimer) == 1 && entity.checkThisOnScreen() || Math.floor(entity.animationTimer) == 5){
            entity.chooseRandomSound([soundIsloadet.footsteps01,soundIsloadet.footsteps02, soundIsloadet.footsteps03]);
        }

        if(entity.health <= 0){
            entity.stateMachine.changeState(new Death());     
        }
      
    }
    
    leaveState(entity){ 

    }
}


//////////////////////////////////////
////////// CHASING STATUS ////////////
//////////////////////////////////////
class Chasing{

    start(entity){
        entity.walkspeed *= 5;
        entity.acc = entity.walkspeed;
        entity.animationStatus = "chasing";
    }

    behave(entity){
        let willCollide = entity.checkisObjectNear();
        let distance = entity.checkDistanceToPlayer();
        entity.checkIsFacingLeft();
        if (distance[0] <= 0 && entity.walkspeed > 0){
            entity.walkspeed *= -1;
        } else if(distance[0] > 0 && entity.walkspeed < 0){
            entity.walkspeed *= -1;
        }
        entity.acc = entity.walkspeed;
        if (willCollide[0]){
            entity.jump();
        }
        if(Math.floor(entity.animationTimer) == 1 || Math.floor(entity.animationTimer) == 3 || Math.floor(entity.animationTimer) == 6){
            entity.chooseRandomSound([soundIsloadet.footsteps01,soundIsloadet.footsteps02, soundIsloadet.footsteps03]);
        }

    }

    checkConditions(entity){
        entity.checkIsPlayerinAggro();
        if (!entity.PlayerInAggro[0] || entity.level.player.animationStatus == "death"){
            entity.stateMachine.changeState(new Walking());
            this.leaveState(entity) ; 
        } else if (entity.PlayerInAggro[1] && entity.level.player.animationStatus != "death"){
            entity.stateMachine.changeState(new Attack());  
            this.leaveState(entity);
        }

        if(entity.getHit){
            this.leaveState(entity);  
            entity.stateMachine.changeState(new GetHit());    
        }

        if(entity.health <= 0){
            entity.stateMachine.changeState(new Death());     
        }

    }
    
    leaveState(entity){
        entity.walkspeed = entity.backupOption.walkspeed;
        entity.acc = entity.walkspeed;
    }
}


//////////////////////////////////////
////////// ATTACK STATUS /////////////
//////////////////////////////////////
class Attack{

    start(entity){
        entity.walkspeed = 0;
        entity.acc = 0;
        entity.animationStatus = "attack"
        entity.animationTimer = 0;
        entity.animationSpeed = 2;
    }

    behave(entity){
        entity.vel[0] = 0;
        entity.acc = 0;
        let distance = entity.checkDistanceToPlayer();
        if(!entity.animationIsRunning){
            entity.animationStatus = "idle";
        } 
        if(entity.animationIsRunning && entity.animationStatus == "idle" && entity.animationTimer >= 3){
            entity.animationStatus = "attack" 
            entity.animationTimer = 0;
        }

        if (distance[0] <= 0){
            entity.facingLeft = false;
        } else if(distance[0] > 0){
            entity.facingLeft = true;
        }

        if(entity.animationStatus == "attack" && entity.animationIsRunning){ 
            switch(entity.facingLeft){
            case true: if(Math.floor(entity.animationTimer) == 6){entity.activateHitbox(entity.index, 1)}; break;
            case false: if(Math.floor(entity.animationTimer) == 6){entity.activateHitbox(entity.index, 0)}; break;
            }
            if(Math.floor(entity.animationTimer) == 5){
             entity.chooseRandomSound([soundIsloadet.whoosh02, soundIsloadet.whoosh03, soundIsloadet.whoosh04]);
            }
        }

        if(entity.animationStatus == "attack" && entity.animationTimer >= 7){
            entity.disableHitbox(entity.index, 0, true);
        }
    }

    checkConditions(entity){
        entity.checkIsPlayerinAggro();
        if(!entity.PlayerInAggro[1] || entity.level.player.animationStatus == "death"){
            entity.stateMachine.changeState(new Walking()); 
        }

        if(entity.getHit){
            entity.stateMachine.changeState(new GetHit());    
        }
        
    }
    
    leaveState(entity){ 
        entity.walkspeed = entity.backupOption.walkspeed;
        entity.acc = entity.walkspeed;
        entity.disableHitbox(entity.index, 0, true);
        entity.animationSpeed = 1;
    }
}


//////////////////////////////////////
///////// GET HIT STATUS /////////////
//////////////////////////////////////
class GetHit{

    start(entity){
        entity.acc = 0;
        entity.vel[0] = 0
        entity.gethitJumpAlready = false;
        entity.chooseRandomSound([soundIsloadet.slurp04]);
        entity.animationStatus = "getHit";
        entity.level.player.score += Math.floor(entity.scoreValue / 3);
    }

    behave(entity){
        entity.pushBack(0.45,0.95);
    }

    checkConditions(entity){
        if(!entity.getHit){
            entity.stateMachine.changeState(new Idle());
          }
        if(entity.health <= 0){
            entity.stateMachine.changeState(new Death());     
        }
    }

    leaveState(entity){
        entity.gethitJumpAlready = false;
    }
}


//////////////////////////////////////
/////////// DEATH STATUS /////////////
//////////////////////////////////////
class Death{

    start(entity){
        entity.chooseRandomSound([soundIsloadet.hit03]);
        entity.walkspeed = 0;
        entity.animationStatus = "getHit";
        entity.type = "Death";
        entity.subType = "Death";
        entity.level.player.score += entity.scoreValue - Math.floor(entity.scoreValue / 3);
        entity.removeHitboxFromLevel();
    }

    behave(entity){
        entity.pushBack(0.45,0.95);
        if(!entity.onGround){
            entity.animationStatus = "death";
        } else if (entity.onGround){
            entity.animationStatus = "death";
            entity.animationTimer = 4;
            setTimeout(() => {
                entity.delete();
            }, 1500);
        }
    }

    checkConditions(entity){ 

    }

    leaveState(entity){

    }
}