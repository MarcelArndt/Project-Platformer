export class Timer {
  constructor(deltaTime = 1000 / 60) {
    this.lastTime = null;
    this.accumulatedTime = 0;
    this.deltaTime = deltaTime;
    this.pause = false;
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

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

  getInPause() {
    this.lastTime = null;
    this.pause = true;
  }

  update(deltaTime) {
    //not is this data
  }
}
