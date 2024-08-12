import { Box } from "./box-class.js";
import { StateMachine, Idle } from "./stateMashine-player-class.js";
import { StatusBar } from "./statusBar-class.js";
import { ScoreBar } from "./score-class.js";
import { imageIsloadet } from "../assets.js";
import { PlayerKeyboard} from "./playerKeyboard-class.js";


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
    this.maxHealth = options.health || 50;
    this.health = options.health || 50;
    this.maxInvincibilityTimer = 1.15;
    this.maxGetHitAndLoseControllTimer = 0.5;
    this.score = options.score || 0;
    this.lives = options.lives || 3;
    this.stateMachine = new StateMachine(new Idle(), this);
    this.keyBoard = new PlayerKeyboard(this);

    this.cooldown = {
      getHurt : 0,
      dash: false,
      dashCooldown: "",
      startAttack: false,
      mainCooldown: false,
      mainKeyIsPressed: false,
      mainCooldownValue: 11,
      mainCurrentTimer: 0,
      prepareNextAttack: false,

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
    this.alreadyGetControll = false;
    this.statusbar = new StatusBar( options.health || 30, this.health, [20,17], imageIsloadet.liveBarImageFull, imageIsloadet.liveBarImageEmpty, [6.75,27], false, 1.11 );
    this.scoreBar = new ScoreBar([32,73], {addSuffix: " ", addpPrefix: "SCORE:  "});
    this.lifeCounter = new ScoreBar([59,32], {addSuffix: " ", addPrefix: "x ", decimalAmount: 2, fontSize: 10,});
    this.createHitBox(this.pos, [56,44], [-50,10], {lifespan: 10, demageFlag: "Enemy", forceToLeft: false, color: "rgba(255,255,0,1)"}, this,)
    this.createHitBox(this.pos, [56,44], [22,10], {lifespan: 10, demageFlag: "Enemy", forceToLeft: true, color: "rgba(255,255,0,1)"}, this,)
    this.keyBoard.addControll();
  }


  /**
   * switch between character is looking to the left or right
   */
  checkFacingLeft(){
    if (this.acc > 0){
      this.facingLeft = true;

    } else if(this.acc < 0){
      this.facingLeft = false;
    }
  }
 

  /**
   * let the Player move forwards
   */
  move(direction) {
    if (direction == "left"){
      this.acc = -this.walkspeed;
    } else if (direction == "right"){
      this.acc = this.walkspeed;
    }
    this.checkFacingLeft();
  }


  /**
   * let the Player stand still
   */
  stopMove() {
    this.acc = 0;
  }


  /**
   * let the Player crouch
   */
  inCrouch(){
    this.stopMove(); 
    this.vel[0] = 0;
    if (!this.crouch){
      this.crouch = true;
      this.size[1] = this.size[1] / 2
      this.setTop(this.posTop + (this.size[1]))
      this.frameHightOffset = 48;
    }
  }

   /**
   * let the Player standing up
   */
  outCrouch(){
    if (this.crouch){
      this.crouch = false;
      this.size[1] = this.size[1] * 2
      this.setBottom(this.posBottom - (this.size[1] / 2))
      this.frameHightOffset = 31;
        }
  }

   /**
   * let the Player jump
   */
  playerJump() {
    if (this.onGround && !this.crouch || this.isCoyoteTimeReady && !this.crouch) {
      this.vel[1] += this.jumpseed;
      this.onGround = false;
      this.jump.alreadyInJump = false;
      this.isCoyoteTimeReady = false;
      clearTimeout(this.currentCoyoteTime);
    }
  }

   /**
   * Push Object aside if possible to the left
   */
  pushObjectToLeft(box){
    if (box.type != "Box") return false;
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
    }

   /**
   * Push Object aside if possible to the right
   */
  pushObjectToRight(box){
    if (box.type != "Box") return false;
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
  }

  /**
  * Push Object aside if possible
  * @param {Object} box is a Object, that is possible to push aside
  */
  pushObject(box) {
    return {
      toLeft: () => pushObjectToLeft(box),
      toRight: () => pushObjectToRight(box),
    };
  }

   /**
   * Main Update-Loop
   */
  update(deltaTime) {
    super.update(deltaTime);
    this.keyBoard.update();
    this.updateFrameAnimation(deltaTime);
    this.checkCoyoteTime();
    this.ceckCooldown(deltaTime);
    this.checkVerticalSpeed();
    this.stateMachine.updateState();
    this.statusbar.update(this.health);
    this.scoreBar.update(this.score);
    this.lifeCounter.update(this.lives);
  }

   /**
   * let the Player attack
   */
  playerAttack() {
    if (!this.cooldown.mainAttack && this.status != "jump" && this.status != "crouch") {
      this.cooldown.mainAttack = true;
      this.cooldown.startAttack = true;
    }
    if(this.cooldown.mainAttack && this.animationTimer > 5){
      this.cooldown.prepareNextAttack = true;
    }
  }

   /**
   * check for cooldown after swining the sword
   */
  ceckCooldown(deltaTime) {
    let secDeltaTime = deltaTime / 100
    this.checkMainAttackCooldown(secDeltaTime);
  }

  /**
   * check for cooldown after swining the sword
   * @param {timeValue/number} currentTime - compare it against the latest timer to check if cooldown is ready
   */
  checkMainAttackCooldown(currentTime){
    if(this.cooldown.mainAttack){
      this.cooldown.mainCurrentTimer += currentTime;
      if(Math.floor(this.cooldown.mainCurrentTimer) >= this.cooldown.mainCooldownValue){
        this.cooldown.mainCurrentTimer = 0;
        this.cooldown.mainAttack = false;
        this.cooldown.startAttack = false;
      }
    }
  }

  /**
  * wil reset and check if Coyote-Time acceptable in general.
  */
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

  /**
  * start a timer if play is leaving a Platform to give him a change to jump
  */
  startCoyoteTime() {
    this.latestOnGround = new Date();
    this.currentCoyoteTime = setTimeout(() => {
      this.isCoyoteTimeOver();
    }, this.coyoteTime);
  }

  /**
  * checks for Coyote-Time is over and doesn't allow to jumo in air.
  */
  isCoyoteTimeOver() {
    let currentTime = new Date();
    if (currentTime - this.coyoteTime >= this.currentCoyoteTime) {
      this.isCoyoteTimeReady = false;
    }
  }

 /**
 * will set a maximun of jumpspeed - prevent Player of jumping to high
 */
  checkVerticalSpeed(){
    if(this.vel[1] > 1.25 ){
      this.vel[1] = 1.25;
    }
    if(this.vel[1] < (this.jumpseed * 1.4)){
      this.vel[1] = this.jumpseed;
    }
  }
}