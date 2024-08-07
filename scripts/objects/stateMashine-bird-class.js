import { canvas } from "../canvas.js";

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
    constructor(time){
        this.FrameTime = time || 0;
    }

    start(entity){
        entity.stopMoving();
        entity.isFlying = false;
        entity.status = "idle";
        entity.animationStatus = "idle";
        entity.prevStatus = "idle";
    }

    behave(entity){
        let randomNumber = Math.floor(Math.random() * 100)
        switch(randomNumber){
            case 0:  entity.stateMachine.changeState(new Jump()); break;
            case 10: entity.facingLeft = false; break;
            case 20: entity.facingLeft = true; break;
        }
    }

    checkConditions(entity, deltaTime){
        let distance = entity.checkDistanceToPlayer(entity.level.objectsOfType.Player[0]);
        if (distance[0] <= 95){
            entity.stateMachine.changeState(new Flying());
        }
    }
    
    leaveState(entity){
        
    }
}

//////////////////////////////////////
////////// Flying ////////////
//////////////////////////////////////
class Flying{

    start(entity){
        entity.isFlying = true;
        entity.status = "flying";
        entity.animationStatus = "flying";
        entity.prevStatus = "flying";
    }

    behave(entity){
        entity.flee();
        entity.fly();
        entity.checkFacingLeft();
      
    }

    checkConditions(entity){
        if (entity.pos[1] < entity.level.cameraPos[1] - 350){
            entity.stateMachine.changeState(new Despawn());
        }
    }
    
    leaveState(entity){
        
    }
}

//////////////////////////////////////
///////////// Despawn ///////////////
//////////////////////////////////////
class Despawn{

    start(entity){
        entity.isFlying = false;
        entity.status = "despawn";
        entity.animationStatus = "idle";
    }

    behave(entity){
        entity.despawn();
    }

    checkConditions(entity, deltaTime){
        if (entity.originPos[0] < entity.level.objectsOfType.Player[0].pos[0] - (canvas.width / 2) || entity.originPos[0] > entity.level.objectsOfType.Player[0].pos[0] + (canvas.width / 2)){
            entity.spawn();
        }
    }
    
    leaveState(entity){
        
    }
}


//////////////////////////////////////
///////////// Jump ///////////////
//////////////////////////////////////
class Jump{

    start(entity){
        entity.isFlying = false;
        entity.status = "jump";
        entity.animationStatus = "jump";
    }

    behave(entity){
        let randomNumber = Math.floor(Math.random() * 3)
        switch(randomNumber){
            case 0: entity.walkspeed *= -1; entity.moving() ; break;
            case 1: break;
            default: entity.moving(); break ;
        }
        entity.jump();
        entity.stateMachine.changeState(new Idle());
    }

    checkConditions(entity){
        let distance = entity.checkDistanceToPlayer(entity.level.objectsOfType.Player[0]);
        if (distance[0] <= 95){
            entity.stateMachine.changeState(new Flying());
        }
    }
    
    leaveState(entity){
        
    }
}