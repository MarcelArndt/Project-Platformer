import { Box } from "./box-class.js";
import { StateMachine, Idle } from "./stateMashine-player-class.js";
import { StatusBar } from "./statusBar-class.js";
import { imageIsloadet } from "../assets.js";

export class Player extends Box {
  constructor(options, type) {
    super(
      {
        pos: options.pos,
        size: options.size,
        color: options.color || "blue",
        grav: 0.005,
        friction: 0.2,
        health: options.health || 3,
      },
      type || "Player"
    );
    this.fraction = 0.35;
    this.facingLeft = true;
    this.crouch = false;
    this.jumpseed = -1.2;
    this.walkspeed = 0.011;
    this.originWalkspeed = this.walkspeed
    this.coyoteTime = 75;
    this.isCoyoteTimeReady = true;
    this.latestOnGround = 0;
    this.currentCoyoteTime = null;
    this.status = "idle";
    this.getHit = false;
    this.getHitLeft = false;
    this.prevStatus = "";
    this.prevKeyInput = "";
    this.health = options.health || 50;
    this.stateMachine = new StateMachine(new Idle(), this);

    this.cooldown = {
      getHurt : 0,
      dash: false,
      dashCooldown: "",
      mainAttack: false,
      isInMainAttack: false,
      mainCooldown: "",
      mainKeyIsPressed: false,
      mainCooldownValue: 1050,
      mainCurrentFiringSetTimer: "",
    };
    this.jump = {
      alreadyInJump: false,
      currentPressingKey: false,
      jumpseed: -1.025,
      latestJump: "",
      latestKeyUp: "",
      maxWalljump: 2,
      isOnWall: false,
    };
    this.pressedKeys = [];
    this.keyfunctionPressRef = (e) => this.keyPressedFunction(e);
    this.keyfunctionUpRef = (e) => this.keyUpFunction(e);
    this.statusbar = new StatusBar( options.health || 30, this.health, [25,20], imageIsloadet.liveBarImageFull, imageIsloadet.liveBarImageEmpty, [43,0] )
    this.createHitBox(this.pos, [70,44], [-55,10], {lifespan: 10, demageFlag: "Enemy", forceToLeft: false, color: "rgba(255,255,0,0.25)"}, this,)
    this.createHitBox(this.pos, [70,44], [22,10], {lifespan: 10, demageFlag: "Enemy", forceToLeft: true, color: "rgba(255,75,0,0.25)"}, this,)
    this.addControll();
  }

  keyPressedFunction(event){
    if(!this.gethit && !this.crouch){
      switch(event.key){
        case "a": case "ArrowLeft":  this.move("left"); break;
          case "d": case "ArrowRight": this.move("right");break;
          case "w": case "ArrowUp": case " ": this.playerJump();  event.stopPropagation(); event.preventDefault(); break;
          case "s": case "ArrowDown": if(this.onGround){this.inCrouch()} ; break;
          case "f": case "Enter": this.playerAttack(); break;
      }
    }
  }

    keyUpFunction(event){
      switch(event.key){
        case "a": case "ArrowLeft":  this.stopMove(); break;
        case "d": case "ArrowRight": this.stopMove(); break;
        case "s": case "ArrowDown":  this.outCrouch(); break;
      }
    }

  addControll() {
    document.addEventListener("keypress", this.keyfunctionPressRef);
    document.addEventListener("keyup", this.keyfunctionUpRef);
  }

  removeControll() {
    document.removeEventListener("keypress", this.keyfunctionPressRef);
    document.removeEventListener("keyup", this.keyfunctionUpRef);
  }

  checkFacingLeft(){
    if (this.acc > 0){
      this.facingLeft = true;

    } else if(this.acc < 0){
      this.facingLeft = false;
    }
  }

  checkIsHit(){
    for (let i = 0; i < Object.keys(this.level.demageBoxes).length; i++){
        this.level.demageBoxes[Object.keys(this.level.demageBoxes)[i]].forEach((Hitbox) => {
            if(this.collideWith(Hitbox) && !this.gethit && Hitbox.isAktiv && Hitbox.demageFlag == "Player"){
                switch (Hitbox.forceToLeft){
                    case true: this.getHitLeft = true; break;
                    case false: this.getHitLeft = false; break;
                }
                this.gethit = true;
                this.cooldown.getHurt = 0;
                this.reduceHealth(Hitbox.demage);
            }
        })
    }
}

