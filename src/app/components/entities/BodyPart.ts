import GameObject from "../../core/GameObject";
import V2 from "../../core/V2";

class BodyPart extends GameObject {
  public _size: V2;
  public _shouldRenderShadow: boolean = false;

  constructor(p, size) {
    super(p);
    this._size = size;
    this._calcSlide = false;
  }

  _update(dt) {
    if (this._z === 0) {
      this._v._reset();
      this._shouldRenderShadow = false;
    }

    var timeLeft = this._lifeSpan - this._age;
    if (this._lifeSpan !== -1 && timeLeft < this._lifeSpan * 0.1) {
      this._opacity = timeLeft / (this._lifeSpan * 0.1);
    }

    super._update(dt);
  }

  _renderShadow(ctx) {
    ctx._fillStyle("rgba(0,0,0,0.5");
    ctx._fillRect(
      -this._size.x * 0.4,
      this._z,
      this._size.x * 0.8,
      this._size.y / 2
    );
  }
}

export default BodyPart;
