import BodyPart from "./BodyPart";
import Emitter from "../../core/Emitter";
import V2 from "../../core/V2";

class HopliteHead extends BodyPart {
  public _headdress: boolean;

  constructor(p, size, headdress) {
    super(p, size);

    this._headdress = headdress;
  }

  _bleed() {
    var bleeder = new Emitter();
    Object.assign(bleeder, {
      _position: new V2(0, this._size.y/2),
      _rotation: Math.PI / 2,
      _addToScene: true,
      _color: "#db0000",
      _maxParticles: 24,
      _size: 12,
      _particleLifetime: 2600,
      _particleLifetimeVariance: 800,
      _speed: 0.2,
      _speedVariance: 0.1,
      _rVariance: 0.5,
      _duration: 3200,
    });

    this._addChild(bleeder);
  }

  // @ts-ignore
  _draw(ctx, offsets = { _position: new V2(), r: 0 }, colorOverride) {
    super._draw(ctx);

    ctx.s();
    ctx._translate(
      this._position.x + offsets._position.x,
      this._position.y + offsets._position.y - this._verticalOffset
    );
    this._shouldRenderShadow && this._renderShadow(ctx);
    ctx.rotate(offsets.r + this._rotation);
    if (this._headdress) {
      ctx._fillStyle(colorOverride || "#900");
      ctx._fillRect(
        -this._size.x * 0.7,
        -this._size.y * 0.7,
        this._size.x * 0.8,
        this._size.y
      );
    }

    ctx._fillStyle(colorOverride || "#fbca03");
    ctx._fillRect(
      -this._size.x / 2,
      -this._size.y / 2,
      this._size.x,
      this._size.y
    );

    ctx._beginPath();
    ctx.strokeStyle = colorOverride || "#222";
    ctx.lineWidth = 2;
    ctx.moveTo(0, 0);
    ctx._lineTo(this._size.x / 2, 0);
    ctx.stroke();
    ctx.moveTo(this._size.x / 3, 0);
    ctx._lineTo(this._size.x / 3, this._size.y / 2);
    ctx.stroke();
    ctx.r();
  }
}

export default HopliteHead;
