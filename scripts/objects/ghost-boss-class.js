import { Enemy } from "./enemy-class.js";
import { StateMachine, Init } from "./stateMashine-ghost-boss-class.js";
import { imageIsloadet, soundIsloadet } from "../assets.js";
import { ctx, canvas} from "../canvas.js";
import { StatusBar } from "./statusBar-class.js";
import { Skelett } from "./skelett-class.js";
import { Collider } from "./collider-class.js";

export class GhostBoss extends Enemy{
    constructor(options, type){
        super({
            spriteSheet: imageIsloadet.ghost,
            pos: options.pos,
            size: options.size,
            color: options.color || "black",
            grav: 0,
            friction: options.friction || 0.2,
            jumpspeed: options.jumpspeed ||  -0.85,
            walkspeed: options.walkspeed || 0.008,
            aggroRange: options.aggroRange || 625,
            smallAggroRange: options.smallAggroRange || 150,
            HitPoints: options.HitPoints || 30,
            invincibilityTimer: options.invincibilityTimer || 575,
            type: type || "Enemy"
        });
        this.subType = "Boss";
        this.animationStatus = "idle";
        this.prevStatus = "idle";
        this.stateMachine = new StateMachine(new Init(), this);
        this.originalPos = [... this.pos];
        this.originalWalkspeed = options.walkspeed;
        this.bossMusic = options.currentBossMusic || soundIsloadet.battleBoss;
        this.collider = new Collider(this);
        this.grav = 0;
        this.isAlive = true;
        this.musicAlreadyPlaying = false;
        this.animationFrames = {
            idle: [[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}, {x:4, y:0}], true],
            walking: [[{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}], true],
            chasing: [[{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}], true],
            attack: [[{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}, {x:4, y:3}, {x:5, y:3}, {x:6, y:3}, {x:7, y:3}, {x:8, y:3}, {x:9, y:3}, {x:10, y:3}], false],
            attackTwo: [[{x:10, y:3}, {x:9, y:3}, {x:6, y:3}, {x:5, y:3}, {x:4, y:3}, {x:3, y:3}, {x:2, y:3}, {x:1, y:3}, {x:2, y:3}, {x:1, y:3}, {x:2, y:3}, {x:1, y:3}, {x:2, y:3}, {x:1, y:3}, {x:0, y:3}, {x:10, y:3}, {x:9, y:3},], false],
            death: [[{x:0, y:4}, {x:1, y:4}, {x:2, y:4}, {x:3, y:4}, {x:4, y:4}, {x:5, y:4}, {x:6, y:4}, {x:7, y:4}], false],
            getHit: [[{x:0, y:2}, {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:4, y:2}, {x:5, y:2}], false],
            jump: [[{x:0, y:0}], false],
            fall: [[{x:0, y:0}], false],
            teleport: [[{x:0, y:1},{x:0, y:2},{x:0, y:1},{x:0, y:2},{x:0, y:1},{x:0, y:2},{x:0, y:2},{x:0, y:2}], false],
        }

