import V2 from "../../core/V2";
import Grass from "../entities/veg/Grass";
import BaseTile from "./BaseTile";
import { i2c } from "../../core/utils";
import Perlin from "../../core/Perlin";
import { Game } from "../../main";
import Tree from "../entities/veg/Tree";

class GrassTile extends BaseTile {
  constructor(isox, isoy, height, spriteSheet, tileType, parent) {
    super(isox, isoy, height, spriteSheet, tileType);

    var g = Math.abs(Perlin._simplex3(isox / 10, isoy / 10, Game._seed));

    if (g > 0.94) {
      var pt = i2c(new V2(isox+ Math.random(), isoy+ Math.random()));
      parent._addChild(new Tree(pt));
    } else if (g > 0.5) {
      var c = ~~(((g - 0.5) / .45) * 8);
      for (var i = 0; i < c; i++) {
        var pt = i2c(
          new V2(isox + Math.random(), isoy + Math.random())
        );
        parent._addChild(new Grass(pt));
      }
    }
  }
}

export default GrassTile;
