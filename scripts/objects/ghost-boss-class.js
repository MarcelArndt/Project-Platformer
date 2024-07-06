import { Enemy } from "./enemy-class.js";
import { StateMachine, Idle } from "./stateMashine-ghost-boss-class.js";
import { imageIsloadet, soundIsloadet } from "../assets.js";
import { ctx, canvas} from "../canvas.js";
import { StatusBar } from "./statusBar-class.js";
import { Skelett } from "./skelett-class.js";

let animationImage = imageIsloadet.ghost

export class GhostBoss extends Enemy{
    constructor(options, type){
        super({
            spriteSheet: animationImage,
            pos: options.pos,
            size: options.size,
            color: options.color || "black",
            grav: 0,
            friction: options.friction || 0.2,
            jumpspeed: options.jumpspeed ||  -0.85,
            walkspeed: options.walkspeed || 0.005,
            aggroRange: options.aggroRange || 625,
            smallAggroRange: options.smallAggroRange || 150,
            HitPoints: options.HitPoints || 30,
            invincibilityTimer: options.invincibilityTimer || 575,
            type: type || "Enemy"
        });
        this.subType = "Boss";
        this.status = "idle";
        this.animationStatus = "idle";
        this.prevStatus = "idle";
        this.stateMachine = new StateMachine(new Idle(), this);
        this.originalPos = [... this.pos];
        this.originalWalkspeed = options.walkspeed;
        this.grav = 0;

        this.animationFrames = {
            idle: [[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}, {x:4, y:0}], true],
            walking: [[{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}], true],
            chasing: [[{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}], true],
            attack: [[{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}, {x:4, y:3}, {x:5, y:3}, {x:6, y:3}, {x:7, y:3}, {x:8, y:3}, {x:9, y:3}, {x:10, y:3}], false],
            attackTwo: [[{x:10, y:3}, {x:9, y:3}, {x:6, y:3}, {x:5, y:3}, {x:4, y:3}, {x:3, y:3}, {x:2, y:3}, {x:1, y:3}, {x:2, y:3}, {x:1, y:3}, {x:2, y:3}, {x:1, y:3}, {x:2, y:3}, {x:1, y:3}, {x:0, y:3}, {x:10, y:3}, {x:9, y:3},], false],
            death: [[{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}], false],
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
        this.scaling = 0.4;
        this.status = "idle";
        this.frameWidth = 315;
        this.frameHight = 307;
        this.animationImage = imageIsloadet.ghost;
        this.frameHightOffset = -75;
        this.frameWidthOffset = 85;
        this.currentTime = 0;
        this.isAbove = false;
        this.scoreValue = options.scoreValue || 250;
        this.isTurningBack = false;
        this.distanceToPlayer = 0;
        this.distanceYToPlayer = 0
        this.distanceXToPlayer = 0;
        this.health = 60;
        this.statusbar = new StatusBar( this.health || 30, this.health, [canvas.width * 0.8 / 2 - imageIsloadet.liveBarBossImageFull.width , (canvas.height * 0.8 / 6 * 4) - imageIsloadet.liveBarBossImageFull.height - 5], imageIsloadet.liveBarBossImageFull, imageIsloadet.liveBarBossImageEmpty, [11,10], 650 )
        this.summonMinionTimer = 0;
        this.isAlreadySummon = true;
    }


    checkForCooldown(){
        this.currentTime = new Date();
        if (this.currentTime - this.cooldown.MainAttackCooldownValue > this.cooldown.latestDateOfAttack && this.cooldown.isMainAttack){
            this.cooldown.isMainAttack = false;
        }
    }


    update(deltaTime){
        this.facingTowardsPlayer();
        super.update(deltaTime);
        this.setAbovePlayer();
        this.checkDistanceToPlayer();
        this.adjustLevelCamera();
        this.statusbar.update(this.health, this.distanceToPlayer);
        this.drawConnectionLine();
        this.prepareSpawnMinionAtPlayer(deltaTime);
    }


    setAbovePlayer(){
       if(this.isAbove){
        this.teleportingUpwards()
       }
    }


