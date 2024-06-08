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
        entity.isFlying = false;
        entity.status = "idle";
        entity.animationStatus = "idle";
        entity.prevStatus = "idle";
    }

    behave(entity){
        entity.moving();
        entity.checkFacingLeft();
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



//////////////////////////////////////
////////// Flying ////////////
//////////////////////////////////////
export class Flying{

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
    }
    
    leaveState(entity){
        
    }
}

