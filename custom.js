'use strict'
import audioPlayer from './audioPlayer.js';
import timelinePlayer from './timelinePlayer.js';
import progressbarPlayer from './progressbarPlayer.js';

const timeline = new timelinePlayer({
  pageData: "./pageData.json",
  images: "./images.json"
})

const runTime = (fpsObj) => {
  timeline.draw(fpsObj.FPS);
  bar.upadteBar(fpsObj.FPS);
}

window.AUDIOPLAYER = new audioPlayer({
  src: "audio.mp3",
  onStart: () => {
    console.log('audio start')
  },
  onPause: () => {
    console.log('Audio get paused...')
  },
  onEnd: () => {
    console.log('Audio get End...')
  },
  currentFrame: runTime
});

const bar = new progressbarPlayer(AUDIOPLAYER);
