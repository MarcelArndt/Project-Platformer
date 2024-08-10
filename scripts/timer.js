export class Timer {
  constructor(deltaTime = 1000 / 60) {
    this.lastTime = null;
    this.accumulatedTime = 0;
    this.deltaTime = deltaTime;
    this.pause = false;
  }


  /**
  * the game-loop itself to repeat any update-loop inside the game.
  */
  start() {
    requestAnimationFrame(this.loop.bind(this));
  }


  /**
  *  if game doesn't start already and isn't paused it will start this loop and will manage the timeValue to prevent lag spikes.
  */
  loop(currentTime) {
    if (this.pause) return;
    if (this.lastTime) {
      this.accumulatedTime += currentTime - this.lastTime;
      if (this.accumulatedTime > 1000) {
        this.accumulatedTime = 1000;
      }
      while (this.accumulatedTime > this.deltaTime) {
        this.update(this.deltaTime);
        this.accumulatedTime -= this.deltaTime;
      }
    }
    this.lastTime = currentTime;
    this.start();
  }

  /**
   *  set the loop into pause mode
   */
  getInPause() {
    this.lastTime = null;
    this.pause = true;
  }

  /**
   * 
   * @param {this.deltaTime or 1000 / 60} deltaTime - TimeValue to send it any further, for furher updates in some objects for Example
   *  this update function need to be in level.js to update all objects inside this current time loop
   */
  update(deltaTime) {
    
  }
}
