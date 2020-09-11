import GameObject from "../core/GameObject";
import Perlin from "../core/Perlin";
import { Game } from "../main";
import BaseTile from "./tiles/BaseTile";
import WaterTile from "./tiles/WaterTile";
import GrassTile from "./tiles/GrassTile";
import { mapDim } from "../constants";
import V2 from "../core/V2";

var impulseDuration = 400;

var perlinOctave = (x, y, z, octaves, persistence) => {
  var total = 0;
  var frequency = 1;
  var amplitude = 1;
  var maxValue = 0; // Used for normalizing result to 0.0 - 1.0
  for (var i = 0; i < octaves; i++) {
    total +=
      Perlin._simplex3(x * frequency, y * frequency, z * frequency) * amplitude;

    maxValue += amplitude;

    amplitude *= persistence;
    frequency *= 2;
  }

  return total / maxValue;
};

class TileMap extends GameObject {
  public _map: any[] = [];
  public _impulseIsoPosition: V2;
  // public _impulseDelayCounter: number;
  public _impulseRadius: number;
  public _impulseCounter: number = 0;

  constructor(spritesheet, interactiveLayer) {
    super();

    for (var i = mapDim; i--; ) {
      var tileMapRow = [];
      for (var j = mapDim; j--; ) {
        var tile;

        var p = perlinOctave(i / 85, j / 85, Game._seed, 3, 1);

        var val = 9;

        if (p < 0) {
          val = 1; // water
        } else if (p < 0.05) {
          val = 2; // sand
        } else if (p < 0.1) {
          val = 3; // dirt
        } else if (p < 1) {
          val = 4; // grass
        }

        p = Math.abs(p);
        if (val === 0 || val === 1) {
          tile = new WaterTile(j, i, 20, spritesheet, val);
        } else if (val === 2 || val === 3) {
          tile = new BaseTile(j, i, 20 + p * 200, spritesheet, val);
        } else if (val === 4) {
          tile = new GrassTile(
            j,
            i,
            // TODO 99 -> 1 - max height of pre-rendered tiles
            Math.min(99, 20 + p * 200),
            spritesheet,
            val,
            interactiveLayer
          );
        }

        this._addChild(tile);
        tileMapRow.push(tile);
      }

      this._map.push(tileMapRow.reverse());
    }

    this._map.reverse();
  }

  _impulseAt(tileIsoPosition) {
    this._impulseIsoPosition = tileIsoPosition;
    this._impulseRadius = 1;
    this._impulseCounter = impulseDuration;
  }

  _update(dt) {
    this._impulseCounter = Math.max(this._impulseCounter - dt, 0);

    this._impulseRadius += 0.15;

    if (this._impulseIsoPosition && this._impulseRadius < 20) {
      for (var i = this._map.length; i--; ) {
        var tileMapRow = this._map[i];
        for (var j = tileMapRow.length; j--; ) {
          var tile: BaseTile = tileMapRow[j];
          // if (!waterTile(tile._tileType)) {
            var distanceImpulseCenterToTile = Math.sqrt(
              Math.pow(this._impulseIsoPosition.x - tile._isoPosition.x, 2) +
                Math.pow(this._impulseIsoPosition.y - tile._isoPosition.y, 2)
            );

            var diffRadiusToDistance = Math.abs(
              this._impulseRadius - distanceImpulseCenterToTile
            );

            var maxEffectDistance = 1;

            tile._height =
              diffRadiusToDistance < 1
                ? Math.min(
                    119,
                    tile._baseHeight +
                      40 *
                        (1 - diffRadiusToDistance / maxEffectDistance) *
                        (this._impulseCounter / impulseDuration)
                  )
                : tile._baseHeight;
          // }
        }
      }
    }

    super._update(dt);
  }
}

export default TileMap;
