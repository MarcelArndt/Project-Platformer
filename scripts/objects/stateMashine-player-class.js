export class StateMachine {
  constructor(state, entity) {
    this.currentState = state;
    this.entity = entity;
    this.currentState.start(this.entity);
  }

  changeState(newState) {
    this.currentState.leaveState(this.entity);
    this.currentState = newState;
    this.currentState.start(this.entity);
  }

  updateState() {
    this.currentState.behave(this.entity);
    this.currentState.checkConditions(this.entity);
  }
}

//////////////////////////////////////
////////// IDLE STATUS ////////////
//////////////////////////////////////
export class Idle {
  start(entity) {
    entity.animationStatus = "idle";
  }

  behave(entity) {
  }

  checkConditions(entity) {
    if (entity.crouch){
      entity.stateMachine.changeState(new Crouch());
    }
    if(entity.cooldown.isInMainAttack){
      entity.stateMachine.changeState(new Attack());
    }
    if (entity.vel[1] < 0 && !entity.onGround){
      entity.stateMachine.changeState(new Jump());
    } else if(entity.vel[1] > 0 && !entity.onGround){
      entity.stateMachine.changeState(new Fall());
    } else if(entity.vel[0] > 0.1 || entity.vel[0] < -0.1){
      entity.stateMachine.changeState(new Walking());
    }
  }

  leaveState(entity) {}
}

//////////////////////////////////////
////////// JUMP STATUS ////////////
//////////////////////////////////////
export class Jump {
  start(entity) {
    entity.animationStatus = "jump";

  }

  behave(entity) {

  }

  checkConditions(entity) {
    if (entity.vel[1] > 0 && !entity.onGround) {
      entity.stateMachine.changeState(new Fall());
    }
  }

  leaveState(entity) {}
}

//////////////////////////////////////
////////// FALL STATUS ////////////
//////////////////////////////////////
export class Fall {
  start(entity) {
    entity.animationStatus = "fall";
  }

  behave(entity) {

  }

  checkConditions(entity) {
    if (entity.onGround && entity.vel[1] == 0) {
      entity.stateMachine.changeState(new Idle());
    }
  }

  leaveState(entity) {}
}

//////////////////////////////////////
////////// WALKING STATUS ///////////
//////////////////////////////////////
export class Walking {
  start(entity) {  
    entity.animationStatus = "walking";
  }

  behave(entity) {
   
    }
  checkConditions(entity) {
    if (entity.crouch){
      entity.stateMachine.changeState(new Crouch());
    }
    if(entity.cooldown.isInMainAttack){
      entity.stateMachine.changeState(new Attack());
    }
    if (entity.vel[1] < 0 && !entity.onGround){
      entity.stateMachine.changeState(new Jump());
    } else if(entity.vel[1] > 0 && !entity.onGround){
      entity.stateMachine.changeState(new Fall());
    } else if(entity.acc < 0.005 && entity.acc > -0.005 && entity.onGround){
      entity.stateMachine.changeState(new Idle());
    }
  }

  leaveState(entity) {}
}

//////////////////////////////////////
////////// CROUCH STATUS ////////////
//////////////////////////////////////
export class Crouch {
  start(entity) {
    entity.animationStatus = "crouch";
  }

  behave(entity) {
  }

  checkConditions(entity) {
    if(!entity.crouch){
      entity.stateMachine.changeState(new Idle());
    }
  }

  leaveState(entity) {}
}


//////////////////////////////////////
////////// ATTACK STATUS ////////////
//////////////////////////////////////
export class Attack {
  start(entity) {
    entity.animationTimer = 0;
    this.startAttack = true
    entity.animationStatus = "attack";
  }

  behave(entity) {
    if(Math.floor(entity.animationTimer) == 5){
      if(entity.facingLeft){
        entity.activateHitbox(1);
      } else{
        entity.activateHitbox(0);
      }
    }
  }
  checkConditions(entity) {
    if(!entity.animationIsRunning){
      entity.stateMachine.changeState(new Idle());
    } else if(entity.crouch){
      entity.stateMachine.changeState(new Crouch());
    } else if (entity.vel[1] < 0 && !entity.onGround){
      entity.stateMachine.changeState(new Jump());
    } else if(entity.vel[1] > 0 && !entity.onGround){
      entity.stateMachine.changeState(new Fall());
    } else if(entity.vel[0] > 0.1 || entity.vel[0] < -0.1){
      entity.stateMachine.changeState(new Walking());
    }
  }

  leaveState(entity) {
    entity.cooldown.isInMainAttack = false;
    entity.disableHitbox(0,true);
    entity.animationStatus = "idle";
    entity.cooldown.mainAttack = false;
    entity.cooldown.isInMainAttack =  false;
    entity.cooldown.mainCooldown =  "";
    entity.cooldown.mainKeyIsPressed = false;
  }
}
