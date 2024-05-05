class Timer{
    constructor(deltaTime) {
        this.lastTime = null;
        this.accumulatedTime = 0;
        this.deltaTime = deltaTime;
        this.pause = false;
    }

        start(){
            requestAnimationFrame(this.loop.bind(this));
        }

        loop(currentTime){
            if (this.pause){
                return;
            }
            if(this.lastTime){
                this.accumulatedTime += currentTime - this.lastTime;
                if(this.accumulatedTime > 1000){
                    this.accumulatedTime = 1000;
                }
                while(this.accumulatedTime > this.deltaTime){
                    this.update(this.deltaTime);
                    this.accumulatedTime -= this.deltaTime;
                }
            }
            this.lastTime = currentTime;
            this.start();
        }

        pause(){
            this.lastTime = null;
            this.pause = true;
        }

        update(){
            //not is this data
        }


}

export const timer = new Timer (1000/60);