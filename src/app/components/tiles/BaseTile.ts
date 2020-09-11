import GameObject from "../../core/GameObject";
import V2 from "../../core/V2";
import { i2c } from "../../core/utils";
import { Game } from "../../main";
import { TILESIZE } from "../../constants";

// Colour adjustment function
// Nicked from http://stackoverflow.com/questions/5560248
export var shadeColor = (color, percent) => {
  color = color.substr(1);
  var num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

class BaseTile extends GameObject {
  public _spriteSheet: ImageData;
  public _tileType: number;
  public _height: number;
  public _isoPosition: V2;
  public _baseHeight: number;

  constructor(isox, isoy, height = 0, spriteSheet, spriteSheetYOffset) {
    super();

    this._spriteSheet = spriteSheet;
    this._tileType = spriteSheetYOffset;

    this._isoPosition = new V2(isox, isoy);
    this._position = i2c(this._isoPosition);
    this._height = this._baseHeight = height;
  }

  _draw(ctx) {
    if (Game._scene._inViewport(this._position)) {
      var h = ~~this._height;
      ctx.drawImage(
        this._spriteSheet,
        Math.floor(this._tileType * (TILESIZE.x + 1)),
        Math.floor(TILESIZE.y * h + (h * (h + 1)) / 2 - h),
        Math.floor(TILESIZE.x),
        Math.floor(TILESIZE.y + h),
        Math.floor(this._position.x - TILESIZE.x / 2),
        Math.floor(this._position.y - h),
        Math.floor(TILESIZE.x),
        Math.floor(TILESIZE.y + h)
      );
    }
    super._draw(ctx);
  }
}

export default BaseTile;
