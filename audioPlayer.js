import utility from './utility.js';

const { isFunction, isNumber, isObject } = utility;

export default class AudioPlayer {
  constructor(config) {
    config = isObject(config) ? config : {};
    this.src = config.src;
    this.onStart = isFunction(config.onStart) ? config.onStart : function () { };
    this.onPause = isFunction(config.onPause) ? config.onPause : function () { };
    this.onEnd = isFunction(config.onEnd) ? config.onEnd : function () { };
    this.currentFrame = isFunction(config.currentFrame) ? config.currentFrame : function () { }
    this.fps = isNumber(config.fps) ? config.fps : 24;
    this.audioObj = new Audio()
    this.audioObj.src = this.src;
    this.audioObj.load();
    this.audioObj.autoplay = false;
    this.audioObj.onended = this.onEnd;
    this.isAudioPlaying = false;
    this.audioObj.addEventListener('loadedmetadata', () => {
      this.audioDuration = this.getDuration();
    });
  }

  timer() {
    let time = this.getCurTime()
    let FPS = this.getCurFrame();
    if (this.isAudioPlaying) {
      this.myReq = window.requestAnimationFrame(() => this.timer())
      this.currentFrame({ FPS, time })
    }
    if (this.audioObj.ended) {
      this.isAudioPlaying = false
      cancelAnimationFrame(this.myReq)
    }
  }

  audioPlay() {
    if (this.isAudioPlaying) return;
    this.isAudioPlaying = true;
    this.audioObj.play();
    this.onStart();
    window.requestAnimationFrame(() => this.timer());
  }

  audioPause() {
    if (!this.isAudioPlaying) return;
    this.isAudioPlaying = false;
    this.audioObj.pause();
    this.onPause();
  }

  getCurTime() {
    return this.audioObj.currentTime;
  }

  getCurFrame() {
    return Math.ceil(this.fps * this.audioObj.currentTime);
  }

  getDuration() {
    return this.audioObj.duration;
  }

  getTotalFrames() {
    return Math.ceil(this.fps * this.getDuration());
  }

  timeLineJump(frame) {
    this.audioObj.currentTime = frame / this.fps;
  }
}