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

/**
 * Strukture of a new State:
 */
export class State {
  start(entity) {}
  behave(entity) {}
  checkConditions(entity) {}
  leaveState(entity) {}
}

//////////////////////////////////////
////////// IDLE STATUS ////////////
//////////////////////////////////////
export class Idle {
  start(entity) {
    entity.animationStatus = "idle";
  }

  behave(entity) {
      switch (entity.pressedKeys[0]) {
        case "d": case "a": entity.stateMachine.changeState(new Walking()); break;
        case "w": case " ": entity.stateMachine.changeState(new Jump()); break;
        default: entity.stopMove(); break;
      }
      entity.latestKey = entity.pressedKeys[0]
  }

  checkConditions(entity) {}

  leaveState(entity) {}
}

//////////////////////////////////////
////////// JUMP STATUS ////////////
//////////////////////////////////////
export class Jump {

  start(entity) {
    entity.animationStatus = "jump";
    entity.playerJump();
  }

  behave(entity) {
    entity.pressedKeys.forEach(PressedKey => {
        switch (PressedKey) {
        case "d": case "a": entity.move(); break;
        default: entity.stopMove(); break;
      }
    });
  }

  checkConditions(entity) {
    if (entity.vel[1] > 0){
      entity.stateMachine.changeState(new Fall())
    }
    if (entity.onGround && entity.vel[0] < 0.05 && entity.vel[0] > -0.05){
      entity.stateMachine.changeState(new Idle())
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
    entity.pressedKeys.forEach(PressedKey => {
      switch (PressedKey) {
      case "d": case "a": entity.move(); break;
      default: entity.stopMove(); break;
    }
  });

  switch (entity.pressedKeys[0]){
    case "w": case " ": entity.stateMachine.changeState(new Jump()); break;
    case "d": case "a": entity.move(); break;
    default: entity.stopMove(); break;
  }
  }
  

  checkConditions(entity) {
    if (entity.onGround){
      entity.stateMachine.changeState(new Idle())
    }

  }

  leaveState(entity) {}
}

//////////////////////////////////////
//////////// RUN STATUS //////////////
//////////////////////////////////////
export class Walking {
  start(entity) {
  }

  behave(entity) {
    if (entity.onGround){
      entity.animationStatus = "walking";
    }

    entity.pressedKeys.forEach(PressedKey => {
      switch (PressedKey) {
      case "d": case "a": entity.move(); break;
      default: entity.stopMove(); break;
    }
    });

  switch (entity.pressedKeys[0]){
    case "w": case " ": entity.stateMachine.changeState(new Jump()); break;
    case "d": case "a": entity.move(); break;
    default: entity.stateMachine.changeState(new Idle()); break;
  }

  
  }
  checkConditions(entity) {
    if (entity.vel[1] > 0){
      entity.stateMachine.changeState(new Fall())
    }

    if (entity.vel[0] < 0.3 && entity.vel[0] > -0.3){
      switch (entity.pressedKeys[0]){
        case "w": case " ": entity.stateMachine.changeState(new Jump()); break;
        case "d": case "a": entity.move(); break;
        default: entity.stateMachine.changeState(new Idle()); break;
      }
    }
   
  }

  leaveState(entity) 
  {}
}
