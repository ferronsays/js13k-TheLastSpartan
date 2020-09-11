import GameObject from "./GameObject";

class Particle extends GameObject {
  public _size: number;
  public _deltaSize: number;
  public _color: number;
  
  constructor(p, z, zv, _v, size, deltaSize, lifeSpan, color) {
    super(p);

    this._z = z;
    this._zv = zv;
    this._v = _v;
    this._size = size;
    this._deltaSize = deltaSize;
    this._lifeSpan = lifeSpan;
    this._color = color;

    this._setYOff();
  }

  _update(dt) {
    super._update(dt);

    this._size += this._deltaSize * dt;
  }

  _draw(ctx) {
    ctx._fillStyle("rgba(0,0,0,0.5");
    ctx._fillRect(
      this._position.x - this._size / 4,
      this._position.y + this._size / 4 - this._tileYOffset,
      this._size / 2,
      this._size / 2
    );
    
    ctx._fillStyle(this._color);
    ctx._fillRect(
      this._position.x - this._size / 2,
      this._position.y - this._size / 2 - this._verticalOffset,
      this._size,
      this._size
    );

    super._draw(ctx);
  }
}

export default Particle;