    prepareSpawnMinionAtPlayer(deltaTime){
        let secDeltaTimer = deltaTime / 1000;
        let calculateRandomLeft = 0;
        let calculateRandomRight = 0;
        let spawnableArray = [];
        if (!this.isAlreadySummon){
            this.summonMinionTimer += secDeltaTimer;
            calculateRandomLeft = this.level.player.pos[0] - 100 - Math.floor(Math.random() * 125);
            calculateRandomRight = this.level.player.pos[0] + 100 + Math.floor(Math.random() * 125);
            if( Math.floor(this.summonMinionTimer) >= 1){
                spawnableArray = this.checkForSpaceNearPlayer(calculateRandomLeft, calculateRandomRight);
                this.spawnEnemy(spawnableArray, calculateRandomLeft, calculateRandomRight);
                this.isAlreadySummon = true;
                this.summonMinionTimer = 0;
            }
        }
    }

    spawnEnemy(spawnableArray, SpawnPointLeft, SpawnPointRight){
        let finalSpawnPoint = 0;
        let notSpawnAble = false;
        if(!spawnableArray[0] && !spawnableArray[1]){
            finalSpawnPoint = Math.floor(Math.random() * 2 ) == 0 ? SpawnPointLeft : SpawnPointRight;
        } else if(!spawnableArray[0]){
            finalSpawnPoint = SpawnPointLeft;
        } else if (!spawnableArray[1]){
            finalSpawnPoint = SpawnPointRight;
        } else {
            notSpawnAble = true;
        }
        if(!notSpawnAble && this.distanceToPlayer <= 650){
            this.level.pushNewObject(new Skelett({ pos: [finalSpawnPoint, this.level.player.pos[1] - 74], size: [30, 74], color: "#FFD53D",}))
            this.level.minionCounter++;
            this.level.createDemageboxes();
        }
    }


    checkForSpaceNearPlayer(spawnPointLeft, spawnPointRight){
        let isCollisionArray = [false, false];
        let collideRight = false;
        let collideLeft = false;
        this.level.objects.forEach( (obj ) => {
            collideRight = this.level.player.collideWith(obj, [spawnPointRight -this.level.player.pos[0], 0]);
            if(collideRight){
                isCollisionArray[1] = true;
            }
            collideLeft = this.level.player.collideWith(obj, [spawnPointLeft -this.level.player.pos[0], 0] );
            if(collideLeft){
                isCollisionArray[0] = true;
            }
        });
        return isCollisionArray;
    }



    teleportingUpwards(){
        this.setBottom(this.level.player.posTop - this.size[1] - 50);
    }


    teleportingDownwards(){
        this.setBottom(this.level.player.posBottom);
    }


    distanceToOrigin(){
        let distanceX = this.pos[0] - this.originalPos[0];
        return distanceX
    }

    adjustLevelCamera(){
        if(this.distanceToPlayer < 550 && this.level.cameraHeightOffset <= 100){
            this.level.cameraHeightOffset ++;
        }   else if(this.distanceToPlayer > 700 && this.level.cameraHeightOffset > 0){
            this.level.cameraHeightOffset --;
        } 
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


    facingTowardsPlayer(){
        let distanceX = this.pos[0] - this.level.player.pos[0];
        if(distanceX > 0){
            this.facingLeft = true;
        } else if(distanceX < 0) {
            this.facingLeft = false;
        }
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

    checkDistanceToPlayer(){
        this.distanceXToPlayer = (this.pos[0] + (this.size[0] / 2 )) - (this.level.player.pos[0] + (this.level.player.size[0] / 2));
        this.distanceYToPlayer = (this.pos[1] + (this.size[1] / 2 )) - (this.level.player.pos[1] + (this.level.player.size[1] / 2));
        this.distanceToPlayer = Math.floor(Math.hypot(this.distanceXToPlayer, this.distanceYToPlayer));
    }


    drawConnectionLine(){
        if(this.level.showDebug){
            ctx.strokeStyle = 'grey';
            ctx.beginPath();
            ctx.moveTo((this.pos[0] + (this.size[0] / 2 )) - this.level.cameraPos[0] , (this.pos[1] + (this.size[1] / 2 )) - this.level.cameraPos[1]);
            ctx.lineTo((this.level.player.pos[0] + (this.level.player.size[0] / 2)) - this.level.cameraPos[0] ,(this.level.player.pos[1] + (this.level.player.size[1] / 2)) - this.level.cameraPos[1])
            ctx.stroke();
        }
    }





    airStrike(){

    }

    goInIdle(){

    }
   

}