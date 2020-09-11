import Scene from "../../core/Scene";
import V2 from "../../core/V2";
import Leonidus from "../entities/Leonidus";

class TitleScene extends Scene {
  constructor() {
    super();

    this._cam._lookat = new V2(24, -22);
    this._cam._targetDistance = this._cam._distance = 106;

    // TODO scene doesn't exist yet but needs to on the gameinstacne for some
    // of this to function. fix this
    setTimeout(() => {
      this._player = new Leonidus(new V2());

      this._addChild(this._player);
    }, 0);
  }

  _draw(ctx) {
    this._cam._begin(ctx);

    super._draw(ctx);

    this._cam._end(ctx);
  }
}

export default TitleScene;
