import { soundIsloadet } from "../assets.js";

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
    if(entity.cooldown.startAttack){
        entity.stateMachine.changeState(new Attack());
    }
    if (entity.vel[1] < 0 && !entity.onGround){
      entity.stateMachine.changeState(new Jump());
    } else if(entity.vel[1] > 0 && !entity.onGround){
      entity.stateMachine.changeState(new Fall());
    } else if(entity.vel[0] > 0.1 || entity.vel[0] < -0.1){
      entity.stateMachine.changeState(new Walking());
    }
    if(entity.getHit){
      entity.stateMachine.changeState(new GetHit());    
    }
    if(entity.health <= 0){
      entity.stateMachine.changeState(new Death());
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
    entity.chooseRandomSound([soundIsloadet.playerJumpOne, soundIsloadet.playerJumpTwo]);
  }

  behave(entity) {

  }

  checkConditions(entity) {
    if (entity.vel[1] > 0 && !entity.onGround) {
      entity.stateMachine.changeState(new Fall());
    }
    if(entity.getHit){
      entity.stateMachine.changeState(new GetHit());    
    }
    if(entity.health <= 0){
      entity.stateMachine.changeState(new Death());
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
    if(entity.getHit){
      entity.stateMachine.changeState(new GetHit());    
    }
    if(entity.health <= 0){
      entity.stateMachine.changeState(new Death());
    }

  }

  leaveState(entity) {
    if(entity.onGround && entity.vel[1] == 0){
      entity.chooseRandomSound([soundIsloadet.LightStepsOne, soundIsloadet.LightStepsTwo, soundIsloadet.LightStepsThree]);
    }
  }
}

//////////////////////////////////////
////////// WALKING STATUS ///////////
//////////////////////////////////////
export class Walking {

  start(entity) {  
    entity.animationStatus = "walking";
  }

  behave(entity) {
    if(Math.floor(entity.animationTimer) == 1  ||  Math.floor(entity.animationTimer) == 5 ){
      entity.chooseRandomSound([soundIsloadet.playerStepsOne], false);
      this.soundIsAlreadyPlayed = true
    }

    }
  checkConditions(entity) {
    if (entity.crouch){
      entity.stateMachine.changeState(new Crouch());
    }
    if(entity.cooldown.startAttack){
        entity.stateMachine.changeState(new Attack());
    }
    if (entity.vel[1] < 0 && !entity.onGround){
      entity.stateMachine.changeState(new Jump());
    } else if(entity.vel[1] > 0 && !entity.onGround){
      entity.stateMachine.changeState(new Fall());
    } else if(entity.acc < 0.005 && entity.acc > -0.005 && entity.onGround){
      entity.stateMachine.changeState(new Idle());
    }
    if(entity.getHit){
      entity.stateMachine.changeState(new GetHit());    
    }
    if(entity.health <= 0){
      entity.stateMachine.changeState(new Death());
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
    entity.chooseRandomSound([soundIsloadet.playerStepsThree, soundIsloadet.playerStepsTwo]);
  }

  behave(entity) {
  }

  checkConditions(entity) {
    if(!entity.crouch){
      entity.stateMachine.changeState(new Idle());
    }
    if(entity.getHit){
      entity.stateMachine.changeState(new GetHit());    
    }
    if(entity.health <= 0){
      entity.stateMachine.changeState(new Death());
    }

  }

  leaveState(entity) {
  }
}


//////////////////////////////////////
////////// ATTACK STATUS ////////////
//////////////////////////////////////
export class Attack {
  start(entity) {
    entity.vel[0] = 0;
    entity.acc = 0;
    entity.animationTimer = 0;
    entity.cooldown.startAttack = false;
    if(entity.cooldown.prepareNextAttack){
      entity.animationStatus = "attackTwo";
      entity.cooldown.prepareNextAttack = false;
    } else {
      entity.animationStatus = "attack";
    }
  }

  behave(entity) {

    if(entity.animationStatus == "attack"){
      if(Math.floor(entity.animationTimer) == 5){
        if(entity.facingLeft){
          entity.activateHitbox(entity.index , 1);
        } else{
          entity.activateHitbox(entity.index , 0);
        }
      } else if(Math.floor(entity.animationTimer) == 8){
        entity.disableHitbox(entity.index, 0, true);
      }
      if(Math.floor(entity.animationTimer) == 3){
        entity.chooseRandomSound([soundIsloadet.lightswordOne, soundIsloadet.lightswordTwo, soundIsloadet.lightswordThree]);
      }
    }

    if(entity.animationStatus == "attackTwo"){
      if(Math.floor(entity.animationTimer) == 1){
        if(entity.facingLeft){
          entity.activateHitbox(entity.index , 1);
        } else{
          entity.activateHitbox(entity.index , 0);
        }
      } else if(Math.floor(entity.animationTimer) == 3){
        entity.disableHitbox(entity.index, 0, true);
      }
      if(Math.floor(entity.animationTimer) == 1){
        entity.chooseRandomSound([soundIsloadet.lightswordOne, soundIsloadet.lightswordTwo, soundIsloadet.lightswordThree]);
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
    } else if(entity.cooldown.prepareNextAttack && !entity.animationIsRunning){
      entity.stateMachine.changeState(new Attack());    
    }

    if(entity.getHit){
      entity.stateMachine.changeState(new GetHit());    
    }
    if(entity.health <= 0){
      entity.stateMachine.changeState(new Death());
    }

  }

  leaveState(entity) {
    entity.cooldown.mainAttack = false;
    entity.disableHitbox(entity.index, 0, true);
  }
}


//////////////////////////////////////
////////// GETHIT STATUS ////////////
//////////////////////////////////////
export class GetHit {
  start(entity) {
    entity.acc = 0;
    entity.vel[0] = 0;
    entity.gethitJumpAlready = false;
    entity.screenShakeEnable(55);
    entity.animationStatus = "getHit";
    entity.type = "GetHit";
    entity.removeControll();
    entity.chooseRandomSound([soundIsloadet.hitPlayer]);
  }

  behave(entity) {
    entity.pushBack(0.45,0.95);
    if(entity.getHitAndLoseControllTimer >= entity.maxGetHitAndLoseControllTimer && !this.alreadyGetControll){
      entity.addControll();
      entity.getHit = false;
    }
  }

  checkConditions(entity) {
    if(!entity.getHit){
      entity.stateMachine.changeState(new Idle());
    }
    if(entity.health <= 0){
      entity.stateMachine.changeState(new Death());
    }
  }

  leaveState(entity) {
    entity.type = "Player";
  }
}

//////////////////////////////////////
////////// DEATH STATUS ////////////
//////////////////////////////////////
class Death {
  start(entity) {
    entity.chooseRandomSound([soundIsloadet.deathPlayer]);
    entity.animationStatus = "death";
    entity.removeControll();
    entity.type = "Death";
    entity.acc = 0;
    this.countDown = 0;
  }

  behave(entity) {
    if(!entity.animationIsRunning){
      this.countDown ++;
      if(this.countDown >= 50){      
        entity.level.levelManager.resetLevel();
      }
    }
  }

  checkConditions(entity) {
    
  }

  leaveState(entity) {
    
  }
}