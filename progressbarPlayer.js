import utility from './utility.js';
const { isObject } = utility;

export default class Progressbar {
  constructor(config) {
    config = isObject(config) ? config : {};
    this.audio = config
    this.bar = $('<div>').attr('id', 'progressbar').appendTo('body');
    $('#progressbar').slider({
      slide: (event, ui) => this.audio.timeLineJump(this.audio.getTotalFrames() * ui.value * 0.01)
    }).css('margin','0px 30px 0px');
  }

  upadteBar(fps) {
    let completedPercentage = (fps / this.audio.getTotalFrames()) * 100;
    $('#progressbar span').css('left', `${completedPercentage}%`)
  }
}