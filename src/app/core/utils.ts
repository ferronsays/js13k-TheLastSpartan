import V2 from "./V2";
import { TILESIZE } from "../constants";

export var i2c = (pt) => {
  var cartPt = new V2(0, 0);
  cartPt.x = ((pt.x - pt.y) * TILESIZE.x) / 2;
  cartPt.y = ((pt.x + pt.y) * TILESIZE.y) / 2;
  return cartPt;
};

export var c2i = (pt) => {
  var map = new V2();
  map.x = pt.x / TILESIZE.x + pt.y / TILESIZE.y;
  map.y = pt.y / TILESIZE.y - pt.x / TILESIZE.x;
  return map;
};

// export var degreesToRadians = (degrees) => {
//   return (degrees * Math.PI) / 180;
// };

// export var radiansToDegrees = (radians) => {
//   return (radians * 180) / Math.PI;
// };

// export var wrapAngle = (r) => {
//   while (r < -Math.PI) {
//     r += Math.PI * 2;
//   }
//   while (r > Math.PI) {
//     r -= Math.PI * 2;
//   }

//   return r;
// };

export var rndPN = () => {
  return Math.random() * 2 - 1;
};

export var rndRng = (from, to) => {
  return ~~(Math.random() * (to - from + 1) + from);
};

export var inRng = (value, min, max) => {
  return value >= min && value <= max;
};

export var rndInArray = (a) => a[~~(Math.random() * a.length)];

export var waterTile = (t) => {
  return t <= 1;
};

export var walkTile = (t) => {
  if (/*t === 0 || t === 1 || t === 9 ||*/ t === undefined || t === null) {
    return false;
  }

  return true;
};

export var debounce = (func, wait, immediate) => {
  var timeout;
  return (...args: any[]) => {
    var context = this;
    var later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export class rect {
  public _left: number;
  public _top: number;
  public _width: number;
  public _height: number;
  public _right: number;
  public _bottom: number;

  constructor(left, top, width, height) {
    this._left = left || 0;
    this._top = top || 0;
    this._width = width || 0;
    this._height = height || 0;
    this._right = this._left + this._width;
    this._bottom = this._top + this._height;
  }

  set(_left, _top, /*optional*/ _width, /*optional*/ _height) {
    this._left = _left;
    this._top = _top;
    this._width = _width || this._width;
    this._height = _height || this._height;
    this._right = this._left + this._width;
    this._bottom = this._top + this._height;
  }

  // get mid() {
  //   return new V2(this._left + this._width / 2, this._top + this._height / 2);
  // }

  // within(r) {
  //   return (
  //     r._left <= this._left &&
  //     r._right >= this._right &&
  //     r._top <= this._top &&
  //     r._bottom >= this._bottom
  //   );
  // }

  // overlaps(r) {
  //   return (
  //     this._left < r._right &&
  //     r._left < this._right &&
  //     this._top < r._bottom &&
  //     r._top < this._bottom
  //   );
  // }

  // TODO REMOVE
  // _draw(ctx) {
  //   ctx._wrap(() => {
  //     ctx.line_Width = 1;
  //     ctx.strokeStyle = "#f00";
  //     ctx._beginPath();
  //     ctx.rect(this._left, this._top, this._width, this._height);
  //     ctx.stroke();
  //   });
  // }
}
