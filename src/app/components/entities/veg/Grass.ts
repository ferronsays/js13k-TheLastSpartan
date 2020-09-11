import GameObject from "../../../core/GameObject";
import { rndRng, rndInArray } from "../../../core/utils";
import V2 from "../../../core/V2";
import Perlin from "../../../core/Perlin";
import { CollisionRect } from "../../../core/SimpleCollision/index";
import { Game } from "../../../main";
import { sfx } from "../../../sounds";
import Emitter from "../../../core/Emitter";

var colors = ["#e3fd98", "#d9f669", "#d4ee4b", "#beea41", "#a9ce21"];

class Grass extends GameObject {
  public _rotationVariance: number = 0;
  public _length: number = rndRng(24, 38);
  public _color: string = rndInArray(colors);

  constructor(p) {
    super(p);

    this._rotation = -Math.PI / 2;
    this._rotationVariance = 0;

    this._hitBox = new CollisionRect(
      this,
      new V2(-10, -this._length),
      20,
      this._length,
      null,
      true
    );

    this._calcSlide = false;
    this._zgrav = 10;
  }

  _hitBy() {
    sfx([
      0.3,
      1,
      300,
      0.04,
      ,
      0.08,
      2,
      2.6,
      -26,
      ,
      -222,
      0.02,
      ,
      ,
      -6,
      0.1,
      ,
      0.47,
      0.03,
    ]);

    var hitParticles = new Emitter();
    Object.assign(hitParticles, {
      _addToScene: true,
      _color: this._color,
      _zv: 1,
      _zvVariance: 0.5,
      _maxParticles: 1,
      _size: 14,
      _particleLifetime: 1200,
      _particleLifetimeVariance: 200,
      _speed: 0.4,
      _speedVariance: 0.2,
      _rVariance: Math.PI*2,
      _duration: 0,
      _zgrav: 0.02,
    });

    this._addChild(hitParticles);
    setTimeout(() => {
      this._destroy();
    }, 10);
  }

  _update(dt) {
    if (
      Game._scene._inViewport(
        V2._add(this._position, new V2(0, -this._verticalOffset - this._length))
      )
    ) {
      this._rotationVariance =
        Perlin._simplex3(
          this._position.x / 200,
          this._position.y / 200,
          performance.now() / 2200
        ) * 0.5;

      super._update(dt);
    }
  }

  _draw(ctx) {
    if (
      Game._scene._inViewport(V2._add(this._position, new V2(0, -this._verticalOffset)))
    ) {
      ctx.s();
      ctx.lineWidth = 10;
      ctx._translate(this._position.x, this._position.y - this._verticalOffset);
      ctx._beginPath();
      ctx.moveTo(0, 0);
      var v = new V2(
        Math.cos(this._rotation + this._rotationVariance),
        Math.sin(this._rotation + this._rotationVariance)
      )
        ._normalize()
        ._scale(this._length);
      ctx._lineTo(v.x, v.y);
      ctx.strokeStyle = this._color;
      ctx.stroke();
      ctx.r();

      super._draw(ctx);
    }
  }
}

export default Grass;