        this.cooldown = {
            isMainAttack: false,
            latestDateOfAttack: "",
            MainAttackCooldownValue: 1350,
            secondAttackCooldownValue: 1350,
        }
        this.scaling = 0.375;
        this.status = "idle";
        this.frameWidth = 315;
        this.frameHight = 307;
        this.animationImage = imageIsloadet.ghost;
        this.frameHightOffset = -75;
        this.frameWidthOffset = 85;
        this.currentTime = 0;
        this.maxInvincibilityTimer = 0.55;
        this.isAbove = false;
        this.scoreValue = options.scoreValue || 250;
        this.isTurningBack = false;
        this.distanceToPlayer = 0;
        this.distanceYToPlayer = 0
        this.distanceXToPlayer = 0;
        this.maxHealth = 60;
        this.health = this.maxHealth
        this.moveRange = 300;
        this.maxInvincibilityTimer = 1;
        this.alreadyTeleport = false;
        this.statusbar = new StatusBar( this.health || 30, this.health, [(canvas.width * 0.8 / 2 ) - imageIsloadet.liveBarBossImageFull.width + 37 , (canvas.height * 0.8 / 6 * 4) - imageIsloadet.liveBarBossImageFull.height - 15], imageIsloadet.liveBarBossImageFull, imageIsloadet.liveBarBossImageEmpty, [6.25,13], 650, 0.64 );
    }


    checkForCooldown(){
        this.currentTime = new Date();
        if (this.currentTime - this.cooldown.MainAttackCooldownValue > this.cooldown.latestDateOfAttack && this.cooldown.isMainAttack){
            this.cooldown.isMainAttack = false;
        }
    }

    update(deltaTime){
        super.update(deltaTime);
        this.facingTowardsPlayer();
        this.checkIsAbove();
        this.checkDistanceToPlayer();
        this.adjustLevelCamera();
        this.statusbar.update(this.health, this.distanceToPlayer);
        this.drawConnectionLine();
        this.adjustMusik();
    }

    spawnNewMinion(Amount){
        let distance = this.distancePlayerToOrigin();
        let finalSpawnPoint = 0;
        let lastSpawnPoint = 0; 
        for (let i = 0; i < Amount; i++){
            if(this.level.minionCounter <= 3 && distance < 500){
                finalSpawnPoint = this.checkForSpawnPoint(lastSpawnPoint);
                lastSpawnPoint = finalSpawnPoint;
                if(finalSpawnPoint != false){
                    this.level.pushNewObject(new Skelett({ pos: [finalSpawnPoint, this.level.player.pos[1] - 76], size: [30, 74], color: "#FFD53D",}));
                }
            }
        }
    }

    checkForSpawnPoint(lastSpawnPoint){
        let spawnPoint = this.generateNewSpawnPoint();
        let isNotPossibleToSpawn = this.checkForPossibleToSpawn(spawnPoint);
        for (let i = 0; i < 30; i++){
            if( isNotPossibleToSpawn || Math.abs(lastSpawnPoint - spawnPoint) <= 45){
                spawnPoint = this.generateNewSpawnPoint();
                isNotPossibleToSpawn = this.checkForPossibleToSpawn(spawnPoint);
            } else {
                break;
            }
        }
        if(isNotPossibleToSpawn) {
            spawnPoint = false;
        }
        return spawnPoint;
    }

    checkForPossibleToSpawn(spawnPoint){
        let isNotPossibleToSpawn = false;
        let isCollision = false;
        this.level.objects.forEach( (obj ) => {
            isCollision = this.level.player.collideWith(obj, [spawnPoint - this.level.player.pos[0], 0]);
            if(isCollision){
                isNotPossibleToSpawn = true;
            }
         });
        return isNotPossibleToSpawn;
    }

    generateNewSpawnPoint(){
        let randomizer = [
            this.level.player.pos[0] - 95 - Math.floor(Math.random() * 125),
            this.level.player.pos[0] + 95 + Math.floor(Math.random() * 125)
        ]
        return randomizer[Math.floor(Math.random() * randomizer.length)];
    }

    teleporting(){
        let distance = this.distancePlayerToOrigin();
        if(!this.alreadyTeleport && this.pos[0] > this.originalPos[0] - this.moveRange && this.pos[0] < this.originalPos[0] + this.moveRange && distance < 600){
            this.isAbove = this.isAbove == false ? true:false;
            this.alreadyTeleport = true;
            let finalSpawnPoint = this.checkForSpawnPoint(this.pos[0]);
            this.pos[0] = finalSpawnPoint != false ? finalSpawnPoint:this.pos[0];
            if(this.isAbove){
                this.setBottom(this.level.player.posTop - this.size[1] - 50);
            } else if(!this.isAbove){
                this.setBottom(this.level.player.posBottom);
            }
        }
    }


    checkIsAbove(){
        if(this.isAbove && this.animationStatus != "teleport" && this.distanceYToPlayer < -20){
            this.setBottom(this.level.player.posTop - this.size[1] - 50);
        }
    }


    adjustLevelCamera(){
        if(this.distanceToPlayer < 550 && this.level.cameraHeightOffset <= 100){
            this.level.cameraHeightOffset ++;
        }   else if(this.distanceToPlayer > 700 && this.level.cameraHeightOffset > 0){
            this.level.cameraHeightOffset --;
        } 
    }

    adjustMusik(){
        if(this.distanceToPlayer <= 600 && !this.musicAlreadyPlaying){
            this.level.musicManager.setNewMusik(this.bossMusic);
            this.musicAlreadyPlaying = true;
        }
        else if (this.distanceToPlayer > 600  && this.musicAlreadyPlaying){
            this.level.musicManager.setNewMusik(soundIsloadet.musicPixelDayDream);
            this.musicAlreadyPlaying = false;
        }
    }


    initMovement(){
        let randomMovement = [this.walkspeed, -this.walkspeed]
        this.acc = randomMovement[Math.floor(Math.random() * randomMovement.length)];

    }

    moveRandomly(){
        let randomChoice = Math.floor(Math.random() * 50)
        if(randomChoice == 5){
            let randomMovement = [this.walkspeed, -this.walkspeed]
            this.acc = randomMovement[Math.floor(Math.random() * randomMovement.length)];
        }
    }

    checkHomePoint(){
        let distanceX = this.distanceToOrigin();
        if(!this.isTurningBack){
            if(distanceX <= -this.moveRange){
                this.acc = this.walkspeed;
            }
            if(distanceX  >= this.moveRange) {
                this.acc = -this.walkspeed;
            }
        }
    }

    distanceToOrigin(){
        let distanceX = this.pos[0] - this.originalPos[0];
        return distanceX
    }

    distancePlayerToOrigin(){
        let distanceX = this.level.player.pos[0] - this.originalPos[0];
        if(distanceX < 0){
            distanceX *= -1
        }
        return distanceX
    }

    flyAround(){
        let distance = this.distanceToOrigin();
        let randomNumber = Math.random() * 75;
        if(randomNumber == 1 && !this.isTurningBack){
            this.acc = -this.walkspeed;
        } else if(randomNumber == 2 && !this.isTurningBack){
            this.acc = this.walkspeed;
        } else if (this.isTurningBack && distance < -300){
            this.acc = this.walkspeed;
        } else if(this.isTurningBack && distance > 300){
            this.acc = -this.walkspeed;
        } else if(this.acc == 0){
            this.acc = -this.walkspeed;
        }
        this.turnAroundBydistance();
    }

    turnAroundBydistance(){
        let distance = this.distanceToOrigin();
        if(distance < -300 && !this.isTurningBack){
            this.isTurningBack = true;
            this.acc = this.walkspeed;
        } else if(distance > 300 && !this.isTurningBack){
            this.isTurningBack = true;
            this.acc = -this.walkspeed;
        } else if(this.isTurningBack && distance < 75 && distance > -75){
            this.isTurningBack = false;
        }
    }


    facingTowardsPlayer(){
        let distanceX = this.pos[0] - this.level.player.pos[0];
        if(this.health > 0){
            if(distanceX > 0){
                this.facingLeft = true;
            } else if(distanceX < 0) {
                this.facingLeft = false;
            }
        }
    }

    checkDistanceToPlayer(){
        this.distanceXToPlayer = (this.pos[0] + (this.size[0] / 2 )) - (this.level.player.pos[0] + (this.level.player.size[0] / 2));
        this.distanceYToPlayer = (this.pos[1] + (this.size[1] / 2 )) - (this.level.player.pos[1] + (this.level.player.size[1] / 2));
        this.distanceToPlayer = Math.floor(Math.hypot(this.distanceXToPlayer, this.distanceYToPlayer));
    }

    drawConnectionLine(){
        if(this.level.showDebug){
            ctx.beginPath();
            ctx.strokeStyle = 'cyan';
            ctx.lineWidth = 2;
            ctx.moveTo((this.pos[0] + (this.size[0] / 2 )) - this.level.cameraPos[0] , (this.pos[1] + (this.size[1] / 2 )) - this.level.cameraPos[1]);
            ctx.lineTo((this.level.player.pos[0] + (this.level.player.size[0] / 2)) - this.level.cameraPos[0] ,(this.level.player.pos[1] + (this.level.player.size[1] / 2)) - this.level.cameraPos[1])
            ctx.stroke();
        }
    }
}