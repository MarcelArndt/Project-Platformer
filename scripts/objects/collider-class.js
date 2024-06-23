export class Collider {
    constructor(entity, toggle = true,){
        this.entity = entity;
        this.pos = entity.pos;
        this.vel = entity.vel || [0,0];
        this.size = entity.size;
        this.type = entity.type;
        this.subType = entity.subType || "Rectangle";
        this.isAvailable = toggle;

        this.colliderArray = [false,false,false,false]
        this.prevPos = [...entity.pos];
    }

    
        collideWith(objectRectangle, VectorOffest = [0,0]){
            if (this === objectRectangle) return false;
            return (
                this.posLeft + VectorOffest[0] < objectRectangle.posRight &&
                this.posRight + VectorOffest[0] > objectRectangle.posLeft &&
                this.posBottom + VectorOffest[1] > objectRectangle.posTop &&
                this.posTop + VectorOffest[1] < objectRectangle.posBottom
            );
        }  

    update(deltaTime){
        this.prevPos = [...this.pos];
        this.entity.level.objects.forEach((obj) => {
            this.checkFromAbove(obj);
            this.checkFromBelow(obj);
            this.checkFromLeft(obj);
            this.checkFromRight(obj);
        });

    }

    getPrevPosLeft(){
        return this.prevPos[0];
    }

    getPrevPosRight(){
        return this.prevPos[0] + this.size[0];
    }

    getPrevPosTop(){
        return this.prevPos[1];
    }

    getPrevPosBottom(){
        return this.prevPos[1] + this.size[1];
    }


    checkFromAbove(obj) {
        if (this.getPrevPosTop() <= obj.posBottom && this.getPrevPosTop() >= obj.posTop && this.entity.collideWith(obj, [this.vel[0] * 3 * -2.5 ,0]) && this.checkAll(obj, "below")) {
            this.entity.setTop(obj.posBottom);
            this.entity.vel[1] = 0;

        }
    }

    checkFromBelow(obj) {
        if (this.entity.getPrevPosBottom() <= obj.posTop && this.entity.collideWith(obj) && this.entity.checkAll(obj, "above")){
            this.entity.setBottom(obj.posTop);
            this.entity.vel[1] = 0;
            this.entity.onGround = true;
        } else {
            this.entity.jump.currentPressingKey = false;
            this.entity.jump.alreadyInJump = false
        }
        return this.entity.onGround;
    }

    checkFromLeft(obj) {
        if ( this.entity.getPrevPosLeft() >= obj.posRight && this.entity.collideWith(obj) && this.entity.checkAll(obj, "left")){
            this.entity.setLeft(obj.posRight + 1.5);
            this.entity.vel[0] = 0;
        } else if(this.entity.pushObject(obj, this.entity.level.objects).toLeft()) {
            return;
        }
    }

    checkFromRight(obj) {
        if ( this.entity.getPrevPosRight() <= obj.posLeft && this.entity.collideWith(obj) && this.entity.checkAll(obj, "right")){
            this.entity.setRight(obj.posLeft - 1.5);
            this.entity.vel[0] = 0;
        } else if(this.entity.pushObject(obj, this.entity.level.objects).toRight()){
            return;
        } 
    }
    
    checkAll(obj, direction){
        return (
            !this.checkCollideWithSemiSolidBlock(obj, direction)
            && !this.checkCollideWithEnemy(obj) 
            && !this.checkCollideWithMushroom(obj, direction)
            && !this.checkCollideWithDeadlySolidBlock(obj, direction)
            && !this.checkCollideWithDeath(obj)
            && !this.checkIsEntity(obj)
        );
    }

    checkCollideWithSemiSolidBlock(obj, direction){
        return (obj.subType == "SemiSolidBlock" && this.entity.crouch && direction == "above" || obj.subType == "SemiSolidBlock" && direction != "above" );
    }


    checkCollideWithMushroom(obj, direction){
        if(obj.subType == "Mushroom" && this.entity.type == "Player" && direction == "above"){
            this.entity.stateMachine.changeState(new Jump());
            this.entity.chooseRandomSound([soundIsloadet.bounce02]), false;
            this.entity.vel[1] = -1.5;
            return true;
        }
        return false;
    }

    checkCollideWithEnemy(obj){
        if(obj.type == "Enemy" && obj.subType != "Mushroom" && this.entity.type == "Player" && !this.entity.gethit){
            this.entity.getHitLeft = -this.facingLeft;
            this.entity.gethit = true;
            this.entity.reduceHealth(10)
            this.entity.stateMachine.changeState(new GetHit());
            return true;
        }
        return false;
    }

    checkCollideWithDeadlySolidBlock(obj, direction){
        if(obj.subType == "deadlySolidBlock" && this.entity.type == "Player" && direction == "above" || obj.subType == "deadlySolidBlock" && this.entity.type == "Enemy" && direction == "above"){
            this.entity.health = 0;
            return true;
        }
        return false
    }

    checkCollideWithDeath(obj){
        if(obj.type == "Death"){
            return  true;
        }
        return false
    }

    checkIsEntity(obj){
        if(obj.type == "Entity" && obj.subType == "Bird"){
            return  true;
        } else if(obj.type == "Entity" && obj.subType == "Item"){
            obj.activateItem();
            return  true;
        }
        return false
    }

}