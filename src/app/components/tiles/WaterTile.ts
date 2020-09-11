import BaseTile from "./BaseTile";
import Perlin from "../../core/Perlin";
import { Game } from "../../main";

class WaterTile extends BaseTile {
  _update(dt) {
    if (Game._scene._inViewport(this._position)) {
      this._height =
        Math.abs(
          Perlin._simplex3(
            this._position.x / 300,
            this._position.y / 300,
            performance.now() / 2600
          )
        ) * 30;

      this._tileType = this._height > 16 ? 1 : 0;
    }
  }
}

export default WaterTile;
