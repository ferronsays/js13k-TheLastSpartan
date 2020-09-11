import Scene from "../../core/Scene";
import { WIDTH, HEIGHT } from "../../constants";
import GameObject from "../../core/GameObject";
import Leonidus from "../entities/Leonidus";
import HUD from "../HUD";
import Spawner, { getRandomMapCoords } from "../Spawner";
import TileMap from "../TileMap";

class GameScene extends Scene {
  public _interactiveLayer: GameObject;
  public _HUD: GameObject;
  public _spawner: Spawner;

  constructor(spriteSheet) {
    super();

    setTimeout(() => {
      this._interactiveLayer = new GameObject();
      this._tileMap = new TileMap(spriteSheet, this._interactiveLayer);

      this._addChild(this._interactiveLayer);
      this._addChild(this._tileMap);

      this._player = new Leonidus(getRandomMapCoords());

      this._cam._lookat = this._player._position._copy();
      // this._cam._updateViewPort();

      this._HUD = new HUD(this._player);

      this._interactiveLayer._addChild(this._player);

      this._spawner = new Spawner();
      this._interactiveLayer._addChild(this._spawner);
    }, 10);
  }

  _addParticle(p) {
    this._interactiveLayer._addChild(p);
  }

  _update(dt) {
    this._HUD._update(dt);

    this._interactiveLayer._children = this._interactiveLayer._children.sort(
      (a, b) => b._position.y - a._position.y
    );

    if (this._player._hp === 0) {
      this._done = true;
    }

    super._update(dt);
  }

  _draw(ctx) {
    this._cam._moveTo(
      this._player._position.x,
      this._player._position.y - this._player._verticalOffset
    );

    this._cam._begin(ctx);

    super._draw(ctx);

    // this._collisions._draw(ctx)

    this._cam._end(ctx);

    this._HUD._draw(ctx);
  }
}

export default GameScene;