  checkInvincibilityTimer(deltaTime){
    if(this.gethit){
      let secDeltaTime = deltaTime / 100;
      this.cooldown.getHurt += secDeltaTime;
      if(Math.floor(this.cooldown.getHurt) >= 4 && this.onGround) {
        this.gethit = false;
      }
    }
  }

  reduceHealth(Value){
    this.health += -Value;
    this.statusbar.refreshValue(this.health);
  }

  move(direction) {
    if (direction == "left"){
      this.acc = -this.walkspeed;
    } else if (direction == "right"){
      this.acc = this.walkspeed;
    }
    this.checkFacingLeft();
  }

  stopMove() {
    this.acc = 0;
  }

  inCrouch(){
    this.stopMove(); 
    this.vel[0] = 0;
    if (!this.crouch){
      this.crouch = true;
      this.size[1] = this.size[1] / 2
      this.setTop(this.posTop + (this.size[1]))
    }
  }

  outCrouch(){
    if (this.crouch){
      this.crouch = false;
      this.size[1] = this.size[1] * 2
      this.setBottom(this.posBottom - (this.size[1] / 2))
    }
  }

  playerJump() {
    if (
      (this.onGround && !this.crouch) ||
      (this.isCoyoteTimeReady && !this.crouch)
    ) {
      this.vel[1] += this.jumpseed;
      this.onGround = false;
      this.jump.alreadyInJump = false;
      this.isCoyoteTimeReady = false;
      clearTimeout(this.currentCoyoteTime);
    }
  }
  checkKeyPressedTime(keyIsPressedTime) {
    if (keyIsPressedTime - 1000 >= this.jump.latestJump) {
      return false;
    }
    return true;
  }

  pushObject(box) {
    return {
      toLeft: () => {
        if (box.type !== "Box") return false;
        const distance = box.posRight - this.posLeft;
        if (box.canBeMoved([-distance, 0])) {
          box.setRight(this.posLeft);
          return true;
        }
        const smallGap = box.getRemainingDistanceLeft();
        if (box.canBeMoved([-smallGap, 0])) {
          box.setLeft(box.posLeft - smallGap);
          this.setLeft(box.posRight);
          return true;
        }
        return false;
      },

      toRight: () => {
        if (box.type !== "Box") return false;
        const distance = this.posRight - box.posLeft;
        if (box.canBeMoved([distance, 0])) {
          box.setLeft(this.posRight);
          return true;
        }
        const smallGap = box.getRemainingDistanceRight();
        if (box.canBeMoved([-smallGap, 0])) {
          box.setRight(box.posRight + smallGap);
          this.setRight(box.posLeft);
          return true;
        }
        return false;
      },
    };
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.checkIsHit()
    this.updateFrameAnimation(deltaTime);
    this.checkCoyoteTime();
    this.ceckCooldown();
    this.checkInvincibilityTimer(deltaTime);
    this.stateMachine.updateState();
    this.statusbar.update(this.health);
  }

  playerAttack() {
    if (
      !this.cooldown.mainAttack &&
      this.status != "jump" &&
      this.status != "crouch"
    ) {
      this.vel[0] = 0;
      this.acc = 0;
      this.cooldown.isInMainAttack = true;
      this.cooldown.mainAttack = true;
      this.cooldown.mainCooldown = new Date();
    }
  }

  ceckCooldown() {
    let currentTime = new Date();
    this.checkMainAttackCooldown(currentTime);
  }

  checkMainAttackCooldown(currentTime) {
    if (
      currentTime - this.cooldown.mainCooldownValue >
      this.cooldown.mainCooldown
    ) {
      this.cooldown.mainAttack = false;
    }
  }

  checkCoyoteTime() {
    if (this.onGround && !this.isCoyoteTimeReady) {
      this.isCoyoteTimeReady = true;
    } else if (!this.onGround && this.isCoyoteTimeReady) {
      this.startCoyoteTime();
    }
    if (this.status != "Jump" && this.isCoyoteTimeReady && !this.onGround) {
      this.grav = 0;
    } else {
      this.grav = 0.005;
    }
  }

  startCoyoteTime() {
    this.latestOnGround = new Date();
    this.currentCoyoteTime = setTimeout(() => {
      this.isCoyoteTimeOver();
    }, this.coyoteTime);
  }

  isCoyoteTimeOver() {
    let currentTime = new Date();
    if (currentTime - this.coyoteTime >= this.currentCoyoteTime) {
      this.isCoyoteTimeReady = false;
    }
  }
}