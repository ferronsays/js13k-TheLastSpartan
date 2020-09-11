import GameNode from "../core/GameNode";
import Athenian from "./entities/enemies/Athenian";
import V2 from "../core/V2";
import { Game } from "../main";
import { rndRng, walkTile, i2c, waterTile } from "../core/utils";
import Giant from "./entities/enemies/Giant";
import Hoplite from "./entities/Hoplite";
import { mapDim } from "../constants";

export var getRandomMapCoords = () => {
  var map = Game._scene._tileMap._map;
  while (true) {
    // TODO these are set sizes that dont need the lookup
    var y = rndRng(0, mapDim - 1);
    var x = rndRng(0, mapDim - 1);
    var tileType = map[y][x]._tileType;

    var pt = i2c(new V2(x, y));
    if (walkTile(tileType) && !waterTile(tileType) && !Game._scene._inViewport(pt)) {
      return pt;
    }
  }
};

class Spawner extends GameNode {
  public _totalSpawned : number = 0;
  public _maxEntitiesAtOnce: number = 40;
  public _spawnDelay: number = 2000;
  public _spawnDelayCounter: number = 0;

  public _entities: Hoplite[] = [];

  _update(dt) {
    this._entities = this._entities.filter((e) => e._active);

    if (this._spawnDelayCounter >= this._spawnDelay) {
      this._spawnDelayCounter = 0;
      var l = this._entities.length;
      if (l < this._maxEntitiesAtOnce) {
        this._totalSpawned++;
        if (this._totalSpawned && this._totalSpawned % 10 === 0) {
          // spawn a big guy
          this._spawn(true);
        } else {
          this._spawn();
        }
      }
    }
    this._spawnDelayCounter += dt;
  }

  _spawn(big?) {
    this._spawnDelay = Math.max(1000, this._spawnDelay - 10);
    var p = getRandomMapCoords();
    var ent = big ?  new Giant(p) : new Athenian(p);
    this._parent._addChild(ent);
    this._entities.push(ent);
  }

  // randomSpawnCoords() {
  //   while(true) {
  //     var p = this.getRandomMapCoords();

  //     if (meetsCondition) {
  //       return p;
  //     }
  //   }
  // }
}

export default Spawner;
