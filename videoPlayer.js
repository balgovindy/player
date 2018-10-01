import utility from './utility.js';
const { isFunction, isNumber, isObject } = utility;

export default class VideoPlayer {
  constructor(config) {
    config = isObject(config) ? config : {};
    this.src = config.src;
    this.onStart = isFunction(config.onStart) ? config.onStart : function () { };
    this.onPause = isFunction(config.onPause) ? config.onPause : function () { };
    this.onEnd = isFunction(config.onEnd) ? config.onEnd : function () { };
    this.currentFrame = isFunction(config.currentFrame) ? config.currentFrame : function () { }
    this.fps = isNumber(config.fps) ? config.fps : 24;
    this.videoObj = document.createElement('video');
    document.body.appendChild(this.videoObj);
    this.videoObj.src = this.src;
    this.videoObj.load();
    this.videoObj.controls = true;
    this.videoObj.autoplay = false;
    this.videoObj.onended = this.onEnd;
    this.isVideoPlaying = false;
  }

  timer() {
    let time = this.getCurTime()
    let FPS = this.getCurFrame();
    if (this.isVideoPlaying) {
      this.myReq = window.requestAnimationFrame(() => this.timer())
      this.currentFrame({ FPS, time })
    }
    if (this.videoObj.ended) {
      this.isVideoPlaying = false
      cancelAnimationFrame(this.myReq)
    }
  }

  videoPlay() {
    if (this.isVideoPlaying) return;
    this.isVideoPlaying = true;
    this.videoObj.play();
    this.onStart();
    window.requestAnimationFrame(() => this.timer());
  }

  videoPause() {
    if (!this.isVideoPlaying) return;
    this.isVideoPlaying = false;
    this.videoObj.pause();
    this.onPause();
  }

  getCurTime() {
    return this.videoObj.currentTime;
  }

  getCurFrame() {
    return Math.ceil(this.fps * this.videoObj.currentTime);
  }
}