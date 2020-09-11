import BodyPart from "./BodyPart";
import V2 from "../../core/V2";

class Sword extends BodyPart {
  // @ts-ignore
  _draw(ctx, offsets = { _position: new V2(), r: 0 }, colorOverride, tileIsWater = false) {
    ctx.s();
    ctx.lineWidth = 1;
    ctx.globalAlpha = this._opacity;
    ctx._translate(
      this._position.x + offsets._position.x,
      this._position.y +
        offsets._position.y -
        this._verticalOffset -
        (tileIsWater ? 6 : 0)
    );
    this._shouldRenderShadow && this._renderShadow(ctx);
    ctx.rotate(offsets.r + this._rotation);
    // hilt
    ctx._fillStyle(colorOverride || "#963");
    ctx._fillRect(-6, -1, 6, 2);
    // blade
    ctx.lineWidth = 2;
    // TODO change this color
    ctx._fillStyle(colorOverride || "#d8d8d8");
    ctx._fillRect(0, -2, this._size.x - 6, this._size.y);
    ctx.r();
  }
}

export default Sword;
