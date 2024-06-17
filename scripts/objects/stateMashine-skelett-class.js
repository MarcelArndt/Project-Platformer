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
        if(entity.gethit){
            this.leaveState(entity);  
            entity.stateMachine.changeState(new GetHit());    
        }
    }
    
    leaveState(entity){
        
    }
}


//////////////////////////////////////
////////// WALKING STATUS ////////////
//////////////////////////////////////
export class Walking{

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
        if (entity.PlayerInAggro[0]){
            entity.stateMachine.changeState(new Chasing());
            this.leaveState(entity);
        }

        if(entity.gethit){
            this.leaveState(entity);  
            entity.stateMachine.changeState(new GetHit());    
        }
      
    }
    
    leaveState(entity){ 

    }
}


//////////////////////////////////////
////////// CHASING STATUS ////////////
//////////////////////////////////////
export class Chasing{

    start(entity){
        entity.walkspeed *= 2;
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

    }

    checkConditions(entity){
        entity.checkIsPlayerinAggro();
        if (!entity.PlayerInAggro[0]){
            entity.stateMachine.changeState(new Walking());
            this.leaveState(entity) ; 
        } else if (entity.PlayerInAggro[1]){
            entity.stateMachine.changeState(new Attack());  
            this.leaveState(entity);
        }

        if(entity.gethit){
            this.leaveState(entity);  
            entity.stateMachine.changeState(new GetHit());    
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
export class Attack{

    start(entity){
        entity.walkspeed = 0;
        entity.acc = 0;
        entity.animationStatus = "attack"
     
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
            case true: if(entity.animationTimer >= 6){entity.activateHitbox(entity.index, 1)}; break;
            case false: if(entity.animationTimer >= 6){entity.activateHitbox(entity.index, 0)}; break;
            }
            if(entity.animationTimer == 5){
             entity.chooseRandomSound([soundIsloadet.heavySwordOne, soundIsloadet.heavySwordTwo, soundIsloadet.heavySwordThree]);
            }
           
        }
           

        if(entity.animationStatus == "attack" && entity.animationTimer >= 7){
            entity.disableHitbox(entity.index, 0, true);
        }
    }

    checkConditions(entity){
        entity.checkIsPlayerinAggro();
        if(!entity.PlayerInAggro[1]){
            entity.stateMachine.changeState(new Walking()); 

        }
        if(entity.gethit){
            entity.stateMachine.changeState(new GetHit());    
        }
        
    }
    
    leaveState(entity){ 
        entity.walkspeed = entity.backupOption.walkspeed;
        entity.acc = entity.walkspeed;
        entity.disableHitbox(entity.index, 0, true);
    }
}


//////////////////////////////////////
///////// GET HIT STATUS /////////////
//////////////////////////////////////
export class GetHit{

    start(entity){
        entity.animationStatus = "getHit";
        entity.jump(-1);
        entity.getPushBack = true;
        entity.acc = 0;
    }

    behave(entity){
        if (entity.getHitLeft && entity.vel[1] < 0){
            entity.vel[0] = 1
        } else if (!entity.getHitLeft && entity.vel[1] < 0) {
            entity.vel[0] = -1
        }
    }

    checkConditions(entity){
        entity.checkInvincibilityTimer();
        if(!entity.gethit){
            entity.stateMachine.changeState(new Chasing());     
        }
        if(entity.HitPoints <= 0){
            entity.stateMachine.changeState(new Death());     
        }
    }

    leaveState(entity){

    }
}


//////////////////////////////////////
/////////// DEATH STATUS /////////////
//////////////////////////////////////
export class Death{

    start(entity){
        entity.walkspeed = 0;
        entity.acc = 0;
        entity.animationStatus = "getHit"
        entity.animationSpeed = 1

    }

    behave(entity){
        if(!entity.onGround){
            entity.animationStatus = "death"
        } else if (entity.onGround){
            entity.size[1] = 0
            entity.setBottom(entity.posBottom - 100);
            entity.acc = 0;
            entity.animationStatus = "death"
            entity.animationTimer = 4;
            entity.grav = 0;
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