import utility from './utility.js';
import * as constant from './constant.js';
const { loadTextFile } = utility;

export default class TimelineClass {
  constructor(config) {
    this.jsonObj = {};
    this.jsonObj.preloadarr = {};
    this.jsonObj.mainTimeLine = {};
    config.pageData = config.pageData || {};
    config.images = config.images || {};

    loadTextFile(config.pageData, (data) => {
      this.pageData = JSON.parse(data);

      let str = '{';
      this.pageData.preloadarr.forEach((preloadObj, index) => {
        str += `"${index}":{"p":"${preloadObj.p}", "w":"${preloadObj.w}", "h":"${preloadObj.h}", "x":"${preloadObj.x}", "y":"${preloadObj.y}"},`;
      })

      str = str.substring(0, str.length - 1);
      str += `}`;
      this.jsonObj.preloadarr = JSON.parse(str);


      str = "{";

      for (let index = 0; index < this.pageData.totalFrames; index++) {
        str += `"f_${index}":{"o":[]},`;
      }

      str = str.substring(0, str.length - 1);
      str += `}`;
      this.jsonObj.mainTimeLine = JSON.parse(str);

      this.pageData.preloadarr.forEach((preloadObj, i) => {
        preloadObj.fr.forEach((frObj, j) => {
          for (let n = frObj.s; n < frObj.e; n++) {
            let obj = frObj.o;
            obj.n = i;
            obj.m = preloadObj.m;
            this.jsonObj.mainTimeLine[`f_${n}`].o.push(obj);
          }
        })
      })
    })

    loadTextFile(config.images, (data) => {
      this.images = JSON.parse(data);
      this.preloadImages();
    })

    this.cnv = document.createElement('canvas');
    this.ctx = this.cnv.getContext('2d');
    document.body.appendChild(this.cnv);

    this.cnv.width = constant.canvasWidth;
    this.cnv.height = constant.canvasHeight;
    this.resizeCanvas();

    $(window).resize(() => this.resizeCanvas());
    this.imgObj = {};
    this.lodedCnt = 0;
    this.loadCnt = 0;
  }

  resizeCanvas() {
    this.scaleX = window.innerWidth / constant.containerWidth;
    this.scaleY = window.innerHeight / constant.containerHeight;
    this.cnv.width = constant.canvasWidth * this.scaleX;
    this.cnv.height = constant.canvasHeight * this.scaleY;
  }

  draw(curIndex) {
    if (!this.pageData) return;
    if (!this.jsonObj.mainTimeLine[`f_${curIndex}`]) return;
    let tempArr = this.jsonObj.mainTimeLine[`f_${curIndex}`].o;
    this.cnv.width = this.cnv.width;

    tempArr.forEach((arrObj) => {
      // drawing
      this.ctx.save();
      if (arrObj.r) {
        this.ctx.translate(arrObj.x * this.scaleX, arrObj.y * this.scaleY);
        this.ctx.rotate(arrObj.r * Math.PI / 180);
        this.ctx.translate(-1 * (arrObj.x * this.scaleX), -1 * (arrObj.y * this.scaleY));
      }
      else {
        if (arrObj.a == 180 || arrObj.b == 180) {
          this.ctx.translate(arrObj.b == 180 ? arrObj.x * this.scaleX : 0, arrObj.a == 180 ? arrObj.y * this.scaleY : 0);
          this.ctx.scale(arrObj.b == 180 ? -1 : 1, arrObj.a == 180 ? -1 : 1);
          this.ctx.translate(arrObj.b == 180 ? -1 * (arrObj.x * this.scaleX) : 0, arrObj.a == 180 ? -1 * (arrObj.y * this.scaleY) : 0);
        }
        if ((arrObj.a > 0 && arrObj.a < 180) || (arrObj.b > 0 && arrObj.b < 180)) {
          this.ctx.translate(arrObj.x * this.scaleX, arrObj.y * this.scaleY);
          this.ctx.rotate(arrObj.b * Math.PI / 180);
          this.ctx.translate(-1 * (arrObj.x * this.scaleX), -1 * (arrObj.y * this.scaleY));
        }
      }
      this.ctx.globalAlpha = arrObj.o;
      if (this.imgObj[arrObj.n]) {
        this.ctx.drawImage(this.imgObj[arrObj.n].img, (arrObj.x - (this.imgObj[arrObj.n].x * arrObj.c)) * this.scaleX, (arrObj.y - (this.imgObj[arrObj.n].y * arrObj.d)) * this.scaleY, arrObj.w * this.scaleX, arrObj.h * this.scaleY);
      }
      this.ctx.restore();
    })
  }

  preloadImages() {
    this.loadImages();
  }

  loadImages() {
    let _imageDataObj = {};
    if (!this.images) return;

    _imageDataObj = this.images;

    this.pageData.preloadarr.forEach((obj, i) => {
      let _p = obj.p;
      if (_p.indexOf("/") !== -1) {
        _p = _p.split("/").reverse().shift();
      }
      if (_imageDataObj[_p]) {
        this.imgObj[i] = obj;
        this.imgObj[i].img = new Image();
        this.imgObj[i].img.onload = () => this.imgloaded();
        this.imgObj[i].img.src = _imageDataObj[_p];
        this.loadCnt++;
      }
    })
  }

  imgloaded() {
    this.lodedCnt++;
    if (this.lodedCnt === this.loadCnt) {
      this.images = "";
    }
  }
}
