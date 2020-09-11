import GameObject from "../../../core/GameObject";
import { rndRng } from "../../../core/utils";
import V2 from "../../../core/V2";
import Perlin from "../../../core/Perlin";
import { Game } from "../../../main";

class Tree extends GameObject {
  public _length: number = rndRng(100, 200);
  public _size: V2;

  constructor(p) {
    super(p);

    this._size = new V2(0.75, 0.5)._scale(this._length);
    this._zgrav = 10;

    this._calcSlide = false;
  }

  _draw(ctx) {
    if (
      Game._scene._inViewport(
        V2._add(this._position, new V2(0, -this._verticalOffset - this._length / 2))
      )
    ) {
      var s =
        Perlin._simplex3(
          this._position.x / 200,
          this._position.y / 200,
          performance.now() / 2200
        ) *
        Math.PI *
        2;

      var sk = new V2(Math.cos(s), Math.sin(s))._normalize();

      ctx.s();
      ctx.lineWidth = 20;
      ctx._translate(this._position.x, this._position.y - this._verticalOffset);
      ctx._beginPath();
      ctx.moveTo(0, 0);
      ctx._lineTo(0, -this._length);
      ctx.strokeStyle = "#8b632f";
      ctx.stroke();

      ctx.s();
      ctx.globalAlpha = 0.9;
      ctx.transform(1 + sk.x / 60, sk.x / 60, sk.y / 60, 1 + sk.y / 60, 0, 0);
      ctx._fillStyle("#a6da39");
      ctx._fillRect(
        -this._size.x / 2,
        -this._length - this._size.y / 2,
        this._size.x,
        this._size.y
      );
      ctx.r();

      ctx.r();
      super._draw(ctx);
    }
  }
}

export default Tree;
